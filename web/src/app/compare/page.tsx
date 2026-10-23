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
import { AI_DIRECTORY_DATA } from "@/data/aiDirectoryData";
import { AIDirectoryItem } from "@/lib/types";

// Curated 1-Click Comparison Presets
const PRESETS = [
  {
    id: "preset-coding",
    title: "Agentic Coding IDEs",
    slugs: ["google-antigravity", "cursor", "opencode"],
    description: "DeepMind autonomous workspace vs. shadow editing vs. open source swarms",
    badge: "Coding",
  },
  {
    id: "preset-reasoning",
    title: "Frontier Reasoning LLMs",
    slugs: ["google-gemini", "claude-3-7-sonnet", "openai-o3-mini"],
    description: "2M multimodal context vs. hybrid thinking vs. deliberate STEM logic",
    badge: "Reasoning",
  },
  {
    id: "preset-ui",
    title: "AI UI & Frontend Generators",
    slugs: ["google-stitch", "v0-by-vercel", "bolt-new"],
    description: "Design-system React/Flutter export vs. shadcn Next.js vs. in-browser sandbox",
    badge: "Design",
  },
  {
    id: "preset-video",
    title: "Generative Video Foundation",
    slugs: ["google-veo", "openai-sora", "runway-gen3"],
    description: "1080p physics comprehension vs. world dynamics vs. camera control",
    badge: "Video",
  },
  {
    id: "preset-open",
    title: "Open-Weights Champions",
    slugs: ["llama-3-3", "deepseek-r1", "mistral-large-2"],
    description: "Meta 70B cost-efficiency vs. pure RL reasoning traces vs. European frontier",
    badge: "Open Source",
  },
];

function CompareContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Active tool IDs to compare (2 to 3)
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [pickerSlotIndex, setPickerSlotIndex] = useState<number | null>(null);
  const [pickerSearch, setPickerSearch] = useState("");

  // Initialize from searchParams or default preset
  useEffect(() => {
    const toolsParam = searchParams.get("tools");
    if (toolsParam) {
      const parsed = toolsParam
        .split(",")
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean)
        .slice(0, 3);

      if (parsed.length >= 2) {
        setSelectedSlugs(parsed);
        return;
      }
    }
    // Default to first preset
    setSelectedSlugs(["google-antigravity", "cursor", "opencode"]);
  }, [searchParams]);

  // Update query string when selected tools change
  const updateUrl = (slugs: string[]) => {
    setSelectedSlugs(slugs);
    router.replace(`/compare?tools=${slugs.join(",")}`, { scroll: false });
  };

  // Resolve tools from data
  const comparedTools = useMemo(() => {
    return selectedSlugs
      .map((slug) => {
        return (
          AI_DIRECTORY_DATA.find(
            (t) =>
              (t.slug && t.slug.toLowerCase() === slug.toLowerCase()) ||
              String(t.id).toLowerCase() === slug.toLowerCase()
          ) || null
        );
      })
      .filter((t): t is AIDirectoryItem => t !== null);
  }, [selectedSlugs]);

  // Remove a tool from comparison (minimum 2)
  const handleRemove = (slug: string) => {
    if (selectedSlugs.length <= 2) return;
    const next = selectedSlugs.filter((s) => s.toLowerCase() !== slug.toLowerCase());
    updateUrl(next);
  };

  // Open picker to replace or add a slot
  const openPicker = (index?: number) => {
    setPickerSlotIndex(index !== undefined ? index : null);
    setPickerSearch("");
    setIsPickerOpen(true);
  };

  // Select tool from picker
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

  // Filtered tools inside picker modal
  const filteredPickerTools = useMemo(() => {
    const q = pickerSearch.toLowerCase().trim();
    return AI_DIRECTORY_DATA.filter((t) => {
      if (selectedSlugs.includes(t.slug || String(t.id))) return false;
      if (!q) return true;
      return (
        t.name.toLowerCase().includes(q) ||
        (t.company && t.company.toLowerCase().includes(q)) ||
        (t.category && t.category.toLowerCase().includes(q))
      );
    });
  }, [pickerSearch, selectedSlugs]);

  return (
    <div className="min-h-screen bg-[#090A0F] pt-24 pb-32 text-zinc-200">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 space-y-12">
        {/* =====================================================================
            HEADER & HERO
        ===================================================================== */}
        <div className="text-center max-w-3xl mx-auto space-y-4 pt-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-[#38BDF8]">
            <Scale className="w-3.5 h-3.5" />
            <span>Interactive Side-by-Side Comparison Matrix</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-heading font-medium tracking-tight text-white">
            Compare Frontier AI Systems
          </h1>

          <p className="text-base text-zinc-400 font-sans leading-relaxed">
            Inspect multimodal context windows, inference speeds, pricing models, and key capabilities across any 2 or 3 foundation models, agentic IDEs, and generative tools.
          </p>
        </div>

        {/* =====================================================================
            CURATED PRESETS STRIP
        ===================================================================== */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span>Curated Comparison Presets:</span>
            <span className="text-zinc-600">Select any preset or customize below</span>
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
                  className={`p-3.5 rounded-2xl text-left transition-all border flex flex-col justify-between space-y-2 group ${
                    isActive
                      ? "bg-gradient-to-b from-[#6366F1]/15 to-[#38BDF8]/10 border-[#38BDF8]/50 shadow-lg shadow-indigo-500/10"
                      : "bg-[#11131A] border-white/[0.08] hover:border-white/[0.18] hover:bg-[#161923]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-white group-hover:text-[#38BDF8] transition">
                      {preset.title}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-white/[0.06] text-zinc-400">
                      {preset.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 line-clamp-2 font-sans leading-snug">
                    {preset.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* =====================================================================
            COMPARISON MATRIX TABLE
        ===================================================================== */}
        <div className="rounded-3xl border border-white/[0.1] bg-[#11131A] overflow-hidden shadow-2xl">
          {/* Header Row: Tool Identity & CTAs */}
          <div
            className="grid divide-x divide-white/[0.08] border-b border-white/[0.08]"
            style={{
              gridTemplateColumns: `repeat(${comparedTools.length + (comparedTools.length < 3 ? 1 : 0)}, minmax(0, 1fr))`,
            }}
          >
            {comparedTools.map((tool, idx) => (
              <div key={tool.id || tool.slug} className="p-6 sm:p-8 space-y-6 flex flex-col justify-between relative group">
                {/* Remove button if >= 3 tools */}
                {comparedTools.length > 2 && (
                  <button
                    onClick={() => handleRemove(tool.slug || String(tool.id))}
                    className="absolute top-4 right-4 p-1.5 rounded-full text-zinc-500 hover:text-white hover:bg-white/[0.08] transition"
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
                      className="text-xs font-mono text-zinc-500 hover:text-[#38BDF8] transition flex items-center gap-1"
                    >
                      <span>Swap</span>
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div>
                    <Link
                      href={`/tool/${tool.slug || tool.id}`}
                      className="text-2xl font-heading font-medium text-white hover:text-[#38BDF8] transition inline-flex items-center gap-1.5"
                    >
                      <span>{tool.name}</span>
                    </Link>
                    <div className="text-xs font-mono text-zinc-400 mt-1">
                      {tool.company || "Independent"}
                    </div>
                  </div>

                  <p className="text-xs text-zinc-400 font-sans leading-relaxed line-clamp-3">
                    {tool.tagline || tool.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/[0.06] flex items-center gap-2">
                  {tool.officialUrl && (
                    <a
                      href={tool.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2 px-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-xs font-medium text-white text-center transition flex items-center justify-center gap-1.5 border border-white/[0.08]"
                    >
                      <span>Visit Official Site</span>
                      <ExternalLink className="w-3 h-3 text-zinc-400" />
                    </a>
                  )}
                  <Link
                    href={`/tool/${tool.slug || tool.id}`}
                    className="py-2 px-3 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 text-xs font-medium text-center transition border border-indigo-500/20"
                  >
                    Specs
                  </Link>
                </div>
              </div>
            ))}

            {/* Add 3rd Tool Slot */}
            {comparedTools.length < 3 && (
              <div className="p-8 flex flex-col items-center justify-center text-center space-y-4 bg-white/[0.01] hover:bg-white/[0.02] transition">
                <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-dashed border-white/[0.15] flex items-center justify-center text-zinc-400">
                  <Plus className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-white">Compare 3rd Model</p>
                  <p className="text-xs text-zinc-500 font-sans">
                    Add another tool to the matrix
                  </p>
                </div>
                <button
                  onClick={() => openPicker()}
                  className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] text-xs font-medium text-white transition"
                >
                  Select AI Tool
                </button>
              </div>
            )}
          </div>

          {/* Section: Core Attributes */}
          <div className="px-6 py-3 bg-black/40 border-b border-white/[0.08] text-xs font-mono font-medium text-[#38BDF8] flex items-center gap-2">
            <Info className="w-3.5 h-3.5" />
            <span>CORE SPECIFICATIONS &amp; ARCHITECTURE</span>
          </div>

          {/* Row 1: Company Ecosystem */}
          <div
            className="grid divide-x divide-white/[0.08] border-b border-white/[0.06] text-xs font-sans"
            style={{
              gridTemplateColumns: `repeat(${comparedTools.length + (comparedTools.length < 3 ? 1 : 0)}, minmax(0, 1fr))`,
            }}
          >
            {comparedTools.map((tool) => (
              <div key={tool.id || tool.slug} className="p-4 sm:p-5 space-y-1">
                <span className="text-[11px] font-mono text-zinc-500 uppercase block">Parent Ecosystem</span>
                <span className="text-white font-medium">{tool.company || "Independent"}</span>
              </div>
            ))}
            {comparedTools.length < 3 && <div className="p-5" />}
          </div>

          {/* Row 2: Category & Domain */}
          <div
            className="grid divide-x divide-white/[0.08] border-b border-white/[0.06] text-xs font-sans"
            style={{
              gridTemplateColumns: `repeat(${comparedTools.length + (comparedTools.length < 3 ? 1 : 0)}, minmax(0, 1fr))`,
            }}
          >
            {comparedTools.map((tool) => (
              <div key={tool.id || tool.slug} className="p-4 sm:p-5 space-y-1">
                <span className="text-[11px] font-mono text-zinc-500 uppercase block">Category</span>
                <span className="text-white font-medium">{tool.category || "General AI"}</span>
              </div>
            ))}
            {comparedTools.length < 3 && <div className="p-5" />}
          </div>

          {/* Row 3: Pricing Tier & License */}
          <div
            className="grid divide-x divide-white/[0.08] border-b border-white/[0.06] text-xs font-sans"
            style={{
              gridTemplateColumns: `repeat(${comparedTools.length + (comparedTools.length < 3 ? 1 : 0)}, minmax(0, 1fr))`,
            }}
          >
            {comparedTools.map((tool) => (
              <div key={tool.id || tool.slug} className="p-4 sm:p-5 space-y-1">
                <span className="text-[11px] font-mono text-zinc-500 uppercase block">Pricing Model</span>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full font-mono text-[11px] bg-white/[0.06] text-white border border-white/[0.1]">
                    {tool.pricing || "Freemium"}
                  </span>
                  <span className="text-zinc-500 text-[11px]">
                    {tool.pricing === "Open Source" ? "Permissive License" : "Commercial SaaS"}
                  </span>
                </div>
              </div>
            ))}
            {comparedTools.length < 3 && <div className="p-5" />}
          </div>

          {/* Row 4: Recommended Target Audience */}
          <div
            className="grid divide-x divide-white/[0.08] border-b border-white/[0.06] text-xs font-sans"
            style={{
              gridTemplateColumns: `repeat(${comparedTools.length + (comparedTools.length < 3 ? 1 : 0)}, minmax(0, 1fr))`,
            }}
          >
            {comparedTools.map((tool) => (
              <div key={tool.id || tool.slug} className="p-4 sm:p-5 space-y-1">
                <span className="text-[11px] font-mono text-zinc-500 uppercase block">Best For</span>
                <p className="text-zinc-300 leading-relaxed">{tool.bestFor || "Enterprise teams and developers."}</p>
              </div>
            ))}
            {comparedTools.length < 3 && <div className="p-5" />}
          </div>

          {/* Section: Key Capabilities Checklist */}
          <div className="px-6 py-3 bg-black/40 border-b border-white/[0.08] text-xs font-mono font-medium text-emerald-400 flex items-center gap-2">
            <Check className="w-3.5 h-3.5" />
            <span>VERIFIED CAPABILITIES CHECKLIST</span>
          </div>

          {/* Row 5: Features side by side */}
          <div
            className="grid divide-x divide-white/[0.08] text-xs font-sans"
            style={{
              gridTemplateColumns: `repeat(${comparedTools.length + (comparedTools.length < 3 ? 1 : 0)}, minmax(0, 1fr))`,
            }}
          >
            {comparedTools.map((tool) => (
              <div key={tool.id || tool.slug} className="p-6 space-y-3">
                {tool.keyFeatures && tool.keyFeatures.length > 0 ? (
                  tool.keyFeatures.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2.5">
                      <div className="w-4 h-4 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5 text-emerald-400" />
                      </div>
                      <span className="text-zinc-300 leading-snug">{feat}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-zinc-500 text-xs">Standard foundation model capabilities.</p>
                )}
              </div>
            ))}
            {comparedTools.length < 3 && <div className="p-6" />}
          </div>
        </div>
      </div>

      {/* =====================================================================
          TOOL PICKER MODAL
      ===================================================================== */}
      {isPickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="fixed inset-0" onClick={() => setIsPickerOpen(false)} />

          <div className="relative w-full max-w-lg bg-[#11131A] border border-white/[0.12] rounded-3xl p-6 shadow-2xl z-10 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div>
                <h3 className="text-lg font-medium text-white">Select AI Tool</h3>
                <p className="text-xs text-zinc-400 font-sans">
                  Choose an AI model or IDE to add to the matrix
                </p>
              </div>
              <button
                onClick={() => setIsPickerOpen(false)}
                className="p-1 rounded-full text-zinc-500 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Input */}
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#161923] border border-white/[0.08]">
              <Search className="w-4 h-4 text-zinc-500" />
              <input
                type="text"
                value={pickerSearch}
                onChange={(e) => setPickerSearch(e.target.value)}
                placeholder="Search by name or company..."
                className="w-full bg-transparent text-sm text-white placeholder-zinc-500 outline-none"
                autoFocus
              />
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto divide-y divide-white/[0.04] -mx-2 px-2">
              {filteredPickerTools.length === 0 ? (
                <div className="py-8 text-center text-xs text-zinc-500">No matching tools found.</div>
              ) : (
                filteredPickerTools.map((tool) => (
                  <button
                    key={tool.id || tool.slug}
                    onClick={() => handleSelectTool(tool)}
                    className="w-full flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-white/[0.06] text-left transition group"
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-3">
                      <ToolIcon
                        name={tool.name}
                        company={tool.company}
                        officialUrl={tool.officialUrl}
                        category={tool.category}
                        size={28}
                      />
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-white group-hover:text-[#38BDF8] transition truncate">
                          {tool.name}
                        </div>
                        <div className="text-xs text-zinc-500 truncate">
                          {tool.company || "Independent"} • {tool.category}
                        </div>
                      </div>
                    </div>

                    <span className="text-[11px] font-mono text-zinc-400 px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.06] shrink-0">
                      {tool.pricing || "Freemium"}
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#090A0F] pt-32 text-center text-zinc-500 font-mono text-sm">
          Loading AI Comparison Engine...
        </div>
      }
    >
      <CompareContent />
    </Suspense>
  );
}
