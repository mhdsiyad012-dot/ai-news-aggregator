import React from "react";
import Link from "next/link";
import { BrandLogo } from "./BrandLogo";
import { ArrowUpRight } from "lucide-react";

export function ShowcaseFooter() {
  return (
    <footer className="w-full border-t border-white/[0.08] bg-[#000000] mt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 lg:gap-14 pb-16 border-b border-white/[0.08]">
          {/* Brand Column */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <BrandLogo name="Optimus Prime" slug="optimus" size="sm" />
              <span className="font-heading font-medium text-lg text-white">
                Optimus Prime
              </span>
            </div>
            <p className="text-sm text-[#9AA0A6] leading-relaxed font-sans">
              Our next era of live AI intelligence, built to track frontier breakthroughs and every AI system.
            </p>
          </div>

          {/* Column 1: Models & Directory */}
          <div className="space-y-4 text-sm font-sans">
            <span className="text-white font-normal block">
              Models &amp; Directory
            </span>
            <ul className="space-y-3 text-[#9AA0A6]">
              <li>
                <Link href="/directory" className="hover:text-white transition-colors">
                  All 45+ AI Systems
                </Link>
              </li>
              <li>
                <Link href="/directory?category=Coding%20%26%20Autonomous%20Agents" className="hover:text-white transition-colors">
                  Coding &amp; Autonomous Agents
                </Link>
              </li>
              <li>
                <Link href="/directory?category=Conversational%20%26%20Reasoning%20LLMs" className="hover:text-white transition-colors">
                  Conversational &amp; Reasoning LLMs
                </Link>
              </li>
              <li>
                <Link href="/directory?category=Video%20%26%20Image%20Editing%20AI" className="hover:text-white transition-colors">
                  Generative Video &amp; Image AI
                </Link>
              </li>
              <li>
                <Link href="/directory?category=UI%2FUX%20%26%20Product%20Design%20AI" className="hover:text-white transition-colors">
                  UI/UX &amp; Design Generation
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Ecosystem Hubs */}
          <div className="space-y-4 text-sm font-sans">
            <span className="text-white font-normal block">
              Ecosystem Hubs
            </span>
            <ul className="space-y-3 text-[#9AA0A6]">
              <li>
                <Link href="/directory?company=Google" className="hover:text-white transition-colors">
                  Google DeepMind Hub
                </Link>
              </li>
              <li>
                <Link href="/directory?company=OpenAI" className="hover:text-white transition-colors">
                  OpenAI Frontier Hub
                </Link>
              </li>
              <li>
                <Link href="/directory?company=Anthropic" className="hover:text-white transition-colors">
                  Anthropic Constitutional AI
                </Link>
              </li>
              <li>
                <Link href="/directory?company=Meta" className="hover:text-white transition-colors">
                  Meta FAIR &amp; Open Weights
                </Link>
              </li>
              <li>
                <Link href="/directory?company=Creative%20%26%20Editing%20Specialists" className="hover:text-white transition-colors">
                  Creative &amp; Editing Specialists
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Platform */}
          <div className="space-y-4 text-sm font-sans">
            <span className="text-white font-normal block">
              Platform &amp; Intelligence
            </span>
            <ul className="space-y-3 text-[#9AA0A6]">
              <li>
                <Link href="/news" className="hover:text-white transition-colors">
                  Daily AI News Wire
                </Link>
              </li>
              <li>
                <Link href="/directory" className="hover:text-white transition-colors">
                  All-Type AI Directory
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white transition-colors flex items-center gap-1">
                  <span>Super Admin Console</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </li>
              <li>
                <a
                  href="https://deepmind.google/models/gemini/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1"
                >
                  <span>Gemini Model Family</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans text-[#9AA0A6]">
          <div>
            © {new Date().getFullYear()} Optimus Prime. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-white transition-colors">
              About
            </Link>
            <Link href="/news" className="hover:text-white transition-colors">
              News Wire
            </Link>
            <Link href="/directory" className="hover:text-white transition-colors">
              Ecosystems
            </Link>
            <Link href="/admin" className="hover:text-white transition-colors">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
