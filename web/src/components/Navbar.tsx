"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Terminal, Newspaper, Cpu, Search, Layers, Shield } from "lucide-react";

interface NavbarProps {
  activeTab: "wire" | "directory";
  setActiveTab: (tab: "wire" | "directory") => void;
  onOpenSearch: () => void;
  selectedCompareCount: number;
  onOpenCompare: () => void;
  articlesCount: number;
  directoryCount: number;
}

export function Navbar({
  activeTab,
  setActiveTab,
  onOpenSearch,
  selectedCompareCount,
  onOpenCompare,
  articlesCount,
  directoryCount,
}: NavbarProps) {
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZoneName: "short",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#27272A] bg-[#09090B]/95 backdrop-blur-md">
      {/* Top telemetry ticker strip */}
      <div className="hidden md:flex items-center justify-between px-4 py-1 border-b border-[#1F1F23] bg-[#0C0C0E] text-[11px] font-mono text-[#A1A1AA]">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[#FAFAFA] font-semibold tracking-wider">PIPELINE: ACTIVE</span>
          </div>
          <span className="text-[#3F3F46]">/</span>
          <span>CRON: 07:30 IST DAILY</span>
          <span className="text-[#3F3F46]">/</span>
          <span>SUPABASE POSTGRES POOLER</span>
        </div>
        <div className="flex items-center space-x-4 text-[#71717A]">
          <span>INDEXED MODELS: <strong className="text-[#FAFAFA]">{directoryCount}</strong></span>
          <span className="text-[#3F3F46]">/</span>
          <span>WIRE DISPATCHES: <strong className="text-[#FAFAFA]">{articlesCount}</strong></span>
          <span className="text-[#3F3F46]">/</span>
          <span className="text-[#FAFAFA]">{currentTime || "UTC"}</span>
        </div>
      </div>

      {/* Main navigation row */}
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand identity */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="flex h-8 w-8 items-center justify-center border border-[#27272A] bg-[#121215] text-[#FAFAFA] group-hover:border-emerald-500/50 transition-colors">
            <Terminal className="h-4 w-4 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-bold tracking-tight text-[#FAFAFA] uppercase">
                AI INTELLIGENCE WIRE
              </span>
              <span className="border border-[#27272A] bg-[#18181B] px-1.5 py-0.2 text-[10px] font-mono font-medium text-emerald-400">
                v2.0
              </span>
            </div>
            <div className="text-[10px] font-mono text-[#71717A] tracking-wider hidden sm:block">
              INDUSTRIAL OBSERVATORY // AUTONOMOUS REASONING & BUILDERS
            </div>
          </div>
        </Link>

        {/* View Switcher Tabs */}
        <div className="flex items-center border border-[#27272A] bg-[#121215] p-1 text-xs font-mono">
          <button
            onClick={() => setActiveTab("wire")}
            className={`flex items-center space-x-2 px-3 py-1.5 transition-all duration-150 ${
              activeTab === "wire"
                ? "bg-[#27272A] text-white font-semibold shadow-xs"
                : "text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#18181B]"
            }`}
          >
            <Newspaper className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">[01]</span>
            <span>Daily News Wire</span>
            <span className="ml-1 rounded-sm bg-[#121215] px-1.5 py-0.2 text-[10px] text-[#A1A1AA] border border-[#27272A]">
              {articlesCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("directory")}
            className={`flex items-center space-x-2 px-3 py-1.5 transition-all duration-150 ${
              activeTab === "directory"
                ? "bg-[#27272A] text-white font-semibold shadow-xs"
                : "text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#18181B]"
            }`}
          >
            <Cpu className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">[02]</span>
            <span>AI Models & Agents</span>
            <span className="ml-1 rounded-sm bg-[#121215] px-1.5 py-0.2 text-[10px] text-emerald-400 border border-[#27272A]">
              {directoryCount}
            </span>
          </button>
        </div>

        {/* Actions & Utilities */}
        <div className="flex items-center space-x-2">
          {/* Compare dock button */}
          {selectedCompareCount > 0 && (
            <button
              onClick={onOpenCompare}
              className="flex items-center space-x-1.5 border border-emerald-500/40 bg-emerald-950/40 px-2.5 py-1.5 text-xs font-mono text-emerald-300 hover:bg-emerald-900/50 transition-colors"
            >
              <Layers className="h-3.5 w-3.5 text-emerald-400" />
              <span>Compare</span>
              <span className="rounded-xs bg-emerald-400/20 px-1 text-[10px] font-bold text-emerald-300">
                {selectedCompareCount}/3
              </span>
            </button>
          )}

          {/* Quick Search trigger */}
          <button
            onClick={onOpenSearch}
            className="flex items-center space-x-2 border border-[#27272A] bg-[#121215] px-3 py-1.5 text-xs text-[#A1A1AA] hover:border-[#3F3F46] hover:text-[#FAFAFA] transition-colors"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="hidden md:inline font-mono">Search...</span>
            <kbd className="hidden sm:inline-flex items-center border border-[#27272A] bg-[#18181B] px-1.5 py-0.5 text-[10px] font-mono text-[#71717A]">
              Ctrl+K
            </kbd>
          </button>

          {/* Admin Panel Link */}
          <Link
            href="/admin"
            className="flex items-center space-x-1 border border-[#27272A] bg-[#121215] px-2.5 py-1.5 text-xs font-mono text-[#A1A1AA] hover:border-emerald-500/50 hover:text-emerald-400 transition-colors"
            title="Open Admin Control Center"
          >
            <Shield className="h-3.5 w-3.5" />
            <span className="hidden lg:inline">Admin</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
