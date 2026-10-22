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
  Star
} from "lucide-react";
import { AIDirectoryItem, Category } from "@/lib/types";

interface AiDirectoryProps {
  items: AIDirectoryItem[];
  onInspect: (item: AIDirectoryItem) => void;
  selectedCompare: AIDirectoryItem[];
  onToggleCompare: (item: AIDirectoryItem) => void;
  onOpenCompareModal: () => void;
}

const CATEGORIES: Category[] = [
  "All",
  "Code Builders",
  "Antigravity & IDEs",
  "Autonomous Agents",
  "Foundation LLMs",
  "Media Gen",
  "Frameworks",
];

export function AiDirectory({
  items,
  onInspect,
  selectedCompare,
  onToggleCompare,
  onOpenCompareModal,
}: AiDirectoryProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Category filter
      const matchesCategory =
        selectedCategory === "All" || item.primary_category === selectedCategory;

      // Status filter
      const matchesStatus =
        statusFilter === "All" || item.release_status === statusFilter;

      // Search query
      const query = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.creator.toLowerCase().includes(query) ||
        item.short_purpose.toLowerCase().includes(query) ||
        item.tags.some((t) => t.toLowerCase().includes(query)) ||
        item.key_capabilities.some((k) => k.toLowerCase().includes(query));

      return matchesCategory && matchesStatus && matchesQuery;
    });
  }, [items, selectedCategory, statusFilter, searchQuery]);

  const isToolCompared = (slug: string) => {
    return selectedCompare.some((t) => t.slug === slug);
  };

  return (
    <div className="space-y-6">
      {/* Directory Section Header & Filter Controls */}
      <div className="border border-[#27272A] bg-[#121215] p-5 sm:p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-[#A1A1AA] mb-1">
              <span className="h-2 w-2 bg-emerald-400 inline-block"></span>
              <span>TECHNICAL CATALOGUE // VERIFIED ARCHITECTURES & TOOLCHAINS</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#FAFAFA]">
              AI Models, Autonomous Agents & Code Builders Directory
            </h1>
            <p className="text-xs sm:text-sm text-[#A1A1AA] mt-1 max-w-3xl font-sans">
              Comprehensive technical catalogue tracking frontier reasoning architectures, autonomous software engineers, multi-agent frameworks, and multimodal generation engines.
            </p>
          </div>

          {/* Compare status dock badge */}
          {selectedCompare.length > 0 && (
            <div className="flex items-center space-x-2 border border-emerald-500/40 bg-emerald-950/30 p-2 text-xs font-mono">
              <span className="text-emerald-300">
                {selectedCompare.length}/3 tools queued for matrix
              </span>
              <button
                onClick={onOpenCompareModal}
                className="border border-emerald-500/60 bg-emerald-500/20 px-2 py-1 font-bold text-emerald-300 hover:bg-emerald-500/30 transition-colors"
              >
                Launch Matrix →
              </button>
            </div>
          )}
        </div>

        {/* Filter Pills Row */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[#1F1F23]">
          <span className="text-xs font-mono text-[#71717A] mr-2 flex items-center">
            <Filter className="h-3 w-3 mr-1" />
            CATEGORY:
          </span>
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
                className={`flex items-center space-x-1.5 border px-3 py-1.5 text-xs font-mono transition-colors ${
                  isSelected
                    ? "border-white bg-[#27272A] text-white font-semibold"
                    : "border-[#27272A] bg-[#0E0E11] text-[#A1A1AA] hover:border-[#3F3F46] hover:text-[#FAFAFA]"
                }`}
              >
                <span>{cat}</span>
                <span className={`text-[10px] ${isSelected ? "text-emerald-300 font-bold" : "text-[#71717A]"}`}>
                  [{count}]
                </span>
              </button>
            );
          })}
        </div>

        {/* Search bar & status select */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#71717A]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by tool name, creator (DeepMind, Anthropic, OpenAI...), tags, or capability..."
              className="w-full border border-[#27272A] bg-[#09090B] pl-9 pr-4 py-2 text-xs font-mono text-[#FAFAFA] placeholder-[#71717A] focus:border-[#52525B] focus:outline-hidden"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-[#71717A] hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <span className="text-xs font-mono text-[#71717A] shrink-0">STATUS:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-[#27272A] bg-[#09090B] px-3 py-2 text-xs font-mono text-[#FAFAFA] focus:border-[#52525B] focus:outline-hidden"
            >
              <option value="All">All Statuses</option>
              <option value="Generally Available">Generally Available</option>
              <option value="Active Preview">Active Preview</option>
              <option value="Open Source">Open Source</option>
            </select>
          </div>
        </div>
      </div>

      {/* Directory Grid Header */}
      <div className="flex items-center justify-between text-xs font-mono text-[#71717A] px-1">
        <span>SHOWING {filteredItems.length} OF {items.length} TRACKED SYSTEMS</span>
        <span>CLICK CARD TO INSPECT ARCHITECTURAL SPECIFICATIONS</span>
      </div>

      {filteredItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center border border-dashed border-[#27272A] bg-[#121215] p-12 text-center">
          <Cpu className="h-10 w-10 text-[#52525B] mb-3" />
          <p className="text-sm font-semibold text-[#FAFAFA]">No AI models match query parameters</p>
          <p className="text-xs font-mono text-[#71717A] mt-1">
            Try adjusting your search keywords or switching category filters.
          </p>
          <button
            onClick={() => {
              setSelectedCategory("All");
              setSearchQuery("");
              setStatusFilter("All");
            }}
            className="mt-4 border border-[#27272A] bg-[#18181B] px-3 py-1.5 text-xs font-mono text-emerald-400 hover:bg-[#27272A]"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((tool) => {
            const compared = isToolCompared(tool.slug);

            return (
              <div
                key={tool.slug}
                className={`group relative flex flex-col justify-between border bg-[#121215] hover:border-[#3F3F46] hover:bg-[#16161B] transition-all duration-150 p-5 ${
                  tool.is_featured
                    ? "border-emerald-500/40 shadow-xs shadow-emerald-500/5"
                    : "border-[#27272A]"
                }`}
              >
                {/* Card Top: Badges */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center space-x-1.5">
                      <span className="border border-[#27272A] bg-[#18181B] px-2 py-0.5 text-[10px] font-mono font-medium text-emerald-400">
                        {tool.primary_category}
                      </span>
                      {tool.is_featured && (
                        <span className="flex items-center space-x-0.5 border border-emerald-500/50 bg-emerald-500/20 px-1.5 py-0.5 text-[9px] font-mono font-bold text-emerald-400">
                          <Star className="h-2.5 w-2.5 fill-emerald-400 text-emerald-400" />
                          <span>FEATURED</span>
                        </span>
                      )}
                    </div>

                    <span className="border border-[#27272A] bg-[#0E0E11] px-1.5 py-0.5 text-[9px] font-mono text-[#71717A]">
                      {tool.release_status}
                    </span>
                  </div>

                  {/* Title & Creator */}
                  <h3 className="text-lg font-bold tracking-tight text-white group-hover:text-emerald-300 transition-colors">
                    {tool.name}
                  </h3>
                  <div className="text-xs font-mono text-[#A1A1AA] mt-0.5">
                    by <span className="text-[#FAFAFA] font-medium">{tool.creator}</span>
                  </div>

                  {/* Short Purpose */}
                  <p className="mt-3 text-xs text-[#A1A1AA] leading-relaxed line-clamp-3">
                    {tool.short_purpose}
                  </p>

                  {/* Capabilities Preview Snippet */}
                  <div className="mt-4 space-y-1.5 border-t border-[#1F1F23] pt-3">
                    {tool.key_capabilities.slice(0, 2).map((cap, i) => (
                      <div key={i} className="flex items-start space-x-1.5 text-[11px] text-[#D4D4D8]">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400/80 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{cap}</span>
                      </div>
                    ))}
                  </div>

                  {/* Tags */}
                  <div className="mt-4 flex flex-wrap gap-1">
                    {tool.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="border border-[#27272A] bg-[#0E0E11] px-1.5 py-0.5 text-[10px] font-mono text-[#71717A]"
                      >
                        #{tag}
                      </span>
                    ))}
                    {tool.tags.length > 3 && (
                      <span className="text-[10px] font-mono text-[#52525B] px-1 py-0.5">
                        +{tool.tags.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Bottom: Pricing & Actions */}
                <div className="mt-5 pt-3 border-t border-[#1F1F23]">
                  <div className="text-[11px] font-mono text-emerald-400/90 truncate mb-3">
                    {tool.pricing_model}
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <button
                      onClick={() => onInspect(tool)}
                      className="flex-1 flex items-center justify-center space-x-1 border border-[#27272A] bg-[#18181B] py-1.5 text-xs font-mono font-medium text-[#FAFAFA] hover:bg-[#27272A] hover:border-[#3F3F46] transition-colors"
                    >
                      <span>Inspect Specs</span>
                      <ArrowRight className="h-3 w-3 text-emerald-400" />
                    </button>

                    <button
                      onClick={() => onToggleCompare(tool)}
                      className={`flex items-center space-x-1 border px-2.5 py-1.5 text-xs font-mono transition-colors ${
                        compared
                          ? "border-emerald-500/60 bg-emerald-950/40 text-emerald-300"
                          : "border-[#27272A] bg-[#121215] text-[#71717A] hover:text-[#FAFAFA] hover:border-[#3F3F46]"
                      }`}
                      title="Add to side-by-side comparison"
                    >
                      <Layers className="h-3 w-3" />
                      <span>{compared ? "Added" : "+"}</span>
                    </button>

                    <a
                      href={tool.official_url}
                      target="_blank"
                      rel="noreferrer"
                      className="border border-[#27272A] bg-[#121215] p-1.5 text-[#71717A] hover:text-white hover:border-[#3F3F46] transition-colors"
                      title="Launch official site"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
