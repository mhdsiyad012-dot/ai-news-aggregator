import { NextResponse } from "next/server";
import { 
  getAIDirectory, 
  createAIDirectoryItem, 
  updateAIDirectoryItem, 
  deleteAIDirectoryItem 
} from "@/lib/supabase";
import { AIDirectoryItem } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const query = searchParams.get("q")?.toLowerCase();

  let items = await getAIDirectory();

  if (category && category !== "All") {
    items = items.filter(
      (item) => item.primary_category.toLowerCase() === category.toLowerCase()
    );
  }

  if (query) {
    items = items.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.creator.toLowerCase().includes(query) ||
        item.short_purpose.toLowerCase().includes(query) ||
        item.tags.some((t) => t.toLowerCase().includes(query)) ||
        item.detailed_overview.toLowerCase().includes(query)
    );
  }

  return NextResponse.json({
    count: items.length,
    items,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || !body.creator || !body.short_purpose) {
      return NextResponse.json({ error: "Name, creator, and short_purpose are required" }, { status: 400 });
    }

    const slug = body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const newItem: AIDirectoryItem = {
      slug,
      name: body.name,
      creator: body.creator,
      short_purpose: body.short_purpose,
      primary_category: body.primary_category || "Code Builders",
      tags: Array.isArray(body.tags) ? body.tags : (body.tags || "").split(",").map((s: string) => s.trim()).filter(Boolean),
      detailed_overview: body.detailed_overview || body.short_purpose,
      key_capabilities: Array.isArray(body.key_capabilities) ? body.key_capabilities : (body.key_capabilities || "").split("\n").map((s: string) => s.trim()).filter(Boolean),
      best_use_cases: Array.isArray(body.best_use_cases) ? body.best_use_cases : (body.best_use_cases || "").split("\n").map((s: string) => s.trim()).filter(Boolean),
      pricing_model: body.pricing_model || "Contact for pricing",
      official_url: body.official_url || "https://example.com",
      release_status: body.release_status || "Generally Available",
      is_featured: Boolean(body.is_featured),
    };

    const created = await createAIDirectoryItem(newItem);
    return NextResponse.json({ success: true, item: created }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const identifier = body.id || body.slug;
    if (!identifier) {
      return NextResponse.json({ error: "Item id or slug is required for update" }, { status: 400 });
    }

    if (body.tags && typeof body.tags === "string") {
      body.tags = body.tags.split(",").map((s: string) => s.trim()).filter(Boolean);
    }
    if (body.key_capabilities && typeof body.key_capabilities === "string") {
      body.key_capabilities = body.key_capabilities.split("\n").map((s: string) => s.trim()).filter(Boolean);
    }
    if (body.best_use_cases && typeof body.best_use_cases === "string") {
      body.best_use_cases = body.best_use_cases.split("\n").map((s: string) => s.trim()).filter(Boolean);
    }

    const updated = await updateAIDirectoryItem(identifier, body);
    if (!updated) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, item: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let identifier = searchParams.get("slug") || searchParams.get("id");

    if (!identifier) {
      const body = await request.json().catch(() => ({}));
      identifier = body.slug || body.id;
    }

    if (!identifier) {
      return NextResponse.json({ error: "Item slug or ID is required" }, { status: 400 });
    }

    const deleted = await deleteAIDirectoryItem(identifier);
    return NextResponse.json({ success: deleted });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
