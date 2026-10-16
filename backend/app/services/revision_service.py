import json
from datetime import date, timedelta
from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.db_models import RevisionSchedule, SyncedDsaStats, CsTopic

# Spaced Repetition Intervals in days: stage 1 -> 1d, 2 -> 3d, 3 -> 7d, 4 -> 14d, 5 -> 30d
INTERVALS = [1, 3, 7, 14, 30]

def schedule_next(revision: RevisionSchedule, performance: str) -> RevisionSchedule:
    """
    Recalculates the next spaced repetition revision date based on user recall rating:
    - 'easy': advance 2 stages (cap at 5)
    - 'good': advance 1 stage (cap at 5)
    - 'hard': remain at current stage
    - 'forgot': reset back to stage 1
    """
    perf = performance.lower().strip()
    current_stage = revision.interval_stage or 1

    if perf == "easy":
        new_stage = min(len(INTERVALS), current_stage + 2)
    elif perf == "good":
        new_stage = min(len(INTERVALS), current_stage + 1)
    elif perf == "hard":
        new_stage = current_stage
    elif perf == "forgot":
        new_stage = 1
    else:
        new_stage = current_stage

    revision.interval_stage = new_stage
    revision.last_performance = perf
    days_to_add = INTERVALS[new_stage - 1]
    revision.next_revision_date = date.today() + timedelta(days=days_to_add)

    return revision


def get_due_revisions(db: Session, user_id: int) -> List[RevisionSchedule]:
    """Retrieve all topics where next_revision_date is on or before today."""
    today = date.today()
    return db.query(RevisionSchedule).filter(
        RevisionSchedule.user_id == user_id,
        RevisionSchedule.next_revision_date <= today
    ).order_by(RevisionSchedule.next_revision_date.asc()).all()


def auto_flag_weak_topics(db: Session, user_id: int, dsa_stats: Optional[SyncedDsaStats]):
    """
    Automatically creates/maintains revision schedule items for weak DSA topics or core CS topics.
    """
    today = date.today()
    PRIORITY_DSA_TOPICS = [
        "Dynamic Programming",
        "Graph",
        "Tree",
        "Binary Search",
        "Trie",
        "Heap (Priority Queue)"
    ]

    topic_counts = {}
    if dsa_stats and dsa_stats.topic_counts_json:
        try:
            topic_counts = json.loads(dsa_stats.topic_counts_json)
        except Exception:
            topic_counts = {}

    for dsa_topic in PRIORITY_DSA_TOPICS:
        solved = 0
        for k, v in topic_counts.items():
            if dsa_topic.lower() in k.lower():
                solved += v

        # If less than 5 solved, auto-flag into revision schedule if not already present
        if solved < 5:
            existing = db.query(RevisionSchedule).filter(
                RevisionSchedule.user_id == user_id,
                RevisionSchedule.topic_name == dsa_topic,
                RevisionSchedule.category == "DSA"
            ).first()

            if not existing:
                rev = RevisionSchedule(
                    user_id=user_id,
                    topic_name=dsa_topic,
                    category="DSA",
                    interval_stage=1,
                    next_revision_date=today,
                    last_performance="Urgent Auto-Flag"
                )
                db.add(rev)

    # Check unstarted CS topics
    unstarted_cs = db.query(CsTopic).filter(
        CsTopic.user_id == user_id,
        CsTopic.status == "not_started"
    ).limit(3).all()

    for cs in unstarted_cs:
        item_name = f"{cs.subject_name}: {cs.topic_name}"
        existing = db.query(RevisionSchedule).filter(
            RevisionSchedule.user_id == user_id,
            RevisionSchedule.topic_name == item_name
        ).first()

        if not existing:
            rev = RevisionSchedule(
                user_id=user_id,
                topic_name=item_name,
                category=cs.subject_name,
                interval_stage=1,
                next_revision_date=today,
                last_performance="Core CS Gap"
            )
            db.add(rev)

    db.commit()
