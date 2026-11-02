"""Optimus Engine Multi-LLM Router with Dynamic Gemini Auto-Discovery & Universal Failover.

Features:
- Dynamic Google Gemini Model Auto-Discovery via GET /v1beta/models (5s timeout).
- Strict priority order: gemini-3.8-flash -> gemini-3.6-flash -> gemini-3.5-flash -> gemini-3-flash -> gemini-2.0-flash -> gemini-2.0-flash-001 -> any available gemini-*.
- Working model caching across requests for ultra-low latency.
- Key rotation across GEMINI_API_KEYS (from .env and Supabase public.app_settings).
- Universal failover: Gemini Pool -> Groq (llama-3.3-70b-versatile / llama-3.1-8b-instant) -> OpenRouter (openrouter/free).
- Catches all 400, 401, 403, 404, 429, 500, 503, and network timeout errors without crashing.
"""

import os
import re
import json
import time
import logging
from typing import Dict, Any, List, Optional
from dotenv import load_dotenv
import requests

load_dotenv(".env")
load_dotenv("../web/.env.local")
load_dotenv("../toolsai-manager/.env")

logger = logging.getLogger("OptimusLLMRouter")
if not logger.handlers:
    logging.basicConfig(level=logging.INFO, format="[%(asctime)s] [%(levelname)s] [LLMRouter] %(message)s")


