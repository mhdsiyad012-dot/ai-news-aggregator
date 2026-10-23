"use client";

import React from "react";
import { Search, X, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { DirectoryCategory, CompanyFilter } from "@/lib/types";

export const ECOSYSTEMS_LIST: CompanyFilter[] = [
  "All Companies",
  "Google",
  "OpenAI",
  "Anthropic",
  "Meta",
  "xAI",
  "DeepSeek",
  "Alibaba",
  "Moonshot AI",
  "Zhipu AI",
  "MiniMax",
  "Mistral AI",
  "Anysphere",
  "Cognition",
  "Vercel",
  "Perplexity AI",
  "Hugging Face",
  "Black Forest Labs",
  "Runway",
  "ElevenLabs",
  "Cohere",
];

export const CATEGORIES_LIST: DirectoryCategory[] = [
  "All Purpose",
  "Conversational & Reasoning LLMs",
  "Coding & Autonomous Agents",
  "UI/UX & Product Design AI",
  "Video & Image Editing AI",
  "Audio & Speech AI",
  "Research & Search Engines",
  "Workflow & Enterprise Automation",
];

export const PRICING_LIST = [
  "All Pricing",
  "Free",
  "Freemium",
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
      {/* 1. Main Structured Control Bar */}
      <div className="p-2 sm:p-2.5 rounded-2xl bg-[#F0F4F9] dark:bg-[#131314] border border-black/[0.08] dark:border-white/[0.08] shadow-sm flex flex-col lg:flex-row gap-2.5 items-stretch lg:items-center">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5F6368] dark:text-[#8E9196]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search AI model, company, or capability (e.g. Gemini, Antigravity, Claude)..."
            className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-white dark:bg-[#1A1D24] border border-black/[0.08] dark:border-white/[0.08] text-xs sm:text-sm text-[#1F1F1F] dark:text-white placeholder-[#5F6368] dark:placeholder-[#8E9196] focus:outline-none focus:border-[#4285F4] transition-all font-sans"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5F6368] dark:text-[#8E9196] hover:text-[#1F1F1F] dark:hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Dropdowns Container */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2">
          {/* Ecosystem Dropdown */}
          <div className="relative">
            <select
              value={selectedCompany}
              onChange={(e) => onCompanyChange(e.target.value as CompanyFilter)}
              className="w-full sm:w-auto appearance-none bg-white dark:bg-[#1A1D24] border border-black/[0.08] dark:border-white/[0.08] text-xs sm:text-sm text-[#1F1F1F] dark:text-white rounded-xl px-3.5 py-2.5 pr-8 focus:outline-none focus:border-[#4285F4] cursor-pointer font-sans"
            >
              {ECOSYSTEMS_LIST.map((c) => (
                <option key={c} value={c} className="bg-white dark:bg-[#1A1D24] text-[#1F1F1F] dark:text-white">
                  {c === "All Companies" ? "All Ecosystems" : c}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#5F6368] dark:text-[#8E9196] text-xs">
              ▾
            </div>
          </div>

          {/* Category Dropdown */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value as DirectoryCategory)}
              className="w-full sm:w-auto appearance-none bg-white dark:bg-[#1A1D24] border border-black/[0.08] dark:border-white/[0.08] text-xs sm:text-sm text-[#1F1F1F] dark:text-white rounded-xl px-3.5 py-2.5 pr-8 focus:outline-none focus:border-[#4285F4] cursor-pointer font-sans"
            >
              {CATEGORIES_LIST.map((cat) => (
                <option key={cat} value={cat} className="bg-white dark:bg-[#1A1D24] text-[#1F1F1F] dark:text-white">
                  {cat === "All Purpose" ? "All Categories" : cat}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#5F6368] dark:text-[#8E9196] text-xs">
              ▾
            </div>
          </div>

          {/* Pricing Dropdown */}
          <div className="relative">
            <select
              value={selectedPricing}
              onChange={(e) => onPricingChange(e.target.value as PricingFilter)}
              className="w-full sm:w-auto appearance-none bg-white dark:bg-[#1A1D24] border border-black/[0.08] dark:border-white/[0.08] text-xs sm:text-sm text-[#1F1F1F] dark:text-white rounded-xl px-3.5 py-2.5 pr-8 focus:outline-none focus:border-[#4285F4] cursor-pointer font-sans"
            >
              {PRICING_LIST.map((p) => (
                <option key={p} value={p} className="bg-white dark:bg-[#1A1D24] text-[#1F1F1F] dark:text-white">
                  {p}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#5F6368] dark:text-[#8E9196] text-xs">
              ▾
            </div>
          </div>

          {/* Sort By Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="w-full sm:w-auto appearance-none bg-white dark:bg-[#1A1D24] border border-black/[0.08] dark:border-white/[0.08] text-xs sm:text-sm text-[#1F1F1F] dark:text-white rounded-xl px-3.5 py-2.5 pr-8 focus:outline-none focus:border-[#4285F4] cursor-pointer font-sans"
            >
              <option value="featured" className="bg-white dark:bg-[#1A1D24] text-[#1F1F1F] dark:text-white">
                Sort: Featured
              </option>
              <option value="name" className="bg-white dark:bg-[#1A1D24] text-[#1F1F1F] dark:text-white">
                Sort: A–Z
              </option>
              <option value="company" className="bg-white dark:bg-[#1A1D24] text-[#1F1F1F] dark:text-white">
                Sort: Ecosystem
              </option>
              <option value="latest" className="bg-white dark:bg-[#1A1D24] text-[#1F1F1F] dark:text-white">
                Sort: Latest
              </option>
            </select>
            <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#5F6368] dark:text-[#8E9196] text-xs">
              ▾
            </div>
          </div>
        </div>
      </div>

      {/* 2. Quick Filter Category Strip + Reset Button */}
      <div className="flex items-center justify-between gap-3 overflow-x-auto pb-1 text-xs">
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[#5F6368] dark:text-[#8E9196] text-[11px] font-medium mr-1 hidden sm:inline">
            Quick Filter:
          </span>
          {CATEGORIES_LIST.slice(0, 7).map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onCategoryChange(cat)}
                className={`px-3.5 py-1.5 rounded-full transition-all whitespace-nowrap text-xs font-medium ${
                  isActive
                    ? "bg-[#4285F4] text-white shadow-sm"
                    : "bg-[#F0F4F9] dark:bg-white/[0.05] text-[#5F6368] dark:text-[#8E9196] hover:text-[#1F1F1F] dark:hover:text-white border border-black/[0.06] dark:border-white/[0.06]"
                }`}
              >
                {cat === "All Purpose" ? "All" : cat}
              </button>
            );
          })}
        </div>

        {/* Clear Filters Indicator */}
        <div className="flex items-center gap-2.5 shrink-0">
          <span className="text-[#5F6368] dark:text-[#8E9196] text-[11px]">
            Showing <strong className="text-[#1F1F1F] dark:text-white">{filteredCount}</strong> of {totalCount} systems
          </span>
          {isFiltered && (
            <button
              onClick={onClearFilters}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 text-[11px] font-medium border border-red-500/20 transition-all"
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
