import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { AI_DIRECTORY_DATA } from "./data/directoryData";
import { SEED_NEWS_ARTICLES } from "./data/newsData";
import { AIDirectoryItem, NewsArticle } from "./types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith("https://") &&
  !supabaseUrl.includes("your-supabase-url")
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// In-memory runtime cache for seamless local CRUD when Supabase is not connected
let memoryArticles: NewsArticle[] = [...SEED_NEWS_ARTICLES];
let memoryDirectory: AIDirectoryItem[] = [...AI_DIRECTORY_DATA];

// -------------------------------------------------------------
// Articles CRUD
// -------------------------------------------------------------

export async function getNewsArticles(): Promise<NewsArticle[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .order("is_pinned", { ascending: false })
        .order("id", { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((item) => ({
          id: item.id,
          title: item.title,
          summary: item.summary,
          url: item.url,
          category: item.category,
          source_name: item.source_name || extractDomain(item.url),
          related_tools: item.related_tools || "",
          is_pinned: Boolean(item.is_pinned),
          published_at: item.published_at || (item.created_at ? formatTimeAgo(item.created_at) : "Recent Dispatch"),
          created_at: item.created_at,
        }));
      }
    } catch (err) {
      console.warn("Supabase articles query error, utilizing in-memory fallback:", err);
    }
  }

  // Sort pinned first
  return [...memoryArticles].sort((a, b) => {
    if (a.is_pinned && !b.is_pinned) return -1;
    if (!a.is_pinned && b.is_pinned) return 1;
    return (b.id || 0) - (a.id || 0);
  });
}

export async function createNewsArticle(article: Omit<NewsArticle, "id">): Promise<NewsArticle> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("articles")
        .insert([{
          title: article.title,
          summary: article.summary,
          url: article.url,
          category: article.category,
          source_name: article.source_name || extractDomain(article.url),
          related_tools: article.related_tools || "",
          is_pinned: Boolean(article.is_pinned),
          published_at: article.published_at || "Just now",
        }])
        .select()
        .single();

      if (!error && data) {
        return data as NewsArticle;
      }
    } catch (err) {
      console.warn("Supabase insert error, persisting to memory cache:", err);
    }
  }

  const newArticle: NewsArticle = {
    ...article,
    id: Date.now(),
    source_name: article.source_name || extractDomain(article.url),
    published_at: article.published_at || "Just now",
    is_pinned: Boolean(article.is_pinned),
  };
  memoryArticles.unshift(newArticle);
  return newArticle;
}

export async function updateNewsArticle(id: number, updates: Partial<NewsArticle>): Promise<NewsArticle | null> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("articles")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (!error && data) {
        return data as NewsArticle;
      }
    } catch (err) {
      console.warn("Supabase update error, updating memory cache:", err);
    }
  }

  const index = memoryArticles.findIndex((a) => a.id === id);
  if (index !== -1) {
    memoryArticles[index] = { ...memoryArticles[index], ...updates };
    return memoryArticles[index];
  }
  return null;
}

export async function deleteNewsArticle(id: number): Promise<boolean> {
  if (supabase) {
    try {
      const { error } = await supabase.from("articles").delete().eq("id", id);
      if (!error) return true;
    } catch (err) {
      console.warn("Supabase delete error:", err);
    }
  }

  const initialLength = memoryArticles.length;
  memoryArticles = memoryArticles.filter((a) => a.id !== id);
  return memoryArticles.length < initialLength;
}

// -------------------------------------------------------------
// AI Directory CRUD
// -------------------------------------------------------------

export async function getAIDirectory(): Promise<AIDirectoryItem[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("ai_directory")
        .select("*")
        .order("is_featured", { ascending: false })
        .order("name", { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map((item) => ({
          ...item,
          is_featured: Boolean(item.is_featured),
          tags: typeof item.tags === "string" ? safeJsonParse(item.tags, []) : item.tags,
          key_capabilities: typeof item.key_capabilities === "string" ? safeJsonParse(item.key_capabilities, []) : item.key_capabilities,
          best_use_cases: typeof item.best_use_cases === "string" ? safeJsonParse(item.best_use_cases, []) : item.best_use_cases,
        }));
      }
    } catch (err) {
      console.warn("Supabase directory query error, utilizing in-memory fallback:", err);
    }
  }

  return [...memoryDirectory].sort((a, b) => {
    if (a.is_featured && !b.is_featured) return -1;
    if (!a.is_featured && b.is_featured) return 1;
    return a.name.localeCompare(b.name);
  });
}

