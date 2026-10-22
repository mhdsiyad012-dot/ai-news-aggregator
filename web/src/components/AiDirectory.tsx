"use client";

import React, { useState, useMemo } from "react";
import { 
  Search, 
  Cpu, 
  ExternalLink, 
  ArrowRight, 
  CheckCircle2, 
  Bookmark, 
  LayoutGrid, 
  List, 
  Plus,
  Check,
  ChevronDown,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AIDirectoryItem, Category, CompanyFilter, PricingFilter } from "@/lib/types";
import { BrandLogo } from "./BrandLogo";
import { useBookmarks } from "@/lib/bookmarks";

interface AiDirectoryProps {
  items: AIDirectoryItem[];
  onInspect: (item: AIDirectoryItem) => void;
  selectedCompare: AIDirectoryItem[];
  onToggleCompare: (item: AIDirectoryItem) => void;
  onOpenCompareModal: () => void;
}

const CATEGORIES: { label: string; value: Category }[] = [
  { label: "All Systems", value: "All" },
  { label: "Chatbots & Assistants", value: "Chatbots & Assistants" },
  { label: "Code Builders & IDEs", value: "Code Builders & IDEs" },
  { label: "Autonomous Agents", value: "Autonomous Agents" },
  { label: "Foundation LLMs", value: "Foundation LLMs" },
  { label: "Image & Video Gen", value: "Image & Video Gen" },
  { label: "Voice & Audio", value: "Voice & Audio" },
  { label: "Search & Research", value: "Search & Research" },
  { label: "Agent Frameworks", value: "Agent Frameworks" },
];

const COMPANIES: CompanyFilter[] = [
  "All Companies",
  "Google",
  "OpenAI",
  "Anthropic",
  "Meta",
  "DeepSeek",
  "Alibaba / Qwen",
  "Cursor",
  "xAI",
  "Mistral",
  "Microsoft / GitHub",
  "Perplexity",
  "Vercel",
  "Runway & Kling",
  "Independent / Open Source",
];

const PRICING_OPTIONS: { label: string; value: PricingFilter }[] = [
  { label: "All Pricing", value: "All" },
  { label: "Free / Open", value: "Free" },
  { label: "Freemium", value: "Freemium" },
  { label: "Open Source", value: "Open Source" },
  { label: "Paid / API", value: "Paid / API" },
];

const INITIAL_VISIBLE_COUNT = 9;

