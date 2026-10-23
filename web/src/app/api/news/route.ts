import { NextResponse } from "next/server";
import { getAllNewsArticles } from "@/lib/newsStoreService";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const query = searchParams.get("q")?.toLowerCase();

    let articles = await getAllNewsArticles();

    if (category && category !== "All") {
      articles = articles.filter(
        (a) => a.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (query) {
      articles = articles.filter(
        (a) =>
          a.title.toLowerCase().includes(query) ||
          a.summary.toLowerCase().includes(query) ||
          a.category.toLowerCase().includes(query) ||
          a.sourceDomain.toLowerCase().includes(query)
      );
    }

    return NextResponse.json({
      count: articles.length,
      articles,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch live AI news";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
