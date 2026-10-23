import React from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Compass,
  Layers,
  Cpu,
  ChevronRight
} from "lucide-react";
import { getAllDirectoryItems } from "@/lib/directoryService";
import { getAllNewsArticles } from "@/lib/newsStoreService";
import { getSiteSettings } from "@/lib/settingsService";
import DeepMindHero from "@/components/DeepMindHero";
import { DeepMindCarousel } from "@/components/DeepMindCarousel";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [allTools, allArticles, settings] = await Promise.all([
    getAllDirectoryItems(),
    getAllNewsArticles(),
    getSiteSettings(),
  ]);

  const carouselArticles = allArticles.slice(0, 4);
  const editorialArticles = allArticles.slice(4, 7).length > 0 ? allArticles.slice(4, 7) : allArticles.slice(1, 4);
  const featuredTools = allTools.filter((t) => t.isFeatured).slice(0, 6);

  const ecosystems = [
    { name: "Google", count: allTools.filter((t) => (t.company || "").toLowerCase().includes("google")).length || 7 },
    { name: "OpenAI", count: allTools.filter((t) => (t.company || "").toLowerCase().includes("openai")).length || 5 },
    { name: "Anthropic", count: allTools.filter((t) => (t.company || "").toLowerCase().includes("anthropic")).length || 2 },
    { name: "Meta", count: allTools.filter((t) => (t.company || "").toLowerCase().includes("meta")).length || 3 },
    { name: "xAI", count: allTools.filter((t) => (t.company || "").toLowerCase().includes("xai")).length || 2 },
    { name: "Microsoft & GitHub", count: allTools.filter((t) => (t.company || "").toLowerCase().includes("microsoft") || (t.company || "").toLowerCase().includes("github")).length || 2 },
    { name: "DeepSeek", count: allTools.filter((t) => (t.company || "").toLowerCase().includes("deepseek")).length || 2 },
    { name: "Mistral", count: allTools.filter((t) => (t.company || "").toLowerCase().includes("mistral")).length || 2 },
    { name: "Open Source & Independent", count: allTools.filter((t) => (t.company || "").toLowerCase().includes("open") || (t.company || "").toLowerCase().includes("creative")).length || 15 },
  ];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#6366F1]/30 selection:text-white">
      {/* Dynamic Hero Section with Super Admin Branding */}
      <DeepMindHero
        siteName={settings.siteName}
        headline={settings.siteHeadline}
        tagline={settings.siteTagline}
        badgeText={settings.heroBadgeText}
        themeAccent={settings.themeAccent}
      />

      <main className="max-w-[1320px] mx-auto px-6 lg:px-10 space-y-32 pb-32">
        {/* Section 1: "Explore the latest" News Carousel & 3-Column Stories */}
        <section id="hands-on" className="space-y-12">
          {/* Horizontal Media Carousel */}
          <DeepMindCarousel articles={carouselArticles} />

          {/* 3-Column Editorial Story Grid */}
          <div className="space-y-6 pt-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-2xl font-normal text-white tracking-tight">
                Frontier intelligence dispatches
              </h3>
              <Link
                href="/news"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-sans text-[#38BDF8] hover:text-[#818CF8] transition-colors"
              >
                <span>View all dispatches</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {editorialArticles.map((article) => (
                <article
                  key={article.id}
                  className="flex flex-col justify-between p-8 rounded-[24px] bg-[#11131A] border border-white/[0.08] hover:border-white/[0.18] hover:bg-[#161923] transition-all duration-300 group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-xs font-mono text-[#9AA0A6]">
                      <span>{article.sourceDomain}</span>
                      <span>•</span>
                      <span>{article.relativeTime || article.publishedAt || "Recent"}</span>
                    </div>

                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block group/title"
                    >
                      <h4 className="font-heading text-xl font-normal text-white group-hover/title:text-[#38BDF8] transition-colors leading-[1.25]">
                        {article.title}
                      </h4>
                    </a>

                    <p className="font-sans text-xs sm:text-sm text-[#9AA0A6] leading-relaxed line-clamp-3">
                      {article.aiTakeaway || article.summary}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-white/[0.06] flex items-center justify-between">
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-sans text-[#38BDF8] hover:text-[#818CF8] transition-colors"
                    >
                      <span>Read full story</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>

                    <span className="text-[11px] font-mono text-zinc-500">
                      {article.category}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Section 2: Ecosystems Filter Row */}
        <section id="ecosystems" className="space-y-6 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-heading text-3xl sm:text-4xl font-normal text-white tracking-tight">
                Filter by AI company &amp; ecosystem
              </h2>
              <p className="font-sans text-sm sm:text-base text-[#9AA0A6] mt-2">
                Explore models and tools grouped by creator lab and verified research infrastructure.
              </p>
            </div>

            <Link
              href="/ecosystems"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs sm:text-sm font-sans text-[#38BDF8] hover:text-[#818CF8] transition-colors"
            >
              <span>Explore all ecosystems</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Clean Horizontal Capsule Pill Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none pt-2">
            {ecosystems.map((eco) => (
              <Link
                key={eco.name}
                href={`/models?company=${encodeURIComponent(eco.name)}`}
                className="px-5 py-2.5 rounded-full bg-[#11131A] hover:bg-[#161923] border border-white/[0.08] hover:border-white/20 text-xs sm:text-sm font-sans text-[#9AA0A6] hover:text-white transition-all whitespace-nowrap shrink-0 flex items-center gap-2.5"
              >
                <span>{eco.name}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.06] text-zinc-400 font-mono">
                  {eco.count}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Section 3: Featured AI Models & Directory */}
        <section id="featured" className="space-y-10 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-heading text-3xl sm:text-4xl font-normal text-white tracking-tight">
                Explore our next generation AI systems
              </h2>
              <p className="font-sans text-sm sm:text-base text-[#9AA0A6] max-w-2xl mt-2">
                Verified foundation models, agentic IDEs, and generative creative studios indexed with technical benchmarks.
              </p>
            </div>

            <Link
              href="/models"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs sm:text-sm font-sans text-[#38BDF8] hover:text-[#818CF8] transition-colors"
            >
              <span>Explore all {allTools.length} models</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Ultra-Clean Model Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTools.map((tool) => {
              const toolSlug = tool.slug || String(tool.id || "");
              return (
                <div
                  key={tool.id || tool.slug}
                  className="flex flex-col justify-between p-7 rounded-[24px] bg-[#11131A] border border-white/[0.08] hover:border-white/[0.18] hover:bg-[#161923] transition-all duration-300 group shadow-lg"
                >
                  <div className="space-y-3.5">
                    {/* Top row: Company pill + pricing tag */}
                    <div className="flex items-center justify-between text-xs font-sans">
                      <span className="px-3 py-1 rounded-full bg-white/[0.05] text-[#9AA0A6] border border-white/[0.08] text-[11px] font-mono">
                        {tool.company}
                      </span>
                      <span className="text-zinc-500 text-xs font-mono">
                        {tool.pricing || "Freemium"}
                      </span>
                    </div>

                    {/* Title */}
                    <Link
                      href={`/tool/${toolSlug}`}
                      className="font-heading text-xl font-normal text-white group-hover:text-[#38BDF8] transition-colors block"
                    >
                      {tool.name}
                    </Link>

                    {/* Concise 1-line description */}
                    <p className="font-sans text-xs sm:text-sm text-[#9AA0A6] leading-relaxed line-clamp-2">
                      {tool.tagline || tool.description}
                    </p>
                  </div>

                  {/* Bottom row: Explore specs & Try now */}
                  <div className="pt-5 mt-6 border-t border-white/[0.06] flex items-center justify-between text-xs font-sans">
                    <Link
                      href={`/tool/${toolSlug}`}
                      className="inline-flex items-center gap-1.5 text-[#38BDF8] hover:text-[#818CF8] transition-colors font-medium"
                    >
                      <span>Explore specs</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    {tool.officialUrl && (
                      <a
                        href={tool.officialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-zinc-400 hover:text-white transition-colors"
                      >
                        <span>Visit</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center pt-4">
            <Link
              href="/models"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-black font-medium text-xs sm:text-sm hover:bg-zinc-200 transition-all shadow-md"
            >
              <span>Explore all {allTools.length} AI systems</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
