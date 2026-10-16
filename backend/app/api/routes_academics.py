from datetime import datetime
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.db_models import User, CsTopic, AptitudeMetric
from app.schemas.pydantic_schemas import (
    CsTopicItem, CsTopicUpdate, AptitudeSubmit, AptitudeStatsResponse, AptitudeMetricItem
)

router = APIRouter()

# ----------------- CS Fundamentals -----------------
@router.get("/cs/topics", response_model=List[CsTopicItem])
def get_cs_topics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retrieve all CS fundamental topics and mastery states for the user."""
    topics = db.query(CsTopic).filter(CsTopic.user_id == current_user.id).order_by(CsTopic.id).all()
    return [CsTopicItem.from_orm(t) for t in topics]


@router.put("/cs/topics/{topic_id}", response_model=CsTopicItem)
def update_cs_topic_status(
    topic_id: int,
    update: CsTopicUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update topic mastery status ('not_started', 'in_progress', 'revised', 'mastered')."""
    valid_statuses = ["not_started", "in_progress", "revised", "mastered"]
    if update.status not in valid_statuses:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid status '{update.status}'. Must be one of {valid_statuses}"
        )

    topic = db.query(CsTopic).filter(
        CsTopic.id == topic_id,
        CsTopic.user_id == current_user.id
    ).first()

    if not topic:
        raise HTTPException(status_code=404, detail="CS topic not found.")

    topic.status = update.status
    topic.last_reviewed = datetime.utcnow()
    db.commit()
    db.refresh(topic)

    return CsTopicItem.from_orm(topic)


# ----------------- Aptitude Metrics -----------------
@router.get("/aptitude/stats", response_model=AptitudeStatsResponse)
def get_aptitude_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get aggregated aptitude test statistics and category-wise performance."""
    metrics = db.query(AptitudeMetric).filter(
        AptitudeMetric.user_id == current_user.id
    ).all()

    total_attempted = sum(m.attempted for m in metrics)
    total_correct = sum(m.correct for m in metrics)
    overall_accuracy = (total_correct / total_attempted * 100.0) if total_attempted > 0 else 0.0

    return {
        "total_attempted": total_attempted,
        "total_correct": total_correct,
        "overall_accuracy": round(overall_accuracy, 1),
        "categories": [AptitudeMetricItem.from_orm(m) for m in metrics]
    }


@router.post("/aptitude/submit", response_model=AptitudeStatsResponse)
def submit_aptitude_test(
    submission: AptitudeSubmit,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Record test results for an aptitude category and update running accuracy."""
    metric = db.query(AptitudeMetric).filter(
        AptitudeMetric.user_id == current_user.id,
        AptitudeMetric.category.ilike(submission.category.strip())
    ).first()

    if not metric:
        metric = AptitudeMetric(
            user_id=current_user.id,
            category=submission.category.strip(),
            attempted=submission.attempted,
            correct=submission.correct,
            accuracy=(submission.correct / submission.attempted * 100.0) if submission.attempted > 0 else 0.0,
            avg_time_seconds=submission.avg_time_seconds
        )
        db.add(metric)
    else:
        metric.attempted += submission.attempted
        metric.correct += submission.correct
        metric.accuracy = (metric.correct / metric.attempted * 100.0) if metric.attempted > 0 else 0.0
        if submission.avg_time_seconds:
            metric.avg_time_seconds = submission.avg_time_seconds

    db.commit()

    # Return refreshed stats
    return get_aptitude_stats(db=db, current_user=current_user)
