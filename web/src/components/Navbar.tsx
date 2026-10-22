"use client";

import React from "react";
import Link from "next/link";
import { 
  Sparkles, 
  Cpu, 
  Newspaper, 
  Layers, 
  Bookmark, 
  Search 
} from "lucide-react";

interface NavbarProps {
  activeTab: "directory" | "wire" | "library";
  setActiveTab: (tab: "directory" | "wire" | "library") => void;
  onOpenSearch: () => void;
  selectedCompareCount: number;
  onOpenCompare: () => void;
  articlesCount: number;
  directoryCount: number;
  savedCount: number;
}

export function Navbar({
  activeTab,
  setActiveTab,
  onOpenSearch,
  selectedCompareCount,
  onOpenCompare,
  articlesCount,
  directoryCount,
  savedCount,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#0A0A0C]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand identity: PulseAI */}
        <button
          onClick={() => setActiveTab("directory")}
          className="flex items-center space-x-3 text-left group"
        >
          {/* Custom SVG Brand Mark */}
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-[1px] shadow-lg shadow-emerald-500/10">
            <div className="flex h-full w-full items-center justify-center rounded-[11px] bg-[#0A0A0C]">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-emerald-400 group-hover:scale-110 transition-transform duration-200"
              >
                <path
                  d="M3 12H7L10 3L14 21L17 12H21"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span className="text-base font-bold tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                PulseAI
              </span>
              <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
                PRO
              </span>
            </div>
            <div className="text-[11px] text-zinc-400 tracking-normal hidden sm:block">
              AI Models, Agents & Daily Intelligence
            </div>
          </div>
        </button>

        {/* Center Segmented Navigation Pills */}
        <nav className="hidden lg:flex items-center rounded-xl border border-white/[0.08] bg-[#121318]/90 p-1 shadow-sm">
          <button
            onClick={() => setActiveTab("directory")}
            className={`flex items-center space-x-2 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
              activeTab === "directory"
                ? "bg-white text-zinc-950 shadow-xs"
                : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
            }`}
          >
            <Cpu className="h-3.5 w-3.5" />
            <span>Explore AI Directory</span>
            <span
              className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                activeTab === "directory"
                  ? "bg-zinc-200 text-zinc-900 font-semibold"
                  : "bg-white/[0.08] text-zinc-400"
              }`}
            >
              {directoryCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("wire")}
            className={`flex items-center space-x-2 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
              activeTab === "wire"
                ? "bg-white text-zinc-950 shadow-xs"
                : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
            }`}
          >
            <Newspaper className="h-3.5 w-3.5" />
            <span>Daily Tech Wire</span>
            <span
              className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                activeTab === "wire"
                  ? "bg-zinc-200 text-zinc-900 font-semibold"
                  : "bg-white/[0.08] text-zinc-400"
              }`}
            >
              {articlesCount}
            </span>
          </button>

          <button
            onClick={onOpenCompare}
            className={`flex items-center space-x-2 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
              selectedCompareCount > 0
                ? "text-emerald-400 hover:bg-emerald-500/10"
                : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>Compare Tools</span>
            {selectedCompareCount > 0 && (
              <span className="rounded-full bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.2 text-[10px]">
                {selectedCompareCount}/3
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("library")}
            className={`flex items-center space-x-2 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
              activeTab === "library"
                ? "bg-white text-zinc-950 shadow-xs"
                : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
            }`}
          >
            <Bookmark className="h-3.5 w-3.5" />
            <span>Saved Library</span>
            {savedCount > 0 && (
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                  activeTab === "library"
                    ? "bg-zinc-200 text-zinc-900 font-semibold"
                    : "bg-emerald-500/20 text-emerald-400 font-semibold"
                }`}
              >
                {savedCount}
              </span>
            )}
          </button>
        </nav>

        {/* Right Area: Sleek Global Search Trigger */}
        <div className="flex items-center space-x-2">
          {/* Mobile switcher for small screens */}
          <div className="flex lg:hidden items-center rounded-lg border border-white/[0.08] bg-[#121318] p-1 text-xs">
            <button
              onClick={() => setActiveTab("directory")}
              className={`p-1.5 rounded-md ${activeTab === "directory" ? "bg-white text-zinc-950" : "text-zinc-400"}`}
              title="AI Models"
            >
              <Cpu className="h-4 w-4" />
            </button>
            <button
              onClick={() => setActiveTab("wire")}
              className={`p-1.5 rounded-md ${activeTab === "wire" ? "bg-white text-zinc-950" : "text-zinc-400"}`}
              title="Tech Wire"
            >
              <Newspaper className="h-4 w-4" />
            </button>
            <button
              onClick={() => setActiveTab("library")}
              className={`p-1.5 rounded-md relative ${activeTab === "library" ? "bg-white text-zinc-950" : "text-zinc-400"}`}
              title="Saved Library"
            >
              <Bookmark className="h-4 w-4" />
              {savedCount > 0 && (
                <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-emerald-400" />
              )}
            </button>
          </div>

          <button
            onClick={onOpenSearch}
            className="flex items-center space-x-2.5 rounded-xl border border-white/[0.08] bg-[#121318] px-3.5 py-2 text-xs text-zinc-400 hover:border-white/20 hover:text-white hover:bg-[#181A20] transition-all shadow-sm"
          >
            <Search className="h-3.5 w-3.5 text-zinc-400" />
            <span className="hidden md:inline font-sans text-zinc-400">
              Search models, agents, companies, or news...
            </span>
            <span className="inline md:hidden font-sans text-zinc-400">Search...</span>
            <kbd className="hidden sm:inline-flex items-center rounded-md border border-white/[0.1] bg-white/[0.05] px-1.5 py-0.5 text-[10px] font-mono text-zinc-400">
              ⌘K
            </kbd>
          </button>
        </div>
      </div>
    </header>
  );
}
