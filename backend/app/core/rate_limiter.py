import time
import threading
from typing import Dict, List, Tuple
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse
from app.core.config import settings

class SlidingWindowRateLimiter:
    """
    Thread-safe in-memory sliding window rate limiter.
    Stores timestamps of requests per client key.
    """
    def __init__(self):
        self._lock = threading.Lock()
        self._history: Dict[str, List[float]] = {}
        self._last_cleanup = time.time()

    def is_allowed(self, key: str, max_requests: int, window_seconds: int) -> Tuple[bool, int]:
        """
        Check if a request is allowed under the sliding window limit.
        Returns (is_allowed, retry_after_seconds).
        """
        now = time.time()
        window_start = now - window_seconds

        with self._lock:
            # Periodic cleanup of keys every 5 minutes to prevent memory leak
            if now - self._last_cleanup > 300:
                self._cleanup(now)
                self._last_cleanup = now

            timestamps = self._history.get(key, [])
            # Filter timestamps outside the active window
            valid_timestamps = [t for t in timestamps if t > window_start]

            if len(valid_timestamps) >= max_requests:
                # Oldest timestamp in window determines when a slot frees up
                oldest_in_window = valid_timestamps[0]
                retry_after = max(1, int(oldest_in_window + window_seconds - now))
                self._history[key] = valid_timestamps
                return False, retry_after

            valid_timestamps.append(now)
            self._history[key] = valid_timestamps
            return True, 0

    def _cleanup(self, now: float):
        cutoff = now - 600  # Remove keys inactive for 10 minutes
        stale_keys = [k for k, v in self._history.items() if not v or v[-1] < cutoff]
        for k in stale_keys:
            del self._history[k]

_limiter = SlidingWindowRateLimiter()

# Route specific rate limits (max_requests, window_seconds)
ROUTE_LIMITS: Dict[str, Tuple[int, int]] = {
    "/api/auth/login": (10, 60),        # 10 attempts per minute (brute force protection)
    "/api/auth/register": (5, 60),      # 5 registrations per minute
    "/api/platforms/sync-all": (4, 300), # 4 sync triggers per 5 minutes
    "/api/ai/evaluate": (8, 60),        # 8 AI evaluations per minute
}

GLOBAL_LIMIT = (150, 60)  # 150 general API requests per minute

class RateLimitingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        if not settings.RATE_LIMIT_ENABLED:
            return await call_next(request)

        # Skip rate limiting for health check and preflight OPTIONS requests
        if request.url.path == "/api/health" or request.method == "OPTIONS":
            return await call_next(request)

        # Identify client IP (respecting X-Forwarded-For if behind a reverse proxy)
        client_ip = request.headers.get("x-forwarded-for")
        if client_ip:
            client_ip = client_ip.split(",")[0].strip()
        else:
            client_ip = request.client.host if request.client else "unknown"

        path = request.url.path
        method = request.method

        # Check route-specific limit
        route_key = path.rstrip("/")
        if route_key in ROUTE_LIMITS and method == "POST":
            max_req, window = ROUTE_LIMITS[route_key]
            allowed, retry_after = _limiter.is_allowed(f"{client_ip}:{route_key}", max_req, window)
            if not allowed:
                return JSONResponse(
                    status_code=429,
                    content={
                        "detail": f"Too many requests to {route_key}. Please wait {retry_after} seconds before trying again.",
                        "retry_after": retry_after
                    },
                    headers={"Retry-After": str(retry_after)}
                )

        # Check global IP rate limit
        allowed, retry_after = _limiter.is_allowed(f"{client_ip}:global", GLOBAL_LIMIT[0], GLOBAL_LIMIT[1])
        if not allowed:
            return JSONResponse(
                status_code=429,
                content={
                    "detail": f"Global rate limit exceeded. Please wait {retry_after} seconds.",
                    "retry_after": retry_after
                },
                headers={"Retry-After": str(retry_after)}
            )

        return await call_next(request)
