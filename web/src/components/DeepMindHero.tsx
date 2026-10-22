"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";

export default function DeepMindHero() {
  return (
    <section className="relative pt-[136px] pb-20 px-6 overflow-hidden bg-black text-center">
      {/* DeepMind Signature Radial Celestial Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[560px]"
        style={{
          background:
            "radial-gradient(60% 55% at 50% 0%, rgba(66, 133, 244, 0.22) 0%, rgba(155, 114, 203, 0.09) 48%, rgba(0, 0, 0, 0) 100%)",
        }}
      />

      <div className="relative z-10 max-w-[960px] mx-auto flex flex-col items-center">
        {/* Main Display Title (Matches "Gemini 4 Argon" display weight & scale) */}
        <h1 className="text-[clamp(3.25rem,7.2vw,5.75rem)] font-normal tracking-[-0.03em] leading-[1.06] text-white">
          Optimus Prime
        </h1>

        {/* Calm Editorial Subtitle */}
        <p className="mt-6 text-[clamp(1.2rem,2.1vw,1.625rem)] font-normal text-[#9AA0A6] max-w-[740px] leading-[1.4] tracking-[-0.01em]">
          Our next era of frontier AI intelligence, built to track breaking model releases and every AI system.
        </p>

        {/* DeepMind 3-Pill Action Row ("Try in Gemini | Try in Google AI Studio | Try in Google Antigravity" Replica) */}
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#hands-on"
            className="px-6 py-3 rounded-full bg-[#16181F] hover:bg-[#1F232D] border border-white/[0.12] hover:border-white/[0.24] text-[14px] font-medium text-white transition-all flex items-center gap-2"
          >
            <span>Explore Daily AI News</span>
            <ArrowUpRight className="w-4 h-4 text-[#8AB4F8]" />
          </a>

          <a
            href="#directory"
            className="px-6 py-3 rounded-full bg-[#16181F] hover:bg-[#1F232D] border border-white/[0.12] hover:border-white/[0.24] text-[14px] font-medium text-white transition-all flex items-center gap-2"
          >
            <span>Browse 45+ AI Systems</span>
            <ArrowUpRight className="w-4 h-4 text-[#8AB4F8]" />
          </a>

          <Link
            href="/directory?company=Google"
            className="px-6 py-3 rounded-full bg-[#16181F] hover:bg-[#1F232D] border border-white/[0.12] hover:border-white/[0.24] text-[14px] font-medium text-white transition-all flex items-center gap-2"
          >
            <span>Google &amp; Antigravity Hub</span>
            <ArrowUpRight className="w-4 h-4 text-[#8AB4F8]" />
          </Link>
        </div>

        {/* Inline Floating Anchor Bar (Before Scroll Docking) */}
        <div className="mt-16 inline-flex items-center gap-1 p-1.5 rounded-full bg-[#111318]/90 backdrop-blur-xl border border-white/[0.08]">
          <a
            href="#hands-on"
            className="px-4 py-1.5 rounded-full text-[13px] text-white bg-white/[0.1] transition"
          >
            Explore the latest
          </a>
          <a
            href="#ecosystems"
            className="px-4 py-1.5 rounded-full text-[13px] text-[#9AA0A6] hover:text-white transition"
          >
            Ecosystems
          </a>
          <a
            href="#directory"
            className="px-4 py-1.5 rounded-full text-[13px] text-[#9AA0A6] hover:text-white transition"
          >
            Frontier Models
          </a>
          <Link
            href="/admin"
            className="px-4 py-1.5 rounded-full text-[13px] text-[#8AB4F8] hover:text-white transition flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Admin</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export { DeepMindHero };
