"use client";

import React, { useState, useMemo, Suspense } from "react";
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
  X
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

  const [isLookingUp, setIsLookingUp] = useState(false);
  const [liveLookedUpTools, setLiveLookedUpTools] = useState<AIDirectoryItem[]>([]);
  const [lookupError, setLookupError] = useState<string | null>(null);

  const updateUrlParams = (cat: DirectoryCategory, comp: CompanyFilter, q: string) => {
    const params = new URLSearchParams();
    if (cat !== "All Purpose") params.set("category", cat);
    if (comp !== "All Companies") params.set("company", comp);
    if (q.trim()) params.set("q", q.trim());

    const qs = params.toString();
    router.replace(qs ? `/directory?${qs}` : "/directory", { scroll: false });
  };

  const handleCategoryChange = (cat: DirectoryCategory) => {
    setSelectedCategory(cat);
    updateUrlParams(cat, selectedCompany, searchQuery);
  };

  const handleCompanyChange = (comp: CompanyFilter) => {
    setSelectedCompany(comp);
    updateUrlParams(selectedCategory, comp, searchQuery);
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    updateUrlParams(selectedCategory, selectedCompany, val);
  };

  const allDataset = useMemo(() => {
    return [...liveLookedUpTools, ...AI_DIRECTORY_DATA];
  }, [liveLookedUpTools]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const cat of CATEGORIES) {
      if (cat === "All Purpose") {
        counts[cat] = allDataset.filter((t) => {
          const matchCompany =
            selectedCompany === "All Companies" || (t.company || "").toLowerCase() === selectedCompany.toLowerCase();
          const matchQ =
            !searchQuery.trim() ||
            (t.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (t.tagline || "").toLowerCase().includes(searchQuery.toLowerCase());
          return matchCompany && matchQ;
        }).length;
      } else {
        counts[cat] = allDataset.filter((t) => {
          const matchCat =
            (t.category || "").toLowerCase() === cat.toLowerCase() ||
            t.secondaryCategories?.some((sc) => sc.toLowerCase() === cat.toLowerCase());
          const matchCompany =
            selectedCompany === "All Companies" || (t.company || "").toLowerCase() === selectedCompany.toLowerCase();
          const matchQ =
            !searchQuery.trim() ||
            (t.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (t.tagline || "").toLowerCase().includes(searchQuery.toLowerCase());
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
            (t.tagline || "").toLowerCase().includes(searchQuery.toLowerCase());
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
            (t.tagline || "").toLowerCase().includes(searchQuery.toLowerCase());
          return matchComp && matchCat && matchQ;
        }).length;
      }
    }
    return counts;
  }, [allDataset, selectedCategory, searchQuery]);

  const filteredTools = useMemo(() => {
    let result = allDataset.filter((tool) => {
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
    <div className="space-y-10 animate-in fade-in duration-200">
      <div className="pb-6 border-b border-[#27272A] space-y-2">
        <div className="inline-flex items-center gap-2 font-mono text-xs text-[#10B981]">
          <Database className="w-3.5 h-3.5" />
          <span>ALL-TYPE AI ECOSYSTEM DIRECTORY</span>
          <span className="text-[#3F3F46]">•</span>
          <span className="text-[#FAFAFA]">45+ VERIFIED TOOLS</span>
        </div>

        <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-[#FAFAFA]">
          AI Systems &amp; Models Directory
        </h1>

        <p className="text-sm text-[#A1A1AA] max-w-2xl">
          Comprehensive, genuine verified directory of foundation models, agentic IDEs, multimodal generative engines, and workflow frameworks. Filter by purpose and company simultaneously.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#71717A] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search AI by name, company, or capability..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#121215] border border-[#27272A] focus:border-[#10B981] text-sm text-[#FAFAFA] placeholder-[#71717A] focus:outline-none transition-editorial font-sans"
          />
          {searchQuery && (
            <button
              onClick={() => handleSearchChange("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-[#71717A] hover:text-[#FAFAFA]"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-[#71717A]">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "featured" | "name" | "company")}
            className="px-3 py-2 rounded-lg bg-[#121215] border border-[#27272A] text-[#FAFAFA] focus:outline-none focus:border-[#3F3F46]"
          >
            <option value="featured">Featured First</option>
            <option value="name">Alphabetical (A-Z)</option>
            <option value="company">By Company</option>
          </select>
        </div>
      </div>

      <div className="p-5 rounded-xl bg-[#121215] border border-[#27272A] space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 font-mono text-[11px] text-[#A1A1AA] uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5 text-[#F97316]" />
            <span>Filter Bar A: Filter by Purpose / Category</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const count = categoryCounts[cat] || 0;
              const isSelected = selectedCategory === cat;

              return (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs whitespace-nowrap transition-editorial ${
                    isSelected
                      ? "bg-[#FAFAFA] text-[#09090B] font-semibold"
                      : "bg-[#09090B] text-[#A1A1AA] hover:text-[#FAFAFA] border border-[#27272A] hover:border-[#3F3F46]"
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
        </div>

        <div className="space-y-2 pt-4 border-t border-[#27272A]/70">
          <div className="flex items-center gap-2 font-mono text-[11px] text-[#A1A1AA] uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5 text-[#10B981]" />
            <span>Filter Bar B: Filter by Company / Ecosystem</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            {COMPANIES.map((comp) => {
              const count = companyCounts[comp] || 0;
              const isSelected = selectedCompany === comp;

              return (
                <button
                  key={comp}
                  onClick={() => handleCompanyChange(comp)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs whitespace-nowrap transition-editorial ${
                    isSelected
                      ? "bg-[#FAFAFA] text-[#09090B] font-semibold"
                      : "bg-[#09090B] text-[#A1A1AA] hover:text-[#FAFAFA] border border-[#27272A] hover:border-[#3F3F46]"
                  }`}
                >
                  <span>{comp}</span>
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
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-xs text-[#71717A]">
        <div className="flex items-center gap-2">
          <span>Displaying</span>
          <span className="text-[#FAFAFA] font-bold">{filteredTools.length}</span>
          <span>of {allDataset.length} AI systems</span>
          {(selectedCategory !== "All Purpose" || selectedCompany !== "All Companies" || searchQuery) && (
            <span className="text-[#10B981]">• Filter Active</span>
          )}
        </div>

        {(selectedCategory !== "All Purpose" || selectedCompany !== "All Companies" || searchQuery) && (
          <button
            onClick={() => {
              setSelectedCategory("All Purpose");
              setSelectedCompany("All Companies");
              setSearchQuery("");
              updateUrlParams("All Purpose", "All Companies", "");
            }}
            className="text-[#F97316] hover:underline flex items-center gap-1"
          >
            Clear All Filters <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {filteredTools.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTools.map((tool) => (
            <div
              key={tool.slug}
              className="flex flex-col justify-between p-6 rounded-xl bg-[#121215] border border-[#27272A] hover:border-[#3F3F46] hover:bg-[#18181C] transition-editorial group space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="px-2 py-0.5 rounded bg-[#18181C] text-[#FAFAFA] border border-[#27272A] uppercase text-[10px] font-medium">
                    {tool.company}
                  </span>
                  <span className="text-[10px] text-[#10B981] font-semibold">
                    {tool.pricing}
                  </span>
                </div>

                <div>
                  <Link
                    href={`/directory/${tool.slug}`}
                    className="font-heading font-bold text-xl text-[#FAFAFA] group-hover:text-white transition-editorial block"
                  >
                    {tool.name}
                  </Link>
                  <span className="font-mono text-[11px] text-[#71717A] block mt-0.5">
                    {tool.category}
                  </span>
                </div>

                <p className="text-xs text-[#A1A1AA] leading-relaxed line-clamp-3">
                  {tool.tagline}
                </p>

                <div className="pt-2 space-y-1.5 border-t border-[#27272A]/50">
                  <span className="font-mono text-[10px] uppercase text-[#71717A] tracking-wider block">
                    Core Capabilities:
                  </span>
                  <ul className="space-y-1">
                    {(tool.keyFeatures || []).slice(0, 3).map((feat, idx) => (
                      <li key={idx} className="text-xs text-[#A1A1AA] flex items-start gap-1.5">
                        <span className="text-[#F97316] font-mono mt-0.5">•</span>
                        <span className="line-clamp-1">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-[#27272A]/70 flex items-center justify-between font-mono text-xs">
                <Link
                  href={`/directory/${tool.slug}`}
                  className="inline-flex items-center gap-1 text-[#FAFAFA] hover:text-[#10B981] font-semibold transition-editorial"
                >
                  Inspect Specs <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <a
                  href={tool.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[#A1A1AA] hover:text-white transition-editorial"
                >
                  Official Site <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-10 rounded-xl bg-[#121215] border border-[#27272A] text-center space-y-5">
          <Sparkles className="w-10 h-10 text-[#F97316] mx-auto opacity-80" />
          <div className="space-y-1">
            <h3 className="font-heading font-bold text-lg text-[#FAFAFA]">
              No local tools match &quot;{searchQuery || "current filters"}&quot;
            </h3>
            <p className="text-xs text-[#A1A1AA] max-w-md mx-auto">
              This system might not be in our pre-indexed directory. You can invoke Gemini Live AI Lookup to inspect, verify, and index it in real-time.
            </p>
          </div>

          {lookupError && (
            <p className="text-xs text-[#EF4444] font-mono">{lookupError}</p>
          )}

          {searchQuery.trim() && (
            <button
              onClick={handleGeminiLookup}
              disabled={isLookingUp}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#FAFAFA] hover:bg-white text-[#09090B] font-mono text-xs font-semibold transition-editorial disabled:opacity-50"
            >
              <Sparkles className={`w-3.5 h-3.5 text-[#F97316] ${isLookingUp ? "animate-spin" : ""}`} />
              <span>
                {isLookingUp
                  ? `Gemini Indexing "${searchQuery}"...`
                  : `Run Gemini Live Lookup for "${searchQuery}"`}
              </span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function DirectoryPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center font-mono text-xs text-[#71717A]">
          Loading Optimus Prime Ecosystem Index...
        </div>
      }
    >
      <DirectoryContent />
    </Suspense>
  );
}
