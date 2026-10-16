import os
import json
import logging
import numpy as np
from typing import Dict, Any, List, Tuple, Optional
from app.core.config import settings

logger = logging.getLogger(__name__)

# Singletons for lazy loading
_embedding_model = None
_zero_shot_pipeline = None
_model_load_attempted = False

CANDIDATE_LABELS = [
    "Strong candidate ready for Tier-1 Product and Systems Engineering roles",
    "Solid candidate suitable for Tech Startups and Mid-Tier Product firms",
    "Eligible candidate ready for Large Enterprise and IT Consulting drives",
    "Underprepared candidate needing urgent foundational practice"
]

INTERVIEW_REFERENCE_ANSWERS = {
    "acid": {
        "keywords": ["atomicity", "consistency", "isolation", "durability", "transaction", "rollback", "commit"],
        "summary": "ACID properties ensure reliable database transactions: Atomicity (all or nothing), Consistency (preserves database rules and integrity), Isolation (concurrent transactions execute independently without interference), and Durability (committed changes persist even during crashes)."
    },
    "deadlock": {
        "keywords": ["mutual exclusion", "hold and wait", "no preemption", "circular wait", "resource allocation", "banker"],
        "summary": "A deadlock occurs when a set of concurrent processes are permanently blocked because each process holds a resource while waiting for another resource held by another process. The four Coffman conditions are Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait."
    },
    "indexing": {
        "keywords": ["b-tree", "b+ tree", "binary search", "lookup", "disk i/o", "hash index", "clustered"],
        "summary": "Database indexing creates balanced search tree structures (like B+ Trees) on table columns to drastically reduce disk I/O operations from full table scans O(N) to logarithmic lookups O(log N)."
    },
    "virtual_memory": {
        "keywords": ["paging", "page table", "mmu", "tlb", "swap space", "page fault", "segmentation"],
        "summary": "Virtual memory is a memory management capability of the OS that abstracts secondary storage as secondary RAM using page tables and the Memory Management Unit (MMU), allowing programs larger than physical memory to execute smoothly."
    },
    "tcp_udp": {
        "keywords": ["connection-oriented", "three-way handshake", "reliable", "checksum", "flow control", "packet loss", "low latency"],
        "summary": "TCP is connection-oriented and reliable with 3-way handshakes, sequence numbers, and retransmissions. UDP is connectionless and lightweight with lower latency, suitable for streaming and gaming."
    },
    "solid": {
        "keywords": ["single responsibility", "open closed", "liskov", "interface segregation", "dependency inversion"],
        "summary": "SOLID represents five object-oriented design principles: Single Responsibility, Open-Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion, promoting maintainable and decoupled code."
    }
}

def get_embedding_model():
    """Lazy load the sentence-transformers embedding model."""
    global _embedding_model
    if _embedding_model is not None:
        return _embedding_model

    if settings.HF_OFFLINE_FALLBACK and os.environ.get("FORCE_OFFLINE") == "true":
        return None

    try:
        from sentence_transformers import SentenceTransformer
        logger.info(f"Loading Hugging Face embedding model: {settings.HF_MODEL_EMBEDDING}...")
        _embedding_model = SentenceTransformer(settings.HF_MODEL_EMBEDDING)
        logger.info("SentenceTransformer model loaded successfully.")
        return _embedding_model
    except Exception as e:
        logger.warning(f"Could not load Hugging Face SentenceTransformer ({e}). Falling back to heuristic/TF-IDF.")
        return None


def get_zero_shot_pipeline():
    """Lazy load the zero-shot classification pipeline."""
    global _zero_shot_pipeline
    if _zero_shot_pipeline is not None:
        return _zero_shot_pipeline

    if settings.HF_OFFLINE_FALLBACK and os.environ.get("FORCE_OFFLINE") == "true":
        return None

    try:
        from transformers import pipeline
        # Use lightweight model if configured or fallback
        model_name = settings.HF_MODEL_ZEROSHOT
        logger.info(f"Loading Hugging Face Zero-Shot pipeline: {model_name}...")
        _zero_shot_pipeline = pipeline("zero-shot-classification", model=model_name)
        logger.info("Zero-Shot classification pipeline loaded successfully.")
        return _zero_shot_pipeline
    except Exception as e:
        logger.warning(f"Could not load Hugging Face Zero-Shot pipeline ({e}). Falling back to heuristic classifier.")
        return None


