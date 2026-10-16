import os
import logging
from typing import List, Optional
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import field_validator

logger = logging.getLogger(__name__)

class Settings(BaseSettings):
    ENVIRONMENT: str = "development"  # development | testing | production
    DATABASE_URL: str = "sqlite:///./placement.db"
    SECRET_KEY: str = "change-me-to-a-long-random-string"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    ALGORITHM: str = "HS256"
    CORS_ORIGINS: str = "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000,http://127.0.0.1:3000"
    RATE_LIMIT_ENABLED: bool = True
    HF_MODEL_EMBEDDING: str = "sentence-transformers/all-MiniLM-L6-v2"
    HF_MODEL_ZEROSHOT: str = "facebook/bart-large-mnli"
    HF_OFFLINE_FALLBACK: bool = True
    SYNC_COOLDOWN_SECONDS: int = 600
    API_BASE_URL: str = "http://localhost:8000"

    @field_validator("DATABASE_URL")
    @classmethod
    def normalize_database_url(cls, v: str) -> str:
        # Normalize legacy postgres:// URI schema for SQLAlchemy 2.0+
        if v.startswith("postgres://"):
            return v.replace("postgres://", "postgresql://", 1)
        return v

    def get_cors_origins(self) -> List[str]:
        if not self.CORS_ORIGINS or self.CORS_ORIGINS.strip() == "*":
            return ["*"]
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

    def validate_production_security(self):
        """Validate critical security settings in production environments."""
        if self.ENVIRONMENT.lower() == "production":
            insecure_defaults = [
                "change-me-to-a-long-random-string",
                "secret",
                "secretkey",
                "password",
            ]
            if self.SECRET_KEY in insecure_defaults or len(self.SECRET_KEY) < 32:
                raise ValueError(
                    "CRITICAL SECURITY ERROR: In production, SECRET_KEY must be a unique, cryptographically strong secret at least 32 characters long."
                )

    model_config = SettingsConfigDict(
        env_file=os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), ".env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
settings.validate_production_security()

