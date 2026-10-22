"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "./Navbar";
import { HeroSection } from "./HeroSection";
import { ImpactTelemetry } from "./ImpactTelemetry";
import { FlagshipBento } from "./FlagshipBento";
import { AiDirectory } from "./AiDirectory";
import { StackRecipes } from "./StackRecipes";
import { NewsFeed } from "./NewsFeed";
import { ShowcaseFooter } from "./ShowcaseFooter";
import { SavedLibrary } from "./SavedLibrary";
import { ModelDetailDrawer } from "./ModelDetailDrawer";
import { CompareModal } from "./CompareModal";
import { CommandMenu } from "./CommandMenu";
import { AIDirectoryItem, NewsArticle } from "@/lib/types";
import { useBookmarks } from "@/lib/bookmarks";
import { ArrowRight, Scale, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MainDashboardProps {
  initialDirectory: AIDirectoryItem[];
  initialArticles: NewsArticle[];
}

export function MainDashboard({
  initialDirectory,
  initialArticles,
}: MainDashboardProps) {
  const [activeView, setActiveView] = useState<"showcase" | "library">("showcase");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [inspectedTool, setInspectedTool] = useState<AIDirectoryItem | null>(null);
  const [selectedCompare, setSelectedCompare] = useState<AIDirectoryItem[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  const { savedCount } = useBookmarks();

  // Global keyboard shortcuts (⌘K for Spotlight, C for Compare)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA" ||
        document.activeElement?.tagName === "SELECT"
      ) {
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      } else if (e.key.toLowerCase() === "c" && selectedCompare.length > 0) {
        setIsCompareOpen(true);
      } else if (e.key === "Escape") {
        setIsSearchOpen(false);
        setIsCompareOpen(false);
        setInspectedTool(null);
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

  const handleScrollToSection = (sectionId: string) => {
    if (activeView !== "showcase") {
      setActiveView("showcase");
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleInspectBySlug = (slug: string) => {
    const found = initialDirectory.find((t) => t.slug === slug);
    if (found) {
      setInspectedTool(found);
    } else {
      // Fallback object if tool was referenced from marquee or news
      setInspectedTool({
        id: 0,
        slug,
        name: slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
        creator: "Frontier AI Lab",
        short_purpose: "Frontier AI foundation model or autonomous agent system.",
        primary_category: "Autonomous Agents",
        tags: ["Frontier", "Intelligence"],
        detailed_overview: "Frontier AI model verified against official developer documentation.",
        key_capabilities: ["Autonomous execution", "Deep reasoning", "Code synthesis"],
        best_use_cases: ["Production Engineering", "Enterprise Intelligence"],
        pricing_model: "Paid / API",
        official_url: "https://example.com",
        release_status: "Generally Available",
        is_featured: true,
      } as AIDirectoryItem);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#070709] text-[#F8FAFC] selection:bg-emerald-500/30 selection:text-white">
      {/* 1. Floating Glass Sticky Navbar */}
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenSearch={() => setIsSearchOpen(true)}
        selectedCompareCount={selectedCompare.length}
        onOpenCompare={() => setIsCompareOpen(true)}
        savedCount={savedCount}
      />

      {/* 2. Main Content Area */}
      <main className="flex-1 w-full">
        {activeView === "showcase" ? (
          <div>
            {/* Section 1: Animated Hero & Infinite Logo Marquee */}
            <HeroSection
              onExploreDirectory={() => handleScrollToSection("directory")}
              onExploreWire={() => handleScrollToSection("news")}
              onInspectTool={handleInspectBySlug}
              allTools={initialDirectory}
            />

            {/* Section 2: Animated Telemetry & Impact Counters */}
            <ImpactTelemetry />

            {/* Section 3: "Featured Flagships" Spotlight Bento Grid */}
            <FlagshipBento
              onInspect={(tool) => setInspectedTool(tool)}
              allTools={initialDirectory}
            />

            {/* Section 4: Streamlined AI Directory */}
            <AiDirectory
              items={initialDirectory}
              onInspect={(tool) => setInspectedTool(tool)}
              selectedCompare={selectedCompare}
              onToggleCompare={handleToggleCompare}
              onOpenCompareModal={() => setIsCompareOpen(true)}
            />

            {/* Section 5: Curated AI Stack Recipes */}
            <StackRecipes
              onInspect={(tool) => setInspectedTool(tool)}
              allTools={initialDirectory}
            />

            {/* Section 6: Editorial Daily AI News Wire */}
            <NewsFeed
              articles={initialArticles}
              allTools={initialDirectory}
              onInspectTool={(tool) => setInspectedTool(tool)}
            />

            {/* Section 7: High-Craft Multi-Column Footer with Giant Watermark */}
            <ShowcaseFooter onScrollTo={handleScrollToSection} />
          </div>
        ) : (
          /* Bookmarks / Saved Library View */
          <div className="pt-28 pb-20 mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mb-6">
              <button
                onClick={() => setActiveView("showcase")}
                className="text-xs text-emerald-400 hover:underline flex items-center space-x-1"
              >
                <span>← Back to Showcase</span>
              </button>
            </div>
            <SavedLibrary
              allTools={initialDirectory}
              allArticles={initialArticles}
              onInspectTool={(tool) => setInspectedTool(tool)}
              onNavigateToDirectory={() => handleScrollToSection("directory")}
              onNavigateToWire={() => handleScrollToSection("news")}
            />
          </div>
        )}
      </main>

      {/* 3. Persistent Compare Floating Pill (when tools are selected) */}
      <AnimatePresence>
        {selectedCompare.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-30 pointer-events-auto"
          >
            <div className="flex items-center space-x-3 rounded-2xl border border-emerald-500/40 bg-[#0E1017]/95 px-4 py-3 shadow-2xl shadow-black backdrop-blur-2xl">
              <div className="flex items-center space-x-2 text-xs">
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-white font-medium">
                  {selectedCompare.length} of 3 Selected
                </span>
              </div>

              <div className="flex items-center space-x-2 border-l border-white/[0.08] pl-3">
                <button
                  onClick={() => setIsCompareOpen(true)}
                  className="flex items-center space-x-1 rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-zinc-950 hover:bg-emerald-400 transition-colors shadow-sm"
                >
                  <Scale className="h-3.5 w-3.5" />
                  <span>Compare Matrix</span>
                </button>

                <button
                  onClick={() => setSelectedCompare([])}
                  className="rounded-lg border border-white/[0.08] bg-white/[0.04] p-1.5 text-slate-400 hover:text-white transition-colors"
                  title="Clear selection"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. Slide-over Right-hand Inspector Drawer */}
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

      {/* 5. Side-by-Side Comparison Matrix Modal */}
      <CompareModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        selectedTools={selectedCompare}
        onRemoveTool={handleRemoveCompare}
        onClearAll={() => setSelectedCompare([])}
        onOpenDirectory={() => handleScrollToSection("directory")}
      />

      {/* 6. Instant Search Command Menu (⌘K) */}
      <CommandMenu
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        directoryItems={initialDirectory}
        newsArticles={initialArticles}
        onSelectTool={(tool) => setInspectedTool(tool)}
        onSelectArticle={(article) => {
          handleScrollToSection("news");
          window.open(article.url, "_blank");
        }}
      />
    </div>
  );
}
