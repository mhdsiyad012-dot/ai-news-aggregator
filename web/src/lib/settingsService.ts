import { revalidatePath, revalidateTag } from "next/cache";
import { supabase } from "./supabase";

export interface SiteSettings {
  geminiApiKeyMasked: string;
  siteName: string;
  siteLogoMode: "preset" | "image_url" | "custom_svg";
  siteLogoPreset: "prism" | "spark" | "neural" | "minimal";
  siteLogoCustom: string;
  siteHeadline: string;
  siteTagline: string;
  heroBadgeText: string;
  themeAccent: "gemini" | "indigo-cyan" | "emerald" | "violet" | "monochrome";
  announcementActive: boolean;
  announcementText: string;
  announcementLink: string;
  socialTwitter: string;
  socialGithub: string;
  socialDiscord: string;
  footerText: string;
  lastUpdated?: string;
}

const DEFAULT_GEMINI_KEY =
  process.env.GEMINI_API_KEY ||
  process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
  "your_gemini_api_key_here";

// Server-side runtime fallback if Supabase is offline
let runtimeMemorySettings: Record<string, string> = {
  gemini_api_key: DEFAULT_GEMINI_KEY,
  site_name: "Optimus Prime",
  site_logo_mode: "preset",
  site_logo_preset: "prism",
  site_logo_custom: "",
  site_headline: "The Global AI Models, Tools & Daily Intelligence Index",
  site_tagline:
    "Autonomous frontier intelligence platform tracking real-time model breakthroughs, agentic IDEs, and 100+ verified AI ecosystems.",
  hero_badge_text: "Frontier Intelligence Index • 24/7 Verified Autonomous Telemetry",
  theme_accent: "indigo-cyan",
  announcement_active: "false",
  announcement_text: "Optimus Prime Engine 2.0 Live — Autonomous multi-LLM rotation & verified ecosystems.",
  announcement_link: "/models",
  social_twitter: "https://twitter.com",
  social_github: "https://github.com/mhdsiyad012-dot/ai-news-aggregator",
  social_discord: "",
  footer_text: "© 2026 Optimus Prime. Autonomous real-time intelligence index.",
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
    revalidatePath("/models");
    revalidatePath("/directory");
    revalidatePath("/ecosystems");
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
  let siteName = runtimeMemorySettings["site_name"];
  let siteLogoMode = (runtimeMemorySettings["site_logo_mode"] as any) || "preset";
  let siteLogoPreset = (runtimeMemorySettings["site_logo_preset"] as any) || "prism";
  let siteLogoCustom = runtimeMemorySettings["site_logo_custom"] || "";
  let headline = runtimeMemorySettings["site_headline"];
  let tagline = runtimeMemorySettings["site_tagline"];
  let heroBadgeText = runtimeMemorySettings["hero_badge_text"] || "Frontier Intelligence Index";
  let themeAccent = (runtimeMemorySettings["theme_accent"] as any) || "indigo-cyan";
  let announcementActive = runtimeMemorySettings["announcement_active"] === "true";
  let announcementText = runtimeMemorySettings["announcement_text"];
  let announcementLink = runtimeMemorySettings["announcement_link"] || "/models";
  let socialTwitter = runtimeMemorySettings["social_twitter"] || "";
  let socialGithub = runtimeMemorySettings["social_github"] || "";
  let socialDiscord = runtimeMemorySettings["social_discord"] || "";
  let footerText = runtimeMemorySettings["footer_text"] || "© 2026 Optimus Prime.";
  let lastUpdated = new Date().toISOString();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("app_settings")
        .select("key, value, updated_at");

      if (!error && data && data.length > 0) {
        for (const row of data) {
          if (row.key === "gemini_api_key") activeKey = row.value;
          if (row.key === "site_name") siteName = row.value;
          if (row.key === "site_logo_mode") siteLogoMode = row.value;
          if (row.key === "site_logo_preset") siteLogoPreset = row.value;
          if (row.key === "site_logo_custom") siteLogoCustom = row.value;
          if (row.key === "site_headline") headline = row.value;
          if (row.key === "site_tagline") tagline = row.value;
          if (row.key === "hero_badge_text") heroBadgeText = row.value;
          if (row.key === "theme_accent") themeAccent = row.value;
          if (row.key === "announcement_active") announcementActive = row.value === "true";
          if (row.key === "announcement_text") announcementText = row.value;
          if (row.key === "announcement_link") announcementLink = row.value;
          if (row.key === "social_twitter") socialTwitter = row.value;
          if (row.key === "social_github") socialGithub = row.value;
          if (row.key === "social_discord") socialDiscord = row.value;
          if (row.key === "footer_text") footerText = row.value;
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
    siteName,
    siteLogoMode,
    siteLogoPreset,
    siteLogoCustom,
    siteHeadline: headline,
    siteTagline: tagline,
    heroBadgeText,
    themeAccent,
    announcementActive,
    announcementText,
    announcementLink,
    socialTwitter,
    socialGithub,
    socialDiscord,
    footerText,
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

    const mapping: Record<string, string | undefined> = {
      site_name: updates.siteName,
      site_logo_mode: updates.siteLogoMode,
      site_logo_preset: updates.siteLogoPreset,
      site_logo_custom: updates.siteLogoCustom,
      site_headline: updates.siteHeadline,
      site_tagline: updates.siteTagline,
      hero_badge_text: updates.heroBadgeText,
      theme_accent: updates.themeAccent,
      announcement_active: updates.announcementActive !== undefined ? String(updates.announcementActive) : undefined,
      announcement_text: updates.announcementText,
      announcement_link: updates.announcementLink,
      social_twitter: updates.socialTwitter,
      social_github: updates.socialGithub,
      social_discord: updates.socialDiscord,
      footer_text: updates.footerText,
    };

    for (const [key, val] of Object.entries(mapping)) {
      if (val !== undefined) {
        rowsToUpsert.push({ key, value: String(val), updated_at: now });
        runtimeMemorySettings[key] = String(val);
      }
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
    revalidateTag("app-settings", "max-age=0" as any);
  } catch {}

  try {
    revalidatePath("/", "layout");
    revalidatePath("/");
    revalidatePath("/models");
    revalidatePath("/directory");
    revalidatePath("/ecosystems");
    revalidatePath("/news");
    revalidatePath("/about");
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
        success: false,
        latencyMs,
        model: "gemini-2.5-flash",
        error: "429 Quota Exceeded (Rate Limited). Key pool rotation advised.",
      };
    }

    const errText = await response.text().catch(() => "");
    return {
      success: false,
      latencyMs,
      model: "gemini-2.5-flash",
      error: `API returned HTTP ${response.status}: ${errText.slice(0, 120)}`,
    };
  } catch (err: unknown) {
    const latencyMs = Date.now() - startTime;
    const msg = err instanceof Error ? err.message : "Network failure or timeout";
    return {
      success: false,
      latencyMs,
      model: "gemini-2.5-flash",
      error: msg,
    };
  }
}
