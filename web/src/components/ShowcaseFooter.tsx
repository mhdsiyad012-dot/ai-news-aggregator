import React from "react";
import Link from "next/link";
import OptimusLogo from "@/components/OptimusLogo";
import { ArrowUpRight } from "lucide-react";

export function ShowcaseFooter() {
  return (
    <footer className="w-full border-t border-white/[0.08] bg-[#090A0F] mt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 lg:gap-14 pb-16 border-b border-white/[0.08]">
          {/* Brand Column */}
          <div className="md:col-span-1 space-y-4">
            <OptimusLogo size={28} showWordmark={true} />
            <p className="text-sm text-[#9AA0A6] leading-relaxed font-sans">
              The verified global index of artificial intelligence foundation models, agentic IDEs, and daily research dispatches.
            </p>
          </div>

          {/* Column 1: Models & Directory */}
          <div className="space-y-4 text-sm font-sans">
            <span className="text-white font-medium block">
              Models &amp; Directory
            </span>
            <ul className="space-y-3 text-[#9AA0A6]">
              <li>
                <Link href="/models" className="hover:text-white transition-colors">
                  All AI Models &amp; Tools
                </Link>
              </li>
              <li>
                <Link href="/models?category=Coding%20%26%20Autonomous%20Agents" className="hover:text-white transition-colors">
                  Coding &amp; Autonomous Agents
                </Link>
              </li>
              <li>
                <Link href="/models?category=Conversational%20%26%20Reasoning%20LLMs" className="hover:text-white transition-colors">
                  Conversational &amp; Reasoning LLMs
                </Link>
              </li>
              <li>
                <Link href="/models?category=Video%20%26%20Image%20Editing%20AI" className="hover:text-white transition-colors">
                  Generative Video &amp; Image AI
                </Link>
              </li>
              <li>
                <Link href="/models?category=UI%2FUX%20%26%20Product%20Design%20AI" className="hover:text-white transition-colors">
                  UI/UX &amp; Product Design AI
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Ecosystem Hubs */}
          <div className="space-y-4 text-sm font-sans">
            <span className="text-white font-medium block">
              Company Ecosystems
            </span>
            <ul className="space-y-3 text-[#9AA0A6]">
              <li>
                <Link href="/ecosystems" className="hover:text-white transition-colors">
                  Google DeepMind Hub
                </Link>
              </li>
              <li>
                <Link href="/ecosystems" className="hover:text-white transition-colors">
                  OpenAI Frontier Hub
                </Link>
              </li>
              <li>
                <Link href="/ecosystems" className="hover:text-white transition-colors">
                  Anthropic Constitutional AI
                </Link>
              </li>
              <li>
                <Link href="/ecosystems" className="hover:text-white transition-colors">
                  Meta Open Weights
                </Link>
              </li>
              <li>
                <Link href="/ecosystems" className="hover:text-white transition-colors">
                  Microsoft &amp; GitHub
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Platform */}
          <div className="space-y-4 text-sm font-sans">
            <span className="text-white font-medium block">
              Platform &amp; Intelligence
            </span>
            <ul className="space-y-3 text-[#9AA0A6]">
              <li>
                <Link href="/news" className="hover:text-white transition-colors">
                  Daily AI News Wire
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Optimus Prime
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/mhdsiyad012-dot/ai-news-aggregator"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1"
                >
                  <span>GitHub Repository</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans text-[#9AA0A6]">
          <div>
            © {new Date().getFullYear()} Optimus Prime. Autonomous real-time intelligence index.
          </div>
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/models" className="hover:text-white transition-colors">
              Models
            </Link>
            <Link href="/ecosystems" className="hover:text-white transition-colors">
              Ecosystems
            </Link>
            <Link href="/news" className="hover:text-white transition-colors">
              Daily Wire
            </Link>
            <Link href="/about" className="hover:text-white transition-colors">
              About
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
