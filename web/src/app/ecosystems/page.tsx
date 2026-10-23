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
import { AI_DIRECTORY_DATA } from "@/data/aiDirectoryData";
import { AIDirectoryItem } from "@/lib/types";

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
      "DeepMind and Google Research lead full-stack AI innovation spanning native multimodal Gemini foundation models, autonomous coding environments (Antigravity), design-to-code synthesis (Stitch), and world-simulation video engines (Veo).",
    headquarters: "Mountain View, CA",
    keyPillars: ["Gemini Multimodal", "Antigravity Agent IDE", "Stitch UI Engine", "Veo & Imagen Media"],
  },
  {
    id: "openai",
    name: "OpenAI",
    headline: "Reasoning Foundation Models & Conversational Synthesis",
    description:
      "Developers of GPT-4o, o-series reasoning models, ChatGPT, and Sora. Focused on scaling test-time compute, autonomous operator agents, and voice synthesis.",
    headquarters: "San Francisco, CA",
    keyPillars: ["ChatGPT Suite", "o-Series Reasoning", "Sora Video Simulation", "Deep Research"],
  },
  {
    id: "anthropic",
    name: "Anthropic",
    headline: "Constitutional AI, Hybrid Extended Thinking & Developer Artifacts",
    description:
      "Pioneering safe, highly steerable AI through Claude 3.7 Sonnet, Claude Code autonomous terminal workflows, and interactive web Artifacts.",
    headquarters: "San Francisco, CA",
    keyPillars: ["Claude 3.7 Sonnet", "Claude Code Agent", "Interactive Artifacts", "Extended Thinking"],
  },
  {
    id: "meta",
    name: "Meta",
    headline: "Open-Weights Foundation Architectures & Generative Media",
    description:
      "Leading open intelligence with the Llama series foundation models, Meta AI assistant, Movie Gen generative media, and PyTorch infrastructure.",
    headquarters: "Menlo Park, CA",
    keyPillars: ["Llama Open Weights", "Meta AI Assistant", "Movie Gen Video", "Segment Anything"],
  },
  {
    id: "microsoft",
    name: "Microsoft & GitHub",
    headline: "Enterprise Copilots, Autonomous Multi-Agent Runtimes & Cloud Scaling",
    description:
      "Integrating AI into global enterprise software through GitHub Copilot, Microsoft 365 Copilot, Azure OpenAI service, AutoGen, and small-model Phi architectures.",
    headquarters: "Redmond, WA",
    keyPillars: ["GitHub Copilot", "Microsoft 365 Copilot", "AutoGen Multi-Agent", "Phi-4 SLMs"],
  },
  {
    id: "xai",
    name: "xAI",
    headline: "Real-Time Grounding, Colossus Compute & Truth-Seeking Reasoning",
    description:
      "Operating the Colossus supercluster to power Grok multimodal models with live X (formerly Twitter) platform grounding and high-throughput reasoning.",
    headquarters: "San Francisco, CA",
    keyPillars: ["Grok-3 Foundation", "Real-time X Grounding", "Colossus Compute", "Flux Image Synthesis"],
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    headline: "Ultra-Efficient Open Reasoning Models & Architectural Efficiency",
    description:
      "Pioneered open-weights test-time reasoning and Multi-head Latent Attention with DeepSeek-R1 and DeepSeek-V3, matching closed proprietary frontier models at drastically reduced training cost.",
    headquarters: "Hangzhou, China",
    keyPillars: ["DeepSeek-R1 Reasoning", "DeepSeek-V3 MoE", "Multi-Head Latent Attention", "Open Weights"],
  },
  {
    id: "mistral",
    name: "Mistral",
    headline: "Open European Foundation Models & Portable Enterprise Intelligence",
    description:
      "Creators of Mixtral MoE architectures, Mistral Large, Le Chat conversational assistant, and edge-deployable open models.",
    headquarters: "Paris, France",
    keyPillars: ["Mistral Large", "Mixtral MoE", "Le Chat Assistant", "Codestral IDE Engine"],
  },
  {
    id: "open-source",
    name: "Open Source & Independent",
    headline: "Decentralized Machine Learning & Community Foundation Innovation",
    description:
      "Hugging Face, ElevenLabs, Runway, Perplexity, Cursor, Suno, Midjourney, and the global independent developer ecosystem driving frontier research forward.",
    headquarters: "Global Community",
    keyPillars: ["Hugging Face Hub", "ElevenLabs Audio", "Runway Gen-3", "Perplexity Deep Research"],
  },
];

