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
  ArrowUpRight
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
        className={`sticky top-0 z-40 w-full border-b transition-editorial ${
          scrolled
            ? "bg-[#09090B]/90 backdrop-blur-md border-[#27272A]"
            : "bg-[#09090B] border-[#27272A]/60"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
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
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded font-mono text-[9px] font-semibold bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                      LIVE
                    </span>
                  </div>
                  <span className="hidden sm:block font-mono text-[10px] text-[#71717A] tracking-wider uppercase">
                    Live AI Intelligence & Ecosystem Index
                  </span>
                </div>
              </Link>

              <nav className="hidden md:flex items-center gap-1 pl-4 border-l border-[#27272A]">
                {navLinks.map((link) => {
                  const isActive =
                    link.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(link.href);

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`px-3 py-1.5 rounded-lg font-mono text-xs transition-editorial flex items-center gap-1.5 ${
                        isActive
                          ? "bg-[#18181C] text-[#FAFAFA] font-medium border border-[#3F3F46]"
                          : "text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#121215]"
                      }`}
                    >
                      <link.icon className={`w-3.5 h-3.5 ${isActive ? "text-[#F97316]" : "text-[#71717A]"}`} />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#121215] border border-[#27272A] hover:border-[#3F3F46] text-[#A1A1AA] hover:text-[#FAFAFA] transition-editorial text-xs font-mono group"
              >
                <Search className="w-3.5 h-3.5 text-[#71717A] group-hover:text-[#F97316] transition-editorial" />
                <span className="hidden sm:inline">Search Index</span>
                <kbd className="hidden sm:inline-block px-1.5 py-0.2 bg-[#18181C] border border-[#27272A] rounded text-[10px] text-[#71717A]">
                  ⌘K
                </kbd>
              </button>

              <Link
                href="/directory"
                className="hidden lg:inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#FAFAFA] text-[#09090B] font-mono text-xs font-semibold hover:bg-white transition-editorial"
              >
                <span>45 AI Nodes</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg bg-[#121215] border border-[#27272A] text-[#A1A1AA] hover:text-[#FAFAFA]"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#27272A] bg-[#09090B] px-4 py-4 space-y-2 animate-in fade-in duration-150">
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
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg font-mono text-xs ${
                    isActive
                      ? "bg-[#18181C] text-[#FAFAFA] font-medium border border-[#3F3F46]"
                      : "text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#121215]"
                  }`}
                >
                  <link.icon className="w-4 h-4 text-[#F97316]" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
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
