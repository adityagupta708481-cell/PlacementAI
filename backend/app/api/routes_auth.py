from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import hash_password, verify_password, create_access_token, get_current_user
from app.models.db_models import User, CsTopic, AptitudeMetric, SyncedDsaStats
from app.schemas.pydantic_schemas import UserCreate, UserLogin, UserOut, Token

router = APIRouter()

STANDARD_CS_TOPICS = [
    # DBMS
    ("DBMS", "Transactions & ACID Properties"),
    ("DBMS", "Database Indexing (B-Trees, Hash)"),
    ("DBMS", "Normalization (1NF, 2NF, 3NF, BCNF)"),
    ("DBMS", "SQL Joins & Complex Queries"),
    # OS
    ("OS", "Process Scheduling Algorithms"),
    ("OS", "Threads & Concurrency Control"),
    ("OS", "Deadlocks, Avoidance & Banker's Algorithm"),
    ("OS", "Virtual Memory & Paging"),
    # CN
    ("CN", "OSI & TCP/IP Model Architecture"),
    ("CN", "TCP vs UDP & Flow Control"),
    ("CN", "IP Addressing, Subnetting & Routing"),
    ("CN", "DNS & HTTP/HTTPS Protocols"),
    # OOP
    ("OOP", "Inheritance & Polymorphism"),
    ("OOP", "Encapsulation & Data Abstraction"),
    ("OOP", "SOLID Design Principles"),
    ("OOP", "Factory & Singleton Design Patterns"),
]

APTITUDE_CATEGORIES = [
    "Quantitative",
    "Logical",
    "Verbal",
    "Data Interpretation"
]

def seed_user_defaults(db: Session, user_id: int):
    """Seed initial CS topics, aptitude categories, and empty DSA stats for a new user."""
    # Seed CS Topics
    for subject, topic in STANDARD_CS_TOPICS:
        cs_entry = CsTopic(
            user_id=user_id,
            subject_name=subject,
            topic_name=topic,
            status="not_started"
        )
        db.add(cs_entry)

    # Seed Aptitude Categories
    for cat in APTITUDE_CATEGORIES:
        apt_entry = AptitudeMetric(
            user_id=user_id,
            category=cat,
            attempted=0,
            correct=0,
            accuracy=0.0
        )
        db.add(apt_entry)

    # Seed initial SyncedDsaStats row
    dsa_entry = SyncedDsaStats(
        user_id=user_id,
        total_solved=0,
        easy_solved=0,
        medium_solved=0,
        hard_solved=0,
        contest_rating=0.0,
        topic_counts_json="{}",
        recent_submissions_json="[]"
    )
    db.add(dsa_entry)
    db.commit()

@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    existing = db.query(User).filter(User.email == user_in.email.lower()).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already registered"
        )

    # Create user
    new_user = User(
        email=user_in.email.lower(),
        password_hash=hash_password(user_in.password),
        full_name=user_in.full_name,
        college=user_in.college,
        branch=user_in.branch,
        graduation_year=user_in.graduation_year
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Seed CS topics, Aptitude categories, DSA stats
    seed_user_defaults(db, new_user.id)

    return new_user

@router.post("/login", response_model=Token)
def login(login_in: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_in.email.lower()).first()
    if not user or not verify_password(login_in.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = create_access_token(data={"sub": str(user.id), "email": user.email})
    return {"access_token": token, "token_type": "bearer"}

@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user
