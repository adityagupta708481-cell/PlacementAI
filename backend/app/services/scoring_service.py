import json
import math
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
from app.models.db_models import SyncedDsaStats, CsTopic, AptitudeMetric

def normalize_dsa_index(dsa_stats: Optional[SyncedDsaStats]) -> float:
    """
    Computes normalized DSA index (0..100) combining solved volume, difficulty weighting,
    contest rating, and recency factor.
    """
    if not dsa_stats or dsa_stats.total_solved == 0:
        return 0.0

    easy = dsa_stats.easy_solved or 0
    medium = dsa_stats.medium_solved or 0
    hard = dsa_stats.hard_solved or 0

    # Difficulty weighting: Hard (6x) > Medium (3x) > Easy (1x)
    weighted_solves = (easy * 1.0) + (medium * 3.0) + (hard * 6.0)
    
    # 450 weighted points is the target benchmark for campus placement excellence
    volume_score = min(100.0, (weighted_solves / 450.0) * 100.0)

    # Contest rating factor (1200 base, 2000 target expert)
    rating = dsa_stats.contest_rating or 0.0
    if rating > 0:
        rating_score = min(100.0, max(10.0, (rating - 1000.0) / (2000.0 - 1000.0) * 100.0))
        base_dsa = (0.75 * volume_score) + (0.25 * rating_score)
    else:
        base_dsa = volume_score

    # Recency decay check from recent_submissions
    days_since_last_solve = 0
    if dsa_stats.recent_submissions_json:
        try:
            subs = json.loads(dsa_stats.recent_submissions_json)
            if subs and len(subs) > 0:
                first_sub = subs[0]
                ts = first_sub.get("timestamp") or first_sub.get("creationTimeSeconds")
                if ts:
                    last_date = datetime.utcfromtimestamp(float(ts))
                    days_since_last_solve = (datetime.utcnow() - last_date).days
        except Exception:
            days_since_last_solve = 0

    recency_factor = 1.0
    if days_since_last_solve > 21:
        # Exponential decay factor after 21 inactive days
        decay_days = days_since_last_solve - 21
        recency_factor = max(0.65, math.exp(-decay_days / 45.0))

    final_score = base_dsa * recency_factor
    return round(min(100.0, max(0.0, final_score)), 1)


def cs_mastery_score(cs_topics: List[CsTopic]) -> float:
    """Calculate percentage mastery of CS fundamental topics (0..100)."""
    if not cs_topics:
        return 0.0

    status_weights = {
        "not_started": 0.0,
        "in_progress": 40.0,
        "revised": 75.0,
        "mastered": 100.0
    }

    total_pts = sum(status_weights.get(t.status.lower(), 0.0) for t in cs_topics)
    avg_score = total_pts / len(cs_topics)
    return round(min(100.0, max(0.0, avg_score)), 1)


def aptitude_score(aptitude_metrics: List[AptitudeMetric]) -> float:
    """Calculate overall accuracy percentage in aptitude tests (0..100)."""
    if not aptitude_metrics:
        return 50.0  # neutral baseline

    total_attempted = sum(m.attempted for m in aptitude_metrics)
    total_correct = sum(m.correct for m in aptitude_metrics)

    if total_attempted == 0:
        return 50.0

    acc = (total_correct / total_attempted) * 100.0
    return round(min(100.0, max(0.0, acc)), 1)


def composite_readiness(
    dsa_index: float,
    semantic_match: float,
    cs_score: float,
    apt_score: float,
    interview_score: float = 65.0
) -> float:
    """
    Locked-in composite placement readiness formula:
    AI_Readiness_Score =
        0.40 * Normalized_DSA_Index
      + 0.25 * HF_Semantic_Company_Match_Score
      + 0.15 * CS_Fundamentals_Mastery_Score
      + 0.10 * Aptitude_Accuracy_Score
      + 0.10 * Interview_Readiness_Score
    """
    score = (
        (0.40 * dsa_index) +
        (0.25 * semantic_match) +
        (0.15 * cs_score) +
        (0.10 * apt_score) +
        (0.10 * interview_score)
    )
    return round(min(100.0, max(0.0, score)), 1)


