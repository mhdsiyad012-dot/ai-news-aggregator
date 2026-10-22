"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "./Navbar";
import { AiDirectory } from "./AiDirectory";
import { NewsFeed } from "./NewsFeed";
import { ModelDetailDrawer } from "./ModelDetailDrawer";
import { CompareModal } from "./CompareModal";
import { CommandMenu } from "./CommandMenu";
import { AIDirectoryItem, NewsArticle } from "@/lib/types";
import { Database, Cpu, Terminal, Shield } from "lucide-react";
import Link from "next/link";

interface MainDashboardProps {
  initialDirectory: AIDirectoryItem[];
  initialArticles: NewsArticle[];
}

export function MainDashboard({
  initialDirectory,
  initialArticles,
}: MainDashboardProps) {
  const [activeTab, setActiveTab] = useState<"wire" | "directory">("wire");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [inspectedTool, setInspectedTool] = useState<AIDirectoryItem | null>(null);
  const [selectedCompare, setSelectedCompare] = useState<AIDirectoryItem[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      } else if (e.key === "1") {
        setActiveTab("wire");
      } else if (e.key === "2") {
        setActiveTab("directory");
      } else if (e.key.toLowerCase() === "c" && selectedCompare.length > 0) {
        setIsCompareOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedCompare.length]);

  const handleToggleCompare = (tool: AIDirectoryItem) => {
    setSelectedCompare((prev) => {
      const exists = prev.some((t) => t.slug === tool.slug);
      if (exists) {
        return prev.filter((t) => t.slug !== tool.slug);
      }
      if (prev.length >= 3) {
        alert("Maximum 3 tools can be compared simultaneously in side-by-side mode.");
        return prev;
      }
      return [...prev, tool];
    });
  };

  const handleRemoveCompare = (slug: string) => {
    setSelectedCompare((prev) => prev.filter((t) => t.slug !== slug));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#09090B] text-[#FAFAFA] bg-grid-pattern selection:bg-[#27272A] selection:text-white">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSearch={() => setIsSearchOpen(true)}
        selectedCompareCount={selectedCompare.length}
        onOpenCompare={() => setIsCompareOpen(true)}
        articlesCount={initialArticles.length}
        directoryCount={initialDirectory.length}
      />

      {/* Main Container */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 py-6 sm:py-8">
        {activeTab === "wire" ? (
          <NewsFeed articles={initialArticles} />
        ) : (
          <AiDirectory
            items={initialDirectory}
            onInspect={(tool) => setInspectedTool(tool)}
            selectedCompare={selectedCompare}
            onToggleCompare={handleToggleCompare}
            onOpenCompareModal={() => setIsCompareOpen(true)}
          />
        )}
      </main>

      {/* Persistent Compare Floating Pill (when tools selected) */}
      {selectedCompare.length > 0 && (
        <div className="fixed bottom-6 right-6 z-30 animate-in slide-in-from-bottom duration-200">
          <div className="flex items-center space-x-3 border border-emerald-500/60 bg-[#121215] px-4 py-3 shadow-2xl shadow-black">
            <div className="flex items-center space-x-2 text-xs font-mono">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400"></span>
              <span className="text-white font-semibold">
                {selectedCompare.length} of 3 Selected
              </span>
            </div>

            <div className="flex items-center space-x-1.5 border-l border-[#27272A] pl-3">
              <button
                onClick={() => setIsCompareOpen(true)}
                className="border border-emerald-500/80 bg-emerald-600/30 px-3 py-1.5 text-xs font-mono font-bold text-emerald-300 hover:bg-emerald-600/40 transition-colors"
              >
                Compare Matrix →
              </button>

              <button
                onClick={() => setSelectedCompare([])}
                className="border border-[#27272A] bg-[#18181B] px-2 py-1.5 text-xs font-mono text-[#71717A] hover:text-white transition-colors"
                title="Clear selection"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Slide-over Right-hand Inspector Drawer */}
      <ModelDetailDrawer
        tool={inspectedTool}
        isOpen={Boolean(inspectedTool)}
        onClose={() => setInspectedTool(null)}
        isCompared={Boolean(
          inspectedTool && selectedCompare.some((t) => t.slug === inspectedTool.slug)
        )}
        onToggleCompare={handleToggleCompare}
      />

      {/* Side-by-Side Comparison Matrix Modal */}
      <CompareModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        selectedTools={selectedCompare}
        onRemoveTool={handleRemoveCompare}
        onClearAll={() => setSelectedCompare([])}
        onOpenDirectory={() => setActiveTab("directory")}
      />

      {/* Instant Search Command Menu (Ctrl+K) */}
      <CommandMenu
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        directoryItems={initialDirectory}
        newsArticles={initialArticles}
        onSelectTool={(tool) => setInspectedTool(tool)}
        onSelectArticle={(article) => {
          setActiveTab("wire");
          window.open(article.url, "_blank");
        }}
      />

      {/* Industrial Editorial Footer */}
      <footer className="mt-auto border-t border-[#27272A] bg-[#0C0C0E] text-[11px] font-mono text-[#71717A]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <span className="text-[#FAFAFA] font-bold">AI INTELLIGENCE WIRE</span>
            <span>/</span>
            <span>VERCEL WEB/ DEPLOYMENT</span>
            <span>/</span>
            <span>AUTONOMOUS PIPELINE</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[#A1A1AA]">
            <span className="flex items-center space-x-1">
              <Database className="h-3 w-3 text-emerald-400" />
              <span>Supabase Postgres</span>
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <Cpu className="h-3 w-3 text-sky-400" />
              <span>Gemini 2.0 Ingestion</span>
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <Terminal className="h-3 w-3 text-purple-400" />
              <span>GitHub Actions Crons</span>
            </span>
            <span>•</span>
            <Link href="/admin" className="flex items-center space-x-1 text-emerald-400 hover:underline">
              <Shield className="h-3 w-3" />
              <span>Admin Console</span>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
