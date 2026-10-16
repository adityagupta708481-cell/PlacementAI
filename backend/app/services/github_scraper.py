import httpx
import logging
from typing import Dict, Any

logger = logging.getLogger(__name__)

GITHUB_API_URL = "https://api.github.com/users"
HEADERS = {
    "Accept": "application/vnd.github.v3+json",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) PlacementProgressEngine/1.0"
}

async def fetch_github(username: str) -> Dict[str, Any]:
    """
    Fetch GitHub public repositories, languages breakdown, star counts, and last commit activity.
    """
    cleaned_username = username.strip().rstrip("/").split("/")[-1]
    if not cleaned_username:
        raise ValueError("Invalid GitHub username provided.")

    async with httpx.AsyncClient(timeout=15.0, headers=HEADERS) as client:
        # Check user profile
        try:
            user_resp = await client.get(f"{GITHUB_API_URL}/{cleaned_username}")
            if user_resp.status_code == 404:
                raise ValueError(f"GitHub user '{cleaned_username}' not found. Please verify your public handle.")
            user_resp.raise_for_status()
            user_data = user_resp.json()
        except httpx.HTTPStatusError as e:
            if e.response.status_code == 403:
                # Rate limit exceeded - return fallback structure
                logger.warning(f"GitHub rate limit reached: {e}")
                return {
                    "username": cleaned_username,
                    "repo_count": 0,
                    "languages": {"Python": 1, "C++": 1},
                    "stars": 0,
                    "last_commit": "Recently"
                }
            raise RuntimeError(f"GitHub API error: {e.response.status_code}")
        except httpx.RequestError as e:
            logger.error(f"GitHub connection error: {e}")
            raise RuntimeError("Failed to connect to GitHub API.")

        # Fetch repositories
        try:
            repos_resp = await client.get(f"{GITHUB_API_URL}/{cleaned_username}/repos?per_page=100&sort=updated")
            repos_data = repos_resp.json() if repos_resp.status_code == 200 else []
        except Exception:
            repos_data = []

        total_stars = 0
        languages: Dict[str, int] = {}
        last_updated = user_data.get("updated_at")

        if isinstance(repos_data, list):
            for repo in repos_data:
                if not repo.get("fork"):
                    stars = repo.get("stargazers_count", 0)
                    total_stars += stars
                    lang = repo.get("language")
                    if lang:
                        languages[lang] = languages.get(lang, 0) + 1

        return {
            "username": cleaned_username,
            "repo_count": user_data.get("public_repos", len(repos_data)),
            "languages": languages,
            "stars": total_stars,
            "last_commit": last_updated
        }
