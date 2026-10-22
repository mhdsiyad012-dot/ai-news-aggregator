import { NextResponse } from "next/server";
import { getDailyExecutiveBriefing } from "@/services/geminiService";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const briefing = await getDailyExecutiveBriefing();
    return NextResponse.json({ success: true, briefing });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to generate briefing";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
