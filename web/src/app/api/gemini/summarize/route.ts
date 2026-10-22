import { NextResponse } from "next/server";
import { getArticleTakeaway } from "@/services/geminiService";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, context } = body;

    if (!title) {
      return NextResponse.json(
        { success: false, error: "Title is required" },
        { status: 400 }
      );
    }

    const takeaway = await getArticleTakeaway(title, context);
    return NextResponse.json({ success: true, takeaway });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to generate takeaway";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
