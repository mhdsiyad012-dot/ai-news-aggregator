"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";

interface FloatingNavPillProps {
  activeSection?: string;
}

export function FloatingNavPill({ activeSection = "latest" }: FloatingNavPillProps) {
  const [isDocked, setIsDocked] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Docks floating pill when scrolled past 260px
      setIsDocked(window.scrollY > 260);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`z-40 transition-all duration-300 w-full flex justify-center ${
        isDocked
          ? "fixed top-5 left-0 px-4 pointer-events-none"
          : "relative py-4 pointer-events-auto"
      }`}
    >
      <nav
        aria-label="Section navigation"
        className={`pointer-events-auto inline-flex items-center gap-1 sm:gap-2 px-3 py-1.5 sm:py-2 rounded-full bg-[#161922]/90 backdrop-blur-2xl border border-white/[0.1] shadow-2xl transition-all duration-300 ${
          isDocked ? "scale-95 sm:scale-100" : ""
        }`}
      >
        {/* Left Pill Label */}
        <div className="flex items-center gap-2 pl-2 pr-3 border-r border-white/[0.08]">
          <span className="w-2 h-2 rounded-full bg-[#8AB4F8]" />
          <span className="font-heading text-xs sm:text-sm font-medium text-white tracking-tight hidden md:inline">
            Optimus Prime
          </span>
        </div>

        {/* Center Anchor / Route Pills */}
        <div className="flex items-center gap-1 font-sans text-xs">
          <a
            href="#latest"
            className="px-3 py-1.5 rounded-full text-zinc-300 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            Explore Latest
          </a>

          <a
            href="#ecosystems"
            className="px-3 py-1.5 rounded-full text-zinc-300 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            AI Ecosystems
          </a>

          <Link
            href="/directory?category=Coding%20%26%20Autonomous%20Agents"
            className="px-3 py-1.5 rounded-full text-zinc-300 hover:text-white hover:bg-white/[0.06] transition-colors hidden sm:inline-block"
          >
            Engineering &amp; Code
          </Link>

          <Link
            href="/directory"
            className="px-3 py-1.5 rounded-full text-zinc-300 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            All 45+ Models
          </Link>
        </div>

        {/* Right CTA inside bar */}
        <div className="pl-1">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-[#8AB4F8] hover:bg-[#A8C7FA] text-black font-medium text-xs transition-all shadow-sm"
          >
            <span>Admin Console</span>
            <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
      </nav>
    </div>
  );
}
