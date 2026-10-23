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
  badgeText = "Frontier Intelligence Index • 24/7 Autonomous Verification",
}: HeroProps) {
  return (
    <section className="relative pt-[148px] pb-20 px-6 overflow-hidden bg-black text-center">
      {/* DeepMind / Aurora Radial Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[580px]"
        style={{
          background:
            "radial-gradient(60% 55% at 50% 0%, rgba(99, 102, 241, 0.25) 0%, rgba(6, 182, 212, 0.12) 40%, rgba(0, 0, 0, 0) 100%)",
        }}
      />

      <div className="relative z-10 max-w-[980px] mx-auto flex flex-col items-center">
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.08] text-xs font-mono text-[#9AA0A6] mb-8">
          <span className="w-2 h-2 rounded-full bg-[#38BDF8] animate-pulse" />
          <span>{badgeText}</span>
        </div>

        {/* Display Title */}
        <h1 className="text-[clamp(2.75rem,6.5vw,5.25rem)] font-heading font-normal tracking-[-0.03em] leading-[1.08] text-white">
          {headline}
        </h1>

        {/* Calm Editorial Subtitle */}
        <p className="mt-6 text-[clamp(1.1rem,1.9vw,1.4rem)] font-sans text-[#9AA0A6] max-w-[760px] leading-[1.5] tracking-[-0.01em]">
          {tagline}
        </p>

        {/* Primary Action Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/models"
            className="px-6 py-3.5 rounded-full bg-white text-black hover:bg-zinc-200 text-[14px] font-medium transition-all flex items-center gap-2 shadow-lg"
          >
            <span>Explore All AI Models</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/ecosystems"
            className="px-6 py-3.5 rounded-full bg-[#161822] hover:bg-[#1E2230] border border-white/[0.12] hover:border-white/[0.24] text-[14px] font-medium text-white transition-all flex items-center gap-2"
          >
            <span>Company Trees</span>
            <Layers className="w-4 h-4 text-[#38BDF8]" />
          </Link>

          <Link
            href="/news"
            className="px-6 py-3.5 rounded-full bg-[#161822] hover:bg-[#1E2230] border border-white/[0.12] hover:border-white/[0.24] text-[14px] font-medium text-white transition-all flex items-center gap-2"
          >
            <span>Daily AI Wire</span>
            <ArrowUpRight className="w-4 h-4 text-[#818CF8]" />
          </Link>
        </div>

        {/* Section Quick Jump Anchors */}
        <div className="mt-16 inline-flex items-center gap-1 p-1.5 rounded-full bg-[#11131A]/90 backdrop-blur-xl border border-white/[0.08] text-xs">
          <a
            href="#hands-on"
            className="px-4 py-1.5 rounded-full text-white bg-white/[0.1] transition font-medium"
          >
            Latest News
          </a>
          <a
            href="#ecosystems"
            className="px-4 py-1.5 rounded-full text-[#9AA0A6] hover:text-white transition font-medium"
          >
            Ecosystems
          </a>
          <a
            href="#featured"
            className="px-4 py-1.5 rounded-full text-[#9AA0A6] hover:text-white transition font-medium"
          >
            Featured Models
          </a>
          <Link
            href="/about"
            className="px-4 py-1.5 rounded-full text-[#9AA0A6] hover:text-white transition font-medium"
          >
            About
          </Link>
        </div>
      </div>
    </section>
  );
}

export { DeepMindHero };
