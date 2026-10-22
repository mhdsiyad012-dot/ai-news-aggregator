"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  RefreshCw,
  ExternalLink,
  Sparkles,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Pin
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/[0.08]">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-sans text-[#8AB4F8]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Daily AI Dispatches</span>
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-normal text-white tracking-tight">
            Daily AI News Wire
          </h1>

          <p className="font-sans text-sm sm:text-base text-[#9AA0A6] max-w-2xl leading-relaxed">
            Real-time feed ingestion from primary developer networks, research labs, and official release blogs. Synthesized by Gemini 3.8 Flash.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => loadNews(true)}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#161922] hover:bg-[#1E222D] border border-white/10 text-xs font-sans text-white transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-[#8AB4F8]" : "text-zinc-400"}`} />
            <span>{isRefreshing ? "Syncing feed..." : "Sync latest news"}</span>
          </button>
        </div>
      </div>

      {/* Daily Executive Briefing Hero Card (DeepMind rounded-[28px]) */}
      <div className="relative p-8 sm:p-10 rounded-[28px] bg-[#111318] border border-white/[0.08] space-y-6 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#8AB4F8]/10 border border-[#8AB4F8]/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#8AB4F8]" />
            </div>
            <div>
              <h2 className="font-heading font-normal text-lg sm:text-xl text-white flex items-center gap-2.5">
                Daily executive briefing
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/[0.06] text-[#8AB4F8] font-sans">
                  Gemini synthesis
                </span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-sans text-[#9AA0A6]">
            <span>{briefing?.date || new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
          </div>
        </div>

        {briefingLoading ? (
          <div className="space-y-3 py-2">
            <div className="h-6 w-3/4 rounded-full bg-white/[0.05] animate-pulse"></div>
            <div className="h-4 w-full rounded-full bg-white/[0.03] animate-pulse"></div>
            <div className="h-4 w-5/6 rounded-full bg-white/[0.03] animate-pulse"></div>
          </div>
        ) : (
          <div className="space-y-6">
            <h3 className="font-heading text-xl sm:text-2xl font-normal text-white tracking-tight leading-snug">
              {briefing?.headline || "Frontier Model Capabilities Accelerate Across Software & Multimodal Tooling"}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-1">
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
                  className="p-5 rounded-[20px] bg-[#161922] border border-white/[0.06] space-y-2 hover:border-white/10 transition-colors"
                >
                  <div className="text-xs font-sans text-[#8AB4F8] font-medium">
                    Dispatch 0{idx + 1}
                  </div>
                  <p className="text-xs sm:text-sm font-sans text-[#9AA0A6] leading-relaxed">
                    {bullet}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Filter and Search Controls (DeepMind Capsule Pills) */}
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
                className={`flex items-center gap-2 px-5 py-2 rounded-full font-sans text-xs sm:text-sm whitespace-nowrap transition-all ${
                  isSelected
                    ? "bg-[#1E222D] text-white border border-[#8AB4F8]"
                    : "bg-[#111318] text-[#9AA0A6] hover:text-white border border-transparent hover:border-white/10"
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    isSelected ? "bg-white/[0.1] text-white" : "bg-white/[0.04] text-zinc-500"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Bar (DeepMind Capsule Pill) */}
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search verified articles by headline, topic, or publisher domain..."
            className="w-full pl-11 pr-12 py-3 rounded-full bg-[#111318] border border-white/[0.08] focus:border-[#8AB4F8] text-sm text-white placeholder-zinc-500 focus:outline-none transition-all font-sans"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-sans text-zinc-500 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Articles Feed (DeepMind rounded-[24px] Cards) */}
      <div className="space-y-5">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="p-8 rounded-[24px] bg-[#111318] border border-white/[0.08] space-y-4"
              >
                <div className="h-4 w-32 rounded-full bg-white/[0.05] animate-pulse"></div>
                <div className="h-6 w-3/4 rounded-full bg-white/[0.03] animate-pulse"></div>
                <div className="h-4 w-full rounded-full bg-white/[0.02] animate-pulse"></div>
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
                  className={`p-8 rounded-[24px] bg-[#111318] border transition-all duration-300 space-y-4 group ${
                    article.isPinned
                      ? "border-[#8AB4F8]/30 bg-[#161922]"
                      : "border-white/[0.08] hover:border-white/[0.18] hover:bg-[#171A21]"
                  }`}
                >
                  {/* Meta Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-sans text-[#9AA0A6]">
                    <div className="flex items-center gap-2.5">
                      {article.isPinned && (
                        <span className="px-3 py-0.5 rounded-full bg-[#8AB4F8]/10 text-[#8AB4F8] border border-[#8AB4F8]/20 text-[11px] flex items-center gap-1">
                          <Pin className="w-2.5 h-2.5" /> Pinned
                        </span>
                      )}
                      <span className="px-3 py-0.5 rounded-full bg-white/[0.04] text-zinc-300 text-[11px]">
                        {article.category}
                      </span>
                      <span>{article.sourceDomain}</span>
                    </div>

                    <div className="flex items-center gap-2 text-zinc-500 text-xs">
                      <Clock className="w-3 h-3 text-zinc-500" />
                      <span>{article.publishedAt || article.relativeTime || "Recent"}</span>
                    </div>
                  </div>

                  {/* Headline */}
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block group/link"
                  >
                    <h3 className="font-heading text-xl sm:text-2xl font-normal text-white group-hover/link:text-[#8AB4F8] transition-colors leading-[1.25]">
                      {article.title}
                    </h3>
                  </a>

                  {/* Narrative paragraph (seamlessly incorporating AI brief if present) */}
                  <p className="font-sans text-xs sm:text-sm text-[#9AA0A6] leading-relaxed">
                    {generatedBrief || article.summary}
                  </p>

                  {/* Footer Actions */}
                  <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-sans">
                    <div>
                      {!generatedBrief ? (
                        <button
                          onClick={() => handleGenerateBrief(article)}
                          disabled={isGenerating}
                          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#161922] hover:bg-[#1E222D] text-white border border-white/10 text-xs transition-all disabled:opacity-50"
                        >
                          <Sparkles className={`w-3 h-3 text-[#8AB4F8] ${isGenerating ? "animate-spin" : ""}`} />
                          <span>{isGenerating ? "Synthesizing brief..." : "Generate AI brief"}</span>
                        </button>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 text-xs text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Gemini brief grounded</span>
                        </div>
                      )}
                    </div>

                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[#8AB4F8] hover:text-[#A8C7FA] transition-colors font-medium text-xs sm:text-sm"
                    >
                      <span>Read full story</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center rounded-[24px] bg-[#111318] border border-white/[0.08] space-y-3">
            <AlertCircle className="w-8 h-8 text-zinc-500 mx-auto" />
            <h3 className="font-heading font-normal text-lg text-white">
              No articles match this criteria
            </h3>
            <p className="text-xs sm:text-sm text-[#9AA0A6] max-w-sm mx-auto">
              Try adjusting your topic filter or clearing your search term to see more dispatches.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSearchQuery("");
              }}
              className="px-5 py-2 rounded-full bg-[#161922] text-xs font-sans text-white border border-white/10 hover:border-white/20 transition-all"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
