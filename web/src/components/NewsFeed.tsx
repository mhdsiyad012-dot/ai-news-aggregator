"use client";

import React, { useState, useMemo } from "react";
import { 
  Newspaper, 
  Search, 
  Filter, 
  Copy, 
  Check, 
  Clock, 
  ArrowUpRight,
  Pin,
  Bookmark,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { NewsArticle, WireCategory, AIDirectoryItem } from "@/lib/types";
import { BrandLogo } from "./BrandLogo";
import { useBookmarks } from "@/lib/bookmarks";

interface NewsFeedProps {
  articles: NewsArticle[];
  allTools?: AIDirectoryItem[];
  onInspectTool?: (tool: AIDirectoryItem) => void;
}

const WIRE_CATEGORIES: WireCategory[] = [
  "All",
  "LLMs",
  "Code Builders",
  "Hardware",
  "Robotics",
  "Startups",
];

export function NewsFeed({ 
  articles, 
  allTools = [], 
  onInspectTool 
}: NewsFeedProps) {
  const [selectedCategory, setSelectedCategory] = useState<WireCategory>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const { isArticleSaved, toggleArticleBookmark } = useBookmarks();

  const filteredArticles = useMemo(() => {
    return articles.filter((art) => {
      const matchesCategory =
        selectedCategory === "All" ||
        art.category.toLowerCase() === selectedCategory.toLowerCase();

      const query = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !query ||
        art.title.toLowerCase().includes(query) ||
        art.summary.toLowerCase().includes(query) ||
        art.category.toLowerCase().includes(query) ||
        (art.source_name && art.source_name.toLowerCase().includes(query)) ||
        (art.related_tools && art.related_tools.toLowerCase().includes(query));

      return matchesCategory && matchesQuery;
    });
  }, [articles, selectedCategory, searchQuery]);

  const handleCopyCitation = (article: NewsArticle) => {
    const citation = `"${article.title}" - ${article.source_name || "Daily Wire"}: ${article.url}`;
    navigator.clipboard.writeText(citation);
    setCopiedId(article.id || 0);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Helper to match a related tool string to an indexed AIDirectoryItem
  const findMatchingTool = (toolName: string): AIDirectoryItem | undefined => {
    const clean = toolName.trim().toLowerCase();
    if (!clean) return undefined;
    return allTools.find((t) => {
      const slugLower = t.slug.toLowerCase();
      const nameLower = t.name.toLowerCase();
      return (
        slugLower === clean ||
        nameLower.includes(clean) ||
        clean.includes(slugLower) ||
        (clean.includes("gemini") && slugLower.includes("gemini")) ||
        (clean.includes("claude") && slugLower.includes("claude")) ||
        (clean.includes("codex") && slugLower.includes("codex")) ||
        (clean.includes("cursor") && slugLower.includes("cursor")) ||
        (clean.includes("deepseek") && slugLower.includes("deepseek")) ||
        (clean.includes("llama") && slugLower.includes("llama"))
      );
    });
  };

  return (
    <div className="space-y-6">
      {/* Wire Header & Controls */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#121318] p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 rounded-full bg-sky-500/10 border border-sky-500/20 px-3 py-1 text-xs font-medium text-sky-400 mb-3">
              <Newspaper className="h-3.5 w-3.5 text-sky-400" />
              <span>EDITORIAL TECH INTELLIGENCE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Daily Tech & AI Intelligence Wire
            </h1>
            <p className="text-sm text-zinc-400 mt-2 max-w-2xl leading-relaxed">
              Continuous dispatches aggregated across leading engineering blogs and frontier research labs, synthesized into executive digests for developers and architects.
            </p>
          </div>

          <div className="flex items-center space-x-3 rounded-xl border border-white/[0.08] bg-black/40 px-4 py-3 text-xs">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <div>
              <div className="text-[11px] text-zinc-400">DISPATCH CADENCE</div>
              <div className="font-semibold text-white">Continuous Ingestion</div>
            </div>
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="pt-2 border-t border-white/[0.06] flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-medium text-zinc-400 mr-2 flex items-center">
            <Filter className="h-3 w-3 mr-1" />
            FILTER:
          </span>
          {WIRE_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            const count =
              cat === "All"
                ? articles.length
                : articles.filter(
                    (a) => a.category.toLowerCase() === cat.toLowerCase()
                  ).length;

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex items-center space-x-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  isSelected
                    ? "bg-white text-zinc-950 font-semibold shadow-xs"
                    : "bg-white/[0.03] border border-white/[0.06] text-zinc-400 hover:text-white hover:bg-white/[0.06]"
                }`}
              >
                <span>{cat}</span>
                <span className={`text-[10px] font-bold ${isSelected ? "text-zinc-950" : "text-zinc-500"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative pt-1 border-t border-white/[0.06]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search headlines, summaries, sources, or tools..."
            className="w-full rounded-xl border border-white/[0.08] bg-black/40 pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-sky-500/50 focus:outline-hidden"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-zinc-500 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Wire List Header */}
      <div className="flex items-center justify-between text-xs text-zinc-400 px-1 font-medium">
        <span>Showing {filteredArticles.length} of {articles.length} Dispatches</span>
        <span>Verified Sources & AI Synthesis</span>
      </div>

      {/* Wire Articles List */}
      {filteredArticles.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.08] bg-[#121318]/50 p-12 text-center">
          <Newspaper className="h-10 w-10 text-zinc-500 mb-3" />
          <p className="text-sm font-semibold text-white">No wire articles match current criteria</p>
          <p className="text-xs text-zinc-400 mt-1">
            Try resetting your category or query filters.
          </p>
          <button
            onClick={() => {
              setSelectedCategory("All");
              setSearchQuery("");
            }}
            className="mt-4 rounded-xl bg-white text-zinc-950 font-medium px-4 py-2 text-xs hover:bg-zinc-200 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredArticles.map((article) => {
            const isCopied = copiedId === article.id;
            const bookmarked = Boolean(article.id && isArticleSaved(article.id));
            const toolsList = article.related_tools
              ? article.related_tools.split(",").map((s) => s.trim()).filter(Boolean)
              : [];

            return (
              <article
                key={article.id || article.url}
                className={`group relative rounded-xl border bg-[#121318] hover:border-white/20 hover:bg-[#181A20] transition-all duration-150 p-5 sm:p-6 shadow-sm ${
                  article.is_pinned
                    ? "border-emerald-500/40 bg-gradient-to-r from-emerald-950/20 via-[#121318] to-[#121318]"
                    : "border-white/[0.08]"
                }`}
              >
                {/* Article Header Metadata */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                  <div className="flex flex-wrap items-center gap-2">
                    {article.is_pinned && (
                      <span className="flex items-center space-x-1 rounded-md border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-400">
                        <Pin className="h-3 w-3 rotate-45" />
                        <span>Pinned Headline</span>
                      </span>
                    )}

                    <span className="rounded-md border border-white/[0.08] bg-white/[0.04] px-2 py-0.5 text-[11px] font-medium text-sky-400">
                      {article.category}
                    </span>

                    <span className="text-xs text-zinc-400 font-medium">
                      {article.source_name || "Daily Wire"}
                    </span>

                    <span className="text-zinc-600">•</span>

                    <span className="flex items-center space-x-1 text-xs text-zinc-400">
                      <Clock className="h-3 w-3" />
                      <span>{article.published_at || "Recent"}</span>
                    </span>
                  </div>

                  {/* Actions: Bookmark, Cite, Read */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => article.id && toggleArticleBookmark(article.id)}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        bookmarked
                          ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                          : "border-white/[0.08] bg-white/[0.03] text-zinc-400 hover:text-white"
                      }`}
                      title={bookmarked ? "Saved in Library" : "Bookmark Story"}
                    >
                      <Bookmark className={`h-3.5 w-3.5 ${bookmarked ? "fill-current" : ""}`} />
                    </button>

                    <button
                      onClick={() => handleCopyCitation(article)}
                      className="flex items-center space-x-1 rounded-lg border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-xs text-zinc-400 hover:text-white transition-colors"
                      title="Copy headline & citation"
                    >
                      {isCopied ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-400" />
                          <span className="text-emerald-400 font-medium">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          <span>Cite</span>
                        </>
                      )}
                    </button>

                    <a
                      href={article.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center space-x-1 rounded-lg border border-white/[0.08] bg-white/[0.06] px-3 py-1 text-xs font-semibold text-white hover:bg-white hover:text-zinc-950 transition-colors"
                    >
                      <span>Read</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>

                {/* Headline */}
                <h2 className="text-base sm:text-lg font-bold tracking-tight text-white group-hover:text-sky-300 transition-colors leading-snug">
                  <a href={article.url} target="_blank" rel="noreferrer">
                    {article.title}
                  </a>
                </h2>

                {/* Summary */}
                <div className="mt-2.5 border-l-2 border-white/[0.1] group-hover:border-sky-500/60 pl-3.5 transition-colors">
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                    {article.summary}
                  </p>
                </div>

                {/* Smart Cross-Linking: Related Tools Chips */}
                {toolsList.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-white/[0.06] flex flex-wrap items-center gap-2">
                    <span className="text-xs text-zinc-400 font-medium">Related Systems:</span>
                    {toolsList.map((toolName, idx) => {
                      const matchedItem = findMatchingTool(toolName);
                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            if (matchedItem && onInspectTool) {
                              onInspectTool(matchedItem);
                            }
                          }}
                          className={`flex items-center space-x-1.5 rounded-lg border px-2.5 py-1 text-xs transition-colors ${
                            matchedItem
                              ? "border-white/[0.1] bg-white/[0.04] text-zinc-200 hover:border-emerald-500/50 hover:text-emerald-300 hover:bg-emerald-500/10 cursor-pointer"
                              : "border-white/[0.06] bg-white/[0.02] text-zinc-400 cursor-default"
                          }`}
                          title={matchedItem ? `Click to inspect ${matchedItem.name}` : undefined}
                        >
                          <BrandLogo slug={matchedItem?.slug || toolName} name={toolName} size="xs" />
                          <span className="font-medium">{toolName}</span>
                          {matchedItem && <ArrowRight className="h-2.5 w-2.5 text-zinc-500" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
