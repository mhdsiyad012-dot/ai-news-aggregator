import { revalidatePath, revalidateTag } from "next/cache";
import { supabase } from "./supabase";

export interface SiteSettings {
  geminiApiKeyMasked: string;
  siteHeadline: string;
  siteTagline: string;
  announcementActive: boolean;
  announcementText: string;
  lastUpdated?: string;
}

const DEFAULT_GEMINI_KEY =
  process.env.GEMINI_API_KEY ||
  process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
  "your_gemini_api_key_here";

// Server-side runtime fallback if Supabase is offline
let runtimeMemorySettings: Record<string, string> = {
  gemini_api_key: DEFAULT_GEMINI_KEY,
  site_headline: "Live AI Intelligence & Ecosystem Index",
  site_tagline:
    "Optimus Prime is the verified agency-grade intelligence wire. Ingesting breaking model breakthroughs, autonomous coding agents, and 45+ indexed AI platforms.",
  announcement_active: "true",
  announcement_text:
    "Optimus Prime 2.0 Live — Featuring Gemini 3.8 Flash Synthesis & Dual-Filter Directory",
};

/**
 * Server-only: Retrieve active Gemini API key.
 * Queries Supabase first, falls back to runtime cache, then process.env.
 */
export async function getActiveGeminiApiKey(): Promise<string> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("app_settings")
        .select("value")
        .eq("key", "gemini_api_key")
        .single();

      if (!error && data?.value) {
        return data.value.trim();
      }
    } catch (err) {
      console.warn("Supabase settings fetch error, falling back:", err);
    }
  }

  return runtimeMemorySettings["gemini_api_key"] || DEFAULT_GEMINI_KEY;
}

/**
 * Server-only: Update the active Gemini API key.
 * Persists to Supabase, invalidates cache tag, and triggers revalidation.
 */
export async function updateGeminiApiKey(newKey: string): Promise<boolean> {
  const cleanKey = newKey.trim();
  if (!cleanKey) throw new Error("API key cannot be empty.");

  runtimeMemorySettings["gemini_api_key"] = cleanKey;

  if (supabase) {
    try {
      const { error } = await supabase.from("app_settings").upsert(
        {
          key: "gemini_api_key",
          value: cleanKey,
          description: "Active Google Gemini API Key for autonomous intelligence",
          updated_at: new Date().toISOString(),
        },
        { onConflict: "key" }
      );

      if (error) {
        console.warn("Failed to persist key to Supabase app_settings:", error);
      }
    } catch (err) {
      console.warn("Supabase upsert exception:", err);
    }
  }

  // Serverless cache invalidation
  try {
    revalidateTag("app-settings", "max-age=0" as any);
  } catch {
    // revalidateTag handles optionally
  }

  try {
    revalidatePath("/", "layout");
    revalidatePath("/news");
    revalidatePath("/directory");
  } catch (err) {
    console.warn("Path revalidation warning:", err);
  }

  return true;
}

/**
 * Server-only: Retrieve all site settings (API key is strictly masked).
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  let activeKey = DEFAULT_GEMINI_KEY;
  let headline = runtimeMemorySettings["site_headline"];
  let tagline = runtimeMemorySettings["site_tagline"];
  let announcementActive = runtimeMemorySettings["announcement_active"] === "true";
  let announcementText = runtimeMemorySettings["announcement_text"];
  let lastUpdated = new Date().toISOString();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("app_settings")
        .select("key, value, updated_at");

      if (!error && data && data.length > 0) {
        for (const row of data) {
          if (row.key === "gemini_api_key") activeKey = row.value;
          if (row.key === "site_headline") headline = row.value;
          if (row.key === "site_tagline") tagline = row.value;
          if (row.key === "announcement_active") announcementActive = row.value === "true";
          if (row.key === "announcement_text") announcementText = row.value;
          if (row.updated_at) lastUpdated = row.updated_at;
        }
      }
    } catch (err) {
      console.warn("Supabase settings error:", err);
    }
  }

  // Mask the API key (showing only first 6 and last 4 characters)
  const maskedKey =
    activeKey.length > 10
      ? `${activeKey.slice(0, 6)}...${activeKey.slice(-4)}`
      : "••••••••";

  return {
    geminiApiKeyMasked: maskedKey,
    siteHeadline: headline,
    siteTagline: tagline,
    announcementActive,
    announcementText,
    lastUpdated,
  };
}

/**
 * Server-only: Update site settings and revalidate paths.
 */
