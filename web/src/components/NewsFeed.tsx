"use client";

import React, { useState, useMemo } from "react";
import { 
  Newspaper, 
  Search, 
  Copy, 
  Check, 
  Clock, 
  ArrowUpRight,
  Bookmark,
  Sparkles,
  ChevronDown,
  Layers,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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

const INITIAL_WIRE_COUNT = 6;

export function NewsFeed({ 
  articles, 
  allTools = [], 
  onInspectTool 
}: NewsFeedProps) {
  const [selectedCategory, setSelectedCategory] = useState<WireCategory>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState<number>(INITIAL_WIRE_COUNT);

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

  // Lead story is the first article (pinned or latest), remaining go to the grid
  const leadArticle = filteredArticles[0];
  const sideArticles = filteredArticles.slice(1, 1 + visibleCount);
  const remainingCount = Math.max(0, filteredArticles.length - 1 - visibleCount);

  const handleCopyCitation = (article: NewsArticle) => {
    const citation = `"${article.title}" - ${article.source_name || "Daily Wire"}: ${article.url}`;
    navigator.clipboard.writeText(citation);
    setCopiedId(article.id || 0);
    setTimeout(() => setCopiedId(null), 2000);
  };

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

  const renderToolChips = (toolsStr?: string) => {
    if (!toolsStr) return null;
    const items = toolsStr.split(",").map((s) => s.trim()).filter(Boolean);
    if (!items.length) return null;

    return (
      <div className="flex flex-wrap items-center gap-1.5 pt-2">
        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
          Referenced:
        </span>
        {items.map((toolName) => {
          const matched = findMatchingTool(toolName);
          return (
            <button
              key={toolName}
              onClick={(e) => {
                e.stopPropagation();
                if (matched && onInspectTool) {
                  onInspectTool(matched);
                }
              }}
              className="inline-flex items-center space-x-1 rounded-full bg-white/[0.04] border border-white/[0.08] px-2 py-0.5 text-[10px] font-medium text-slate-300 hover:text-white hover:border-emerald-500/40 hover:bg-emerald-500/10 transition-colors"
            >
              <BrandLogo slug={matched?.slug || toolName} name={toolName} size="xs" />
              <span>{toolName}</span>
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <section id="news" className="py-20 sm:py-24 border-t border-white/[0.06] relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-400 mb-2.5">
              <Sparkles className="h-3.5 w-3.5" />
              <span>SYNTHESIZED BY GOOGLE GEMINI</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Daily Intelligence Wire.
            </h2>
          </div>
          <p className="text-sm text-slate-400 max-w-md font-normal leading-relaxed">
            Multi-source RSS headlines autonomously summarized, neutral-density synthesized, and mapped to frontier models daily.
          </p>
        </div>

        {/* Category Filter Pills & Search Bar */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#0E1017]/80 p-3 sm:p-4 mb-8 backdrop-blur-xl shadow-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Category Pills */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
            {WIRE_CATEGORIES.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setVisibleCount(INITIAL_WIRE_COUNT);
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                    active
                      ? "bg-white text-zinc-950 font-bold shadow-xs"
                      : "text-slate-300 hover:text-white hover:bg-white/[0.05]"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Search Bar */}
          <div className="relative min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setVisibleCount(INITIAL_WIRE_COUNT);
              }}
              placeholder="Search wire dispatches..."
              className="w-full rounded-xl border border-white/[0.08] bg-[#12131A] pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Empty State */}
        {filteredArticles.length === 0 && (
          <div className="rounded-2xl border border-white/[0.08] bg-[#0E1017] p-12 text-center">
            <Newspaper className="h-8 w-8 text-slate-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white mb-1">No wire dispatches found</h3>
            <p className="text-xs text-slate-400">Try selecting "All" categories or adjusting your search query.</p>
          </div>
        )}

        {/* MAGAZINE LAYOUT */}
        {filteredArticles.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT COLUMN: Featured Lead Story (5 Cols) */}
            {leadArticle && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="lg:col-span-5 rounded-3xl border border-white/[0.1] bg-[#0E1017]/90 p-6 sm:p-8 shadow-2xl backdrop-blur-xl flex flex-col justify-between relative group hover:border-sky-500/40 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="rounded-full bg-sky-500/15 text-sky-400 border border-sky-500/30 px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider">
                      FEATURED LEAD DISPATCH
                    </span>

                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={() => handleCopyCitation(leadArticle)}
                        className="p-1.5 rounded-lg border border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.04]"
                        title="Copy citation"
                      >
                        {copiedId === leadArticle.id ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>

                      <button
                        onClick={() => toggleArticleBookmark(leadArticle.id || 0)}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          isArticleSaved(leadArticle.id || 0)
                            ? "border-sky-500/40 text-sky-400 bg-sky-500/10"
                            : "border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.04]"
                        }`}
                        title="Save to Library"
                      >
                        <Bookmark className={`h-3.5 w-3.5 ${isArticleSaved(leadArticle.id || 0) ? "fill-sky-400" : ""}`} />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-xs text-slate-400 mb-3 font-medium">
                    <span className="text-white font-bold">{leadArticle.source_name || "Daily Wire"}</span>
                    <span>•</span>
                    <span className="text-slate-500">{leadArticle.published_at || "Recent"}</span>
                    <span>•</span>
                    <span className="rounded-full bg-white/[0.05] px-2 py-0.2 text-[10px]">{leadArticle.category}</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-extrabold text-white group-hover:text-sky-300 transition-colors mb-4 leading-tight">
                    {leadArticle.title}
                  </h3>

                  <p className="text-sm text-slate-300 leading-relaxed font-normal mb-6">
                    {leadArticle.summary}
                  </p>

                  {renderToolChips(leadArticle.related_tools)}
                </div>

                <div className="pt-6 mt-6 border-t border-white/[0.08] flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-mono">
                    3 min technical read
                  </span>

                  <a
                    href={leadArticle.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1.5 rounded-full bg-white px-4 py-2 text-xs font-bold text-zinc-950 hover:bg-sky-400 transition-colors shadow-sm"
                  >
                    <span>Read Original Source</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </motion.div>
            )}

            {/* RIGHT COLUMN: Live Wire Grid (7 Cols, 2 Sub-Columns) */}
            <div className="lg:col-span-7 flex flex-col space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {sideArticles.map((art) => {
                  const saved = isArticleSaved(art.id || 0);
                  const copied = copiedId === art.id;

                  return (
                    <motion.div
                      key={art.id || art.url}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="group rounded-2xl border border-white/[0.08] bg-[#0E1017] p-5 hover:border-white/[0.18] hover:bg-[#12141F] transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2.5">
                          <span className="rounded-full bg-white/[0.05] border border-white/[0.06] px-2 py-0.5 text-[10px] font-medium text-slate-300">
                            {art.category}
                          </span>

                          <div className="flex items-center space-x-1 shrink-0">
                            <button
                              onClick={() => handleCopyCitation(art)}
                              className="p-1 rounded-md text-slate-500 hover:text-white"
                              title="Copy citation"
                            >
                              {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                            </button>

                            <button
                              onClick={() => toggleArticleBookmark(art.id || 0)}
                              className={`p-1 rounded-md transition-colors ${
                                saved ? "text-sky-400" : "text-slate-500 hover:text-white"
                              }`}
                              title="Bookmark"
                            >
                              <Bookmark className={`h-3 w-3 ${saved ? "fill-sky-400" : ""}`} />
                            </button>
                          </div>
                        </div>

                        <h4 className="text-sm font-bold text-white group-hover:text-sky-300 transition-colors line-clamp-2 mb-2 leading-snug">
                          {art.title}
                        </h4>

                        <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mb-3">
                          {art.summary}
                        </p>

                        {renderToolChips(art.related_tools)}
                      </div>

                      <div className="pt-3 mt-3 border-t border-white/[0.05] flex items-center justify-between text-[11px] text-slate-500">
                        <span className="truncate max-w-[120px]">{art.source_name || "Daily Wire"}</span>
                        <a
                          href={art.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-1 text-slate-300 hover:text-sky-400 font-semibold"
                        >
                          <span>Source</span>
                          <ArrowUpRight className="h-3 w-3" />
                        </a>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Load More Dispatches Button */}
              {remainingCount > 0 && (
                <div className="pt-4 text-center">
                  <button
                    onClick={() => setVisibleCount((prev) => prev + 6)}
                    className="inline-flex items-center space-x-2 rounded-full border border-white/[0.1] bg-[#12131A] px-5 py-2.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/[0.06] transition-all"
                  >
                    <span>Load More Dispatches (+{remainingCount} Remaining)</span>
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