export async function createAIDirectoryItem(item: AIDirectoryItem): Promise<AIDirectoryItem> {
  const serialized = {
    ...item,
    tags: JSON.stringify(item.tags),
    key_capabilities: JSON.stringify(item.key_capabilities),
    best_use_cases: JSON.stringify(item.best_use_cases),
    is_featured: Boolean(item.is_featured),
  };

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("ai_directory")
        .insert([serialized])
        .select()
        .single();

      if (!error && data) {
        return {
          ...data,
          tags: safeJsonParse(data.tags, []),
          key_capabilities: safeJsonParse(data.key_capabilities, []),
          best_use_cases: safeJsonParse(data.best_use_cases, []),
        };
      }
    } catch (err) {
      console.warn("Supabase insert error, persisting to memory cache:", err);
    }
  }

  const newItem: AIDirectoryItem = {
    ...item,
    id: Date.now(),
  };
  memoryDirectory.unshift(newItem);
  return newItem;
}

export async function updateAIDirectoryItem(identifier: string | number, updates: Partial<AIDirectoryItem>): Promise<AIDirectoryItem | null> {
  const dbUpdates: any = { ...updates };
  if (updates.tags) dbUpdates.tags = JSON.stringify(updates.tags);
  if (updates.key_capabilities) dbUpdates.key_capabilities = JSON.stringify(updates.key_capabilities);
  if (updates.best_use_cases) dbUpdates.best_use_cases = JSON.stringify(updates.best_use_cases);

  if (supabase) {
    try {
      let query = supabase.from("ai_directory").update(dbUpdates);
      if (typeof identifier === "number") {
        query = query.eq("id", identifier);
      } else {
        query = query.eq("slug", identifier);
      }
      const { data, error } = await query.select().single();

      if (!error && data) {
        return {
          ...data,
          tags: safeJsonParse(data.tags, []),
          key_capabilities: safeJsonParse(data.key_capabilities, []),
          best_use_cases: safeJsonParse(data.best_use_cases, []),
        };
      }
    } catch (err) {
      console.warn("Supabase update error, updating memory cache:", err);
    }
  }

  const index = memoryDirectory.findIndex((i) => i.id === identifier || i.slug === identifier);
  if (index !== -1) {
    memoryDirectory[index] = { ...memoryDirectory[index], ...updates };
    return memoryDirectory[index];
  }
  return null;
}

export async function deleteAIDirectoryItem(identifier: string | number): Promise<boolean> {
  if (supabase) {
    try {
      let query = supabase.from("ai_directory").delete();
      if (typeof identifier === "number") {
        query = query.eq("id", identifier);
      } else {
        query = query.eq("slug", identifier);
      }
      const { error } = await query;
      if (!error) return true;
    } catch (err) {
      console.warn("Supabase delete error:", err);
    }
  }

  const initialLength = memoryDirectory.length;
  memoryDirectory = memoryDirectory.filter((i) => i.id !== identifier && i.slug !== identifier);
  return memoryDirectory.length < initialLength;
}

export function resetDirectorySeed(): void {
  memoryDirectory = [...AI_DIRECTORY_DATA];
  memoryArticles = [...SEED_NEWS_ARTICLES];
}

// -------------------------------------------------------------
// Utilities
// -------------------------------------------------------------

function safeJsonParse(val: any, fallback: any) {
  if (Array.isArray(val)) return val;
  try {
    return JSON.parse(val);
  } catch {
    if (typeof val === "string" && val.includes(",")) {
      return val.split(",").map((s) => s.trim());
    }
    return fallback;
  }
}

function extractDomain(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./, "");
  } catch {
    return "Intelligence Wire";
  }
}

function formatTimeAgo(dateStr: string): string {
  try {
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours < 1) return "Just now";
    if (diffHours === 1) return "1 hour ago";
    if (diffHours < 24) return `${diffHours} hours ago`;
    const diffDays = Math.floor(diffHours / 24);
    return diffDays === 1 ? "1 day ago" : `${diffDays} days ago`;
  } catch {
    return "Recent Wire Dispatch";
  }
}
