"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Sparkles,
  Command,
  ArrowRight,
  ExternalLink,
  Layers,
  Cpu,
  Newspaper,
  Sliders,
  Scale,
  Compass,
  Building2,
  X,
  CornerDownLeft,
} from "lucide-react";
import ToolIcon from "./ToolIcon";
import { AIDirectoryItem } from "@/lib/types";

interface PaletteItem {
  id: string;
  title: string;
  subtitle: string;
  category: "navigation" | "tool" | "ecosystem" | "news";
  href: string;
  badge?: string;
  toolData?: {
    company?: string;
    officialUrl?: string;
    category?: string;
  };
}

const STATIC_NAV_ITEMS: PaletteItem[] = [
  {
    id: "nav-home",
    title: "Home Overview",
    subtitle: "Global AI foundation models, agentic IDEs, and breaking intelligence",
    category: "navigation",
    href: "/",
    badge: "Page",
  },
  {
    id: "nav-models",
    title: "All Models & Directory",
    subtitle: "120+ verified frontier models with ordered A–Z filters",
    category: "navigation",
    href: "/models",
    badge: "Catalog",
  },
  {
    id: "nav-compare",
    title: "AI Model & Tool Comparison Engine",
    subtitle: "Side-by-side specifications, architectures, and pricing matrix",
    category: "navigation",
    href: "/compare",
    badge: "Compare",
  },
  {
    id: "nav-ecosystems",
    title: "Company Ecosystems Explorer",
    subtitle: "Google DeepMind, OpenAI, Anthropic, Meta, Microsoft trees",
    category: "navigation",
    href: "/ecosystems",
    badge: "Hub",
  },
  {
    id: "nav-news",
    title: "Daily AI Research & News Wire",
    subtitle: "Live dispatches, paper releases, and frontier breakthroughs",
    category: "navigation",
    href: "/news",
    badge: "News",
  },
  {
    id: "nav-about",
    title: "About Optimus Prime",
    subtitle: "Autonomous intelligence taxonomy and platform methodology",
    category: "navigation",
    href: "/about",
    badge: "About",
  },
];

const ECOSYSTEM_ENTRIES: Array<{ name: string; toolsCount: number; lead: string }> = [
  { name: "Google", toolsCount: 10, lead: "Gemini 2.5 Flash, Antigravity, Stitch, NotebookLM, Veo" },
  { name: "OpenAI", toolsCount: 10, lead: "ChatGPT, GPT-4o, o3-mini, o1, Operator, Sora, Whisper" },
  { name: "Anthropic", toolsCount: 6, lead: "Claude 3.7 Sonnet, Claude Code, Artifacts, MCP" },
  { name: "Meta", toolsCount: 7, lead: "Llama 3.3 70B, Llama 3.1 405B, Movie Gen, SAM 2" },
  { name: "Microsoft & GitHub", toolsCount: 7, lead: "Copilot, AutoGen Studio, Phi-4, Semantic Kernel" },
  { name: "DeepSeek", toolsCount: 4, lead: "DeepSeek-R1, DeepSeek-V3, DeepSeek-Coder-V2" },
  { name: "Mistral", toolsCount: 6, lead: "Mistral Large 2, Codestral, Pixtral 12B, Le Chat" },
  { name: "xAI", toolsCount: 3, lead: "Grok-3, Grok-2, Grok Vision on Colossus 100k GPUs" },
  { name: "Developer & Search Leaders", toolsCount: 12, lead: "Cursor, Windsurf, v0, Lovable, Devin, Perplexity" },
  { name: "Creative & Editing Specialists", toolsCount: 14, lead: "Midjourney, Runway Gen-3, Flux.1, ElevenLabs" },
  { name: "Open Source & Independent", toolsCount: 20, lead: "Hugging Face, Ollama, vLLM, LangGraph, CrewAI" },
];

