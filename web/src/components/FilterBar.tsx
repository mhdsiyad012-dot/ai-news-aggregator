"use client";

import React from "react";
import { Search, X, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { DirectoryCategory, CompanyFilter } from "@/lib/types";

export const ECOSYSTEMS_LIST: CompanyFilter[] = [
  "All Companies",
  "Anthropic",
  "Cohere",
  "Creative & Editing Specialists",
  "DeepSeek",
  "Developer & Search Leaders",
  "Google",
  "Meta",
  "Microsoft & GitHub",
  "Mistral",
  "OpenAI",
  "Open Source & Independent",
  "Perplexity",
  "Vercel",
  "xAI",
];

export const CATEGORIES_LIST: DirectoryCategory[] = [
  "All Purpose",
  "Conversational & Reasoning LLMs",
  "Coding & Autonomous Agents",
  "UI/UX & Product Design AI",
  "Video & Image Editing AI",
  "Audio, Voice & Music AI",
  "Research & Search Engines",
  "Workflow & Automation",
];

export const PRICING_LIST = [
  "All Pricing",
  "Free",
  "Freemium",
  "Open Source",
  "Paid",
] as const;

export type PricingFilter = (typeof PRICING_LIST)[number];
export type SortOption = "featured" | "name" | "company" | "latest";

export interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCompany: CompanyFilter;
  onCompanyChange: (c: CompanyFilter) => void;
  selectedCategory: DirectoryCategory;
  onCategoryChange: (cat: DirectoryCategory) => void;
  selectedPricing: PricingFilter;
  onPricingChange: (p: PricingFilter) => void;
  sortBy: SortOption;
  onSortChange: (s: SortOption) => void;
  totalCount: number;
  filteredCount: number;
  onClearFilters: () => void;
}

export default function FilterBar({
  searchQuery,
  onSearchChange,
  selectedCompany,
  onCompanyChange,
  selectedCategory,
  onCategoryChange,
  selectedPricing,
  onPricingChange,
  sortBy,
  onSortChange,
  totalCount,
  filteredCount,
  onClearFilters,
}: FilterBarProps) {
  const isFiltered =
    searchQuery.trim() !== "" ||
    selectedCompany !== "All Companies" ||
    selectedCategory !== "All Purpose" ||
    selectedPricing !== "All Pricing";

  return (
    <div className="w-full space-y-4">
      {/* 1. Main Structured Command / Control Bar */}
      <div className="p-2 sm:p-2.5 rounded-2xl bg-[#11131A] border border-white/[0.08] shadow-2xl flex flex-col lg:flex-row gap-2.5 items-stretch lg:items-center">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9AA0A6]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search AI model, company, or capability (e.g. Gemini, Stitch, agent)..."
            className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-black/40 border border-white/[0.06] text-sm text-white placeholder-[#9AA0A6] focus:outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] transition-all font-sans"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9AA0A6] hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Dropdowns Container */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2">
          {/* Ecosystem Dropdown (A-Z) */}
          <div className="relative">
            <select
              value={selectedCompany}
              onChange={(e) => onCompanyChange(e.target.value as CompanyFilter)}
              className="w-full sm:w-auto appearance-none bg-black/40 border border-white/[0.08] text-xs sm:text-sm text-white rounded-xl px-3.5 py-2.5 pr-8 focus:outline-none focus:border-[#6366F1] cursor-pointer font-sans"
            >
              {ECOSYSTEMS_LIST.map((c) => (
                <option key={c} value={c} className="bg-[#11131A] text-white">
                  {c === "All Companies" ? "All Ecosystems (A–Z)" : c}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9AA0A6] text-xs">
              ▾
            </div>
          </div>

          {/* Category Dropdown */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value as DirectoryCategory)}
              className="w-full sm:w-auto appearance-none bg-black/40 border border-white/[0.08] text-xs sm:text-sm text-white rounded-xl px-3.5 py-2.5 pr-8 focus:outline-none focus:border-[#6366F1] cursor-pointer font-sans"
            >
              {CATEGORIES_LIST.map((cat) => (
                <option key={cat} value={cat} className="bg-[#11131A] text-white">
                  {cat === "All Purpose" ? "All Categories" : cat}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9AA0A6] text-xs">
              ▾
            </div>
          </div>

          {/* Pricing Dropdown */}
          <div className="relative">
            <select
              value={selectedPricing}
              onChange={(e) => onPricingChange(e.target.value as PricingFilter)}
              className="w-full sm:w-auto appearance-none bg-black/40 border border-white/[0.08] text-xs sm:text-sm text-white rounded-xl px-3.5 py-2.5 pr-8 focus:outline-none focus:border-[#6366F1] cursor-pointer font-sans"
            >
              {PRICING_LIST.map((p) => (
                <option key={p} value={p} className="bg-[#11131A] text-white">
                  {p}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9AA0A6] text-xs">
              ▾
            </div>
          </div>

          {/* Sort By Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="w-full sm:w-auto appearance-none bg-black/40 border border-white/[0.08] text-xs sm:text-sm text-white rounded-xl px-3.5 py-2.5 pr-8 focus:outline-none focus:border-[#6366F1] cursor-pointer font-sans"
            >
              <option value="featured" className="bg-[#11131A] text-white">
                Sort: Featured
              </option>
              <option value="name" className="bg-[#11131A] text-white">
                Sort: A–Z
              </option>
              <option value="company" className="bg-[#11131A] text-white">
                Sort: Ecosystem
              </option>
              <option value="latest" className="bg-[#11131A] text-white">
                Sort: Latest
              </option>
            </select>
            <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9AA0A6] text-xs">
              ▾
            </div>
          </div>
        </div>
      </div>

      {/* 2. Quick Filter Category Strip + Reset Button */}
      <div className="flex items-center justify-between gap-3 overflow-x-auto pb-1 text-xs">
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[#9AA0A6] text-[11px] uppercase tracking-wider font-mono mr-1 hidden sm:inline">
            Quick Filter:
          </span>
          {CATEGORIES_LIST.slice(0, 7).map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onCategoryChange(cat)}
                className={`px-3 py-1.5 rounded-full transition-all whitespace-nowrap text-xs font-medium ${
                  isActive
                    ? "bg-[#6366F1] text-white shadow-[0_0_12px_rgba(99,102,241,0.4)]"
                    : "bg-white/[0.04] text-[#9AA0A6] hover:text-white hover:bg-white/[0.08] border border-white/[0.05]"
                }`}
              >
                {cat === "All Purpose" ? "All" : cat}
              </button>
            );
          })}
        </div>

        {/* Clear Filters Indicator */}
        <div className="flex items-center gap-2.5 shrink-0">
          <span className="text-[#9AA0A6] font-mono text-[11px]">
            Showing <strong className="text-white">{filteredCount}</strong> of {totalCount} systems
          </span>
          {isFiltered && (
            <button
              onClick={onClearFilters}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500/20 text-[11px] font-medium border border-red-500/20 transition-all"
            >
              <X className="w-3 h-3" />
              <span>Clear filters</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
