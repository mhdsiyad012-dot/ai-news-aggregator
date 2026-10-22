"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Flame, Sparkles, Check, Zap, Layers, ShieldCheck } from "lucide-react";
import { BrandLogo } from "./BrandLogo";
import { AIDirectoryItem } from "@/lib/types";

interface FlagshipBentoProps {
  onInspect: (tool: AIDirectoryItem) => void;
  allTools: AIDirectoryItem[];
}

interface FlagshipConfig {
  slug: string;
  badge: string;
  accentBorder: string;
  badgeColor: string;
  highlight: string;
  keyPoints: string[];
}

const FLAGSHIP_CONFIGS: FlagshipConfig[] = [
  {
    slug: "antigravity",
    badge: "AGENTIC REVOLUTION",
    accentBorder: "hover:border-emerald-500/50",
    badgeColor: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    highlight: "Autonomous multi-file codebase evolution paired with native browser sandbox agents and verified terminal loops.",
    keyPoints: [
      "Autonomous Browser Subagent recording WebP video proofs",
      "Multi-replace atomic file diffing engine across repositories",
      "Native terminal command execution with reactive wakeups",
    ],
  },
  {
    slug: "google-gemini-2-5-pro",
    badge: "2M CONTEXT REASONING",
    accentBorder: "hover:border-blue-500/50",
    badgeColor: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    highlight: "Frontier multimodal foundation model holding 2,000,000 token context window with native code execution and audio-visual streaming.",
    keyPoints: [
      "2M context window ingests entire enterprise codebases in a single prompt",
      "Native code execution sandbox with Python interpreter",
      "Cross-modal reasoning across video, audio, PDFs & diagrams",
    ],
  },
  {
    slug: "claude-3-7-sonnet",
    badge: "HYBRID THINKING ENGINE",
    accentBorder: "hover:border-amber-500/50",
    badgeColor: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    highlight: "First frontier model featuring a continuous dynamic thinking slider: balance instantaneous responses with extended deliberate reasoning.",
    keyPoints: [
      "Continuous thinking budget from 0 to 64,000 tokens",
      "Superior code refactoring, complex bug hunt & architectural synthesis",
      "200K context window with pristine precision recall",
    ],
  },
  {
    slug: "openai-codex",
    badge: "FOUNDATIONAL CODE ENGINE",
    accentBorder: "hover:border-teal-500/50",
    badgeColor: "bg-teal-500/15 text-teal-400 border-teal-500/30",
    highlight: "The foundational neural architecture powering GitHub Copilot and millions of daily developer auto-completions worldwide.",
    keyPoints: [
      "Trained on tens of millions of public open-source code repositories",
      "Near-instantaneous low-latency tab completion in 40+ languages",
      "Deep docstring synthesis, test generation and boilerplate expansion",
    ],
  },
];

export function FlagshipBento({ onInspect, allTools }: FlagshipBentoProps) {
  // Map configs to actual tool items from Supabase or fallback
  const flagships = FLAGSHIP_CONFIGS.map((cfg) => {
    const found = allTools.find((t) => t.slug === cfg.slug);
    return {
      cfg,
      tool: found || {
        id: 0,
        slug: cfg.slug,
        name: cfg.slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
        creator: "Frontier AI Lab",
        short_purpose: cfg.highlight,
        primary_category: "Autonomous Agents",
        tags: ["Frontier", "Flagship"],
        detailed_overview: cfg.highlight,
        key_capabilities: cfg.keyPoints,
        best_use_cases: ["Production Development", "Enterprise AI"],
        pricing_model: "Paid / API",
        official_url: "https://example.com",
        release_status: "Generally Available",
        is_featured: true,
      } as AIDirectoryItem,
    };
  });

  return (
    <section id="flagships" className="py-20 sm:py-28 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400 mb-3">
              <Flame className="h-3.5 w-3.5" />
              <span>THE FRONTIER FLAGSHIPS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Defining the Current Era.
            </h2>
          </div>
          <p className="text-sm text-slate-400 max-w-md font-normal leading-relaxed">
            Four seminal architectures transforming how software is engineered, reasoned through, and deployed at planetary scale.
          </p>
        </div>

        {/* 4 Oversized Bento Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {flagships.map(({ cfg, tool }, idx) => (
            <motion.div
              key={tool.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              whileHover={{ y: -4 }}
              onClick={() => onInspect(tool)}
              className={`group cursor-pointer relative rounded-3xl border border-white/[0.08] bg-[#0E1017]/90 p-7 sm:p-9 shadow-2xl backdrop-blur-xl transition-all duration-300 ${cfg.accentBorder} flex flex-col justify-between`}
            >
              {/* Top row */}
              <div>
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div className="flex items-center space-x-4">
                    <BrandLogo slug={tool.slug} name={tool.name} creator={tool.creator} size="xl" />
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-emerald-400 transition-colors">
                          {tool.name}
                        </h3>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-400 font-medium">
                        {tool.creator}
                      </p>
                    </div>
                  </div>

                  <span className={`rounded-full border px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase shrink-0 ${cfg.badgeColor}`}>
                    {cfg.badge}
                  </span>
                </div>

                {/* Architectural Highlight */}
                <p className="text-sm text-slate-300 leading-relaxed font-normal mb-6">
                  {cfg.highlight}
                </p>

                {/* Top 3 Capabilities List */}
                <div className="space-y-2.5 border-t border-white/[0.06] pt-5 mb-8">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500">
                    CORE CAPABILITIES
                  </span>
                  {cfg.keyPoints.map((point) => (
                    <div key={point} className="flex items-start space-x-2.5 text-xs text-slate-300">
                      <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 mt-0.5">
                        <Check className="h-2.5 w-2.5" />
                      </div>
                      <span className="leading-snug">{point}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Card Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
                <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span>{tool.pricing_model}</span>
                </div>

                <div className="flex items-center space-x-1.5 text-xs font-semibold text-emerald-400 group-hover:translate-x-1 transition-transform">
                  <span>Inspect Full Architecture</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
