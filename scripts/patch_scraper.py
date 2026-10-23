import re

path = 'optimus-engine/web_scraper_24_7.py'
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

# Replace discover_ai_tools implementation
new_discover = '''    def discover_ai_tools(self) -> List[Dict[str, Any]]:
        logger.info("Executing Pipeline A: Discovering novel AI tools via Live OpenRouter, Hugging Face & GitHub...")
        discovered_tools = []
        now_iso = datetime.now(timezone.utc).isoformat()

        # 1. OpenRouter Live Models Feed
        try:
            r = requests.get("https://openrouter.ai/api/v1/models", headers={"User-Agent": "Optimus-AI-Platform/1.0"}, timeout=10)
            if r.status_code == 200:
                models = r.json().get("data", [])
                models.sort(key=lambda m: m.get("created", 0), reverse=True)
                for m in models[:40]:
                    mid = m.get("id", "")
                    slug = re.sub(r"[^a-z0-9]+", "-", mid.lower()).strip("-")
                    name = m.get("name") or mid.split("/")[-1]
                    prefix = mid.split("/")[0] if "/" in mid else "Open Source"

                    company_map = {
                        "google": "Google",
                        "openai": "OpenAI",
                        "anthropic": "Anthropic",
                        "x-ai": "xAI",
                        "deepseek": "DeepSeek",
                        "meta-llama": "Meta",
                        "mistralai": "Mistral AI",
                        "qwen": "Alibaba Qwen",
                        "cohere": "Cohere",
                        "minimax": "MiniMax",
                        "moonshotai": "Moonshot AI",
                        "z-ai": "Zhipu AI",
                    }
                    company = company_map.get(prefix.lower(), prefix.capitalize())
                    pricing = "Free" if (m.get("pricing", {}).get("prompt") == 0) else "Paid"
                    category = "Coding & Autonomous Agents" if ("code" in mid.lower() or "agent" in mid.lower()) else "Conversational & Reasoning LLMs"

                    discovered_tools.append({
                        "id": slug,
                        "slug": slug,
                        "name": name,
                        "company": company,
                        "category": category,
                        "tagline": (m.get("description") or f"Frontier model by {company}")[:130] + ".",
                        "description": m.get("description") or f"{name} is an active AI model by {company}.",
                        "key_features": [
                            f"Context: {m.get('context_length', 128000):,} tokens",
                            f"Provider: OpenRouter ({mid})",
                            "High throughput low latency",
                            "Production API integration",
                        ],
                        "best_for": "Production applications, frontier reasoning, and agentic workflows",
                        "pricing": pricing,
                        "official_url": f"https://openrouter.ai/{mid}",
                        "is_featured": company in ["Google", "OpenAI", "Anthropic", "xAI", "DeepSeek", "Meta"],
                        "architecture_details": f"Live OpenRouter telemetry: {mid}",
                        "updated_at": now_iso,
                    })
        except Exception as e:
            logger.warning(f"Error fetching OpenRouter models: {e}")

        # 2. Hugging Face Trending Top-20
        try:
            r = requests.get("https://huggingface.co/api/models?sort=trendingScore&direction=-1&limit=20", headers={"User-Agent": "Optimus-AI-Platform/1.0"}, timeout=10)
            if r.status_code == 200:
                for hf in r.json():
                    hid = hf.get("id", "")
                    slug = re.sub(r"[^a-z0-9]+", "-", hid.lower()).strip("-")
                    author = hid.split("/")[0] if "/" in hid else "Open Source"
                    name = hid.split("/")[-1]
                    ptag = hf.get("pipeline_tag", "open-weights")
                    category = "Video & Image Editing AI" if any(w in ptag for w in ["image", "video", "diffusion"]) else "Conversational & Reasoning LLMs"
                    likes = hf.get("likes", 0)

                    discovered_tools.append({
                        "id": slug,
                        "slug": slug,
                        "name": name,
                        "company": author,
                        "category": category,
                        "tagline": f"Trending on Hugging Face with {likes:,} community likes.",
                        "description": f"Trending open-weights AI model {hid} on Hugging Face. Pipeline: {ptag}.",
                        "key_features": [
                            "Hugging Face Trending Top-20",
                            f"{likes:,} Community Stars",
                            f"Pipeline: {ptag}",
                            "Open Weights Community Model",
                        ],
                        "best_for": "Open-source research and local deployment",
                        "pricing": "Open Source",
                        "official_url": f"https://huggingface.co/{hid}",
                        "is_featured": likes > 500,
                        "architecture_details": f"Hugging Face: {hid}",
                        "updated_at": now_iso,
                    })
        except Exception as e:
            logger.warning(f"Error fetching Hugging Face models: {e}")

        logger.info(f"Extracted {len(discovered_tools)} total live tools from APIs.")
        return discovered_tools'''

old_discover_pattern = r'    def discover_ai_tools\(self\) -> List\[Dict\[str, Any\]\]:[\s\S]*?return discovered_tools'
text = re.sub(old_discover_pattern, new_discover, text)

# Replace news feeds in ingest_daily_news
old_feeds_pattern = r'news_feeds = \[[\s\S]*?\n        \]'
new_feeds = '''news_feeds = [
            ("https://blog.google/technology/ai/rss/", "blog.google"),
            ("https://techcrunch.com/category/artificial-intelligence/feed/", "techcrunch.com"),
            ("https://www.theverge.com/rss/ai-artificial-intelligence/index.xml", "theverge.com"),
            ("https://www.technologyreview.com/feed/", "technologyreview.com"),
        ]'''
text = re.sub(old_feeds_pattern, new_feeds, text)

with open(path, 'w', encoding='utf-8') as f:
    f.write(text)
print("Finished patching optimus-engine/web_scraper_24_7.py")
