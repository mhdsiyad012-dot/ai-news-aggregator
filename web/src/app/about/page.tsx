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
    <div className="min-h-screen bg-[#FFFFFF] dark:bg-[#060608] text-[#1F1F1F] dark:text-[#E3E3E3] pt-28 pb-24 transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Hero Section */}
        <div className="space-y-6 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F0F4F9] dark:bg-white/[0.05] border border-black/[0.06] dark:border-white/[0.08] text-xs font-medium text-[#5F6368] dark:text-[#8E9196] shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#4285F4]" />
            <span>ABOUT OPTIMUS PRIME</span>
          </div>
          <div className="flex justify-center my-2">
            <OptimusLogo size={56} showWordmark={false} />
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl font-normal text-[#1F1F1F] dark:text-white tracking-tight leading-tight">
            The Global AI Models, Tools &amp; Daily Intelligence Index
          </h1>
          <p className="font-sans text-base sm:text-lg text-[#5F6368] dark:text-[#8E9196] leading-relaxed">
            Optimus Prime is an autonomous intelligence system built to cut through marketing noise and document the verified evolution of artificial intelligence across foundation models, agentic IDEs, and developer systems.
          </p>
        </div>

        {/* Core Principles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div className="p-8 rounded-3xl bg-[#F8FAFD] dark:bg-[#111318] border border-black/[0.08] dark:border-white/[0.08] space-y-4 shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-[#4285F4]/10 border border-[#4285F4]/20 flex items-center justify-center text-[#4285F4]">
              <RefreshCw className="w-5 h-5" />
            </div>
            <h3 className="font-heading text-lg font-normal text-[#1F1F1F] dark:text-white">
              24/7 Autonomous Verification
            </h3>
            <p className="font-sans text-sm text-[#5F6368] dark:text-[#8E9196] leading-relaxed">
              Our background scraping engine monitors frontier research hubs, developer forums, and official lab announcements every 4 hours, validating novel capabilities before ingestion.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-[#F8FAFD] dark:bg-[#111318] border border-black/[0.08] dark:border-white/[0.08] space-y-4 shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-[#9B72CB]/10 border border-[#9B72CB]/20 flex items-center justify-center text-[#9B72CB]">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-heading text-lg font-normal text-[#1F1F1F] dark:text-white">
              Ecosystem Tree Mapping
            </h3>
            <p className="font-sans text-sm text-[#5F6368] dark:text-[#8E9196] leading-relaxed">
              We map tools into interconnected organizational trees—distinguishing between Google DeepMind, OpenAI, Anthropic, Meta, and the decentralized open-source movement.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-[#F8FAFD] dark:bg-[#111318] border border-black/[0.08] dark:border-white/[0.08] space-y-4 shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-[#D96570]/10 border border-[#D96570]/20 flex items-center justify-center text-[#D96570]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-heading text-lg font-normal text-[#1F1F1F] dark:text-white">
              Zero Synthetic Boilerplate
            </h3>
            <p className="font-sans text-sm text-[#5F6368] dark:text-[#8E9196] leading-relaxed">
              Every indexed system undergoes automated deduplication and schema normalization, rejecting low-effort wrapper clones in favor of genuine architectural contributions.
            </p>
          </div>
        </div>

        {/* Deep-Dive Narrative */}
        <div className="p-10 rounded-3xl bg-[#F8FAFD] dark:bg-[#111318] border border-black/[0.08] dark:border-white/[0.08] space-y-8 leading-relaxed font-sans text-sm sm:text-base text-[#5F6368] dark:text-zinc-300 shadow-sm">
          <div className="space-y-4">
            <h2 className="text-2xl font-heading font-normal text-[#1F1F1F] dark:text-white">
              Our Mission: A Clear Lens on Exponential Progress
            </h2>
            <p>
              The velocity of AI advancement creates severe signal-to-noise distortion. Thousands of generative wrappers and superficial directories obscure true foundation milestones. Optimus Prime exists to serve researchers, engineers, founders, and students who need a reliable, high-signal architectural directory and live news dispatch wire.
            </p>
          </div>

          <div className="border-t border-black/[0.06] dark:border-white/[0.08] pt-6 space-y-4">
            <h3 className="text-xl font-heading font-normal text-[#1F1F1F] dark:text-white">
              Multi-LLM Rate-Limit-Free Ingestion
            </h3>
            <p>
              To prevent operational bottlenecks and single-point-of-failure rate limits (HTTP 429), our standalone 24/7 background engine employs a resilient multi-key rotator. It seamlessly fails over between Google Gemini, Groq LPU accelerators, and OpenRouter reserves in under 50 milliseconds, ensuring uninterrupted synchronization with our Supabase database.
            </p>
          </div>

          <div className="border-t border-black/[0.06] dark:border-white/[0.08] pt-6 space-y-4">
            <h3 className="text-xl font-heading font-normal text-[#1F1F1F] dark:text-white">
              Explore the Platform
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <Link
                href="/models"
                className="p-5 rounded-2xl bg-white dark:bg-black/40 border border-black/[0.06] dark:border-white/[0.06] hover:border-[#4285F4]/30 transition group flex items-center justify-between shadow-sm"
              >
                <div>
                  <h4 className="font-medium text-[#1F1F1F] dark:text-white group-hover:text-[#4285F4] transition text-sm">
                    AI Models &amp; Directory →
                  </h4>
                  <p className="text-xs text-[#5F6368] dark:text-[#8E9196] mt-0.5">
                    Filter 100+ systems by category, pricing, and company
                  </p>
                </div>
              </Link>

              <Link
                href="/ecosystems"
                className="p-5 rounded-2xl bg-white dark:bg-black/40 border border-black/[0.06] dark:border-white/[0.06] hover:border-[#4285F4]/30 transition group flex items-center justify-between shadow-sm"
              >
                <div>
                  <h4 className="font-medium text-[#1F1F1F] dark:text-white group-hover:text-[#4285F4] transition text-sm">
                    Company Ecosystems →
                  </h4>
                  <p className="text-xs text-[#5F6368] dark:text-[#8E9196] mt-0.5">
                    Explore parent technology labs and foundation trees
                  </p>
                </div>
              </Link>

              <Link
                href="/news"
                className="p-5 rounded-2xl bg-white dark:bg-black/40 border border-black/[0.06] dark:border-white/[0.06] hover:border-[#4285F4]/30 transition group flex items-center justify-between shadow-sm"
              >
                <div>
                  <h4 className="font-medium text-[#1F1F1F] dark:text-white group-hover:text-[#4285F4] transition text-sm">
                    Daily AI News Wire →
                  </h4>
                  <p className="text-xs text-[#5F6368] dark:text-[#8E9196] mt-0.5">
                    Chronological research breakthroughs and dispatches
                  </p>
                </div>
              </Link>

              <Link
                href="/"
                className="p-5 rounded-2xl bg-white dark:bg-black/40 border border-black/[0.06] dark:border-white/[0.06] hover:border-[#4285F4]/30 transition group flex items-center justify-between shadow-sm"
              >
                <div>
                  <h4 className="font-medium text-[#1F1F1F] dark:text-white group-hover:text-[#4285F4] transition text-sm">
                    Frontier Overview →
                  </h4>
                  <p className="text-xs text-[#5F6368] dark:text-[#8E9196] mt-0.5">
                    Live hero showcase, featured releases, and trending systems
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
