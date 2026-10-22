"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Search,
  ExternalLink,
  ArrowRight,
  Sparkles,
  Layers,
  Building2,
  X,
  Cpu,
  CheckCircle2,
  ShieldCheck,
  ChevronRight,
  ArrowUpRight
} from "lucide-react";
import { AI_DIRECTORY_DATA } from "@/data/aiDirectoryData";
import { AIDirectoryItem, DirectoryCategory, CompanyFilter } from "@/lib/types";

const CATEGORIES: DirectoryCategory[] = [
  "All Purpose",
  "Video & Image Editing AI",
  "UI/UX & Product Design AI",
  "Coding & Autonomous Agents",
  "Conversational & Reasoning LLMs",
  "Audio, Voice & Music AI",
  "Research & Search Engines",
  "Workflow & Automation",
];

const COMPANIES: CompanyFilter[] = [
  "All Companies",
  "Google",
  "OpenAI",
  "Anthropic",
  "Meta",
  "xAI",
  "Microsoft & GitHub",
  "Vercel",
  "Creative & Editing Specialists",
  "Developer & Search Leaders",
  "Open Source & Independent",
];

function DirectoryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const paramCategory = searchParams.get("category");
  const paramCompany = searchParams.get("company");
  const paramQuery = searchParams.get("q") || "";
  const paramToolSlug = searchParams.get("tool");

  const [dataset, setDataset] = useState<AIDirectoryItem[]>(AI_DIRECTORY_DATA);
  const [selectedCategory, setSelectedCategory] = useState<DirectoryCategory>(
    paramCategory && CATEGORIES.includes(paramCategory as DirectoryCategory)
      ? (paramCategory as DirectoryCategory)
      : "All Purpose"
  );

  const [selectedCompany, setSelectedCompany] = useState<CompanyFilter>(
    paramCompany && COMPANIES.includes(paramCompany as CompanyFilter)
      ? (paramCompany as CompanyFilter)
      : "All Companies"
  );

  const [searchQuery, setSearchQuery] = useState(paramQuery);
  const [sortBy, setSortBy] = useState<"featured" | "name" | "company">("featured");

  const [activeInspectorTool, setActiveInspectorTool] = useState<AIDirectoryItem | null>(null);
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [liveLookedUpTools, setLiveLookedUpTools] = useState<AIDirectoryItem[]>([]);
  const [lookupError, setLookupError] = useState<string | null>(null);

  // Fetch updated directory items from server API on mount
  useEffect(() => {
    let isMounted = true;
    async function loadDirectory() {
      try {
        const res = await fetch("/api/directory");
        const data = await res.json();
        if (isMounted && data?.items && Array.isArray(data.items) && data.items.length > 0) {
          setDataset(data.items);
        }
      } catch (err) {
        console.warn("Could not fetch remote directory items, using static default:", err);
      }
    }
    loadDirectory();
    return () => {
      isMounted = false;
    };
  }, []);

  const allDataset = useMemo(() => {
    const combined = [...liveLookedUpTools, ...dataset];
    const map = new Map<string, AIDirectoryItem>();
    for (const item of combined) {
      if (!map.has(item.slug)) {
        map.set(item.slug, item);
      }
    }
    return Array.from(map.values());
  }, [liveLookedUpTools, dataset]);

  // Sync activeInspectorTool with paramToolSlug
  useEffect(() => {
    if (paramToolSlug) {
      const match = allDataset.find(
        (t) => t.slug.toLowerCase() === paramToolSlug.toLowerCase() || String(t.id) === paramToolSlug
      );
      if (match) {
        setActiveInspectorTool(match);
      }
    } else {
      setActiveInspectorTool(null);
    }
  }, [paramToolSlug, allDataset]);

  const updateUrlParams = (
    cat: DirectoryCategory,
    comp: CompanyFilter,
    q: string,
    toolSlug?: string | null
  ) => {
    const params = new URLSearchParams();
    if (cat !== "All Purpose") params.set("category", cat);
    if (comp !== "All Companies") params.set("company", comp);
    if (q.trim()) params.set("q", q.trim());
    if (toolSlug) params.set("tool", toolSlug);

    const qs = params.toString();
    router.replace(qs ? `/directory?${qs}` : "/directory", { scroll: false });
  };

  const handleCategoryChange = (cat: DirectoryCategory) => {
    setSelectedCategory(cat);
    updateUrlParams(cat, selectedCompany, searchQuery, paramToolSlug);
  };

  const handleCompanyChange = (comp: CompanyFilter) => {
    setSelectedCompany(comp);
    updateUrlParams(selectedCategory, comp, searchQuery, paramToolSlug);
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    updateUrlParams(selectedCategory, selectedCompany, val, paramToolSlug);
  };

  const handleOpenInspector = (tool: AIDirectoryItem) => {
    setActiveInspectorTool(tool);
    updateUrlParams(selectedCategory, selectedCompany, searchQuery, tool.slug);
  };

  const handleCloseInspector = () => {
    setActiveInspectorTool(null);
    updateUrlParams(selectedCategory, selectedCompany, searchQuery, null);
  };

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const cat of CATEGORIES) {
      if (cat === "All Purpose") {
        counts[cat] = allDataset.filter((t) => {
          const matchCompany =
            selectedCompany === "All Companies" ||
            (t.company || "").toLowerCase() === selectedCompany.toLowerCase();
          const matchQ =
            !searchQuery.trim() ||
            (t.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (t.tagline || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (t.company || "").toLowerCase().includes(searchQuery.toLowerCase());
          return matchCompany && matchQ;
        }).length;
      } else {
        counts[cat] = allDataset.filter((t) => {
          const matchCat =
            (t.category || "").toLowerCase() === cat.toLowerCase() ||
            t.secondaryCategories?.some((sc) => sc.toLowerCase() === cat.toLowerCase());
          const matchCompany =
            selectedCompany === "All Companies" ||
            (t.company || "").toLowerCase() === selectedCompany.toLowerCase();
          const matchQ =
            !searchQuery.trim() ||
            (t.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (t.tagline || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (t.company || "").toLowerCase().includes(searchQuery.toLowerCase());
          return matchCat && matchCompany && matchQ;
        }).length;
      }
    }
    return counts;
  }, [allDataset, selectedCompany, searchQuery]);

  const companyCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const comp of COMPANIES) {
      if (comp === "All Companies") {
        counts[comp] = allDataset.filter((t) => {
          const matchCat =
            selectedCategory === "All Purpose" ||
            (t.category || "").toLowerCase() === selectedCategory.toLowerCase() ||
            t.secondaryCategories?.some((sc) => sc.toLowerCase() === selectedCategory.toLowerCase());
          const matchQ =
            !searchQuery.trim() ||
            (t.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (t.tagline || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (t.company || "").toLowerCase().includes(searchQuery.toLowerCase());
          return matchCat && matchQ;
        }).length;
      } else {
        counts[comp] = allDataset.filter((t) => {
          const matchComp = (t.company || "").toLowerCase() === comp.toLowerCase();
          const matchCat =
            selectedCategory === "All Purpose" ||
            (t.category || "").toLowerCase() === selectedCategory.toLowerCase() ||
            t.secondaryCategories?.some((sc) => sc.toLowerCase() === selectedCategory.toLowerCase());
          const matchQ =
            !searchQuery.trim() ||
            (t.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (t.tagline || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (t.company || "").toLowerCase().includes(searchQuery.toLowerCase());
          return matchComp && matchCat && matchQ;
        }).length;
      }
    }
    return counts;
  }, [allDataset, selectedCategory, searchQuery]);

  const filteredTools = useMemo(() => {
    const result = allDataset.filter((tool) => {
      const matchCat =
        selectedCategory === "All Purpose" ||
        (tool.category || "").toLowerCase() === selectedCategory.toLowerCase() ||
        tool.secondaryCategories?.some((sc) => sc.toLowerCase() === selectedCategory.toLowerCase());

      const matchComp =
        selectedCompany === "All Companies" ||
        (tool.company || "").toLowerCase() === selectedCompany.toLowerCase();

      const q = searchQuery.toLowerCase().trim();
      const matchQ =
        !q ||
        (tool.name || "").toLowerCase().includes(q) ||
        (tool.company || "").toLowerCase().includes(q) ||
        (tool.tagline || "").toLowerCase().includes(q) ||
        (tool.description || "").toLowerCase().includes(q) ||
        (tool.keyFeatures || []).some((kf) => (kf || "").toLowerCase().includes(q));

      return matchCat && matchComp && matchQ;
    });

    result.sort((a, b) => {
      if (sortBy === "featured") {
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return a.name.localeCompare(b.name);
      } else if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      } else if (sortBy === "company") {
        return (a.company || "").localeCompare(b.company || "");
      }
      return 0;
    });

    return result;
  }, [allDataset, selectedCategory, selectedCompany, searchQuery, sortBy]);

  const handleGeminiLookup = async () => {
    if (!searchQuery.trim() || isLookingUp) return;
    setIsLookingUp(true);
    setLookupError(null);

    try {
      const res = await fetch("/api/gemini/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery.trim() }),
      });

      const data = await res.json();
      if (data?.tool) {
        setLiveLookedUpTools((prev) => [data.tool, ...prev.filter((t) => t.slug !== data.tool.slug)]);
        setSelectedCategory("All Purpose");
        setSelectedCompany("All Companies");
        handleOpenInspector(data.tool);
      } else {
        setLookupError(data?.error || `Gemini found no verified AI system named "${searchQuery}".`);
      }
    } catch {
      setLookupError("Failed connecting to Gemini Live Lookup service.");
    } finally {
      setIsLookingUp(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Editorial Header */}
      <div className="pb-6 border-b border-white/[0.08] space-y-3">
        <div className="flex items-center gap-2 text-xs font-sans text-[#8AB4F8]">
          <Layers className="w-3.5 h-3.5" />
          <span>AI Ecosystem Index</span>
          <span className="text-zinc-600">•</span>
          <span className="text-zinc-300">{allDataset.length} models &amp; tools indexed</span>
        </div>

        <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-normal text-white tracking-tight">
          Explore our next generation AI systems
        </h1>

        <p className="font-sans text-sm sm:text-base text-[#9AA0A6] max-w-3xl leading-relaxed">
          Comprehensive, genuine verified index of foundation models, agentic IDEs, multimodal generative engines, and workflow frameworks. Filter by purpose and creator simultaneously.
        </p>
      </div>

      {/* Search Bar & Sort Dropdown (DeepMind Capsule Pill) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search AI by name, company, or capability (e.g. Gemini, Antigravity, Claude, Stitch)..."
            className="w-full pl-11 pr-12 py-3 rounded-full bg-[#111318] border border-white/[0.08] focus:border-[#8AB4F8] text-sm text-white placeholder-zinc-500 focus:outline-none transition-all font-sans"
          />
          {searchQuery && (
            <button
              onClick={() => handleSearchChange("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-sans text-zinc-500 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs font-sans">
          <span className="text-zinc-500">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "featured" | "name" | "company")}
            className="px-4 py-2.5 rounded-full bg-[#111318] border border-white/[0.08] text-zinc-300 focus:outline-none focus:border-[#8AB4F8] hover:border-white/15"
          >
            <option value="featured" className="bg-[#111318] text-white">Featured first</option>
            <option value="name" className="bg-[#111318] text-white">Alphabetical (A-Z)</option>
            <option value="company" className="bg-[#111318] text-white">By company</option>
          </select>
        </div>
      </div>

      {/* Dual Filter Bars (DeepMind Capsule Pills) */}
      <div className="p-7 rounded-[28px] bg-[#111318] border border-white/[0.08] space-y-6">
        {/* Filter Bar A: Category */}
        <div className="space-y-3">
          <div className="text-xs font-sans text-[#9AA0A6] uppercase tracking-wider">
            Filter by purpose
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const count = categoryCounts[cat] || 0;
              const isSelected = selectedCategory === cat;

              return (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`flex items-center gap-2 px-5 py-2 rounded-full font-sans text-xs sm:text-sm whitespace-nowrap transition-all ${
                    isSelected
                      ? "bg-[#1E222D] text-white border border-[#8AB4F8]"
                      : "bg-[#161922] text-[#9AA0A6] hover:text-white border border-transparent hover:border-white/10"
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
        </div>

        {/* Filter Bar B: Company */}
        <div className="space-y-3 pt-5 border-t border-white/[0.06]">
          <div className="text-xs font-sans text-[#9AA0A6] uppercase tracking-wider">
            Filter by creator / ecosystem
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {COMPANIES.map((comp) => {
              const count = companyCounts[comp] || 0;
              const isSelected = selectedCompany === comp;

              return (
                <button
                  key={comp}
                  onClick={() => handleCompanyChange(comp)}
                  className={`flex items-center gap-2 px-5 py-2 rounded-full font-sans text-xs sm:text-sm whitespace-nowrap transition-all ${
                    isSelected
                      ? "bg-[#1E222D] text-white border border-[#8AB4F8]"
                      : "bg-[#161922] text-[#9AA0A6] hover:text-white border border-transparent hover:border-white/10"
                  }`}
                >
                  <span>{comp}</span>
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
        </div>
      </div>

      {/* Filter Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-sans text-zinc-500">
        <div className="flex items-center gap-2">
          <span>Displaying</span>
          <span className="text-white font-medium">{filteredTools.length}</span>
          <span>of {allDataset.length} AI systems</span>
          {(selectedCategory !== "All Purpose" || selectedCompany !== "All Companies" || searchQuery) && (
            <span className="text-[#8AB4F8] font-normal">• Filters applied</span>
          )}
        </div>

        {(selectedCategory !== "All Purpose" || selectedCompany !== "All Companies" || searchQuery) && (
          <button
            onClick={() => {
              setSelectedCategory("All Purpose");
              setSelectedCompany("All Companies");
              setSearchQuery("");
              updateUrlParams("All Purpose", "All Companies", "", paramToolSlug);
            }}
            className="text-[#8AB4F8] hover:underline flex items-center gap-1 transition-colors"
          >
            Clear active filters <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Ultra-Clean DeepMind Model Cards Grid */}
      {filteredTools.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => (
            <div
              key={tool.slug}
              className="flex flex-col justify-between p-7 rounded-[24px] bg-[#111318] border border-white/[0.08] hover:border-white/[0.18] hover:bg-[#171A21] transition-all duration-300 group"
            >
              <div className="space-y-3.5">
                {/* Top row: Company pill + pricing tag */}
                <div className="flex items-center justify-between text-xs font-sans">
                  <span className="px-3 py-1 rounded-full bg-white/[0.05] text-[#9AA0A6] border border-white/[0.08] text-[11px]">
                    {tool.company}
                  </span>
                  <span className="text-zinc-500 text-xs">
                    {tool.pricing}
                  </span>
                </div>

                {/* Title */}
                <button
                  onClick={() => handleOpenInspector(tool)}
                  className="font-heading text-xl font-normal text-white group-hover:text-[#8AB4F8] transition-colors block text-left"
                >
                  {tool.name}
                </button>

                {/* Concise 1-line description */}
                <p className="font-sans text-xs sm:text-sm text-[#9AA0A6] leading-relaxed line-clamp-2">
                  {tool.tagline}
                </p>
              </div>

              {/* Bottom row: Explore specs & Try now */}
              <div className="pt-5 mt-6 border-t border-white/[0.06] flex items-center justify-between text-xs font-sans">
                <button
                  onClick={() => handleOpenInspector(tool)}
                  className="inline-flex items-center gap-1.5 text-[#8AB4F8] hover:text-[#A8C7FA] transition-colors font-medium"
                >
                  <span>Explore specs</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <a
                  href={tool.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-zinc-400 hover:text-white transition-colors"
                >
                  <span>Try now</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 rounded-[28px] bg-[#111318] border border-white/[0.08] text-center space-y-5">
          <Sparkles className="w-10 h-10 text-[#8AB4F8] mx-auto opacity-80" />
          <div className="space-y-2">
            <h3 className="font-heading font-normal text-xl text-white">
              No verified tools match &quot;{searchQuery || "current filters"}&quot;
            </h3>
            <p className="text-xs sm:text-sm text-[#9AA0A6] max-w-md mx-auto leading-relaxed">
              This system might not be in our pre-indexed directory. You can invoke Gemini Live AI Lookup to inspect, verify, and index it in real-time.
            </p>
          </div>

          {lookupError && (
            <p className="text-xs text-red-400 font-sans">{lookupError}</p>
          )}

          {searchQuery.trim() && (
            <button
              onClick={handleGeminiLookup}
              disabled={isLookingUp}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white hover:bg-zinc-100 text-black font-sans text-xs font-medium transition-all disabled:opacity-50 shadow-md"
            >
              <Sparkles className={`w-3.5 h-3.5 text-[#8AB4F8] ${isLookingUp ? "animate-spin" : ""}`} />
              <span>
                {isLookingUp
                  ? `Gemini Indexing "${searchQuery}"...`
                  : `Run Gemini Live Lookup for "${searchQuery}"`}
              </span>
            </button>
          )}
        </div>
      )}

      {/* Slide-Over Deep Specs Inspector Modal / Drawer */}
      {activeInspectorTool && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={handleCloseInspector}
        >
          <div
            className="w-full max-w-xl h-full bg-[#111318] border-l border-white/[0.1] shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-250"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="p-6 border-b border-white/[0.08] sticky top-0 bg-[#111318]/95 backdrop-blur z-10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="px-3 py-1 rounded-full bg-white/[0.05] text-[#9AA0A6] border border-white/[0.08] text-xs">
                  {activeInspectorTool.company}
                </span>
                <span className="text-xs text-[#8AB4F8]">
                  {activeInspectorTool.pricing}
                </span>
              </div>

              <button
                onClick={handleCloseInspector}
                className="p-2 rounded-full bg-white/[0.04] hover:bg-white/[0.1] text-zinc-400 hover:text-white transition-colors"
                title="Close Inspector"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="p-8 space-y-6 flex-1">
              <div className="space-y-2">
                <span className="text-xs font-sans text-[#8AB4F8] uppercase tracking-wider block">
                  {activeInspectorTool.category}
                </span>
                <h2 className="font-heading text-3xl font-normal text-white tracking-tight">
                  {activeInspectorTool.name}
                </h2>
                <p className="text-sm text-[#9AA0A6] leading-relaxed">
                  {activeInspectorTool.tagline}
                </p>
              </div>

              {/* Architectural Breakdown */}
              <div className="p-6 rounded-[20px] bg-[#161922] border border-white/[0.08] space-y-3">
                <div className="flex items-center gap-2 text-xs font-sans text-white font-medium">
                  <Cpu className="w-4 h-4 text-[#8AB4F8]" />
                  <span>Architecture &amp; purpose</span>
                </div>
                <p className="text-xs sm:text-sm text-[#9AA0A6] leading-relaxed">
                  {activeInspectorTool.description}
                </p>
                {activeInspectorTool.architectureDetails && (
                  <div className="p-4 rounded-xl bg-black/40 border border-white/[0.06] text-xs text-zinc-300 space-y-1">
                    <span className="text-[#8AB4F8] font-medium block text-[11px]">
                      Underlying specifications:
                    </span>
                    <span>{activeInspectorTool.architectureDetails}</span>
                  </div>
                )}
              </div>

              {/* Core Capabilities */}
              <div className="space-y-3">
                <h3 className="text-xs uppercase tracking-wider text-[#9AA0A6] font-medium">
                  Key capabilities &amp; benchmarks:
                </h3>
                <ul className="space-y-2.5">
                  {(activeInspectorTool.keyFeatures || []).map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-zinc-300">
                      <div className="mt-1 w-3.5 h-3.5 rounded-full bg-[#8AB4F8]/10 text-[#8AB4F8] flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-3 h-3" />
                      </div>
                      <span className="leading-snug">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Best For Specification */}
              {activeInspectorTool.bestFor && (
                <div className="p-5 rounded-[20px] bg-[#161922] border border-white/[0.08] space-y-1">
                  <span className="text-[11px] uppercase text-[#9AA0A6] tracking-wider block">
                    Ideal workflow &amp; developers:
                  </span>
                  <p className="text-xs sm:text-sm text-white font-normal">
                    {activeInspectorTool.bestFor}
                  </p>
                </div>
              )}
            </div>

            {/* Drawer Actions (DeepMind Capsule Pills) */}
            <div className="p-6 border-t border-white/[0.08] bg-[#111318] sticky bottom-0 space-y-3">
              <div className="flex items-center gap-3">
                <a
                  href={activeInspectorTool.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-white hover:bg-zinc-100 text-black text-xs sm:text-sm font-medium transition-all shadow-md"
                >
                  <span>Launch official site</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>

                <Link
                  href={`/directory/${activeInspectorTool.slug}`}
                  className="inline-flex items-center justify-center gap-1.5 px-5 py-3 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-white border border-white/[0.08] text-xs sm:text-sm transition-colors"
                >
                  <span>Full specs</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DirectoryPage() {
  return (
    <Suspense
      fallback={
        <div className="p-20 text-center text-xs font-sans text-zinc-500">
          Loading Optimus Prime AI Ecosystem Index...
        </div>
      }
    >
      <DirectoryContent />
    </Suspense>
  );
}
