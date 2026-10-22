"use client";

import React, { useState, useMemo } from "react";
import { 
  Search, 
  Cpu, 
  Layers, 
  ExternalLink, 
  ArrowRight, 
  Filter,
  CheckCircle2,
  Star,
  Bookmark,
  LayoutGrid,
  List,
  Sparkles,
  Tag
} from "lucide-react";
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

const CATEGORIES: Category[] = [
  "All",
  "Chatbots & Assistants",
  "Code Builders & IDEs",
  "Autonomous Agents",
  "Foundation LLMs",
  "Image & Video Gen",
  "Voice & Audio",
  "Search & Research",
  "Agent Frameworks",
];

const COMPANIES: { label: CompanyFilter; slug: string }[] = [
  { label: "All Companies", slug: "" },
  { label: "Google", slug: "google" },
  { label: "OpenAI", slug: "openai" },
  { label: "Anthropic", slug: "anthropic" },
  { label: "Meta", slug: "meta" },
  { label: "DeepSeek", slug: "deepseek" },
  { label: "Alibaba / Qwen", slug: "qwen" },
  { label: "Cursor", slug: "cursor" },
  { label: "xAI", slug: "xai" },
  { label: "Mistral", slug: "mistral" },
  { label: "Microsoft / GitHub", slug: "microsoft" },
  { label: "Perplexity", slug: "perplexity" },
  { label: "Vercel", slug: "vercel" },
  { label: "Runway & Kling", slug: "runway" },
  { label: "Independent / Open Source", slug: "open-source" },
];

