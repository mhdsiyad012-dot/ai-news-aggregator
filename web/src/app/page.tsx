import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  ExternalLink,
  Newspaper,
  Database,
  Cpu,
  Clock,
  Sparkles,
  ArrowUpRight
} from "lucide-react";
import { getAllDirectoryItems } from "@/lib/directoryService";
import { getAllNewsArticles } from "@/lib/newsStoreService";
import { getSiteSettings } from "@/lib/settingsService";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [allTools, allArticles, settings] = await Promise.all([
    getAllDirectoryItems(),
    getAllNewsArticles(),
    getSiteSettings(),
  ]);

  const top4Articles = allArticles.slice(0, 4);
  const featuredTools = allTools.filter((t) => t.isFeatured).slice(0, 6);

  const ecosystems = [
    { name: "Google", count: allTools.filter((t) => t.company === "Google").length || 7, color: "text-[#4285F4]" },
    { name: "OpenAI", count: allTools.filter((t) => t.company === "OpenAI").length || 5, color: "text-[#10A37F]" },
    { name: "Anthropic", count: allTools.filter((t) => t.company === "Anthropic").length || 2, color: "text-[#D97706]" },
    { name: "Meta", count: allTools.filter((t) => t.company === "Meta").length || 3, color: "text-[#0668E1]" },
    { name: "xAI", count: allTools.filter((t) => t.company === "xAI").length || 2, color: "text-white" },
    { name: "Microsoft & GitHub", count: allTools.filter((t) => t.company === "Microsoft & GitHub").length || 2, color: "text-[#00A4EF]" },
    { name: "Vercel", count: allTools.filter((t) => t.company === "Vercel").length || 2, color: "text-white" },
    { name: "Creative & Editing Specialists", count: allTools.filter((t) => t.company === "Creative & Editing Specialists").length || 8, color: "text-[#F97316]" },
    { name: "Developer & Search Leaders", count: allTools.filter((t) => t.company === "Developer & Search Leaders").length || 7, color: "text-[#10B981]" },
  ];

  return (
    <div className="space-y-20 animate-in fade-in duration-200">
      {/* Editorial Hero Header */}
      <section className="relative pt-8 sm:pt-14 pb-12 border-b border-white/10 space-y-8">
        {/* Announcement Banner Pill */}
        {settings.announcementActive && settings.announcementText && (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md font-mono text-xs text-[#A1A1AA]">
            <span className="w-2 h-2 rounded-full bg-[#38BDF8] animate-pulse" />
            <span className="text-[#FAFAFA] font-medium">{settings.announcementText}</span>
          </div>
        )}

        <div className="max-w-4xl space-y-5">
          <div className="inline-flex items-center gap-2 font-mono text-xs text-[#38BDF8]">
            <span>OPTIMUS PRIME</span>
            <span className="text-[#52525B]">•</span>
            <span className="text-[#10B981] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
              {allTools.length} VERIFIED SYSTEMS ONLINE
            </span>
          </div>

          <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] gemini-gradient-text">
            {settings.siteHeadline || "Live AI Intelligence & Ecosystem Index."}
          </h1>

          <p className="font-sans text-base sm:text-lg text-[#A1A1AA] max-w-2xl leading-relaxed">
            {settings.siteTagline ||
              "The premier verified intelligence wire. Ingesting breaking model breakthroughs, autonomous coding agents, and 45+ indexed AI platforms with zero synthetic filler."}
          </p>
        </div>

        {/* Global CTA Actions */}
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <Link
            href="/directory"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#FAFAFA] text-[#050507] font-mono text-xs font-bold hover:bg-white transition-editorial shadow-lg"
          >
            <Database className="w-4 h-4 text-[#050507]" />
            <span>Explore {allTools.length} AI Systems</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <Link
            href="/news"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 text-[#FAFAFA] font-mono text-xs font-medium transition-editorial"
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
            <Cpu className="w-3.5 h-3.5 text-[#38BDF8]" />
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
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0D0D12] border border-white/10 hover:border-white/20 transition-editorial shrink-0 font-mono text-xs hover:bg-[#14141B]"
            >
              <span className={`font-semibold ${eco.color}`}>{eco.name}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/5 text-[#71717A]">
                {eco.count}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Top 4 Breaking AI Stories Today Grid */}
      <section className="space-y-6">
        <div className="flex items-end justify-between border-b border-white/10 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-xs text-[#F97316]">
              <Newspaper className="w-3.5 h-3.5" />
              <span>DISPATCH WIRE</span>
              <span className="text-[#52525B]">•</span>
              <span className="text-[#10B981]">REAL-TIME FEED</span>
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#FAFAFA] mt-1">
              Top Breaking AI Stories Today
            </h2>
          </div>

          <Link
            href="/news"
            className="inline-flex items-center gap-1 font-mono text-xs text-[#A1A1AA] hover:text-[#FAFAFA] transition-editorial pb-1"
          >
            <span>Full Wire</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#F97316]" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {top4Articles.map((article) => (
            <div
              key={article.id}
              className="flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-[#0D0D12] border border-white/10 hover:border-white/20 hover:bg-[#14141B] transition-editorial space-y-4 group shadow-md"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span className="px-2 py-0.5 rounded-md bg-white/5 text-[#FAFAFA] border border-white/10">
                    {article.category}
                  </span>
                  <div className="flex items-center gap-1.5 text-[#71717A]">
                    <Clock className="w-3 h-3" />
                    <span>{article.relativeTime || article.publishedAt}</span>
                  </div>
                </div>

                <h3 className="font-heading font-bold text-lg text-[#FAFAFA] group-hover:text-white transition-editorial leading-snug">
                  {article.title}
                </h3>

                <p className="font-sans text-xs text-[#A1A1AA] leading-relaxed line-clamp-2">
                  {article.summary}
                </p>

                {article.aiTakeaway && (
                  <div className="p-3.5 rounded-xl bg-[#050507] border border-white/10 font-mono text-[11px] text-[#A1A1AA] space-y-1">
                    <span className="text-[#F97316] font-semibold block uppercase text-[10px]">
                      Gemini Technical Takeaway:
                    </span>
                    <p className="font-sans text-xs text-[#FAFAFA] leading-relaxed line-clamp-3">
                      {article.aiTakeaway}
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between font-mono text-xs">
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
        <div className="flex items-end justify-between border-b border-white/10 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-xs text-[#38BDF8]">
              <Database className="w-3.5 h-3.5" />
              <span>INDEXED ARCHITECTURES</span>
              <span className="text-[#52525B]">•</span>
              <span className="text-[#FAFAFA]">VERIFIED SYSTEMS</span>
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#FAFAFA] mt-1">
              Featured Frontier Systems &amp; Agents
            </h2>
          </div>

          <Link
            href="/directory"
            className="inline-flex items-center gap-1 font-mono text-xs text-[#A1A1AA] hover:text-[#FAFAFA] transition-editorial pb-1"
          >
            <span>Browse All {allTools.length} Nodes</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#38BDF8]" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {featuredTools.map((tool) => (
            <div
              key={tool.slug}
              className="flex flex-col justify-between p-6 rounded-2xl bg-[#0D0D12] border border-white/10 hover:border-white/20 hover:bg-[#14141B] transition-editorial space-y-4 group shadow-md"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="px-2 py-0.5 rounded-md bg-white/5 text-[#FAFAFA] border border-white/10 text-[10px] uppercase font-semibold">
                    {tool.company}
                  </span>
                  <span className="text-[10px] text-[#10B981] font-semibold">
                    {tool.pricing}
                  </span>
                </div>

                <div>
                  <Link
                    href={`/directory?tool=${tool.slug}`}
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

                <div className="pt-2 border-t border-white/5 space-y-1">
                  <span className="font-mono text-[10px] uppercase text-[#71717A] tracking-wider block">
                    Core Capabilities:
                  </span>
                  <ul className="space-y-1 font-sans text-xs text-[#A1A1AA]">
                    {(tool.keyFeatures || []).slice(0, 2).map((kf, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-[#38BDF8] font-mono">•</span>
                        <span className="line-clamp-1">{kf}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between font-mono text-xs">
                <Link
                  href={`/directory?tool=${tool.slug}`}
                  className="inline-flex items-center gap-1 text-[#FAFAFA] hover:text-[#38BDF8] font-semibold transition-editorial"
                >
                  <span>Inspect Specs</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <a
                  href={tool.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[#71717A] hover:text-white transition-editorial text-[11px]"
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
