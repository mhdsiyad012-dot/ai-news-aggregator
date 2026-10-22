"use client";

import React, { useState, useMemo } from "react";
import { 
  Newspaper, 
  Search, 
  Filter, 
  Copy, 
  Check, 
  Clock, 
  Radio, 
  ArrowUpRight,
  Pin,
  Tag
} from "lucide-react";
import { NewsArticle, WireCategory } from "@/lib/types";

interface NewsFeedProps {
  articles: NewsArticle[];
}

const WIRE_CATEGORIES: WireCategory[] = [
  "All",
  "LLMs",
  "Code Builders",
  "Hardware",
  "Robotics",
  "Startups",
];

export function NewsFeed({ articles }: NewsFeedProps) {
  const [selectedCategory, setSelectedCategory] = useState<WireCategory>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<number | null>(null);

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
    const citation = `"${article.title}" - ${article.source_name || "Intelligence Wire"} [${article.category}]: ${article.url}`;
    navigator.clipboard.writeText(citation);
    setCopiedId(article.id || 0);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Wire Header & Telemetry */}
      <div className="border border-[#27272A] bg-[#121215] p-5 sm:p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-[#A1A1AA] mb-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>DAILY WIRE DISPATCHES // AUTO-INGESTED & SUMMARIZED WITH GEMINI 2.0</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#FAFAFA]">
              AI & Frontier Technology Intelligence Wire
            </h1>
            <p className="text-xs sm:text-sm text-[#A1A1AA] mt-1 max-w-3xl font-sans">
              Aggregated across primary engineering publications, synthesized into neutral 2-sentence executive digests, and classified for software engineers and systems architects.
            </p>
          </div>

          <div className="flex items-center space-x-3 border border-[#27272A] bg-[#0E0E11] px-3 py-2 text-xs font-mono text-[#A1A1AA]">
            <Radio className="h-3.5 w-3.5 text-emerald-400" />
            <div>
              <div className="text-[10px] text-[#71717A]">DISPATCH CADENCE</div>
              <div className="text-[#FAFAFA] font-semibold">Continuous Ingestion</div>
            </div>
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[#1F1F23]">
          <span className="text-xs font-mono text-[#71717A] mr-2 flex items-center">
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
                className={`flex items-center space-x-1.5 border px-3 py-1.5 text-xs font-mono transition-colors ${
                  isSelected
                    ? "border-white bg-[#27272A] text-white font-semibold"
                    : "border-[#27272A] bg-[#0E0E11] text-[#A1A1AA] hover:border-[#3F3F46] hover:text-[#FAFAFA]"
                }`}
              >
                <span>{cat}</span>
                <span className={`text-[10px] ${isSelected ? "text-emerald-300 font-bold" : "text-[#71717A]"}`}>
                  [{count}]
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative pt-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#71717A]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search wire dispatches by headline, summary keywords, source, or related tools..."
            className="w-full border border-[#27272A] bg-[#09090B] pl-9 pr-4 py-2 text-xs font-mono text-[#FAFAFA] placeholder-[#71717A] focus:border-[#52525B] focus:outline-hidden"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-[#71717A] hover:text-white"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Wire List Counter */}
      <div className="flex items-center justify-between text-xs font-mono text-[#71717A] px-1">
        <span>SHOWING {filteredArticles.length} OF {articles.length} DISPATCHES</span>
        <span>SYNTHESIZED VIA GOOGLE GENAI PIPELINE</span>
      </div>

      {/* Wire Articles List */}
      {filteredArticles.length === 0 ? (
        <div className="flex flex-col items-center justify-center border border-dashed border-[#27272A] bg-[#121215] p-12 text-center">
          <Newspaper className="h-10 w-10 text-[#52525B] mb-3" />
          <p className="text-sm font-semibold text-[#FAFAFA]">No wire articles match current criteria</p>
          <p className="text-xs font-mono text-[#71717A] mt-1">
            Try resetting your category or query filters.
          </p>
          <button
            onClick={() => {
              setSelectedCategory("All");
              setSearchQuery("");
            }}
            className="mt-4 border border-[#27272A] bg-[#18181B] px-3 py-1.5 text-xs font-mono text-emerald-400 hover:bg-[#27272A]"
          >
            Reset Wire Filters
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredArticles.map((article) => {
            const isCopied = copiedId === article.id;

            return (
              <article
                key={article.id || article.url}
                className={`group border bg-[#121215] hover:border-[#3F3F46] hover:bg-[#151519] transition-all duration-150 p-4 sm:p-5 ${
                  article.is_pinned
                    ? "border-emerald-500/40 bg-gradient-to-r from-emerald-950/20 to-transparent"
                    : "border-[#27272A]"
                }`}
              >
                {/* Article Header Metadata */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center space-x-2">
                    {article.is_pinned && (
                      <span className="flex items-center space-x-1 border border-emerald-500/60 bg-emerald-500/20 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-400">
                        <Pin className="h-2.5 w-2.5 rotate-45" />
                        <span>PINNED DISPATCH</span>
                      </span>
                    )}

                    <span className="border border-[#27272A] bg-[#18181B] px-2 py-0.5 text-[10px] font-mono font-medium text-emerald-400">
                      {article.category}
                    </span>

                    <span className="text-[11px] font-mono text-[#71717A]">
                      SRC: <span className="text-[#A1A1AA]">{article.source_name || "Feed"}</span>
                    </span>

                    <span className="text-[#3F3F46]">/</span>

                    <span className="flex items-center space-x-1 text-[11px] font-mono text-[#71717A]">
                      <Clock className="h-3 w-3" />
                      <span>{article.published_at || "Recent"}</span>
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleCopyCitation(article)}
                      className="flex items-center space-x-1 border border-[#27272A] bg-[#0E0E11] px-2 py-1 text-[10px] font-mono text-[#71717A] hover:text-[#FAFAFA] transition-colors"
                      title="Copy headline & citation"
                    >
                      {isCopied ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
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
                      className="flex items-center space-x-1 border border-[#27272A] bg-[#18181B] px-2.5 py-1 text-[10px] font-mono text-[#FAFAFA] hover:bg-[#27272A] hover:border-[#3F3F46] transition-colors"
                    >
                      <span>Read Source</span>
                      <ArrowUpRight className="h-3 w-3 text-emerald-400" />
                    </a>
                  </div>
                </div>

                {/* Headline */}
                <h2 className="text-base sm:text-lg font-bold tracking-tight text-white group-hover:text-emerald-300 transition-colors">
                  <a href={article.url} target="_blank" rel="noreferrer">
                    {article.title}
                  </a>
                </h2>

                {/* AI Executive Summary */}
                <div className="mt-2.5 border-l-2 border-[#27272A] group-hover:border-emerald-500/50 pl-3 transition-colors">
                  <p className="text-xs sm:text-sm text-[#D4D4D8] leading-relaxed">
                    {article.summary}
                  </p>
                </div>

                {/* Related Tools Tags if present */}
                {article.related_tools && (
                  <div className="mt-3 pt-2.5 border-t border-[#1F1F23] flex items-center space-x-2 text-[10px] font-mono text-[#71717A]">
                    <Tag className="h-3 w-3 text-emerald-400" />
                    <span>RELATED:</span>
                    <span className="text-[#A1A1AA]">{article.related_tools}</span>
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