export default function CommandPalette() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<"all" | "tools" | "ecosystems" | "news">("all");
  const inputRef = useRef<HTMLInputElement>(null);

  // Global Keyboard Listener for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        setIsOpen(false);
      }
    };

    const handleCustomOpen = () => {
      setIsOpen(true);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-command-palette", handleCustomOpen);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-command-palette", handleCustomOpen);
    };
  }, [isOpen]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const [liveTools, setLiveTools] = useState<AIDirectoryItem[]>([]);

  useEffect(() => {
    async function fetchTools() {
      try {
        const res = await fetch("/api/directory", { cache: "no-store" });
        const data = await res.json();
        if (data?.items && Array.isArray(data.items)) {
          setLiveTools(data.items);
        }
      } catch {}
    }
    fetchTools();
  }, []);

  // Compute matched items
  const filteredItems = useMemo(() => {
    const q = query.toLowerCase().trim();
    const results: PaletteItem[] = [];

    // 1. Navigation Pages
    if (activeTab === "all") {
      const matchedNav = STATIC_NAV_ITEMS.filter(
        (nav) => !q || nav.title.toLowerCase().includes(q) || nav.subtitle.toLowerCase().includes(q)
      );
      results.push(...matchedNav);
    }

    // 2. Company Ecosystems
    if (activeTab === "all" || activeTab === "ecosystems") {
      const matchedEcosystems: PaletteItem[] = ECOSYSTEM_ENTRIES.filter(
        (eco) => !q || eco.name.toLowerCase().includes(q) || eco.lead.toLowerCase().includes(q)
      ).map((eco) => ({
        id: `eco-${eco.name.toLowerCase().replace(/\s+/g, "-")}`,
        title: `${eco.name} Ecosystem`,
        subtitle: `${eco.toolsCount} verified models • ${eco.lead}`,
        category: "ecosystem",
        href: `/models?company=${encodeURIComponent(eco.name)}`,
        badge: "Ecosystem",
      }));
      results.push(...matchedEcosystems);
    }

    // 3. AI Directory Tools
    if (activeTab === "all" || activeTab === "tools") {
      const matchedTools: PaletteItem[] = liveTools.filter((tool) => {
        if (!q) return tool.isFeatured;
        return (
          tool.name.toLowerCase().includes(q) ||
          (tool.company && tool.company.toLowerCase().includes(q)) ||
          (tool.category && tool.category.toLowerCase().includes(q)) ||
          (tool.tagline && tool.tagline.toLowerCase().includes(q)) ||
          (tool.description && tool.description.toLowerCase().includes(q)) ||
          (tool.keyFeatures && tool.keyFeatures.some((kf) => kf.toLowerCase().includes(q)))
        );
      })
        .slice(0, 25)
        .map((tool) => ({
          id: `tool-${tool.id}`,
          title: tool.name,
          subtitle: `${tool.company || "Independent"} • ${tool.tagline || tool.description?.slice(0, 80) || ""}`,
          category: "tool",
          href: `/tool/${tool.slug || tool.id}`,
          badge: tool.pricing || "Tool",
          toolData: {
            company: tool.company,
            officialUrl: tool.officialUrl,
            category: tool.category,
          },
        }));
      results.push(...matchedTools);
    }

    // 4. Daily News / Comparison quick action
    if (activeTab === "all" || activeTab === "news") {
      if (!q || q.includes("news") || q.includes("wire") || q.includes("paper")) {
        results.push({
          id: "action-news",
          title: "Explore Daily AI Research & News Wire",
          subtitle: "Latest breaking launches from DeepMind, Anthropic, OpenAI, Meta, Mistral",
          category: "news",
          href: "/news",
          badge: "Live Feed",
        });
      }
    }

    return results;
  }, [query, activeTab]);

  // Keep selected index within bounds
  useEffect(() => {
    if (selectedIndex >= filteredItems.length) {
      setSelectedIndex(Math.max(0, filteredItems.length - 1));
    }
  }, [filteredItems.length, selectedIndex]);

  // Keyboard navigation inside the palette
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1 < filteredItems.length ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : filteredItems.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const selected = filteredItems[selectedIndex];
      if (selected) {
        setIsOpen(false);
        router.push(selected.href);
      }
    }
  };

  const handleSelect = (item: PaletteItem) => {
    setIsOpen(false);
    router.push(item.href);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 sm:pt-28 px-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
      {/* Click outside backdrop */}
      <div className="fixed inset-0" onClick={() => setIsOpen(false)} />

      {/* Palette Container */}
      <div className="relative w-full max-w-2xl bg-[#0F1017] border border-white/[0.12] rounded-3xl shadow-2xl shadow-black/80 overflow-hidden flex flex-col z-10 animate-in zoom-in-95 duration-150">
        {/* Search Header Bar */}
        <div className="flex items-center px-5 py-4 border-b border-white/[0.08] gap-3">
          <Search className="w-5 h-5 text-[#38BDF8] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search AI models, ecosystems (e.g. 'Google'), IDEs, or news..."
            className="w-full bg-transparent text-white placeholder-zinc-500 font-sans text-base outline-none tracking-tight"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 rounded-full text-zinc-500 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white/[0.06] border border-white/[0.1] text-[11px] font-mono text-zinc-400">
            ESC
          </kbd>
        </div>

        {/* Quick Filter Category Pills */}
        <div className="flex items-center gap-1.5 px-5 py-2.5 bg-black/40 border-b border-white/[0.06] text-xs font-sans overflow-x-auto">
          {(
            [
              { id: "all", label: "All Intelligence" },
              { id: "tools", label: "AI Models & Tools" },
              { id: "ecosystems", label: "Company Ecosystems" },
              { id: "news", label: "Daily Wire" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSelectedIndex(0);
              }}
              className={`px-3 py-1 rounded-full transition-all shrink-0 ${
                activeTab === tab.id
                  ? "bg-white/[0.12] text-white font-medium border border-white/20"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="max-h-[380px] overflow-y-auto p-2 divide-y divide-white/[0.03]">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-zinc-500 text-sm font-sans space-y-2">
              <Compass className="w-8 h-8 text-zinc-600 mx-auto stroke-[1.5]" />
              <p>No AI tools, ecosystems, or dispatches matching &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-zinc-600">Try searching &ldquo;Google&rdquo;, &ldquo;Reasoning&rdquo;, &ldquo;Cursor&rdquo;, or &ldquo;DeepSeek&rdquo;</p>
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3.5 py-3 rounded-2xl cursor-pointer transition-all ${
                    isSelected
                      ? "bg-gradient-to-r from-indigo-500/15 via-white/[0.08] to-transparent border border-white/[0.12]"
                      : "hover:bg-white/[0.04] border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0 pr-4">
                    {item.category === "tool" ? (
                      <ToolIcon
                        name={item.title}
                        company={item.toolData?.company}
                        officialUrl={item.toolData?.officialUrl}
                        category={item.toolData?.category}
                        size={32}
                      />
                    ) : item.category === "ecosystem" ? (
                      <div className="w-8 h-8 rounded-xl bg-blue-500/15 border border-blue-500/25 flex items-center justify-center shrink-0">
                        <Building2 className="w-4 h-4 text-[#38BDF8]" />
                      </div>
                    ) : item.category === "news" ? (
                      <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center shrink-0">
                        <Newspaper className="w-4 h-4 text-amber-400" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center shrink-0">
                        <Sparkles className="w-4 h-4 text-indigo-400" />
                      </div>
                    )}

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white truncate">
                          {item.title}
                        </span>
                        {item.badge && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-white/[0.06] text-zinc-400 border border-white/[0.06] shrink-0">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-400 truncate mt-0.5 font-sans">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    {isSelected && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#38BDF8]">
                        <span>Open</span>
                        <CornerDownLeft className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Shortcut Hints */}
        <div className="px-5 py-3 border-t border-white/[0.08] bg-black/60 flex items-center justify-between text-[11px] font-mono text-zinc-400">
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white/[0.08] text-zinc-300">↑</kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-white/[0.08] text-zinc-300">↓</kbd>
              <span className="ml-1 text-zinc-500">Navigate</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white/[0.08] text-zinc-300">↵</kbd>
              <span className="ml-1 text-zinc-500">Select</span>
            </span>
          </div>
          <div>
            <span className="text-zinc-500">Optimus Prime • Spotlight Engine</span>
          </div>
        </div>
      </div>
    </div>
  );
}