def build_student_text(
    user_name: str,
    college: Optional[str],
    branch: Optional[str],
    dsa_total: int,
    dsa_easy: int,
    dsa_medium: int,
    dsa_hard: int,
    contest_rating: float,
    topics: Dict[str, int],
    cs_topics: List[Dict[str, str]],
    aptitude_acc: float,
    github_repos: int = 0,
    github_languages: Optional[Dict[str, int]] = None
) -> str:
    """Synthesizes a structured natural language profile representation of the student."""
    top_topics = sorted(topics.items(), key=lambda x: x[1], reverse=True)[:6]
    topic_str = ", ".join([f"{k} ({v} solved)" for k, v in top_topics]) if top_topics else "Basic Array/String problems"

    mastered_cs = [c["topic_name"] for c in cs_topics if c.get("status") in ["mastered", "revised"]]
    cs_str = ", ".join(mastered_cs) if mastered_cs else "Foundational CS in progress"

    langs = ", ".join(github_languages.keys()) if github_languages else "Python, C++, Java"

    text = (
        f"Candidate: {user_name}, Degree: B.Tech {branch or 'CSE'}, Institution: {college or 'Engineering College'}. "
        f"Algorithmic Data Structures: Total {dsa_total} problems solved ({dsa_easy} Easy, {dsa_medium} Medium, {dsa_hard} Hard). "
        f"Contest Rating: {contest_rating}. Core Algorithmic Domains: {topic_str}. "
        f"Core Computer Science Knowledge: {cs_str}. "
        f"Aptitude and Reasoning Accuracy: {aptitude_acc}%. "
        f"Software Development Experience: {github_repos} public repositories in {langs}."
    )
    return text


def semantic_company_match(student_text: str, company_jd_text: str) -> Tuple[float, bool]:
    """
    Computes semantic similarity (0..100) between student profile and target company JD.
    Returns (score, is_fallback).
    """
    model = get_embedding_model()
    if model is not None:
        try:
            embeddings = model.encode([student_text, company_jd_text])
            emb1 = embeddings[0]
            emb2 = embeddings[1]
            norm1 = np.linalg.norm(emb1)
            norm2 = np.linalg.norm(emb2)
            if norm1 > 0 and norm2 > 0:
                sim = float(np.dot(emb1, emb2) / (norm1 * norm2))
                # Scale cosine similarity (-1..1, typically 0.2..0.85 in NLP) into realistic 0..100 range
                scaled_score = min(100.0, max(0.0, ((sim + 0.1) / 0.9) * 100.0))
                return round(scaled_score, 1), False
        except Exception as e:
            logger.warning(f"Error during HF embedding inference: {e}")

    # Fallback: TF-IDF / Jaccard token overlap
    student_words = set(student_text.lower().replace(",", " ").replace(".", " ").split())
    jd_words = set(company_jd_text.lower().replace(",", " ").replace(".", " ").split())

    intersection = student_words.intersection(jd_words)
    union = student_words.union(jd_words)
    jaccard = len(intersection) / len(union) if union else 0.0
    fallback_score = min(100.0, max(25.0, (jaccard * 250.0) + 35.0))
    return round(fallback_score, 1), True


