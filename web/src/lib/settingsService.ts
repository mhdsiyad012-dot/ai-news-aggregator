import { revalidatePath, revalidateTag } from "next/cache";
import { supabase, supabaseAdmin } from "./supabase";

export interface SiteSettings {
  geminiApiKeyMasked: string;
  siteName: string;
  siteLogoMode: "preset" | "image_url" | "custom_svg" | "upload";
  siteLogoPreset: "prism" | "spark" | "neural" | "minimal" | "aurora" | "deepmind";
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
  // Security
  adminPasswordConfigured?: boolean;
  adminUnlockKeyConfigured?: boolean;
  // LLM Keys
  geminiApiKeysMasked?: string;
  groqApiKeysMasked?: string;
  openrouterApiKeyMasked?: string;
}

const DEFAULT_GEMINI_KEY =
  process.env.GEMINI_API_KEY ||
  process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
  "your_gemini_api_key_here";

// Server-side runtime fallback if Supabase is offline
let runtimeMemorySettings: Record<string, string> = {
  gemini_api_key: DEFAULT_GEMINI_KEY,
  gemini_api_keys: process.env.GEMINI_API_KEYS || "",
  groq_api_keys: process.env.GROQ_API_KEYS || "",
  openrouter_api_key: process.env.OPENROUTER_API_KEY || "",
  admin_passcode: process.env.ADMIN_PASSWORD || "Mhdsiyad@123@",
  admin_unlock_key: process.env.ADMIN_STEALTH_KEY || "optimus2026",
  site_name: "Optimus Prime",
  site_logo_mode: "preset",
  site_logo_preset: "aurora",
  site_logo_custom: "",
  site_headline: "The Global AI Models, Tools & Daily Intelligence Index",
  site_tagline:
    "Autonomous frontier intelligence platform tracking real-time model breakthroughs, agentic IDEs, and 100+ verified AI ecosystems.",
  hero_badge_text: "Google DeepMind & Gemini Neural Index • 2026 Verified Telemetry",
  theme_accent: "gemini",
  announcement_active: "false",
  announcement_text: "Optimus Prime 2026 Live — Neural Expressive UI & Verified 2026 Models.",
  announcement_link: "/models",
  social_twitter: "https://twitter.com",
  social_github: "https://github.com/mhdsiyad012-dot/ai-news-aggregator",
  social_discord: "",
  footer_text: "© 2026 Optimus Prime. Google DeepMind & Frontier Intelligence Index.",
};

function maskKey(key?: string): string {
  if (!key) return "Not Configured";
  const clean = key.trim();
  if (clean.length <= 10) return "••••••••";
  return `${clean.slice(0, 6)}...${clean.slice(-4)}`;
}

/**
 * Server-only: Retrieve active Gemini API key.
 */
