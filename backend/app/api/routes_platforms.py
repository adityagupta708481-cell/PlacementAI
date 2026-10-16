import json
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.db_models import User, PlatformConnection, SyncedDsaStats
from app.schemas.pydantic_schemas import (
    PlatformConnect, PlatformStatusResponse, PlatformStatusItem,
    LeetCodeStatsResponse, CodeforcesStatsResponse, GitHubStatsResponse,
    HackerRankStatsResponse, CodeChefStatsResponse
)
from app.services.sync_service import sync_all_for_user
from app.services.leetcode_scraper import fetch_leetcode
from app.services.codeforces_scraper import fetch_codeforces
from app.services.github_scraper import fetch_github
from app.services.hackerrank_scraper import fetch_hackerrank
from app.services.codechef_scraper import fetch_codechef

router = APIRouter()

@router.post("/connect", response_model=PlatformStatusResponse)
def connect_platforms(
    data: PlatformConnect,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Save or update platform handles for the user."""
    platform_map = {
        "leetcode": data.leetcode,
        "codeforces": data.codeforces,
        "github": data.github,
        "hackerrank": data.hackerrank,
        "codechef": data.codechef
    }

    for platform_name, username in platform_map.items():
        if username is not None and username.strip():
            cleaned = username.strip()
            conn = db.query(PlatformConnection).filter(
                PlatformConnection.user_id == current_user.id,
                PlatformConnection.platform == platform_name
            ).first()

            if conn:
                if conn.username != cleaned:
                    conn.username = cleaned
                    conn.sync_status = "idle"
                    conn.error_message = None
            else:
                conn = PlatformConnection(
                    user_id=current_user.id,
                    platform=platform_name,
                    username=cleaned,
                    sync_status="idle"
                )
                db.add(conn)

    db.commit()

    # Return all platform connections
    connections = db.query(PlatformConnection).filter(
        PlatformConnection.user_id == current_user.id
    ).all()

    return {"platforms": [PlatformStatusItem.from_orm(c) for c in connections]}


@router.get("/status", response_model=PlatformStatusResponse)
def get_platforms_status(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retrieve sync status and timestamps for all connected platforms."""
    connections = db.query(PlatformConnection).filter(
        PlatformConnection.user_id == current_user.id
    ).all()
    return {"platforms": [PlatformStatusItem.from_orm(c) for c in connections]}


@router.post("/sync-all", status_code=status.HTTP_202_ACCEPTED)
async def sync_all(
    background_tasks: BackgroundTasks,
    force: bool = False,
    current_user: User = Depends(get_current_user)
):
    """Trigger background sync for all connected platforms."""
    background_tasks.add_task(sync_all_for_user, current_user.id, force)
    return {"message": "Sync initiated in background for all connected platforms.", "status": "syncing"}


@router.get("/leetcode", response_model=LeetCodeStatsResponse)
async def get_leetcode_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get LeetCode metrics and topic counts from database cache or live."""
    conn = db.query(PlatformConnection).filter(
        PlatformConnection.user_id == current_user.id,
        PlatformConnection.platform == "leetcode"
    ).first()

    if not conn:
        raise HTTPException(status_code=404, detail="LeetCode handle not connected.")

    dsa_stats = db.query(SyncedDsaStats).filter(SyncedDsaStats.user_id == current_user.id).first()

    topic_counts = {}
    recent = []
    if dsa_stats and dsa_stats.topic_counts_json:
        try:
            topic_counts = json.loads(dsa_stats.topic_counts_json)
        except Exception:
            topic_counts = {}
    if dsa_stats and dsa_stats.recent_submissions_json:
        try:
            recent = json.loads(dsa_stats.recent_submissions_json)
        except Exception:
            recent = []

    return {
        "username": conn.username,
        "total_solved": dsa_stats.total_solved if dsa_stats else 0,
        "easy_solved": dsa_stats.easy_solved if dsa_stats else 0,
        "medium_solved": dsa_stats.medium_solved if dsa_stats else 0,
        "hard_solved": dsa_stats.hard_solved if dsa_stats else 0,
        "contest_rating": dsa_stats.contest_rating if dsa_stats else 0.0,
        "global_rank": dsa_stats.global_rank if dsa_stats else None,
        "topic_counts": topic_counts,
        "recent_submissions": recent,
        "updated_at": dsa_stats.updated_at if dsa_stats else None
    }


@router.get("/codeforces", response_model=CodeforcesStatsResponse)
async def get_codeforces_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get Codeforces live or cached stats."""
    conn = db.query(PlatformConnection).filter(
        PlatformConnection.user_id == current_user.id,
        PlatformConnection.platform == "codeforces"
    ).first()

    if not conn:
        raise HTTPException(status_code=404, detail="Codeforces handle not connected.")

    data = await fetch_codeforces(conn.username)
    return data


@router.get("/github", response_model=GitHubStatsResponse)
async def get_github_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get GitHub repository stats, language breakdown, and stars."""
    conn = db.query(PlatformConnection).filter(
        PlatformConnection.user_id == current_user.id,
        PlatformConnection.platform == "github"
    ).first()

    if not conn:
        raise HTTPException(status_code=404, detail="GitHub handle not connected.")

    data = await fetch_github(conn.username)
    return data


@router.get("/hackerrank", response_model=HackerRankStatsResponse)
async def get_hackerrank_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get HackerRank live badges, stars, and track scores."""
    conn = db.query(PlatformConnection).filter(
        PlatformConnection.user_id == current_user.id,
        PlatformConnection.platform == "hackerrank"
    ).first()

    if not conn:
        raise HTTPException(status_code=404, detail="HackerRank handle not connected.")

    data = await fetch_hackerrank(conn.username)
    return data


@router.get("/codechef", response_model=CodeChefStatsResponse)
async def get_codechef_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get CodeChef live rating, stars, division, and solved count."""
    conn = db.query(PlatformConnection).filter(
        PlatformConnection.user_id == current_user.id,
        PlatformConnection.platform == "codechef"
    ).first()

    if not conn:
        raise HTTPException(status_code=404, detail="CodeChef handle not connected.")

    data = await fetch_codechef(conn.username)
    return data

