import { revalidatePath } from "next/cache";
import { supabase } from "./supabase";
import { LiveNewsItem, NewsCategory } from "./types";
import { fetchLiveAiNews } from "@/services/newsService";
import { getArticleTakeaway } from "@/services/geminiService";

let runtimeNewsCache: LiveNewsItem[] = [];

export async function getAllNewsArticles(): Promise<LiveNewsItem[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .order("is_pinned", { ascending: false })
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((row) => ({
          id: row.id,
          title: row.title,
          summary: row.summary,
          url: row.url,
          category: row.category as NewsCategory,
          sourceDomain: row.source_name || "source.wire",
          relativeTime: row.relative_time || "Recent",
          publishedAt: row.relative_time || "Recent",
          utcTimestamp: row.utc_timestamp || row.created_at,
          publishedUtc: row.utc_timestamp ? new Date(row.utc_timestamp).toUTCString().slice(5, 16) : "",
          aiTakeaway: row.ai_takeaway || undefined,
          isPinned: Boolean(row.is_pinned),
          score: row.score || 0,
          commentsCount: row.comments_count || 0,
        }));
      }
    } catch (err) {
      console.warn("Supabase articles read error, falling back:", err);
    }
  }

  if (runtimeNewsCache.length === 0) {
    runtimeNewsCache = await fetchLiveAiNews();
  }

  return runtimeNewsCache;
}

export async function syncLiveNewsWithGemini(): Promise<{ count: number; message: string }> {
  // 1. Fetch live incoming articles from public feeds
  const liveIncoming = await fetchLiveAiNews();

  // 2. Read existing articles from DB to preserve pinned items
  const existing = await getAllNewsArticles();
  const pinnedItems = existing.filter((a) => (a as any).isPinned);
  const pinnedUrls = new Set(pinnedItems.map((p) => p.url));

  // 3. For the top 5 new incoming items without takeaway, generate Gemini summary
  const enrichedArticles: LiveNewsItem[] = [];

  for (let i = 0; i < liveIncoming.length; i++) {
    const item = liveIncoming[i];
    if (pinnedUrls.has(item.url)) continue;

    let takeaway = item.aiTakeaway;
    if (!takeaway && i < 4) {
      try {
        takeaway = await getArticleTakeaway(item.title, item.summary);
      } catch (err) {
        console.warn("Gemini takeaway generation in sync:", err);
      }
    }

    enrichedArticles.push({
      ...item,
      aiTakeaway: takeaway,
    });
  }

  const finalCollection = [...pinnedItems, ...enrichedArticles].slice(0, 30);
  runtimeNewsCache = finalCollection;

  // 4. Save to Supabase if configured
  if (supabase) {
    const rows = finalCollection.map((art) => ({
      title: art.title,
      summary: art.summary,
      url: art.url,
      category: art.category,
      source_name: art.sourceDomain,
      relative_time: art.relativeTime,
      utc_timestamp: art.utcTimestamp,
      ai_takeaway: art.aiTakeaway || null,
      is_pinned: Boolean((art as any).isPinned),
      score: art.score || 0,
      comments_count: art.commentsCount || 0,
      updated_at: new Date().toISOString(),
    }));

    try {
      await supabase.from("articles").upsert(rows, { onConflict: "url" });
    } catch (err) {
      console.warn("Failed saving synchronized news to Supabase:", err);
    }
  }

  try {
    revalidatePath("/news");
    revalidatePath("/");
  } catch (err) {
    console.warn("Path revalidation warning:", err);
  }

  return {
    count: finalCollection.length,
    message: `Synchronized ${finalCollection.length} verified AI articles with Gemini takeaways.`,
  };
}

export async function createOrUpdateNewsArticle(
  article: Partial<LiveNewsItem> & { title: string; url: string; summary: string }
): Promise<LiveNewsItem> {
  const isPinned = Boolean((article as any).isPinned);

  const fullArticle: LiveNewsItem = {
    id: article.id || `custom-${Date.now()}`,
    title: article.title.trim(),
    summary: article.summary.trim(),
    url: article.url.trim(),
    category: article.category || "LLMs",
    sourceDomain: article.sourceDomain?.trim() || "editorial.wire",
    relativeTime: article.relativeTime || "Just now",
    publishedAt: article.relativeTime || "Just now",
    utcTimestamp: article.utcTimestamp || new Date().toISOString(),
    publishedUtc: new Date().toUTCString().slice(5, 16),
    aiTakeaway: article.aiTakeaway?.trim() || undefined,
    score: article.score || 100,
    commentsCount: article.commentsCount || 0,
  };

  (fullArticle as any).isPinned = isPinned;

  // Update in runtime
  const idx = runtimeNewsCache.findIndex((a) => a.url === fullArticle.url || a.id === fullArticle.id);
  if (idx >= 0) {
    runtimeNewsCache[idx] = fullArticle;
  } else {
    runtimeNewsCache.unshift(fullArticle);
  }

  if (supabase) {
    const row = {
      title: fullArticle.title,
      summary: fullArticle.summary,
      url: fullArticle.url,
      category: fullArticle.category,
      source_name: fullArticle.sourceDomain,
      relative_time: fullArticle.relativeTime,
      utc_timestamp: fullArticle.utcTimestamp,
      ai_takeaway: fullArticle.aiTakeaway || null,
      is_pinned: isPinned,
      score: fullArticle.score || 0,
      comments_count: fullArticle.commentsCount || 0,
      updated_at: new Date().toISOString(),
    };

    try {
      await supabase.from("articles").upsert(row, { onConflict: "url" });
    } catch (err) {
      console.warn("Supabase news upsert warning:", err);
    }
  }

  try {
    revalidatePath("/news");
    revalidatePath("/");
  } catch (err) {
    console.warn("Path revalidation warning:", err);
  }

  return fullArticle;
}

export async function deleteNewsArticle(idOrUrl: string | number): Promise<boolean> {
  runtimeNewsCache = runtimeNewsCache.filter((a) => a.id !== idOrUrl && a.url !== idOrUrl);

  if (supabase) {
    try {
      if (typeof idOrUrl === "number" || !isNaN(Number(idOrUrl))) {
        await supabase.from("articles").delete().eq("id", Number(idOrUrl));
      } else {
        await supabase.from("articles").delete().eq("url", String(idOrUrl));
      }
    } catch (err) {
      console.warn("Supabase news delete error:", err);
    }
  }

  try {
    revalidatePath("/news");
    revalidatePath("/");
  } catch (err) {
    console.warn("Path revalidation warning:", err);
  }

  return true;
}

export async function togglePinArticle(idOrUrl: string | number, currentPinStatus: boolean): Promise<boolean> {
  const newStatus = !currentPinStatus;

  runtimeNewsCache = runtimeNewsCache.map((a) => {
    if (a.id === idOrUrl || a.url === idOrUrl) {
      return { ...a, isPinned: newStatus };
    }
    return a;
  });

  if (supabase) {
    try {
      const query = typeof idOrUrl === "number" || !isNaN(Number(idOrUrl))
        ? supabase.from("articles").update({ is_pinned: newStatus }).eq("id", Number(idOrUrl))
        : supabase.from("articles").update({ is_pinned: newStatus }).eq("url", String(idOrUrl));
      await query;
    } catch (err) {
      console.warn("Supabase pin toggle error:", err);
    }
  }

  try {
    revalidatePath("/news");
    revalidatePath("/");
  } catch (err) {
    console.warn("Path revalidation warning:", err);
  }

  return newStatus;
}
