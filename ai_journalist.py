"""Fetch real RSS headlines, summarize them, and save them to Postgres."""

import os
from html.parser import HTMLParser
from urllib.parse import urlsplit

import feedparser
import requests
from google import genai
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError

from database import NewsArticle, SessionLocal, init_db


FEED_URL = "https://techcrunch.com/feed/"
MODEL = os.environ.get("GEMINI_MODEL", "gemini-3.5-flash-lite")


class TextOnly(HTMLParser):
    def __init__(self):
        super().__init__()
        self.parts = []

    def handle_data(self, data):
        self.parts.append(data)


def plain_text(html: str | None) -> str:
    parser = TextOnly()
    parser.feed(html or "")
    return " ".join(" ".join(parser.parts).split())


def fetch_news():
    response = requests.get(
        FEED_URL,
        headers={"User-Agent": "DailyTechDigest/1.0 (personal RSS reader)"},
        timeout=20,
    )
    response.raise_for_status()
    feed = feedparser.parse(response.content)
    if not feed.entries:
        raise RuntimeError("The RSS feed returned no articles.")
    return feed.entries[:5]


def summarize(client, title: str, excerpt: str) -> str:
    prompt = (
        "Summarize this RSS item in two short, neutral sentences. Use only the "
        "title and excerpt below. Do not invent facts or imply you read the full "
        "article. If details are missing, say so.\n\n"
        f"Title: {title}\nExcerpt: {excerpt[:2000]}"
    )
    try:
        response = client.models.generate_content(model=MODEL, contents=prompt)
        summary = (response.text or "").strip()
        if summary:
            return summary
    except Exception as exc:
        print(f"Gemini summary unavailable ({type(exc).__name__}); using a source link instead.")
    return "AI summary unavailable. Open the publisher link to read this story."


def get_real_news() -> int:
    if not os.environ.get("DATABASE_URL"):
        raise RuntimeError("Set DATABASE_URL to your Supabase connection URI before running the journalist.")
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise RuntimeError("Set GEMINI_API_KEY before running the journalist.")

    entries = fetch_news()
    init_db()
    saved = 0
    client = genai.Client(api_key=api_key)
    try:
        with SessionLocal() as db:
            for entry in entries:
                title = plain_text(entry.get("title", "")).strip()[:300]
                url = entry.get("link", "").strip()
                parsed_url = urlsplit(url)
                if not title or parsed_url.scheme not in ("http", "https") or not parsed_url.netloc or len(url) > 2048:
                    print("Skipping an RSS entry with an invalid title or URL.")
                    continue
                if db.scalar(select(NewsArticle.id).where(NewsArticle.url == url)):
                    print(f"Already saved: {title}")
                    continue

                excerpt = plain_text(entry.get("summary", ""))
                summary = summarize(client, title, excerpt)
                db.add(NewsArticle(title=title, summary=summary, url=url, category="Tech News"))
                try:
                    db.commit()
                    saved += 1
                    print(f"Saved: {title}")
                except IntegrityError:
                    db.rollback()
                    print(f"Skipped duplicate: {title}")
    finally:
        client.close()

    print(f"Finished. {saved} new articles saved.")
    return saved


if __name__ == "__main__":
    try:
        get_real_news()
    except RuntimeError as exc:
        raise SystemExit(str(exc)) from exc