export function AiDirectory({
  items,
  onInspect,
  selectedCompare,
  onToggleCompare,
  onOpenCompareModal,
}: AiDirectoryProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category>("All");
  const [selectedCompany, setSelectedCompany] = useState<CompanyFilter>("All Companies");
  const [pricingFilter, setPricingFilter] = useState<PricingFilter>("All");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState<number>(INITIAL_VISIBLE_COUNT);

  const { isToolSaved, toggleToolBookmark } = useBookmarks();

  // Compute counts per company for dropdown
  const companyCounts = useMemo(() => {
    const counts: Record<string, number> = { "All Companies": items.length };
    COMPANIES.forEach((comp) => {
      if (comp === "All Companies") return;
      counts[comp] = items.filter((item) => {
        const creator = (item.creator || "").toLowerCase();
        const slug = (item.slug || "").toLowerCase();
        const name = (item.name || "").toLowerCase();
        const full = `${creator} ${slug} ${name}`;

        if (comp === "Google") return full.includes("google") || full.includes("deepmind");
        if (comp === "OpenAI") return full.includes("openai");
        if (comp === "Anthropic") return full.includes("anthropic");
        if (comp === "Meta") return full.includes("meta") || full.includes("llama");
        if (comp === "DeepSeek") return full.includes("deepseek");
        if (comp === "Alibaba / Qwen") return full.includes("alibaba") || full.includes("qwen");
        if (comp === "Cursor") return full.includes("cursor") || full.includes("anysphere");
        if (comp === "xAI") return full.includes("xai") || full.includes("grok");
        if (comp === "Mistral") return full.includes("mistral");
        if (comp === "Microsoft / GitHub") return full.includes("microsoft") || full.includes("github");
        if (comp === "Perplexity") return full.includes("perplexity");
        if (comp === "Vercel") return full.includes("vercel") || full.includes("v0");
        if (comp === "Runway & Kling") return full.includes("runway") || full.includes("kling") || full.includes("kuaishou");
        if (comp === "Independent / Open Source") {
          return ["hugging", "ollama", "crewai", "langchain", "midjourney", "elevenlabs"].some((k) => full.includes(k));
        }
        return false;
      }).length;
    });
    return counts;
  }, [items]);

  // Filtering Logic
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // 1. Category
      if (selectedCategory !== "All" && item.primary_category !== selectedCategory) {
        return false;
      }

      // 2. Company
      if (selectedCompany !== "All Companies") {
        const full = `${item.creator} ${item.slug} ${item.name}`.toLowerCase();
        if (selectedCompany === "Google" && !full.includes("google") && !full.includes("deepmind")) return false;
        if (selectedCompany === "OpenAI" && !full.includes("openai")) return false;
        if (selectedCompany === "Anthropic" && !full.includes("anthropic")) return false;
        if (selectedCompany === "Meta" && !full.includes("meta") && !full.includes("llama")) return false;
        if (selectedCompany === "DeepSeek" && !full.includes("deepseek")) return false;
        if (selectedCompany === "Alibaba / Qwen" && !full.includes("alibaba") && !full.includes("qwen")) return false;
        if (selectedCompany === "Cursor" && !full.includes("cursor") && !full.includes("anysphere")) return false;
        if (selectedCompany === "xAI" && !full.includes("xai") && !full.includes("grok")) return false;
        if (selectedCompany === "Mistral" && !full.includes("mistral")) return false;
        if (selectedCompany === "Microsoft / GitHub" && !full.includes("microsoft") && !full.includes("github")) return false;
        if (selectedCompany === "Perplexity" && !full.includes("perplexity")) return false;
        if (selectedCompany === "Vercel" && !full.includes("vercel") && !full.includes("v0")) return false;
        if (selectedCompany === "Runway & Kling" && !full.includes("runway") && !full.includes("kling") && !full.includes("kuaishou")) return false;
      }

      // 3. Pricing
      if (pricingFilter !== "All") {
        const p = item.pricing_model.toLowerCase();
        if (pricingFilter === "Free" && !p.includes("free") && !p.includes("open weights")) return false;
        if (pricingFilter === "Freemium" && !p.includes("freemium")) return false;
        if (pricingFilter === "Open Source" && !p.includes("open source") && !p.includes("open weights") && !p.includes("apache") && !p.includes("mit")) return false;
        if (pricingFilter === "Paid / API" && !p.includes("paid") && !p.includes("api") && !p.includes("subscription")) return false;
      }

      // 4. Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          item.name.toLowerCase().includes(q) ||
          item.creator.toLowerCase().includes(q) ||
          item.short_purpose.toLowerCase().includes(q) ||
          item.primary_category.toLowerCase().includes(q) ||
          item.tags.some((t) => t.toLowerCase().includes(q)) ||
          item.key_capabilities.some((c) => c.toLowerCase().includes(q));
        if (!matches) return false;
      }

      return true;
    });
  }, [items, selectedCategory, selectedCompany, pricingFilter, searchQuery]);

  // Sliced items for pagination
  const displayedItems = filteredItems.slice(0, visibleCount);
  const remainingCount = Math.max(0, filteredItems.length - visibleCount);

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 9);
  };

  const handleShowAll = () => {
    setVisibleCount(filteredItems.length);
  };

  const handleResetFilters = () => {
    setSelectedCategory("All");
    setSelectedCompany("All Companies");
    setPricingFilter("All");
    setSearchQuery("");
    setVisibleCount(INITIAL_VISIBLE_COUNT);
  };

  return (
    <section id="directory" className="py-20 sm:py-24 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 mb-2.5">
              <Cpu className="h-3.5 w-3.5" />
              <span>FRONTIER ENCYCLOPEDIA</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              The AI Systems Directory.
            </h2>
          </div>
          <div className="flex items-center space-x-3 text-xs text-slate-400">
            <span>Showing <strong className="text-white font-bold">{Math.min(visibleCount, filteredItems.length)}</strong> of <strong className="text-white font-bold">{filteredItems.length}</strong> systems</span>
            {filteredItems.length !== items.length && (
              <button
                onClick={handleResetFilters}
                className="text-emerald-400 hover:underline"
              >
                Reset filters
              </button>
            )}
          </div>
        </div>

        {/* UNIFIED CONTROL BAR (Clean & Compact) */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#0E1017]/80 p-3 sm:p-4 mb-8 backdrop-blur-xl shadow-xl flex flex-col space-y-3">
          {/* Row 1: Search + Company Dropdown + Pricing Dropdown + View Switcher */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2.5">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setVisibleCount(INITIAL_VISIBLE_COUNT);
                }}
                placeholder="Filter by model name, capability, or use case..."
                className="w-full rounded-xl border border-white/[0.08] bg-[#12131A] pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Company Dropdown */}
            <div className="relative min-w-[170px]">
              <select
                value={selectedCompany}
                onChange={(e) => {
                  setSelectedCompany(e.target.value as CompanyFilter);
                  setVisibleCount(INITIAL_VISIBLE_COUNT);
                }}
                className="w-full appearance-none rounded-xl border border-white/[0.08] bg-[#12131A] px-3.5 py-2 pr-8 text-xs font-medium text-slate-200 focus:border-emerald-500 focus:outline-none cursor-pointer"
              >
                {COMPANIES.map((comp) => (
                  <option key={comp} value={comp} className="bg-[#0E1017] text-white">
                    {comp} ({companyCounts[comp] || 0})
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            </div>

            {/* Pricing Dropdown */}
            <div className="relative min-w-[130px]">
              <select
                value={pricingFilter}
                onChange={(e) => {
                  setPricingFilter(e.target.value as PricingFilter);
                  setVisibleCount(INITIAL_VISIBLE_COUNT);
                }}
                className="w-full appearance-none rounded-xl border border-white/[0.08] bg-[#12131A] px-3.5 py-2 pr-8 text-xs font-medium text-slate-200 focus:border-emerald-500 focus:outline-none cursor-pointer"
              >
                {PRICING_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-[#0E1017] text-white">
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            </div>

            {/* View Switcher (Grid / Table) */}
            <div className="flex items-center rounded-xl border border-white/[0.08] bg-[#12131A] p-0.5 shrink-0 self-end md:self-auto">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  viewMode === "grid"
                    ? "bg-white text-zinc-950 font-bold shadow-xs"
                    : "text-slate-400 hover:text-white"
                }`}
                title="Grid view"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  viewMode === "table"
                    ? "bg-white text-zinc-950 font-bold shadow-xs"
                    : "text-slate-400 hover:text-white"
                }`}
                title="Compact table view"
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Row 2: Sleek Horizontal Category Tabs */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 pt-0.5 no-scrollbar border-t border-white/[0.05]">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  onClick={() => {
                    setSelectedCategory(cat.value);
                    setVisibleCount(INITIAL_VISIBLE_COUNT);
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                    active
                      ? "bg-emerald-500 text-zinc-950 font-bold shadow-xs"
                      : "text-slate-300 hover:text-white hover:bg-white/[0.05]"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* EMPTY STATE */}
        {filteredItems.length === 0 && (
          <div className="rounded-2xl border border-white/[0.08] bg-[#0E1017] p-12 text-center">
            <Cpu className="h-8 w-8 text-slate-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white mb-1">No AI systems match this filter</h3>
            <p className="text-xs text-slate-400 mb-4">Try clearing your search query or selecting "All Companies".</p>
            <button
              onClick={handleResetFilters}
              className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-zinc-950 hover:bg-emerald-400 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* 1. GRID VIEW MODE (3-Column Grid) */}
        {viewMode === "grid" && filteredItems.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedItems.map((tool, idx) => {
              const isCompared = selectedCompare.some((t) => t.slug === tool.slug);
              const saved = isToolSaved(tool.slug);

              return (
                <motion.div
                  key={tool.slug}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: (idx % 9) * 0.05 }}
                  whileHover={{ y: -4 }}
                  onClick={() => onInspect(tool)}
                  className="group cursor-pointer rounded-2xl border border-white/[0.08] bg-[#0E1017] p-5 shadow-lg backdrop-blur-md hover:border-emerald-500/40 hover:bg-[#12141F] transition-all flex flex-col justify-between"
                >
                  {/* Top Row: Logo + Names + Actions */}
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3.5">
                      <div className="flex items-center space-x-3 min-w-0">
                        <BrandLogo slug={tool.slug} name={tool.name} creator={tool.creator} size="md" />
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors truncate">
                            {tool.name}
                          </h4>
                          <p className="text-[11px] text-slate-400 truncate font-medium">
                            {tool.creator}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                        {/* Bookmark Button */}
                        <button
                          onClick={() => toggleToolBookmark(tool.slug)}
                          className={`p-1.5 rounded-lg border transition-colors ${
                            saved
                              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                              : "border-white/[0.06] bg-white/[0.02] text-slate-400 hover:text-white"
                          }`}
                          title={saved ? "Remove bookmark" : "Save tool to Library"}
                        >
                          <Bookmark className={`h-3.5 w-3.5 ${saved ? "fill-emerald-400" : ""}`} />
                        </button>

                        {/* Compare Button */}
                        <button
                          onClick={() => onToggleCompare(tool)}
                          className={`p-1.5 rounded-lg border transition-colors ${
                            isCompared
                              ? "border-emerald-500 bg-emerald-500 text-zinc-950 font-bold"
                              : "border-white/[0.06] bg-white/[0.02] text-slate-400 hover:text-white hover:border-white/[0.15]"
                          }`}
                          title={isCompared ? "Remove from comparison" : "Add to comparison"}
                        >
                          {isCompared ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                    </div>

                    {/* Middle: Category Pill + Release Status Badge */}
                    <div className="flex flex-wrap items-center gap-1.5 mb-3">
                      <span className="rounded-full bg-white/[0.05] border border-white/[0.06] px-2 py-0.5 text-[10px] font-medium text-slate-300">
                        {tool.primary_category}
                      </span>
                      <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-mono font-semibold text-emerald-400">
                        {tool.release_status}
                      </span>
                    </div>

                    {/* Purpose Description (Concise 2-line) */}
                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-4">
                      {tool.short_purpose}
                    </p>
                  </div>

                  {/* Bottom: Pricing pill on left + Inspect Specs on right */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/[0.06] text-xs">
                    <span className="font-mono text-[11px] text-slate-400 truncate max-w-[130px]">
                      {tool.pricing_model}
                    </span>

                    <span className="flex items-center space-x-1 text-emerald-400 font-semibold group-hover:translate-x-0.5 transition-transform text-[11px]">
                      <span>Inspect Specs</span>
                      <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* 2. COMPACT TABLE VIEW MODE */}
        {viewMode === "table" && filteredItems.length > 0 && (
          <div className="rounded-2xl border border-white/[0.08] bg-[#0E1017] overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#12131A] text-slate-400 border-b border-white/[0.08] uppercase font-mono tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">System & Creator</th>
                    <th className="py-3 px-4">Primary Category</th>
                    <th className="py-3 px-4 hidden md:table-cell">Core Purpose</th>
                    <th className="py-3 px-4">Pricing Model</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.05]">
                  {displayedItems.map((tool) => {
                    const isCompared = selectedCompare.some((t) => t.slug === tool.slug);
                    const saved = isToolSaved(tool.slug);

                    return (
                      <tr
                        key={tool.slug}
                        onClick={() => onInspect(tool)}
                        className="hover:bg-white/[0.03] cursor-pointer transition-colors"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2.5">
                            <BrandLogo slug={tool.slug} name={tool.name} creator={tool.creator} size="sm" />
                            <div>
                              <div className="font-bold text-white">{tool.name}</div>
                              <div className="text-[10px] text-slate-400">{tool.creator}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-300">
                          <span className="rounded-full bg-white/[0.05] border border-white/[0.06] px-2 py-0.5 text-[10px]">
                            {tool.primary_category}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-300 hidden md:table-cell max-w-xs truncate">
                          {tool.short_purpose}
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-400">
                          {tool.pricing_model}
                        </td>
                        <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="inline-flex items-center space-x-1.5">
                            <button
                              onClick={() => toggleToolBookmark(tool.slug)}
                              className={`p-1.5 rounded-lg border text-xs ${
                                saved
                                  ? "border-emerald-500/40 text-emerald-400 bg-emerald-500/10"
                                  : "border-white/[0.06] text-slate-400 hover:text-white"
                              }`}
                            >
                              <Bookmark className={`h-3 w-3 ${saved ? "fill-emerald-400" : ""}`} />
                            </button>
                            <button
                              onClick={() => onToggleCompare(tool)}
                              className={`p-1.5 rounded-lg border text-xs ${
                                isCompared
                                  ? "border-emerald-500 bg-emerald-500 text-zinc-950"
                                  : "border-white/[0.06] text-slate-400 hover:text-white"
                              }`}
                            >
                              {isCompared ? <Check className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PAGINATION / LOAD MORE CONTROLS */}
        {remainingCount > 0 && (
          <div className="mt-12 text-center flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleShowMore}
              className="flex items-center space-x-2 rounded-full bg-white px-6 py-3 text-xs sm:text-sm font-bold text-zinc-950 hover:bg-emerald-400 transition-all shadow-lg shadow-white/5"
            >
              <span>Show More AI Systems (+{remainingCount} Remaining)</span>
              <ChevronDown className="h-4 w-4" />
            </button>

            <button
              onClick={handleShowAll}
              className="rounded-full border border-white/[0.1] bg-[#12131A] px-5 py-3 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/[0.06] transition-all"
            >
              Show All ({filteredItems.length})
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
