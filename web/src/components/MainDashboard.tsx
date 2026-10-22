"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "./Navbar";
import { AiDirectory } from "./AiDirectory";
import { NewsFeed } from "./NewsFeed";
import { SavedLibrary } from "./SavedLibrary";
import { ModelDetailDrawer } from "./ModelDetailDrawer";
import { CompareModal } from "./CompareModal";
import { CommandMenu } from "./CommandMenu";
import { AIDirectoryItem, NewsArticle } from "@/lib/types";
import { useBookmarks } from "@/lib/bookmarks";
import { Layers, ArrowRight } from "lucide-react";

interface MainDashboardProps {
  initialDirectory: AIDirectoryItem[];
  initialArticles: NewsArticle[];
}

export function MainDashboard({
  initialDirectory,
  initialArticles,
}: MainDashboardProps) {
  const [activeTab, setActiveTab] = useState<"directory" | "wire" | "library">("directory");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [inspectedTool, setInspectedTool] = useState<AIDirectoryItem | null>(null);
  const [selectedCompare, setSelectedCompare] = useState<AIDirectoryItem[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  const { savedCount } = useBookmarks();

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
        setActiveTab("directory");
      } else if (e.key === "2") {
        setActiveTab("wire");
      } else if (e.key === "3") {
        setActiveTab("library");
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
    <div className="min-h-screen flex flex-col bg-[#0A0A0C] text-[#EDEDED] selection:bg-emerald-500/30 selection:text-white">
      {/* Redesigned Clean Public Navbar (No Admin, No Telemetry bar) */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSearch={() => setIsSearchOpen(true)}
        selectedCompareCount={selectedCompare.length}
        onOpenCompare={() => setIsCompareOpen(true)}
        articlesCount={initialArticles.length}
        directoryCount={initialDirectory.length}
        savedCount={savedCount}
      />

      {/* Main Container */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 py-6 sm:py-8">
        {activeTab === "directory" && (
          <AiDirectory
            items={initialDirectory}
            onInspect={(tool) => setInspectedTool(tool)}
            selectedCompare={selectedCompare}
            onToggleCompare={handleToggleCompare}
            onOpenCompareModal={() => setIsCompareOpen(true)}
          />
        )}

        {activeTab === "wire" && (
          <NewsFeed
            articles={initialArticles}
            allTools={initialDirectory}
            onInspectTool={(tool) => setInspectedTool(tool)}
          />
        )}

        {activeTab === "library" && (
          <SavedLibrary
            allTools={initialDirectory}
            allArticles={initialArticles}
            onInspectTool={(tool) => setInspectedTool(tool)}
            onNavigateToDirectory={() => setActiveTab("directory")}
            onNavigateToWire={() => setActiveTab("wire")}
          />
        )}
      </main>

      {/* Persistent Compare Floating Pill (when tools selected) */}
      {selectedCompare.length > 0 && (
        <div className="fixed bottom-6 right-6 z-30 animate-in slide-in-from-bottom duration-200">
          <div className="flex items-center space-x-3 rounded-2xl border border-emerald-500/40 bg-[#121318]/95 px-4 py-3 shadow-2xl shadow-black backdrop-blur-md">
            <div className="flex items-center space-x-2 text-xs">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400"></span>
              <span className="text-white font-medium">
                {selectedCompare.length} of 3 Selected
              </span>
            </div>

            <div className="flex items-center space-x-2 border-l border-white/[0.08] pl-3">
              <button
                onClick={() => setIsCompareOpen(true)}
                className="flex items-center space-x-1 rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-zinc-950 hover:bg-emerald-400 transition-colors shadow-sm"
              >
                <span>Compare Matrix</span>
                <ArrowRight className="h-3 w-3" />
              </button>

              <button
                onClick={() => setSelectedCompare([])}
                className="rounded-lg border border-white/[0.08] bg-white/[0.04] px-2 py-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
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
        allArticles={initialArticles}
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

      {/* Modern Commercial Editorial Footer (NO admin link, NO database telemetry) */}
      <footer className="mt-auto border-t border-white/[0.08] bg-[#0E0E12] text-xs text-zinc-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <span className="font-bold text-white tracking-tight">PulseAI</span>
            <span>•</span>
            <span>AI Models, Autonomous Agents & Daily Intelligence Platform</span>
          </div>

          <div className="flex items-center space-x-4 text-xs text-zinc-400">
            <span className="flex items-center space-x-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>All Systems Operational</span>
            </span>
            <span>•</span>
            <span>© 2025 PulseAI</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
