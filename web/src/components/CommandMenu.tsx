"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  Database,
  Newspaper,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { AI_DIRECTORY_DATA } from "@/data/aiDirectoryData";
import { AIDirectoryItem } from "@/lib/types";

interface CommandMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandMenu({ isOpen, onClose }: CommandMenuProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          window.dispatchEvent(new CustomEvent("open-command-menu"));
        }
      } else if (e.key === "/" && !isOpen && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent("open-command-menu"));
      } else if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  const cleanQuery = query.trim().toLowerCase();

  const matchingTools = AI_DIRECTORY_DATA.filter((tool) => {
    if (!cleanQuery) return tool.isFeatured;
    return (
      (tool.name || "").toLowerCase().includes(cleanQuery) ||
      (tool.company || "").toLowerCase().includes(cleanQuery) ||
      (tool.category || "").toLowerCase().includes(cleanQuery) ||
      (tool.tagline || "").toLowerCase().includes(cleanQuery)
    );
  }).slice(0, 8);

  const handleSelectTool = (tool: AIDirectoryItem) => {
    onClose();
    router.push(`/directory/${tool.slug}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, matchingTools.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + matchingTools.length) % Math.max(1, matchingTools.length));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (matchingTools[selectedIndex]) {
        handleSelectTool(matchingTools[selectedIndex]);
      } else if (cleanQuery) {
        onClose();
        router.push(`/directory?q=${encodeURIComponent(cleanQuery)}`);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      <div
        className="fixed inset-0 bg-[#09090B]/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl rounded-xl bg-[#121215] border border-[#27272A] shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center px-4 py-3.5 border-b border-[#27272A]">
          <Search className="w-5 h-5 text-[#71717A] mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search AI models, tools, ecosystems, or dispatches..."
            className="w-full bg-transparent text-sm text-[#FAFAFA] placeholder-[#71717A] focus:outline-none font-sans"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-[#71717A] hover:text-[#FAFAFA] p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 ml-2 font-mono text-[10px] bg-[#18181C] border border-[#27272A] text-[#71717A] rounded">
            ESC
          </kbd>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2 divide-y divide-[#27272A]/40">
          {matchingTools.length > 0 ? (
            <div className="space-y-1">
              <div className="px-3 py-1.5 font-mono text-[10px] tracking-wider uppercase text-[#71717A] flex items-center justify-between">
                <span>{cleanQuery ? "Matching AI Systems" : "Featured Frontier Models"}</span>
                <span>{matchingTools.length} nodes</span>
              </div>
              {matchingTools.map((tool, idx) => {
                const isSelected = idx === selectedIndex;
                return (
                  <div
                    key={tool.slug}
                    onClick={() => handleSelectTool(tool)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-editorial ${
                      isSelected
                        ? "bg-[#18181C] border border-[#3F3F46]"
                        : "border border-transparent hover:bg-[#18181C]/50"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-7 h-7 rounded-md bg-[#09090B] border border-[#27272A] flex items-center justify-center font-mono text-xs text-[#F97316] shrink-0 font-bold">
                        {tool.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-heading font-medium text-sm text-[#FAFAFA] truncate">
                            {tool.name}
                          </span>
                          <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-[#09090B] text-[#71717A] border border-[#27272A]">
                            {tool.company}
                          </span>
                        </div>
                        <p className="text-xs text-[#A1A1AA] truncate mt-0.5 font-sans">
                          {tool.tagline}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 font-mono text-[11px] text-[#71717A]">
                      <span className="text-[#10B981]">{tool.pricing}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#3F3F46]" />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center space-y-2">
              <p className="font-sans text-sm text-[#A1A1AA]">
                No local tools found matching &quot;{query}&quot;.
              </p>
              <button
                onClick={() => {
                  onClose();
                  router.push(`/directory?q=${encodeURIComponent(query)}`);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAFAFA] text-[#09090B] font-mono text-xs font-semibold hover:bg-white transition-editorial"
              >
                <Sparkles className="w-3 h-3 text-[#F97316]" />
                Search in Full Directory & Gemini Lookup
              </button>
            </div>
          )}

          <div className="pt-2">
            <div className="px-3 py-1 font-mono text-[10px] tracking-wider uppercase text-[#71717A]">
              Quick Navigation
            </div>
            <div className="grid grid-cols-2 gap-1 p-1">
              <button
                onClick={() => {
                  onClose();
                  router.push("/news");
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-left hover:bg-[#18181C] text-xs text-[#A1A1AA] hover:text-[#FAFAFA] transition-editorial"
              >
                <Newspaper className="w-3.5 h-3.5 text-[#F97316]" />
                <span>Daily AI Dispatches (/news)</span>
              </button>
              <button
                onClick={() => {
                  onClose();
                  router.push("/directory");
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-left hover:bg-[#18181C] text-xs text-[#A1A1AA] hover:text-[#FAFAFA] transition-editorial"
              >
                <Database className="w-3.5 h-3.5 text-[#10B981]" />
                <span>All-Type AI Directory (/directory)</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between px-4 py-2.5 bg-[#09090B] border-t border-[#27272A] font-mono text-[11px] text-[#71717A]">
          <div className="flex items-center gap-2">
            <span>Navigate:</span>
            <kbd className="px-1 py-0.5 bg-[#18181C] border border-[#27272A] rounded">↑</kbd>
            <kbd className="px-1 py-0.5 bg-[#18181C] border border-[#27272A] rounded">↓</kbd>
            <span className="ml-1">Select:</span>
            <kbd className="px-1.5 py-0.5 bg-[#18181C] border border-[#27272A] rounded">↵</kbd>
          </div>
          <span>Optimus Prime Core Index</span>
        </div>
      </div>
    </div>
  );
}
