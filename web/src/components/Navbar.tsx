"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  ArrowRight,
  Sparkles,
  Layers,
  Menu,
  X,
  ArrowUpRight,
  Compass,
  Cpu,
  Palette,
  Code2,
  Lock
} from "lucide-react";
import { BrandLogo } from "./BrandLogo";

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const megaMenuRef = useRef<HTMLDivElement>(null);
  const switcherRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on outside click or route change
  useEffect(() => {
    setMegaMenuOpen(false);
    setSwitcherOpen(false);
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        megaMenuRef.current &&
        !megaMenuRef.current.contains(e.target as Node)
      ) {
        setMegaMenuOpen(false);
      }
      if (
        switcherRef.current &&
        !switcherRef.current.contains(e.target as Node)
      ) {
        setSwitcherOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "bg-[#000000]/85 backdrop-blur-2xl border-b border-white/[0.08]"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Left: Clean Wordmark with Ecosystem Switcher Chevron */}
            <div className="flex items-center gap-8">
              <div className="relative" ref={switcherRef}>
                <div className="flex items-center gap-2.5">
                  <Link
                    href="/"
                    className="flex items-center gap-2.5 group focus:outline-none"
                  >
                    <BrandLogo name="Optimus Prime" slug="optimus" size="sm" />
                    <span className="font-heading font-medium text-lg tracking-tight text-[#FFFFFF] group-hover:text-zinc-200 transition-colors">
                      Optimus Prime
                    </span>
                  </Link>

                  <button
                    onClick={() => setSwitcherOpen(!switcherOpen)}
                    aria-label="Switch ecosystem view"
                    className="p-1 rounded-full text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors focus:outline-none"
                  >
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        switcherOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </div>

                {/* Ecosystem Switcher Dropdown */}
                {switcherOpen && (
                  <div className="absolute left-0 mt-3 w-64 rounded-2xl bg-[#111318] border border-white/[0.1] shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-2 text-[11px] font-sans text-[#9AA0A6] uppercase tracking-wider">
                      Ecosystem Navigation
                    </div>
                    <Link
                      href="/"
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-white/[0.06] text-sm text-white transition-colors"
                    >
                      <Sparkles className="w-4 h-4 text-[#8AB4F8]" />
                      <span>Optimus Prime Home</span>
                    </Link>
                    <Link
                      href="/news"
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-white/[0.06] text-sm text-zinc-300 hover:text-white transition-colors"
                    >
                      <Compass className="w-4 h-4 text-emerald-400" />
                      <span>Daily AI News Wire</span>
                    </Link>
                    <Link
                      href="/directory"
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-white/[0.06] text-sm text-zinc-300 hover:text-white transition-colors"
                    >
                      <Layers className="w-4 h-4 text-orange-400" />
                      <span>AI Ecosystem Directory</span>
                    </Link>
                    <div className="my-1 border-t border-white/[0.08]" />
                    <Link
                      href="/admin"
                      className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-white/[0.06] text-sm text-zinc-400 hover:text-white transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <Lock className="w-4 h-4 text-zinc-500" />
                        <span>Super Admin Console</span>
                      </div>
                      <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500" />
                    </Link>
                  </div>
                )}
              </div>

              {/* Center-Left Nav Items */}
              <nav className="hidden lg:flex items-center gap-1" ref={megaMenuRef}>
                {/* Models & Tools Mega Menu Trigger */}
                <div
                  className="relative"
                  onMouseEnter={() => setMegaMenuOpen(true)}
                >
                  <button
                    onClick={() => setMegaMenuOpen(!megaMenuOpen)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-sans transition-colors ${
                      megaMenuOpen || pathname.startsWith("/directory")
                        ? "text-[#FFFFFF] bg-white/[0.06]"
                        : "text-[#9AA0A6] hover:text-[#FFFFFF]"
                    }`}
                  >
                    <span>Models &amp; Tools</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        megaMenuOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* DeepMind 3-Column Glass Mega-Menu */}
                  {megaMenuOpen && (
                    <div
                      className="absolute left-0 mt-3 w-[820px] rounded-[24px] bg-[#111318]/95 backdrop-blur-2xl border border-white/[0.1] shadow-2xl p-6 z-50 animate-in fade-in zoom-in-95 duration-150"
                      onMouseLeave={() => setMegaMenuOpen(false)}
                    >
                      <div className="grid grid-cols-3 gap-6">
                        {/* Column 1: Frontier & Agentic AI */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-xs font-sans text-[#8AB4F8] font-medium tracking-wide">
                            <Cpu className="w-3.5 h-3.5" />
                            <span>Frontier &amp; Agentic AI</span>
                          </div>
                          <div className="space-y-1">
                            {[
                              { name: "Google Gemini", desc: "Frontier multi-modal reasoning and code", slug: "google-gemini" },
                              { name: "Google Antigravity", desc: "Autonomous agentic IDE engineering system", slug: "google-antigravity" },
                              { name: "ChatGPT", desc: "Conversational frontier reasoning model", slug: "chatgpt" },
                              { name: "Claude", desc: "Constitutional AI for complex engineering", slug: "claude" },
                              { name: "Grok", desc: "Real-time search and reasoning intelligence", slug: "grok" },
                            ].map((item) => (
                              <Link
                                key={item.slug}
                                href={`/directory?tool=${item.slug}`}
                                className="block p-2.5 rounded-xl hover:bg-white/[0.06] transition-colors group"
                              >
                                <span className="font-heading text-sm text-white font-normal group-hover:text-[#8AB4F8] transition-colors block">
                                  {item.name}
                                </span>
                                <span className="text-xs text-[#9AA0A6] block leading-snug line-clamp-1">
                                  {item.desc}
                                </span>
                              </Link>
                            ))}
                          </div>
                        </div>

                        {/* Column 2: Creative, UI & Editing AI */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-xs font-sans text-orange-400 font-medium tracking-wide">
                            <Palette className="w-3.5 h-3.5" />
                            <span>Creative &amp; UI Generation</span>
                          </div>
                          <div className="space-y-1">
                            {[
                              { name: "Google Veo", desc: "High-definition generative video engine", slug: "google-veo" },
                              { name: "Google Stitch", desc: "Prompt-to-UI and design generation", slug: "google-stitch" },
                              { name: "OpenAI Sora", desc: "Physics-grounded generative video model", slug: "sora" },
                              { name: "Runway", desc: "Cinematic generative AI visual studio", slug: "runway" },
                              { name: "Midjourney", desc: "Photorealistic text-to-image synthesis", slug: "midjourney" },
                              { name: "ElevenLabs", desc: "Human-grade voice synthesis and cloning", slug: "elevenlabs" },
                            ].map((item) => (
                              <Link
                                key={item.slug}
                                href={`/directory?tool=${item.slug}`}
                                className="block p-2.5 rounded-xl hover:bg-white/[0.06] transition-colors group"
                              >
                                <span className="font-heading text-sm text-white font-normal group-hover:text-orange-300 transition-colors block">
                                  {item.name}
                                </span>
                                <span className="text-xs text-[#9AA0A6] block leading-snug line-clamp-1">
                                  {item.desc}
                                </span>
                              </Link>
                            ))}
                          </div>
                        </div>

                        {/* Column 3: Open & Developer Systems */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-xs font-sans text-emerald-400 font-medium tracking-wide">
                            <Code2 className="w-3.5 h-3.5" />
                            <span>Open Weights &amp; Developer</span>
                          </div>
                          <div className="space-y-1">
                            {[
                              { name: "Meta Llama", desc: "Open-weights frontier foundation model", slug: "meta-llama" },
                              { name: "Cursor", desc: "Agentic AI code editor with completions", slug: "cursor" },
                              { name: "Perplexity AI", desc: "Cited search and deep research engine", slug: "perplexity-ai" },
                              { name: "NotebookLM", desc: "Source-grounded synthesis & audio overview", slug: "notebooklm" },
                            ].map((item) => (
                              <Link
                                key={item.slug}
                                href={`/directory?tool=${item.slug}`}
                                className="block p-2.5 rounded-xl hover:bg-white/[0.06] transition-colors group"
                              >
                                <span className="font-heading text-sm text-white font-normal group-hover:text-emerald-300 transition-colors block">
                                  {item.name}
                                </span>
                                <span className="text-xs text-[#9AA0A6] block leading-snug line-clamp-1">
                                  {item.desc}
                                </span>
                              </Link>
                            ))}
                          </div>

                          <div className="pt-3 border-t border-white/[0.08]">
                            <Link
                              href="/directory"
                              className="inline-flex items-center gap-1.5 text-xs text-[#8AB4F8] hover:text-white font-medium transition-colors p-2"
                            >
                              <span>Explore all 45+ AI systems</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <Link
                  href="/news"
                  className={`px-3.5 py-2 rounded-full text-sm font-sans transition-colors ${
                    pathname === "/news"
                      ? "text-white bg-white/[0.06]"
                      : "text-[#9AA0A6] hover:text-white"
                  }`}
                >
                  Daily News
                </Link>

                <Link
                  href="/directory?company=Google"
                  className="px-3.5 py-2 rounded-full text-sm font-sans text-[#9AA0A6] hover:text-white transition-colors"
                >
                  Ecosystems
                </Link>

                <Link
                  href="/"
                  className="px-3.5 py-2 rounded-full text-sm font-sans text-[#9AA0A6] hover:text-white transition-colors"
                >
                  About
                </Link>
              </nav>
            </div>

            {/* Right Actions: DeepMind Signature Capsule Pills */}
            <div className="hidden sm:flex items-center gap-3">
              <Link
                href="/directory"
                className="px-4 py-2 rounded-full border border-white/[0.12] hover:border-white/25 text-xs font-sans text-[#FFFFFF] hover:bg-white/[0.04] transition-all"
              >
                Explore Directory
              </Link>

              <Link
                href="/news"
                className="px-4 py-2 rounded-full bg-[#8AB4F8] hover:bg-[#A8C7FA] text-black font-medium text-xs font-sans transition-all shadow-sm"
              >
                Live News Wire
              </Link>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex sm:hidden items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-full text-zinc-300 hover:text-white focus:outline-none"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="sm:hidden px-4 pt-2 pb-6 bg-[#111318] border-b border-white/[0.08] space-y-2">
            <Link
              href="/"
              className="block px-4 py-3 rounded-xl text-base text-white hover:bg-white/[0.06]"
            >
              Overview
            </Link>
            <Link
              href="/news"
              className="block px-4 py-3 rounded-xl text-base text-zinc-300 hover:text-white hover:bg-white/[0.06]"
            >
              Daily AI News Wire
            </Link>
            <Link
              href="/directory"
              className="block px-4 py-3 rounded-xl text-base text-zinc-300 hover:text-white hover:bg-white/[0.06]"
            >
              All-Type AI Directory (45+ Models)
            </Link>
            <Link
              href="/admin"
              className="block px-4 py-3 rounded-xl text-base text-zinc-400 hover:text-white hover:bg-white/[0.06]"
            >
              Super Admin Console
            </Link>
          </div>
        )}
      </header>
    </>
  );
}
