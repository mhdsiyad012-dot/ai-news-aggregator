"use client";

import React, { useEffect } from "react";
import { 
  X, 
  Layers, 
  ExternalLink, 
  Trash2, 
  CheckCircle2, 
  Cpu,
  Sparkles
} from "lucide-react";
import { AIDirectoryItem } from "@/lib/types";
import { BrandLogo } from "./BrandLogo";

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTools: AIDirectoryItem[];
  onRemoveTool: (slug: string) => void;
  onClearAll: () => void;
  onOpenDirectory: () => void;
}

export function CompareModal({
  isOpen,
  onClose,
  selectedTools,
  onRemoveTool,
  onClearAll,
  onOpenDirectory,
}: CompareModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="relative flex h-full max-h-[92vh] w-full max-w-7xl flex-col rounded-2xl border border-white/[0.08] bg-[#0E0E12] text-[#FAFAFA] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] bg-[#121318] px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Layers className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-bold text-white tracking-tight">
                  Side-by-Side Model Comparison Matrix
                </h3>
                <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                  {selectedTools.length}/3 Selected
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Direct comparative analysis of capabilities, reasoning benchmarks, and pricing
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {selectedTools.length > 0 && (
              <button
                onClick={onClearAll}
                className="flex items-center space-x-1.5 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/20 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Clear Matrix</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="rounded-lg border border-white/[0.08] bg-white/[0.04] p-1.5 text-zinc-400 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Modal Body: Comparison Table */}
        <div className="flex-1 overflow-auto p-4 sm:p-6">
          {selectedTools.length === 0 ? (
            <div className="flex h-80 flex-col items-center justify-center rounded-xl border border-dashed border-white/[0.08] p-8 text-center bg-[#121318]/50">
              <Cpu className="h-10 w-10 text-zinc-500 mb-3" />
              <h4 className="text-base font-semibold text-white">
                No AI Models or Agents Selected for Comparison
              </h4>
              <p className="max-w-md text-xs text-zinc-400 mt-1">
                Browse the AI Directory and click the &quot;+ Compare&quot; button on any card to evaluate up to 3 systems side by side.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onOpenDirectory();
                }}
                className="mt-4 rounded-xl bg-white text-zinc-950 font-medium px-4 py-2 text-xs hover:bg-zinc-200 transition-colors"
              >
                Open AI Models Directory →
              </button>
            </div>
          ) : (
            <div className="min-w-[700px] space-y-6">
              {/* Columns Header Grid */}
              <div 
                className="grid gap-4"
                style={{ gridTemplateColumns: `repeat(${selectedTools.length}, minmax(0, 1fr))` }}
              >
                {selectedTools.map((tool) => (
                  <div
                    key={tool.slug}
                    className="relative rounded-xl border border-white/[0.08] bg-[#121318] p-5 flex flex-col justify-between shadow-sm"
                  >
                    <div>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2.5">
                          <BrandLogo slug={tool.slug} name={tool.name} creator={tool.creator} size="md" />
                          <span className="rounded-md border border-white/[0.08] bg-white/[0.04] px-2 py-0.5 text-[11px] font-medium text-zinc-300">
                            {tool.primary_category}
                          </span>
                        </div>
                        <button
                          onClick={() => onRemoveTool(tool.slug)}
                          className="rounded-md p-1 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          title="Remove from comparison"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <h4 className="text-base font-bold text-white tracking-tight">
                        {tool.name}
                      </h4>
                      <div className="text-xs text-zinc-400 font-medium mt-0.5">
                        {tool.creator}
                      </div>

                      <p className="mt-2.5 text-xs text-zinc-300 line-clamp-2 leading-relaxed">
                        {tool.short_purpose}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between">
                      <span className="text-xs font-semibold text-emerald-400">
                        {tool.release_status}
                      </span>
                      <a
                        href={tool.official_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-zinc-400 hover:text-white flex items-center space-x-1 font-medium"
                      >
                        <span>Official Website</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              {/* Matrix Row 1: Pricing Model */}
              <div className="rounded-xl border border-white/[0.08] bg-[#121318] p-5 shadow-sm">
                <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
                  Pricing & Commercial Terms
                </div>
                <div 
                  className="grid gap-4"
                  style={{ gridTemplateColumns: `repeat(${selectedTools.length}, minmax(0, 1fr))` }}
                >
                  {selectedTools.map((tool) => (
                    <div key={tool.slug} className="text-xs text-zinc-200">
                      <div className="rounded-lg bg-black/40 border border-white/[0.06] p-3 font-medium">
                        {tool.pricing_model}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Matrix Row 2: Key Capabilities */}
              <div className="rounded-xl border border-white/[0.08] bg-[#121318] p-5 shadow-sm">
                <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
                  Key Technical Capabilities
                </div>
                <div 
                  className="grid gap-4"
                  style={{ gridTemplateColumns: `repeat(${selectedTools.length}, minmax(0, 1fr))` }}
                >
                  {selectedTools.map((tool) => (
                    <div key={tool.slug} className="space-y-2">
                      {tool.key_capabilities.map((cap, idx) => (
                        <div key={idx} className="flex items-start space-x-2 text-xs text-zinc-300">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{cap}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Matrix Row 3: Recommended Use Cases */}
              <div className="rounded-xl border border-white/[0.08] bg-[#121318] p-5 shadow-sm">
                <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
                  Optimal Production Scenarios
                </div>
                <div 
                  className="grid gap-4"
                  style={{ gridTemplateColumns: `repeat(${selectedTools.length}, minmax(0, 1fr))` }}
                >
                  {selectedTools.map((tool) => (
                    <div key={tool.slug} className="space-y-2">
                      {tool.best_use_cases.map((useCase, idx) => (
                        <div key={idx} className="rounded-lg border border-white/[0.06] bg-black/30 p-2.5 text-xs text-zinc-300">
                          {useCase}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Matrix Row 4: Classification Tags */}
              <div className="rounded-xl border border-white/[0.08] bg-[#121318] p-5 shadow-sm">
                <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
                  Architectural Tags
                </div>
                <div 
                  className="grid gap-4"
                  style={{ gridTemplateColumns: `repeat(${selectedTools.length}, minmax(0, 1fr))` }}
                >
                  {selectedTools.map((tool) => (
                    <div key={tool.slug} className="flex flex-wrap gap-1.5">
                      {tool.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md border border-white/[0.06] bg-white/[0.03] px-2 py-0.5 text-[11px] text-zinc-400"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-white/[0.08] bg-[#121318] px-6 py-4 text-xs text-zinc-400">
          <span>PulseAI Matrix Comparison</span>
          <button
            onClick={onClose}
            className="rounded-lg bg-white text-zinc-950 font-semibold px-4 py-2 hover:bg-zinc-200 transition-colors shadow-sm"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
}
