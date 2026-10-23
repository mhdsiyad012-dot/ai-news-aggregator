import { getActiveGeminiApiKey } from "./settingsService";
import { supabaseAdmin, supabase } from "./supabase";

// In-memory cache for discovered working Gemini models per key
const workingModelCache = new Map<string, string>();

interface LLMResponse {
  text: string;
  provider: "gemini" | "groq" | "openrouter";
  model: string;
  latencyMs: number;
}

export interface ConnectivityTestResult {
  success: boolean;
  latencyMs: number;
  model: string;
  provider: string;
  error?: string;
  details?: string;
}

/**
 * Fetch all configured LLM keys from Supabase app_settings or environment.
 */
export async function getLLMKeyPool(): Promise<{
  geminiKeys: string[];
  groqKeys: string[];
  openrouterKey?: string;
}> {
  const client = supabaseAdmin || supabase;
  let geminiStr = process.env.GEMINI_API_KEYS || process.env.GEMINI_API_KEY || "";
  let groqStr = process.env.GROQ_API_KEYS || process.env.GROQ_API_KEY || "";
  let openrouterStr = process.env.OPENROUTER_API_KEY || "";

  if (client) {
    try {
      const { data } = await client
        .from("app_settings")
        .select("key, value")
        .in("key", ["gemini_api_keys", "gemini_api_key", "groq_api_keys", "openrouter_api_key"]);

      if (data) {
        for (const row of data) {
          if ((row.key === "gemini_api_keys" || row.key === "gemini_api_key") && row.value?.trim()) {
            geminiStr = row.value.trim();
          } else if (row.key === "groq_api_keys" && row.value?.trim()) {
            groqStr = row.value.trim();
          } else if (row.key === "openrouter_api_key" && row.value?.trim()) {
            openrouterStr = row.value.trim();
          }
        }
      }
    } catch {
      // Fallback to env
    }
  }

  const geminiKeys = geminiStr
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);

  const groqKeys = groqStr
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);

  return {
    geminiKeys,
    groqKeys,
    openrouterKey: openrouterStr || undefined,
  };
}

/**
 * Dynamic Model Discovery for Google Gemini API keys.
 * Queries GET /v1beta/models to discover and rank valid generateContent-capable models.
 */
export async function discoverGeminiModels(apiKey: string): Promise<string[]> {
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
      {
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        signal: AbortSignal.timeout(8000),
      }
    );

    if (!res.ok) {
      return [
        "models/gemini-3-flash-preview",
        "models/gemini-2.0-flash",
        "models/gemini-flash-latest",
        "models/gemini-1.5-flash",
      ];
    }

    const data = await res.json();
    const rawModels: Array<{ name: string; supportedGenerationMethods?: string[] }> =
      data.models || [];

    const candidates = rawModels
      .filter(
        (m) =>
          m.name.includes("gemini") &&
          (m.supportedGenerationMethods?.includes("generateContent") ?? true)
      )
      .map((m) => m.name);

    if (candidates.length === 0) {
      return ["models/gemini-2.0-flash", "models/gemini-flash-latest"];
    }

    // Rank candidates:
    // 1. Any gemini-3 or gemini-3.*-flash
    // 2. Any gemini-2.0-flash
    // 3. Any gemini-*-pro
    // 4. Any other gemini model (excluding deprecated 2.5-flash)
    candidates.sort((a, b) => {
      const score = (name: string): number => {
        // Explicitly deprioritize deprecated 2.5-flash
        if (name.includes("gemini-2.5-flash")) return -10;
        if (/gemini-3.*flash/i.test(name)) return 100;
        if (/gemini-3/i.test(name)) return 90;
        if (/gemini-2\.0-flash/i.test(name)) return 80;
        if (/gemini-flash-latest/i.test(name)) return 70;
        if (/gemini-.*flash/i.test(name)) return 60;
        if (/gemini-.*pro/i.test(name)) return 50;
        return 10;
      };
      return score(b) - score(a);
    });

    return candidates;
  } catch {
    return [
      "models/gemini-3-flash-preview",
      "models/gemini-2.0-flash",
      "models/gemini-flash-latest",
      "models/gemini-1.5-flash",
    ];
  }
}

/**
 * Execute a completion via Google Gemini with dynamic model discovery & error recovery.
 */
