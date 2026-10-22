import React from "react";
import Link from "next/link";
import { BrandLogo } from "./BrandLogo";
import { Database, Newspaper, Shield, Terminal } from "lucide-react";

export function ShowcaseFooter() {
  return (
    <footer className="w-full border-t border-[#27272A] bg-[#09090B] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12 pb-12 border-b border-[#27272A]">
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <BrandLogo name="Optimus Prime" slug="optimus" size="md" />
              <div>
                <span className="font-heading font-bold text-base text-[#FAFAFA] block">
                  Optimus Prime
                </span>
                <span className="font-mono text-[10px] text-[#71717A] uppercase tracking-wider block">
                  Intelligence Wire
                </span>
              </div>
            </div>
            <p className="text-xs text-[#A1A1AA] leading-relaxed font-sans">
              Live AI Intelligence & Comprehensive Ecosystem Index. Ingesting breaking model releases, developer tooling, and verified industry architectures.
            </p>
            <div className="flex items-center gap-2 font-mono text-[11px] text-[#10B981]">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              <span>SYSTEM ONLINE • 45 VERIFIED NODES</span>
            </div>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <span className="text-[#FAFAFA] font-semibold uppercase tracking-wider text-[11px] block">
              Platform Nodes
            </span>
            <ul className="space-y-2 text-[#A1A1AA]">
              <li>
                <Link href="/" className="hover:text-[#FAFAFA] transition-editorial flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-[#F97316]" />
                  <span>Command Center</span>
                </Link>
              </li>
              <li>
                <Link href="/news" className="hover:text-[#FAFAFA] transition-editorial flex items-center gap-1.5">
                  <Newspaper className="w-3.5 h-3.5 text-[#10B981]" />
                  <span>Daily AI News Wire</span>
                </Link>
              </li>
              <li>
                <Link href="/directory" className="hover:text-[#FAFAFA] transition-editorial flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-[#FAFAFA]" />
                  <span>All-Type AI Directory</span>
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <span className="text-[#FAFAFA] font-semibold uppercase tracking-wider text-[11px] block">
              Ecosystem Hubs
            </span>
            <ul className="space-y-2 text-[#A1A1AA]">
              <li>
                <Link href="/directory?company=Google" className="hover:text-[#FAFAFA] transition-editorial">
                  Google DeepMind Hub
                </Link>
              </li>
              <li>
                <Link href="/directory?company=OpenAI" className="hover:text-[#FAFAFA] transition-editorial">
                  OpenAI Frontier Hub
                </Link>
              </li>
              <li>
                <Link href="/directory?company=Anthropic" className="hover:text-[#FAFAFA] transition-editorial">
                  Anthropic Constitutional AI
                </Link>
              </li>
              <li>
                <Link href="/directory?company=Meta" className="hover:text-[#FAFAFA] transition-editorial">
                  Meta FAIR & Open Weights
                </Link>
              </li>
              <li>
                <Link href="/directory?company=Vercel" className="hover:text-[#FAFAFA] transition-editorial">
                  Vercel Generative UI
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <span className="text-[#FAFAFA] font-semibold uppercase tracking-wider text-[11px] block">
              Intelligence Telemetry
            </span>
            <div className="p-3.5 rounded-lg bg-[#121215] border border-[#27272A] space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#71717A]">Data Pipeline:</span>
                <span className="text-[#FAFAFA]">HackerNews & Dev.to API</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#71717A]">Synthesis Engine:</span>
                <span className="text-[#F97316]">Gemini 3.8 Flash</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#71717A]">Framework:</span>
                <span className="text-[#10B981]">Next.js 16 App Router</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-[#71717A]">
          <div>
            © {new Date().getFullYear()} Optimus Prime. Live AI Intelligence & Ecosystem Index.
          </div>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-[#10B981]">
              <Shield className="w-3.5 h-3.5" />
              <span>Zero Synthetic Slop • 100% Verified URLs</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
