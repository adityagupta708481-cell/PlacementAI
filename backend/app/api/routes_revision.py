from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.db_models import User, RevisionSchedule
from app.schemas.pydantic_schemas import RevisionItem, RevisionLog
from app.services.revision_service import get_due_revisions, schedule_next

router = APIRouter()

@router.get("/due", response_model=List[RevisionItem])
def get_due_revisions_endpoint(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retrieve all topics currently due for spaced-repetition revision."""
    items = get_due_revisions(db, current_user.id)
    return [RevisionItem.from_orm(item) for item in items]


@router.post("/{revision_id}/log", response_model=RevisionItem)
def log_revision_performance(
    revision_id: int,
    log_data: RevisionLog,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Log retention performance ('easy', 'good', 'hard', 'forgot') and recalibrate next review date.
    """
    revision = db.query(RevisionSchedule).filter(
        RevisionSchedule.id == revision_id,
        RevisionSchedule.user_id == current_user.id
    ).first()

    if not revision:
        raise HTTPException(status_code=404, detail="Revision schedule item not found.")

    valid_perfs = ["easy", "good", "hard", "forgot"]
    if log_data.performance.lower() not in valid_perfs:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid performance '{log_data.performance}'. Must be one of {valid_perfs}"
        )

    updated_rev = schedule_next(revision, log_data.performance)
    db.commit()
    db.refresh(updated_rev)

    return RevisionItem.from_orm(updated_rev)
