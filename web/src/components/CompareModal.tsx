"use client";

import React, { useEffect } from "react";
import { 
  X, 
  Layers, 
  ExternalLink, 
  Trash2, 
  CheckCircle2, 
  Cpu
} from "lucide-react";
import { AIDirectoryItem } from "@/lib/types";

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
        className="relative flex h-full max-h-[92vh] w-full max-w-7xl flex-col border border-[#27272A] bg-[#0E0E11] text-[#FAFAFA] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#27272A] bg-[#121215] px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-7 w-7 items-center justify-center border border-[#27272A] bg-[#18181B] text-emerald-400">
              <Layers className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                  SIDE-BY-SIDE ARCHITECTURAL COMPARISON MATRIX
                </h3>
                <span className="rounded-xs border border-[#27272A] bg-[#18181B] px-1.5 py-0.2 text-[10px] font-mono text-emerald-400">
                  {selectedTools.length}/3 SELECTED
                </span>
              </div>
              <p className="text-[11px] font-mono text-[#71717A]">
                EVALUATION OF REASONING PROFILES, CAPABILITIES, PRICING & ENTERPRISE SUITABILITY
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {selectedTools.length > 0 && (
              <button
                onClick={onClearAll}
                className="flex items-center space-x-1 border border-[#27272A] bg-[#18181B] px-2.5 py-1 text-xs font-mono text-[#A1A1AA] hover:text-rose-400 hover:border-rose-900/50 transition-colors"
              >
                <Trash2 className="h-3 w-3" />
                <span>Clear Matrix</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="border border-[#27272A] bg-[#18181B] p-1 text-[#A1A1AA] hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Modal Body: Comparison Table */}
        <div className="flex-1 overflow-auto p-4 sm:p-6">
          {selectedTools.length === 0 ? (
            <div className="flex h-80 flex-col items-center justify-center border border-dashed border-[#27272A] p-8 text-center">
              <Cpu className="h-10 w-10 text-[#52525B] mb-3" />
              <h4 className="text-base font-semibold text-[#FAFAFA]">
                No AI Models or Agents Selected for Comparison
              </h4>
              <p className="max-w-md text-xs text-[#A1A1AA] mt-1 font-mono">
                Browse the AI Models & Agents Directory and click the &quot;+ Compare&quot; button on any card to evaluate up to 3 systems side by side.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onOpenDirectory();
                }}
                className="mt-4 border border-[#27272A] bg-[#18181B] px-4 py-2 text-xs font-mono text-emerald-400 hover:bg-[#27272A] transition-colors"
              >
                Open AI Models Directory →
              </button>
            </div>
          ) : (
            <div className="min-w-[650px] space-y-6">
              {/* Columns Header Grid */}
              <div 
                className="grid gap-4"
                style={{ gridTemplateColumns: `repeat(${selectedTools.length}, minmax(0, 1fr))` }}
              >
                {selectedTools.map((tool) => (
                  <div
                    key={tool.slug}
                    className="relative border border-[#27272A] bg-[#121215] p-4 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <span className="border border-emerald-500/30 bg-emerald-950/30 px-1.5 py-0.5 text-[10px] font-mono text-emerald-400">
                          {tool.primary_category}
                        </span>
                        <button
                          onClick={() => onRemoveTool(tool.slug)}
                          className="text-[#71717A] hover:text-rose-400 p-0.5"
                          title="Remove from comparison"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <h4 className="mt-2 text-lg font-bold text-white tracking-tight">
                        {tool.name}
                      </h4>
                      <div className="text-xs font-mono text-[#A1A1AA]">
                        by {tool.creator}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#1F1F23] flex items-center justify-between text-[11px] font-mono">
                      <span className="text-[#71717A]">STATUS:</span>
                      <span className="text-emerald-400">{tool.release_status}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Matrix Row 1: Purpose Statement */}
              <div className="border border-[#27272A] bg-[#0E0E11] p-4">
                <div className="text-[11px] font-mono uppercase tracking-wider text-[#71717A] mb-3">
                  01 // Mission & Primary Purpose
                </div>
                <div 
                  className="grid gap-4"
                  style={{ gridTemplateColumns: `repeat(${selectedTools.length}, minmax(0, 1fr))` }}
                >
                  {selectedTools.map((tool) => (
                    <div key={tool.slug} className="text-xs text-[#D4D4D8] leading-relaxed">
                      {tool.short_purpose}
                    </div>
                  ))}
                </div>
              </div>

              {/* Matrix Row 2: Pricing & Commercial Terms */}
              <div className="border border-[#27272A] bg-[#0E0E11] p-4">
                <div className="text-[11px] font-mono uppercase tracking-wider text-[#71717A] mb-3">
                  02 // Pricing Model & API Rates
                </div>
                <div 
                  className="grid gap-4"
                  style={{ gridTemplateColumns: `repeat(${selectedTools.length}, minmax(0, 1fr))` }}
                >
                  {selectedTools.map((tool) => (
                    <div key={tool.slug} className="border border-[#27272A] bg-[#121215] p-3 text-xs font-mono text-emerald-300">
                      {tool.pricing_model}
                    </div>
                  ))}
                </div>
              </div>

              {/* Matrix Row 3: Key Architectural Capabilities */}
              <div className="border border-[#27272A] bg-[#0E0E11] p-4">
                <div className="text-[11px] font-mono uppercase tracking-wider text-[#71717A] mb-3">
                  03 // Key Capabilities & Architectural Highlights
                </div>
                <div 
                  className="grid gap-4"
                  style={{ gridTemplateColumns: `repeat(${selectedTools.length}, minmax(0, 1fr))` }}
                >
                  {selectedTools.map((tool) => (
                    <div key={tool.slug} className="space-y-2">
                      {tool.key_capabilities.map((cap, i) => (
                        <div key={i} className="flex items-start space-x-2 text-xs text-[#D4D4D8]">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{cap}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Matrix Row 4: Best Production Use Cases */}
              <div className="border border-[#27272A] bg-[#0E0E11] p-4">
                <div className="text-[11px] font-mono uppercase tracking-wider text-[#71717A] mb-3">
                  04 // Optimal Engineering Use Cases
                </div>
                <div 
                  className="grid gap-4"
                  style={{ gridTemplateColumns: `repeat(${selectedTools.length}, minmax(0, 1fr))` }}
                >
                  {selectedTools.map((tool) => (
                    <div key={tool.slug} className="space-y-2">
                      {tool.best_use_cases.map((uc, i) => (
                        <div key={i} className="flex items-start space-x-2 text-xs text-[#D4D4D8]">
                          <span className="font-mono text-emerald-400 font-bold shrink-0">[{i + 1}]</span>
                          <span>{uc}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Matrix Row 5: Portal Links */}
              <div className="border border-[#27272A] bg-[#0E0E11] p-4">
                <div className="text-[11px] font-mono uppercase tracking-wider text-[#71717A] mb-3">
                  05 // Official Documentation & Endpoints
                </div>
                <div 
                  className="grid gap-4"
                  style={{ gridTemplateColumns: `repeat(${selectedTools.length}, minmax(0, 1fr))` }}
                >
                  {selectedTools.map((tool) => (
                    <a
                      key={tool.slug}
                      href={tool.official_url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between border border-[#27272A] bg-[#18181B] px-3 py-2 text-xs font-mono text-[#FAFAFA] hover:bg-[#27272A] hover:border-emerald-500/50 transition-colors"
                    >
                      <span className="truncate">Visit {tool.name}</span>
                      <ExternalLink className="h-3 w-3 text-emerald-400 shrink-0 ml-2" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="border-t border-[#27272A] bg-[#121215] px-6 py-3 flex items-center justify-between text-xs font-mono text-[#71717A]">
          <span>BENCHMARK DATA COMPILED FROM OFFICIAL TECHNICAL RELEASES</span>
          <button
            onClick={onClose}
            className="hover:text-white transition-colors"
          >
            [Close Matrix]
          </button>
        </div>
      </div>
    </div>
  );
}
