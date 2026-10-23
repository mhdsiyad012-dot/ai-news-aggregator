import { revalidatePath } from "next/cache";
import { supabase, supabaseAdmin } from "./supabase";
import { AI_DIRECTORY_DATA } from "@/data/aiDirectoryData";
import { AIDirectoryItem } from "./types";

let runtimeDirectoryCache: AIDirectoryItem[] = [...AI_DIRECTORY_DATA];

function cleanUrl(raw?: string): string {
  if (!raw) return "";
  let str = String(raw).trim();
  const mdMatch = str.match(/\[.*?\]\((https?:\/\/[^\s)]+)\)/);
  if (mdMatch) str = mdMatch[1];
  return str.replace(/^[<"']+|[>"']+$/g, "").trim();
}

function parseArrayField(val: unknown): string[] {
  if (!val) return [];
  if (Array.isArray(val)) {
    return val.map((x) => String(x || "").trim()).filter(Boolean);
  }
  if (typeof val === "string") {
    const trimmed = val.trim();
    if (!trimmed) return [];
    if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
      return trimmed
        .slice(1, -1)
        .split(",")
        .map((s) => s.replace(/^["']|["']$/g, "").trim())
        .filter(Boolean);
    }
    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return parsed.map((s) => String(s || "").trim()).filter(Boolean);
        }
      } catch {}
    }
    return trimmed.split(",").map((s) => s.trim()).filter(Boolean);
  }
  return [];
}

export async function getAllDirectoryItems(): Promise<AIDirectoryItem[]> {
  const client = supabaseAdmin || supabase;
  if (client) {
    try {
      const { data, error } = await client
        .from("ai_directory")
        .select("*")
        .order("is_featured", { ascending: false })
        .order("name", { ascending: true });

      if (!error && data && data.length > 0) {
        const dbItems: AIDirectoryItem[] = data.map((row) => ({
          id: row.id || row.slug,
          slug: row.slug || String(row.id || ""),
          name: row.name || "AI System",
          company: row.company || "Independent",
          category: row.category || "Workflow & Automation",
          secondaryCategories: parseArrayField(row.secondary_categories),
          tagline: row.tagline || "",
          description: row.description || "",
          keyFeatures: parseArrayField(row.key_features),
          bestFor: row.best_for,
          pricing: row.pricing || "Freemium",
          officialUrl: cleanUrl(row.official_url),
          isFeatured: Boolean(row.is_featured),
          architectureDetails: row.architecture_details || undefined,
          companyBackground: row.company_background || undefined,
          relatedToolSlugs: parseArrayField(row.related_tool_slugs),
        }));

        // Merge: DB items take precedence over default 45+ items
        const itemMap = new Map<string, AIDirectoryItem>();
        for (const defaultTool of AI_DIRECTORY_DATA) {
          const key = String(defaultTool.slug || defaultTool.id || "").toLowerCase();
          itemMap.set(key, defaultTool);
        }
        for (const dbTool of dbItems) {
          const key = String(dbTool.slug || dbTool.id || "").toLowerCase();
          const base = itemMap.get(key) || {};
          itemMap.set(key, { ...base, ...dbTool });
        }
        return Array.from(itemMap.values());
      }
    } catch (err) {
      console.warn("Supabase directory read error, using runtime items:", err);
    }
  }

  return runtimeDirectoryCache;
}

export async function getDirectoryItemBySlug(slug: string): Promise<AIDirectoryItem | null> {
  const targetSlug = (slug || "").toLowerCase().trim();
  if (!targetSlug) return null;

  const all = await getAllDirectoryItems();
  const match = all.find(
    (t) =>
      (t.slug || "").toLowerCase() === targetSlug ||
      String(t.id || "").toLowerCase() === targetSlug
  );

  if (match) {
    return {
      ...match,
      slug: match.slug || String(match.id || targetSlug),
    };
  }

  // Direct fallback to AI_DIRECTORY_DATA
  const staticMatch = AI_DIRECTORY_DATA.find(
    (t) =>
      (t.slug || "").toLowerCase() === targetSlug ||
      String(t.id || "").toLowerCase() === targetSlug
  );

  return staticMatch || null;
}

export async function seedDefaultDirectoryTools(): Promise<{ count: number; message: string }> {
  runtimeDirectoryCache = [...AI_DIRECTORY_DATA];

  const client = supabaseAdmin || supabase;
  if (!client) {
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
    const { error } = await client
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

  const client = supabaseAdmin || supabase;
  if (client) {
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

    const { error } = await client
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

  const client = supabaseAdmin || supabase;
  if (client) {
    try {
      await client.from("ai_directory").delete().eq("slug", slug);
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