export async function getActiveGeminiApiKey(): Promise<string> {
  const client = supabaseAdmin || supabase;
  if (client) {
    try {
      const { data, error } = await client
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
 * Server-only: Retrieve dynamic Admin Credentials.
 */
export async function getAdminCredentials(): Promise<{ adminPasscode: string; adminUnlockKey: string }> {
  let adminPasscode = runtimeMemorySettings["admin_passcode"] || process.env.ADMIN_PASSWORD || "Mhdsiyad@123@";
  let adminUnlockKey = runtimeMemorySettings["admin_unlock_key"] || process.env.ADMIN_STEALTH_KEY || "optimus2026";

  const client = supabaseAdmin || supabase;
  if (client) {
    try {
      const { data, error } = await client
        .from("app_settings")
        .select("key, value")
        .in("key", ["admin_passcode", "admin_unlock_key"]);

      if (!error && data) {
        for (const row of data) {
          if (row.key === "admin_passcode" && row.value?.trim()) adminPasscode = row.value.trim();
          if (row.key === "admin_unlock_key" && row.value?.trim()) adminUnlockKey = row.value.trim();
        }
      }
    } catch (err) {
      console.warn("Error reading admin credentials:", err);
    }
  }

  return { adminPasscode, adminUnlockKey };
}

/**
 * Server-only: Update Admin Password and Stealth Key in Supabase.
 */
export async function updateAdminCredentials(passcode?: string, unlockKey?: string): Promise<boolean> {
  const client = supabaseAdmin || supabase;
  const rows: Array<{ key: string; value: string; is_secret: boolean; updated_at: string }> = [];
  const now = new Date().toISOString();

  if (passcode && passcode.trim()) {
    runtimeMemorySettings["admin_passcode"] = passcode.trim();
    rows.push({
      key: "admin_passcode",
      value: passcode.trim(),
      is_secret: true,
      updated_at: now,
    });
  }

  if (unlockKey && unlockKey.trim()) {
    runtimeMemorySettings["admin_unlock_key"] = unlockKey.trim();
    rows.push({
      key: "admin_unlock_key",
      value: unlockKey.trim(),
      is_secret: true,
      updated_at: now,
    });
  }

  if (client && rows.length > 0) {
    try {
      await client.from("app_settings").upsert(rows, { onConflict: "key" });
    } catch (err) {
      console.warn("Failed to persist admin credentials to Supabase:", err);
    }
  }

  return true;
}

/**
 * Server-only: Retrieve autonomous scraping API keys.
 */
export async function getAutonomousApiKeys(): Promise<{
  geminiKeys: string;
  groqKeys: string;
  openrouterKey: string;
}> {
  let geminiKeys = runtimeMemorySettings["gemini_api_keys"] || process.env.GEMINI_API_KEYS || "";
  let groqKeys = runtimeMemorySettings["groq_api_keys"] || process.env.GROQ_API_KEYS || "";
  let openrouterKey = runtimeMemorySettings["openrouter_api_key"] || process.env.OPENROUTER_API_KEY || "";

  const client = supabaseAdmin || supabase;
  if (client) {
    try {
      const { data, error } = await client
        .from("app_settings")
        .select("key, value")
        .in("key", ["gemini_api_keys", "groq_api_keys", "openrouter_api_key"]);

      if (!error && data) {
        for (const row of data) {
          if (row.key === "gemini_api_keys" && row.value) geminiKeys = row.value.trim();
          if (row.key === "groq_api_keys" && row.value) groqKeys = row.value.trim();
          if (row.key === "openrouter_api_key" && row.value) openrouterKey = row.value.trim();
        }
      }
    } catch (err) {
      console.warn("Error reading autonomous keys:", err);
    }
  }

  return { geminiKeys, groqKeys, openrouterKey };
}

/**
 * Server-only: Update the active Gemini API key.
 */
export async function updateGeminiApiKey(newKey: string): Promise<boolean> {
  const cleanKey = newKey.trim();
  if (!cleanKey) throw new Error("API key cannot be empty.");

  runtimeMemorySettings["gemini_api_key"] = cleanKey;

  const client = supabaseAdmin || supabase;
  if (client) {
    try {
      await client.from("app_settings").upsert(
        {
          key: "gemini_api_key",
          value: cleanKey,
          is_secret: true,
          description: "Active Google Gemini API Key for autonomous intelligence",
          updated_at: new Date().toISOString(),
        },
        { onConflict: "key" }
      );
    } catch (err) {
      console.warn("Supabase upsert exception:", err);
    }
  }

  try {
    revalidateTag("app-settings", { expire: 0 });
  } catch {}

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
 * Server-only: Retrieve all site settings (API keys & passwords strictly masked).
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  let activeKey = DEFAULT_GEMINI_KEY;
  let geminiApiKeys = runtimeMemorySettings["gemini_api_keys"] || process.env.GEMINI_API_KEYS || "";
  let groqApiKeys = runtimeMemorySettings["groq_api_keys"] || process.env.GROQ_API_KEYS || "";
  let openrouterApiKey = runtimeMemorySettings["openrouter_api_key"] || process.env.OPENROUTER_API_KEY || "";
  let siteName = runtimeMemorySettings["site_name"];
  let siteLogoMode = (runtimeMemorySettings["site_logo_mode"] as any) || "preset";
  let siteLogoPreset = (runtimeMemorySettings["site_logo_preset"] as any) || "aurora";
  let siteLogoCustom = runtimeMemorySettings["site_logo_custom"] || "";
  let headline = runtimeMemorySettings["site_headline"];
  let tagline = runtimeMemorySettings["site_tagline"];
  let heroBadgeText = runtimeMemorySettings["hero_badge_text"] || "Frontier Intelligence Index";
  let themeAccent = (runtimeMemorySettings["theme_accent"] as any) || "gemini";
  let announcementActive = runtimeMemorySettings["announcement_active"] === "true";
  let announcementText = runtimeMemorySettings["announcement_text"];
  let announcementLink = runtimeMemorySettings["announcement_link"] || "/models";
  let socialTwitter = runtimeMemorySettings["social_twitter"] || "";
  let socialGithub = runtimeMemorySettings["social_github"] || "";
  let socialDiscord = runtimeMemorySettings["social_discord"] || "";
  let footerText = runtimeMemorySettings["footer_text"] || "© 2026 Optimus Prime.";
  let lastUpdated = new Date().toISOString();

  const client = supabaseAdmin || supabase;
  if (client) {
    try {
      const { data, error } = await client
        .from("app_settings")
        .select("key, value, updated_at");

      if (!error && data && data.length > 0) {
        for (const row of data) {
          if (row.key === "gemini_api_key") activeKey = row.value;
          if (row.key === "gemini_api_keys") geminiApiKeys = row.value;
          if (row.key === "groq_api_keys") groqApiKeys = row.value;
          if (row.key === "openrouter_api_key") openrouterApiKey = row.value;
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

  return {
    geminiApiKeyMasked: maskKey(activeKey),
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
    adminPasswordConfigured: Boolean(runtimeMemorySettings["admin_passcode"] || process.env.ADMIN_PASSWORD),
    adminUnlockKeyConfigured: Boolean(runtimeMemorySettings["admin_unlock_key"] || process.env.ADMIN_STEALTH_KEY),
    geminiApiKeysMasked: maskKey(geminiApiKeys),
    groqApiKeysMasked: maskKey(groqApiKeys),
    openrouterApiKeyMasked: maskKey(openrouterApiKey),
  };
}

/**
 * Server-only: Update site settings and revalidate paths.
 */
export async function updateSiteSettings(
  updates: Partial<Omit<SiteSettings, "geminiApiKeyMasked" | "adminPasswordConfigured" | "adminUnlockKeyConfigured">>
): Promise<boolean> {
  const client = supabaseAdmin || supabase;
  if (client) {
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
        await client.from("app_settings").upsert(rowsToUpsert, { onConflict: "key" });
      } catch (err) {
        console.warn("Failed to persist site settings to Supabase:", err);
      }
    }
  }

  try {
    revalidateTag("app-settings", { expire: 0 });
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

import { testLLMConnectivity } from "./llmRouter";

/**
 * Server-only: Test live latency and connectivity of a Gemini or pool API key.
 * Uses dynamic model discovery to eliminate HTTP 404 deprecated model errors.
 */
export async function testGeminiKeyConnectivity(customKey?: string): Promise<{
  success: boolean;
  latencyMs: number;
  model: string;
  error?: string;
  details?: string;
}> {
  return testLLMConnectivity(customKey);
}
