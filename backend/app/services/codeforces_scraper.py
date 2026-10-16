import httpx
import logging
from typing import Dict, Any, List

logger = logging.getLogger(__name__)

CF_USER_INFO_URL = "https://codeforces.com/api/user.info"
CF_USER_STATUS_URL = "https://codeforces.com/api/user.status"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) PlacementProgressEngine/1.0"
}

async def fetch_codeforces(username: str) -> Dict[str, Any]:
    """
    Fetch Codeforces user rating, tags distribution, and solved problems.
    """
    cleaned_username = username.strip().rstrip("/").split("/")[-1]
    if not cleaned_username:
        raise ValueError("Invalid Codeforces handle provided.")

    async with httpx.AsyncClient(timeout=15.0, headers=HEADERS) as client:
        # 1. Fetch user.info
        try:
            info_resp = await client.get(f"{CF_USER_INFO_URL}?handles={cleaned_username}")
            info_data = info_resp.json()
        except Exception as e:
            logger.error(f"Codeforces user.info error: {e}")
            raise RuntimeError("Failed to connect to Codeforces API.")

        if info_data.get("status") != "OK" or not info_data.get("result"):
            raise ValueError(f"Invalid Codeforces handle '{cleaned_username}'. Profile not found.")

        user_info = info_data["result"][0]
        rating = user_info.get("rating", 0)
        max_rating = user_info.get("maxRating", 0)
        rank = user_info.get("rank", "unrated")

        # 2. Fetch user.status (submissions)
        try:
            status_resp = await client.get(f"{CF_USER_STATUS_URL}?handle={cleaned_username}&from=1&count=100")
            status_data = status_resp.json()
        except Exception as e:
            logger.warning(f"Codeforces user.status error: {e}")
            status_data = {"status": "FAILED", "result": []}

        tags_count: Dict[str, int] = {}
        difficulty_dist: Dict[str, int] = {
            "800-1100": 0,
            "1200-1500": 0,
            "1600-1900": 0,
            "2000+": 0
        }
        recent_ok: List[Dict[str, Any]] = []
        seen_problems = set()

        if status_data.get("status") == "OK":
            submissions = status_data.get("result", [])
            for sub in submissions:
                if sub.get("verdict") == "OK":
                    prob = sub.get("problem", {})
                    contest_id = prob.get("contestId")
                    index = prob.get("index")
                    prob_key = f"{contest_id}_{index}"
                    
                    if prob_key not in seen_problems:
                        seen_problems.add(prob_key)
                        
                        # Tags
                        for tag in prob.get("tags", []):
                            tags_count[tag] = tags_count.get(tag, 0) + 1
                        
                        # Rating bucket
                        prob_rating = prob.get("rating")
                        if prob_rating:
                            if prob_rating <= 1100:
                                difficulty_dist["800-1100"] += 1
                            elif prob_rating <= 1500:
                                difficulty_dist["1200-1500"] += 1
                            elif prob_rating <= 1900:
                                difficulty_dist["1600-1900"] += 1
                            else:
                                difficulty_dist["2000+"] += 1

                        if len(recent_ok) < 15:
                            recent_ok.append({
                                "id": sub.get("id"),
                                "name": prob.get("name"),
                                "rating": prob.get("rating"),
                                "tags": prob.get("tags", []),
                                "creationTimeSeconds": sub.get("creationTimeSeconds")
                            })

        return {
            "username": cleaned_username,
            "rating": rating,
            "max_rating": max_rating,
            "rank": rank,
            "tags": tags_count,
            "difficulty_distribution": difficulty_dist,
            "recent_submissions": recent_ok
        }
