import { NextResponse } from "next/server";
import { 
  getNewsArticles, 
  createNewsArticle, 
  updateNewsArticle, 
  deleteNewsArticle 
} from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const query = searchParams.get("q")?.toLowerCase();

  let articles = await getNewsArticles();

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
        (a.source_name && a.source_name.toLowerCase().includes(query)) ||
        (a.related_tools && a.related_tools.toLowerCase().includes(query))
    );
  }

  return NextResponse.json({
    count: articles.length,
    articles,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.title || !body.url || !body.summary) {
      return NextResponse.json({ error: "Title, URL, and summary are required" }, { status: 400 });
    }

    const created = await createNewsArticle({
      title: body.title,
      summary: body.summary,
      url: body.url,
      category: body.category || "LLMs",
      source_name: body.source_name || "Custom Dispatch",
      related_tools: body.related_tools || "",
      is_pinned: Boolean(body.is_pinned),
      published_at: body.published_at || "Just now",
    });

    return NextResponse.json({ success: true, article: created }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ error: "Article ID is required for update" }, { status: 400 });
    }

    const updated = await updateNewsArticle(body.id, body);
    if (!updated) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, article: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let id = searchParams.get("id");

    if (!id) {
      const body = await request.json().catch(() => ({}));
      id = body.id;
    }

    if (!id) {
      return NextResponse.json({ error: "Article ID is required" }, { status: 400 });
    }

    const deleted = await deleteNewsArticle(Number(id));
    return NextResponse.json({ success: deleted });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
