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
 */
export async function testGeminiKeyConnectivity(customKey?: string): Promise<{
  success: boolean;
  latencyMs: number;
  model: string;
  error?: string;
}> {
  const keyToUse = customKey?.trim() || (await getActiveGeminiApiKey());
  const startTime = Date.now();
  const candidateModels = [
    "gemini-2.5-flash",
    "gemini-1.5-flash",
    "gemini-2.0-flash",
    "gemini-flash-latest",
    "gemini-3.8-flash"
  ];

  let lastError = "No response from Gemini API";

  for (const model of candidateModels) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${keyToUse}`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: "Respond with the single word: PONG" }],
            },
          ],
          generationConfig: {
            maxOutputTokens: 10,
            temperature: 0.1,
          },
        }),
        cache: "no-store",
        signal: AbortSignal.timeout(6000),
      });

      const latencyMs = Date.now() - startTime;

      if (response.ok) {
        return {
          success: true,
          latencyMs,
          model,
        };
      }

      if (response.status === 404) {
        // Model not found in this region or API version, try next candidate
        continue;
      }

      const errText = await response.text();
      return {
        success: false,
        latencyMs,
        model,
        error: `HTTP ${response.status}: ${errText.slice(0, 150)}`,
      };
    } catch (err: unknown) {
      lastError = err instanceof Error ? err.message : "Network error";
    }
  }

  const latencyMs = Date.now() - startTime;
  return {
    success: false,
    latencyMs,
    model: candidateModels[0],
    error: lastError,
  };
}