const QUICK_SCENARIOS = [
  { label: "Best for Full-Stack Coding", query: "full-stack coding" },
  { label: "Best for Deep Research", query: "deep research" },
  { label: "Best Free Local LLM", query: "local open weights" },
  { label: "Best Autonomous Repo Agent", query: "autonomous agent repo" },
  { label: "Best Video Generator", query: "video cinematic" },
];

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
  const [activeScenario, setActiveScenario] = useState<string | null>(null);

  const { isToolSaved, toggleToolBookmark } = useBookmarks();

  const handleScenarioClick = (scenarioLabel: string, query: string) => {
    if (activeScenario === scenarioLabel) {
      setActiveScenario(null);
      setSearchQuery("");
    } else {
      setActiveScenario(scenarioLabel);
      setSearchQuery(query);
    }
  };

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // 1. Category Filter
      const matchesCategory =
        selectedCategory === "All" || item.primary_category === selectedCategory;

      // 2. Company Filter
      let matchesCompany = true;
      if (selectedCompany !== "All Companies") {
        const creatorLower = item.creator.toLowerCase();
        const slugLower = item.slug.toLowerCase();
        const nameLower = item.name.toLowerCase();

        switch (selectedCompany) {
          case "Google":
            matchesCompany = creatorLower.includes("google") || creatorLower.includes("deepmind");
            break;
          case "OpenAI":
            matchesCompany = creatorLower.includes("openai");
            break;
          case "Anthropic":
            matchesCompany = creatorLower.includes("anthropic");
            break;
          case "Meta":
            matchesCompany = creatorLower.includes("meta");
            break;
          case "DeepSeek":
            matchesCompany = creatorLower.includes("deepseek");
            break;
          case "Alibaba / Qwen":
            matchesCompany = creatorLower.includes("alibaba") || slugLower.includes("qwen");
            break;
          case "Cursor":
            matchesCompany = creatorLower.includes("anysphere") || slugLower.includes("cursor");
            break;
          case "xAI":
            matchesCompany = creatorLower.includes("xai") || slugLower.includes("grok");
            break;
          case "Mistral":
            matchesCompany = creatorLower.includes("mistral");
            break;
          case "Microsoft / GitHub":
            matchesCompany = creatorLower.includes("microsoft") || creatorLower.includes("github");
            break;
          case "Perplexity":
            matchesCompany = creatorLower.includes("perplexity");
            break;
          case "Vercel":
            matchesCompany = creatorLower.includes("vercel");
            break;
          case "Runway & Kling":
            matchesCompany = creatorLower.includes("runway") || creatorLower.includes("kuaishou") || slugLower.includes("kling");
            break;
          case "Independent / Open Source":
            matchesCompany = item.release_status === "Open Source" || creatorLower.includes("community") || creatorLower.includes("crewai");
            break;
          default:
            matchesCompany = true;
        }
      }

      // 3. Pricing Filter
      let matchesPricing = true;
      if (pricingFilter !== "All") {
        const p = item.pricing_model.toLowerCase();
        if (pricingFilter === "Free") {
          matchesPricing = p.includes("completely free") || p.includes("free tier") || p.includes("free open weights");
        } else if (pricingFilter === "Freemium") {
          matchesPricing = p.includes("free tier") || p.includes("daily credits");
        } else if (pricingFilter === "Open Source") {
          matchesPricing = item.release_status === "Open Source" || p.includes("open source") || p.includes("open weights") || p.includes("apache") || p.includes("mit");
        } else if (pricingFilter === "Paid / API") {
          matchesPricing = p.includes("api") || p.includes("$") || p.includes("subscription");
        }
      }

      // 4. Search Query / Scenario
      const query = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.creator.toLowerCase().includes(query) ||
        item.short_purpose.toLowerCase().includes(query) ||
        item.detailed_overview.toLowerCase().includes(query) ||
        item.tags.some((t) => t.toLowerCase().includes(query)) ||
        item.key_capabilities.some((k) => k.toLowerCase().includes(query)) ||
        item.best_use_cases.some((u) => u.toLowerCase().includes(query));

      return matchesCategory && matchesCompany && matchesPricing && matchesQuery;
    });
  }, [items, selectedCategory, selectedCompany, pricingFilter, searchQuery]);

  const isToolCompared = (slug: string) => {
    return selectedCompare.some((t) => t.slug === slug);
  };

  return (
    <div className="space-y-6">
      {/* Directory Section Hero */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#121318] p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center space-x-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-medium text-emerald-400 mb-3">
              <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
              <span>FRONTIER AI DIRECTORY</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              AI Models, Autonomous Agents & Code Builders
            </h1>
            <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
              Curated intelligence platform tracking 40+ released frontier reasoning systems, autonomous software engineers, multi-agent frameworks, and multimodal engines.
            </p>
          </div>

          {/* Compare dock indicator if active */}
          {selectedCompare.length > 0 && (
            <div className="flex items-center space-x-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-xs">
              <div>
                <div className="font-semibold text-emerald-300">
                  {selectedCompare.length} of 3 Selected for Matrix
                </div>
                <div className="text-[11px] text-emerald-400/80">Compare capabilities side-by-side</div>
              </div>
              <button
                onClick={onOpenCompareModal}
                className="rounded-lg bg-emerald-500 text-zinc-950 font-semibold px-3 py-1.5 hover:bg-emerald-400 transition-colors shadow-sm"
              >
                Launch Matrix
              </button>
            </div>
          )}
        </div>

        {/* Quick Scenario Matchers */}
        <div className="pt-2">
          <div className="text-xs font-medium text-zinc-400 mb-2 flex items-center space-x-1.5">
            <Sparkles className="h-3 w-3 text-emerald-400" />
            <span>QUICK USE-CASE MATCHERS:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {QUICK_SCENARIOS.map((sc) => {
              const isActive = activeScenario === sc.label;
              return (
                <button
                  key={sc.label}
                  onClick={() => handleScenarioClick(sc.label, sc.query)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                    isActive
                      ? "bg-emerald-500 text-zinc-950 font-semibold shadow-xs"
                      : "bg-white/[0.04] border border-white/[0.08] text-zinc-300 hover:bg-white/[0.08] hover:text-white"
                  }`}
                >
                  {sc.label}
                </button>
              );
            })}
            {activeScenario && (
              <button
                onClick={() => {
                  setActiveScenario(null);
                  setSearchQuery("");
                }}
                className="rounded-lg px-2 py-1 text-xs text-zinc-500 hover:text-zinc-300 underline"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Level 1: Category Filter Bar */}
        <div className="pt-4 border-t border-white/[0.06]">
          <div className="text-xs font-medium text-zinc-400 mb-2 flex items-center space-x-1.5">
            <Filter className="h-3 w-3 text-zinc-400" />
            <span>CATEGORIES:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              const count =
                cat === "All"
                  ? items.length
                  : items.filter((i) => i.primary_category === cat).length;

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
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                      isSelected
                        ? "bg-zinc-200 text-zinc-950 font-bold"
                        : "bg-white/[0.08] text-zinc-400"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Level 2: Company Filter with Brand Logos */}
        <div className="pt-4 border-t border-white/[0.06]">
          <div className="text-xs font-medium text-zinc-400 mb-2 flex items-center space-x-1.5">
            <Cpu className="h-3 w-3 text-zinc-400" />
            <span>COMPANY & CREATOR:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {COMPANIES.map((company) => {
              const isSelected = selectedCompany === company.label;
              return (
                <button
                  key={company.label}
                  onClick={() => setSelectedCompany(company.label)}
                  className={`flex items-center space-x-2 rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                    isSelected
                      ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 shadow-xs"
                      : "bg-white/[0.03] border border-white/[0.06] text-zinc-400 hover:text-white hover:bg-white/[0.06]"
                  }`}
                >
                  {company.slug && (
                    <BrandLogo slug={company.slug} name={company.label} size="xs" />
                  )}
                  <span>{company.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Search, Pricing & View Controls Bar */}
        <div className="pt-4 border-t border-white/[0.06] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activeScenario) setActiveScenario(null);
              }}
              placeholder="Filter by capability, model name, tags, or creator..."
              className="w-full rounded-xl border border-white/[0.08] bg-black/40 pl-10 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:border-emerald-500/50 focus:outline-hidden"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Pricing & View Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Pricing Filter */}
            <div className="flex items-center space-x-1.5 text-xs text-zinc-400">
              <span className="hidden sm:inline">Pricing:</span>
              <select
                value={pricingFilter}
                onChange={(e) => setPricingFilter(e.target.value as PricingFilter)}
                className="rounded-lg border border-white/[0.08] bg-[#181A20] px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-hidden"
              >
                <option value="All">All Pricing</option>
                <option value="Free">Free</option>
                <option value="Freemium">Freemium</option>
                <option value="Open Source">Open Source</option>
                <option value="Paid / API">Paid / API</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center rounded-lg border border-white/[0.08] bg-[#181A20] p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-md ${
                  viewMode === "grid"
                    ? "bg-white/[0.1] text-white"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
                title="Grid View"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-md ${
                  viewMode === "table"
                    ? "bg-white/[0.1] text-white"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
                title="Compact Table View"
              >
                <List className="h-4 w-4" />
              </button>
            </div>

            <div className="text-xs text-zinc-400 font-medium">
              Showing <strong className="text-white">{filteredItems.length}</strong> of {items.length}
            </div>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-2xl border border-white/[0.08] bg-[#121318]/60">
          <Cpu className="h-10 w-10 text-zinc-500 mb-3" />
          <h3 className="text-base font-semibold text-white">No matching AI models found</h3>
          <p className="text-xs text-zinc-400 max-w-sm mt-1">
            Try adjusting your search query, pricing filter, or company selection.
          </p>
          <button
            onClick={() => {
              setSelectedCategory("All");
              setSelectedCompany("All Companies");
              setPricingFilter("All");
              setSearchQuery("");
              setActiveScenario(null);
            }}
            className="mt-4 rounded-xl bg-white text-zinc-950 font-medium px-4 py-2 text-xs hover:bg-zinc-200 transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      )}

      {/* Grid View */}
      {viewMode === "grid" && filteredItems.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => {
            const compared = isToolCompared(item.slug);
            const bookmarked = isToolSaved(item.slug);

            return (
              <div
                key={item.slug}
                className="group relative flex flex-col justify-between rounded-xl border border-white/[0.08] bg-[#121318] p-5 sm:p-6 hover:border-white/20 hover:bg-[#181A20] transition-all duration-150 shadow-sm"
              >
                <div>
                  {/* Card Header with Brand Logo */}
                  <div className="flex items-start justify-between gap-3 mb-3.5">
                    <div className="flex items-center space-x-3">
                      <BrandLogo
                        slug={item.slug}
                        name={item.name}
                        creator={item.creator}
                        size="lg"
                      />
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <h3
                            onClick={() => onInspect(item)}
                            className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors cursor-pointer"
                          >
                            {item.name}
                          </h3>
                          {item.is_featured && (
                            <span className="flex h-2 w-2 rounded-full bg-emerald-400" title="Featured System" />
                          )}
                        </div>
                        <span className="text-xs text-zinc-400 font-medium">
                          {item.creator}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1">
                      {/* Bookmark Icon */}
                      <button
                        onClick={() => toggleToolBookmark(item.slug)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          bookmarked
                            ? "text-emerald-400 hover:text-emerald-300"
                            : "text-zinc-500 hover:text-zinc-300"
                        }`}
                        title={bookmarked ? "Remove from Saved Library" : "Save to Library"}
                      >
                        <Bookmark className={`h-4 w-4 ${bookmarked ? "fill-current" : ""}`} />
                      </button>

                      {/* Compare Checkbox */}
                      <button
                        onClick={() => onToggleCompare(item)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          compared
                            ? "text-emerald-400 bg-emerald-500/10"
                            : "text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.04]"
                        }`}
                        title={compared ? "Remove from comparison" : "Add to comparison"}
                      >
                        <Layers className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Short Purpose */}
                  <p className="text-xs text-zinc-300 leading-relaxed mb-4 line-clamp-3">
                    {item.short_purpose}
                  </p>

                  {/* Primary Category & Release Status Pills */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-4">
                    <span className="rounded-md border border-white/[0.08] bg-white/[0.04] px-2 py-0.5 text-[11px] font-medium text-zinc-300">
                      {item.primary_category}
                    </span>
                    <span className="rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-400">
                      {item.release_status}
                    </span>
                  </div>

                  {/* Key Capabilities Bullet Preview */}
                  <div className="space-y-1.5 mb-4 pt-3 border-t border-white/[0.06]">
                    {item.key_capabilities.slice(0, 2).map((cap, idx) => (
                      <div key={idx} className="flex items-start space-x-2 text-[11px] text-zinc-400">
                        <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{cap}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
                  <div className="text-[11px] font-medium text-zinc-400 truncate max-w-[170px]" title={item.pricing_model}>
                    {item.pricing_model.split(";")[0]}
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onInspect(item)}
                      className="font-semibold text-emerald-400 hover:text-emerald-300 flex items-center space-x-1"
                    >
                      <span>Specifications</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Compact Table View */}
      {viewMode === "table" && filteredItems.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-white/[0.08] bg-[#121318]">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/[0.08] bg-white/[0.02] text-zinc-400 font-medium">
              <tr>
                <th className="py-3 px-4">Tool / Model</th>
                <th className="py-3 px-4">Creator</th>
                <th className="py-3 px-4">Primary Category</th>
                <th className="py-3 px-4">Pricing Model</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06] text-zinc-300">
              {filteredItems.map((item) => {
                const compared = isToolCompared(item.slug);
                const bookmarked = isToolSaved(item.slug);

                return (
                  <tr key={item.slug} className="hover:bg-white/[0.03] transition-colors">
                    <td className="py-3 px-4 font-semibold text-white">
                      <div className="flex items-center space-x-2.5">
                        <BrandLogo slug={item.slug} name={item.name} creator={item.creator} size="sm" />
                        <span
                          onClick={() => onInspect(item)}
                          className="hover:text-emerald-400 cursor-pointer"
                        >
                          {item.name}
                        </span>
                        {item.is_featured && (
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-zinc-400">{item.creator}</td>
                    <td className="py-3 px-4">
                      <span className="rounded-md border border-white/[0.08] bg-white/[0.04] px-2 py-0.5 text-[11px]">
                        {item.primary_category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-zinc-400 truncate max-w-[200px]" title={item.pricing_model}>
                      {item.pricing_model.split(";")[0]}
                    </td>
                    <td className="py-3 px-4">
                      <span className="rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[11px] text-emerald-400">
                        {item.release_status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => toggleToolBookmark(item.slug)}
                          className={`p-1 rounded ${bookmarked ? "text-emerald-400" : "text-zinc-500 hover:text-zinc-300"}`}
                          title="Bookmark"
                        >
                          <Bookmark className={`h-3.5 w-3.5 ${bookmarked ? "fill-current" : ""}`} />
                        </button>
                        <button
                          onClick={() => onToggleCompare(item)}
                          className={`p-1 rounded ${compared ? "text-emerald-400" : "text-zinc-500 hover:text-zinc-300"}`}
                          title="Compare"
                        >
                          <Layers className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => onInspect(item)}
                          className="text-emerald-400 hover:text-emerald-300 font-medium text-xs ml-2"
                        >
                          Details →
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
