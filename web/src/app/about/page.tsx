import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Cpu,
  Layers,
  ArrowRight,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  RefreshCw,
  Search
} from "lucide-react";
import OptimusLogo from "@/components/OptimusLogo";

export const metadata = {
  title: "About Optimus Prime — Autonomous AI Intelligence & Ecosystem Index",
  description:
    "Learn about the architecture, indexing methodology, and autonomous verification pipeline behind Optimus Prime.",
};

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-24 space-y-16">
      {/* Hero Section */}
      <div className="space-y-6 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.08] text-xs font-mono text-[#9AA0A6]">
          <span className="w-2 h-2 rounded-full bg-[#6366F1]" />
          <span>ABOUT OPTIMUS PRIME</span>
        </div>
        <div className="flex justify-center my-2">
          <OptimusLogo size={56} showWordmark={false} />
        </div>
        <h1 className="font-heading text-4xl sm:text-5xl font-normal text-white tracking-tight leading-tight">
          The Global AI Models, Tools &amp; Daily Intelligence Index
        </h1>
        <p className="font-sans text-base sm:text-lg text-[#9AA0A6] leading-relaxed">
          Optimus Prime is an autonomous intelligence system built to cut through marketing noise and document the verified evolution of artificial intelligence across foundation models, agentic IDEs, and developer systems.
        </p>
      </div>

      {/* Core Principles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        <div className="p-8 rounded-[24px] bg-[#11131A] border border-white/[0.08] space-y-4">
          <div className="w-10 h-10 rounded-2xl bg-[#6366F1]/10 border border-[#6366F1]/20 flex items-center justify-center text-[#38BDF8]">
            <RefreshCw className="w-5 h-5" />
          </div>
          <h3 className="font-heading text-lg font-normal text-white">
            24/7 Autonomous Verification
          </h3>
          <p className="font-sans text-sm text-[#9AA0A6] leading-relaxed">
            Our background scraping engine monitors frontier research hubs, developer forums, and official lab announcements every 4 hours, validating novel capabilities before ingestion.
          </p>
        </div>

        <div className="p-8 rounded-[24px] bg-[#11131A] border border-white/[0.08] space-y-4">
          <div className="w-10 h-10 rounded-2xl bg-[#06B6D4]/10 border border-[#06B6D4]/20 flex items-center justify-center text-[#06B6D4]">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="font-heading text-lg font-normal text-white">
            Ecosystem Tree Mapping
          </h3>
          <p className="font-sans text-sm text-[#9AA0A6] leading-relaxed">
            We map tools into interconnected organizational trees—distinguishing between Google DeepMind, OpenAI, Anthropic, Meta, and the decentralized open-source movement.
          </p>
        </div>

        <div className="p-8 rounded-[24px] bg-[#11131A] border border-white/[0.08] space-y-4">
          <div className="w-10 h-10 rounded-2xl bg-[#A855F7]/10 border border-[#A855F7]/20 flex items-center justify-center text-[#A855F7]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-heading text-lg font-normal text-white">
            Zero Synthetic Slop
          </h3>
          <p className="font-sans text-sm text-[#9AA0A6] leading-relaxed">
            Every indexed system undergoes automated deduplication and schema normalization, rejecting low-effort wrapper clones in favor of genuine architectural contributions.
          </p>
        </div>
      </div>

      {/* Deep-Dive Narrative */}
      <div className="p-10 rounded-[28px] bg-[#11131A] border border-white/[0.08] space-y-8 leading-relaxed font-sans text-sm sm:text-base text-zinc-300">
        <div className="space-y-4">
          <h2 className="text-2xl font-heading font-normal text-white">
            Our Mission: A Clear Lens on Exponential Progress
          </h2>
          <p>
            The velocity of AI advancement creates severe signal-to-noise distortion. Thousands of generative wrappers and superficial directories obscure true foundation milestones. Optimus Prime exists to serve researchers, engineers, founders, and students who need a reliable, high-signal architectural directory and live news dispatch wire.
          </p>
        </div>

        <div className="border-t border-white/[0.08] pt-6 space-y-4">
          <h3 className="text-xl font-heading font-normal text-white">
            Multi-LLM Rate-Limit-Free Ingestion
          </h3>
          <p>
            To prevent operational bottlenecks and single-point-of-failure rate limits (HTTP 429), our standalone 24/7 background engine employs a resilient multi-key rotator. It seamlessly fails over between Google Gemini, Groq LPU accelerators, and OpenRouter reserves in under 50 milliseconds, ensuring uninterrupted synchronization with our Supabase database.
          </p>
        </div>

        <div className="border-t border-white/[0.08] pt-6 space-y-4">
          <h3 className="text-xl font-heading font-normal text-white">
            Explore the Platform
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <Link
              href="/models"
              className="p-5 rounded-2xl bg-black/40 border border-white/[0.06] hover:border-white/[0.15] hover:bg-black/60 transition group flex items-center justify-between"
            >
              <div>
                <h4 className="font-medium text-white group-hover:text-[#38BDF8] transition text-sm">
                  AI Models &amp; Directory →
                </h4>
                <p className="text-xs text-[#9AA0A6] mt-0.5">
                  Filter 100+ systems by category, pricing, and company
                </p>
              </div>
            </Link>

            <Link
              href="/ecosystems"
              className="p-5 rounded-2xl bg-black/40 border border-white/[0.06] hover:border-white/[0.15] hover:bg-black/60 transition group flex items-center justify-between"
            >
              <div>
                <h4 className="font-medium text-white group-hover:text-[#38BDF8] transition text-sm">
                  Company Ecosystems →
                </h4>
                <p className="text-xs text-[#9AA0A6] mt-0.5">
                  Explore parent technology labs and foundation trees
                </p>
              </div>
            </Link>

            <Link
              href="/news"
              className="p-5 rounded-2xl bg-black/40 border border-white/[0.06] hover:border-white/[0.15] hover:bg-black/60 transition group flex items-center justify-between"
            >
              <div>
                <h4 className="font-medium text-white group-hover:text-[#38BDF8] transition text-sm">
                  Daily AI News Wire →
                </h4>
                <p className="text-xs text-[#9AA0A6] mt-0.5">
                  Chronological research breakthroughs and dispatches
                </p>
              </div>
            </Link>

            <Link
              href="/"
              className="p-5 rounded-2xl bg-black/40 border border-white/[0.06] hover:border-white/[0.15] hover:bg-black/60 transition group flex items-center justify-between"
            >
              <div>
                <h4 className="font-medium text-white group-hover:text-[#38BDF8] transition text-sm">
                  Frontier Overview →
                </h4>
                <p className="text-xs text-[#9AA0A6] mt-0.5">
                  Live hero showcase, featured releases, and trending systems
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
