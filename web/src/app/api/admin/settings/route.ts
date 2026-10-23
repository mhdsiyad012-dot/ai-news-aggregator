import { NextResponse } from "next/server";
import { checkRequestAdminAuth } from "@/lib/adminAuth";
import {
  getSiteSettings,
  updateGeminiApiKey,
  updateSiteSettings,
} from "@/lib/settingsService";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!checkRequestAdminAuth(request)) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const settings = await getSiteSettings();
    return NextResponse.json({ success: true, settings });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to load settings";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!checkRequestAdminAuth(request)) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const {
      geminiApiKey,
      siteName,
      siteLogoMode,
      siteLogoPreset,
      siteLogoCustom,
      siteHeadline,
      siteTagline,
      heroBadgeText,
      themeAccent,
      announcementActive,
      announcementText,
      announcementLink,
      socialTwitter,
      socialGithub,
      socialDiscord,
      footerText,
    } = body;

    if (geminiApiKey && typeof geminiApiKey === "string" && geminiApiKey.trim()) {
      await updateGeminiApiKey(geminiApiKey.trim());
    }

    await updateSiteSettings({
      siteName: siteName !== undefined ? String(siteName) : undefined,
      siteLogoMode: siteLogoMode !== undefined ? siteLogoMode : undefined,
      siteLogoPreset: siteLogoPreset !== undefined ? siteLogoPreset : undefined,
      siteLogoCustom: siteLogoCustom !== undefined ? String(siteLogoCustom) : undefined,
      siteHeadline: siteHeadline !== undefined ? String(siteHeadline) : undefined,
      siteTagline: siteTagline !== undefined ? String(siteTagline) : undefined,
      heroBadgeText: heroBadgeText !== undefined ? String(heroBadgeText) : undefined,
      themeAccent: themeAccent !== undefined ? themeAccent : undefined,
      announcementActive: announcementActive !== undefined ? Boolean(announcementActive) : undefined,
      announcementText: announcementText !== undefined ? String(announcementText) : undefined,
      announcementLink: announcementLink !== undefined ? String(announcementLink) : undefined,
      socialTwitter: socialTwitter !== undefined ? String(socialTwitter) : undefined,
      socialGithub: socialGithub !== undefined ? String(socialGithub) : undefined,
      socialDiscord: socialDiscord !== undefined ? String(socialDiscord) : undefined,
      footerText: footerText !== undefined ? String(footerText) : undefined,
    });

    const updatedSettings = await getSiteSettings();

    return NextResponse.json({
      success: true,
      message: "Branding, site identity, and Gemini settings updated successfully across all instances.",
      settings: updatedSettings,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update settings";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