class LLMRouter:
    def __init__(self):
        self.gemini_keys: List[str] = self._load_keys(
            "GEMINI_API_KEYS",
            ["GEMINI_API_KEY_1", "GEMINI_API_KEY_2", "GEMINI_API_KEY_3", "GEMINI_API_KEY"]
        )
        self.groq_keys: List[str] = self._load_keys(
            "GROQ_API_KEYS",
            ["GROQ_API_KEY_1", "GROQ_API_KEY_2", "GROQ_API_KEY"]
        )
        self.openrouter_keys: List[str] = self._load_keys(
            "OPENROUTER_API_KEYS",
            ["OPENROUTER_API_KEY"]
        )

        self._load_keys_from_supabase()

        self.cooldowns: Dict[str, float] = {}
        self.gemini_idx = 0
        self.groq_idx = 0
        self.openrouter_idx = 0

        self.groq_models = ["llama-3.3-70b-versatile", "llama-3.1-8b-instant"]
        self.openrouter_models = [
            os.getenv("OPENROUTER_MODEL", "openrouter/free"),
            "openrouter/free",
            "meta-llama/llama-3.3-70b-instruct:free",
        ]
        self._working_gemini_models: Dict[str, str] = {}
        self.discovered_models_cache: Dict[str, List[str]] = {}
        self.last_active_model: str = "auto-discovery"
        self.last_active_provider: str = "none"

        logger.info(
            f"Initialized LLMRouter with {len(self.gemini_keys)} Gemini, "
            f"{len(self.groq_keys)} Groq, {len(self.openrouter_keys)} OpenRouter keys."
        )

    def _load_keys(self, primary_env: str, fallback_envs: List[str]) -> List[str]:
        keys: List[str] = []
        raw = os.getenv(primary_env, "").strip()
        if raw:
            for k in raw.split(","):
                k = k.strip()
                if k and k not in keys:
                    keys.append(k)
        for fb in fallback_envs:
            val = os.getenv(fb, "").strip()
            if val:
                for k in val.split(","):
                    k = k.strip()
                    if k and k not in keys:
                        keys.append(k)
        return keys

    def _load_keys_from_supabase(self) -> None:
        supabase_url = os.getenv("SUPABASE_URL") or os.getenv("NEXT_PUBLIC_SUPABASE_URL")
        supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("SUPABASE_KEY") or os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
        if not supabase_url or not supabase_key:
            return

        try:
            from supabase import create_client
            client = create_client(supabase_url, supabase_key)
            res = client.table("app_settings").select("key, value").in_(
                "key", ["gemini_api_keys", "gemini_api_key", "groq_api_keys", "openrouter_api_key"]
            ).execute()
            if res.data:
                for row in res.data:
                    k = row.get("key")
                    v = (row.get("value") or "").strip()
                    if not v:
                        continue
                    if k in ["gemini_api_keys", "gemini_api_key"]:
                        for part in v.split(","):
                            part = part.strip()
                            if part and part not in self.gemini_keys:
                                self.gemini_keys.append(part)
                    elif k == "groq_api_keys":
                        for part in v.split(","):
                            part = part.strip()
                            if part and part not in self.groq_keys:
                                self.groq_keys.append(part)
                    elif k == "openrouter_api_key":
                        for part in v.split(","):
                            part = part.strip()
                            if part and part not in self.openrouter_keys:
                                self.openrouter_keys.append(part)
        except Exception as e:
            logger.debug(f"Could not load keys from Supabase app_settings: {e}")

    def _is_cooling_down(self, key: str) -> bool:
        cd_until = self.cooldowns.get(key, 0)
        return time.time() < cd_until

    def _set_cooldown(self, key: str, seconds: int = 60, reason: str = "Rate Limit / Error") -> None:
        self.cooldowns[key] = time.time() + seconds
        logger.warning(f"Key {key[:8]}... put on {seconds}s cooldown ({reason})")

    def discover_gemini_models(self, api_key: str) -> List[str]:
        if api_key in self.discovered_models_cache:
            return self.discovered_models_cache[api_key]

        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models?key={api_key}"
            r = requests.get(url, timeout=5)
            if r.status_code == 200:
                data = r.json()
                raw_models = [
                    m["name"]
                    for m in data.get("models", [])
                    if "gemini" in m.get("name", "").lower()
                    and "generateContent" in m.get("supportedGenerationMethods", [])
                ]

                if raw_models:
                    def model_priority(name: str) -> int:
                        n = name.lower()
                        if "gemini-3.8-flash" in n and "tts" not in n and "lite" not in n:
                            return 1000
                        if "gemini-3.6-flash" in n:
                            return 900
                        if "gemini-3.5-flash" in n and "lite" not in n:
                            return 800
                        if "gemini-3-flash" in n:
                            return 700
                        if "gemini-3" in n and "flash" in n:
                            return 650
                        if "gemini-2.0-flash" in n or "gemini-2.0-flash-001" in n:
                            return 600
                        if "gemini-3.5-flash-lite" in n or "gemini-3.1-flash-lite" in n:
                            return 500
                        if "gemini-3" in n:
                            return 400
                        if "flash" in n and "tts" not in n and "image" not in n:
                            return 300
                        if "pro" in n:
                            return 200
                        return 100

                    raw_models.sort(key=model_priority, reverse=True)
                    top_candidates = raw_models[:4]
                    self.discovered_models_cache[api_key] = top_candidates
                    return top_candidates
        except Exception as e:
            logger.debug(f"Dynamic Gemini model discovery exception: {e}")

        fallback = [
            "models/gemini-3.8-flash",
            "models/gemini-3.6-flash",
            "models/gemini-3.5-flash",
            "models/gemini-2.0-flash",
        ]
        self.discovered_models_cache[api_key] = fallback
        return fallback

    def generate_json(self, prompt: str, system_instruction: str = "Output valid JSON only.") -> Optional[Dict[str, Any]]:
        # Tier 1: Gemini Pool
        if self.gemini_keys:
            for _ in range(len(self.gemini_keys)):
                key = self.gemini_keys[self.gemini_idx % len(self.gemini_keys)]
                self.gemini_idx += 1
                if self._is_cooling_down(key):
                    continue
                res = self._call_gemini(key, prompt, system_instruction)
                if res:
                    return res

        # Tier 2: Groq LPU
        if self.groq_keys:
            for _ in range(len(self.groq_keys)):
                key = self.groq_keys[self.groq_idx % len(self.groq_keys)]
                self.groq_idx += 1
                if self._is_cooling_down(key):
                    continue
                res = self._call_groq(key, prompt, system_instruction)
                if res:
                    return res

        # Tier 3: OpenRouter
        if self.openrouter_keys:
            for _ in range(len(self.openrouter_keys)):
                key = self.openrouter_keys[self.openrouter_idx % len(self.openrouter_keys)]
                self.openrouter_idx += 1
                if self._is_cooling_down(key):
                    continue
                res = self._call_openrouter(key, prompt, system_instruction)
                if res:
                    return res

        return None

    def _call_gemini(self, api_key: str, prompt: str, system_instruction: str) -> Optional[Dict[str, Any]]:
        cached_model = self._working_gemini_models.get(api_key)
        discovered = self.discover_gemini_models(api_key)
        model_order = [cached_model] + [m for m in discovered if m != cached_model] if cached_model else discovered

        for model in model_order:
            clean_model = model if model.startswith("models/") else f"models/{model}"
            url = f"https://generativelanguage.googleapis.com/v1beta/{clean_model}:generateContent?key={api_key}"
            headers = {"Content-Type": "application/json"}
            payload = {
                "contents": [
                    {"role": "user", "parts": [{"text": f"{system_instruction}\n\n{prompt}"}]}
                ],
                "generationConfig": {
                    "temperature": 0.1,
                    "maxOutputTokens": 2048,
                },
            }
            try:
                r = requests.post(url, json=payload, headers=headers, timeout=5)
                if r.status_code == 429:
                    # Key quota is exhausted across models! Put key on 10-minute cooldown immediately
                    self._set_cooldown(api_key, 600, f"429 Quota Exceeded on {clean_model}")
                    return None
                if r.status_code in [404, 400]:
                    continue
                if r.status_code != 200:
                    continue

                data = r.json()
                raw_text = data["candidates"][0]["content"]["parts"][0]["text"]
                self._working_gemini_models[api_key] = clean_model
                self.last_active_model = clean_model
                self.last_active_provider = "gemini"

                parsed = self._parse_json(raw_text)
                if parsed:
                    return parsed
            except Exception as e:
                logger.debug(f"Gemini {clean_model} request exception: {e}")
                continue

        self._set_cooldown(api_key, 600, "All candidate models failed/rate-limited on this key")
        return None

    def _call_groq(self, api_key: str, prompt: str, system_instruction: str) -> Optional[Dict[str, Any]]:
        for model in self.groq_models:
            url = "https://api.groq.com/openai/v1/chat/completions"
            headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}
            payload = {
                "model": model,
                "messages": [
                    {"role": "system", "content": system_instruction},
                    {"role": "user", "content": prompt},
                ],
                "temperature": 0.1,
            }
            try:
                r = requests.post(url, json=payload, headers=headers, timeout=5)
                if r.status_code == 429:
                    self._set_cooldown(api_key, 600, f"Groq 429 on {model}")
                    return None
                if r.status_code in [401, 403]:
                    self._set_cooldown(api_key, 300, f"Groq HTTP {r.status_code} Auth/Forbidden")
                    return None
                if r.status_code != 200:
                    continue

                data = r.json()
                content = data["choices"][0]["message"]["content"]
                self.last_active_model = model
                self.last_active_provider = "groq"

                parsed = self._parse_json(content)
                if parsed:
                    return parsed
            except Exception as e:
                continue
        return None

    def _call_openrouter(self, api_key: str, prompt: str, system_instruction: str) -> Optional[Dict[str, Any]]:
        for model in self.openrouter_models:
            url = "https://openrouter.ai/api/v1/chat/completions"
            headers = {
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
                "HTTP-Referer": "https://ai-news-aggregator-delta.vercel.app",
                "X-Title": "Optimus Prime 24/7 Intelligence",
            }
            payload = {
                "model": model,
                "messages": [
                    {"role": "system", "content": system_instruction},
                    {"role": "user", "content": prompt},
                ],
                "temperature": 0.1,
            }
            try:
                r = requests.post(url, json=payload, headers=headers, timeout=6)
                if r.status_code != 200:
                    continue

                data = r.json()
                content = data["choices"][0]["message"]["content"]
                self.last_active_model = model
                self.last_active_provider = "openrouter"

                parsed = self._parse_json(content)
                if parsed:
                    return parsed
            except Exception as e:
                continue
        return None

    def _parse_json(self, text: str) -> Optional[Dict[str, Any]]:
        if not text:
            return None
        text = text.strip()
        try:
            return json.loads(text)
        except Exception:
            cleaned = re.sub(r"^```(?:json)?\s*", "", text, flags=re.MULTILINE)
            cleaned = re.sub(r"\s*```$", "", cleaned, flags=re.MULTILINE).strip()
            try:
                return json.loads(cleaned)
            except Exception:
                pass

            match = re.search(r"\{[\s\S]*\}", text)
            if match:
                try:
                    return json.loads(match.group(0))
                except Exception:
                    pass
        return None


llm_router = LLMRouter()
