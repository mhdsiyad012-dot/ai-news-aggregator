"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  Newspaper,
  Database,
  Menu,
  X,
  Layers,
  ArrowUpRight,
  Shield
} from "lucide-react";
import { BrandLogo } from "./BrandLogo";
import { CommandMenu } from "./CommandMenu";

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleOpenCommand = () => setIsSearchOpen(true);
    window.addEventListener("open-command-menu", handleOpenCommand);
    return () => window.removeEventListener("open-command-menu", handleOpenCommand);
  }, []);

  const navLinks = [
    { label: "Overview", href: "/", icon: Layers },
    { label: "Daily Wire", href: "/news", icon: Newspaper },
    { label: "Ecosystem Directory", href: "/directory", icon: Database },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-editorial ${
          scrolled
            ? "bg-[#050507]/80 backdrop-blur-xl border-b border-white/10 shadow-lg"
            : "bg-transparent border-b border-white/5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Brand Logo & Title */}
            <div className="flex items-center gap-6">
              <Link
                href="/"
                className="flex items-center gap-3 group focus:outline-none"
              >
                <BrandLogo name="Optimus Prime" slug="optimus" size="md" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-bold text-base tracking-tight text-[#FAFAFA] group-hover:text-white transition-editorial">
                      Optimus Prime
                    </span>
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full font-mono text-[9px] font-semibold bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                      LIVE
                    </span>
                  </div>
                  <span className="hidden sm:block font-mono text-[10px] text-[#71717A] tracking-wider uppercase">
                    Live AI Intelligence & Ecosystem Index
                  </span>
                </div>
              </Link>

              {/* Desktop Nav Links */}
              <nav className="hidden md:flex items-center gap-1 pl-4 border-l border-white/10">
                {navLinks.map((link) => {
                  const isActive =
                    link.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(link.href);

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`px-3.5 py-1.5 rounded-xl font-mono text-xs transition-editorial flex items-center gap-1.5 ${
                        isActive
                          ? "bg-white/10 text-[#FAFAFA] font-medium border border-white/10"
                          : "text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-white/5"
                      }`}
                    >
                      <link.icon className={`w-3.5 h-3.5 ${isActive ? "text-[#38BDF8]" : "text-[#71717A]"}`} />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Right: Search, Admin & Direct Link */}
            <div className="flex items-center gap-3">
              {/* Search Shortcut */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 text-[#A1A1AA] hover:text-[#FAFAFA] transition-editorial text-xs font-mono group"
              >
                <Search className="w-3.5 h-3.5 text-[#71717A] group-hover:text-[#38BDF8] transition-editorial" />
                <span className="hidden sm:inline">Search Index</span>
                <kbd className="hidden sm:inline-block px-1.5 py-0.2 bg-[#050507] border border-white/10 rounded text-[10px] text-[#71717A]">
                  ⌘K
                </kbd>
              </button>

              <Link
                href="/admin"
                className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-[#A1A1AA] hover:text-[#FAFAFA] transition-editorial"
                title="Super Admin Control Center"
              >
                <Shield className="w-3.5 h-3.5 text-[#F97316]" />
                <span>Admin</span>
              </Link>

              <Link
                href="/directory"
                className="hidden lg:inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#FAFAFA] text-[#050507] font-mono text-xs font-bold hover:bg-white transition-editorial shadow-sm"
              >
                <span>45 AI Nodes</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-[#A1A1AA] hover:text-[#FAFAFA]"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 bg-[#050507] px-4 py-4 space-y-2 animate-in fade-in duration-150">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl font-mono text-xs ${
                    isActive
                      ? "bg-white/10 text-[#FAFAFA] font-medium border border-white/10"
                      : "text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-white/5"
                  }`}
                >
                  <link.icon className="w-4 h-4 text-[#38BDF8]" />
                  <span>{link.label}</span>
                </Link>
              );
            })}

            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl font-mono text-xs text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-white/5 border-t border-white/5 pt-3"
            >
              <Shield className="w-4 h-4 text-[#F97316]" />
              <span>Super Admin Portal</span>
            </Link>
          </div>
        )}
      </header>

      <CommandMenu
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}
