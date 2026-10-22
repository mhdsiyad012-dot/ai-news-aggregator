import { NextResponse } from "next/server";
import { resetDirectorySeed, getAIDirectory, getNewsArticles } from "@/lib/supabase";

export async function POST() {
  try {
    await resetDirectorySeed();
    const [directory, articles] = await Promise.all([
      getAIDirectory(),
      getNewsArticles(),
    ]);

    return NextResponse.json({
      success: true,
      message: "Database seed reset to default premier catalogue.",
      directoryCount: directory.length,
      articlesCount: articles.length,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
