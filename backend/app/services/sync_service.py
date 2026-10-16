import json
import logging
from datetime import datetime, timedelta
from typing import Optional
from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.database import SessionLocal
from app.models.db_models import PlatformConnection, SyncedDsaStats
from app.services.leetcode_scraper import fetch_leetcode
from app.services.codeforces_scraper import fetch_codeforces
from app.services.github_scraper import fetch_github
from app.services.hackerrank_scraper import fetch_hackerrank
from app.services.codechef_scraper import fetch_codechef

logger = logging.getLogger(__name__)

async def sync_platform(db: Session, conn: PlatformConnection, user_id: int, force: bool = False):
    """Sync a single platform connection for a user."""
    # Check cooldown
    if not force and conn.last_synced_at:
        cooldown_threshold = datetime.utcnow() - timedelta(seconds=settings.SYNC_COOLDOWN_SECONDS)
        if conn.last_synced_at > cooldown_threshold and conn.sync_status == "success":
            logger.info(f"Skipping sync for {conn.platform}: within cooldown period.")
            return

    conn.sync_status = "syncing"
    conn.error_message = None
    db.commit()

    try:
        if conn.platform.lower() == "leetcode":
            data = await fetch_leetcode(conn.username)
            # Upsert SyncedDsaStats
            dsa_stats = db.query(SyncedDsaStats).filter(SyncedDsaStats.user_id == user_id).first()
            if not dsa_stats:
                dsa_stats = SyncedDsaStats(user_id=user_id)
                db.add(dsa_stats)

            dsa_stats.total_solved = data.get("total_solved", 0)
            dsa_stats.easy_solved = data.get("easy_solved", 0)
            dsa_stats.medium_solved = data.get("medium_solved", 0)
            dsa_stats.hard_solved = data.get("hard_solved", 0)
            dsa_stats.contest_rating = max(dsa_stats.contest_rating or 0.0, data.get("contest_rating", 0.0))
            dsa_stats.global_rank = data.get("global_rank")
            dsa_stats.topic_counts_json = json.dumps(data.get("topic_counts", {}))
            dsa_stats.recent_submissions_json = json.dumps(data.get("recent_submissions", []))
            dsa_stats.updated_at = datetime.utcnow()

        elif conn.platform.lower() == "codeforces":
            data = await fetch_codeforces(conn.username)
            dsa_stats = db.query(SyncedDsaStats).filter(SyncedDsaStats.user_id == user_id).first()
            if not dsa_stats:
                dsa_stats = SyncedDsaStats(user_id=user_id)
                db.add(dsa_stats)

            # If no leetcode contest rating, use codeforces rating
            if not dsa_stats.contest_rating or dsa_stats.contest_rating == 0.0:
                dsa_stats.contest_rating = float(data.get("rating", 0))

            # Merge CF tags into topic_counts_json if needed
            existing_topics = {}
            if dsa_stats.topic_counts_json:
                try:
                    existing_topics = json.loads(dsa_stats.topic_counts_json)
                except Exception:
                    existing_topics = {}
            for tag, count in data.get("tags", {}).items():
                existing_topics[f"cf_{tag}"] = count
            dsa_stats.topic_counts_json = json.dumps(existing_topics)

        elif conn.platform.lower() == "hackerrank":
            data = await fetch_hackerrank(conn.username)
            dsa_stats = db.query(SyncedDsaStats).filter(SyncedDsaStats.user_id == user_id).first()
            if not dsa_stats:
                dsa_stats = SyncedDsaStats(user_id=user_id)
                db.add(dsa_stats)

            existing_topics = {}
            if dsa_stats.topic_counts_json:
                try:
                    existing_topics = json.loads(dsa_stats.topic_counts_json)
                except Exception:
                    existing_topics = {}

            for b in data.get("badges", []):
                b_name = b.get("badge_name", "").lower().replace(" ", "_")
                if b_name:
                    existing_topics[f"hr_{b_name}"] = b.get("stars", 0)

            for s in data.get("scores", []):
                t_name = s.get("track", "").lower().replace(" ", "_")
                if t_name and s.get("score"):
                    existing_topics[f"hr_track_{t_name}"] = int(s.get("score", 0))

            dsa_stats.topic_counts_json = json.dumps(existing_topics)

        elif conn.platform.lower() == "codechef":
            data = await fetch_codechef(conn.username)
            dsa_stats = db.query(SyncedDsaStats).filter(SyncedDsaStats.user_id == user_id).first()
            if not dsa_stats:
                dsa_stats = SyncedDsaStats(user_id=user_id)
                db.add(dsa_stats)

            cc_rating = float(data.get("rating", 0))
            if cc_rating > 0:
                if not dsa_stats.contest_rating or dsa_stats.contest_rating == 0.0:
                    dsa_stats.contest_rating = cc_rating

            cc_solved = data.get("total_solved", 0)
            if cc_solved > 0 and (not dsa_stats.total_solved or dsa_stats.total_solved == 0):
                dsa_stats.total_solved = cc_solved

            existing_topics = {}
            if dsa_stats.topic_counts_json:
                try:
                    existing_topics = json.loads(dsa_stats.topic_counts_json)
                except Exception:
                    existing_topics = {}
            existing_topics["cc_stars"] = data.get("stars_count", 0)
            existing_topics["cc_solved"] = cc_solved
            dsa_stats.topic_counts_json = json.dumps(existing_topics)

        elif conn.platform.lower() == "github":
            data = await fetch_github(conn.username)
            pass

        conn.sync_status = "success"
        conn.last_synced_at = datetime.utcnow()
        conn.error_message = None
        db.commit()

        # Trigger auto-flagging weak topics in revision schedule
        try:
            from app.services.revision_service import auto_flag_weak_topics
            dsa_stats = db.query(SyncedDsaStats).filter(SyncedDsaStats.user_id == user_id).first()
            if dsa_stats:
                auto_flag_weak_topics(db, user_id, dsa_stats)
        except Exception as rev_err:
            logger.warning(f"Error auto-flagging weak topics: {rev_err}")

    except Exception as e:
        logger.error(f"Sync error for {conn.platform} ({conn.username}): {e}")
        conn.sync_status = "error"
        conn.error_message = str(e)
        db.commit()


async def sync_all_for_user(user_id: int, force: bool = False):
    """
    Background worker task to sync all connected platforms for a user.
    Uses its own DB session to remain thread-safe.
    """
    db: Session = SessionLocal()
    try:
        connections = db.query(PlatformConnection).filter(PlatformConnection.user_id == user_id).all()
        for conn in connections:
            await sync_platform(db, conn, user_id, force=force)
    finally:
        db.close()
