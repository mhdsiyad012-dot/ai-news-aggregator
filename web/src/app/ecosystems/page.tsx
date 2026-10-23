"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Building2,
  ExternalLink,
  ChevronRight,
  ArrowUpRight,
  Sparkles,
  Layers,
  Cpu,
  CheckCircle2
} from "lucide-react";
import { AIDirectoryItem } from "@/lib/types";
import ToolIcon from "@/components/ToolIcon";

interface EcosystemGroup {
  id: string;
  name: string;
  headline: string;
  description: string;
  headquarters?: string;
  keyPillars: string[];
}

const ECOSYSTEM_METADATA: EcosystemGroup[] = [
  {
    id: "google",
    name: "Google",
    headline: "Frontier Multimodal Reasoning & Agentic Developer Ecosystem",
    description:
      "DeepMind and Google Research lead full-stack AI innovation spanning native multimodal Gemini foundation models, autonomous coding environments (Antigravity), design-to-code synthesis (Stitch), and world-simulation video engines (Veo & Genie).",
    headquarters: "Mountain View, CA",
    keyPillars: ["Gemini 4 Argon & 3.8 Flash", "Antigravity Agent IDE", "Genie 3 World Simulation", "Stitch UI Engine"],
  },
  {
    id: "openai",
    name: "OpenAI",
    headline: "Reasoning Foundation Models & Multimodal Synthesis",
    description:
      "Pioneers of GPT-6 Astra, o3/o4 reasoning series, ChatGPT, and Sora world models. Scaling test-time compute, autonomous operator agents, and neural media.",
    headquarters: "San Francisco, CA",
    keyPillars: ["GPT-6 Astra & o3", "ChatGPT Canvas", "Sora Video Simulation", "Whisper v3 Turbo"],
  },
  {
    id: "anthropic",
    name: "Anthropic",
    headline: "Constitutional AI, Hybrid Extended Thinking & Terminal Agents",
    description:
      "Pioneering safe, highly steerable frontier AI through Claude Opus 5.5, Claude 3.7 Sonnet hybrid reasoning, and Claude Code autonomous terminal workflows.",
    headquarters: "San Francisco, CA",
    keyPillars: ["Claude Opus 5.5", "Claude 3.7 Sonnet", "Claude Code Agent", "1M Context Window"],
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    headline: "Open-Architecture Reinforcement Learning & Mixture-of-Experts",
    description:
      "Disrupting global AI compute economics with DeepSeek-R1, V4.1 Flash, Multi-Head Latent Attention (MLA), and ultra-low training cost architectures.",
    headquarters: "Hangzhou, China",
    keyPillars: ["DeepSeek-R1 Reasoning", "V4.1 Flash MoE", "Multi-Token Prediction", "MIT Open License"],
  },
  {
    id: "meta",
    name: "Meta",
    headline: "Open-Weights Foundation Architectures & Sparse MoE",
    description:
      "Leading open intelligence with Llama 4 Maverick 400B+ MoE, native multimodal tokens, and community-driven fine-tuning frameworks.",
    headquarters: "Menlo Park, CA",
    keyPillars: ["Llama 4 Maverick", "Llama 3.3 70B", "Native Multimodal", "Open Community License"],
  },
  {
    id: "xai",
    name: "xAI",
    headline: "Colossus Supercomputing & Real-Time Multimodal Telemetry",
    description:
      "Trained on 200,000+ GPU Colossus clusters, Grok models integrate real-time X telemetry, unfiltered analytical reasoning, and visual cognition.",
    headquarters: "Memphis, TN & San Francisco, CA",
    keyPillars: ["Grok 4.7 Frontier", "Colossus Supercluster", "Real-Time X Grounding", "Unfiltered Logic"],
  },
  {
    id: "alibaba",
    name: "Alibaba",
    headline: "Long-Context Multilingual Excellence & Open Video Generation",
    description:
      "Developers of Qwen 3 Max with 1M context, state-of-the-art open Qwen 2.5 Coder, and Wan 2.1 open video diffusion foundation models.",
    headquarters: "Hangzhou, China",
    keyPillars: ["Qwen 3 Max (1M Context)", "Qwen 2.5 Coder", "Wan 2.1 Video Diffusion", "Multilingual Fluency"],
  },
  {
    id: "mistral",
    name: "Mistral AI",
    headline: "European Sovereign AI, Mistral Large & Open Codestral",
    description:
      "Paris-based frontier AI lab offering high-performance multilingual foundation models, sovereign enterprise privacy, and 80+ language coding models.",
    headquarters: "Paris, France",
    keyPillars: ["Mistral Large 2", "Codestral 80+ Langs", "Pixtral Vision", "European GDPR Sovereignty"],
  },
];

