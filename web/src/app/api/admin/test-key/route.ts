import { NextResponse } from "next/server";
import { checkRequestAdminAuth } from "@/lib/adminAuth";
import { testGeminiKeyConnectivity } from "@/lib/settingsService";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!checkRequestAdminAuth(request)) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const keyToTest = body?.geminiApiKey || body?.apiKey;

    const result = await testGeminiKeyConnectivity(keyToTest);
    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error testing connectivity";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
