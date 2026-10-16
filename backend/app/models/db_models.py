from datetime import datetime, date
from sqlalchemy import (
    Column, Integer, String, Float, Text, DateTime, Date,
    ForeignKey, UniqueConstraint
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(100), nullable=False)
    college = Column(String(150), nullable=True)
    branch = Column(String(50), nullable=True)
    graduation_year = Column(Integer, nullable=True)
    created_at = Column(DateTime, server_default=func.now(), default=datetime.utcnow)

    # Relationships
    platform_connections = relationship("PlatformConnection", back_populates="user", cascade="all, delete-orphan")
    synced_dsa_stats = relationship("SyncedDsaStats", back_populates="user", cascade="all, delete-orphan", uselist=False)
    cs_topics = relationship("CsTopic", back_populates="user", cascade="all, delete-orphan")
    aptitude_metrics = relationship("AptitudeMetric", back_populates="user", cascade="all, delete-orphan")
    ai_evaluations = relationship("AiEvaluation", back_populates="user", cascade="all, delete-orphan")
    revision_schedules = relationship("RevisionSchedule", back_populates="user", cascade="all, delete-orphan")


class PlatformConnection(Base):
    __tablename__ = "platform_connections"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    platform = Column(String(50), nullable=False)  # leetcode | codeforces | github | hackerrank
    username = Column(String(100), nullable=False)
    last_synced_at = Column(DateTime, nullable=True)
    sync_status = Column(String(20), default="idle")  # idle | syncing | success | error
    error_message = Column(Text, nullable=True)

    user = relationship("User", back_populates="platform_connections")

    __table_args__ = (
        UniqueConstraint("user_id", "platform", name="uq_user_platform"),
    )


class SyncedDsaStats(Base):
    __tablename__ = "synced_dsa_stats"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True)
    total_solved = Column(Integer, default=0)
    easy_solved = Column(Integer, default=0)
    medium_solved = Column(Integer, default=0)
    hard_solved = Column(Integer, default=0)
    contest_rating = Column(Float, default=0.0)
    global_rank = Column(Integer, nullable=True)
    topic_counts_json = Column(Text, nullable=True)  # {"dynamic_programming": 15, "graphs": 8, ...}
    recent_submissions_json = Column(Text, nullable=True)  # JSON array
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), default=datetime.utcnow)

    user = relationship("User", back_populates="synced_dsa_stats")


class CsTopic(Base):
    __tablename__ = "cs_topics"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    subject_name = Column(String(50), nullable=False)  # DBMS | OS | CN | OOP
    topic_name = Column(String(100), nullable=False)
    status = Column(String(20), default="not_started")  # not_started | in_progress | revised | mastered
    last_reviewed = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="cs_topics")


class AptitudeMetric(Base):
    __tablename__ = "aptitude_metrics"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    category = Column(String(50), nullable=False)  # Quantitative | Logical | Verbal | Data Interpretation
    attempted = Column(Integer, default=0)
    correct = Column(Integer, default=0)
    accuracy = Column(Float, default=0.0)
    avg_time_seconds = Column(Float, nullable=True)

    user = relationship("User", back_populates="aptitude_metrics")


class AiEvaluation(Base):
    __tablename__ = "ai_evaluations"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    overall_score = Column(Float, nullable=False)
    tier_classification = Column(String(100), nullable=False)
    company_match_scores_json = Column(Text, nullable=True)
    weak_areas_json = Column(Text, nullable=True)
    action_plan_text = Column(Text, nullable=True)
    created_at = Column(DateTime, server_default=func.now(), default=datetime.utcnow)

    user = relationship("User", back_populates="ai_evaluations")


class RevisionSchedule(Base):
    __tablename__ = "revision_schedule"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    topic_name = Column(String(100), nullable=False)
    category = Column(String(50), nullable=False)  # DSA | DBMS | OS | CN | OOP | Aptitude
    interval_stage = Column(Integer, default=1)
    next_revision_date = Column(Date, nullable=False)
    last_performance = Column(String(20), nullable=True)  # easy | good | hard | forgot

    user = relationship("User", back_populates="revision_schedules")
