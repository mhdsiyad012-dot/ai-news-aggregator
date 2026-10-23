"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Scale,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Plus,
  X,
  Check,
  Building2,
  Tag,
  DollarSign,
  Cpu,
  Layers,
  Search,
  ChevronDown,
  Info,
} from "lucide-react";
import ToolIcon from "@/components/ToolIcon";
import { AIDirectoryItem } from "@/lib/types";

// Curated 1-Click Comparison Presets for 2026
const PRESETS = [
  {
    id: "preset-reasoning",
    title: "Frontier Reasoning LLMs",
    slugs: ["gemini-4-argon", "claude-3-7-sonnet", "openai-o3"],
    description: "4M multimodal context vs. hybrid thinking vs. deliberate STEM logic",
    badge: "Reasoning",
  },
  {
    id: "preset-coding",
    title: "Agentic Coding IDEs",
    slugs: ["google-antigravity", "cursor", "windsurf"],
    description: "DeepMind autonomous workspace vs. shadow Composer vs. Cascade flows",
    badge: "Coding",
  },
  {
    id: "preset-ui",
    title: "AI UI & Frontend Generators",
    slugs: ["google-stitch", "v0-by-vercel", "bolt-new"],
    description: "Design-system React/Flutter export vs. Figma sync vs. in-browser WebContainer",
    badge: "Design",
  },
  {
    id: "preset-video",
    title: "Generative Video Foundation",
    slugs: ["veo-2", "openai-sora", "runway-gen-3"],
    description: "4K cinematic motion vs. world simulation physics vs. camera path controls",
    badge: "Video",
  },
  {
    id: "preset-open",
    title: "Open-Weights Champions",
    slugs: ["llama-4-maverick", "deepseek-r1", "mistral-large-2"],
    description: "Meta 400B+ MoE vs. reinforcement learning reasoning vs. European sovereign",
    badge: "Open Source",
  },
];

function CompareSkeleton() {
  return (
    <div className="min-h-screen bg-[#FFFFFF] dark:bg-[#060608] pt-24 pb-32">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 space-y-12 animate-pulse">
        <div className="h-10 w-80 bg-black/[0.04] dark:bg-white/[0.04] rounded-2xl mx-auto" />
        <div className="h-64 bg-black/[0.03] dark:bg-white/[0.03] rounded-3xl" />
      </div>
    </div>
  );
}

function CompareContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const queryTools = searchParams.get("tools");
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>(() => {
    if (queryTools) {
      return queryTools.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 3);
    }
    return ["gemini-4-argon", "claude-3-7-sonnet", "openai-o3"];
  });

  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [pickerSlotIndex, setPickerSlotIndex] = useState<number | null>(null);
  const [pickerSearch, setPickerSearch] = useState("");
  const [allTools, setAllTools] = useState<AIDirectoryItem[]>([]);

  useEffect(() => {
    async function loadDirectory() {
      try {
        const res = await fetch("/api/directory", { cache: "no-store" });
        const data = await res.json();
        if (data?.items && Array.isArray(data.items)) {
          setAllTools(data.items);
        }
      } catch (err) {
        console.warn("Failed to load compare directory:", err);
      }
    }
    loadDirectory();
  }, []);

  const updateUrl = (slugs: string[]) => {
    setSelectedSlugs(slugs);
    const param = slugs.join(",");
    router.push(`/compare?tools=${encodeURIComponent(param)}`, { scroll: false });
  };

  const comparedTools = useMemo(() => {
    return selectedSlugs
      .map((slug) => {
        const found = allTools.find(
          (t) => (t.slug || String(t.id)).toLowerCase() === slug.toLowerCase()
        );
        return found || null;
      })
      .filter(Boolean) as AIDirectoryItem[];
  }, [selectedSlugs, allTools]);

  const handleRemove = (slugToRemove: string) => {
    if (selectedSlugs.length <= 2) return;
    const next = selectedSlugs.filter((s) => s.toLowerCase() !== slugToRemove.toLowerCase());
    updateUrl(next);
  };

  const openPicker = (index?: number) => {
    setPickerSlotIndex(index !== undefined ? index : null);
    setPickerSearch("");
    setIsPickerOpen(true);
  };

  const handleSelectTool = (tool: AIDirectoryItem) => {
    const slug = tool.slug || String(tool.id);
    let next: string[] = [];

    if (pickerSlotIndex !== null && pickerSlotIndex < selectedSlugs.length) {
      next = [...selectedSlugs];
      next[pickerSlotIndex] = slug;
    } else {
      next = [...selectedSlugs, slug].slice(0, 3);
    }

    setIsPickerOpen(false);
    updateUrl(next);
  };

  const filteredPickerTools = useMemo(() => {
    const q = pickerSearch.toLowerCase().trim();
    return allTools.filter((t) => {
      if (selectedSlugs.includes(t.slug || String(t.id))) return false;
      if (!q) return true;
      return (
        t.name.toLowerCase().includes(q) ||
        (t.company && t.company.toLowerCase().includes(q)) ||
        (t.category && t.category.toLowerCase().includes(q))
      );
    });
  }, [pickerSearch, selectedSlugs, allTools]);

  return (
    <div className="min-h-screen bg-[#FFFFFF] dark:bg-[#060608] pt-24 pb-32 text-[#1F1F1F] dark:text-zinc-200 transition-colors duration-300">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 space-y-12">
        {/* HEADER & HERO */}
        <div className="text-center max-w-3xl mx-auto space-y-4 pt-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F0F4F9] dark:bg-white/[0.04] border border-black/[0.06] dark:border-white/[0.08] text-xs font-medium text-[#4285F4] dark:text-[#8AB4F8] shadow-sm">
            <Scale className="w-3.5 h-3.5" />
            <span>Interactive Side-by-Side Comparison Matrix</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-heading font-medium tracking-tight text-[#1F1F1F] dark:text-white">
            Compare Frontier AI Systems
          </h1>

          <p className="text-base text-[#5F6368] dark:text-zinc-400 font-sans leading-relaxed">
            Inspect multimodal context windows, inference speeds, pricing models, and key capabilities across any 2 or 3 foundation models, agentic IDEs, and generative tools.
          </p>
        </div>

        {/* CURATED PRESETS STRIP */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-[#5F6368] dark:text-zinc-400">
            <span className="font-medium">Curated Comparison Presets:</span>
            <span className="text-[#5F6368] dark:text-zinc-500">Select any preset or customize below</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {PRESETS.map((preset) => {
              const isActive =
                preset.slugs.length === selectedSlugs.length &&
                preset.slugs.every((s) => selectedSlugs.includes(s));

              return (
                <button
                  key={preset.id}
                  onClick={() => updateUrl(preset.slugs)}
                  className={`p-4 rounded-2xl text-left transition-all border flex flex-col justify-between space-y-2 group shadow-sm ${
                    isActive
                      ? "bg-[#4285F4]/10 border-[#4285F4] ring-2 ring-[#4285F4]/20"
                      : "bg-[#F8FAFD] dark:bg-[#11131A] border-black/[0.08] dark:border-white/[0.08] hover:border-[#4285F4]/40"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#1F1F1F] dark:text-white group-hover:text-[#4285F4] transition">
                      {preset.title}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-sans bg-black/[0.04] dark:bg-white/[0.06] text-[#5F6368] dark:text-zinc-400">
                      {preset.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#5F6368] dark:text-zinc-400 line-clamp-2 font-sans leading-snug">
                    {preset.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* COMPARISON MATRIX TABLE */}
        <div className="rounded-3xl border border-black/[0.08] dark:border-white/[0.1] bg-[#F8FAFD] dark:bg-[#11131A] overflow-hidden shadow-sm">
          {/* Header Row: Tool Identity & CTAs */}
          <div
            className="grid divide-x divide-black/[0.08] dark:divide-white/[0.08] border-b border-black/[0.08] dark:border-white/[0.08]"
            style={{
              gridTemplateColumns: `repeat(${comparedTools.length + (comparedTools.length < 3 ? 1 : 0)}, minmax(0, 1fr))`,
            }}
          >
            {comparedTools.map((tool, idx) => (
              <div key={tool.id || tool.slug} className="p-6 sm:p-8 space-y-6 flex flex-col justify-between relative group">
                {comparedTools.length > 2 && (
                  <button
                    onClick={() => handleRemove(tool.slug || String(tool.id))}
                    className="absolute top-4 right-4 p-1.5 rounded-full text-[#5F6368] hover:text-[#1F1F1F] dark:hover:text-white hover:bg-black/[0.06] dark:hover:bg-white/[0.08] transition"
                    title="Remove from comparison"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}

                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <ToolIcon
                      name={tool.name}
                      company={tool.company}
                      officialUrl={tool.officialUrl}
                      category={tool.category}
                      size={52}
                    />
                    <button
                      onClick={() => openPicker(idx)}
                      className="text-xs font-sans text-[#5F6368] hover:text-[#4285F4] transition flex items-center gap-1 font-medium"
                    >
                      <span>Swap</span>
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div>
                    <Link
                      href={`/tool/${tool.slug || tool.id}`}
                      className="text-2xl font-heading font-medium text-[#1F1F1F] dark:text-white hover:text-[#4285F4] transition inline-flex items-center gap-1.5"
                    >
                      <span>{tool.name}</span>
                    </Link>
                    <div className="text-xs text-[#5F6368] dark:text-zinc-400 mt-1 font-medium">
                      {tool.company || "Independent"}
                    </div>
                  </div>

                  <p className="text-xs text-[#5F6368] dark:text-zinc-400 font-sans leading-relaxed line-clamp-3">
                    {tool.tagline || tool.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-black/[0.06] dark:border-white/[0.06] flex items-center gap-2">
                  {tool.officialUrl && (
                    <a
                      href={tool.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2 px-3 rounded-xl bg-white dark:bg-white/[0.06] hover:bg-black/[0.04] dark:hover:bg-white/[0.12] text-xs font-medium text-[#1F1F1F] dark:text-white text-center transition flex items-center justify-center gap-1.5 border border-black/[0.08] dark:border-white/[0.08] shadow-sm"
                    >
                      <span>Visit Site</span>
                      <ExternalLink className="w-3 h-3 text-[#5F6368] dark:text-zinc-400" />
                    </a>
                  )}
                  <Link
                    href={`/tool/${tool.slug || tool.id}`}
                    className="py-2 px-3 rounded-xl bg-[#4285F4]/10 hover:bg-[#4285F4]/20 text-[#4285F4] dark:text-[#8AB4F8] text-xs font-medium text-center transition border border-[#4285F4]/20"
                  >
                    Specs
                  </Link>
                </div>
              </div>
            ))}

            {/* Add 3rd Tool Slot */}
            {comparedTools.length < 3 && (
              <div className="p-8 flex flex-col items-center justify-center text-center space-y-4 bg-black/[0.01] dark:bg-white/[0.01] transition">
                <div className="w-14 h-14 rounded-2xl bg-black/[0.04] dark:bg-white/[0.04] border border-dashed border-black/[0.15] dark:border-white/[0.15] flex items-center justify-center text-[#5F6368] dark:text-zinc-400">
                  <Plus className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-[#1F1F1F] dark:text-white">Compare 3rd Model</p>
                  <p className="text-xs text-[#5F6368] dark:text-zinc-500 font-sans">
                    Add another system to the matrix
                  </p>
                </div>
                <button
                  onClick={() => openPicker()}
                  className="px-4 py-2 rounded-xl bg-white dark:bg-white/[0.06] hover:bg-black/[0.04] dark:hover:bg-white/[0.12] border border-black/[0.1] dark:border-white/[0.1] text-xs font-medium text-[#1F1F1F] dark:text-white transition shadow-sm"
                >
                  Select AI Tool
                </button>
              </div>
            )}
          </div>

          {/* Section: Core Attributes */}
          <div className="px-6 py-3 bg-[#F0F4F9] dark:bg-black/40 border-b border-black/[0.08] dark:border-white/[0.08] text-xs font-medium text-[#4285F4] dark:text-[#8AB4F8] flex items-center gap-2">
            <Info className="w-3.5 h-3.5" />
            <span>CORE SPECIFICATIONS &amp; ARCHITECTURE</span>
          </div>

          {/* Row 1: Company Ecosystem */}
          <div
            className="grid divide-x divide-black/[0.08] dark:divide-white/[0.08] border-b border-black/[0.06] dark:border-white/[0.06] text-xs font-sans"
            style={{
              gridTemplateColumns: `repeat(${comparedTools.length + (comparedTools.length < 3 ? 1 : 0)}, minmax(0, 1fr))`,
            }}
          >
            {comparedTools.map((tool) => (
              <div key={tool.id || tool.slug} className="p-4 sm:p-5 space-y-1">
                <span className="text-[11px] text-[#5F6368] dark:text-zinc-500 uppercase block font-medium">Parent Ecosystem</span>
                <span className="text-[#1F1F1F] dark:text-white font-medium">{tool.company || "Independent"}</span>
              </div>
            ))}
            {comparedTools.length < 3 && <div className="p-5" />}
          </div>

          {/* Row 2: Category & Domain */}
          <div
            className="grid divide-x divide-black/[0.08] dark:divide-white/[0.08] border-b border-black/[0.06] dark:border-white/[0.06] text-xs font-sans"
            style={{
              gridTemplateColumns: `repeat(${comparedTools.length + (comparedTools.length < 3 ? 1 : 0)}, minmax(0, 1fr))`,
            }}
          >
            {comparedTools.map((tool) => (
              <div key={tool.id || tool.slug} className="p-4 sm:p-5 space-y-1">
                <span className="text-[11px] text-[#5F6368] dark:text-zinc-500 uppercase block font-medium">Primary Domain</span>
                <span className="text-[#1F1F1F] dark:text-white font-medium">{tool.category}</span>
              </div>
            ))}
            {comparedTools.length < 3 && <div className="p-5" />}
          </div>

          {/* Row 3: Pricing */}
          <div
            className="grid divide-x divide-black/[0.08] dark:divide-white/[0.08] border-b border-black/[0.06] dark:border-white/[0.06] text-xs font-sans"
            style={{
              gridTemplateColumns: `repeat(${comparedTools.length + (comparedTools.length < 3 ? 1 : 0)}, minmax(0, 1fr))`,
            }}
          >
            {comparedTools.map((tool) => (
              <div key={tool.id || tool.slug} className="p-4 sm:p-5 space-y-1">
                <span className="text-[11px] text-[#5F6368] dark:text-zinc-500 uppercase block font-medium">Pricing Model</span>
                <span className="text-[#1F1F1F] dark:text-white font-medium">{tool.pricing || "Freemium"}</span>
              </div>
            ))}
            {comparedTools.length < 3 && <div className="p-5" />}
          </div>

          {/* Row 4: Best For */}
          <div
            className="grid divide-x divide-black/[0.08] dark:divide-white/[0.08] border-b border-black/[0.06] dark:border-white/[0.06] text-xs font-sans"
            style={{
              gridTemplateColumns: `repeat(${comparedTools.length + (comparedTools.length < 3 ? 1 : 0)}, minmax(0, 1fr))`,
            }}
          >
            {comparedTools.map((tool) => (
              <div key={tool.id || tool.slug} className="p-4 sm:p-5 space-y-1">
                <span className="text-[11px] text-[#5F6368] dark:text-zinc-500 uppercase block font-medium">Best For</span>
                <span className="text-[#1F1F1F] dark:text-white font-medium">{tool.bestFor || "Developers & Teams"}</span>
              </div>
            ))}
            {comparedTools.length < 3 && <div className="p-5" />}
          </div>

          {/* Row 5: Key Capabilities */}
          <div
            className="grid divide-x divide-black/[0.08] dark:divide-white/[0.08] text-xs font-sans"
            style={{
              gridTemplateColumns: `repeat(${comparedTools.length + (comparedTools.length < 3 ? 1 : 0)}, minmax(0, 1fr))`,
            }}
          >
            {comparedTools.map((tool) => {
              const feats = Array.isArray(tool.keyFeatures) ? tool.keyFeatures : [];
              return (
                <div key={tool.id || tool.slug} className="p-6 space-y-3">
                  <span className="text-[11px] text-[#5F6368] dark:text-zinc-500 uppercase block font-medium">Verified Capabilities</span>
                  <div className="space-y-2">
                    {feats.map((f, i) => (
                      <div key={i} className="flex items-start gap-2 text-[#1F1F1F] dark:text-zinc-300">
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
            {comparedTools.length < 3 && <div className="p-6" />}
          </div>
        </div>
      </div>

      {/* TOOL SELECTOR PICKER MODAL */}
      {isPickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#11131A] border border-black/[0.08] dark:border-white/[0.1] shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-black/[0.06] dark:border-white/[0.08]">
              <h3 className="text-base font-semibold text-[#1F1F1F] dark:text-white">
                Select AI System to Compare
              </h3>
              <button
                onClick={() => setIsPickerOpen(false)}
                className="text-[#5F6368] dark:text-zinc-400 hover:text-[#1F1F1F] dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-[#5F6368] dark:text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={pickerSearch}
                onChange={(e) => setPickerSearch(e.target.value)}
                placeholder="Search tools or companies..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F0F4F9] dark:bg-[#1A1D24] border border-black/[0.08] dark:border-white/[0.08] text-xs focus:outline-none focus:border-[#4285F4] text-[#1F1F1F] dark:text-white"
                autoFocus
              />
            </div>

            <div className="max-h-72 overflow-y-auto divide-y divide-black/[0.06] dark:divide-white/[0.06] pr-1">
              {filteredPickerTools.map((t) => (
                <button
                  key={t.id || t.slug}
                  onClick={() => handleSelectTool(t)}
                  className="w-full py-3 px-2 flex items-center justify-between text-left hover:bg-black/[0.03] dark:hover:bg-white/[0.04] rounded-xl transition"
                >
                  <div className="flex items-center gap-3">
                    <ToolIcon name={t.name} company={t.company} officialUrl={t.officialUrl} size={32} />
                    <div>
                      <div className="text-xs font-semibold text-[#1F1F1F] dark:text-white">{t.name}</div>
                      <div className="text-[10px] text-[#5F6368] dark:text-[#8E9196]">{t.company} • {t.category}</div>
                    </div>
                  </div>
                  <span className="text-xs text-[#4285F4] font-medium">Select</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={<CompareSkeleton />}>
      <CompareContent />
    </Suspense>
  );
}
