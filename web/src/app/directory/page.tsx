"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Search,
  ExternalLink,
  ArrowRight,
  Sparkles,
  Database,
  Layers,
  Building2,
  X,
  SlidersHorizontal,
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
    <div className="space-y-10 animate-in fade-in duration-300">
      {/* Editorial Header */}
      <div className="pb-6 border-b border-white/[0.08] space-y-3">
        <div className="inline-flex items-center gap-2 font-mono text-[11px] text-emerald-400">
          <Database className="w-3.5 h-3.5" />
          <span>ALL-TYPE AI ECOSYSTEM DIRECTORY</span>
          <span className="text-zinc-600">•</span>
          <span className="text-zinc-300 font-medium">{allDataset.length} VERIFIED SYSTEMS</span>
          <span className="text-zinc-600">•</span>
          <span className="text-zinc-400">GEMINI VERIFIED</span>
        </div>

        <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
          AI Systems &amp; Models Directory
        </h1>

        <p className="text-sm sm:text-base text-zinc-400 max-w-3xl leading-relaxed">
          Comprehensive, genuine verified index of foundation models, agentic IDEs, multimodal generative engines, and workflow frameworks. Filter by purpose and creator simultaneously.
        </p>
      </div>

      {/* Search & Sort Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search AI by name, company, or capability (e.g. Gemini, Antigravity, Claude, Stitch)..."
            className="w-full pl-10 pr-12 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] focus:border-emerald-500/80 focus:bg-white/[0.05] text-sm text-white placeholder-zinc-500 focus:outline-none transition-all font-sans"
          />
          {searchQuery && (
            <button
              onClick={() => handleSearchChange("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-zinc-500 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-zinc-500 flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5" /> Sort:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "featured" | "name" | "company")}
            className="px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-zinc-300 focus:outline-none focus:border-white/20 hover:border-white/15"
          >
            <option value="featured" className="bg-[#121215] text-white">Featured First</option>
            <option value="name" className="bg-[#121215] text-white">Alphabetical (A-Z)</option>
            <option value="company" className="bg-[#121215] text-white">By Company</option>
          </select>
        </div>
      </div>

      {/* Dual Filter Bars */}
      <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-6">
        {/* Filter Bar A: Category */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-400 uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5 text-orange-400" />
            <span>Filter Bar A: Filter by Purpose / Category</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const count = categoryCounts[cat] || 0;
              const isSelected = selectedCategory === cat;

              return (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
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
        </div>

        {/* Filter Bar B: Company */}
        <div className="space-y-2.5 pt-5 border-t border-white/[0.06]">
          <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-400 uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Filter Bar B: Filter by Company / Creator</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {COMPANIES.map((comp) => {
              const count = companyCounts[comp] || 0;
              const isSelected = selectedCompany === comp;

              return (
                <button
                  key={comp}
                  onClick={() => handleCompanyChange(comp)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-mono text-xs whitespace-nowrap transition-all ${
                    isSelected
                      ? "bg-white text-zinc-950 font-semibold shadow-md"
                      : "bg-white/[0.03] text-zinc-400 hover:text-white border border-white/[0.06] hover:border-white/20"
                  }`}
                >
                  <span>{comp}</span>
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
        </div>
      </div>

      {/* Filter Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-xs text-zinc-500">
        <div className="flex items-center gap-2">
          <span>Displaying</span>
          <span className="text-white font-bold">{filteredTools.length}</span>
          <span>of {allDataset.length} AI systems</span>
          {(selectedCategory !== "All Purpose" || selectedCompany !== "All Companies" || searchQuery) && (
            <span className="text-emerald-400 font-medium">• Filters Applied</span>
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
            className="text-orange-400 hover:text-orange-300 flex items-center gap-1 transition-colors"
          >
            Clear Active Filters <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Tool Grid */}
      {filteredTools.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTools.map((tool) => (
            <div
              key={tool.slug}
              className="flex flex-col justify-between p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-white/20 hover:bg-white/[0.04] transition-all group space-y-4"
            >
              <div className="space-y-3.5">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="px-2.5 py-1 rounded-md bg-white/[0.04] text-zinc-300 border border-white/[0.08] uppercase text-[10px] font-semibold tracking-wide">
                    {tool.company}
                  </span>
                  <span className="text-[11px] text-emerald-400 font-semibold font-mono">
                    {tool.pricing}
                  </span>
                </div>

                <div>
                  <button
                    onClick={() => handleOpenInspector(tool)}
                    className="font-heading font-bold text-xl text-white group-hover:text-emerald-300 transition-colors block text-left"
                  >
                    {tool.name}
                  </button>
                  <span className="font-mono text-[11px] text-zinc-500 block mt-1">
                    {tool.category}
                  </span>
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">
                  {tool.tagline}
                </p>

                <div className="pt-3 space-y-1.5 border-t border-white/[0.06]">
                  <span className="font-mono text-[10px] uppercase text-zinc-500 tracking-wider block">
                    Core Capabilities:
                  </span>
                  <ul className="space-y-1">
                    {(tool.keyFeatures || []).slice(0, 3).map((feat, idx) => (
                      <li key={idx} className="text-xs text-zinc-400 flex items-start gap-1.5">
                        <span className="text-orange-400 font-mono mt-0.5">•</span>
                        <span className="line-clamp-1">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between font-mono text-xs">
                <button
                  onClick={() => handleOpenInspector(tool)}
                  className="inline-flex items-center gap-1.5 text-white hover:text-emerald-400 font-semibold transition-colors"
                >
                  <span>Inspect Specs</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <a
                  href={tool.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors"
                >
                  <span>Official Site</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 rounded-2xl bg-white/[0.02] border border-white/[0.08] text-center space-y-5">
          <Sparkles className="w-10 h-10 text-orange-400 mx-auto opacity-80" />
          <div className="space-y-1.5">
            <h3 className="font-heading font-bold text-lg text-white">
              No verified tools match &quot;{searchQuery || "current filters"}&quot;
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
              This system might not be in our pre-indexed directory. You can invoke Gemini Live AI Lookup to inspect, verify, and index it in real-time.
            </p>
          </div>

          {lookupError && (
            <p className="text-xs text-red-400 font-mono">{lookupError}</p>
          )}

          {searchQuery.trim() && (
            <button
              onClick={handleGeminiLookup}
              disabled={isLookingUp}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-zinc-100 text-zinc-950 font-mono text-xs font-bold transition-all disabled:opacity-50 shadow-lg"
            >
              <Sparkles className={`w-3.5 h-3.5 text-orange-500 ${isLookingUp ? "animate-spin" : ""}`} />
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
          className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={handleCloseInspector}
        >
          <div
            className="w-full max-w-xl h-full bg-[#0c0c0e] border-l border-white/[0.1] shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-250"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="p-6 border-b border-white/[0.08] sticky top-0 bg-[#0c0c0e]/95 backdrop-blur z-10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-white/[0.05] text-zinc-300 border border-white/[0.08] font-mono text-[10px] uppercase font-semibold">
                  {activeInspectorTool.company}
                </span>
                <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono text-[10px] font-semibold">
                  {activeInspectorTool.pricing}
                </span>
                <span className="font-mono text-[10px] text-zinc-500 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" /> Verified Node
                </span>
              </div>

              <button
                onClick={handleCloseInspector}
                className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] text-zinc-400 hover:text-white transition-colors"
                title="Close Inspector"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="p-6 sm:p-8 space-y-6 flex-1">
              <div className="space-y-2">
                <span className="font-mono text-xs text-orange-400 uppercase tracking-wider block">
                  {activeInspectorTool.category}
                </span>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {activeInspectorTool.name}
                </h2>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  {activeInspectorTool.tagline}
                </p>
              </div>

              {/* Architectural Breakdown */}
              <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.08] space-y-3">
                <div className="flex items-center gap-2 font-mono text-xs text-zinc-300 font-semibold">
                  <Cpu className="w-4 h-4 text-orange-400" />
                  <span>System Architecture &amp; Purpose</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {activeInspectorTool.description}
                </p>
                {activeInspectorTool.architectureDetails && (
                  <div className="p-3 rounded-lg bg-black/40 border border-white/[0.06] font-mono text-[11px] text-zinc-400 space-y-1">
                    <span className="text-orange-400 font-semibold block uppercase text-[10px]">
                      Neural Specs:
                    </span>
                    <span>{activeInspectorTool.architectureDetails}</span>
                  </div>
                )}
              </div>

              {/* Core Capabilities */}
              <div className="space-y-3">
                <h3 className="font-mono text-xs uppercase tracking-wider text-zinc-400 font-semibold">
                  Key Capabilities &amp; Features:
                </h3>
                <ul className="space-y-2">
                  {(activeInspectorTool.keyFeatures || []).map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-zinc-300">
                      <div className="mt-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-3 h-3" />
                      </div>
                      <span className="leading-snug">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Best For Specification */}
              {activeInspectorTool.bestFor && (
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.08] space-y-1">
                  <span className="font-mono text-[10px] uppercase text-zinc-500 tracking-wider block">
                    Ideal Workflow &amp; Users:
                  </span>
                  <p className="text-xs text-zinc-300 font-medium">
                    {activeInspectorTool.bestFor}
                  </p>
                </div>
              )}
            </div>

            {/* Drawer Actions */}
            <div className="p-6 border-t border-white/[0.08] bg-[#0c0c0e] sticky bottom-0 space-y-3">
              <div className="flex items-center gap-3">
                <a
                  href={activeInspectorTool.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-zinc-100 text-zinc-950 font-mono text-xs font-bold transition-all shadow-lg"
                >
                  <span>Launch Official Site</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>

                <Link
                  href={`/directory/${activeInspectorTool.slug}`}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white border border-white/[0.08] font-mono text-xs transition-colors"
                >
                  <span>Full Spec Page</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="text-center">
                <span className="font-mono text-[10px] text-zinc-500">
                  Target URL: {activeInspectorTool.officialUrl}
                </span>
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
        <div className="p-16 text-center font-mono text-xs text-zinc-500">
          Loading Optimus Prime AI Ecosystem Index...
        </div>
      }
    >
      <DirectoryContent />
    </Suspense>
  );
}
