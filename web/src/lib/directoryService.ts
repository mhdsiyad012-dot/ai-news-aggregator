import { revalidatePath } from "next/cache";
import { supabase } from "./supabase";
import { AI_DIRECTORY_DATA } from "@/data/aiDirectoryData";
import { AIDirectoryItem } from "./types";

let runtimeDirectoryCache: AIDirectoryItem[] = [...AI_DIRECTORY_DATA];

export async function getAllDirectoryItems(): Promise<AIDirectoryItem[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("ai_directory")
        .select("*")
        .order("is_featured", { ascending: false })
        .order("name", { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map((row) => ({
          id: row.id,
          slug: row.slug,
          name: row.name,
          company: row.company,
          category: row.category,
          secondaryCategories: row.secondary_categories || [],
          tagline: row.tagline,
          description: row.description,
          keyFeatures: row.key_features || [],
          bestFor: row.best_for,
          pricing: row.pricing,
          officialUrl: row.official_url,
          isFeatured: Boolean(row.is_featured),
          architectureDetails: row.architecture_details || undefined,
          companyBackground: row.company_background || undefined,
          relatedToolSlugs: row.related_tool_slugs || [],
        }));
      }
    } catch (err) {
      console.warn("Supabase directory read error, using runtime items:", err);
    }
  }

  return runtimeDirectoryCache;
}

export async function getDirectoryItemBySlug(slug: string): Promise<AIDirectoryItem | null> {
  const all = await getAllDirectoryItems();
  return (
    all.find(
      (t) =>
        t.slug.toLowerCase() === slug.toLowerCase() ||
        String(t.id).toLowerCase() === slug.toLowerCase()
    ) || null
  );
}

export async function seedDefaultDirectoryTools(): Promise<{ count: number; message: string }> {
  runtimeDirectoryCache = [...AI_DIRECTORY_DATA];

  if (!supabase) {
    return {
      count: AI_DIRECTORY_DATA.length,
      message: "Seeded 45+ tools into in-memory store (Supabase not configured).",
    };
  }

  const rows = AI_DIRECTORY_DATA.map((tool) => ({
    slug: tool.slug,
    name: tool.name,
    company: tool.company || "Independent",
    category: tool.category || "Workflow & Automation",
    secondary_categories: tool.secondaryCategories || [],
    tagline: tool.tagline || "",
    description: tool.description || "",
    key_features: tool.keyFeatures || [],
    best_for: tool.bestFor || "",
    pricing: tool.pricing || "Freemium",
    official_url: tool.officialUrl || "",
    is_featured: Boolean(tool.isFeatured),
    architecture_details: tool.architectureDetails || null,
    company_background: tool.companyBackground || null,
    related_tool_slugs: tool.relatedToolSlugs || [],
  }));

  try {
    const { error } = await supabase
      .from("ai_directory")
      .upsert(rows, { onConflict: "slug" });

    if (error) {
      console.warn("Supabase seed notice:", error.message);
      return {
        count: rows.length,
        message: `Synchronized ${rows.length} verified AI systems to active runtime memory. (To persist in Supabase, execute supabase/schema.sql in your Supabase SQL editor).`,
      };
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn("Supabase seed error:", msg);
    return {
      count: rows.length,
      message: `Synchronized ${rows.length} verified AI systems to active runtime memory.`,
    };
  }

  try {
    revalidatePath("/directory");
    revalidatePath("/");
  } catch (err) {
    console.warn("Path revalidation warning:", err);
  }

  return {
    count: rows.length,
    message: `Successfully synchronized ${rows.length} verified AI systems to database.`,
  };
}

export async function createOrUpdateDirectoryItem(
  item: Partial<AIDirectoryItem> & { name: string; officialUrl: string }
): Promise<AIDirectoryItem> {
  const slug =
    item.slug?.trim() ||
    item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

  const fullItem: AIDirectoryItem = {
    id: item.id || slug,
    slug,
    name: item.name.trim(),
    company: item.company?.trim() || "Independent",
    category: item.category || "Workflow & Automation",
    secondaryCategories: item.secondaryCategories || [],
    tagline: item.tagline?.trim() || `Verified intelligence node for ${item.name}`,
    description: item.description?.trim() || `${item.name} is a frontier AI system indexed in Optimus Prime.`,
    keyFeatures: item.keyFeatures && item.keyFeatures.length > 0 ? item.keyFeatures : ["AI-powered workflows"],
    bestFor: item.bestFor?.trim() || "Developers & Engineers",
    pricing: item.pricing || "Freemium",
    officialUrl: item.officialUrl.trim(),
    isFeatured: Boolean(item.isFeatured),
    architectureDetails: item.architectureDetails || undefined,
    companyBackground: item.companyBackground || undefined,
    relatedToolSlugs: item.relatedToolSlugs || [],
  };

  // Update in-memory
  const idx = runtimeDirectoryCache.findIndex((t) => t.slug === slug);
  if (idx >= 0) {
    runtimeDirectoryCache[idx] = fullItem;
  } else {
    runtimeDirectoryCache.unshift(fullItem);
  }

  if (supabase) {
    const row = {
      slug: fullItem.slug,
      name: fullItem.name,
      company: fullItem.company,
      category: fullItem.category,
      secondary_categories: fullItem.secondaryCategories,
      tagline: fullItem.tagline,
      description: fullItem.description,
      key_features: fullItem.keyFeatures,
      best_for: fullItem.bestFor,
      pricing: fullItem.pricing,
      official_url: fullItem.officialUrl,
      is_featured: fullItem.isFeatured,
      architecture_details: fullItem.architectureDetails || null,
      company_background: fullItem.companyBackground || null,
      related_tool_slugs: fullItem.relatedToolSlugs || [],
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("ai_directory")
      .upsert(row, { onConflict: "slug" });

    if (error) {
      console.warn("Supabase upsert warning:", error.message);
    }
  }

  try {
    revalidatePath("/directory");
    revalidatePath(`/directory/${slug}`);
    revalidatePath("/");
  } catch (err) {
    console.warn("Path revalidation warning:", err);
  }

  return fullItem;
}

export async function deleteDirectoryItem(slug: string): Promise<boolean> {
  runtimeDirectoryCache = runtimeDirectoryCache.filter((t) => t.slug !== slug);

  if (supabase) {
    try {
      await supabase.from("ai_directory").delete().eq("slug", slug);
    } catch (err) {
      console.warn("Supabase delete warning:", err);
    }
  }

  try {
    revalidatePath("/directory");
    revalidatePath("/");
  } catch (err) {
    console.warn("Path revalidation warning:", err);
  }

  return true;
}
