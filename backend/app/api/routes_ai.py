import os
import json
import logging
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.db_models import User, SyncedDsaStats, CsTopic, AptitudeMetric, AiEvaluation, PlatformConnection
from app.schemas.pydantic_schemas import (
    AiEvaluationResponse, CompanyMatchRequest, CompanyMatchResponse,
    InterviewEvalRequest, InterviewEvalResponse
)
from app.services.scoring_service import (
    normalize_dsa_index, cs_mastery_score, aptitude_score,
    composite_readiness, weak_area_detection, generate_action_plan
)
from app.services.huggingface_service import (
    build_student_text, semantic_company_match, hireability_tier, interview_eval
)

logger = logging.getLogger(__name__)
router = APIRouter()

def load_company_benchmarks():
    data_path = os.path.join(
        os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
        "data", "company_benchmarks.json"
    )
    if os.path.exists(data_path):
        with open(data_path, "r", encoding="utf-8") as f:
            return json.load(f)
    return []

@router.post("/evaluate", response_model=AiEvaluationResponse)
def evaluate_readiness(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Execute the multi-stage Hugging Face AI pipeline and persist evaluation report.
    """
    # 1. Fetch user data
    dsa_stats = db.query(SyncedDsaStats).filter(SyncedDsaStats.user_id == current_user.id).first()
    cs_topics = db.query(CsTopic).filter(CsTopic.user_id == current_user.id).all()
    apt_metrics = db.query(AptitudeMetric).filter(AptitudeMetric.user_id == current_user.id).all()
    github_conn = db.query(PlatformConnection).filter(
        PlatformConnection.user_id == current_user.id,
        PlatformConnection.platform == "github"
    ).first()

    # 2. Extract metrics
    dsa_score = normalize_dsa_index(dsa_stats)
    cs_score = cs_mastery_score(cs_topics)
    apt_score = aptitude_score(apt_metrics)

    topic_dict = {}
    if dsa_stats and dsa_stats.topic_counts_json:
        try:
            topic_dict = json.loads(dsa_stats.topic_counts_json)
        except Exception:
            topic_dict = {}

    cs_topic_list = [{"subject_name": c.subject_name, "topic_name": c.topic_name, "status": c.status} for c in cs_topics]

    # 3. Build text for AI models
    student_text = build_student_text(
        user_name=current_user.full_name,
        college=current_user.college,
        branch=current_user.branch,
        dsa_total=dsa_stats.total_solved if dsa_stats else 0,
        dsa_easy=dsa_stats.easy_solved if dsa_stats else 0,
        dsa_medium=dsa_stats.medium_solved if dsa_stats else 0,
        dsa_hard=dsa_stats.hard_solved if dsa_stats else 0,
        contest_rating=dsa_stats.contest_rating if dsa_stats else 0.0,
        topics=topic_dict,
        cs_topics=cs_topic_list,
        aptitude_acc=apt_score,
        github_repos=4 if github_conn else 0
    )

    # 4. Semantic Company Match Scores
    benchmarks = load_company_benchmarks()
    company_match_scores = {}
    is_fallback = False
    
    for bm in benchmarks:
        score, fb = semantic_company_match(student_text, bm.get("jd_text", ""))
        company_match_scores[bm["name"]] = score
        if fb:
            is_fallback = True

    # Compute average semantic alignment
    if company_match_scores:
        avg_semantic = sum(company_match_scores.values()) / len(company_match_scores)
    else:
        avg_semantic = 50.0

    # 5. Hireability Tier Classification
    tier_label, prob_dict, tier_fallback = hireability_tier(student_text, dsa_score, cs_score, apt_score)
    if tier_fallback:
        is_fallback = True

    # 6. Weak Area Diagnosis
    weak_areas = weak_area_detection(dsa_stats, cs_topics)

    # 7. Composite Readiness Calculation
    overall_score = composite_readiness(
        dsa_index=dsa_score,
        semantic_match=avg_semantic,
        cs_score=cs_score,
        apt_score=apt_score,
        interview_score=70.0
    )

    # 8. 7-Day Action Plan
    action_plan = generate_action_plan(weak_areas, tier_label)

    # 9. Save to Database
    ai_eval = AiEvaluation(
        user_id=current_user.id,
        overall_score=overall_score,
        tier_classification=tier_label,
        company_match_scores_json=json.dumps(company_match_scores),
        weak_areas_json=json.dumps(weak_areas),
        action_plan_text=action_plan
    )
    db.add(ai_eval)
    db.commit()
    db.refresh(ai_eval)

    return {
        "id": ai_eval.id,
        "overall_score": ai_eval.overall_score,
        "tier_classification": ai_eval.tier_classification,
        "company_match_scores": company_match_scores,
        "weak_areas": weak_areas,
        "action_plan_text": ai_eval.action_plan_text,
        "created_at": ai_eval.created_at,
        "is_fallback": is_fallback
    }


@router.get("/latest-report", response_model=AiEvaluationResponse)
def get_latest_report(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retrieve the latest persisted AI readiness evaluation or trigger a fresh one."""
    latest = db.query(AiEvaluation).filter(
        AiEvaluation.user_id == current_user.id
    ).order_by(AiEvaluation.created_at.desc()).first()

    if not latest:
        # Generate initial evaluation
        return evaluate_readiness(db=db, current_user=current_user)

    company_scores = {}
    if latest.company_match_scores_json:
        try:
            company_scores = json.loads(latest.company_match_scores_json)
        except Exception:
            company_scores = {}

    weak_areas = []
    if latest.weak_areas_json:
        try:
            weak_areas = json.loads(latest.weak_areas_json)
        except Exception:
            weak_areas = []

    return {
        "id": latest.id,
        "overall_score": latest.overall_score,
        "tier_classification": latest.tier_classification,
        "company_match_scores": company_scores,
        "weak_areas": weak_areas,
        "action_plan_text": latest.action_plan_text or "",
        "created_at": latest.created_at,
        "is_fallback": False
    }


@router.post("/company-match", response_model=CompanyMatchResponse)
def company_match_endpoint(
    req: CompanyMatchRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Match student profile against a specific target company benchmark."""
    benchmarks = load_company_benchmarks()
    target_bm = next((b for b in benchmarks if b["name"].lower() == req.company.lower()), None)
    if not target_bm:
        raise HTTPException(
            status_code=404,
            detail=f"Company '{req.company}' not found in benchmark directory."
        )

    dsa_stats = db.query(SyncedDsaStats).filter(SyncedDsaStats.user_id == current_user.id).first()
    cs_topics = db.query(CsTopic).filter(CsTopic.user_id == current_user.id).all()
    apt_metrics = db.query(AptitudeMetric).filter(AptitudeMetric.user_id == current_user.id).all()

    topic_dict = {}
    if dsa_stats and dsa_stats.topic_counts_json:
        try:
            topic_dict = json.loads(dsa_stats.topic_counts_json)
        except Exception:
            topic_dict = {}

    cs_topic_list = [{"subject_name": c.subject_name, "topic_name": c.topic_name, "status": c.status} for c in cs_topics]

    student_text = build_student_text(
        user_name=current_user.full_name,
        college=current_user.college,
        branch=current_user.branch,
        dsa_total=dsa_stats.total_solved if dsa_stats else 0,
        dsa_easy=dsa_stats.easy_solved if dsa_stats else 0,
        dsa_medium=dsa_stats.medium_solved if dsa_stats else 0,
        dsa_hard=dsa_stats.hard_solved if dsa_stats else 0,
        contest_rating=dsa_stats.contest_rating if dsa_stats else 0.0,
        topics=topic_dict,
        cs_topics=cs_topic_list,
        aptitude_acc=aptitude_score(apt_metrics)
    )

    match_score, _ = semantic_company_match(student_text, target_bm.get("jd_text", ""))

    focus = target_bm.get("focus_topics", [])
    missing = []
    for f in focus:
        found = False
        for k, v in topic_dict.items():
            if f.lower() in k.lower() and v > 0:
                found = True
                break
        if not found:
            missing.append(f)

    min_req = target_bm.get("min_readiness", 60)
    if match_score >= min_req:
        status_text = "Ready - Exceeds Company Benchmark"
    elif match_score >= min_req - 15:
        status_text = "Competitive - Minor Gap in Focus Topics"
    else:
        status_text = "Underprepared - Needs Dedicated Practice"

    return {
        "company": target_bm["name"],
        "tier": target_bm.get("tier", "Mid"),
        "match_score": match_score,
        "focus_topics": focus,
        "missing_topics": missing,
        "readiness_status": status_text
    }


@router.post("/interview-eval", response_model=InterviewEvalResponse)
def interview_evaluation_endpoint(
    req: InterviewEvalRequest,
    current_user: User = Depends(get_current_user)
):
    """Evaluate a student's technical interview answer using NLP semantic similarity."""
    result = interview_eval(req.question, req.answer)
    return result