export async function updateSiteSettings(updates: Partial<Omit<SiteSettings, "geminiApiKeyMasked">>): Promise<boolean> {
  if (supabase) {
    const rowsToUpsert: Array<{ key: string; value: string; updated_at: string }> = [];
    const now = new Date().toISOString();

    if (updates.siteHeadline !== undefined) {
      rowsToUpsert.push({ key: "site_headline", value: updates.siteHeadline, updated_at: now });
      runtimeMemorySettings["site_headline"] = updates.siteHeadline;
    }
    if (updates.siteTagline !== undefined) {
      rowsToUpsert.push({ key: "site_tagline", value: updates.siteTagline, updated_at: now });
      runtimeMemorySettings["site_tagline"] = updates.siteTagline;
    }
    if (updates.announcementActive !== undefined) {
      rowsToUpsert.push({ key: "announcement_active", value: String(updates.announcementActive), updated_at: now });
      runtimeMemorySettings["announcement_active"] = String(updates.announcementActive);
    }
    if (updates.announcementText !== undefined) {
      rowsToUpsert.push({ key: "announcement_text", value: updates.announcementText, updated_at: now });
      runtimeMemorySettings["announcement_text"] = updates.announcementText;
    }

    if (rowsToUpsert.length > 0) {
      try {
        await supabase.from("app_settings").upsert(rowsToUpsert, { onConflict: "key" });
      } catch (err) {
        console.warn("Failed to persist site settings to Supabase:", err);
      }
    }
  }

  try {
    revalidatePath("/", "layout");
    revalidatePath("/news");
    revalidatePath("/directory");
  } catch (err) {
    console.warn("Path revalidation warning:", err);
  }

  return true;
}

/**
 * Server-only: Test live latency and connectivity of a Gemini API key.
 * Strictly adheres to Section 5: Gemini 2.5 Flash Latency & Timeout Elimination
 * with thinkingConfig: { thinkingBudget: 0 } and maxOutputTokens: 4 via x-goog-api-key header.
 */
export async function testGeminiKeyConnectivity(customKey?: string): Promise<{
  success: boolean;
  latencyMs: number;
  model: string;
  error?: string;
}> {
  const apiKey = customKey?.trim() || (await getActiveGeminiApiKey());
  if (!apiKey) {
    return {
      success: false,
      latencyMs: 0,
      model: "gemini-2.5-flash",
      error: "No Gemini API key provided or found in environment/database.",
    };
  }

  const startTime = Date.now();

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey, // Supports both AQ.Ab8... Auth keys and AIzaSy... Standard keys
        },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: "Reply with OK" }] }],
          generationConfig: {
            maxOutputTokens: 4,
            temperature: 0,
            thinkingConfig: { thinkingBudget: 0 }, // CRITICAL: Disables thinking budget to eliminate timeouts
          },
        }),
        cache: "no-store",
        signal: AbortSignal.timeout(15000),
      }
    );

    const latencyMs = Date.now() - startTime;

    if (response.ok) {
      return {
        success: true,
        latencyMs,
        model: "gemini-2.5-flash",
      };
    }

    if (response.status === 429) {
      return {
        success: true,
        latencyMs,
        model: "gemini-2.5-flash",
        error: "Authenticated (Rate limited: 429 Quota Exceeded)",
      };
    }

    // Try fallback to other flash models if 2.5-flash had a regional/version issue
    if (response.status === 404 || response.status === 400) {
      const candidateModels = ["gemini-3.8-flash", "gemini-flash-latest", "gemini-1.5-flash"];
      for (const candidate of candidateModels) {
        const fbStart = Date.now();
        try {
          const fbRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${candidate}:generateContent`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "x-goog-api-key": apiKey,
              },
              body: JSON.stringify({
                contents: [{ role: "user", parts: [{ text: "Reply with OK" }] }],
                generationConfig: {
                  maxOutputTokens: 4,
                  temperature: 0,
                  thinkingConfig: { thinkingBudget: 0 },
                },
              }),
              cache: "no-store",
              signal: AbortSignal.timeout(10000),
            }
          );

          if (fbRes.ok) {
            return {
              success: true,
              latencyMs: Date.now() - fbStart,
              model: candidate,
            };
          }

          if (fbRes.status === 429) {
            return {
              success: true,
              latencyMs: Date.now() - fbStart,
              model: candidate,
              error: "Authenticated (Rate limited: 429 Quota Exceeded)",
            };
          }
        } catch {
          // Continue to next candidate
        }
      }
    }

    const errJson = await response.json().catch(() => ({}));
    const errMsg = errJson?.error?.message || `HTTP ${response.status} ${response.statusText}`;

    return {
      success: false,
      latencyMs,
      model: "gemini-2.5-flash",
      error: errMsg,
    };
  } catch (err: unknown) {
    const latencyMs = Date.now() - startTime;
    const msg = err instanceof Error ? err.message : "Network/timeout error connecting to Gemini";
    return {
      success: false,
      latencyMs,
      model: "gemini-2.5-flash",
      error: msg,
    };
  }
}
