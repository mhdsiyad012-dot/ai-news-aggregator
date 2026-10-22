"""Fetch real RSS headlines from multiple AI/tech feeds, summarize and auto-categorize with Google Gemini, and save to database."""

import json
import os
import re
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit

import feedparser
import requests
from google import genai
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError

# Ensure pipeline dir is in sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent))

from database import NewsArticle, SessionLocal, init_db

FEEDS = [
    {
        "source": "TechCrunch AI",
        "url": "https://techcrunch.com/category/artificial-intelligence/feed/",
    },
    {
        "source": "VentureBeat AI",
        "url": "https://venturebeat.com/category/ai/feed/",
    },
    {
        "source": "The Verge Tech",
        "url": "https://www.theverge.com/rss/index.xml",
    },
    {
        "source": "Ars Technica",
        "url": "https://feeds.arstechnica.com/arstechnica/technology-lab",
    },
    {
        "source": "MIT Tech Review",
        "url": "https://www.technologyreview.com/feed/",
    },
]

ALLOWED_CATEGORIES = ["LLMs", "Code Builders", "Hardware", "Robotics", "Startups"]
DEFAULT_CATEGORY = "LLMs"
MODEL = os.environ.get("GEMINI_MODEL", "gemini-2.0-flash")


class TextOnly(HTMLParser):
    def __init__(self):
        super().__init__()
        self.parts = []

    def handle_data(self, data):
        self.parts.append(data)


def plain_text(html: str | None) -> str:
    if not html:
        return ""
    parser = TextOnly()
    parser.feed(html)
    return " ".join(" ".join(parser.parts).split())


def fetch_multi_feed_articles(limit_per_feed: int = 4) -> list[dict]:
    """Fetch entries across multiple curated tech and AI feeds."""
    headers = {"User-Agent": "AITechDigest/2.0 (Editorial News Pipeline)"}
    collected = []
    seen_links = set()

    for feed_info in FEEDS:
        url = feed_info["url"]
        source_name = feed_info["source"]
        try:
            response = requests.get(url, headers=headers, timeout=15)
            response.raise_for_status()
            parsed = feedparser.parse(response.content)
            entries = parsed.entries[:limit_per_feed]
            for e in entries:
                link = e.get("link", "").strip()
                if not link or link in seen_links:
                    continue
                seen_links.add(link)
                collected.append({
                    "title": plain_text(e.get("title", "")).strip(),
                    "link": link,
                    "summary_raw": plain_text(e.get("summary", "") or e.get("description", "")),
                    "source": source_name,
                })
        except Exception as exc:
            print(f"Warning: Failed to fetch feed {source_name} ({url}): {exc}")

    print(f"Fetched {len(collected)} candidate articles from {len(FEEDS)} feeds.")
    return collected


def fallback_categorize(text: str) -> str:
    """Heuristic classification if AI response does not specify a valid category."""
    text_lower = text.lower()
    if any(k in text_lower for k in ["robot", "humanoid", "boston dynamics", "figure ai", "actuator", "bipedal"]):
        return "Robotics"
    if any(k in text_lower for k in ["gpu", "nvidia", "blackwell", "semiconductor", "tsmc", "chip", "quantum", "intel", "amd"]):
        return "Hardware"
    if any(k in text_lower for k in ["copilot", "cursor", "windsurf", "ide", "coding", "code builder", "devin", "v0", "compiler"]):
        return "Code Builders"
    if any(k in text_lower for k in ["fundrais", "seed round", "series a", "series b", "venture", "startup", "valuation", "acquisition"]):
        return "Startups"
    return "LLMs"


def summarize_and_categorize(client, title: str, excerpt: str) -> tuple[str, str]:
    """Use Google GenAI SDK to generate an editorial summary and classify category."""
    categories_str = ", ".join(ALLOWED_CATEGORIES)
    prompt = f"""You are an executive editor for an industrial AI & technology intelligence wire.
Analyze the following RSS news item:

Title: {title}
Excerpt: {excerpt[:2500]}

Tasks:
1. Provide a sharp, high-density 2-sentence neutral summary suitable for senior software engineers and research scientists.
2. Select the single most accurate category from this strict list: [{categories_str}].

Respond ONLY with valid JSON in this exact structure:
{{
  "summary": "Concise two-sentence editorial summary.",
  "category": "Chosen Category"
}}"""

    try:
        response = client.models.generate_content(
            model=MODEL,
            contents=prompt,
        )
        raw_text = (response.text or "").strip()
        # Clean any markdown code blocks
        clean_json = re.sub(r"^```(?:json)?|```$", "", raw_text, flags=re.MULTILINE).strip()
        data = json.loads(clean_json)
        summary = data.get("summary", "").strip()
        cat = data.get("category", "").strip()
        if cat not in ALLOWED_CATEGORIES:
            cat = fallback_categorize(f"{title} {excerpt}")
        if summary:
            return summary, cat
    except Exception as exc:
        print(f"Gemini processing unavailable for '{title[:40]}...' ({type(exc).__name__}). Using fallback.")

    # Fallback if API fails or parse fails
    fallback_cat = fallback_categorize(f"{title} {excerpt}")
    fallback_summary = excerpt[:280] if len(excerpt) > 40 else f"Editorial coverage on '{title}'. View full report via publisher link."
    return fallback_summary, fallback_cat


def get_real_news() -> int:
    """Fetch from feeds, process with Gemini, and persist to database."""
    init_db()
    
    api_key = os.environ.get("GEMINI_API_KEY")
    client = None
    if api_key:
        client = genai.Client(api_key=api_key)
    else:
        print("Notice: GEMINI_API_KEY not set. Operating in heuristic fallback mode.")

    articles = fetch_multi_feed_articles(limit_per_feed=5)
    saved = 0

    try:
        with SessionLocal() as db:
            for item in articles:
                title = item["title"][:300]
                url = item["link"]
                parsed_url = urlsplit(url)

                if not title or parsed_url.scheme not in ("http", "https") or not parsed_url.netloc or len(url) > 2048:
                    continue

                # Check if already present in database
                if db.scalar(select(NewsArticle.id).where(NewsArticle.url == url)):
                    continue

                if client:
                    summary, category = summarize_and_categorize(client, title, item["summary_raw"])
                else:
                    category = fallback_categorize(f"{title} {item['summary_raw']}")
                    summary = item["summary_raw"][:280] or f"Latest update on {title}."

                db.add(
                    NewsArticle(
                        title=title,
                        summary=summary,
                        url=url,
                        category=category,
                        source_name=item.get("source", "Intelligence Wire"),
                        related_tools="",
                        is_pinned=False,
                        published_at="Recent",
                    )
                )
                try:
                    db.commit()
                    saved += 1
                    print(f"[{category}] Saved: {title}")
                except IntegrityError:
                    db.rollback()
                    print(f"Skipped duplicate: {title}")

    finally:
        if client:
            client.close()

    print(f"Finished pipeline run. {saved} new articles saved to database.")
    return saved


if __name__ == "__main__":
    try:
        get_real_news()
    except Exception as err:
        print(f"Pipeline execution encountered error: {err}")
        sys.exit(1)
