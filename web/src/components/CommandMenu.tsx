"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, X, Cpu, Newspaper, ArrowRight, CornerDownLeft, ExternalLink } from "lucide-react";
import { AIDirectoryItem, NewsArticle } from "@/lib/types";

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
        onClose(); // toggle or open handled by parent
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

  const matchingTools = directoryItems.filter((tool) => {
    if (!cleanQuery) return true;
    return (
      tool.name.toLowerCase().includes(cleanQuery) ||
      tool.creator.toLowerCase().includes(cleanQuery) ||
      tool.primary_category.toLowerCase().includes(cleanQuery) ||
      tool.tags.some((t) => t.toLowerCase().includes(cleanQuery)) ||
      tool.short_purpose.toLowerCase().includes(cleanQuery)
    );
  }).slice(0, 5);

  const matchingArticles = newsArticles.filter((art) => {
    if (!cleanQuery) return true;
    return (
      art.title.toLowerCase().includes(cleanQuery) ||
      art.summary.toLowerCase().includes(cleanQuery) ||
      art.category.toLowerCase().includes(cleanQuery)
    );
  }).slice(0, 5);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl border border-[#27272A] bg-[#121215] shadow-2xl shadow-black/80 flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center border-b border-[#27272A] px-4 py-3 bg-[#0E0E11]">
          <Search className="h-4 w-4 text-[#A1A1AA] mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search AI models, autonomous agents, code builders, wire headlines..."
            className="w-full bg-transparent text-sm text-[#EDEDED] placeholder-[#71717A] focus:outline-hidden font-mono"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-[#71717A] hover:text-[#EDEDED] p-1"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <kbd className="ml-2 hidden sm:inline-flex items-center border border-[#27272A] bg-[#18181B] px-1.5 py-0.5 text-[10px] font-mono text-[#71717A]">
            ESC
          </kbd>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto divide-y divide-[#1F1F23] p-2">
          {/* AI Tools Section */}
          <div>
            <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-[#71717A] flex items-center justify-between">
              <span className="flex items-center space-x-1.5">
                <Cpu className="h-3 w-3 text-emerald-400" />
                <span>AI Models & Systems ({matchingTools.length})</span>
              </span>
              <span>INSPECTOR</span>
            </div>

            {matchingTools.length === 0 ? (
              <div className="px-3 py-2 text-xs font-mono text-[#71717A]">
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
                    className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-[#1A1A1E] transition-colors border border-transparent hover:border-[#27272A] group"
                  >
                    <div className="min-w-0 pr-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-semibold text-[#EDEDED] group-hover:text-emerald-300">
                          {tool.name}
                        </span>
                        <span className="text-[10px] font-mono text-[#71717A]">
                          by {tool.creator}
                        </span>
                        <span className="rounded-xs border border-[#27272A] bg-[#18181B] px-1.5 py-0.2 text-[9px] font-mono text-[#A1A1AA]">
                          {tool.primary_category}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#A1A1AA] truncate mt-0.5">
                        {tool.short_purpose}
                      </p>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-[#52525B] group-hover:text-emerald-400 shrink-0" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Wire Articles Section */}
          <div className="pt-2">
            <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-[#71717A] flex items-center justify-between">
              <span className="flex items-center space-x-1.5">
                <Newspaper className="h-3 w-3 text-sky-400" />
                <span>Wire Headlines ({matchingArticles.length})</span>
              </span>
              <span>DISPATCH</span>
            </div>

            {matchingArticles.length === 0 ? (
              <div className="px-3 py-2 text-xs font-mono text-[#71717A]">
                No matching wire dispatches found.
              </div>
            ) : (
              <div className="space-y-1 mt-1">
                {matchingArticles.map((article) => (
                  <button
                    key={article.id}
                    onClick={() => {
                      onSelectArticle(article);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-[#1A1A1E] transition-colors border border-transparent hover:border-[#27272A] group"
                  >
                    <div className="min-w-0 pr-3">
                      <div className="flex items-center space-x-2">
                        <span className="border border-[#27272A] bg-[#18181B] px-1 text-[9px] font-mono text-sky-400">
                          {article.category}
                        </span>
                        <span className="text-xs font-medium text-[#EDEDED] truncate group-hover:text-sky-300">
                          {article.title}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#A1A1AA] truncate mt-0.5">
                        {article.summary}
                      </p>
                    </div>
                    <ExternalLink className="h-3 w-3 text-[#52525B] group-hover:text-sky-400 shrink-0" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer controls */}
        <div className="flex items-center justify-between border-t border-[#27272A] bg-[#0E0E11] px-4 py-2 text-[11px] font-mono text-[#71717A]">
          <div className="flex items-center space-x-3">
            <span>Navigate: <kbd className="text-[#A1A1AA]">↑↓</kbd></span>
            <span>Select: <kbd className="text-[#A1A1AA]">↵</kbd></span>
          </div>
          <button 
            onClick={onClose} 
            className="hover:text-[#EDEDED] transition-colors"
          >
            [Close Window]
          </button>
        </div>
      </div>
    </div>
  );
}
