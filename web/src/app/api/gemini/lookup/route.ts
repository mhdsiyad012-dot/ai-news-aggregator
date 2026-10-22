import { NextResponse } from "next/server";
import { lookupAiToolWithGemini } from "@/services/geminiService";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { query } = body;

    if (!query || typeof query !== "string") {
      return NextResponse.json(
        { success: false, error: "Search query is required" },
        { status: 400 }
      );
    }

    const tool = await lookupAiToolWithGemini(query);
    if (!tool) {
      return NextResponse.json(
        { success: false, error: `No verified intelligence found for "${query}"` },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, tool });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to perform live lookup";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