def hireability_tier(
    student_text: str,
    dsa_score: float,
    cs_score: float,
    apt_score: float
) -> Tuple[str, Dict[str, float], bool]:
    """
    Classifies candidate into one of the 4 placement tiers.
    Returns (tier_label, probabilities_dict, is_fallback).
    """
    pipe = get_zero_shot_pipeline()
    if pipe is not None:
        try:
            res = pipe(student_text, candidate_labels=CANDIDATE_LABELS)
            labels = res["labels"]
            scores = res["scores"]
            top_label = labels[0]
            prob_dict = {label: round(score, 3) for label, score in zip(labels, scores)}
            return top_label, prob_dict, False
        except Exception as e:
            logger.warning(f"Error during HF zero-shot inference: {e}")

    # Fallback deterministic rule-based classifier
    composite_heuristic = (0.50 * dsa_score) + (0.30 * cs_score) + (0.20 * apt_score)
    if composite_heuristic >= 72.0:
        top_label = CANDIDATE_LABELS[0]
        prob_dict = {CANDIDATE_LABELS[0]: 0.82, CANDIDATE_LABELS[1]: 0.14, CANDIDATE_LABELS[2]: 0.03, CANDIDATE_LABELS[3]: 0.01}
    elif composite_heuristic >= 52.0:
        top_label = CANDIDATE_LABELS[1]
        prob_dict = {CANDIDATE_LABELS[0]: 0.12, CANDIDATE_LABELS[1]: 0.73, CANDIDATE_LABELS[2]: 0.12, CANDIDATE_LABELS[3]: 0.03}
    elif composite_heuristic >= 32.0:
        top_label = CANDIDATE_LABELS[2]
        prob_dict = {CANDIDATE_LABELS[0]: 0.03, CANDIDATE_LABELS[1]: 0.15, CANDIDATE_LABELS[2]: 0.72, CANDIDATE_LABELS[3]: 0.10}
    else:
        top_label = CANDIDATE_LABELS[3]
        prob_dict = {CANDIDATE_LABELS[0]: 0.01, CANDIDATE_LABELS[1]: 0.04, CANDIDATE_LABELS[2]: 0.20, CANDIDATE_LABELS[3]: 0.75}

    return top_label, prob_dict, True


def interview_eval(question: str, student_answer: str) -> Dict[str, Any]:
    """
    Evaluates student technical interview answers against ideal standard explanations.
    Calculates relevance score and highlights missing core terminology.
    """
    q_lower = question.lower()
    best_match_key = None
    for key in INTERVIEW_REFERENCE_ANSWERS.keys():
        if key in q_lower or any(kw in q_lower for kw in INTERVIEW_REFERENCE_ANSWERS[key]["keywords"][:3]):
            best_match_key = key
            break

    ref_info = INTERVIEW_REFERENCE_ANSWERS.get(best_match_key, {
        "keywords": ["algorithm", "complexity", "efficiency", "structure"],
        "summary": question
    })

    keywords = ref_info["keywords"]
    found_keywords = [kw for kw in keywords if kw in student_answer.lower()]
    missing_keywords = [kw for kw in keywords if kw not in student_answer.lower()]

    keyword_coverage = (len(found_keywords) / len(keywords)) if keywords else 0.5

    # Semantic similarity
    model = get_embedding_model()
    model_used = "HuggingFace all-MiniLM-L6-v2"
    if model is not None:
        try:
            emb = model.encode([ref_info["summary"], student_answer])
            sim = float(np.dot(emb[0], emb[1]) / (np.linalg.norm(emb[0]) * np.linalg.norm(emb[1])))
            raw_score = max(0.0, sim * 100.0)
            final_relevance = (0.65 * raw_score) + (0.35 * (keyword_coverage * 100.0))
        except Exception:
            model_used = "Heuristic Rule-Engine"
            final_relevance = (keyword_coverage * 70.0) + (min(len(student_answer.split()) / 40.0, 1.0) * 30.0)
    else:
        model_used = "Heuristic Keyword Engine"
        length_bonus = min(len(student_answer.split()) / 35.0, 1.0) * 25.0
        final_relevance = (keyword_coverage * 75.0) + length_bonus

    final_score = round(min(100.0, max(15.0, final_relevance)), 1)

    if final_score >= 80:
        feedback = "Exceptional response! Your explanation covers critical architectural concepts and precise technical terminology."
    elif final_score >= 60:
        feedback = "Good answer with solid foundation. Consider elaborating on the highlighted technical keywords for stronger technical impact."
    else:
        feedback = "Needs improvement. Your explanation missed several fundamental concepts and keywords expected in campus placement interviews."

    return {
        "question": question,
        "relevance_score": final_score,
        "feedback": feedback,
        "missing_keywords": missing_keywords,
        "model_used": model_used
    }
