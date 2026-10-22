import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  ExternalLink,
  Newspaper,
  Database,
  Cpu,
  Clock
} from "lucide-react";
import { AI_DIRECTORY_DATA, FEATURED_AI_TOOLS } from "@/data/aiDirectoryData";
import { fetchLiveAiNews } from "@/services/newsService";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const articles = await fetchLiveAiNews();
  const top4Articles = articles.slice(0, 4);

  const ecosystems = [
    { name: "Google", count: 7, color: "text-[#4285F4]", border: "hover:border-[#4285F4]" },
    { name: "OpenAI", count: 5, color: "text-[#10A37F]", border: "hover:border-[#10A37F]" },
    { name: "Anthropic", count: 2, color: "text-[#D97706]", border: "hover:border-[#D97706]" },
    { name: "Meta", count: 3, color: "text-[#0668E1]", border: "hover:border-[#0668E1]" },
    { name: "xAI", count: 2, color: "text-white", border: "hover:border-white" },
    { name: "Microsoft & GitHub", count: 2, color: "text-[#00A4EF]", border: "hover:border-[#00A4EF]" },
    { name: "Vercel", count: 2, color: "text-white", border: "hover:border-white" },
    { name: "Creative & Editing Specialists", count: 8, color: "text-[#F97316]", border: "hover:border-[#F97316]" },
    { name: "Developer & Search Leaders", count: 7, color: "text-[#10B981]", border: "hover:border-[#10B981]" },
  ];

  return (
    <div className="space-y-16 animate-in fade-in duration-200">
      {/* Editorial Hero Header */}
      <section className="relative pt-6 pb-12 border-b border-[#27272A] space-y-6">
        <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#121215] border border-[#27272A] text-[#10B981]">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span className="font-semibold">CORE ACTIVE</span>
            <span className="text-[#3F3F46]">•</span>
            <span className="text-[#A1A1AA]">{AI_DIRECTORY_DATA.length} VERIFIED SYSTEMS</span>
          </div>

          <span className="text-[#71717A] hidden sm:inline">•</span>

          <span className="font-mono text-[11px] text-[#A1A1AA]">
            INGESTING LIVE DISPATCHES & ECOSYSTEM REGISTRY
          </span>
        </div>

        <div className="max-w-4xl space-y-4">
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#FAFAFA] leading-[1.08]">
            Live AI Intelligence & <br />
            <span className="text-[#A1A1AA]">Ecosystem Index.</span>
          </h1>

          <p className="font-sans text-base sm:text-lg text-[#A1A1AA] max-w-2xl leading-relaxed">
            Optimus Prime is the verified agency-grade intelligence wire. Ingesting breaking model breakthroughs, autonomous coding agents, and 45+ indexed AI platforms with zero synthetic filler.
          </p>
        </div>

        {/* Global Action & Search Bar */}
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <Link
            href="/directory"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[#FAFAFA] text-[#09090B] font-mono text-xs font-bold hover:bg-white transition-editorial"
          >
            <Database className="w-4 h-4 text-[#09090B]" />
            <span>Explore 45 AI Systems</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <Link
            href="/news"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[#121215] border border-[#27272A] hover:border-[#3F3F46] text-[#FAFAFA] font-mono text-xs font-medium transition-editorial"
          >
            <Newspaper className="w-4 h-4 text-[#F97316]" />
            <span>Daily AI News Wire</span>
          </Link>
        </div>
      </section>

      {/* Featured AI Ecosystems Quick-Filter Bar */}
      <section className="space-y-4">
        <div className="flex items-center justify-between font-mono text-xs">
          <div className="flex items-center gap-2 text-[#71717A] uppercase tracking-wider text-[11px]">
            <Cpu className="w-3.5 h-3.5 text-[#F97316]" />
            <span>Featured AI Ecosystems</span>
          </div>
          <Link
            href="/directory"
            className="text-[#A1A1AA] hover:text-[#FAFAFA] transition-editorial flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
          {ecosystems.map((eco) => (
            <Link
              key={eco.name}
              href={`/directory?company=${encodeURIComponent(eco.name)}`}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#121215] border border-[#27272A] ${eco.border} transition-editorial shrink-0 font-mono text-xs`}
            >
              <span className={`font-semibold ${eco.color}`}>{eco.name}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#18181C] text-[#71717A]">
                {eco.count}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Top 4 Breaking AI Stories Today Grid */}
      <section className="space-y-6">
        <div className="flex items-end justify-between border-b border-[#27272A] pb-4">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-xs text-[#F97316]">
              <Newspaper className="w-3.5 h-3.5" />
              <span>SECTION 1</span>
              <span className="text-[#3F3F46]">•</span>
              <span className="text-[#10B981]">REAL-TIME WIRE</span>
            </div>
            <h2 className="font-heading text-2xl font-bold text-[#FAFAFA] mt-1">
              Top Breaking AI Stories Today
            </h2>
          </div>

          <Link
            href="/news"
            className="inline-flex items-center gap-1 font-mono text-xs text-[#A1A1AA] hover:text-[#FAFAFA] transition-editorial pb-1"
          >
            <span>Full News Wire</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#F97316]" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {top4Articles.map((article) => (
            <div
              key={article.id}
              className="flex flex-col justify-between p-6 rounded-xl bg-[#121215] border border-[#27272A] hover:border-[#3F3F46] hover:bg-[#18181C] transition-editorial space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span className="px-2 py-0.5 rounded bg-[#09090B] text-[#FAFAFA] border border-[#27272A]">
                    {article.category}
                  </span>
                  <div className="flex items-center gap-1.5 text-[#71717A]">
                    <Clock className="w-3 h-3" />
                    <span>{article.relativeTime}</span>
                  </div>
                </div>

                <h3 className="font-heading font-bold text-lg text-[#FAFAFA] group-hover:text-white transition-editorial leading-snug">
                  {article.title}
                </h3>

                <p className="font-sans text-xs text-[#A1A1AA] leading-relaxed line-clamp-2">
                  {article.summary}
                </p>

                {article.aiTakeaway && (
                  <div className="p-3 rounded-lg bg-[#09090B] border border-[#27272A]/70 font-mono text-[11px] text-[#A1A1AA]">
                    <span className="text-[#F97316] font-semibold block mb-0.5">
                      Technical Takeaway:
                    </span>
                    <span>{article.aiTakeaway}</span>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-[#27272A]/70 flex items-center justify-between font-mono text-xs">
                <span className="text-[#71717A] text-[11px]">
                  Source: {article.sourceDomain}
                </span>

                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[#FAFAFA] hover:text-[#10B981] font-medium transition-editorial"
                >
                  <span>Read Article</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Flagship AI Systems Grid */}
      <section className="space-y-6">
        <div className="flex items-end justify-between border-b border-[#27272A] pb-4">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-xs text-[#10B981]">
              <Database className="w-3.5 h-3.5" />
              <span>SECTION 2</span>
              <span className="text-[#3F3F46]">•</span>
              <span className="text-[#FAFAFA]">INDEXED SPECIFICATIONS</span>
            </div>
            <h2 className="font-heading text-2xl font-bold text-[#FAFAFA] mt-1">
              Featured Frontier Systems & Agents
            </h2>
          </div>

          <Link
            href="/directory"
            className="inline-flex items-center gap-1 font-mono text-xs text-[#A1A1AA] hover:text-[#FAFAFA] transition-editorial pb-1"
          >
            <span>Browse All 45 Systems</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#10B981]" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {FEATURED_AI_TOOLS.slice(0, 6).map((tool) => (
            <div
              key={tool.slug}
              className="flex flex-col justify-between p-6 rounded-xl bg-[#121215] border border-[#27272A] hover:border-[#3F3F46] hover:bg-[#18181C] transition-editorial space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="px-2 py-0.5 rounded bg-[#18181C] text-[#FAFAFA] border border-[#27272A] text-[10px] uppercase font-semibold">
                    {tool.company}
                  </span>
                  <span className="text-[10px] text-[#10B981] font-semibold">
                    {tool.pricing}
                  </span>
                </div>

                <div>
                  <Link
                    href={`/directory/${tool.slug}`}
                    className="font-heading font-bold text-lg text-[#FAFAFA] group-hover:text-white transition-editorial block"
                  >
                    {tool.name}
                  </Link>
                  <span className="font-mono text-[11px] text-[#71717A] block mt-0.5">
                    {tool.category}
                  </span>
                </div>

                <p className="font-sans text-xs text-[#A1A1AA] leading-relaxed line-clamp-3">
                  {tool.tagline}
                </p>

                <div className="pt-2 border-t border-[#27272A]/50 space-y-1">
                  <span className="font-mono text-[10px] uppercase text-[#71717A] tracking-wider block">
                    Core Capabilities:
                  </span>
                  <ul className="space-y-1 font-sans text-xs text-[#A1A1AA]">
                    {(tool.keyFeatures || []).slice(0, 2).map((kf, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-[#F97316] font-mono">•</span>
                        <span className="line-clamp-1">{kf}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-[#27272A]/70 flex items-center justify-between font-mono text-xs">
                <Link
                  href={`/directory/${tool.slug}`}
                  className="inline-flex items-center gap-1 text-[#FAFAFA] hover:text-[#10B981] font-semibold transition-editorial"
                >
                  <span>Inspect Specs</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <a
                  href={tool.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[#A1A1AA] hover:text-white transition-editorial text-[11px]"
                >
                  <span>Official Site</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