export default function EcosystemsPage() {
  const [activeEcosystem, setActiveEcosystem] = useState<string>("google");
  const [allTools, setAllTools] = useState<AIDirectoryItem[]>([]);

  useEffect(() => {
    async function loadTools() {
      try {
        const res = await fetch("/api/directory", { cache: "no-store" });
        const data = await res.json();
        if (data?.items && Array.isArray(data.items) && data.items.length > 0) {
          setAllTools(data.items);
        }
      } catch (err) {
        console.warn("Could not fetch remote directory for ecosystems:", err);
      }
    }
    loadTools();
  }, []);

  const currentMeta = useMemo(() => {
    return (
      ECOSYSTEM_METADATA.find((e) => e.id === activeEcosystem) ||
      ECOSYSTEM_METADATA[0]
    );
  }, [activeEcosystem]);

  const ecosystemTools = useMemo(() => {
    return allTools.filter((t) => {
      const comp = (t.company || "").toLowerCase();
      if (currentMeta.id === "google") return comp.includes("google") || comp.includes("deepmind");
      if (currentMeta.id === "openai") return comp.includes("openai");
      if (currentMeta.id === "anthropic") return comp.includes("anthropic");
      if (currentMeta.id === "meta") return comp.includes("meta");
      if (currentMeta.id === "xai") return comp.includes("xai");
      if (currentMeta.id === "deepseek") return comp.includes("deepseek");
      if (currentMeta.id === "alibaba") return comp.includes("alibaba") || comp.includes("qwen");
      if (currentMeta.id === "mistral") return comp.includes("mistral");
      return comp.includes(currentMeta.name.toLowerCase());
    });
  }, [allTools, currentMeta]);

  return (
    <div className="min-h-screen bg-[#FFFFFF] dark:bg-[#060608] text-[#1F1F1F] dark:text-[#E3E3E3] pt-28 pb-24 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Page Header */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F0F4F9] dark:bg-white/[0.05] border border-black/[0.06] dark:border-white/[0.08] text-xs font-medium text-[#5F6368] dark:text-[#8E9196] shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#4285F4]" />
            <span>GLOBAL AI ECOSYSTEMS ARCHITECTURE</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-normal text-[#1F1F1F] dark:text-white tracking-tight">
            Company Ecosystems Explorer
          </h1>
          <p className="font-sans text-sm sm:text-base text-[#5F6368] dark:text-[#8E9196] max-w-3xl leading-relaxed">
            Traverse the global artificial intelligence landscape organized by parent technology lab. Explore interconnected models, developer tools, and foundation research trees.
          </p>
        </div>

        {/* Ecosystem Tabs Selector */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-black/[0.06] dark:border-white/[0.08]">
          {ECOSYSTEM_METADATA.map((eco) => {
            const isActive = activeEcosystem === eco.id;
            return (
              <button
                key={eco.id}
                onClick={() => setActiveEcosystem(eco.id)}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap flex items-center gap-2 shadow-sm ${
                  isActive
                    ? "bg-[#4285F4] text-white"
                    : "bg-[#F0F4F9] dark:bg-[#131314] text-[#5F6368] dark:text-[#8E9196] hover:text-[#1F1F1F] dark:hover:text-white border border-black/[0.06] dark:border-white/[0.06]"
                }`}
              >
                <span>{eco.name}</span>
              </button>
            );
          })}
        </div>

        {/* Active Ecosystem Hero Card */}
        <div className="p-8 sm:p-10 rounded-3xl bg-[#F8FAFD] dark:bg-[#111318] border border-black/[0.08] dark:border-white/[0.1] shadow-sm space-y-6 relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-black/[0.06] dark:border-white/[0.08] pb-6">
            <div>
              <span className="text-xs font-medium uppercase tracking-wider text-[#4285F4] dark:text-[#8AB4F8]">
                {currentMeta.headquarters}
              </span>
              <h2 className="text-2xl sm:text-3xl font-heading font-normal text-[#1F1F1F] dark:text-white mt-1">
                {currentMeta.name} Ecosystem
              </h2>
              <p className="text-sm text-[#5F6368] dark:text-zinc-300 mt-1 max-w-2xl font-sans">
                {currentMeta.headline}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="px-4 py-2 rounded-full bg-white dark:bg-white/[0.06] border border-black/[0.06] dark:border-white/[0.08] text-xs font-medium text-[#1F1F1F] dark:text-white shadow-sm">
                {ecosystemTools.length} Indexed Systems
              </span>
              <Link
                href={`/models?company=${encodeURIComponent(currentMeta.name)}`}
                className="px-4 py-2 rounded-full bg-[#4285F4] hover:bg-[#3367D6] text-white text-xs font-medium transition shadow-sm inline-flex items-center gap-1.5"
              >
                <span>Filter in Directory</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <p className="text-sm sm:text-base text-[#5F6368] dark:text-[#8E9196] leading-relaxed max-w-4xl font-sans">
            {currentMeta.description}
          </p>

          {/* Key Pillars */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-medium uppercase tracking-wider text-[#5F6368] dark:text-[#8E9196] block">
              Core Architecture Pillars
            </span>
            <div className="flex flex-wrap gap-2">
              {currentMeta.keyPillars.map((pillar, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-black/40 border border-black/[0.06] dark:border-white/[0.08] text-xs text-[#1F1F1F] dark:text-zinc-300 font-sans shadow-sm"
                >
                  ✦ {pillar}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Grid of Tools in Active Ecosystem */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-heading font-normal text-[#1F1F1F] dark:text-white">
              Released Models &amp; Products ({ecosystemTools.length})
            </h3>
          </div>

          {ecosystemTools.length === 0 ? (
            <div className="p-12 rounded-3xl bg-[#F8FAFD] dark:bg-[#111318] border border-black/[0.08] dark:border-white/[0.08] text-center text-sm text-[#5F6368] dark:text-[#8E9196]">
              No systems currently indexed under {currentMeta.name}.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ecosystemTools.map((tool) => {
                const toolSlug = tool.slug || String(tool.id || "");
                return (
                  <div
                    key={tool.id || tool.slug}
                    className="flex flex-col justify-between p-7 rounded-3xl bg-[#F8FAFD] dark:bg-[#111318] border border-black/[0.08] dark:border-white/[0.08] hover:border-[#4285F4]/30 dark:hover:border-white/[0.2] transition-all duration-300 group shadow-sm hover:shadow-md"
                  >
                    <div className="space-y-3.5">
                      <div className="flex items-start justify-between gap-3">
                        <ToolIcon
                          name={tool.name}
                          company={tool.company}
                          officialUrl={tool.officialUrl}
                          category={tool.category}
                          size={40}
                        />
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 rounded-full bg-[#F0F4F9] dark:bg-white/[0.05] text-[#5F6368] dark:text-[#8E9196] border border-black/[0.06] dark:border-white/[0.08] text-[11px] font-medium">
                            {tool.category}
                          </span>
                          <span className="text-[#5F6368] dark:text-zinc-400 text-xs font-medium">
                            {tool.pricing || "Freemium"}
                          </span>
                        </div>
                      </div>

                      <Link
                        href={`/tool/${toolSlug}`}
                        className="font-heading text-xl font-normal text-[#1F1F1F] dark:text-white group-hover:text-[#4285F4] dark:group-hover:text-[#8AB4F8] transition-colors block"
                      >
                        {tool.name}
                      </Link>

                      <p className="font-sans text-xs sm:text-sm text-[#5F6368] dark:text-[#8E9196] leading-relaxed line-clamp-2">
                        {tool.tagline || tool.description}
                      </p>
                    </div>

                    <div className="pt-5 mt-6 border-t border-black/[0.06] dark:border-white/[0.06] flex items-center justify-between text-xs font-sans">
                      <Link
                        href={`/tool/${toolSlug}`}
                        className="inline-flex items-center gap-1.5 text-[#4285F4] dark:text-[#8AB4F8] hover:underline transition-colors font-medium"
                      >
                        <span>Explore specs</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>

                      {tool.officialUrl && (
                        <a
                          href={tool.officialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[#5F6368] dark:text-zinc-400 hover:text-[#1F1F1F] dark:hover:text-white transition-colors"
                        >
                          <span>Visit</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
