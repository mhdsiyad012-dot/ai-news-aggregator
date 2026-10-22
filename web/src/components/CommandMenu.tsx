"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, X, Cpu, Newspaper, ArrowRight, CornerDownLeft, ExternalLink } from "lucide-react";
import { AIDirectoryItem, NewsArticle } from "@/lib/types";
import { BrandLogo } from "./BrandLogo";

interface CommandMenuProps {
  isOpen: boolean;
  onClose: () => void;
  directoryItems: AIDirectoryItem[];
  newsArticles: NewsArticle[];
  onSelectTool: (tool: AIDirectoryItem) => void;
  onSelectArticle: (article: NewsArticle) => void;
}

export function CommandMenu({
  isOpen,
  onClose,
  directoryItems,
  newsArticles,
  onSelectTool,
  onSelectArticle,
}: CommandMenuProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onClose();
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
    } else {
      setQuery("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const cleanQuery = query.trim().toLowerCase();

  const matchingTools = directoryItems
    .filter((tool) => {
      if (!cleanQuery) return true;
      return (
        tool.name.toLowerCase().includes(cleanQuery) ||
        tool.creator.toLowerCase().includes(cleanQuery) ||
        tool.primary_category.toLowerCase().includes(cleanQuery) ||
        tool.tags.some((t) => t.toLowerCase().includes(cleanQuery)) ||
        tool.short_purpose.toLowerCase().includes(cleanQuery)
      );
    })
    .slice(0, 5);

  const matchingArticles = newsArticles
    .filter((art) => {
      if (!cleanQuery) return true;
      return (
        art.title.toLowerCase().includes(cleanQuery) ||
        art.summary.toLowerCase().includes(cleanQuery) ||
        art.category.toLowerCase().includes(cleanQuery) ||
        (art.source_name && art.source_name.toLowerCase().includes(cleanQuery)) ||
        (art.related_tools && art.related_tools.toLowerCase().includes(cleanQuery))
      );
    })
    .slice(0, 5);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl rounded-2xl border border-white/[0.08] bg-[#121318] shadow-2xl shadow-black flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center border-b border-white/[0.08] px-4 py-3.5 bg-[#0E0E12]">
          <Search className="h-4 w-4 text-zinc-400 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search AI models, agents, code builders, companies, or news..."
            className="w-full bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-hidden font-sans"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-zinc-500 hover:text-white p-1"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <kbd className="ml-2 hidden sm:inline-flex items-center rounded-md border border-white/[0.1] bg-white/[0.05] px-1.5 py-0.5 text-[10px] font-mono text-zinc-400">
            ESC
          </kbd>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto divide-y divide-white/[0.06] p-2">
          {/* AI Tools Section */}
          <div className="py-1">
            <div className="px-3 py-1.5 text-xs font-semibold text-zinc-400 flex items-center justify-between">
              <span className="flex items-center space-x-1.5">
                <Cpu className="h-3.5 w-3.5 text-emerald-400" />
                <span>AI Models & Systems</span>
              </span>
              <span className="text-[10px] text-zinc-500">{matchingTools.length} results</span>
            </div>

            {matchingTools.length === 0 ? (
              <div className="px-3 py-2 text-xs text-zinc-500">
                No matching models found.
              </div>
            ) : (
              <div className="space-y-1 mt-1">
                {matchingTools.map((tool) => (
                  <button
                    key={tool.slug}
                    onClick={() => {
                      onSelectTool(tool);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left hover:bg-white/[0.05] transition-colors group"
                  >
                    <div className="flex items-center space-x-3 min-w-0 pr-3">
                      <BrandLogo slug={tool.slug} name={tool.name} creator={tool.creator} size="sm" />
                      <div className="min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-semibold text-white group-hover:text-emerald-400 truncate">
                            {tool.name}
                          </span>
                          <span className="text-[11px] text-zinc-400 truncate">
                            by {tool.creator}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                          {tool.short_purpose}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <span className="rounded-md border border-white/[0.08] bg-white/[0.04] px-2 py-0.5 text-[10px] text-zinc-300">
                        {tool.primary_category}
                      </span>
                      <CornerDownLeft className="h-3 w-3 text-zinc-500 group-hover:text-emerald-400 transition-colors" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Daily News Wire Section */}
          <div className="py-2">
            <div className="px-3 py-1.5 text-xs font-semibold text-zinc-400 flex items-center justify-between">
              <span className="flex items-center space-x-1.5">
                <Newspaper className="h-3.5 w-3.5 text-sky-400" />
                <span>Daily Tech Wire</span>
              </span>
              <span className="text-[10px] text-zinc-500">{matchingArticles.length} results</span>
            </div>

            {matchingArticles.length === 0 ? (
              <div className="px-3 py-2 text-xs text-zinc-500">
                No matching news stories found.
              </div>
            ) : (
              <div className="space-y-1 mt-1">
                {matchingArticles.map((art) => (
                  <button
                    key={art.id || art.url}
                    onClick={() => {
                      onSelectArticle(art);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left hover:bg-white/[0.05] transition-colors group"
                  >
                    <div className="min-w-0 pr-3">
                      <div className="flex items-center space-x-2">
                        <span className="rounded-md bg-sky-500/10 text-sky-400 px-1.5 py-0.2 text-[9px] font-semibold">
                          {art.category}
                        </span>
                        <span className="text-xs font-semibold text-white group-hover:text-sky-300 truncate">
                          {art.title}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                        {art.summary}
                      </p>
                    </div>

                    <div className="flex items-center space-x-1 text-zinc-500 shrink-0">
                      <ExternalLink className="h-3.5 w-3.5 group-hover:text-sky-300 transition-colors" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer shortcuts */}
        <div className="flex items-center justify-between border-t border-white/[0.08] bg-[#0E0E12] px-4 py-2.5 text-[11px] text-zinc-500 font-sans">
          <div className="flex items-center space-x-3">
            <span>Press <kbd className="rounded border border-white/[0.1] bg-white/[0.05] px-1 text-[10px]">ESC</kbd> to exit</span>
          </div>
          <span>PulseAI Command</span>
        </div>
      </div>
    </div>
  );
}
