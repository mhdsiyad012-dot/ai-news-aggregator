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

        self.gemini_model = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
        self.groq_model = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
        self.openrouter_model = os.getenv("OPENROUTER_MODEL", "meta-llama/llama-3.3-70b-instruct:free")

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

    def generate_json(self, prompt: str, system_instruction: str = "Output valid JSON only.") -> Optional[Dict[str, Any]]:
        # Tier 1: Gemini Pool
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
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.gemini_model}:generateContent"
        headers = {"Content-Type": "application/json", "x-goog-api-key": api_key}
        payload = {
            "contents": [{"role": "user", "parts": [{"text": prompt}]}],
            "systemInstruction": {"parts": [{"text": system_instruction}]},
            "generationConfig": {
                "temperature": 0.1,
                "responseMimeType": "application/json",
                "thinkingConfig": {"thinkingBudget": 0},
            },
        }
        try:
            r = requests.post(url, json=payload, headers=headers, timeout=15)
            if r.status_code == 429:
                self._set_cooldown(api_key, 60)
                return None
            if r.status_code != 200:
                logger.warning(f"Gemini HTTP {r.status_code}: {r.text[:100]}")
                return None
            data = r.json()
            raw_text = data["candidates"][0]["content"]["parts"][0]["text"]
            return self._parse_json(raw_text)
        except Exception as e:
            logger.warning(f"Gemini exception: {e}")
            return None

    def _call_groq(self, api_key: str, prompt: str, system_instruction: str) -> Optional[Dict[str, Any]]:
        url = "https://api.groq.com/openai/v1/chat/completions"
        headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}
        payload = {
            "model": self.groq_model,
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
                return None
            data = r.json()
            content = data["choices"][0]["message"]["content"]
            return self._parse_json(content)
        except Exception as e:
            logger.warning(f"Groq exception: {e}")
            return None

    def _call_openrouter(self, api_key: str, prompt: str, system_instruction: str) -> Optional[Dict[str, Any]]:
        url = "https://openrouter.ai/api/v1/chat/completions"
        headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}
        payload = {
            "model": self.openrouter_model,
            "messages": [
                {"role": "system", "content": system_instruction},
                {"role": "user", "content": prompt},
            ],
            "temperature": 0.1,
        }
        try:
            r = requests.post(url, json=payload, headers=headers, timeout=20)
            if r.status_code != 200:
                return None
            data = r.json()
            content = data["choices"][0]["message"]["content"]
            return self._parse_json(content)
        except Exception as e:
            logger.warning(f"OpenRouter exception: {e}")
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
