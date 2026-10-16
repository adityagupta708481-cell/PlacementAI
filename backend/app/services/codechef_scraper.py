import httpx
import re
import logging
from typing import Dict, Any

logger = logging.getLogger(__name__)

CODECHEF_BASE = "https://www.codechef.com/users"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 PlacementProgressEngine/1.0",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
}

async def fetch_codechef(username: str) -> Dict[str, Any]:
    """
    Fetch Codeforces-style metrics from CodeChef user profile page:
    rating, stars, division, problems solved, and global/country ranks.
    """
    cleaned_username = username.strip().rstrip("/").split("/")[-1]
    if not cleaned_username:
        raise ValueError("Invalid CodeChef handle provided.")

    url = f"{CODECHEF_BASE}/{cleaned_username}"

    async with httpx.AsyncClient(timeout=15.0, headers=HEADERS, follow_redirects=True) as client:
        try:
            resp = await client.get(url)
        except Exception as e:
            logger.error(f"CodeChef request error: {e}")
            raise RuntimeError("Failed to connect to CodeChef.")

        if resp.status_code == 404:
            raise ValueError(f"CodeChef user '{cleaned_username}' not found.")
        elif resp.status_code != 200:
            raise RuntimeError(f"CodeChef returned status code {resp.status_code}.")

        html = resp.text

        # Check if profile actually exists
        if "rating-header" not in html and "rating-number" not in html:
            if "Page not found" in html or "could not be found" in html:
                raise ValueError(f"CodeChef user '{cleaned_username}' does not exist.")

        # 1. Rating
        rating = 0
        rating_match = re.search(r'class="rating-number"[^>]*>\s*(\d+)', html)
        if rating_match:
            try:
                rating = int(rating_match.group(1))
            except Exception:
                rating = 0
        else:
            # Fallback to JS variable
            js_rating = re.search(r'var\s+current_user_rating\s*=\s*(\d+)', html)
            if js_rating:
                rating = int(js_rating.group(1))

        # 2. Highest Rating
        highest_rating = rating
        max_match = re.search(r'Highest Rating[^\d]*(\d+)', html)
        if max_match:
            try:
                highest_rating = int(max_match.group(1))
            except Exception:
                highest_rating = rating

        # 3. Stars
        stars_count = 0
        star_block = re.search(r'class="rating-star"[^>]*>([\s\S]*?)</div>', html)
        if star_block:
            # Count star glyphs or entities &#9733; / ★
            stars_count = star_block.group(1).count("&#9733;") or star_block.group(1).count("★")
        if stars_count == 0:
            # Derive stars from rating
            if rating >= 2500:
                stars_count = 7
            elif rating >= 2200:
                stars_count = 6
            elif rating >= 2000:
                stars_count = 5
            elif rating >= 1800:
                stars_count = 4
            elif rating >= 1600:
                stars_count = 3
            elif rating >= 1400:
                stars_count = 2
            elif rating > 0:
                stars_count = 1

        stars_label = f"{stars_count}★" if stars_count > 0 else "Unrated"

        # 4. Division
        division = "Div 3"
        div_match = re.search(r'\((Div\s*\d+)\)', html)
        if div_match:
            division = div_match.group(1)
        elif rating >= 2000:
            division = "Div 1"
        elif rating >= 1600:
            division = "Div 2"
        elif rating >= 1400:
            division = "Div 3"
        elif rating > 0:
            division = "Div 4"

        # 5. Global & Country Ranks
        ranks_match = re.findall(r'<div class="rating-ranks">[\s\S]*?<strong>\s*([^<]+)\s*</strong>[\s\S]*?<strong>\s*([^<]+)\s*</strong>', html)
        global_rank = None
        country_rank = None
        if ranks_match:
            g_str, c_str = ranks_match[0]
            g_str = g_str.strip()
            c_str = c_str.strip()
            if g_str.isdigit():
                global_rank = int(g_str)
            if c_str.isdigit():
                country_rank = int(c_str)

        # Fallback for ranks
        if global_rank is None:
            og_rank = re.search(r'global rank\s*(\d+)', html, re.IGNORECASE)
            if og_rank:
                global_rank = int(og_rank.group(1))

        # 6. Solved Problems Count
        total_solved = 0
        solved_match = re.search(r'Total Problems Solved:\s*(\d+)', html) or re.search(r'Fully Solved\s*\((\d+)\)', html)
        if solved_match:
            try:
                total_solved = int(solved_match.group(1))
            except Exception:
                total_solved = 0

        return {
            "username": cleaned_username,
            "rating": rating,
            "max_rating": highest_rating,
            "stars": stars_label,
            "stars_count": stars_count,
            "division": division,
            "global_rank": global_rank,
            "country_rank": country_rank,
            "total_solved": total_solved,
            "profile_url": f"https://www.codechef.com/users/{cleaned_username}"
        }
