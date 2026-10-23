import { NextResponse } from "next/server";
import { checkRequestAdminAuth } from "@/lib/adminAuth";
import { supabaseAdmin, supabase } from "@/lib/supabase";
import { AI_DIRECTORY_DATA } from "@/data/aiDirectoryData";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!checkRequestAdminAuth(request)) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const client = supabaseAdmin || supabase;
  if (!client) {
    return NextResponse.json({ success: false, error: "Supabase client not initialized" }, { status: 500 });
  }

  try {
    // 1. Purge stale records from ai_directory
    await client.from("ai_directory").delete().neq("id", "___nonexistent___");

    // 2. Insert verified 2026 catalog
    const rows = AI_DIRECTORY_DATA.map((t) => ({
      id: t.id,
      slug: t.slug,
      name: t.name,
      company: t.company,
      category: t.category,
      secondary_categories: t.secondaryCategories,
      tagline: t.tagline,
      description: t.description,
      key_features: t.keyFeatures,
      best_for: t.bestFor,
      pricing: t.pricing,
      official_url: t.officialUrl,
      is_featured: t.isFeatured,
      architecture_details: t.architectureDetails || null,
      company_background: t.companyBackground || null,
      related_tool_slugs: t.relatedToolSlugs || [],
      updated_at: new Date().toISOString(),
    }));

    await client.from("ai_directory").upsert(rows);

    revalidatePath("/");
    revalidatePath("/directory");
    revalidatePath("/models");
    revalidatePath("/ecosystems");

    return NextResponse.json({
      success: true,
      count: rows.length,
      message: `Clean reset complete! Purged stale data and seeded ${rows.length} verified 2026 frontier AI systems.`,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Reset failed";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
