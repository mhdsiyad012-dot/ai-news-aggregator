import { NextResponse } from "next/server";
import { checkRequestAdminAuth } from "@/lib/adminAuth";
import {
  getAllNewsArticles,
  createOrUpdateNewsArticle,
  deleteNewsArticle,
  togglePinArticle,
} from "@/lib/newsStoreService";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!checkRequestAdminAuth(request)) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const articles = await getAllNewsArticles();
    return NextResponse.json({ count: articles.length, articles });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to load news articles";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!checkRequestAdminAuth(request)) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body = await request.json();
    if (!body?.title || !body?.url || !body?.summary) {
      return NextResponse.json(
        { success: false, error: "Title, URL, and summary are required" },
        { status: 400 }
      );
    }

    const article = await createOrUpdateNewsArticle(body);
    return NextResponse.json({ success: true, article });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to save news article";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!checkRequestAdminAuth(request)) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const url = searchParams.get("url");

    const target = id || url;
    if (!target) {
      return NextResponse.json(
        { success: false, error: "Article ID or URL is required" },
        { status: 400 }
      );
    }

    await deleteNewsArticle(target);
    return NextResponse.json({ success: true, message: "Article removed." });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete article";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  if (!checkRequestAdminAuth(request)) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, isPinned } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Article ID is required" }, { status: 400 });
    }

    const newPinStatus = await togglePinArticle(id, Boolean(isPinned));
    return NextResponse.json({ success: true, isPinned: newPinStatus });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to toggle pin";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
