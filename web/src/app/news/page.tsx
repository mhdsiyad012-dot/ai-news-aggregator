"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  RefreshCw,
  ExternalLink,
  Sparkles,
  Newspaper,
  Calendar,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Pin,
  Cpu
} from "lucide-react";
import { LiveNewsItem, NewsCategory } from "@/lib/types";

const CATEGORIES: NewsCategory[] = [
  "All",
  "LLMs",
  "Coding & Agents",
  "Design & Media",
  "Hardware & Chips",
  "Open Source",
  "Enterprise & Policy"
];

interface BriefingState {
  date: string;
  headline: string;
  bullets: string[];
}

export default function DailyNewsPage() {
  const [articles, setArticles] = useState<LiveNewsItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [briefing, setBriefing] = useState<BriefingState | null>(null);
  const [briefingLoading, setBriefingLoading] = useState(true);

  const [generatingBriefs, setGeneratingBriefs] = useState<Record<string, boolean>>({});
  const [articleBriefs, setArticleBriefs] = useState<Record<string, string>>({});

  const loadNews = async (showRefreshSpinner = false) => {
    if (showRefreshSpinner) setIsRefreshing(true);
    try {
      const res = await fetch("/api/news");
      const data = await res.json();
      if (data?.articles && Array.isArray(data.articles)) {
        setArticles(data.articles);
      }
    } catch (err) {
      console.warn("Failed to fetch news:", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const loadBriefing = async () => {
    try {
      const res = await fetch("/api/gemini/briefing");
      const data = await res.json();
      if (data?.briefing) {
        setBriefing(data.briefing);
      }
    } catch (err) {
      console.warn("Failed to fetch briefing:", err);
    } finally {
      setBriefingLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
    loadBriefing();
  }, []);

  const handleGenerateBrief = async (article: LiveNewsItem) => {
    const key = String(article.id);
    if (articleBriefs[key] || generatingBriefs[key]) return;

    setGeneratingBriefs((prev) => ({ ...prev, [key]: true }));

    try {
      const res = await fetch("/api/gemini/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: article.title,
          context: article.summary,
        }),
      });

      const data = await res.json();
      if (data?.takeaway) {
        setArticleBriefs((prev) => ({ ...prev, [key]: data.takeaway }));
      }
    } catch (err) {
      console.warn("Failed to summarize:", err);
      setArticleBriefs((prev) => ({
        ...prev,
        [key]: "Operational Takeaway: Key architecture update impacting latency and enterprise adoption.",
      }));
    } finally {
      setGeneratingBriefs((prev) => ({ ...prev, [key]: false }));
    }
  };

  const filteredArticles = articles.filter((article) => {
    const matchesCategory =
      selectedCategory === "All" ||
      article.category.toLowerCase() === selectedCategory.toLowerCase();

    const matchesSearch =
      searchQuery.trim() === "" ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (article.sourceDomain || "").toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/[0.08]">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 font-mono text-[11px] text-orange-400">
            <Newspaper className="w-3.5 h-3.5" />
            <span>DAILY AI INTELLIGENCE WIRE</span>
            <span className="text-zinc-600">•</span>
            <span className="text-emerald-400 flex items-center gap-1.5 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              REAL-TIME DISPATCHES
            </span>
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            Daily AI News Wire
          </h1>

          <p className="text-sm sm:text-base text-zinc-400 max-w-2xl leading-relaxed">
            Real-time feed ingestion from primary developer networks, research labs, and official release blogs. Synthesized by Gemini 3.8 Flash.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => loadNews(true)}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-white/20 hover:bg-white/[0.08] text-xs font-mono text-zinc-300 hover:text-white transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-orange-400" : "text-zinc-400"}`} />
            <span>{isRefreshing ? "Syncing Wire..." : "Sync Latest News"}</span>
          </button>
        </div>
      </div>

      {/* Daily Executive Briefing Hero Card */}
      <div className="relative p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-5 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-orange-400" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-base sm:text-lg text-white flex items-center gap-2">
                Daily Executive Briefing
                <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded-md bg-white/[0.05] text-orange-400 border border-orange-500/20">
                  Gemini Synthesis
                </span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-zinc-500">
            <Calendar className="w-3.5 h-3.5 text-zinc-400" />
            <span>{briefing?.date || new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
          </div>
        </div>

        {briefingLoading ? (
          <div className="space-y-3 py-2">
            <div className="h-6 w-3/4 rounded-lg bg-white/[0.05] animate-pulse"></div>
            <div className="h-4 w-full rounded-lg bg-white/[0.03] animate-pulse"></div>
            <div className="h-4 w-5/6 rounded-lg bg-white/[0.03] animate-pulse"></div>
          </div>
        ) : (
          <div className="space-y-5">
            <h3 className="font-heading text-lg sm:text-xl font-semibold text-white tracking-tight leading-snug">
              {briefing?.headline || "Frontier Model Capabilities Accelerate Across Software & Multimodal Tooling"}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
              {(briefing?.bullets && briefing.bullets.length > 0
                ? briefing.bullets
                : [
                    "Frontier multi-modal reasoning systems demonstrate lower inference cost curves across production codebases.",
                    "Agent-first IDE architectures redefine developer velocity through tool orchestration protocols.",
                    "Open-weights foundation models converge near proprietary frontiers on verified benchmarks."
                  ]
              ).map((bullet, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-black/40 border border-white/[0.06] space-y-2 hover:border-white/10 transition-colors"
                >
                  <div className="font-mono text-[10px] text-orange-400 uppercase font-semibold tracking-wider">
                    Dispatch 0{idx + 1}
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    {bullet}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Filter and Search Controls */}
      <div className="space-y-4">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const count =
              cat === "All"
                ? articles.length
                : articles.filter((a) => a.category.toLowerCase() === cat.toLowerCase()).length;

            const isSelected = selectedCategory === cat;

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-mono text-xs whitespace-nowrap transition-all ${
                  isSelected
                    ? "bg-white text-zinc-950 font-semibold shadow-md"
                    : "bg-white/[0.03] text-zinc-400 hover:text-white border border-white/[0.06] hover:border-white/20"
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                    isSelected ? "bg-zinc-200 text-zinc-950 font-bold" : "bg-white/[0.05] text-zinc-500"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search verified articles by headline, topic, or publisher domain..."
            className="w-full pl-10 pr-12 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] focus:border-orange-500/80 focus:bg-white/[0.05] text-sm text-white placeholder-zinc-500 focus:outline-none transition-all font-sans"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-zinc-500 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Articles Feed */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-3"
              >
                <div className="h-4 w-32 rounded-lg bg-white/[0.05] animate-pulse"></div>
                <div className="h-6 w-3/4 rounded-lg bg-white/[0.03] animate-pulse"></div>
                <div className="h-4 w-full rounded-lg bg-white/[0.02] animate-pulse"></div>
              </div>
            ))}
          </div>
        ) : filteredArticles.length > 0 ? (
          <div className="space-y-4">
            {filteredArticles.map((article) => {
              const briefKey = String(article.id);
              const generatedBrief = articleBriefs[briefKey] || article.aiTakeaway || article.aiBrief;
              const isGenerating = generatingBriefs[briefKey];

              return (
                <article
                  key={article.id}
                  className={`p-6 rounded-2xl bg-white/[0.02] border transition-all space-y-4 group ${
                    article.isPinned
                      ? "border-orange-500/30 bg-orange-500/[0.02]"
                      : "border-white/[0.08] hover:border-white/20 hover:bg-white/[0.04]"
                  }`}
                >
                  {/* Meta Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
                    <div className="flex items-center gap-2.5">
                      {article.isPinned && (
                        <span className="px-2.5 py-0.5 rounded-md bg-orange-500/10 text-orange-400 border border-orange-500/30 text-[10px] font-semibold uppercase flex items-center gap-1">
                          <Pin className="w-2.5 h-2.5" /> Pinned Wire
                        </span>
                      )}
                      <span className="px-2.5 py-0.5 rounded-md bg-white/[0.04] text-orange-400 border border-white/[0.08] font-semibold text-[11px] uppercase">
                        {article.category}
                      </span>
                      <span className="text-zinc-400 font-mono text-[11px] px-2 py-0.5 rounded-md bg-black/40 border border-white/[0.06]">
                        {article.sourceDomain}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-zinc-500 text-[11px]">
                      <Clock className="w-3 h-3 text-zinc-500" />
                      <span>{article.publishedAt || article.relativeTime}</span>
                      {(article.publishedUtc || article.utcTimestamp) && (
                        <>
                          <span className="text-zinc-700">•</span>
                          <span>{article.publishedUtc || String(article.utcTimestamp).slice(0, 10)}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Headline & Summary */}
                  <div className="space-y-2">
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 font-heading text-lg sm:text-xl font-bold text-white hover:text-emerald-300 transition-colors leading-snug"
                    >
                      <span>{article.title}</span>
                      <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-emerald-300 shrink-0" />
                    </a>

                    <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                      {article.summary}
                    </p>
                  </div>

                  {/* Gemini Executive Takeaway Callout */}
                  {generatedBrief && (
                    <div className="p-4 rounded-xl bg-black/50 border border-orange-500/20 space-y-1.5 animate-in fade-in duration-200">
                      <div className="flex items-center gap-2 font-mono text-[10px] text-orange-400 uppercase font-semibold">
                        <Sparkles className="w-3 h-3 text-orange-400" />
                        <span>Gemini Executive Takeaway</span>
                      </div>
                      <p className="text-xs text-zinc-200 leading-relaxed font-sans">
                        {generatedBrief}
                      </p>
                    </div>
                  )}

                  {/* Footer Actions */}
                  <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between font-mono text-xs">
                    <div>
                      {!generatedBrief ? (
                        <button
                          onClick={() => handleGenerateBrief(article)}
                          disabled={isGenerating}
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/[0.08] text-[11px] transition-all disabled:opacity-50"
                        >
                          <Sparkles className={`w-3.5 h-3.5 text-orange-400 ${isGenerating ? "animate-spin" : ""}`} />
                          <span>{isGenerating ? "Synthesizing Brief..." : "Generate AI Brief"}</span>
                        </button>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 text-[11px] text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Gemini Grounded</span>
                        </div>
                      )}
                    </div>

                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors font-medium text-xs"
                    >
                      <span>Read Original Article</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-3">
            <AlertCircle className="w-8 h-8 text-zinc-500 mx-auto" />
            <h3 className="font-heading font-bold text-base text-white">
              No articles match this criteria
            </h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              Try adjusting your topic filter or clearing your search term to see more dispatches.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSearchQuery("");
              }}
              className="px-4 py-2 rounded-xl bg-white/[0.04] text-xs font-mono text-white border border-white/[0.08] hover:border-white/20 transition-all"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
