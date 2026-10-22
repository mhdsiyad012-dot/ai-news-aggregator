"use client";

import React, { useState } from "react";
import { Bookmark, Sparkles, ExternalLink, ArrowRight, Trash2, Cpu, Newspaper, Star } from "lucide-react";
import { AIDirectoryItem, NewsArticle } from "@/lib/types";
import { BrandLogo } from "./BrandLogo";
import { useBookmarks } from "@/lib/bookmarks";

interface SavedLibraryProps {
  allTools: AIDirectoryItem[];
  allArticles: NewsArticle[];
  onInspectTool: (tool: AIDirectoryItem) => void;
  onNavigateToDirectory: () => void;
  onNavigateToWire: () => void;
}

export function SavedLibrary({
  allTools,
  allArticles,
  onInspectTool,
  onNavigateToDirectory,
  onNavigateToWire,
}: SavedLibraryProps) {
  const {
    savedToolSlugs,
    savedArticleIds,
    toggleToolBookmark,
    toggleArticleBookmark,
    clearAllBookmarks,
  } = useBookmarks();

  const [filterType, setFilterType] = useState<"all" | "tools" | "articles">("all");

  const savedTools = allTools.filter((t) => savedToolSlugs.includes(t.slug));
  const savedArticles = allArticles.filter((a) => a.id && savedArticleIds.includes(a.id));

  const totalSaved = savedTools.length + savedArticles.length;

  if (totalSaved === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center rounded-2xl border border-white/[0.08] bg-[#121318]/60 backdrop-blur-md">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.04] border border-white/[0.08] text-zinc-400 mb-4 shadow-inner">
          <Bookmark className="h-6 w-6 text-zinc-400" />
        </div>
        <h2 className="text-xl font-semibold text-white tracking-tight">Your Saved Library is Empty</h2>
        <p className="text-sm text-zinc-400 max-w-md mt-1.5 mb-6">
          Bookmark any AI model, agent, code builder, or breaking story across PulseAI to save it here for quick reference.
        </p>
        <div className="flex items-center space-x-3">
          <button
            onClick={onNavigateToDirectory}
            className="flex items-center space-x-2 rounded-xl bg-white text-zinc-950 font-medium px-4 py-2 text-xs hover:bg-zinc-200 transition-all shadow-md"
          >
            <Cpu className="h-3.5 w-3.5 text-zinc-950" />
            <span>Explore AI Models</span>
          </button>
          <button
            onClick={onNavigateToWire}
            className="flex items-center space-x-2 rounded-xl bg-white/[0.06] border border-white/[0.1] text-zinc-200 font-medium px-4 py-2 text-xs hover:bg-white/[0.1] transition-all"
          >
            <Newspaper className="h-3.5 w-3.5 text-zinc-300" />
            <span>Read Daily Wire</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-white/[0.08] bg-[#121318] p-6 shadow-sm">
        <div>
          <div className="flex items-center space-x-2 text-xs font-medium text-emerald-400 mb-1">
            <Bookmark className="h-3.5 w-3.5 fill-current" />
            <span>PERSONAL COLLECTION</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Saved Library</h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Locally bookmarked AI systems and curated intelligence dispatches ({totalSaved} items).
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Filter switch pills */}
          <div className="flex items-center rounded-xl border border-white/[0.08] bg-black/40 p-1 text-xs">
            <button
              onClick={() => setFilterType("all")}
              className={`rounded-lg px-3 py-1.5 transition-colors ${
                filterType === "all"
                  ? "bg-white text-zinc-950 font-medium shadow-xs"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              All ({totalSaved})
            </button>
            <button
              onClick={() => setFilterType("tools")}
              className={`rounded-lg px-3 py-1.5 transition-colors ${
                filterType === "tools"
                  ? "bg-white text-zinc-950 font-medium shadow-xs"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Models ({savedTools.length})
            </button>
            <button
              onClick={() => setFilterType("articles")}
              className={`rounded-lg px-3 py-1.5 transition-colors ${
                filterType === "articles"
                  ? "bg-white text-zinc-950 font-medium shadow-xs"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              News ({savedArticles.length})
            </button>
          </div>

          <button
            onClick={clearAllBookmarks}
            className="flex items-center space-x-1.5 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-500/20 transition-colors"
            title="Clear all saved items"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Clear All</span>
          </button>
        </div>
      </div>

      {/* Saved Tools Section */}
      {(filterType === "all" || filterType === "tools") && savedTools.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-sm font-semibold text-zinc-300">
            <Cpu className="h-4 w-4 text-emerald-400" />
            <span>Bookmarked AI Tools & Models ({savedTools.length})</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedTools.map((tool) => (
              <div
                key={tool.slug}
                className="group relative flex flex-col justify-between rounded-xl border border-white/[0.08] bg-[#121318] p-5 hover:border-white/20 hover:bg-[#181A20] transition-all duration-150 shadow-sm"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center space-x-3">
                      <BrandLogo slug={tool.slug} name={tool.name} creator={tool.creator} size="md" />
                      <div>
                        <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                          {tool.name}
                        </h3>
                        <span className="text-xs text-zinc-400">{tool.creator}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleToolBookmark(tool.slug)}
                      className="text-emerald-400 hover:text-zinc-400 p-1 transition-colors"
                      title="Remove bookmark"
                    >
                      <Bookmark className="h-4 w-4 fill-current" />
                    </button>
                  </div>

                  <p className="text-xs text-zinc-300 line-clamp-2 mb-3 leading-relaxed">
                    {tool.short_purpose}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    <span className="rounded-md border border-white/[0.08] bg-white/[0.04] px-2 py-0.5 text-[11px] font-medium text-zinc-300">
                      {tool.primary_category}
                    </span>
                    <span className="rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-400">
                      {tool.pricing_model.split(";")[0]}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
                  <button
                    onClick={() => onInspectTool(tool)}
                    className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center space-x-1"
                  >
                    <span>View Inspector</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>

                  <a
                    href={tool.official_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-zinc-400 hover:text-white flex items-center space-x-1"
                  >
                    <span>Website</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Saved Articles Section */}
      {(filterType === "all" || filterType === "articles") && savedArticles.length > 0 && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center space-x-2 text-sm font-semibold text-zinc-300">
            <Newspaper className="h-4 w-4 text-sky-400" />
            <span>Bookmarked News Dispatches ({savedArticles.length})</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedArticles.map((art) => (
              <div
                key={art.id}
                className="group relative flex flex-col justify-between rounded-xl border border-white/[0.08] bg-[#121318] p-5 hover:border-white/20 hover:bg-[#181A20] transition-all duration-150 shadow-sm"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="rounded-md border border-sky-500/30 bg-sky-500/10 px-2 py-0.5 text-[10px] font-semibold text-sky-400 uppercase tracking-wide">
                        {art.category}
                      </span>
                      <span className="text-xs text-zinc-400">
                        {art.source_name || "Intelligence Wire"}
                      </span>
                    </div>

                    <button
                      onClick={() => art.id && toggleArticleBookmark(art.id)}
                      className="text-sky-400 hover:text-zinc-400 p-1 transition-colors"
                      title="Remove bookmark"
                    >
                      <Bookmark className="h-4 w-4 fill-current" />
                    </button>
                  </div>

                  <h3 className="text-sm font-bold text-white group-hover:text-sky-300 transition-colors leading-snug mb-2">
                    {art.title}
                  </h3>

                  <p className="text-xs text-zinc-300 leading-relaxed mb-4 line-clamp-3">
                    {art.summary}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/[0.06] text-xs">
                  <span className="text-zinc-500">{art.published_at || "Recent"}</span>

                  <a
                    href={art.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 font-medium text-sky-400 hover:text-sky-300"
                  >
                    <span>Read Original Article</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
