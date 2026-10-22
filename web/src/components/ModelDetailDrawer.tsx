"use client";

import React, { useEffect } from "react";
import { 
  X, 
  ExternalLink, 
  CheckCircle2, 
  Terminal, 
  Layers, 
  Tag, 
  CreditCard, 
  Sparkles, 
  Copy, 
  Check,
  Star
} from "lucide-react";
import { AIDirectoryItem } from "@/lib/types";

interface ModelDetailDrawerProps {
  tool: AIDirectoryItem | null;
  isOpen: boolean;
  onClose: () => void;
  isCompared: boolean;
  onToggleCompare: (tool: AIDirectoryItem) => void;
}

export function ModelDetailDrawer({
  tool,
  isOpen,
  onClose,
  isCompared,
  onToggleCompare,
}: ModelDetailDrawerProps) {
  const [copied, setCopied] = React.useState(false);

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

  const handleCopyLink = () => {
    navigator.clipboard.writeText(tool.official_url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      {/* Backdrop click to close */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Drawer Panel */}
      <div 
        className="relative z-10 flex h-full w-full max-w-2xl flex-col border-l border-[#27272A] bg-[#0E0E11] text-[#FAFAFA] shadow-2xl animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-[#27272A] bg-[#121215] px-6 py-4">
          <div className="flex items-center space-x-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400"></span>
            <span className="text-xs font-mono uppercase tracking-wider text-[#A1A1AA]">
              SYSTEM INSPECTOR // ID: {tool.slug}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onToggleCompare(tool)}
              className={`flex items-center space-x-1.5 border px-2.5 py-1 text-xs font-mono transition-colors ${
                isCompared
                  ? "border-emerald-500/50 bg-emerald-950/40 text-emerald-300"
                  : "border-[#27272A] bg-[#18181B] text-[#A1A1AA] hover:text-[#FAFAFA]"
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>{isCompared ? "In Comparison (Remove)" : "+ Compare"}</span>
            </button>

            <button
              onClick={onClose}
              className="border border-[#27272A] bg-[#18181B] p-1 text-[#A1A1AA] hover:border-[#3F3F46] hover:text-[#FAFAFA]"
              title="Close Drawer (Esc)"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Drawer Content Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {/* Main Title & Creator Header */}
          <div className="border-b border-[#1F1F23] pb-5">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="border border-emerald-500/30 bg-emerald-950/30 px-2 py-0.5 text-[11px] font-mono font-medium text-emerald-400">
                {tool.primary_category}
              </span>
              {tool.is_featured && (
                <span className="flex items-center space-x-1 border border-emerald-500/50 bg-emerald-500/20 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-400">
                  <Star className="h-3 w-3 fill-emerald-400 text-emerald-400" />
                  <span>FEATURED</span>
                </span>
              )}
              <span className="border border-[#27272A] bg-[#18181B] px-2 py-0.5 text-[11px] font-mono text-[#A1A1AA]">
                STATUS: {tool.release_status.toUpperCase()}
              </span>
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-white">
              {tool.name}
            </h2>
            <p className="text-sm font-mono text-[#A1A1AA] mt-1">
              Engineered by <span className="text-white font-semibold">{tool.creator}</span>
            </p>

            <p className="mt-3 text-sm text-[#D4D4D8] leading-relaxed">
              {tool.short_purpose}
            </p>

            {/* Quick Action Link buttons */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <a
                href={tool.official_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-1.5 border border-[#27272A] bg-[#18181B] px-3 py-1.5 text-xs font-mono font-medium text-[#FAFAFA] hover:bg-[#27272A] hover:border-[#3F3F46] transition-colors"
              >
                <span>Launch Official Portal</span>
                <ExternalLink className="h-3.5 w-3.5 text-emerald-400" />
              </a>

              <button
                onClick={handleCopyLink}
                className="inline-flex items-center space-x-1.5 border border-[#27272A] bg-[#121215] px-3 py-1.5 text-xs font-mono text-[#A1A1AA] hover:text-[#FAFAFA] transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-emerald-400">URL Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy Endpoint</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Detailed Technical Overview */}
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-[#71717A] mb-2">
              <Terminal className="h-3.5 w-3.5 text-emerald-400" />
              <span>Architectural Overview</span>
            </div>
            <div className="border border-[#27272A] bg-[#121215] p-4 text-xs sm:text-sm text-[#D4D4D8] leading-relaxed space-y-2">
              <p>{tool.detailed_overview}</p>
            </div>
          </div>

          {/* Key Capabilities */}
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-[#71717A] mb-2">
              <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
              <span>Key Capabilities & Performance Specs</span>
            </div>
            <div className="border border-[#27272A] bg-[#121215] p-4 space-y-2.5">
              {tool.key_capabilities.map((cap, i) => (
                <div key={i} className="flex items-start space-x-2.5 text-xs sm:text-sm">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-[#D4D4D8]">{cap}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Best Practical Engineering Use Cases */}
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-[#71717A] mb-2">
              <Layers className="h-3.5 w-3.5 text-emerald-400" />
              <span>Recommended Production Use Cases</span>
            </div>
            <div className="border border-[#27272A] bg-[#121215] p-4 space-y-2">
              {tool.best_use_cases.map((useCase, i) => (
                <div key={i} className="flex items-start space-x-2 text-xs sm:text-sm">
                  <span className="font-mono text-emerald-400 font-bold shrink-0">[{i + 1}]</span>
                  <span className="text-[#D4D4D8]">{useCase}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Model & Licensing */}
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-[#71717A] mb-2">
              <CreditCard className="h-3.5 w-3.5 text-emerald-400" />
              <span>Pricing Model & Commercial License</span>
            </div>
            <div className="border border-[#27272A] bg-[#121215] p-4">
              <div className="text-xs sm:text-sm font-mono text-emerald-300 font-medium">
                {tool.pricing_model}
              </div>
            </div>
          </div>

          {/* Tags list */}
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-[#71717A] mb-2">
              <Tag className="h-3.5 w-3.5 text-emerald-400" />
              <span>Indexed Classification Tags</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {tool.tags.map((tag) => (
                <span
                  key={tag}
                  className="border border-[#27272A] bg-[#151518] px-2 py-0.5 text-[11px] font-mono text-[#A1A1AA]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Drawer Footer Status Bar */}
        <div className="border-t border-[#27272A] bg-[#121215] px-6 py-3 flex items-center justify-between text-xs font-mono text-[#71717A]">
          <span>RECORD TYPE: VERIFIED TECH SPEC</span>
          <button
            onClick={onClose}
            className="text-[#A1A1AA] hover:text-white transition-colors"
          >
            [Close Inspector]
          </button>
        </div>
      </div>
    </div>
  );
}
