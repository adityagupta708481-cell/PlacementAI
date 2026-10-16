import os
import uuid
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.core.config import settings
from app.core.database import Base, engine
from app.core.security_headers import SecurityHeadersMiddleware
from app.core.rate_limiter import RateLimitingMiddleware

# Import all models to register with Base metadata
import app.models.db_models  # noqa: F401

logger = logging.getLogger("placementai.app")
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: ensure tables exist
    logger.info("Initializing database tables...")
    Base.metadata.create_all(bind=engine)
    logger.info(f"PlacementAI API initialized successfully in [{settings.ENVIRONMENT}] mode.")
    yield
    logger.info("PlacementAI API shutting down.")

is_prod = settings.ENVIRONMENT.lower() == "production"

app = FastAPI(
    title="College Placement Preparation & AI Readiness Engine",
    description="Full-Stack Web Platform with Automated Coding Platform Sync & Hugging Face AI Readiness Engine",
    version="1.0.0",
    docs_url=None if is_prod else "/docs",
    redoc_url=None if is_prod else "/redoc",
    openapi_url=None if is_prod else "/openapi.json",
    lifespan=lifespan
)

# 1. Security Headers Middleware (OWASP protection)
app.add_middleware(SecurityHeadersMiddleware)

# 2. Rate Limiting Middleware (anti brute-force & DDoS mitigation)
app.add_middleware(RateLimitingMiddleware)

# 3. Dynamic CORS Configuration
configured_origins = settings.get_cors_origins()
allow_all = configured_origins == ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=configured_origins,
    allow_credentials=not allow_all,  # Browsers forbid allow_credentials=True when origin is wildcard *
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["Retry-After"],
)

# 4. Global Error Handlers (Information Leak Prevention)
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
        headers=getattr(exc, "headers", None)
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = exc.errors()
    # Format clean error messages
    clean_errors = []
    for err in errors:
        loc = " -> ".join(str(l) for l in err.get("loc", []) if l != "body")
        clean_errors.append(f"{loc}: {err.get('msg', 'Invalid value')}" if loc else err.get("msg", "Invalid value"))
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": "; ".join(clean_errors) if clean_errors else "Validation error"}
    )

@app.exception_handler(Exception)
async def global_unhandled_exception_handler(request: Request, exc: Exception):
    error_id = str(uuid.uuid4())[:8]
    logger.error(f"Unhandled Exception [error_id={error_id}] on {request.method} {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "detail": "An internal server error occurred. Please try again later.",
            "error_id": error_id
        }
    )

@app.get("/api/health", tags=["Health"])
def health_check():
    return {"status": "ok"}

# 5. Explicit Router Registrations
def register_routers():
    try:
        from app.api.routes_auth import router as auth_router
        app.include_router(auth_router, prefix="/api/auth", tags=["Authentication"])
    except Exception as e:
        logger.error(f"Failed to load auth router: {e}", exc_info=True)

    try:
        from app.api.routes_platforms import router as platforms_router
        app.include_router(platforms_router, prefix="/api/platforms", tags=["Platforms"])
    except Exception as e:
        logger.error(f"Failed to load platforms router: {e}", exc_info=True)

    try:
        from app.api.routes_ai import router as ai_router
        app.include_router(ai_router, prefix="/api/ai", tags=["AI Engine"])
    except Exception as e:
        logger.error(f"Failed to load AI router: {e}", exc_info=True)

    try:
        from app.api.routes_academics import router as academics_router
        app.include_router(academics_router, prefix="/api", tags=["Academics"])
    except Exception as e:
        logger.error(f"Failed to load academics router: {e}", exc_info=True)

    try:
        from app.api.routes_revision import router as revision_router
        app.include_router(revision_router, prefix="/api/revisions", tags=["Revision"])
    except Exception as e:
        logger.error(f"Failed to load revision router: {e}", exc_info=True)

register_routers()

