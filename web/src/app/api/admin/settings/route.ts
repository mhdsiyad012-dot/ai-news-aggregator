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
    const { geminiApiKey, siteHeadline, siteTagline, announcementActive, announcementText } = body;

    if (geminiApiKey && typeof geminiApiKey === "string") {
      await updateGeminiApiKey(geminiApiKey.trim());
    }

    await updateSiteSettings({
      siteHeadline: siteHeadline !== undefined ? String(siteHeadline) : undefined,
      siteTagline: siteTagline !== undefined ? String(siteTagline) : undefined,
      announcementActive: announcementActive !== undefined ? Boolean(announcementActive) : undefined,
      announcementText: announcementText !== undefined ? String(announcementText) : undefined,
    });

    const updatedSettings = await getSiteSettings();

    return NextResponse.json({
      success: true,
      message: "Settings and Gemini API Key updated successfully across all instances.",
      settings: updatedSettings,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update settings";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
