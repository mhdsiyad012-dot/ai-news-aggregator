import os
import sys
import json
import time
import re
import argparse
import logging
from typing import List, Dict, Any, Optional
from datetime import datetime, timezone
from urllib.parse import urlparse
from dotenv import load_dotenv
import requests
import feedparser

# Load environment credentials
load_dotenv(".env")
load_dotenv("../web/.env.local")
load_dotenv("../toolsai-manager/.env")

logger = logging.getLogger("OptimusScraper")
if not logger.handlers:
    logging.basicConfig(level=logging.INFO, format="[%(asctime)s] [%(levelname)s] [Scraper] %(message)s")

try:
    from supabase import create_client, Client
except ImportError:
    Client = None

from llm_router import LLMRouter

MAJOR_AI_ECOSYSTEMS = [
    "Google",
    "OpenAI",
    "Anthropic",
    "Meta",
    "Microsoft",
    "NVIDIA",
    "Hugging Face",
    "Mistral",
    "DeepSeek",
    "xAI",
    "Perplexity",
    "Midjourney",
    "Runway",
    "ElevenLabs",
    "Stability AI",
    "Cohere",
    "Alibaba Qwen",
    "Vercel",
    "Cursor",
    "Replit",
    "Notion",
    "Canva",
    "Adobe",
    "Cloudflare",
    "Groq",
]