async function callGemini(
  apiKey: string,
  prompt: string,
  systemPrompt?: string
): Promise<LLMResponse> {
  const cachedModel = workingModelCache.get(apiKey);
  const discovered = await discoverGeminiModels(apiKey);

  const modelOrder = cachedModel
    ? [cachedModel, ...discovered.filter((m) => m !== cachedModel)]
    : discovered;

  let lastError = "";

  for (const model of modelOrder) {
    const cleanModel = model.startsWith("models/") ? model : `models/${model}`;
    const startTime = Date.now();

    try {
      const contents = [];
      if (systemPrompt) {
        contents.push({ role: "user", parts: [{ text: systemPrompt }] });
        contents.push({ role: "model", parts: [{ text: "Understood." }] });
      }
      contents.push({ role: "user", parts: [{ text: prompt }] });

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/${cleanModel}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents,
            generationConfig: {
              maxOutputTokens: 2048,
              temperature: 0.2,
            },
          }),
          cache: "no-store",
          signal: AbortSignal.timeout(12000),
        }
      );

      if (res.ok) {
        const data = await res.json();
        const text =
          data.candidates?.[0]?.content?.parts?.[0]?.text || "";
        workingModelCache.set(apiKey, cleanModel);
        return {
          text,
          provider: "gemini",
          model: cleanModel,
          latencyMs: Date.now() - startTime,
        };
      }

      // If model returned 404 or any non-200, record error and proceed to next candidate
      const errBody = await res.text().catch(() => "");
      lastError = `HTTP ${res.status} on ${cleanModel}: ${errBody.slice(0, 100)}`;
      continue;
    } catch (err: unknown) {
      lastError = err instanceof Error ? err.message : "Request failed";
      continue;
    }
  }

  throw new Error(`All Gemini models failed on key. Last error: ${lastError}`);
}

/**
 * Execute completion via Groq (llama-3.3-70b-versatile with fallback to llama-3.1-8b-instant).
 */
async function callGroq(
  apiKey: string,
  prompt: string,
  systemPrompt?: string
): Promise<LLMResponse> {
  const models = ["llama-3.3-70b-versatile", "llama-3.1-8b-instant"];
  let lastErr = "";

  for (const model of models) {
    const startTime = Date.now();
    try {
      const messages = [];
      if (systemPrompt) messages.push({ role: "system", content: systemPrompt });
      messages.push({ role: "user", content: prompt });

      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.2,
          max_tokens: 2048,
        }),
        cache: "no-store",
        signal: AbortSignal.timeout(10000),
      });

      if (res.ok) {
        const data = await res.json();
        const text = data.choices?.[0]?.message?.content || "";
        return {
          text,
          provider: "groq",
          model,
          latencyMs: Date.now() - startTime,
        };
      }
      lastErr = `HTTP ${res.status}`;
    } catch (e: unknown) {
      lastErr = e instanceof Error ? e.message : "Error";
    }
  }

  throw new Error(`Groq request failed: ${lastErr}`);
}

/**
 * Execute completion via OpenRouter.
 */
async function callOpenRouter(
  apiKey: string,
  prompt: string,
  systemPrompt?: string
): Promise<LLMResponse> {
  const models = [
    "openrouter/free",
    "meta-llama/llama-3.3-70b-instruct:free",
    "google/gemini-2.0-flash-exp:free",
  ];
  let lastErr = "";

  for (const model of models) {
    const startTime = Date.now();
    try {
      const messages = [];
      if (systemPrompt) messages.push({ role: "system", content: systemPrompt });
      messages.push({ role: "user", content: prompt });

      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.2,
          max_tokens: 2048,
        }),
        cache: "no-store",
        signal: AbortSignal.timeout(12000),
      });

      if (res.ok) {
        const data = await res.json();
        const text = data.choices?.[0]?.message?.content || "";
        return {
          text,
          provider: "openrouter",
          model,
          latencyMs: Date.now() - startTime,
        };
      }
      lastErr = `HTTP ${res.status}`;
    } catch (e: unknown) {
      lastErr = e instanceof Error ? e.message : "Error";
    }
  }

  throw new Error(`OpenRouter request failed: ${lastErr}`);
}

/**
 * Unified completion function with instant multi-provider failover.
 * Rotates Gemini keys -> Groq keys -> OpenRouter.
 */
