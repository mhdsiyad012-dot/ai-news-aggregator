"""Optimus Prime 24/7 Multi-Source Autonomous Scraper & Supabase Ingestion Engine.

Features:
1. Live Internet Data Pull from 4 Public Sources on EVERY run:
   - Source 1: OpenRouter Live Models API (https://openrouter.ai/api/v1/models)
   - Source 2: Hugging Face Live Trending Models (Top 25) & Spaces (Top 15)
   - Source 3: GitHub Live Trending AI Repositories (Top 25)
   - Source 4: Live AI News RSS Feeds (Google AI, OpenAI, TechCrunch AI, The Verge AI, Hacker News AI)
2. Dynamic Gemini Model Auto-Discovery & Multi-LLM Universal Failover via llm_router.
3. Zero-Key Deterministic Extractor Fallback: If all LLMs fail/rate-limit, extracts clean
   structured records directly from telemetry and RSS so 24/7 sync NEVER fails.
4. Exact Supabase schema alignment for public.ai_directory and public.articles.
5. Automated Vercel Edge Cache Revalidation.
"""

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

COMPANY_PREFIX_MAP = {
    "google": "Google",
    "openai": "OpenAI",
    "anthropic": "Anthropic",
    "x-ai": "xAI",
    "deepseek": "DeepSeek",
    "meta-llama": "Meta",
    "meta": "Meta",
    "mistralai": "Mistral AI",
    "mistral": "Mistral AI",
    "qwen": "Alibaba Qwen",
    "cohere": "Cohere",
    "minimax": "MiniMax",
    "moonshotai": "Moonshot AI",
    "z-ai": "Zhipu AI",
    "nvidia": "NVIDIA",
    "microsoft": "Microsoft",
    "bytedance": "ByteDance",
    "amazon": "Amazon AWS",
    "nousresearch": "Nous Research",
}


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
    # PIPELINE 1: LIVE AI TOOLS DISCOVERY (SOURCES 1, 2, 3)
    # =========================================================================
    def discover_ai_tools(self) -> List[Dict[str, Any]]:
        logger.info("Executing Pipeline 1: Live Discovery via OpenRouter, Hugging Face & GitHub...")
        tools_by_slug: Dict[str, Dict[str, Any]] = {}
        now_iso = datetime.now(timezone.utc).isoformat()

        # ---------------------------------------------------------------------
        # SOURCE 1: OpenRouter Live Models API (GET https://openrouter.ai/api/v1/models)
        # ---------------------------------------------------------------------
        try:
            r = requests.get(
                "https://openrouter.ai/api/v1/models",
                headers={"User-Agent": "Optimus-AI-Platform/2.0"},
                timeout=12
            )
            if r.status_code == 200:
                models = r.json().get("data", [])
                models.sort(key=lambda m: m.get("created", 0), reverse=True)
                for m in models[:45]:
                    mid = m.get("id", "")
                    if not mid:
                        continue
                    slug = re.sub(r"[^a-z0-9]+", "-", mid.lower()).strip("-")
                    name = m.get("name") or mid.split("/")[-1].replace("-", " ").title()
                    prefix = mid.split("/")[0].lower() if "/" in mid else "opensource"
                    company = COMPANY_PREFIX_MAP.get(prefix, prefix.capitalize())

                    is_free = (m.get("pricing", {}).get("prompt") == 0)
                    pricing = "Free" if is_free else ("Open Source" if "llama" in mid.lower() or "qwen" in mid.lower() or "deepseek" in mid.lower() else "Paid")
                    
                    category = "Conversational & Reasoning LLMs"
                    if any(w in mid.lower() for w in ["code", "coder", "dev", "agent"]):
                        category = "Coding & Autonomous Agents"
                    elif any(w in mid.lower() for w in ["vision", "vl", "multimodal", "image", "audio"]):
                        category = "Video & Image Editing AI"

                    context = m.get("context_length", 128000)
                    desc = m.get("description") or f"{name} is a frontier neural architecture released by {company} with {context:,} context window."
                    tagline = desc.split(".")[0].strip()[:120] + "."

                    tool_record = {
                        "id": slug,
                        "slug": slug,
                        "name": name,
                        "company": company,
                        "category": category,
                        "secondary_categories": ["LLMs", "APIs"],
                        "tagline": tagline,
                        "description": desc,
                        "key_features": [
                            f"Context: {context:,} tokens",
                            f"Provider: OpenRouter ({mid})",
                            f"Pricing Tier: {pricing}",
                            "Low-latency streaming & function calling",
                        ],
                        "best_for": "Production applications, frontier reasoning, and agentic workflows",
                        "pricing": pricing,
                        "official_url": f"https://openrouter.ai/{mid}",
                        "is_featured": company in ["Google", "OpenAI", "Anthropic", "xAI", "DeepSeek", "Meta"],
                        "architecture_details": f"Live OpenRouter telemetry: {mid} (context: {context:,})",
                        "company_background": f"{company} AI ecosystem node.",
                        "related_tool_slugs": [],
                        "updated_at": now_iso,
                    }
                    tools_by_slug[slug] = tool_record
                logger.info(f"Source 1 (OpenRouter): Parsed {len(tools_by_slug)} models.")
        except Exception as e:
            logger.warning(f"Source 1 (OpenRouter) error: {e}")

        # ---------------------------------------------------------------------
        # SOURCE 2: Hugging Face Live Trending Models & Spaces
        # ---------------------------------------------------------------------
        try:
            # Trending Models Top 25
            hf_url = "https://huggingface.co/api/models?sort=trendingScore&direction=-1&limit=25"
            r = requests.get(hf_url, headers={"User-Agent": "Optimus-AI-Platform/2.0"}, timeout=10)
            if r.status_code != 200:
                hf_url = "https://huggingface.co/api/models?sort=likes&direction=-1&limit=25"
                r = requests.get(hf_url, headers={"User-Agent": "Optimus-AI-Platform/2.0"}, timeout=10)

            if r.status_code == 200:
                for hf in r.json():
                    hid = hf.get("id", "")
                    if not hid:
                        continue
                    slug = re.sub(r"[^a-z0-9]+", "-", hid.lower()).strip("-")
                    author = hid.split("/")[0] if "/" in hid else "Open Source"
                    name = hid.split("/")[-1].replace("-", " ").title()
                    ptag = hf.get("pipeline_tag") or "open-weights"
                    likes = hf.get("likes", 0)

                    category = "Video & Image Editing AI" if any(w in ptag for w in ["image", "video", "diffusion"]) else (
                        "Audio, Voice & Music AI" if any(w in ptag for w in ["audio", "speech", "tts", "asr"]) else (
                            "Coding & Autonomous Agents" if any(w in ptag for w in ["code", "text2code"]) else "Conversational & Reasoning LLMs"
                        )
                    )

                    tools_by_slug[slug] = {
                        "id": slug,
                        "slug": slug,
                        "name": name,
                        "company": author,
                        "category": category,
                        "secondary_categories": ["Open Source", "Hugging Face"],
                        "tagline": f"Trending open-weight AI model by {author} with {likes:,} likes.",
                        "description": f"Trending open-weights AI model {hid} on Hugging Face. Pipeline: {ptag}. Community likes: {likes:,}.",
                        "key_features": [
                            "Hugging Face Trending Top-25",
                            f"Community Stars: {likes:,} likes",
                            f"Pipeline Task: {ptag}",
                            "Open Weights Community Model",
                        ],
                        "best_for": "Open-source research, fine-tuning, and self-hosted inference",
                        "pricing": "Open Source",
                        "official_url": f"https://huggingface.co/{hid}",
                        "is_featured": likes > 500,
                        "architecture_details": f"Hugging Face Pipeline: {ptag} ({hid})",
                        "company_background": f"{author} open source community.",
                        "related_tool_slugs": [],
                        "updated_at": now_iso,
                    }

            # Trending Spaces Top 15
            sp_url = "https://huggingface.co/api/spaces?sort=trendingScore&direction=-1&limit=15"
            r_sp = requests.get(sp_url, headers={"User-Agent": "Optimus-AI-Platform/2.0"}, timeout=10)
            if r_sp.status_code != 200:
                sp_url = "https://huggingface.co/api/spaces?sort=likes&direction=-1&limit=15"
                r_sp = requests.get(sp_url, headers={"User-Agent": "Optimus-AI-Platform/2.0"}, timeout=10)

            if r_sp.status_code == 200:
                for sp in r_sp.json():
                    sid = sp.get("id", "")
                    if not sid:
                        continue
                    slug = f"space-{re.sub(r'[^a-z0-9]+', '-', sid.lower()).strip('-')}"
                    author = sid.split("/")[0] if "/" in sid else "Hugging Face"
                    name = f"{sid.split('/')[-1].replace('-', ' ').title()} (Space)"
                    likes = sp.get("likes", 0)

                    tools_by_slug[slug] = {
                        "id": slug,
                        "slug": slug,
                        "name": name,
                        "company": author,
                        "category": "UI/UX & Product Design AI",
                        "secondary_categories": ["Interactive Demo", "Spaces"],
                        "tagline": f"Interactive AI application demo hosted on Hugging Face Spaces ({likes:,} likes).",
                        "description": f"Live interactive AI demo space {sid} hosted on Hugging Face Spaces. Free browser-based testing and evaluation.",
                        "key_features": [
                            "Interactive Browser AI Sandbox",
                            f"{likes:,} Hugging Face Community Likes",
                            "Instant Zero-Install Live Demo",
                            "Open Source Deployment",
                        ],
                        "best_for": "Evaluating cutting-edge AI models directly in the browser",
                        "pricing": "Free",
                        "official_url": f"https://huggingface.co/spaces/{sid}",
                        "is_featured": False,
                        "architecture_details": f"Hugging Face Space: {sid}",
                        "company_background": f"{author} community space.",
                        "related_tool_slugs": [],
                        "updated_at": now_iso,
                    }
                logger.info(f"Source 2 (Hugging Face): Cumulative tools: {len(tools_by_slug)}.")
        except Exception as e:
            logger.warning(f"Source 2 (Hugging Face) error: {e}")

        # ---------------------------------------------------------------------
        # SOURCE 3: GitHub Live Trending AI Repositories (Top 25)
        # ---------------------------------------------------------------------
        try:
            gh_url = "https://api.github.com/search/repositories?q=topic:ai+sort:stars&order=desc&per_page=25"
            r_gh = requests.get(
                gh_url,
                headers={"User-Agent": "Optimus-AI-Platform/2.0", "Accept": "application/vnd.github.v3+json"},
                timeout=10
            )
            if r_gh.status_code == 200:
                gh_items = r_gh.json().get("items", [])
                for gh in gh_items:
                    full_name = gh.get("full_name", "")
                    if not full_name:
                        continue
                    slug = f"gh-{re.sub(r'[^a-z0-9]+', '-', full_name.lower()).strip('-')}"
                    name = gh.get("name", "").replace("-", " ").title()
                    owner = gh.get("owner", {}).get("login", "Open Source")
                    stars = gh.get("stargazers_count", 0)
                    desc = gh.get("description") or f"Trending AI developer framework {full_name} on GitHub."
                    html_url = gh.get("html_url", "")
                    topics = gh.get("topics", [])

                    category = "Coding & Autonomous Agents"
                    if any(t in ["llm", "chatgpt", "gpt", "reasoning"] for t in topics):
                        category = "Conversational & Reasoning LLMs"
                    elif any(t in ["workflow", "automation", "pipeline"] for t in topics):
                        category = "Workflow & Automation"
                    elif any(t in ["vision", "diffusion", "image-generation"] for t in topics):
                        category = "Video & Image Editing AI"

                    tools_by_slug[slug] = {
                        "id": slug,
                        "slug": slug,
                        "name": name,
                        "company": owner,
                        "category": category,
                        "secondary_categories": ["Developer Frameworks", "Open Source"],
                        "tagline": (desc.split(".")[0].strip() or f"Trending AI repository by {owner}")[:120] + f" ({stars:,} stars).",
                        "description": desc,
                        "key_features": [
                            f"GitHub Stars: {stars:,}",
                            f"Repository: {full_name}",
                            f"License: {gh.get('license', {}).get('spdx_id') or 'Open Source'}",
                            "Active community & developer documentation",
                        ],
                        "best_for": "Developers, AI researchers, and agent framework engineers",
                        "pricing": "Open Source",
                        "official_url": html_url,
                        "is_featured": stars > 15000,
                        "architecture_details": f"GitHub Repo: {full_name} ({stars:,} stars)",
                        "company_background": f"{owner} GitHub organization.",
                        "related_tool_slugs": [],
                        "updated_at": now_iso,
                    }
                logger.info(f"Source 3 (GitHub): Cumulative tools: {len(tools_by_slug)}.")
        except Exception as e:
            logger.warning(f"Source 3 (GitHub) error: {e}")

        tools_list = list(tools_by_slug.values())
        logger.info(f"Total novel tools extracted across Sources 1, 2, 3: {len(tools_list)}")
        return tools_list

    # =========================================================================
    # PIPELINE 2: LIVE AI NEWS WIRE (SOURCE 4)
    # =========================================================================
    def ingest_daily_news(self) -> List[Dict[str, Any]]:
        logger.info("Executing Pipeline 2: Live AI News RSS Feeds (Source 4)...")
        news_feeds = [
            ("Google AI Blog", "https://blog.google/technology/ai/rss/", "blog.google"),
            ("OpenAI News", "https://openai.com/news/rss.xml", "openai.com"),
            ("TechCrunch AI", "https://techcrunch.com/category/artificial-intelligence/feed/", "techcrunch.com"),
            ("The Verge AI", "https://www.theverge.com/rss/ai-artificial-intelligence/index.xml", "theverge.com"),
            ("Hacker News AI", "https://hnrss.org/newest?q=AI+OR+LLM+OR+Gemini+OR+GPT+OR+Claude&points=50", "news.ycombinator.com"),
        ]

        raw_articles: List[Dict[str, Any]] = []
        for feed_name, feed_url, default_domain in news_feeds:
            try:
                parsed = feedparser.parse(feed_url)
                logger.info(f"  {feed_name}: Fetched {len(parsed.entries)} raw entries.")
                for entry in parsed.entries[:6]:
                    title = entry.get("title", "").strip()
                    link = entry.get("link", "").strip()
                    raw_summary = entry.get("summary") or entry.get("description") or ""
                    # Strip basic HTML tags
                    raw_summary = re.sub(r"<[^>]+>", "", raw_summary).strip()
                    if not title or not link:
                        continue

                    domain = urlparse(link).netloc.replace("www.", "") or default_domain
                    raw_articles.append({
                        "title": title,
                        "url": link,
                        "source_domain": domain,
                        "raw_summary": raw_summary[:600],
                        "published_at": entry.get("published", "") or datetime.now(timezone.utc).isoformat(),
                    })
            except Exception as e:
                logger.warning(f"Error reading feed {feed_name} ({feed_url}): {e}")

        curated_articles: List[Dict[str, Any]] = []
        for art in raw_articles[:6]:
            curated = self._process_article_with_fallback(art)
            if curated:
                curated_articles.append(curated)

        logger.info(f"Synthesized {len(curated_articles)} verified news dispatches.")
        return curated_articles

    def _process_article_with_fallback(self, raw_art: Dict[str, Any]) -> Dict[str, Any]:
        """Tries LLM summarization, and if LLMs fail/rate-limit, uses Zero-Key Deterministic Extractor."""
        prompt = f"""Summarize this frontier AI news story concisely for the Optimus Prime Intelligence Wire.
Headline: {raw_art['title']}
URL: {raw_art['url']}
Context: {raw_art['raw_summary']}

Output valid JSON with these exact keys:
{{
  "title": "{raw_art['title']}",
  "url": "{raw_art['url']}",
  "source_domain": "{raw_art['source_domain']}",
  "category": "LLMs" | "Coding & Agents" | "Design & Media" | "Hardware & Chips" | "Open Source" | "Enterprise & Policy",
  "summary": "Clear, objective 2-sentence summary of the breakthrough",
  "ai_takeaway": "1-sentence operational takeaway for developers"
}}"""

        res = self.router.generate_json(prompt)
        if res and res.get("title") and res.get("summary"):
            summary_text = res.get("summary", "")
            if res.get("ai_takeaway"):
                summary_text = f"{summary_text} Key Takeaway: {res.get('ai_takeaway')}"
            return {
                "title": res.get("title", raw_art["title"]),
                "url": raw_art["url"],
                "source_domain": raw_art["source_domain"],
                "category": res.get("category", "LLMs"),
                "summary": summary_text,
                "is_pinned": False,
                "published_at": raw_art.get("published_at", datetime.now(timezone.utc).isoformat()),
            }

        # Zero-Key Deterministic Extractor Fallback
        title_lower = raw_art["title"].lower()
        category = "LLMs"
        if any(w in title_lower for w in ["code", "developer", "agent", "software"]):
            category = "Coding & Agents"
        elif any(w in title_lower for w in ["chip", "nvidia", "gpu", "hardware", "tpu"]):
            category = "Hardware & Chips"
        elif any(w in title_lower for w in ["image", "video", "voice", "music", "design"]):
            category = "Design & Media"
        elif any(w in title_lower for w in ["open source", "hugging face", "weights"]):
            category = "Open Source"
        elif any(w in title_lower for w in ["policy", "law", "regulation", "safety"]):
            category = "Enterprise & Policy"

        summary = raw_art["raw_summary"]
        if not summary or len(summary) < 20:
            summary = f"{raw_art['title']} reported on {raw_art['source_domain']} covering frontier AI ecosystem developments."
        else:
            summary = summary.split(".")[0].strip() + ". Full coverage and technical documentation available at primary source."

        return {
            "title": raw_art["title"],
            "url": raw_art["url"],
            "source_domain": raw_art["source_domain"],
            "category": category,
            "summary": summary,
            "is_pinned": False,
            "published_at": raw_art.get("published_at", datetime.now(timezone.utc).isoformat()),
        }

    # =========================================================================
    # PIPELINE 3: SUPABASE DATABASE SYNC
    # =========================================================================
    def sync_to_supabase(self, tools: List[Dict[str, Any]], news: List[Dict[str, Any]]) -> Dict[str, int]:
        if not self.client:
            logger.warning("Supabase client offline. Skipping database write.")
            return {"tools_synced": 0, "news_synced": 0}

        tools_count = 0
        news_count = 0
        now = datetime.now(timezone.utc).isoformat()

        # 1. Upsert Tools (aligns with schema columns)
        for t in tools:
            tool_id = t.get("slug") or t.get("id") or "novel-tool"
            try:
                record = {
                    "id": tool_id,
                    "slug": tool_id,
                    "name": t.get("name"),
                    "company": t.get("company", "Independent"),
                    "category": t.get("category", "Workflow & Automation"),
                    "secondary_categories": t.get("secondary_categories", ["AI"]),
                    "tagline": t.get("tagline", "")[:200],
                    "description": t.get("description", ""),
                    "key_features": t.get("key_features", []),
                    "best_for": t.get("best_for", "Developers & AI Engineers"),
                    "pricing": t.get("pricing", "Freemium"),
                    "official_url": t.get("official_url", ""),
                    "is_featured": bool(t.get("is_featured", False)),
                    "architecture_details": t.get("architecture_details") or "Verified telemetry node.",
                    "company_background": t.get("company_background") or f"{t.get('company', 'Independent')} ecosystem.",
                    "related_tool_slugs": t.get("related_tool_slugs", []),
                    "updated_at": now,
                }
                self.client.table("ai_directory").upsert([record], on_conflict="slug").execute()
                tools_count += 1
            except Exception as e:
                logger.warning(f"Error upserting tool {t.get('name')}: {e}")

        # 2. Upsert News (Defensively without unsupported columns)
        for n in news:
            url = n.get("url")
            if not url:
                continue

            record = {
                "external_id": f"scraped-{int(time.time())}-{news_count}",
                "title": n.get("title"),
                "url": url,
                "source_domain": n.get("source_domain", "ai-wire.io"),
                "category": n.get("category", "LLMs"),
                "summary": n.get("summary", ""),
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
            except Exception as e:
                logger.warning(f"Error upserting article {n.get('title')}: {e}")

        logger.info(f"Supabase Sync Complete: Upserted {tools_count} tools, {news_count} news articles.")
        return {"tools_synced": tools_count, "news_synced": news_count}

    # =========================================================================
    # PIPELINE 4: VERCEL EDGE CACHE REVALIDATION
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

    def run_all(self) -> Dict[str, Any]:
        logger.info("=========================================================")
        logger.info("  Optimus Prime 24/7 Full Ingestion Cycle Initiated")
        logger.info("=========================================================")
        tools = self.discover_ai_tools()
        news = self.ingest_daily_news()
        result = self.sync_to_supabase(tools, news)
        self.trigger_vercel_revalidation()
        return result


def run_full_pipeline():
    scraper = Optimus24x7Scraper()
    return scraper.run_all()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Optimus Prime 24/7 Multi-Source Web Scraper & Sync Engine")
    parser.add_argument("--run-all", action="store_true", help="Run full discovery and news ingestion cycle")
    parser.add_argument("--test", action="store_true", help="Test router and feed connectivity")
    args = parser.parse_args()

    engine = Optimus24x7Scraper()
    if args.test:
        print("[TEST] Running connectivity and router verification...")
        sample = engine.router.generate_json('Reply with JSON: {"status": "ok", "service": "optimus-engine"}')
        print("LLM Router Response:", sample)
        print("Supabase Configured:", bool(engine.client))
        print("Discovered Tools Count:", len(engine.discover_ai_tools()))
        print("Live News Entries Count:", len(engine.ingest_daily_news()))
    else:
        engine.run_all()
