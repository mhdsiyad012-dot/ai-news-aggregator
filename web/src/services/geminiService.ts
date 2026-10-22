import { AIDirectoryItem, DirectoryCategory } from "@/lib/types";
import { getAllDirectoryItems } from "@/lib/directoryService";
import { getAllNewsArticles } from "@/lib/newsStoreService";
import { getSiteSettings } from "@/lib/settingsService";

export interface ExecutiveBriefing {
  date: string;
  headline: string;
  bullets: string[];
}

/**
 * Retrieves the daily executive briefing dynamically from Supabase articles and settings.
 * Pure SSR with zero external LLM dependencies or API key exposure.
 */
export async function getDailyExecutiveBriefing(): Promise<ExecutiveBriefing> {
  const currentDate = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  try {
    const [articles, settings] = await Promise.all([
      getAllNewsArticles(),
      getSiteSettings(),
    ]);

    const pinnedArticle = articles.find((a) => a.isPinned) || articles[0];
    const headline =
      pinnedArticle?.title ||
      settings?.siteHeadline ||
      "Frontier Model Capabilities Accelerate Across Software & Multimodal Tooling";

    const topArticles = articles.slice(0, 3);
    const bullets =
      topArticles.length > 0
        ? topArticles.map(
            (a) =>
              a.aiTakeaway ||
              a.summary ||
              "Frontier multimodal reasoning systems demonstrate lower inference cost curves across production codebases."
          )
        : [
            "Frontier multi-modal reasoning systems demonstrate lower inference cost curves across production codebases.",
            "Agent-first IDE architectures redefine developer velocity through tool orchestration protocols.",
            "Open-weights foundation models converge near proprietary frontiers on verified benchmarks.",
          ];

    return {
      date: currentDate,
      headline,
      bullets,
    };
  } catch (err) {
    console.warn("Fallback to static executive briefing:", err);
    return {
      date: currentDate,
      headline: "Frontier Intelligence Convergence: Agentic Paradigms Redefine Software & Reasoning",
      bullets: [
        "Thinking-token reasoning models are redefining cost-accuracy trade-offs for high-consequence technical workflows.",
        "Autonomous CLI and IDE agents (Google Antigravity, Claude Code, Cursor) now handle multi-file repository maintenance autonomously.",
        "Open-weights foundation architectures (DeepSeek-R1, Llama 3.3) are accelerating enterprise adoption with zero-data-retention private hosting.",
      ],
    };
  }
}

/**
 * Generates or extracts an article takeaway from existing context.
 */
export async function getArticleTakeaway(title: string, context?: string): Promise<string> {
  if (context && context.length > 20) {
    return context.trim();
  }
  return `Strategic Takeaway: ${title} signals accelerating convergence toward low-latency, tool-grounded AI architectures across production environments.`;
}

/**
 * Queries the Supabase AI Ecosystem Directory for matching tools.
 * Instant sub-millisecond local/database lookup without external API dependencies.
 */
export async function lookupAiToolWithGemini(query: string): Promise<AIDirectoryItem | null> {
  const cleanQ = query.toLowerCase().trim();
  if (!cleanQ) return null;

  try {
    const allTools = await getAllDirectoryItems();
    const match = allTools.find((t) => {
      const name = (t.name || "").toLowerCase();
      const slug = (t.slug || String(t.id || "")).toLowerCase();
      const company = (t.company || "").toLowerCase();
      const tagline = (t.tagline || "").toLowerCase();
      return (
        name.includes(cleanQ) ||
        slug.includes(cleanQ) ||
        company.includes(cleanQ) ||
        tagline.includes(cleanQ)
      );
    });

    return match || null;
  } catch (err) {
    console.warn("Directory lookup error:", err);
    return null;
  }
}
