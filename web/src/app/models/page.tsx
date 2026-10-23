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
        <div className="h-4 w-36 rounded-full bg-black/[0.05] dark:bg-white/[0.05] animate-pulse" />
        <div className="h-10 w-80 rounded-2xl bg-black/[0.04] dark:bg-white/[0.04] animate-pulse" />
        <div className="h-4 w-96 rounded-full bg-black/[0.03] dark:bg-white/[0.03] animate-pulse" />
      </div>
      <div className="h-12 w-full rounded-2xl bg-black/[0.03] dark:bg-white/[0.03] animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div
            key={n}
            className="flex flex-col justify-between p-7 rounded-3xl bg-[#F8FAFD] dark:bg-[#111318] border border-black/[0.08] dark:border-white/[0.08] space-y-6"
          >
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="h-5 w-20 rounded-full bg-black/[0.06] dark:bg-white/[0.06] animate-pulse" />
                <div className="h-4 w-12 rounded-full bg-black/[0.04] dark:bg-white/[0.04] animate-pulse" />
              </div>
              <div className="h-6 w-48 rounded-lg bg-black/[0.08] dark:bg-white/[0.08] animate-pulse" />
              <div className="space-y-1.5">
                <div className="h-3.5 w-full rounded bg-black/[0.04] dark:bg-white/[0.04] animate-pulse" />
                <div className="h-3.5 w-3/4 rounded bg-black/[0.03] dark:bg-white/[0.03] animate-pulse" />
              </div>
            </div>
            <div className="pt-5 border-t border-black/[0.06] dark:border-white/[0.06] flex items-center justify-between">
              <div className="h-4 w-24 rounded-full bg-black/[0.05] dark:bg-white/[0.05] animate-pulse" />
              <div className="h-4 w-16 rounded-full bg-black/[0.04] dark:bg-white/[0.04] animate-pulse" />
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
          const target = selectedPricing.toLowerCase();
          if (target === "free" && pricing !== "free") return false;
          if (target === "freemium" && pricing !== "freemium") return false;
          if (target === "paid" && pricing !== "paid") return false;
        }

        // Search Query (Tokenized fuzzy search across name, company, description, features)
        if (searchQuery.trim() !== "") {
          const q = searchQuery.toLowerCase().trim();
          const name = (tool.name || "").toLowerCase();
          const company = (tool.company || "").toLowerCase();
          const tagline = (tool.tagline || "").toLowerCase();
          const desc = (tool.description || "").toLowerCase();
          const features = safeArray(tool.keyFeatures).join(" ").toLowerCase();

          const match =
            name.includes(q) ||
            company.includes(q) ||
            tagline.includes(q) ||
            desc.includes(q) ||
            features.includes(q);

          if (!match) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "featured") {
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          return a.name.localeCompare(b.name);
        }
        if (sortBy === "name") {
          return a.name.localeCompare(b.name);
        }
        if (sortBy === "company") {
          return (a.company || "").localeCompare(b.company || "");
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
    <div className="min-h-screen bg-[#FFFFFF] dark:bg-[#060608] text-[#1F1F1F] dark:text-[#E3E3E3] pt-28 pb-24 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header Title Section */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F0F4F9] dark:bg-white/[0.05] border border-black/[0.06] dark:border-white/[0.08] text-xs font-medium text-[#5F6368] dark:text-[#8E9196] shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#4285F4]" />
            <span>VERIFIED 2026 AI SYSTEMS INDEX</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-normal text-[#1F1F1F] dark:text-white tracking-tight">
            All AI Models &amp; Autonomous Tools
          </h1>
          <p className="font-sans text-sm sm:text-base text-[#5F6368] dark:text-[#8E9196] max-w-3xl leading-relaxed">
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
          <div className="p-16 rounded-3xl bg-[#F8FAFD] dark:bg-[#111318] border border-black/[0.08] dark:border-white/[0.08] text-center space-y-4">
            <p className="text-base text-[#5F6368] dark:text-[#8E9196]">
              No verified AI systems match your selected filter criteria.
            </p>
            <button
              onClick={handleClearFilters}
              className="px-5 py-2.5 rounded-full bg-[#1F1F1F] dark:bg-white text-white dark:text-[#1F1F1F] text-xs font-medium transition-all shadow-sm"
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
                  className="flex flex-col justify-between p-7 rounded-3xl bg-[#F8FAFD] dark:bg-[#111318] border border-black/[0.08] dark:border-white/[0.08] hover:border-[#4285F4]/30 dark:hover:border-white/[0.18] transition-all duration-300 group shadow-sm hover:shadow-md"
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
                        <span className="px-3 py-1 rounded-full bg-[#F0F4F9] dark:bg-white/[0.05] text-[#5F6368] dark:text-[#8E9196] border border-black/[0.06] dark:border-white/[0.08] text-[11px] font-medium">
                          {tool.company}
                        </span>
                        <span className="text-[#5F6368] dark:text-zinc-500 text-xs font-medium">
                          {tool.pricing || "Freemium"}
                        </span>
                      </div>
                    </div>

                    {/* Title & Tagline */}
                    <div>
                      <Link
                        href={`/tool/${toolSlug}`}
                        className="font-heading text-xl font-normal text-[#1F1F1F] dark:text-white group-hover:text-[#4285F4] dark:group-hover:text-[#8AB4F8] transition-colors block"
                      >
                        {tool.name}
                      </Link>
                      <p className="font-sans text-xs sm:text-sm text-[#5F6368] dark:text-[#8E9196] leading-relaxed line-clamp-2 mt-1.5">
                        {tool.tagline || tool.description}
                      </p>
                    </div>

                    {/* Key Capabilities Pills */}
                    {safeArray(tool.keyFeatures).length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {safeArray(tool.keyFeatures).slice(0, 2).map((feat, i) => (
                          <span
                            key={i}
                            className="text-[10px] px-2.5 py-1 rounded-lg bg-black/[0.03] dark:bg-white/[0.04] text-[#5F6368] dark:text-zinc-400 border border-black/[0.04] dark:border-white/[0.05] line-clamp-1"
                          >
                            {feat}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Bottom Row: Actions */}
                  <div className="pt-5 mt-6 border-t border-black/[0.06] dark:border-white/[0.06] flex items-center justify-between text-xs font-sans">
                    <Link
                      href={`/tool/${toolSlug}`}
                      className="inline-flex items-center gap-1.5 text-[#4285F4] dark:text-[#8AB4F8] hover:underline transition-colors font-medium"
                    >
                      <span>Explore specs</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    {tool.officialUrl && (
                      <a
                        href={tool.officialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[#5F6368] dark:text-zinc-400 hover:text-[#1F1F1F] dark:hover:text-white transition-colors"
                      >
                        <span>Visit</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
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