def weak_area_detection(
    dsa_stats: Optional[SyncedDsaStats],
    cs_topics: List[CsTopic]
) -> List[Dict[str, Any]]:
    """
    Identifies weak areas using:
    Priority = (100 - Proficiency) * Topic_Weight * Recency_Decay_Factor
    Flags topics with 0 solved in last 21 days as 'Urgent'.
    """
    HIGH_WEIGHT_DSA = {
        "Dynamic Programming": 1.5,
        "Graph": 1.5,
        "Tree": 1.5,
        "Binary Search": 1.4,
        "Heap (Priority Queue)": 1.3,
        "Trie": 1.3,
        "Backtracking": 1.2,
        "Sliding Window": 1.2
    }

    topic_counts = {}
    if dsa_stats and dsa_stats.topic_counts_json:
        try:
            topic_counts = json.loads(dsa_stats.topic_counts_json)
        except Exception:
            topic_counts = {}

    weak_areas: List[Dict[str, Any]] = []

    # 1. Evaluate Core DSA Topics
    standard_expected = 15  # benchmark solve count per key topic
    for topic, weight in HIGH_WEIGHT_DSA.items():
        # Match case-insensitive or partial
        solved = 0
        for k, v in topic_counts.items():
            if topic.lower() in k.lower() or k.lower() in topic.lower():
                solved += v

        proficiency = min(100.0, (solved / standard_expected) * 100.0)
        
        # Check recency
        days_inactive = 25  # default if not found
        if solved == 0:
            recency_decay = 1.5
            urgency = "Urgent"
        elif solved < 5:
            recency_decay = 1.3
            urgency = "Urgent"
        elif proficiency < 60:
            recency_decay = 1.1
            urgency = "Moderate"
        else:
            recency_decay = 0.8
            urgency = "Low"

        priority = (100.0 - proficiency) * weight * recency_decay

        weak_areas.append({
            "topic": topic,
            "category": "DSA",
            "proficiency": round(proficiency, 1),
            "priority": round(priority, 1),
            "urgency": urgency,
            "solved_count": solved,
            "reason": f"Solved {solved}/{standard_expected} problems. High-frequency Tier-1 target topic."
        })

    # 2. Evaluate CS Fundamentals Topics
    for cs in cs_topics:
        if cs.status in ["not_started", "in_progress"]:
            proficiency = 0.0 if cs.status == "not_started" else 40.0
            urgency = "Urgent" if cs.status == "not_started" else "Moderate"
            priority = (100.0 - proficiency) * 1.25 * 1.1

            weak_areas.append({
                "topic": f"{cs.subject_name}: {cs.topic_name}",
                "category": cs.subject_name,
                "proficiency": round(proficiency, 1),
                "priority": round(priority, 1),
                "urgency": urgency,
                "solved_count": 0,
                "reason": f"Status is '{cs.status}'. Essential for technical interview rounds."
            })

    # Sort descending by priority
    weak_areas.sort(key=lambda x: x["priority"], reverse=True)
    return weak_areas[:8]  # top 8 prioritized focus areas


def generate_action_plan(weak_areas: List[Dict[str, Any]], tier: str) -> str:
    """Generate an explainable, structured 7-day preparation roadmap."""
    top_topics = [w["topic"] for w in weak_areas[:3]] if weak_areas else ["Dynamic Programming", "Trees", "DBMS Transactions"]
    top_str = ", ".join(top_topics)

    plan = f"""# 7-Day Personalized Preparation Roadmap
**Current Hireability Tier:** {tier}  
**Primary Focus Areas:** {top_str}

---

### Day 1 & Day 2: High-Priority Algorithmic Focus
- **Topic:** `{top_topics[0] if len(top_topics) > 0 else 'Dynamic Programming'}`
- Solve 3 Medium-difficulty LeetCode problems. Focus on optimal state space and time complexity.
- Dry-run boundary conditions (empty inputs, single elements, negative values).
- Review top interview patterns (Top-Down Memoization vs Bottom-Up Tabulation).

### Day 3: Secondary DSA & Tree/Graph Traversal
- **Topic:** `{top_topics[1] if len(top_topics) > 1 else 'Binary Search Trees & Graphs'}`
- Practice 2 BFS/DFS traversal problems or recursive tree reconstructions.
- Focus on edge-case handling (cycles, disconnected components).

### Day 4: Core CS Fundamentals Deep Dive
- **Subject:** `{top_topics[2] if len(top_topics) > 2 else 'Operating Systems & DBMS'}`
- Revise ACID properties, indexing data structures (B+ Trees), and SQL Join optimizations.
- Practice explaining Virtual Memory and Deadlock Banker's algorithm out loud.

### Day 5: Quantitative & Logical Aptitude Sprint
- Complete 25 timed aptitude questions (Time & Work, Permutations, Probability, Syllogisms).
- Target speed: under 75 seconds per question with >85% accuracy.

### Day 6: Mock Interview & System/Object-Oriented Design
- Run through 3 behavioral and 2 technical interview prompts in the AI Interview Module.
- Refine STAR-method stories for your academic and GitHub projects.

### Day 7: Weekly Revision & Synchronization
- Revisit flagged spaced-repetition topics in the Revision Schedule.
- Click **Sync All Now** on the dashboard to recalculate your updated AI Placement Readiness Index!
"""
    return plan
