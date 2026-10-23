"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight, ArrowRight, Sparkles, Layers, Cpu } from "lucide-react";
import OptimusLogo from "@/components/OptimusLogo";

interface HeroProps {
  siteName?: string;
  headline?: string;
  tagline?: string;
  badgeText?: string;
  themeAccent?: string;
}

export default function DeepMindHero({
  siteName = "Optimus Prime",
  headline = "The Global AI Models, Tools & Daily Intelligence Index",
  tagline = "Autonomous frontier intelligence platform tracking real-time model breakthroughs, agentic IDEs, and 100+ verified AI ecosystems.",
  badgeText = "Frontier Intelligence Index • 2026 Telemetry",
}: HeroProps) {
  return (
    <section className="relative pt-[148px] pb-20 px-6 overflow-hidden bg-white dark:bg-[#060608] text-center transition-colors duration-300">
      {/* Google Gemini Aurora Flow Radial Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[640px] opacity-70 dark:opacity-40 transition-opacity"
        style={{
          background:
            "radial-gradient(60% 55% at 50% 0%, rgba(66, 133, 244, 0.22) 0%, rgba(155, 114, 203, 0.18) 35%, rgba(217, 101, 112, 0.1) 70%, transparent 100%)",
        }}
      />

      <div className="relative z-10 max-w-[980px] mx-auto flex flex-col items-center">
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F0F4F9] dark:bg-white/[0.06] border border-black/[0.06] dark:border-white/[0.08] text-xs font-medium text-[#5F6368] dark:text-[#8E9196] mb-8 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-[#4285F4] animate-pulse" />
          <span>{badgeText}</span>
        </div>

        {/* Display Title */}
        <h1 className="text-[clamp(2.75rem,6.5vw,5.25rem)] font-heading font-normal tracking-[-0.03em] leading-[1.08] text-[#1F1F1F] dark:text-white">
          {headline}
        </h1>

        {/* Calm Editorial Subtitle */}
        <p className="mt-6 text-[clamp(1.1rem,1.9vw,1.35rem)] font-sans text-[#5F6368] dark:text-[#8E9196] max-w-[760px] leading-[1.5] tracking-[-0.01em]">
          {tagline}
        </p>

        {/* Primary Action Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/models"
            className="px-6 py-3.5 rounded-full bg-[#1F1F1F] dark:bg-white text-white dark:text-[#1F1F1F] hover:bg-[#333] dark:hover:bg-zinc-200 text-[14px] font-medium transition-all flex items-center gap-2 shadow-md hover:scale-[1.02]"
          >
            <span>Explore All AI Models</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/ecosystems"
            className="px-6 py-3.5 rounded-full bg-[#F0F4F9] dark:bg-[#131314] hover:bg-black/[0.06] dark:hover:bg-white/[0.08] border border-black/[0.08] dark:border-white/[0.12] text-[14px] font-medium text-[#1F1F1F] dark:text-white transition-all flex items-center gap-2"
          >
            <span>Company Ecosystems</span>
            <Layers className="w-4 h-4 text-[#4285F4]" />
          </Link>

          <Link
            href="/news"
            className="px-6 py-3.5 rounded-full bg-[#F0F4F9] dark:bg-[#131314] hover:bg-black/[0.06] dark:hover:bg-white/[0.08] border border-black/[0.08] dark:border-white/[0.12] text-[14px] font-medium text-[#1F1F1F] dark:text-white transition-all flex items-center gap-2"
          >
            <span>Daily AI Wire</span>
            <ArrowUpRight className="w-4 h-4 text-[#9B72CB]" />
          </Link>
        </div>

        {/* Section Quick Jump Anchors */}
        <div className="mt-16 inline-flex items-center gap-1 p-1.5 rounded-full bg-[#F0F4F9]/90 dark:bg-[#131314]/90 backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.08] text-xs">
          <a
            href="#hands-on"
            className="px-4 py-1.5 rounded-full text-[#1F1F1F] dark:text-white bg-white dark:bg-white/[0.1] shadow-sm transition font-medium"
          >
            Latest News
          </a>
          <a
            href="#ecosystems"
            className="px-4 py-1.5 rounded-full text-[#5F6368] dark:text-[#8E9196] hover:text-[#1F1F1F] dark:hover:text-white transition font-medium"
          >
            Ecosystems
          </a>
          <a
            href="#featured"
            className="px-4 py-1.5 rounded-full text-[#5F6368] dark:text-[#8E9196] hover:text-[#1F1F1F] dark:hover:text-white transition font-medium"
          >
            Featured Models
          </a>
          <Link
            href="/about"
            className="px-4 py-1.5 rounded-full text-[#5F6368] dark:text-[#8E9196] hover:text-[#1F1F1F] dark:hover:text-white transition font-medium"
          >
            About
          </Link>
        </div>
      </div>
    </section>
  );
}

export { DeepMindHero };
