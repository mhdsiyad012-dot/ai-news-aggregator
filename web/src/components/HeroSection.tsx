"use client";

import React from "react";
import { ArrowDown, ArrowRight, Sparkles, Terminal, Cpu, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { BrandLogo } from "./BrandLogo";
import { AIDirectoryItem } from "@/lib/types";

interface HeroSectionProps {
  onExploreDirectory: () => void;
  onExploreWire: () => void;
  onInspectTool: (toolSlug: string) => void;
  allTools: AIDirectoryItem[];
}

const MARQUEE_BRANDS = [
  { name: "OpenAI", slug: "openai-codex" },
  { name: "Google DeepMind", slug: "google-gemini-2-5-pro" },
  { name: "Anthropic", slug: "claude-3-7-sonnet" },
  { name: "Antigravity", slug: "antigravity" },
  { name: "Cursor", slug: "cursor" },
  { name: "DeepSeek", slug: "deepseek-r1" },
  { name: "Meta AI", slug: "llama-3-3-70b" },
  { name: "xAI", slug: "grok-3" },
  { name: "Perplexity", slug: "perplexity-pro" },
  { name: "Alibaba Qwen", slug: "qwen-2-5-coder" },
  { name: "Mistral", slug: "mistral-large-2" },
  { name: "Vercel v0", slug: "vercel-v0" },
  { name: "Runway", slug: "runway-gen-3-alpha" },
  { name: "ElevenLabs", slug: "elevenlabs-voice" },
  { name: "Midjourney", slug: "midjourney-v6-1" },
];

export function HeroSection({
  onExploreDirectory,
  onExploreWire,
  onInspectTool,
  allTools,
}: HeroSectionProps) {
  return (
    <section id="hero" className="relative pt-28 sm:pt-36 pb-16 overflow-hidden hero-glow">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Editorial Headline & Actions */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col space-y-6 text-left"
          >
            {/* Pill Badge */}
            <div className="inline-flex items-center space-x-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-400 self-start shadow-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>⚡ LIVE INTELLIGENCE HUB • 42+ FRONTIER AI SYSTEMS</span>
            </div>

            {/* Giant Editorial Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-[68px] font-extrabold tracking-tight text-white leading-[1.08]">
              Where Frontier AI <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-white via-slate-200 to-emerald-400 bg-clip-text text-transparent">
                Meets Modern Builders.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed font-normal">
              Explore the complete encyclopedia of released AI models, autonomous coding agents, and daily Gemini-curated tech dispatches—all in one ad-free workspace.
            </p>

            {/* Two Primary CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                onClick={onExploreDirectory}
                className="group flex items-center space-x-2 rounded-full bg-white px-6 py-3.5 text-sm font-bold text-zinc-950 hover:bg-emerald-400 transition-all shadow-lg shadow-white/10"
              >
                <span>Explore AI Directory</span>
                <ArrowDown className="h-4 w-4 group-hover:translate-y-0.5 transition-transform" />
              </button>

              <button
                onClick={onExploreWire}
                className="group flex items-center space-x-2 rounded-full border border-white/[0.12] bg-[#12131A]/80 px-6 py-3.5 text-sm font-semibold text-white hover:bg-white/[0.08] hover:border-white/[0.2] transition-all backdrop-blur-md"
              >
                <span>Read Today's AI Wire</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform text-emerald-400" />
              </button>
            </div>

            {/* Live Trust Proof Chips */}
            <div className="flex items-center space-x-6 pt-4 text-xs text-slate-400">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>Zero Hallucinated Placeholders</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>Daily Gemini Synthesized RSS</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Floating 3-Card Stack Bento Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative flex justify-center items-center"
          >
            {/* Background ambient radial glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 to-indigo-500/10 blur-3xl -z-10 rounded-full" />

            {/* 3-Card Interactive Stack */}
            <div className="w-full max-w-md relative flex flex-col space-y-3.5">
              {/* Card 1: Antigravity */}
              <motion.div
                whileHover={{ y: -3, scale: 1.01 }}
                onClick={() => onInspectTool("antigravity")}
                className="cursor-pointer rounded-2xl border border-white/[0.1] bg-[#0E1017]/90 p-4.5 shadow-2xl backdrop-blur-xl transition-all hover:border-emerald-500/40"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <BrandLogo slug="antigravity" name="Antigravity" creator="Google DeepMind" size="lg" />
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-bold text-white">Antigravity</h4>
                        <span className="rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.2 text-[10px] font-semibold">
                          AGENTIC IDE
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">Google DeepMind</p>
                    </div>
                  </div>
                  <span className="flex items-center space-x-1 text-[11px] text-emerald-400 font-mono">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>GA Active</span>
                  </span>
                </div>
                <p className="mt-2.5 text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  Advanced agentic AI coding assistant with autonomous browser subagents, multi-file atomic edits & live workspace execution.
                </p>
              </motion.div>

              {/* Card 2: Google Gemini 2.5 Pro */}
              <motion.div
                whileHover={{ y: -3, scale: 1.01 }}
                onClick={() => onInspectTool("google-gemini-2-5-pro")}
                className="cursor-pointer rounded-2xl border border-white/[0.1] bg-[#0F1119]/90 p-4.5 shadow-2xl backdrop-blur-xl transition-all hover:border-blue-500/40 ml-2 sm:ml-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <BrandLogo slug="google-gemini-2-5-pro" name="Google Gemini 2.5 Pro" creator="Google DeepMind" size="lg" />
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-bold text-white">Gemini 2.5 Pro</h4>
                        <span className="rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30 px-2 py-0.2 text-[10px] font-semibold">
                          REASONING LLM
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">Google DeepMind</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-blue-400">2M Tokens</span>
                </div>
                <p className="mt-2.5 text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  Frontier multimodal reasoning engine engineered for deep code synthesis, long-context research and real-time tool grounding.
                </p>
              </motion.div>

              {/* Card 3: OpenAI Codex */}
              <motion.div
                whileHover={{ y: -3, scale: 1.01 }}
                onClick={() => onInspectTool("openai-codex")}
                className="cursor-pointer rounded-2xl border border-white/[0.1] bg-[#0E1017]/90 p-4.5 shadow-2xl backdrop-blur-xl transition-all hover:border-emerald-500/40"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <BrandLogo slug="openai-codex" name="OpenAI Codex" creator="OpenAI" size="lg" />
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-bold text-white">OpenAI Codex</h4>
                        <span className="rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.2 text-[10px] font-semibold">
                          CODE SYNTHESIS
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">OpenAI</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-400">API Active</span>
                </div>
                <p className="mt-2.5 text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  Specialized frontier neural engine trained explicitly on world open-source repositories to generate natural-language code implementations.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Infinite Scrolling Brand Marquee directly below */}
        <div className="mt-16 sm:mt-24 pt-8 border-t border-white/[0.06]">
          <div className="text-center mb-5">
            <span className="text-[11px] font-mono uppercase tracking-widest text-slate-500">
              TRACKING THE WORLD'S FRONTIER LABS & FOUNDATIONAL ENGINES
            </span>
          </div>

          <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
            <div className="animate-marquee flex items-center space-x-8 sm:space-x-12 py-2">
              {MARQUEE_BRANDS.concat(MARQUEE_BRANDS).map((b, idx) => (
                <div
                  key={`${b.slug}-${idx}`}
                  onClick={() => onInspectTool(b.slug)}
                  className="flex items-center space-x-2.5 opacity-65 hover:opacity-100 transition-opacity cursor-pointer shrink-0"
                >
                  <BrandLogo slug={b.slug} name={b.name} size="sm" />
                  <span className="text-sm font-semibold text-slate-300 tracking-tight whitespace-nowrap">
                    {b.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
