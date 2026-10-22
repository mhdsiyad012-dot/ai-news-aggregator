"use client";

import React, { useEffect, useState } from "react";
import { 
  X, 
  ExternalLink, 
  CheckCircle2, 
  Layers, 
  CreditCard, 
  Sparkles, 
  Copy, 
  Check,
  Bookmark,
  Newspaper,
  Terminal,
  ArrowRight,
  ShieldAlert
} from "lucide-react";
import { AIDirectoryItem, NewsArticle } from "@/lib/types";
import { BrandLogo } from "./BrandLogo";
import { useBookmarks } from "@/lib/bookmarks";

interface ModelDetailDrawerProps {
  tool: AIDirectoryItem | null;
  isOpen: boolean;
  onClose: () => void;
  isCompared: boolean;
  onToggleCompare: (tool: AIDirectoryItem) => void;
  allArticles?: NewsArticle[];
  onOpenArticle?: (article: NewsArticle) => void;
}

export function ModelDetailDrawer({
  tool,
  isOpen,
  onClose,
  isCompared,
  onToggleCompare,
  allArticles = [],
  onOpenArticle,
}: ModelDetailDrawerProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedPromptIdx, setCopiedPromptIdx] = useState<number | null>(null);

  const { isToolSaved, toggleToolBookmark } = useBookmarks();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !tool) return null;

  const bookmarked = isToolSaved(tool.slug);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(tool.official_url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyPrompt = (promptText: string, idx: number) => {
    navigator.clipboard.writeText(promptText);
    setCopiedPromptIdx(idx);
    setTimeout(() => setCopiedPromptIdx(null), 2000);
  };

  // Find related news articles that match tool name or slug or keywords
  const toolNameLower = tool.name.toLowerCase();
  const toolSlugLower = tool.slug.toLowerCase();
  const relatedArticles = allArticles.filter((art) => {
    const titleLower = art.title.toLowerCase();
    const summaryLower = art.summary.toLowerCase();
    const relatedLower = (art.related_tools || "").toLowerCase();

    // Check if article explicitly relates to this tool
    return (
      titleLower.includes(toolSlugLower) ||
      summaryLower.includes(toolSlugLower) ||
      relatedLower.includes(toolSlugLower) ||
      (toolNameLower.includes("gemini") && (titleLower.includes("gemini") || summaryLower.includes("gemini"))) ||
      (toolNameLower.includes("claude") && (titleLower.includes("claude") || summaryLower.includes("claude"))) ||
      (toolNameLower.includes("deepseek") && (titleLower.includes("deepseek") || summaryLower.includes("deepseek"))) ||
      (toolNameLower.includes("cursor") && (titleLower.includes("cursor") || summaryLower.includes("cursor"))) ||
      (toolNameLower.includes("chatgpt") && (titleLower.includes("chatgpt") || titleLower.includes("gpt-4"))) ||
      (toolNameLower.includes("sora") && (titleLower.includes("sora") || summaryLower.includes("sora"))) ||
      (toolNameLower.includes("llama") && (titleLower.includes("llama") || summaryLower.includes("llama")))
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      {/* Backdrop click to close */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Drawer Panel */}
      <div 
        className="relative z-10 flex h-full w-full max-w-2xl flex-col border-l border-white/[0.08] bg-[#0E0E12] text-[#FAFAFA] shadow-2xl animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar */}
        <div className="flex items-center justify-between border-b border-white/[0.08] bg-[#121318] px-6 py-4">
          <div className="flex items-center space-x-2 text-xs font-medium text-zinc-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span>MODEL SPECIFICATIONS</span>
          </div>

          <div className="flex items-center space-x-2">
            {/* Bookmark button */}
            <button
              onClick={() => toggleToolBookmark(tool.slug)}
              className={`flex items-center space-x-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                bookmarked
                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                  : "border-white/[0.08] bg-white/[0.04] text-zinc-300 hover:text-white"
              }`}
            >
              <Bookmark className={`h-3.5 w-3.5 ${bookmarked ? "fill-current" : ""}`} />
              <span>{bookmarked ? "Saved" : "Save"}</span>
            </button>

            {/* Compare Toggle */}
            <button
              onClick={() => onToggleCompare(tool)}
              className={`flex items-center space-x-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                isCompared
                  ? "border-emerald-500/50 bg-emerald-500/20 text-emerald-300"
                  : "border-white/[0.08] bg-white/[0.04] text-zinc-300 hover:text-white"
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>{isCompared ? "In Comparison" : "+ Compare"}</span>
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="rounded-lg border border-white/[0.08] bg-white/[0.04] p-1.5 text-zinc-400 hover:text-white transition-colors"
              title="Close Drawer (Esc)"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Drawer Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-7">
          {/* Header Card: Brand Logo + Name + Creator + Actions */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#121318] p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex items-start space-x-4">
                <BrandLogo
                  slug={tool.slug}
                  name={tool.name}
                  creator={tool.creator}
                  size="xl"
                />
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h2 className="text-xl font-bold text-white tracking-tight">
                      {tool.name}
                    </h2>
                    {tool.is_featured && (
                      <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
                        Featured
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-zinc-400 font-medium">
                    Built by <span className="text-zinc-200">{tool.creator}</span>
                  </div>

                  {/* Pills */}
                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    <span className="rounded-md border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 text-xs font-medium text-zinc-200">
                      {tool.primary_category}
                    </span>
                    <span className="rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400">
                      {tool.release_status}
                    </span>
                    <span className="rounded-md border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 text-xs font-medium text-zinc-300">
                      {tool.pricing_model.split(";")[0]}
                    </span>
                  </div>
                </div>
              </div>

              {/* Direct Website Link Button */}
              <a
                href={tool.official_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-1.5 rounded-xl bg-white text-zinc-950 font-semibold px-4 py-2 text-xs hover:bg-zinc-200 transition-colors shadow-md shrink-0"
              >
                <span>Visit Official Website</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          {/* Section 1: Plain-English Summary & Detailed Overview */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center space-x-2">
              <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
              <span>What It Does & Why It Matters</span>
            </h3>
            <div className="rounded-xl border border-white/[0.08] bg-[#121318] p-5 space-y-3 text-xs text-zinc-300 leading-relaxed">
              <p className="font-medium text-zinc-100 text-sm">
                {tool.short_purpose}
              </p>
              <p className="text-zinc-400">
                {tool.detailed_overview}
              </p>
            </div>
          </div>

          {/* Section 2: Primary Use Cases & Target Audience */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center space-x-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              <span>Practical Use Cases & Who Should Use It</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {tool.best_use_cases.map((useCase, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-white/[0.08] bg-[#121318] p-4 text-xs text-zinc-300 flex items-start space-x-3 shadow-xs"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 font-semibold text-[11px]">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{useCase}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Key Technical Capabilities */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center space-x-2">
              <Terminal className="h-3.5 w-3.5 text-emerald-400" />
              <span>Key Technical Capabilities</span>
            </h3>
            <div className="rounded-xl border border-white/[0.08] bg-[#121318] p-5 space-y-2.5">
              {tool.key_capabilities.map((capability, idx) => (
                <div key={idx} className="flex items-start space-x-2.5 text-xs text-zinc-300">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{capability}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Example Prompts & Workflows */}
          {tool.example_prompts && tool.example_prompts.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center space-x-2">
                <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                <span>Example Prompts & Workflows</span>
              </h3>
              <div className="space-y-2.5">
                {tool.example_prompts.map((promptText, idx) => (
                  <div
                    key={idx}
                    className="group relative rounded-xl border border-white/[0.08] bg-[#121318] p-4 text-xs text-zinc-300 font-mono leading-relaxed"
                  >
                    <div className="pr-8">{promptText}</div>
                    <button
                      onClick={() => handleCopyPrompt(promptText, idx)}
                      className="absolute right-3 top-3 p-1.5 rounded-lg border border-white/[0.08] bg-white/[0.04] text-zinc-400 hover:text-white transition-colors"
                      title="Copy Prompt"
                    >
                      {copiedPromptIdx === idx ? (
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 5: Tags & Classification */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              System Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {tool.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-xs text-zinc-300 font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Section 6: Related News Stories */}
          {relatedArticles.length > 0 && (
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center space-x-2">
                <Newspaper className="h-3.5 w-3.5 text-sky-400" />
                <span>Related News Dispatches ({relatedArticles.length})</span>
              </h3>
              <div className="space-y-2.5">
                {relatedArticles.slice(0, 3).map((art) => (
                  <div
                    key={art.id}
                    className="rounded-xl border border-white/[0.08] bg-[#121318] p-4 text-xs space-y-1.5 hover:border-white/20 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="rounded-md bg-sky-500/10 text-sky-400 font-semibold px-2 py-0.5 text-[10px]">
                        {art.category}
                      </span>
                      <span className="text-zinc-500 text-[11px]">{art.published_at || "Recent"}</span>
                    </div>
                    <h4 className="font-bold text-white text-xs leading-snug">
                      {art.title}
                    </h4>
                    <p className="text-zinc-400 line-clamp-2 leading-relaxed">
                      {art.summary}
                    </p>
                    <div className="pt-1 flex items-center justify-between">
                      <a
                        href={art.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sky-400 hover:text-sky-300 font-medium flex items-center space-x-1"
                      >
                        <span>Read Source Article</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sticky Drawer Footer */}
        <div className="flex items-center justify-between border-t border-white/[0.08] bg-[#121318] px-6 py-4 text-xs">
          <button
            onClick={handleCopyLink}
            className="flex items-center space-x-1.5 text-zinc-400 hover:text-white transition-colors"
          >
            {copiedLink ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copiedLink ? "Link Copied" : "Copy Portal Link"}</span>
          </button>

          <a
            href={tool.official_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1.5 rounded-lg bg-emerald-500 text-zinc-950 font-semibold px-4 py-2 hover:bg-emerald-400 transition-colors shadow-sm"
          >
            <span>Launch Platform</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
