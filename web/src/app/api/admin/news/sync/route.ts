import { NextResponse } from "next/server";
import { checkRequestAdminAuth } from "@/lib/adminAuth";
import { syncLiveNewsWithGemini } from "@/lib/newsStoreService";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!checkRequestAdminAuth(request)) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const result = await syncLiveNewsWithGemini();
    return NextResponse.json({
      success: true,
      message: result.message,
      count: result.count,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to sync live news with Gemini";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