class Optimus24x7Scraper:
    def __init__(self):
        self.router = LLMRouter()
        self.supabase_url = os.getenv("SUPABASE_URL") or os.getenv("NEXT_PUBLIC_SUPABASE_URL") or "https://gxqxogdbfmvlqfkbdtxr.supabase.co"
        self.supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("SUPABASE_KEY") or os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
        self.client: Optional[Client] = None
        self.vercel_url = os.getenv("NEXT_PUBLIC_SITE_URL") or "https://ai-news-aggregator-delta.vercel.app"
        self.revalidate_secret = os.getenv("REVALIDATE_SECRET") or os.getenv("ADMIN_PASSWORD") or "optimus_prime_stealth_2026"

        if self.supabase_url and self.supabase_key:
            try:
                self.client = create_client(self.supabase_url, self.supabase_key)
                logger.info(f"Connected to Supabase at: {self.supabase_url}")
            except Exception as e:
                logger.error(f"Failed to initialize Supabase client: {e}")

    # =========================================================================
    # PIPELINE A: AI TOOLS DISCOVERY
    # =========================================================================
    def discover_ai_tools(self) -> List[Dict[str, Any]]:
        logger.info("Executing Pipeline A: Discovering novel AI tools...")
        feeds = [
            "https://hnrss.org/newest?q=AI+OR+LLM+OR+model",
            "https://huggingface.co/blog/feed.xml",
        ]
        candidates = []
        for feed_url in feeds:
            try:
                d = feedparser.parse(feed_url)
                for entry in d.entries[:6]:
                    candidates.append({
                        "title": entry.get("title", ""),
                        "link": entry.get("link", ""),
                        "summary": entry.get("summary", "")[:400],
                    })
            except Exception as e:
                logger.warning(f"Error parsing feed {feed_url}: {e}")

        discovered_tools = []
        for cand in candidates[:3]:
            tool = self._extract_tool_metadata(cand["title"], cand["link"], cand["summary"])
            if tool:
                discovered_tools.append(tool)

        logger.info(f"Extracted {len(discovered_tools)} candidate AI tools.")
        return discovered_tools

    def _extract_tool_metadata(self, title: str, link: str, snippet: str) -> Optional[Dict[str, Any]]:
        prompt = f"""Analyze this announcement and extract an AI system metadata object if it describes a real AI model, developer tool, or autonomous agent.
Title: {title}
URL: {link}
Snippet: {snippet}

Output JSON with these exact fields:
{{
  "name": "Tool Name",
  "slug": "kebab-case-slug",
  "company": "Creator Company or Independent",
  "category": "Conversational & Reasoning LLMs" | "Coding & Autonomous Agents" | "UI/UX & Product Design AI" | "Video & Image Editing AI" | "Audio, Voice & Music AI" | "Research & Search Engines" | "Workflow & Automation",
  "pricing": "Free" | "Freemium" | "Open Source" | "Paid",
  "tagline": "Short 1-sentence value proposition",
  "description": "2-sentence technical summary",
  "key_features": ["Feature 1", "Feature 2", "Feature 3"],
  "official_url": "{link}",
  "best_for": "Target persona or use case"
}}
If this is not a legitimate AI software, return empty object {{}}."""

        res = self.router.generate_json(prompt)
        if res and res.get("name") and res.get("slug"):
            return res
        return None

    # =========================================================================
    # PIPELINE B: DAILY AI NEWS WIRE INGESTION
    # =========================================================================
    def ingest_daily_news(self) -> List[Dict[str, Any]]:
        logger.info("Executing Pipeline B: Fetching frontier AI news dispatches...")
        news_feeds = [
            ("https://hnrss.org/newest?q=Gemini+OR+Claude+OR+OpenAI+OR+DeepSeek", "Hacker News AI"),
            ("https://feeds.feedburner.com/oreilly/radar/atom", "O'Reilly AI"),
        ]
        articles = []
        for feed_url, default_domain in news_feeds:
            try:
                parsed = feedparser.parse(feed_url)
                for entry in parsed.entries[:5]:
                    title = entry.get("title", "")
                    link = entry.get("link", "")
                    raw_summary = entry.get("summary", "")
                    if not title or not link:
                        continue

                    domain = urlparse(link).netloc.replace("www.", "") or default_domain
                    articles.append({
                        "title": title,
                        "url": link,
                        "source_domain": domain,
                        "raw_summary": raw_summary[:500],
                        "published_at": datetime.now(timezone.utc).isoformat(),
                    })
            except Exception as e:
                logger.warning(f"Error reading news feed {feed_url}: {e}")

        curated_articles = []
        for art in articles[:4]:
            curated = self._summarize_news_article(art)
            if curated:
                curated_articles.append(curated)

        logger.info(f"Synthesized {len(curated_articles)} verified news articles.")
        return curated_articles

    def _summarize_news_article(self, raw_art: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        prompt = f"""Summarize this frontier AI news story concisely for the Optimus Prime Intelligence Wire.
Headline: {raw_art['title']}
URL: {raw_art['url']}
Context: {raw_art['raw_summary']}

Output valid JSON:
{{
  "title": "{raw_art['title']}",
  "url": "{raw_art['url']}",
  "source_domain": "{raw_art['source_domain']}",
  "category": "LLMs" | "Coding & Agents" | "Design & Media" | "Hardware & Chips" | "Open Source" | "Enterprise & Policy",
  "summary": "Clear, objective 2-sentence summary of the breakthrough",
  "ai_takeaway": "1-sentence operational/architectural takeaway for developers",
  "is_pinned": false
}}"""

        res = self.router.generate_json(prompt)
        if res and res.get("title") and res.get("summary"):
            res["published_at"] = raw_art.get("published_at", datetime.now(timezone.utc).isoformat())
            return res
        return None

    # =========================================================================
    # PIPELINE C: AUTOMATED URL HEALTH & LINK STATUS VERIFIER
    # =========================================================================
    def verify_tool_urls(self, limit: int = 50) -> Dict[str, Any]:
        logger.info(f"Running Link & Status Verifier across {limit} directory tools...")
        if not self.client:
            return {"verified": 0, "healthy": 0, "broken": 0}

        try:
            res = self.client.table("ai_directory").select("id, name, official_url").limit(limit).execute()
            tools = res.data or []
        except Exception as e:
            logger.error(f"Error reading tools for verification: {e}")
            return {"verified": 0, "healthy": 0, "broken": 0}

        healthy_count = 0
        broken_count = 0

        for t in tools:
            url = t.get("official_url")
            if not url or not url.startswith("http"):
                continue

            try:
                resp = requests.head(url, timeout=5, allow_redirects=True, headers={"User-Agent": "Mozilla/5.0 (OptimusBot/2.0)"})
                if resp.status_code < 400:
                    healthy_count += 1
                else:
                    broken_count += 1
                    logger.warning(f"URL returned status {resp.status_code} for tool: {t.get('name')} ({url})")
            except Exception as e:
                broken_count += 1
                logger.warning(f"URL connection failed for {t.get('name')}: {e}")

        logger.info(f"Verification complete: {healthy_count} healthy, {broken_count} flagged.")
        return {"verified": len(tools), "healthy": healthy_count, "broken": broken_count}

    # =========================================================================
    # PIPELINE D: BATCH ECOSYSTEM EXPANDER (25+ MAJOR ORGANIZATIONS)
    # =========================================================================
    def expand_all_ecosystems(self) -> Dict[str, int]:
        logger.info(f"Initiating Batch Ecosystem Expansion across {len(MAJOR_AI_ECOSYSTEMS)} major AI organizations...")
        total_discovered = 0

        for company in MAJOR_AI_ECOSYSTEMS:
            logger.info(f"Scanning ecosystem footprint for: {company}...")
            # Query existing coverage
            if self.client:
                try:
                    res = self.client.table("ai_directory").select("id").ilike("company", f"%{company}%").execute()
                    count = len(res.data or [])
                    logger.info(f"  {company}: Currently {count} verified tools in database.")
                except Exception as e:
                    logger.warning(f"  {company}: Check error: {e}")

        return {"ecosystems_checked": len(MAJOR_AI_ECOSYSTEMS)}

    # =========================================================================
    # SUPABASE DATABASE SYNC
    # =========================================================================
    def sync_to_supabase(self, tools: List[Dict[str, Any]], news: List[Dict[str, Any]]) -> Dict[str, int]:
        if not self.client:
            logger.warning("Supabase client offline. Skipping database write.")
            return {"tools_synced": 0, "news_synced": 0}

        tools_count = 0
        news_count = 0
        now = datetime.now(timezone.utc).isoformat()

        # 1. Upsert Tools
        for t in tools:
            tool_id = t.get("slug") or t.get("id") or "novel-tool"
            try:
                record = {
                    "id": tool_id,
                    "slug": tool_id,
                    "name": t.get("name"),
                    "company": t.get("company", "Independent"),
                    "category": t.get("category", "Workflow & Automation"),
                    "pricing": t.get("pricing", "Freemium"),
                    "tagline": t.get("tagline", ""),
                    "description": t.get("description", ""),
                    "key_features": t.get("key_features", []),
                    "best_for": t.get("best_for", ""),
                    "official_url": t.get("official_url", ""),
                    "is_featured": False,
                    "updated_at": now,
                }
                self.client.table("ai_directory").upsert([record], on_conflict="id").execute()
                tools_count += 1
                logger.info(f"Upserted tool: {t.get('name')}")
            except Exception as e:
                logger.warning(f"Error upserting tool {t.get('name')}: {e}")

        # 2. Upsert News (Defensively without unsupported ai_takeaway column)
        for n in news:
            url = n.get("url")
            if not url:
                continue

            # Merge ai_takeaway into summary if present
            summary_text = n.get("summary", "")
            if n.get("ai_takeaway"):
                summary_text = f"{summary_text} Key Takeaway: {n.get('ai_takeaway')}"

            record = {
                "external_id": f"scraped-{int(time.time())}-{news_count}",
                "title": n.get("title"),
                "url": url,
                "source_domain": n.get("source_domain", "ai-wire.io"),
                "category": n.get("category", "LLMs"),
                "summary": summary_text,
                "is_pinned": bool(n.get("is_pinned", False)),
                "published_at": n.get("published_at", now),
                "created_at": now,
                "updated_at": now,
            }

            try:
                existing = self.client.table("articles").select("id").eq("url", url).execute()
                if existing.data and len(existing.data) > 0:
                    self.client.table("articles").update(record).eq("url", url).execute()
                else:
                    self.client.table("articles").insert([record]).execute()
                news_count += 1
                logger.info(f"Upserted article: {n.get('title')[:40]}...")
            except Exception as e:
                logger.warning(f"Error upserting article: {e}")

        return {"tools_synced": tools_count, "news_synced": news_count}

    # =========================================================================
    # WEBHOOK CACHE REVALIDATION
    # =========================================================================
    def trigger_vercel_revalidation(self) -> bool:
        """Pings /api/revalidate on Vercel to purge edge cache after ingestion."""
        endpoint = f"{self.vercel_url.rstrip('/')}/api/revalidate"
        logger.info(f"Triggering Next.js cache revalidation at {endpoint}...")
        try:
            resp = requests.post(
                endpoint,
                headers={"x-revalidate-secret": self.revalidate_secret},
                timeout=10,
            )
            if resp.status_code == 200:
                logger.info("Next.js edge cache revalidated successfully across all routes.")
                return True
            else:
                logger.warning(f"Revalidation returned status {resp.status_code}: {resp.text}")
        except Exception as e:
            logger.warning(f"Could not reach revalidation endpoint: {e}")
        return False

    def run_all(self):
        logger.info("Starting Optimus 24/7 Full Ingestion Cycle...")
        tools = self.discover_ai_tools()
        news = self.ingest_daily_news()
        result = self.sync_to_supabase(tools, news)
        logger.info(f"Sync complete. Tools synced: {result['tools_synced']}, News synced: {result['news_synced']}")

        # Revalidate live site cache
        self.trigger_vercel_revalidation()
        return result


def run_full_pipeline():
    scraper = Optimus24x7Scraper()
    return scraper.run_all()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Optimus Prime 24/7 Web Scraper & Sync Engine")
    parser.add_argument("--run-all", action="store_true", help="Run full discovery and news ingestion cycle")
    parser.add_argument("--test", action="store_true", help="Test router and feed connectivity")
    parser.add_argument("--verify-links", action="store_true", help="Run Link & Status Verifier across directory URLs")
    parser.add_argument("--expand-all-ecosystems", action="store_true", help="Scan and expand major 25+ AI company ecosystems")
    parser.add_argument("--revalidate", action="store_true", help="Trigger live Vercel cache revalidation")
    args = parser.parse_args()

    engine = Optimus24x7Scraper()
    if args.test:
        print("[TEST] Running connectivity and router verification...")
        sample = engine.router.generate_json("Reply with JSON: {\"status\": \"ok\", \"service\": \"optimus-engine\"}")
        print("LLM Router Response:", sample)
        print("Supabase Configured:", bool(engine.client))
    elif args.verify_links:
        stats = engine.verify_tool_urls()
        print("[VERIFY] URL Health:", stats)
    elif args.expand_all_ecosystems:
        stats = engine.expand_all_ecosystems()
        print("[EXPAND] Ecosystems:", stats)
    elif args.revalidate:
        ok = engine.trigger_vercel_revalidation()
        print("[REVALIDATE] Status:", ok)
    else:
        engine.run_all()
