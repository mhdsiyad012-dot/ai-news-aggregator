"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  ArrowUpRight,
  Sparkles,
  Menu,
  X,
  Cpu,
  Layers,
  ShieldCheck,
  Terminal,
  Wand2,
  Globe,
} from "lucide-react";

type MegaMenuKey = "models" | "news" | "ecosystems" | "about" | null;

export default function DeepMindNavigation() {
  const pathname = usePathname();
  const [activeMenu, setActiveMenu] = useState<MegaMenuKey>(null);
  const [brandDropdownOpen, setBrandDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isStickyPillDocked, setIsStickyPillDocked] = useState(false);
  const [activeSection, setActiveSection] = useState("hands-on");
  const headerRef = useRef<HTMLElement>(null);

  // Detect scroll to dock the floating pill sub-navbar exactly like deepmind.google/models/gemini/
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsStickyPillDocked(scrollY > 340);

      // Update active section indicator based on scroll position
      const sections = ["hands-on", "ecosystems", "directory", "safety"];
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 180 && rect.bottom >= 180) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on outside click or route change
  useEffect(() => {
    setActiveMenu(null);
    setBrandDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [pathname]);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: "smooth" });
    } else {
      window.location.href = `/#${id}`;
    }
  };

  return (
    <>
      {/* =====================================================================
          TIER 1: GLOBAL DEEPMIND TOP NAVBAR + MEGA MENU
      ===================================================================== */}
      <header
        ref={headerRef}
        onMouseLeave={() => setActiveMenu(null)}
        className={`fixed top-0 left-0 right-0 z-50 h-16 transition-all duration-300 ${
          isStickyPillDocked && !activeMenu
            ? "-translate-y-full opacity-0 pointer-events-none"
            : "translate-y-0 opacity-100"
        } bg-black/80 backdrop-blur-md border-b border-white/[0.08]`}
      >
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
          {/* Left: Brand Wordmark + Ecosystem Switcher + Main Nav Triggers */}
          <div className="flex items-center gap-8">
            {/* Brand Switcher ("Google DeepMind ⌄" Replica) */}
            <div className="relative">
              <button
                onClick={() => {
                  setBrandDropdownOpen(!brandDropdownOpen);
                  setActiveMenu(null);
                }}
                className="flex items-center gap-2 text-white hover:text-[#9AA0A6] transition-colors py-2 focus:outline-none"
              >
                <span className="text-[18px] sm:text-[20px] font-semibold text-white tracking-[-0.02em]">
                  Optimus Prime
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-[#9AA0A6] transition-transform duration-200 ${
                    brandDropdownOpen ? "rotate-180 text-white" : ""
                  }`}
                />
              </button>

              {/* Brand Ecosystem Switcher Dropdown */}
              {brandDropdownOpen && (
                <div className="absolute top-full left-0 mt-3 w-[320px] rounded-[24px] bg-[#111318]/95 backdrop-blur-3xl border border-white/[0.1] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.85)] z-50">
                  <div className="px-3 py-1.5 text-[11px] font-medium tracking-wider uppercase text-[#9AA0A6]">
                    Optimus Prime Intelligence
                  </div>
                  <div className="mt-1 space-y-1">
                    <Link
                      href="/"
                      className="block px-3 py-2.5 rounded-[16px] hover:bg-white/[0.06] transition"
                    >
                      <div className="text-[14px] font-medium text-white">
                        Optimus Prime Hub
                      </div>
                      <div className="text-[12px] text-[#9AA0A6]">
                        Explore the frontier of AI systems
                      </div>
                    </Link>
                    <Link
                      href="/news"
                      className="block px-3 py-2.5 rounded-[16px] hover:bg-white/[0.06] transition"
                    >
                      <div className="text-[14px] font-medium text-white">
                        Daily AI News Wire
                      </div>
                      <div className="text-[12px] text-[#9AA0A6]">
                        Real-time breakthroughs &amp; Gemini synthesis
                      </div>
                    </Link>
                    <Link
                      href="/directory"
                      className="block px-3 py-2.5 rounded-[16px] hover:bg-white/[0.06] transition"
                    >
                      <div className="text-[14px] font-medium text-white">
                        All-Type AI Directory
                      </div>
                      <div className="text-[12px] text-[#9AA0A6]">
                        45+ verified models filtered by company &amp; purpose
                      </div>
                    </Link>
                  </div>

                  <div className="my-3 border-t border-white/[0.08]" />

                  <div className="px-3 py-1.5 text-[11px] font-medium tracking-wider uppercase text-[#9AA0A6]">
                    Products &amp; Control
                  </div>
                  <div className="mt-1 space-y-1">
                    <Link
                      href="/directory?company=Google"
                      className="block px-3 py-2.5 rounded-[16px] hover:bg-white/[0.06] transition"
                    >
                      <div className="text-[14px] font-medium text-white">
                        Google AI &amp; Antigravity
                      </div>
                      <div className="text-[12px] text-[#9AA0A6]">
                        Gemini, Antigravity, Stitch, Veo &amp; NotebookLM
                      </div>
                    </Link>
                    <Link
                      href="/admin"
                      className="block px-3 py-2.5 rounded-[16px] hover:bg-white/[0.06] transition"
                    >
                      <div className="text-[14px] font-medium text-[#8AB4F8]">
                        Super Admin Console
                      </div>
                      <div className="text-[12px] text-[#9AA0A6]">
                        Live Gemini API key manager &amp; CRUD
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Desktop Navigation Triggers */}
            <nav className="hidden lg:flex items-center gap-1">
              {(
                [
                  { id: "models", label: "Models" },
                  { id: "news", label: "Research & News" },
                  { id: "ecosystems", label: "Ecosystems" },
                  { id: "about", label: "About" },
                ] as const
              ).map((item) => {
                const isOpen = activeMenu === item.id;
                return (
                  <button
                    key={item.id}
                    onMouseEnter={() => {
                      setActiveMenu(item.id);
                      setBrandDropdownOpen(false);
                    }}
                    onClick={() =>
                      setActiveMenu(isOpen ? null : item.id)
                    }
                    className={`px-4 py-2 rounded-full text-[14px] font-normal transition-all duration-200 flex items-center gap-1.5 ${
                      isOpen
                        ? "bg-white/[0.1] text-white"
                        : "text-[#9AA0A6] hover:text-white hover:bg-white/[0.04]"
                    }`}
                  >
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right: DeepMind Pill CTA Buttons ("Explore Directory" & "✦ Live AI Wire" Replica) */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/directory"
              className="rounded-full border border-white/15 bg-white/[0.03] px-4 py-2 text-sm text-white hover:bg-white/[0.08] transition-all"
            >
              <span>Explore Directory</span>
            </Link>
            <Link
              href="/news"
              className="rounded-full bg-[#a8c7fa] px-4 py-2 text-sm font-medium text-slate-950 hover:bg-[#bfdbfe] transition-all flex items-center gap-1.5 shadow-sm"
            >
              <span>✦ Live AI Wire</span>
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-full text-[#9AA0A6] hover:text-white hover:bg-white/[0.06]"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* ===================================================================
            FULL-WIDTH GLASS MEGA-MENU PANEL (Exact DeepMind 4-Column Layout)
        =================================================================== */}
        {activeMenu && (
          <div className="hidden lg:block w-full bg-[#0B0C10]/95 backdrop-blur-3xl border-b border-white/[0.08] shadow-[0_32px_90px_rgba(0,0,0,0.9)] animate-in fade-in duration-200">
            <div className="max-w-[1440px] mx-auto px-10 py-12">
              {activeMenu === "models" && (
                <div className="grid grid-cols-12 gap-10">
                  {/* Left Intro Column */}
                  <div className="col-span-3 flex flex-col justify-between pr-6 border-r border-white/[0.08]">
                    <div>
                      <h3 className="text-[24px] font-normal text-white leading-[1.25] tracking-[-0.02em]">
                        Explore our next generation AI systems
                      </h3>
                      <p className="mt-3 text-[14px] text-[#9AA0A6] leading-relaxed">
                        Filter 45+ genuine frontier models, coding agents, and creative studios by purpose or company.
                      </p>
                    </div>
                    <Link
                      href="/directory"
                      className="mt-8 inline-flex items-center gap-2 text-[14px] font-medium text-[#8AB4F8] hover:text-white transition"
                    >
                      <span>Explore all 45+ models</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </div>

                  {/* Column 2: Frontier & Agentic AI */}
                  <div className="col-span-3 space-y-2">
                    <div className="px-3 text-[12px] font-medium text-[#9AA0A6]">
                      Frontier &amp; Agentic AI
                    </div>
                    {[
                      {
                        name: "Google Gemini",
                        desc: "Build intelligent multimodal agents",
                        href: "/directory?tool=google-gemini",
                      },
                      {
                        name: "Google Antigravity",
                        desc: "Agent-first autonomous AI IDE",
                        href: "/directory?tool=google-antigravity",
                      },
                      {
                        name: "Google Stitch",
                        desc: "Prompt-to-UI design & code engine",
                        href: "/directory?tool=google-stitch",
                      },
                      {
                        name: "Claude & Claude Code",
                        desc: "High-precision reasoning & CLI agent",
                        href: "/directory?company=Anthropic",
                      },
                    ].map((m) => (
                      <Link
                        key={m.name}
                        href={m.href}
                        className="block p-3 rounded-[16px] hover:bg-white/[0.05] transition group"
                      >
                        <div className="text-[15px] font-normal text-white group-hover:text-[#8AB4F8] transition-colors">
                          {m.name}
                        </div>
                        <div className="text-[13px] text-[#9AA0A6] mt-0.5">
                          {m.desc}
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* Column 3: Specialized & Editing Models */}
                  <div className="col-span-3 space-y-2">
                    <div className="px-3 text-[12px] font-medium text-[#9AA0A6]">
                      Specialized &amp; Editing Models
                    </div>
                    {[
                      {
                        name: "Google Veo",
                        desc: "Generate cinematic video with audio",
                        href: "/directory?tool=google-veo",
                      },
                      {
                        name: "OpenAI Sora",
                        desc: "Timeline video synthesis & remixing",
                        href: "/directory?tool=openai-sora",
                      },
                      {
                        name: "Runway Gen-3",
                        desc: "Professional VFX & motion brush studio",
                        href: "/directory?tool=runway-gen3",
                      },
                      {
                        name: "ElevenLabs & Lyria",
                        desc: "Generate high-fidelity voice and music",
                        href: "/directory?category=Audio%2C%20Voice%20%26%20Music%20AI",
                      },
                    ].map((m) => (
                      <Link
                        key={m.name}
                        href={m.href}
                        className="block p-3 rounded-[16px] hover:bg-white/[0.05] transition group"
                      >
                        <div className="text-[15px] font-normal text-white group-hover:text-[#8AB4F8] transition-colors">
                          {m.name}
                        </div>
                        <div className="text-[13px] text-[#9AA0A6] mt-0.5">
                          {m.desc}
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* Column 4: Open Models & Research */}
                  <div className="col-span-3 space-y-2">
                    <div className="px-3 text-[12px] font-medium text-[#9AA0A6]">
                      Open Models &amp; Search
                    </div>
                    {[
                      {
                        name: "Gemma & Meta Llama",
                        desc: "Build open-weights AI at scale",
                        href: "/directory?company=Meta",
                      },
                      {
                        name: "NotebookLM",
                        desc: "Source-grounded research & audio",
                        href: "/directory?tool=google-notebooklm",
                      },
                      {
                        name: "Perplexity AI",
                        desc: "Real-time cited answer engine",
                        href: "/directory?tool=perplexity-ai",
                      },
                      {
                        name: "Cursor IDE",
                        desc: "Multi-file codebase Composer agent",
                        href: "/directory?tool=cursor-ide",
                      },
                    ].map((m) => (
                      <Link
                        key={m.name}
                        href={m.href}
                        className="block p-3 rounded-[16px] hover:bg-white/[0.05] transition group"
                      >
                        <div className="text-[15px] font-normal text-white group-hover:text-[#8AB4F8] transition-colors">
                          {m.name}
                        </div>
                        <div className="text-[13px] text-[#9AA0A6] mt-0.5">
                          {m.desc}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {activeMenu === "news" && (
                <div className="grid grid-cols-12 gap-10">
                  <div className="col-span-4 pr-6 border-r border-white/[0.08] flex flex-col justify-between">
                    <div>
                      <h3 className="text-[24px] font-normal text-white leading-[1.25]">
                        Our latest AI breakthroughs and live industry updates
                      </h3>
                      <p className="mt-3 text-[14px] text-[#9AA0A6]">
                        Real-time curated AI dispatches synthesized with Gemini 3.8 Flash and direct source verification.
                      </p>
                    </div>
                    <Link
                      href="/news"
                      className="mt-8 inline-flex items-center gap-2 text-[14px] font-medium text-[#8AB4F8] hover:text-white"
                    >
                      <span>Open Daily AI News Wire</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </div>
                  <div className="col-span-8 grid grid-cols-3 gap-4">
                    {[
                      {
                        title: "Frontier LLMs & Reasoning",
                        desc: "Breakthroughs in long-horizon thinking, context windows, and multimodal synthesis.",
                        href: "/news?category=LLMs",
                      },
                      {
                        title: "Coding & Autonomous Agents",
                        desc: "Terminal agents, SWE benchmarks, and autonomous software engineering.",
                        href: "/news?category=Coding%20%26%20Agents",
                      },
                      {
                        title: "Design, Video & World Models",
                        desc: "Generative video, 3D spatial environments, and UI synthesis releases.",
                        href: "/news?category=Design%20%26%20Media",
                      },
                    ].map((cat) => (
                      <Link
                        key={cat.title}
                        href={cat.href}
                        className="p-5 rounded-[20px] bg-[#111318] hover:bg-[#171A21] border border-white/[0.07] transition group"
                      >
                        <div className="text-[16px] font-normal text-white group-hover:text-[#8AB4F8]">
                          {cat.title}
                        </div>
                        <p className="mt-2 text-[13px] text-[#9AA0A6] leading-relaxed">
                          {cat.desc}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {activeMenu === "ecosystems" && (
                <div className="grid grid-cols-12 gap-10">
                  <div className="col-span-4 pr-6 border-r border-white/[0.08]">
                    <h3 className="text-[24px] font-normal text-white leading-[1.25]">
                      Filter every AI system by company or creator
                    </h3>
                    <p className="mt-3 text-[14px] text-[#9AA0A6]">
                      Jump directly to a company’s complete model stack inside the Optimus Prime directory.
                    </p>
                  </div>
                  <div className="col-span-8 grid grid-cols-4 gap-3">
                    {[
                      { name: "Google", count: "Gemini, Antigravity, Stitch, Veo" },
                      { name: "OpenAI", count: "ChatGPT, Sora, Codex, o-series" },
                      { name: "Anthropic", count: "Claude, Claude Code, Artifacts" },
                      { name: "Meta", count: "Llama, Segment Anything, Meta AI" },
                      { name: "xAI", count: "Grok, Grok API" },
                      { name: "Vercel", count: "v0, Vercel AI SDK" },
                      { name: "Creative & Editing Specialists", count: "Runway, Midjourney, Descript" },
                      { name: "Developer & Search Leaders", count: "Cursor, Windsurf, Perplexity" },
                    ].map((co) => (
                      <Link
                        key={co.name}
                        href={`/directory?company=${encodeURIComponent(co.name)}`}
                        className="p-4 rounded-[18px] bg-[#111318] hover:bg-[#171A21] border border-white/[0.07] transition"
                      >
                        <div className="text-[15px] font-medium text-white">
                          {co.name}
                        </div>
                        <div className="text-[12px] text-[#9AA0A6] mt-1 line-clamp-1">
                          {co.count}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {activeMenu === "about" && (
                <div className="grid grid-cols-12 gap-10">
                  <div className="col-span-5 pr-6 border-r border-white/[0.08]">
                    <h3 className="text-[24px] font-normal text-white leading-[1.25]">
                      Our mission is to index live AI breakthroughs with zero synthetic noise
                    </h3>
                    <p className="mt-3 text-[14px] text-[#9AA0A6]">
                      Powered by Google Gemini 3.8 Flash and Supabase PostgreSQL with live key management.
                    </p>
                  </div>
                  <div className="col-span-7 flex items-center gap-4">
                    <Link
                      href="/admin"
                      className="flex-1 p-6 rounded-[24px] bg-[#111318] hover:bg-[#171A21] border border-white/[0.08] transition"
                    >
                      <div className="text-[17px] font-normal text-white">
                        Super Admin Command Center
                      </div>
                      <p className="mt-1.5 text-[13px] text-[#9AA0A6]">
                        Test Gemini API latency, swap active keys globally, and manage all 45+ AI systems.
                      </p>
                    </Link>
                    <Link
                      href="/directory"
                      className="flex-1 p-6 rounded-[24px] bg-[#111318] hover:bg-[#171A21] border border-white/[0.08] transition"
                    >
                      <div className="text-[17px] font-normal text-white">
                        Dual-Filter Architecture
                      </div>
                      <p className="mt-1.5 text-[13px] text-[#9AA0A6]">
                        Simultaneously intersect Purpose categories with Company ecosystems.
                      </p>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* =====================================================================
          TIER 2: STICKY FLOATING PILL SUB-NAVBAR
          ("Explore the latest | Ecosystems | Frontier Models | ✦ Admin" Replica)
      ===================================================================== */}
      <div
        className={`fixed left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${
          isStickyPillDocked
            ? "top-4 opacity-100 translate-y-0"
            : "top-20 opacity-0 -translate-y-3 pointer-events-none"
        }`}
      >
        <div className="flex items-center gap-1 p-1.5 rounded-full bg-[#111318]/90 border border-white/10 backdrop-blur-xl shadow-[0_16px_48px_rgba(0,0,0,0.85)]">
          {/* Section Jump Pills */}
          {[
            { id: "hands-on", label: "Explore the latest" },
            { id: "ecosystems", label: "Ecosystems" },
            { id: "directory", label: "Frontier Models" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => scrollToSection(tab.id)}
              className={`px-4 py-1.5 rounded-full text-[13px] font-normal transition-all whitespace-nowrap ${
                activeSection === tab.id
                  ? "bg-white/10 text-white"
                  : "text-[#9AA0A6] hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}

          {/* Right Pill CTA inside Floating Bar: ✦ Admin */}
          <Link
            href="/admin"
            className="px-4 py-1.5 rounded-full text-[13px] font-medium text-[#8ab4f8] hover:text-white transition whitespace-nowrap flex items-center gap-1"
          >
            <span>✦ Admin</span>
          </Link>
        </div>
      </div>

      {/* =====================================================================
          MOBILE FULL-SCREEN DRAWER
      ===================================================================== */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/95 backdrop-blur-2xl pt-24 px-6 pb-10 lg:hidden overflow-y-auto">
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="text-xs uppercase tracking-wider text-[#9AA0A6]">
                Navigation
              </div>
              <Link
                href="/"
                className="block py-3 text-xl font-normal text-white border-b border-white/[0.08]"
              >
                Overview
              </Link>
              <Link
                href="/news"
                className="block py-3 text-xl font-normal text-white border-b border-white/[0.08]"
              >
                Daily AI News Wire
              </Link>
              <Link
                href="/directory"
                className="block py-3 text-xl font-normal text-white border-b border-white/[0.08]"
              >
                All-Type AI Directory (45+)
              </Link>
              <Link
                href="/admin"
                className="block py-3 text-xl font-normal text-[#8AB4F8] border-b border-white/[0.08]"
              >
                Super Admin Console
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export { DeepMindNavigation };
