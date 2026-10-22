"use client";

import React from "react";
import { ArrowUp, Sparkles, Shield, Heart } from "lucide-react";

interface ShowcaseFooterProps {
  onScrollTo: (sectionId: string) => void;
}

export function ShowcaseFooter({ onScrollTo }: ShowcaseFooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer id="footer" className="relative border-t border-white/[0.08] bg-[#07070A] pt-16 sm:pt-20 pb-8 overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-64 w-[600px] bg-emerald-500/5 blur-3xl -z-10 rounded-full" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Multi-Column Main Footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 sm:gap-12 pb-16 border-b border-white/[0.06]">
          {/* Col 1 & 2: Brand & Mission */}
          <div className="lg:col-span-2 flex flex-col space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 p-[1px]">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-[#070709]">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-emerald-400"
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
              <span className="text-xl font-black tracking-tight text-white">
                PulseAI
              </span>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed font-normal max-w-sm">
              The definitive, ad-free intelligence encyclopedia tracking 42+ released frontier reasoning systems, autonomous software builders, and daily Gemini-synthesized research dispatches.
            </p>

            <div className="flex items-center space-x-2 pt-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-slate-400 font-mono">
                Real-Time Systems Synchronized
              </span>
            </div>
          </div>

          {/* Col 3: Navigation */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => onScrollTo("hero")}
                  className="hover:text-white transition-colors"
                >
                  Showcase Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollTo("flagships")}
                  className="hover:text-white transition-colors"
                >
                  Frontier Flagships
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollTo("directory")}
                  className="hover:text-white transition-colors"
                >
                  AI Systems Directory
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollTo("stacks")}
                  className="hover:text-white transition-colors"
                >
                  Curated Stack Recipes
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollTo("news")}
                  className="hover:text-white transition-colors"
                >
                  Daily Intelligence Wire
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Top Tracked Labs */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-4">
              Frontier Labs
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="hover:text-white transition-colors cursor-default">
                Google DeepMind
              </li>
              <li className="hover:text-white transition-colors cursor-default">
                OpenAI Research
              </li>
              <li className="hover:text-white transition-colors cursor-default">
                Anthropic AI
              </li>
              <li className="hover:text-white transition-colors cursor-default">
                DeepSeek AI
              </li>
              <li className="hover:text-white transition-colors cursor-default">
                Meta AI Research
              </li>
              <li className="hover:text-white transition-colors cursor-default">
                Alibaba Qwen
              </li>
            </ul>
          </div>

          {/* Col 5: Attribution & Trust */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-4">
              Purity & Ethics
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-center space-x-1.5">
                <Shield className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>Zero Hallucinations</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <Sparkles className="h-3.5 w-3.5 text-sky-400 shrink-0" />
                <span>100% Ad-Free Specs</span>
              </li>
              <li className="pt-2">
                <button
                  onClick={scrollToTop}
                  className="inline-flex items-center space-x-1 rounded-full border border-white/[0.1] bg-white/[0.04] px-3 py-1.5 text-xs text-white hover:bg-white/[0.08] transition-colors"
                >
                  <ArrowUp className="h-3 w-3" />
                  <span>Back to Top</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Lower Row: Copyright & Legal */}
        <div className="pt-8 pb-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-mono">
          <div>
            © 2025 PulseAI Systems Inc. All specifications verified against official releases.
          </div>
          <div className="flex items-center space-x-4">
            <span>Crafted for Frontier Builders</span>
            <span>•</span>
            <span className="text-emerald-400">v2.5 Release</span>
          </div>
        </div>
      </div>

      {/* GIANT WATERMARK INFINITE MARQUEE AT BOTTOM */}
      <div className="w-full overflow-hidden select-none pointer-events-none opacity-[0.035] py-4 border-t border-white/[0.02]">
        <div className="animate-marquee flex items-center space-x-8 whitespace-nowrap text-5xl sm:text-7xl lg:text-8xl font-black font-mono tracking-tighter uppercase text-white">
          <span>PULSE • AI • INTELLIGENCE • DIRECTORY • 42+ MODELS • NO ADS • ZERO PLACEHOLDERS • </span>
          <span>PULSE • AI • INTELLIGENCE • DIRECTORY • 42+ MODELS • NO ADS • ZERO PLACEHOLDERS • </span>
        </div>
      </div>
    </footer>
  );
}
