"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
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
  ArrowUpRight,
  Scale
} from "lucide-react";
import ToolIcon from "@/components/ToolIcon";
import { AI_DIRECTORY_DATA } from "@/data/aiDirectoryData";
import { AIDirectoryItem, DirectoryCategory, CompanyFilter } from "@/lib/types";
import FilterBar, { PricingFilter, SortOption } from "@/components/FilterBar";

function safeArray(arr: unknown): string[] {
  if (Array.isArray(arr)) return arr.filter(Boolean).map(String);
  return [];
}

function ModelsSkeletonGrid() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 space-y-8 animate-in fade-in duration-300">
      <div className="space-y-4">
        <div className="h-4 w-36 rounded-full bg-white/[0.05] animate-pulse" />
        <div className="h-10 w-80 rounded-2xl bg-white/[0.04] animate-pulse" />
        <div className="h-4 w-96 rounded-full bg-white/[0.03] animate-pulse" />
      </div>
      <div className="h-12 w-full rounded-2xl bg-white/[0.03] animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div
            key={n}
            className="flex flex-col justify-between p-7 rounded-[24px] bg-[#11131A] border border-white/[0.08] space-y-6"
          >
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="h-5 w-20 rounded-full bg-white/[0.06] animate-pulse" />
                <div className="h-4 w-12 rounded-full bg-white/[0.04] animate-pulse" />
              </div>
              <div className="h-6 w-48 rounded-lg bg-white/[0.08] animate-pulse" />
              <div className="space-y-1.5">
                <div className="h-3.5 w-full rounded bg-white/[0.04] animate-pulse" />
                <div className="h-3.5 w-3/4 rounded bg-white/[0.03] animate-pulse" />
              </div>
            </div>
            <div className="pt-5 border-t border-white/[0.06] flex items-center justify-between">
              <div className="h-4 w-24 rounded-full bg-white/[0.05] animate-pulse" />
              <div className="h-4 w-16 rounded-full bg-white/[0.04] animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ModelsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const paramCategory = searchParams.get("category");
  const paramCompany = searchParams.get("company");
  const paramQuery = searchParams.get("q") || "";
  const paramToolSlug = searchParams.get("tool");

  const [dataset, setDataset] = useState<AIDirectoryItem[]>(AI_DIRECTORY_DATA);
  const [selectedCategory, setSelectedCategory] = useState<DirectoryCategory>(
    paramCategory ? (paramCategory as DirectoryCategory) : "All Purpose"
  );
  const [selectedCompany, setSelectedCompany] = useState<CompanyFilter>(
    paramCompany ? (paramCompany as CompanyFilter) : "All Companies"
  );
  const [selectedPricing, setSelectedPricing] = useState<PricingFilter>("All Pricing");
  const [searchQuery, setSearchQuery] = useState(paramQuery);
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [isLoading, setIsLoading] = useState(false);

  // Inspector modal state
  const [activeInspectorTool, setActiveInspectorTool] = useState<AIDirectoryItem | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadDirectory() {
      setIsLoading(true);
      try {
        const res = await fetch("/api/directory", { cache: "no-store" });
        const data = await res.json();
        if (isMounted && data?.items && Array.isArray(data.items) && data.items.length > 0) {
          setDataset(data.items);
        }
      } catch (err) {
        console.warn("Could not fetch remote directory items, using static default:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadDirectory();
    return () => {
      isMounted = false;
    };
  }, []);

  // Handle URL tool query for inspector
  useEffect(() => {
    if (paramToolSlug && dataset.length > 0) {
      const found = dataset.find(
        (t) =>
          String(t.slug || t.id).toLowerCase() === paramToolSlug.toLowerCase()
      );
      if (found) setActiveInspectorTool(found);
    }
  }, [paramToolSlug, dataset]);

  // Synchronize category/company from query params
  useEffect(() => {
    if (paramCategory) setSelectedCategory(paramCategory as DirectoryCategory);
    if (paramCompany) setSelectedCompany(paramCompany as CompanyFilter);
  }, [paramCategory, paramCompany]);

  const filteredItems = useMemo(() => {
    return dataset
      .filter((tool) => {
        // Category filter
        if (selectedCategory !== "All Purpose") {
          const mainMatch = tool.category?.toLowerCase() === selectedCategory.toLowerCase();
          const secondary = safeArray(tool.secondaryCategories).map((s) => s.toLowerCase());
          const secMatch = secondary.includes(selectedCategory.toLowerCase());
          if (!mainMatch && !secMatch) return false;
        }

        // Company filter
        if (selectedCompany !== "All Companies") {
          if ((tool.company || "").toLowerCase() !== selectedCompany.toLowerCase()) {
            return false;
          }
        }

        // Pricing filter
        if (selectedPricing !== "All Pricing") {
          const pricing = (tool.pricing || "").toLowerCase();
          if (selectedPricing === "Free" && !pricing.includes("free") && pricing !== "open source") return false;
          if (selectedPricing === "Freemium" && !pricing.includes("freemium")) return false;
          if (selectedPricing === "Open Source" && !pricing.includes("open")) return false;
          if (selectedPricing === "Paid" && !pricing.includes("paid") && !pricing.includes("enterprise") && !pricing.includes("$")) return false;
        }

        // Search Query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const nameMatch = (tool.name || "").toLowerCase().includes(q);
          const compMatch = (tool.company || "").toLowerCase().includes(q);
          const tagMatch = (tool.tagline || "").toLowerCase().includes(q);
          const descMatch = (tool.description || "").toLowerCase().includes(q);
          const featMatch = safeArray(tool.keyFeatures).some((f) => f.toLowerCase().includes(q));
          if (!nameMatch && !compMatch && !tagMatch && !descMatch && !featMatch) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "featured") {
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          return (a.name || "").localeCompare(b.name || "");
        }
        if (sortBy === "name") {
          return (a.name || "").localeCompare(b.name || "");
        }
        if (sortBy === "company") {
          const comp = (a.company || "").localeCompare(b.company || "");
          if (comp !== 0) return comp;
          return (a.name || "").localeCompare(b.name || "");
        }
        if (sortBy === "latest") {
          return String(b.id || "").localeCompare(String(a.id || ""));
        }
        return 0;
      });
  }, [dataset, selectedCategory, selectedCompany, selectedPricing, searchQuery, sortBy]);

  const handleClearFilters = () => {
    setSelectedCategory("All Purpose");
    setSelectedCompany("All Companies");
    setSelectedPricing("All Pricing");
    setSearchQuery("");
    setSortBy("featured");
    router.push("/models");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-24 space-y-10">
      {/* Header Title Section */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.08] text-xs font-mono text-[#9AA0A6]">
          <span className="w-2 h-2 rounded-full bg-[#6366F1]" />
          <span>VERIFIED AI SYSTEMS INDEX</span>
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-normal text-white tracking-tight">
          All AI Models &amp; Autonomous Tools
        </h1>
        <p className="font-sans text-sm sm:text-base text-[#9AA0A6] max-w-3xl leading-relaxed">
          Explore genuine frontier foundation models, coding agents, multimodal generators, and developer infrastructure indexed across major global AI ecosystems.
        </p>
      </div>

      {/* Structured Filter Bar */}
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCompany={selectedCompany}
        onCompanyChange={setSelectedCompany}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedPricing={selectedPricing}
        onPricingChange={setSelectedPricing}
        sortBy={sortBy}
        onSortChange={setSortBy}
        totalCount={dataset.length}
        filteredCount={filteredItems.length}
        onClearFilters={handleClearFilters}
      />

      {/* Systems Grid */}
      {filteredItems.length === 0 ? (
        <div className="p-16 rounded-[24px] bg-[#11131A] border border-white/[0.08] text-center space-y-4">
          <p className="text-base text-[#9AA0A6]">
            No verified AI systems match your selected filter criteria.
          </p>
          <button
            onClick={handleClearFilters}
            className="px-5 py-2.5 rounded-full bg-white/[0.08] hover:bg-white/[0.15] text-white text-xs font-medium transition-all"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((tool) => {
            const toolSlug = tool.slug || String(tool.id || "");
            return (
              <div
                key={tool.id || tool.slug}
                className="flex flex-col justify-between p-7 rounded-[24px] bg-[#11131A] border border-white/[0.08] hover:border-white/[0.2] hover:bg-[#161923] transition-all duration-300 group shadow-lg"
              >
                <div className="space-y-4">
                  {/* Top Row: Icon, Company & Pricing */}
                  <div className="flex items-start justify-between gap-3">
                    <ToolIcon
                      name={tool.name}
                      company={tool.company}
                      officialUrl={tool.officialUrl}
                      category={tool.category}
                      size={42}
                    />
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-white/[0.05] text-[#9AA0A6] border border-white/[0.08] text-[11px] font-mono">
                        {tool.company}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-white/[0.04] text-zinc-400 border border-white/[0.06]">
                        {tool.pricing || "Freemium"}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <Link
                    href={`/tool/${toolSlug}`}
                    className="font-heading text-xl font-normal text-white group-hover:text-[#38BDF8] transition-colors block tracking-tight"
                  >
                    {tool.name}
                  </Link>

                  {/* Tagline / Short Description */}
                  <p className="font-sans text-xs sm:text-sm text-[#9AA0A6] leading-relaxed line-clamp-2">
                    {tool.tagline || tool.description}
                  </p>

                  {/* Key Features Pill Tags */}
                  {safeArray(tool.keyFeatures).length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {safeArray(tool.keyFeatures)
                        .slice(0, 2)
                        .map((feature, i) => (
                          <span
                            key={i}
                            className="text-[11px] px-2.5 py-1 rounded-lg bg-black/40 text-[#9AA0A6] border border-white/[0.05] line-clamp-1"
                          >
                            {feature}
                          </span>
                        ))}
                    </div>
                  )}
                </div>

                {/* Card Footer: Action Links */}
                <div className="pt-5 mt-6 border-t border-white/[0.06] flex items-center justify-between text-xs font-sans">
                  <button
                    onClick={() => setActiveInspectorTool(tool)}
                    className="inline-flex items-center gap-1.5 text-[#38BDF8] hover:text-[#818CF8] transition-colors font-medium text-xs focus:outline-none"
                  >
                    <span>Inspect specs</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/compare?tools=${encodeURIComponent(toolSlug)},google-antigravity,cursor`}
                      className="px-2.5 py-1 rounded-full bg-white/[0.04] hover:bg-white/[0.09] text-zinc-400 hover:text-[#38BDF8] text-[11px] font-mono transition flex items-center gap-1 border border-white/[0.06]"
                      title="Compare with other models"
                    >
                      <Scale className="w-3 h-3" />
                      <span>Compare</span>
                    </Link>
                    <Link
                      href={`/tool/${toolSlug}`}
                      className="px-2.5 py-1 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-zinc-300 text-[11px] transition"
                    >
                      Profile
                    </Link>
                    {tool.officialUrl && (
                      <a
                        href={tool.officialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-zinc-400 hover:text-white transition-colors text-[11px]"
                      >
                        <span>Visit</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* =====================================================================
          SPECS INSPECTOR MODAL
      ===================================================================== */}
      {activeInspectorTool && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setActiveInspectorTool(null)}
        >
          <div
            className="w-full max-w-2xl rounded-[28px] bg-[#11131A] border border-white/[0.12] p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveInspectorTool(null)}
              className="absolute top-6 right-6 p-2 rounded-full text-[#9AA0A6] hover:text-white hover:bg-white/[0.08] transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="space-y-2 pr-8">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-white/[0.05] text-[#9AA0A6] text-xs font-mono border border-white/[0.08]">
                  {activeInspectorTool.company}
                </span>
                <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-mono border border-indigo-500/20">
                  {activeInspectorTool.category}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-heading font-normal text-white">
                {activeInspectorTool.name}
              </h2>
              <p className="text-sm text-[#9AA0A6] leading-relaxed">
                {activeInspectorTool.tagline}
              </p>
            </div>

            {/* Description */}
            <div className="space-y-2 border-t border-white/[0.08] pt-4">
              <h4 className="text-xs font-mono uppercase tracking-wider text-[#9AA0A6]">
                Architecture &amp; Description
              </h4>
              <p className="text-sm text-zinc-300 leading-relaxed font-sans">
                {activeInspectorTool.description || "Verified frontier AI system indexed by Optimus Prime."}
              </p>
            </div>

            {/* Key Features */}
            {safeArray(activeInspectorTool.keyFeatures).length > 0 && (
              <div className="space-y-2 border-t border-white/[0.08] pt-4">
                <h4 className="text-xs font-mono uppercase tracking-wider text-[#9AA0A6]">
                  Verified Capabilities
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {safeArray(activeInspectorTool.keyFeatures).map((kf, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 p-2.5 rounded-xl bg-black/40 border border-white/[0.05] text-xs text-zinc-300"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#38BDF8] shrink-0 mt-0.5" />
                      <span>{kf}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Best For & Pricing */}
            <div className="grid grid-cols-2 gap-4 border-t border-white/[0.08] pt-4 text-xs font-sans">
              <div>
                <span className="text-[#9AA0A6] font-mono uppercase block text-[11px] mb-1">
                  Ideal For
                </span>
                <p className="text-zinc-200">
                  {activeInspectorTool.bestFor || "Enterprise workflows and generative reasoning."}
                </p>
              </div>
              <div>
                <span className="text-[#9AA0A6] font-mono uppercase block text-[11px] mb-1">
                  Pricing Tier
                </span>
                <p className="text-zinc-200 font-medium">
                  {activeInspectorTool.pricing || "Freemium"}
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="border-t border-white/[0.08] pt-6 flex items-center justify-between">
              <Link
                href={`/tool/${activeInspectorTool.slug || activeInspectorTool.id}`}
                className="text-xs text-[#38BDF8] hover:underline"
              >
                View dedicated tool page →
              </Link>
              {activeInspectorTool.officialUrl && (
                <a
                  href={activeInspectorTool.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-full bg-white text-black font-medium text-xs hover:bg-zinc-200 transition-all inline-flex items-center gap-1.5 shadow-md"
                >
                  <span>Launch Official Website</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ModelsPage() {
  return (
    <Suspense fallback={<ModelsSkeletonGrid />}>
      <ModelsContent />
    </Suspense>
  );
}