export default function EcosystemsPage() {
  const [allTools, setAllTools] = useState<AIDirectoryItem[]>(AI_DIRECTORY_DATA);
  const [activeEcosystem, setActiveEcosystem] = useState<string>("google");

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
    const targetName = currentMeta.name.toLowerCase();
    if (currentMeta.id === "open-source") {
      return allTools.filter(
        (t) =>
          (t.company || "").toLowerCase().includes("open") ||
          (t.company || "").toLowerCase().includes("creative") ||
          (t.company || "").toLowerCase().includes("developer")
      );
    }
    return allTools.filter((t) => {
      const comp = (t.company || "").toLowerCase();
      if (currentMeta.id === "google") return comp.includes("google");
      if (currentMeta.id === "openai") return comp.includes("openai");
      if (currentMeta.id === "anthropic") return comp.includes("anthropic");
      if (currentMeta.id === "meta") return comp.includes("meta");
      if (currentMeta.id === "microsoft") return comp.includes("microsoft") || comp.includes("github");
      if (currentMeta.id === "xai") return comp.includes("xai");
      if (currentMeta.id === "deepseek") return comp.includes("deepseek");
      if (currentMeta.id === "mistral") return comp.includes("mistral");
      return comp.includes(targetName);
    });
  }, [allTools, currentMeta]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-24 space-y-12">
      {/* Page Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.08] text-xs font-mono text-[#9AA0A6]">
          <span className="w-2 h-2 rounded-full bg-[#06B6D4]" />
          <span>GLOBAL AI ECOSYSTEMS ARCHITECTURE</span>
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-normal text-white tracking-tight">
          Company Ecosystems Explorer
        </h1>
        <p className="font-sans text-sm sm:text-base text-[#9AA0A6] max-w-3xl leading-relaxed">
          Traverse the global artificial intelligence landscape organized by parent technology lab. Explore interconnected models, developer tools, and foundation research trees.
        </p>
      </div>

      {/* Ecosystem Tabs Selector */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-white/[0.08]">
        {ECOSYSTEM_METADATA.map((eco) => {
          const isActive = activeEcosystem === eco.id;
          return (
            <button
              key={eco.id}
              onClick={() => setActiveEcosystem(eco.id)}
              className={`px-4 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap flex items-center gap-2 ${
                isActive
                  ? "bg-white text-black shadow-lg"
                  : "bg-white/[0.04] text-[#9AA0A6] hover:text-white hover:bg-white/[0.08] border border-white/[0.05]"
              }`}
            >
              <span>{eco.name}</span>
            </button>
          );
        })}
      </div>

      {/* Active Ecosystem Hero Card */}
      <div className="p-8 sm:p-10 rounded-[28px] bg-[#11131A] border border-white/[0.1] shadow-2xl space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#6366F1]/10 via-[#06B6D4]/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-[#38BDF8]">
              {currentMeta.headquarters}
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-normal text-white mt-1">
              {currentMeta.name} Ecosystem
            </h2>
            <p className="text-sm text-zinc-300 mt-1 max-w-2xl font-sans">
              {currentMeta.headline}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="px-4 py-2 rounded-full bg-white/[0.06] border border-white/[0.08] font-mono text-xs text-white">
              {ecosystemTools.length} Indexed Systems
            </span>
            <Link
              href={`/models?company=${encodeURIComponent(currentMeta.name)}`}
              className="px-4 py-2 rounded-full bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-medium transition shadow-md inline-flex items-center gap-1.5"
            >
              <span>Filter in Directory</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <p className="text-sm sm:text-base text-[#9AA0A6] leading-relaxed max-w-4xl font-sans">
          {currentMeta.description}
        </p>

        {/* Key Pillars */}
        <div className="space-y-2 pt-2">
          <span className="text-xs font-mono uppercase tracking-wider text-[#9AA0A6] block">
            Core Architecture Pillars
          </span>
          <div className="flex flex-wrap gap-2">
            {currentMeta.keyPillars.map((pillar, i) => (
              <span
                key={i}
                className="px-3 py-1.5 rounded-xl bg-black/40 border border-white/[0.08] text-xs text-zinc-300 font-sans"
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
          <h3 className="text-xl font-heading font-normal text-white">
            Released Models &amp; Products ({ecosystemTools.length})
          </h3>
        </div>

        {ecosystemTools.length === 0 ? (
          <div className="p-12 rounded-[24px] bg-[#11131A] border border-white/[0.08] text-center text-sm text-[#9AA0A6]">
            No systems currently indexed under {currentMeta.name}.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ecosystemTools.map((tool) => {
              const toolSlug = tool.slug || String(tool.id || "");
              return (
                <div
                  key={tool.id || tool.slug}
                  className="flex flex-col justify-between p-7 rounded-[24px] bg-[#11131A] border border-white/[0.08] hover:border-white/[0.2] hover:bg-[#161923] transition-all duration-300 group shadow-md"
                >
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between text-xs font-sans">
                      <span className="px-3 py-1 rounded-full bg-white/[0.05] text-[#9AA0A6] border border-white/[0.08] text-[11px] font-mono">
                        {tool.category}
                      </span>
                      <span className="text-zinc-400 text-xs font-mono">
                        {tool.pricing || "Freemium"}
                      </span>
                    </div>

                    <Link
                      href={`/tool/${toolSlug}`}
                      className="font-heading text-xl font-normal text-white group-hover:text-[#38BDF8] transition-colors block"
                    >
                      {tool.name}
                    </Link>

                    <p className="font-sans text-xs sm:text-sm text-[#9AA0A6] leading-relaxed line-clamp-2">
                      {tool.tagline || tool.description}
                    </p>
                  </div>

                  <div className="pt-5 mt-6 border-t border-white/[0.06] flex items-center justify-between text-xs font-sans">
                    <Link
                      href={`/tool/${toolSlug}`}
                      className="inline-flex items-center gap-1.5 text-[#38BDF8] hover:text-[#818CF8] transition-colors font-medium"
                    >
                      <span>Explore specs</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>

                    {tool.officialUrl && (
                      <a
                        href={tool.officialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-zinc-400 hover:text-white transition-colors"
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
  );
}
