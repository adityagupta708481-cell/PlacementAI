import os
import sys
import subprocess

# Auto-delegate to venv python if invoked with system python (cross-platform)
current_dir = os.path.dirname(os.path.abspath(__file__))
venv_windows = os.path.join(current_dir, "venv", "Scripts", "python.exe")
venv_posix = os.path.join(current_dir, "venv", "bin", "python")
venv_python = venv_windows if os.name == "nt" else venv_posix

if sys.prefix == sys.base_prefix and os.path.exists(venv_python) and sys.executable.lower() != venv_python.lower():
    sys.exit(subprocess.call([venv_python] + sys.argv))

import uvicorn
from app.core.config import settings

if __name__ == "__main__":
    host = os.environ.get("HOST", "0.0.0.0")
    port = int(os.environ.get("PORT", "8000"))
    is_prod = settings.ENVIRONMENT.lower() == "production"
    reload = not is_prod and os.environ.get("RELOAD", "true").lower() in ("true", "1")
    workers = int(os.environ.get("WEB_CONCURRENCY", "1")) if is_prod else 1

    uvicorn.run(
        "app.main:app",
        host=host,
        port=port,
        reload=reload,
        workers=workers if not reload else None,
        log_level="info"
    )

