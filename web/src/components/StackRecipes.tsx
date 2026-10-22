"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Workflow, ArrowRight, Sparkles, CheckCircle, Code2, Search, Terminal, Film, ArrowUpRight } from "lucide-react";
import { BrandLogo } from "./BrandLogo";
import { AIDirectoryItem } from "@/lib/types";

interface StackRecipesProps {
  onInspect: (tool: AIDirectoryItem) => void;
  allTools: AIDirectoryItem[];
}

interface RecipeTool {
  slug: string;
  name: string;
  role: string;
  creator: string;
  whyChosen: string;
}

interface Recipe {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  accent: string;
  outcome: string;
  tools: RecipeTool[];
}

const RECIPES: Recipe[] = [
  {
    id: "full-stack",
    title: "The Autonomous Full-Stack Builder",
    subtitle: "End-to-end development loop from prompt design to multi-file commit & deployment.",
    icon: Code2,
    accent: "text-emerald-400 border-emerald-500/40 bg-emerald-500/10",
    outcome: "Eliminates 80% of boilerplate work: v0 generates component UI, Claude 3.7 reasons through state & business logic, and Antigravity executes atomic edits, tests & Git pushes in a verified loop.",
    tools: [
      {
        slug: "antigravity",
        name: "Antigravity",
        creator: "Google DeepMind",
        role: "Autonomous Agentic IDE & Browser Runner",
        whyChosen: "Executes verified multi-file refactoring, terminal commands, and browser subagent recording without human interruption.",
      },
      {
        slug: "claude-3-7-sonnet",
        name: "Claude 3.7 Sonnet",
        creator: "Anthropic",
        role: "Hybrid Extended Thinking & Architecture",
        whyChosen: "Dynamic thinking budget provides surgical code refactoring, zero-hallucination type resolution, and bug hunts.",
      },
      {
        slug: "vercel-v0",
        name: "Vercel v0",
        creator: "Vercel",
        role: "Generative Component Design & Tailwind CSS",
        whyChosen: "Turns natural-language wireframes into production-ready React components with clean accessible Tailwind markup.",
      },
    ],
  },
  {
    id: "deep-research",
    title: "The Deep Research & Analysis Engine",
    subtitle: "Exhaustive citations, planetary context synthesis, and rigorous mathematical audit.",
    icon: Search,
    accent: "text-blue-400 border-blue-500/40 bg-blue-500/10",
    outcome: "Perplexity retrieves fresh real-time web citations, Gemini 2.5 Pro digests whole paper archives in 2M tokens, and DeepSeek R1 performs chain-of-thought mathematical proof verification.",
    tools: [
      {
        slug: "perplexity-pro",
        name: "Perplexity Pro",
        creator: "Perplexity AI",
        role: "Live Multi-Source Web Grounding",
        whyChosen: "Synthesizes live internet search results with clickable academic and publication citations.",
      },
      {
        slug: "google-gemini-2-5-pro",
        name: "Google Gemini 2.5 Pro",
        creator: "Google DeepMind",
        role: "2M Token Planetary Context Digester",
        whyChosen: "Ingests 100+ PDFs, legal contracts, and financial datasets in a single prompt without losing needle recall.",
      },
      {
        slug: "deepseek-r1",
        name: "DeepSeek R1",
        creator: "DeepSeek",
        role: "Reinforcement-Learned Logic Verifier",
        whyChosen: "Open-weight reasoning model matching o1 performance in hard logic, mathematics, and formal proof verification.",
      },
    ],
  },
  {
    id: "local-stack",
    title: "The Zero-Cost Open-Source Local Stack",
    subtitle: "Complete privacy and zero API invoices running on your local workstation or private cluster.",
    icon: Terminal,
    accent: "text-amber-400 border-amber-500/40 bg-amber-500/10",
    outcome: "100% private and air-gapped engineering workflows. DeepSeek R1 handles reasoning, Qwen 2.5 Coder autocompletes codebases at 100+ tokens/sec, and Llama 3.3 70B powers general task orchestration.",
    tools: [
      {
        slug: "deepseek-r1",
        name: "DeepSeek R1",
        creator: "DeepSeek",
        role: "Local Chain-of-Thought Reasoning",
        whyChosen: "Full open weights allowing local quantized execution (GGUF/Ollama) with frontier reasoning capabilities.",
      },
      {
        slug: "qwen-2-5-coder",
        name: "Qwen 2.5 Coder 32B",
        creator: "Alibaba Cloud",
        role: "High-Throughput Local Code Autocomplete",
        whyChosen: "State-of-the-art open-source code model rivaling GPT-4o in coding benchmarks with lightning-fast inference.",
      },
      {
        slug: "llama-3-3-70b",
        name: "Llama 3.3 70B",
        creator: "Meta AI",
        role: "General Instruction Orchestration",
        whyChosen: "Industry-standard open weights model offering GPT-4 level general conversation and tool-calling capabilities.",
      },
    ],
  },
  {
    id: "multimodal-studio",
    title: "The Multimodal Content & Video Studio",
    subtitle: "Hollywood-grade cinematic generative video, high-concept visual art, and natural voice cloning.",
    icon: Film,
    accent: "text-purple-400 border-purple-500/40 bg-purple-500/10",
    outcome: "Produces broadcast-ready cinematic motion pictures: Kling/Sora generates continuous 1080p video, Midjourney provides hyper-detailed character sheets, and ElevenLabs delivers expressive vocal tracks.",
    tools: [
      {
        slug: "kling-ai",
        name: "Kling AI / OpenAI Sora",
        creator: "Kuaishou / OpenAI",
        role: "Cinematic Physical Video Simulation",
        whyChosen: "Generates high-fidelity video with complex physics simulation, fluid dynamics, and accurate camera motion.",
      },
      {
        slug: "midjourney-v6-1",
        name: "Midjourney v6.1",
        creator: "Midjourney",
        role: "World-Class Art Direction & Aesthetics",
        whyChosen: "Unmatched photorealism, texture rendering, and stylistic coherence for production moodboards.",
      },
      {
        slug: "elevenlabs-voice",
        name: "ElevenLabs Voice AI",
        creator: "ElevenLabs",
        role: "Human-Quality Voice Synthesis & Dubbing",
        whyChosen: "Generates emotive multilingual narration and studio voice cloning with nuanced pacing and tone.",
      },
    ],
  },
];

