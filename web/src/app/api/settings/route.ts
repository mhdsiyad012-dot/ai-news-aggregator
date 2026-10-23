import { NextResponse } from "next/server";
import { getSiteSettings } from "@/lib/settingsService";

export const dynamic = "force-dynamic";
export const revalidate = 60;

export async function GET() {
  try {
    const settings = await getSiteSettings();
    // Return strictly public-safe branding and content fields
    const publicSettings = {
      siteName: settings.siteName,
      siteLogoMode: settings.siteLogoMode,
      siteLogoPreset: settings.siteLogoPreset,
      siteLogoCustom: settings.siteLogoCustom,
      siteHeadline: settings.siteHeadline,
      siteTagline: settings.siteTagline,
      heroBadgeText: settings.heroBadgeText,
      themeAccent: settings.themeAccent,
      announcementActive: settings.announcementActive,
      announcementText: settings.announcementText,
      announcementLink: settings.announcementLink,
      socialTwitter: settings.socialTwitter,
      socialGithub: settings.socialGithub,
      socialDiscord: settings.socialDiscord,
      footerText: settings.footerText,
      lastUpdated: settings.lastUpdated,
    };

    return NextResponse.json(
      { success: true, settings: publicSettings },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to load public settings";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