export async function generateChatCompletion(
  prompt: string,
  systemPrompt?: string
): Promise<LLMResponse> {
  const { geminiKeys, groqKeys, openrouterKey } = await getLLMKeyPool();
  const errors: string[] = [];

  // Tier 1: Try Google Gemini keys
  for (let i = 0; i < geminiKeys.length; i++) {
    try {
      return await callGemini(geminiKeys[i], prompt, systemPrompt);
    } catch (err: unknown) {
      errors.push(`Gemini key #${i + 1}: ${err instanceof Error ? err.message : "Failed"}`);
    }
  }

  // Tier 2: Failover to Groq
  for (let i = 0; i < groqKeys.length; i++) {
    try {
      return await callGroq(groqKeys[i], prompt, systemPrompt);
    } catch (err: unknown) {
      errors.push(`Groq key #${i + 1}: ${err instanceof Error ? err.message : "Failed"}`);
    }
  }

  // Tier 3: Failover to OpenRouter
  if (openrouterKey) {
    try {
      return await callOpenRouter(openrouterKey, prompt, systemPrompt);
    } catch (err: unknown) {
      errors.push(`OpenRouter: ${err instanceof Error ? err.message : "Failed"}`);
    }
  }

  throw new Error(
    `All AI LLM providers exhausted without response. Errors: ${errors.join(" | ")}`
  );
}

/**
 * Comprehensive Latency & Connectivity Tester.
 * Tests dynamic model discovery and reports exact working model without 404s.
 */
export async function testLLMConnectivity(
  customKey?: string
): Promise<ConnectivityTestResult> {
  const startTime = Date.now();
  const targetKey = customKey?.trim() || (await getActiveGeminiApiKey());

  if (!targetKey) {
    // If no Gemini key, try checking other providers from key pool
    const { groqKeys, openrouterKey } = await getLLMKeyPool();
    if (groqKeys.length > 0) {
      try {
        const res = await callGroq(groqKeys[0], "Ping");
        return {
          success: true,
          latencyMs: res.latencyMs,
          model: res.model,
          provider: "groq",
          details: `Connected via Groq (${res.model})`,
        };
      } catch (e: unknown) {
        return {
          success: false,
          latencyMs: 0,
          model: "none",
          provider: "groq",
          error: e instanceof Error ? e.message : "Groq test failed",
        };
      }
    }

    if (openrouterKey) {
      try {
        const res = await callOpenRouter(openrouterKey, "Ping");
        return {
          success: true,
          latencyMs: res.latencyMs,
          model: res.model,
          provider: "openrouter",
          details: `Connected via OpenRouter (${res.model})`,
        };
      } catch (e: unknown) {
        return {
          success: false,
          latencyMs: 0,
          model: "none",
          provider: "openrouter",
          error: e instanceof Error ? e.message : "OpenRouter test failed",
        };
      }
    }

    return {
      success: false,
      latencyMs: 0,
      model: "none",
      provider: "none",
      error: "No API keys configured in environment or database.",
    };
  }

  // Perform dynamic model discovery on the key
  try {
    const res = await callGemini(targetKey, "Reply with OK");
    return {
      success: true,
      latencyMs: res.latencyMs,
      model: res.model,
      provider: "gemini",
      details: `Connected via Google Gemini (${res.model})`,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Gemini connection error";

    // Attempt failover to Groq or OpenRouter
    const { groqKeys, openrouterKey } = await getLLMKeyPool();
    if (groqKeys.length > 0) {
      try {
        const groqRes = await callGroq(groqKeys[0], "Ping");
        return {
          success: true,
          latencyMs: groqRes.latencyMs,
          model: groqRes.model,
          provider: "groq",
          details: `Failover active! Connected via Groq (${groqRes.model}). (Gemini failed: ${errorMsg})`,
        };
      } catch {}
    }

    if (openrouterKey) {
      try {
        const orRes = await callOpenRouter(openrouterKey, "Ping");
        return {
          success: true,
          latencyMs: orRes.latencyMs,
          model: orRes.model,
          provider: "openrouter",
          details: `Failover active! Connected via OpenRouter (${orRes.model}). (Gemini failed: ${errorMsg})`,
        };
      } catch {}
    }

    return {
      success: false,
      latencyMs: Date.now() - startTime,
      model: "unknown",
      provider: "gemini",
      error: errorMsg,
    };
  }
}
