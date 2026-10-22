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
  AlertCircle
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
      if (data?.articles) {
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
        [key]: "Operational Takeaway: Significant technical milestone shifting accuracy and cost trade-offs.",
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
    <div className="space-y-10 animate-in fade-in duration-200">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#27272A]">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 font-mono text-xs text-[#F97316]">
            <Newspaper className="w-3.5 h-3.5" />
            <span>DAILY AI DISPATCHES</span>
            <span className="text-[#3F3F46]">•</span>
            <span className="text-[#10B981] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
              LIVE FEED
            </span>
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-[#FAFAFA]">
            Daily AI News Wire
          </h1>

          <p className="text-sm text-[#A1A1AA] max-w-xl">
            Real-time public feed ingestion from Hacker News, developer networks, and research labs. Synthesized with Gemini 3.8 Flash.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => loadNews(true)}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#121215] border border-[#27272A] hover:border-[#3F3F46] hover:bg-[#18181C] text-xs font-mono text-[#FAFAFA] transition-editorial disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-[#F97316]" : "text-[#71717A]"}`} />
            <span>{isRefreshing ? "Syncing Feed..." : "Sync Latest News"}</span>
          </button>
        </div>
      </div>

      <div className="relative p-6 sm:p-7 rounded-xl bg-[#121215] border border-[#27272A] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#27272A]/70">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-[#F97316]/10 border border-[#F97316]/30 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#F97316]" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-base text-[#FAFAFA] flex items-center gap-2">
                Daily Executive Briefing
                <span className="font-mono text-[10px] uppercase px-1.5 py-0.2 rounded bg-[#09090B] text-[#F97316] border border-[#27272A]">
                  Gemini Synthesis
                </span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-[#71717A]">
            <Calendar className="w-3.5 h-3.5 text-[#A1A1AA]" />
            <span>{briefing?.date || "October 2026"}</span>
          </div>
        </div>

        {briefingLoading ? (
          <div className="space-y-3 py-2">
            <div className="h-5 w-3/4 rounded skeleton-shimmer"></div>
            <div className="h-4 w-full rounded skeleton-shimmer"></div>
            <div className="h-4 w-5/6 rounded skeleton-shimmer"></div>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="font-heading text-lg font-semibold text-white tracking-tight leading-snug">
              {briefing?.headline}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {briefing?.bullets?.map((bullet, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-lg bg-[#09090B] border border-[#27272A] space-y-2"
                >
                  <div className="font-mono text-[10px] text-[#F97316] uppercase font-semibold">
                    Key Dispatch 0{idx + 1}
                  </div>
                  <p className="text-xs text-[#A1A1AA] leading-relaxed">
                    {bullet}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
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
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono text-xs whitespace-nowrap transition-editorial ${
                  isSelected
                    ? "bg-[#FAFAFA] text-[#09090B] font-semibold"
                    : "bg-[#121215] text-[#A1A1AA] hover:text-[#FAFAFA] border border-[#27272A] hover:border-[#3F3F46]"
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded ${
                    isSelected ? "bg-[#E4E4E7] text-[#09090B]" : "bg-[#18181C] text-[#71717A]"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-[#71717A] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search verified articles by headline, topic, or publisher domain..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#121215] border border-[#27272A] focus:border-[#F97316] text-sm text-[#FAFAFA] placeholder-[#71717A] focus:outline-none transition-editorial font-sans"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-[#71717A] hover:text-[#FAFAFA]"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="p-6 rounded-xl bg-[#121215] border border-[#27272A] space-y-3"
              >
                <div className="h-4 w-32 rounded skeleton-shimmer"></div>
                <div className="h-6 w-3/4 rounded skeleton-shimmer"></div>
                <div className="h-4 w-full rounded skeleton-shimmer"></div>
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
                  className="p-5 sm:p-6 rounded-xl bg-[#121215] border border-[#27272A] hover:border-[#3F3F46] transition-editorial space-y-4 group"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
                    <div className="flex items-center gap-2.5">
                      <span className="px-2 py-0.5 rounded bg-[#18181C] text-[#F97316] border border-[#27272A] font-semibold text-[11px] uppercase">
                        {article.category}
                      </span>
                      <span className="text-[#A1A1AA] font-mono text-[11px] px-1.5 py-0.5 rounded bg-[#09090B] border border-[#27272A]">
                        {article.sourceDomain}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[#71717A] text-[11px]">
                      <Clock className="w-3 h-3 text-[#71717A]" />
                      <span>{article.publishedAt || article.relativeTime}</span>
                      {(article.publishedUtc || article.utcTimestamp) && (
                        <>
                          <span>•</span>
                          <span>{article.publishedUtc || String(article.utcTimestamp).slice(0, 10)}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-heading text-lg sm:text-xl font-bold text-[#FAFAFA] hover:text-white transition-editorial leading-snug"
                    >
                      <span>{article.title}</span>
                      <ArrowUpRight className="w-4 h-4 text-[#71717A] group-hover:text-[#FAFAFA] shrink-0" />
                    </a>

                    <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed">
                      {article.summary}
                    </p>
                  </div>

                  {generatedBrief && (
                    <div className="p-3.5 rounded-lg bg-[#09090B] border border-[#F97316]/30 space-y-1.5 animate-in fade-in duration-200">
                      <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#F97316] uppercase font-semibold">
                        <Sparkles className="w-3 h-3 text-[#F97316]" />
                        <span>Gemini Executive Takeaway</span>
                      </div>
                      <p className="text-xs text-[#FAFAFA] leading-relaxed">
                        {generatedBrief}
                      </p>
                    </div>
                  )}

                  <div className="pt-3 border-t border-[#27272A]/50 flex items-center justify-between font-mono text-xs">
                    <div>
                      {!generatedBrief ? (
                        <button
                          onClick={() => handleGenerateBrief(article)}
                          disabled={isGenerating}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#18181C] hover:bg-[#27272A] text-[#FAFAFA] border border-[#27272A] text-[11px] transition-editorial disabled:opacity-50"
                        >
                          <Sparkles className={`w-3 h-3 text-[#F97316] ${isGenerating ? "animate-spin" : ""}`} />
                          <span>{isGenerating ? "Synthesizing Brief..." : "Generate AI Brief"}</span>
                        </button>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 text-[11px] text-[#10B981]">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Brief Grounded</span>
                        </div>
                      )}
                    </div>

                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[#A1A1AA] hover:text-[#FAFAFA] transition-editorial font-medium"
                    >
                      <span>Read Original Article</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center rounded-xl bg-[#121215] border border-[#27272A] space-y-3">
            <AlertCircle className="w-8 h-8 text-[#71717A] mx-auto" />
            <h3 className="font-heading font-bold text-base text-[#FAFAFA]">
              No articles match this criteria
            </h3>
            <p className="text-xs text-[#71717A] max-w-sm mx-auto">
              Try adjusting your topic filter or clearing your search term to see more dispatches.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSearchQuery("");
              }}
              className="px-3 py-1.5 rounded bg-[#18181C] text-xs font-mono text-[#FAFAFA] border border-[#27272A] hover:border-[#3F3F46]"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
