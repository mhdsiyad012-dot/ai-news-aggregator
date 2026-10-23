import os
import json
import time
import re
import logging
from typing import Dict, Any, List, Optional
from dotenv import load_dotenv
import requests

load_dotenv()
logger = logging.getLogger("OptimusLLMRouter")
if not logger.handlers:
    logging.basicConfig(level=logging.INFO, format="[%(asctime)s] [%(levelname)s] [LLMRouter] %(message)s")


class LLMRouter:
    def __init__(self):
        self.gemini_keys: List[str] = self._load_keys("GEMINI_API_KEYS", ["GEMINI_API_KEY_1", "GEMINI_API_KEY_2", "GEMINI_API_KEY_3", "GEMINI_API_KEY"])
        self.groq_keys: List[str] = self._load_keys("GROQ_API_KEYS", ["GROQ_API_KEY_1", "GROQ_API_KEY_2", "GROQ_API_KEY"])
        self.openrouter_keys: List[str] = self._load_keys("OPENROUTER_API_KEYS", ["OPENROUTER_API_KEY"])

        self.cooldowns: Dict[str, float] = {}
        self.gemini_idx = 0
        self.groq_idx = 0

        self.groq_model = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
        self.openrouter_model = os.getenv("OPENROUTER_MODEL", "meta-llama/llama-3.3-70b-instruct:free")
        self._working_gemini_models: Dict[str, str] = {}

        logger.info(f"Initialized LLMRouter with {len(self.gemini_keys)} Gemini, {len(self.groq_keys)} Groq, {len(self.openrouter_keys)} OpenRouter keys.")

    def _load_keys(self, primary_env: str, fallback_envs: List[str]) -> List[str]:
        keys = []
        raw = os.getenv(primary_env, "").strip()
        if raw:
            for k in raw.split(","):
                k = k.strip()
                if k and k not in keys:
                    keys.append(k)
        for fb in fallback_envs:
            val = os.getenv(fb, "").strip()
            if val and val not in keys:
                keys.append(val)
        return keys

    def _is_cooling_down(self, key: str) -> bool:
        cd_until = self.cooldowns.get(key, 0)
        return time.time() < cd_until

    def _set_cooldown(self, key: str, seconds: int = 60):
        self.cooldowns[key] = time.time() + seconds
        logger.warning(f"Key {key[:8]}... put on {seconds}s cooldown (Rate Limit / Failure)")

    def _discover_gemini_models(self, api_key: str) -> List[str]:
        """Dynamically query v1beta/models to discover available models for this key."""
        try:
            r = requests.get(f"https://generativelanguage.googleapis.com/v1beta/models?key={api_key}", timeout=8)
            if r.status_code == 200:
                data = r.json()
                raw = [
                    m["name"]
                    for m in data.get("models", [])
                    if "gemini" in m.get("name", "") and "generateContent" in m.get("supportedGenerationMethods", [])
                ]
                if raw:
                    def score(n: str) -> int:
                        if "gemini-2.5-flash" in n:
                            return -10
                        if re.search(r"gemini-3.*flash", n, re.I):
                            return 100
                        if "gemini-3" in n:
                            return 90
                        if "gemini-2.0-flash" in n:
                            return 80
                        if "gemini-flash-latest" in n:
                            return 70
                        if "flash" in n:
                            return 60
                        if "pro" in n:
                            return 50
                        return 10

                    raw.sort(key=score, reverse=True)
                    return raw
        except Exception as e:
            logger.debug(f"Discovery exception: {e}")

        return [
            "models/gemini-3-flash-preview",
            "models/gemini-2.0-flash",
            "models/gemini-flash-latest",
            "models/gemini-1.5-flash",
        ]

    def generate_json(self, prompt: str, system_instruction: str = "Output valid JSON only.") -> Optional[Dict[str, Any]]:
        # Tier 1: Gemini Pool with dynamic model discovery
        for _ in range(len(self.gemini_keys)):
            key = self.gemini_keys[self.gemini_idx % len(self.gemini_keys)]
            self.gemini_idx += 1
            if self._is_cooling_down(key):
                continue
            res = self._call_gemini(key, prompt, system_instruction)
            if res:
                return res

        # Tier 2: Groq LPU
        for _ in range(len(self.groq_keys)):
            key = self.groq_keys[self.groq_idx % len(self.groq_keys)]
            self.groq_idx += 1
            if self._is_cooling_down(key):
                continue
            res = self._call_groq(key, prompt, system_instruction)
            if res:
                return res

        # Tier 3: OpenRouter
        for key in self.openrouter_keys:
            if not self._is_cooling_down(key):
                res = self._call_openrouter(key, prompt, system_instruction)
                if res:
                    return res

        logger.error("All LLM providers and keys exhausted or rate-limited.")
        return None

    def _call_gemini(self, api_key: str, prompt: str, system_instruction: str) -> Optional[Dict[str, Any]]:
        cached_model = self._working_gemini_models.get(api_key)
        discovered = self._discover_gemini_models(api_key)
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
                r = requests.post(url, json=payload, headers=headers, timeout=15)
                if r.status_code == 429:
                    self._set_cooldown(api_key, 60)
                    return None
                if r.status_code != 200:
                    logger.debug(f"Gemini {clean_model} HTTP {r.status_code}: {r.text[:80]}")
                    continue

                data = r.json()
                raw_text = data["candidates"][0]["content"]["parts"][0]["text"]
                self._working_gemini_models[api_key] = clean_model
                parsed = self._parse_json(raw_text)
                if parsed:
                    return parsed
            except Exception as e:
                logger.debug(f"Gemini {clean_model} exception: {e}")
                continue

        return None

    def _call_groq(self, api_key: str, prompt: str, system_instruction: str) -> Optional[Dict[str, Any]]:
        models = [self.groq_model, "llama-3.1-8b-instant"]
        for model in models:
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
                r = requests.post(url, json=payload, headers=headers, timeout=15)
                if r.status_code == 429:
                    self._set_cooldown(api_key, 60)
                    return None
                if r.status_code != 200:
                    continue
                data = r.json()
                content = data["choices"][0]["message"]["content"]
                parsed = self._parse_json(content)
                if parsed:
                    return parsed
            except Exception as e:
                logger.warning(f"Groq exception: {e}")
                continue
        return None

    def _call_openrouter(self, api_key: str, prompt: str, system_instruction: str) -> Optional[Dict[str, Any]]:
        models = [self.openrouter_model, "openrouter/free", "meta-llama/llama-3.3-70b-instruct:free"]
        for model in models:
            url = "https://openrouter.ai/api/v1/chat/completions"
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
                r = requests.post(url, json=payload, headers=headers, timeout=20)
                if r.status_code != 200:
                    continue
                data = r.json()
                content = data["choices"][0]["message"]["content"]
                parsed = self._parse_json(content)
                if parsed:
                    return parsed
            except Exception as e:
                logger.warning(f"OpenRouter exception: {e}")
                continue
        return None

    def _parse_json(self, text: str) -> Optional[Dict[str, Any]]:
        if not text:
            return None
        text = text.strip()
        try:
            return json.loads(text)
        except Exception:
            match = re.search(r"\{.*\}", text, re.DOTALL)
            if match:
                try:
                    return json.loads(match.group(0))
                except Exception:
                    pass
        return None