export function StackRecipes({ onInspect, allTools }: StackRecipesProps) {
  const [activeRecipeId, setActiveRecipeId] = useState<string>("full-stack");

  const currentRecipe = RECIPES.find((r) => r.id === activeRecipeId) || RECIPES[0];

  const handleToolClick = (toolSlug: string) => {
    const found = allTools.find((t) => t.slug === toolSlug);
    if (found) {
      onInspect(found);
    } else {
      // Fallback
      onInspect({
        id: 0,
        slug: toolSlug,
        name: toolSlug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
        creator: "AI Lab",
        short_purpose: "Frontier AI tool part of recommended composition stack.",
        primary_category: "Autonomous Agents",
        tags: ["Stack Recipe", "Frontier"],
        detailed_overview: "Frontier AI tool part of recommended composition stack.",
        key_capabilities: ["High-speed synthesis", "Cross-tool integration"],
        best_use_cases: ["Modern Workflow"],
        pricing_model: "Paid / Freemium",
        official_url: "https://example.com",
        release_status: "Generally Available",
        is_featured: true,
      } as AIDirectoryItem);
    }
  };

  return (
    <section id="stacks" className="py-20 sm:py-24 border-t border-white/[0.06] relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 mb-2.5">
              <Workflow className="h-3.5 w-3.5" />
              <span>SUGGESTED COMPOSITIONS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Curated AI Stack Recipes.
            </h2>
          </div>
          <p className="text-sm text-slate-400 max-w-md font-normal leading-relaxed">
            Frontier AI systems achieve exponential leverage when composed into dedicated workflows. Click any engine below to inspect its specifications.
          </p>
        </div>

        {/* Recipe Selection Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {RECIPES.map((recipe) => {
            const Icon = recipe.icon;
            const active = recipe.id === activeRecipeId;
            return (
              <button
                key={recipe.id}
                onClick={() => setActiveRecipeId(recipe.id)}
                className={`text-left p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                  active
                    ? "border-emerald-500/50 bg-[#12141F] shadow-lg shadow-emerald-500/5 ring-1 ring-emerald-500/30"
                    : "border-white/[0.06] bg-[#0E1017]/70 hover:border-white/[0.12] hover:bg-[#10121A]"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-xl border ${active ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400" : "border-white/[0.08] bg-white/[0.03] text-slate-400"}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  {active && (
                    <span className="rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold px-2 py-0.5">
                      ACTIVE
                    </span>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white mb-1 leading-snug">
                    {recipe.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2">
                    {recipe.subtitle}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Recipe Showcase Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentRecipe.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
            className="rounded-3xl border border-white/[0.08] bg-[#0E1017]/90 p-6 sm:p-9 shadow-2xl backdrop-blur-xl"
          >
            {/* Top Overview Banner */}
            <div className="rounded-2xl border border-white/[0.06] bg-[#12131C] p-5 sm:p-6 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start space-x-3.5">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shrink-0 mt-0.5">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white mb-1">
                    Workflow Architecture & Synergy
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal max-w-3xl">
                    {currentRecipe.outcome}
                  </p>
                </div>
              </div>
            </div>

            {/* 3 Step Tool Flow Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
              {currentRecipe.tools.map((t, idx) => (
                <div
                  key={t.slug}
                  onClick={() => handleToolClick(t.slug)}
                  className="group cursor-pointer rounded-2xl border border-white/[0.08] bg-[#11131B] p-5 sm:p-6 hover:border-emerald-500/40 hover:bg-[#151722] transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Step indicator */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-mono text-[11px] font-bold text-emerald-400">
                        ENGINE 0{idx + 1}
                      </span>
                      <ArrowUpRight className="h-4 w-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>

                    {/* Brand Logo & Name */}
                    <div className="flex items-center space-x-3 mb-3">
                      <BrandLogo slug={t.slug} name={t.name} creator={t.creator} size="lg" />
                      <div>
                        <h4 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                          {t.name}
                        </h4>
                        <p className="text-xs text-slate-400">{t.creator}</p>
                      </div>
                    </div>

                    {/* Role Pill */}
                    <div className="mb-3">
                      <span className="rounded-full bg-white/[0.05] border border-white/[0.08] px-2.5 py-1 text-[11px] font-medium text-slate-200 inline-block">
                        {t.role}
                      </span>
                    </div>

                    {/* Why Chosen Explanation */}
                    <p className="text-xs text-slate-300 leading-relaxed font-normal">
                      {t.whyChosen}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400">
                    <span className="font-mono text-[10px]">Click to inspect specs</span>
                    <span className="text-emerald-400 font-semibold group-hover:underline">Inspect →</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
