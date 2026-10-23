"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Layers,
  Cpu,
  Globe,
  Search,
  Scale
} from "lucide-react";
import OptimusLogo from "@/components/OptimusLogo";

interface PublicSettings {
  siteName: string;
  siteLogoMode: "preset" | "image_url" | "custom_svg";
  siteLogoPreset: "prism" | "spark" | "neural" | "minimal";
  siteLogoCustom: string;
  announcementActive: boolean;
  announcementText: string;
  announcementLink: string;
}

export default function DeepMindNavigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isStickyPillDocked, setIsStickyPillDocked] = useState(false);
  const [settings, setSettings] = useState<PublicSettings | null>(null);

  // Fetch dynamic branding & announcement settings from public endpoint
  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/settings");
        const data = await res.json();
        if (data?.success && data?.settings) {
          setSettings(data.settings);
        }
      } catch (err) {
        // Fallback to default
      }
    }
    loadSettings();
  }, []);

  // Detect scroll to show/hide sticky docks if on homepage
  useEffect(() => {
    const handleScroll = () => {
      setIsStickyPillDocked(window.scrollY > 340);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/models", label: "Models" },
    { href: "/ecosystems", label: "Ecosystems" },
    { href: "/compare", label: "Compare" },
    { href: "/news", label: "Daily Wire" },
    { href: "/about", label: "About" },
  ];

  return (
    <>
      {/* =====================================================================
          ANNOUNCEMENT BANNER (Super Admin Controlled)
      ===================================================================== */}
      {settings?.announcementActive && settings?.announcementText && (
        <div className="fixed top-0 left-0 right-0 z-[60] bg-gradient-to-r from-[#6366F1]/30 via-[#38BDF8]/25 to-[#A855F7]/30 backdrop-blur-md border-b border-white/[0.1] text-center py-2 px-4 text-xs font-sans text-zinc-200">
          <Link
            href={settings.announcementLink || "/models"}
            className="hover:text-white transition inline-flex items-center gap-2 group"
          >
            <span className="w-2 h-2 rounded-full bg-[#38BDF8] animate-pulse shrink-0" />
            <span className="font-medium tracking-tight">{settings.announcementText}</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#38BDF8] group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      )}

      {/* =====================================================================
          TIER 1: GLOBAL TOP NAVBAR
      ===================================================================== */}
      <header
        className={`fixed left-0 right-0 z-50 h-16 transition-all duration-300 ${
          settings?.announcementActive && settings?.announcementText ? "top-8 sm:top-9" : "top-0"
        } bg-black/85 backdrop-blur-md border-b border-white/[0.08]`}
      >
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
          {/* Left: Brand Identity (Vector Logo + Dynamic Wordmark) */}
          <div className="flex items-center gap-8">
            <OptimusLogo
              size={32}
              showWordmark={true}
              brandName={settings?.siteName || "Optimus Prime"}
              preset={settings?.siteLogoPreset || "prism"}
              customLogoUrl={settings?.siteLogoMode === "image_url" ? settings?.siteLogoCustom : undefined}
              customSvgCode={settings?.siteLogoMode === "custom_svg" ? settings?.siteLogoCustom : undefined}
              href="/"
            />

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href) ||
                      (item.href === "/models" && pathname.startsWith("/directory")) ||
                      (item.href === "/models" && pathname.startsWith("/tool"));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-4 py-2 rounded-full text-[14px] font-normal transition-all duration-200 flex items-center gap-1.5 ${
                      isActive
                        ? "bg-white/[0.1] text-white font-medium"
                        : "text-[#9AA0A6] hover:text-white hover:bg-white/[0.04]"
                    }`}
                  >
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right: CTA Buttons & Spotlight Search */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("open-command-palette"))}
              className="rounded-full border border-white/15 bg-white/[0.04] px-3.5 py-1.5 text-xs text-zinc-300 hover:text-white hover:bg-white/[0.08] transition-all flex items-center gap-2 group font-mono"
              title="Search AI models & ecosystems (Cmd+K)"
            >
              <Search className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span className="hidden xl:inline text-zinc-400 font-sans">Search</span>
              <kbd className="px-1.5 py-0.5 rounded bg-white/[0.08] text-[10px] text-zinc-400 group-hover:text-zinc-200">
                ⌘K
              </kbd>
            </button>
            <Link
              href="/models"
              className="rounded-full border border-white/15 bg-white/[0.03] px-4 py-2 text-sm text-white hover:bg-white/[0.08] transition-all font-medium"
            >
              <span>Explore Models</span>
            </Link>
            <Link
              href="/news"
              className="rounded-full bg-gradient-to-r from-[#6366F1] to-[#38BDF8] px-4 py-2 text-sm font-medium text-white hover:opacity-95 transition-all flex items-center gap-1.5 shadow-md shadow-indigo-500/20"
            >
              <span>Daily AI Wire</span>
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-full text-[#9AA0A6] hover:text-white hover:bg-white/[0.06] focus:outline-none"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#0B0C10]/98 backdrop-blur-3xl border-b border-white/[0.08] px-6 py-6 space-y-4 animate-in fade-in duration-200">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                window.dispatchEvent(new CustomEvent("open-command-palette"));
              }}
              className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-zinc-300 hover:text-white"
            >
              <span className="flex items-center gap-2 text-sm font-sans">
                <Search className="w-4 h-4 text-[#38BDF8]" />
                <span>Spotlight Search</span>
              </span>
              <kbd className="px-2 py-0.5 rounded bg-white/[0.08] text-xs font-mono text-zinc-400">
                ⌘K
              </kbd>
            </button>

            <div className="flex flex-col space-y-1">
              {navLinks.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-4 py-3 rounded-2xl text-base transition-all ${
                      isActive
                        ? "bg-white/[0.1] text-white font-medium"
                        : "text-[#9AA0A6] hover:text-white hover:bg-white/[0.04]"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <div className="pt-4 border-t border-white/[0.08] grid grid-cols-2 gap-3">
              <Link
                href="/models"
                className="text-center py-2.5 rounded-xl border border-white/15 bg-white/[0.03] text-sm text-white"
              >
                Explore Models
              </Link>
              <Link
                href="/news"
                className="text-center py-2.5 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#38BDF8] text-sm font-medium text-white shadow-md"
              >
                Daily AI Wire
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Floating Pill Dock on Homepage */}
      {pathname === "/" && isStickyPillDocked && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-40 transition-all duration-300">
          <div className="flex items-center gap-1 p-1.5 rounded-full bg-[#11131A]/95 border border-white/15 backdrop-blur-xl shadow-[0_16px_48px_rgba(0,0,0,0.85)]">
            <Link
              href="/"
              className="px-4 py-1.5 rounded-full text-xs font-normal transition-all text-white bg-white/10"
            >
              Overview
            </Link>
            <Link
              href="/models"
              className="px-4 py-1.5 rounded-full text-xs font-normal transition-all text-[#9AA0A6] hover:text-white"
            >
              Models
            </Link>
            <Link
              href="/ecosystems"
              className="px-4 py-1.5 rounded-full text-xs font-normal transition-all text-[#9AA0A6] hover:text-white"
            >
              Ecosystems
            </Link>
            <Link
              href="/news"
              className="px-4 py-1.5 rounded-full text-xs font-normal transition-all text-[#9AA0A6] hover:text-white"
            >
              Daily Wire
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
