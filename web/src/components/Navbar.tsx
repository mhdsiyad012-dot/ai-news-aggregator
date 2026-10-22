"use client";

import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  Cpu, 
  Newspaper, 
  Layers, 
  Bookmark, 
  Search,
  Scale,
  Menu,
  X,
  Compass,
  Flame,
  Workflow
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NavbarProps {
  activeView: "showcase" | "library";
  setActiveView: (view: "showcase" | "library") => void;
  onOpenSearch: () => void;
  selectedCompareCount: number;
  onOpenCompare: () => void;
  savedCount: number;
}

export function Navbar({
  activeView,
  setActiveView,
  onOpenSearch,
  selectedCompareCount,
  onOpenCompare,
  savedCount,
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (sectionId: string) => {
    setMobileMenuOpen(false);
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

  return (
    <div className="fixed top-3 sm:top-5 left-0 right-0 z-40 mx-auto max-w-6xl px-3 sm:px-6 pointer-events-none transition-all duration-300">
      <header
        className={`pointer-events-auto flex items-center justify-between rounded-full border transition-all duration-300 px-3.5 sm:px-5 py-2 sm:py-2.5 ${
          scrolled
            ? "border-white/[0.12] bg-[#0A0B10]/85 shadow-2xl shadow-black/80 backdrop-blur-2xl"
            : "border-white/[0.07] bg-[#0E1017]/70 shadow-lg shadow-black/40 backdrop-blur-xl"
        }`}
      >
        {/* Brand identity: PulseAI with animated emblem */}
        <button
          onClick={() => handleNavClick("hero")}
          className="flex items-center space-x-2.5 text-left group shrink-0"
        >
          <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-500 via-teal-400 to-emerald-300 p-[1px] shadow-sm shadow-emerald-500/20">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-[#070709]">
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-emerald-400 group-hover:scale-110 transition-transform duration-200"
              >
                <path
                  d="M3 12H7L10 3L14 21L17 12H21"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            <span className="text-sm font-extrabold tracking-tight text-white group-hover:text-emerald-400 transition-colors">
              PulseAI
            </span>
            <span className="hidden sm:inline-block rounded-full bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.2 text-[9px] font-semibold text-emerald-400 tracking-wider">
              SHOWCASE
            </span>
          </div>
        </button>

        {/* Center Navigation Links (Smooth Scroll + View Switch) */}
        <nav className="hidden lg:flex items-center space-x-1 text-[13px] font-medium text-slate-300">
          <button
            onClick={() => handleNavClick("hero")}
            className="px-3 py-1.5 rounded-full hover:text-white hover:bg-white/[0.05] transition-all"
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick("flagships")}
            className="px-3 py-1.5 rounded-full hover:text-white hover:bg-white/[0.05] transition-all flex items-center space-x-1"
          >
            <Flame className="h-3 w-3 text-amber-400" />
            <span>Flagships</span>
          </button>
          <button
            onClick={() => handleNavClick("directory")}
            className="px-3 py-1.5 rounded-full hover:text-white hover:bg-white/[0.05] transition-all"
          >
            AI Directory
          </button>
          <button
            onClick={() => handleNavClick("stacks")}
            className="px-3 py-1.5 rounded-full hover:text-white hover:bg-white/[0.05] transition-all flex items-center space-x-1"
          >
            <Workflow className="h-3 w-3 text-emerald-400" />
            <span>Stack Recipes</span>
          </button>
          <button
            onClick={() => handleNavClick("news")}
            className="px-3 py-1.5 rounded-full hover:text-white hover:bg-white/[0.05] transition-all"
          >
            Daily Wire
          </button>
          <button
            onClick={() => {
              setActiveView("library");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className={`px-3 py-1.5 rounded-full transition-all flex items-center space-x-1.5 ${
              activeView === "library"
                ? "bg-white/[0.1] text-emerald-400 font-semibold"
                : "hover:text-white hover:bg-white/[0.05]"
            }`}
          >
            <Bookmark className="h-3 w-3" />
            <span>Saved</span>
            {savedCount > 0 && (
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-emerald-500 px-1 text-[10px] font-bold text-zinc-950">
                {savedCount}
              </span>
            )}
          </button>
        </nav>

        {/* Right Action Tools: ⌘K Spotlight + Compare Matrix */}
        <div className="flex items-center space-x-2">
          {/* Compare Button */}
          {selectedCompareCount > 0 && (
            <motion.button
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={onOpenCompare}
              className="flex items-center space-x-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 px-3 py-1 text-xs font-semibold text-emerald-400 hover:bg-emerald-500 hover:text-zinc-950 transition-all shadow-sm"
              title="Open side-by-side comparison matrix"
            >
              <Scale className="h-3.5 w-3.5" />
              <span>Compare ({selectedCompareCount})</span>
            </motion.button>
          )}

          {/* ⌘K Quick Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="flex items-center space-x-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs text-slate-300 hover:border-white/[0.18] hover:text-white hover:bg-white/[0.06] transition-all group"
            title="Search AI models and tech dispatches"
          >
            <Search className="h-3.5 w-3.5 text-slate-400 group-hover:text-emerald-400 transition-colors" />
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden sm:inline-flex items-center rounded bg-white/[0.08] px-1.5 py-0.5 font-mono text-[10px] text-slate-400">
              ⌘K
            </kbd>
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden flex items-center justify-center h-8 w-8 rounded-full border border-white/[0.08] bg-white/[0.04] text-slate-300 hover:text-white"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="pointer-events-auto mt-2 rounded-2xl border border-white/[0.1] bg-[#0E1017]/95 p-3 shadow-2xl backdrop-blur-2xl lg:hidden flex flex-col space-y-1"
          >
            <button
              onClick={() => handleNavClick("hero")}
              className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-white/[0.06]"
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick("flagships")}
              className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-white/[0.06] flex items-center space-x-2"
            >
              <Flame className="h-4 w-4 text-amber-400" />
              <span>Flagships</span>
            </button>
            <button
              onClick={() => handleNavClick("directory")}
              className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-white/[0.06]"
            >
              AI Directory
            </button>
            <button
              onClick={() => handleNavClick("stacks")}
              className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-white/[0.06] flex items-center space-x-2"
            >
              <Workflow className="h-4 w-4 text-emerald-400" />
              <span>Stack Recipes</span>
            </button>
            <button
              onClick={() => handleNavClick("news")}
              className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-white/[0.06]"
            >
              Daily News Wire
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setActiveView("library");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm text-emerald-400 hover:bg-white/[0.06] flex items-center justify-between"
            >
              <span className="flex items-center space-x-2">
                <Bookmark className="h-4 w-4" />
                <span>Saved Library</span>
              </span>
              {savedCount > 0 && (
                <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-xs font-bold text-zinc-950">
                  {savedCount}
                </span>
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
