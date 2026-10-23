import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ExternalLink,
  Cpu,
  Layers,
  Sparkles,
  Building2,
  CheckCircle2,
  ArrowRight,
  ArrowUpRight
} from "lucide-react";
import { getDirectoryItemBySlug, getAllDirectoryItems } from "@/lib/directoryService";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const tool = await getDirectoryItemBySlug(slug);

  if (!tool) {
    return {
      title: "AI System Not Found — Optimus Prime",
    };
  }

  return {
    title: `${tool.name} Specifications — Optimus Prime Directory`,
    description: tool.tagline,
  };
}

export default async function ToolDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const tool = await getDirectoryItemBySlug(slug);

  if (!tool) {
    notFound();
  }

  const allTools = await getAllDirectoryItems();
  const currentSlug = tool.slug || String(tool.id || "");
  const relSlugs = Array.isArray(tool.relatedToolSlugs) ? tool.relatedToolSlugs : [];
  const relatedTools = allTools
    .filter((t) => {
      const itemSlug = t.slug || String(t.id || "");
      if (itemSlug === currentSlug) return false;
      if (relSlugs.includes(itemSlug)) return true;
      return t.company === tool.company || t.category === tool.category;
    })
    .slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 space-y-12">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center justify-between text-xs font-sans text-[#9AA0A6] border-b border-white/[0.08] pb-4">
        <div className="flex items-center gap-2">
          <Link
            href="/directory"
            className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Directory</span>
          </Link>
          <span className="text-zinc-600">/</span>
          <span className="text-white font-medium">{tool.name}</span>
        </div>

        <div className="flex items-center gap-2 text-[#8AB4F8]">
          <span className="w-2 h-2 rounded-full bg-[#8AB4F8]" />
          <span>Verified AI System</span>
        </div>
      </div>

      {/* Hero Header Card (DeepMind rounded-[28px]) */}
      <div className="p-8 sm:p-12 rounded-[28px] bg-[#111318] border border-white/[0.08] space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-4 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 text-xs font-sans">
              <span className="px-3.5 py-1 rounded-full bg-white/[0.05] text-white border border-white/[0.08]">
                {tool.company}
              </span>
              <span className="px-3.5 py-1 rounded-full bg-white/[0.03] text-[#8AB4F8]">
                {tool.category}
              </span>
              <span className="px-3.5 py-1 rounded-full bg-white/[0.03] text-zinc-400">
                {tool.pricing}
              </span>
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-normal text-white tracking-tight leading-[1.12]">
              {tool.name}
            </h1>

            <p className="font-sans text-base sm:text-xl text-[#9AA0A6] leading-relaxed">
              {tool.tagline}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <a
              href={tool.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white hover:bg-zinc-100 text-black text-xs sm:text-sm font-medium transition-all shadow-md"
            >
              <span>Launch official site</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>

            <Link
              href="/directory"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#161922] hover:bg-[#1E222D] text-zinc-300 border border-white/[0.08] text-xs sm:text-sm font-sans transition-colors"
            >
              <span>Explore more models</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Spec Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Architecture Card */}
          <div className="p-8 rounded-[24px] bg-[#111318] border border-white/[0.08] space-y-4">
            <h2 className="font-heading font-normal text-2xl text-white flex items-center gap-2.5">
              <Cpu className="w-5 h-5 text-[#8AB4F8]" />
              <span>Architectural breakdown &amp; purpose</span>
            </h2>

            <p className="font-sans text-sm sm:text-base text-[#9AA0A6] leading-relaxed">
              {tool.description}
            </p>

            {tool.architectureDetails && (
              <div className="p-5 rounded-[18px] bg-[#161922] border border-white/[0.06] text-xs sm:text-sm text-zinc-300 space-y-1">
                <span className="text-[#8AB4F8] font-medium block text-xs">
                  Underlying neural specifications:
                </span>
                <span>{tool.architectureDetails}</span>
              </div>
            )}
          </div>

          {/* Core Capabilities */}
          <div className="p-8 rounded-[24px] bg-[#111318] border border-white/[0.08] space-y-4">
            <h2 className="font-heading font-normal text-2xl text-white flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <span>Core capabilities &amp; benchmarks</span>
            </h2>

            <ul className="space-y-3 font-sans text-sm text-[#9AA0A6]">
              {(Array.isArray(tool.keyFeatures) ? tool.keyFeatures : []).map((feat, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="mt-1 w-4 h-4 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span className="leading-snug text-zinc-300">{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Sidebar Specifications */}
        <div className="space-y-6">
          <div className="p-7 rounded-[24px] bg-[#111318] border border-white/[0.08] space-y-5">
            <h3 className="font-heading font-normal text-lg text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#8AB4F8]" />
              <span>Quick specifications</span>
            </h3>

            <div className="space-y-3 text-xs sm:text-sm font-sans">
              <div className="flex items-center justify-between py-2 border-b border-white/[0.06]">
                <span className="text-zinc-500">Creator / Lab</span>
                <span className="text-white font-medium">{tool.company}</span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-white/[0.06]">
                <span className="text-zinc-500">Primary Domain</span>
                <span className="text-white font-medium">{tool.category}</span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-white/[0.06]">
                <span className="text-zinc-500">Pricing Model</span>
                <span className="text-[#8AB4F8] font-medium">{tool.pricing}</span>
              </div>

              {tool.bestFor && (
                <div className="py-2 border-b border-white/[0.06] space-y-1">
                  <span className="text-zinc-500 block text-xs">Best For</span>
                  <span className="text-zinc-300 font-sans text-xs block leading-relaxed">{tool.bestFor}</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <span className="text-zinc-500">Official Endpoint</span>
                {tool.officialUrl ? (() => {
                  let hostname = "";
                  let href = tool.officialUrl.trim();
                  const md = href.match(/\[.*?\]\((https?:\/\/[^\s)]+)\)/);
                  if (md) href = md[1];
                  href = href.replace(/^[<"']+|[>"']+$/g, "");
                  if (!href.startsWith("http")) href = `https://${href}`;

                  try {
                    hostname = new URL(href).hostname;
                  } catch {
                    hostname = "Visit site";
                  }

                  return (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#8AB4F8] hover:text-[#A8C7FA] transition-colors flex items-center gap-1"
                    >
                      <span>{hostname}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  );
                })() : (
                  <span className="text-zinc-600">N/A</span>
                )}
              </div>
            </div>
          </div>

          {tool.companyBackground && (
            <div className="p-7 rounded-[24px] bg-[#111318] border border-white/[0.08] space-y-2">
              <h3 className="font-heading font-normal text-base text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-zinc-400" />
                <span>About {tool.company}</span>
              </h3>
              <p className="font-sans text-xs sm:text-sm text-[#9AA0A6] leading-relaxed">
                {tool.companyBackground}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Related Systems */}
      {relatedTools.length > 0 && (
        <div className="space-y-6 pt-6 border-t border-white/[0.08]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-heading font-normal text-2xl sm:text-3xl text-white">
                Related systems from {tool.company} &amp; {tool.category}
              </h2>
            </div>

            <Link
              href="/directory"
              className="text-xs sm:text-sm font-sans text-[#8AB4F8] hover:text-[#A8C7FA] transition-colors flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedTools.map((rel) => (
              <div
                key={rel.slug}
                className="p-7 rounded-[24px] bg-[#111318] border border-white/[0.08] hover:border-white/[0.18] hover:bg-[#171A21] transition-all space-y-3 group"
              >
                <div className="flex items-center justify-between text-xs font-sans">
                  <span className="px-3 py-0.5 rounded-full bg-white/[0.04] text-zinc-300 text-[11px]">
                    {rel.company}
                  </span>
                  <span className="text-zinc-500">
                    {rel.pricing}
                  </span>
                </div>

                <Link
                  href={`/directory/${rel.slug}`}
                  className="font-heading font-normal text-xl text-white group-hover:text-[#8AB4F8] transition-colors block"
                >
                  {rel.name}
                </Link>

                <p className="font-sans text-xs sm:text-sm text-[#9AA0A6] leading-relaxed line-clamp-2">
                  {rel.tagline}
                </p>

                <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-sans">
                  <Link
                    href={`/directory/${rel.slug}`}
                    className="inline-flex items-center gap-1 text-[#8AB4F8] hover:text-[#A8C7FA] font-medium transition-colors"
                  >
                    <span>Explore specs</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <a
                    href={rel.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-zinc-500 hover:text-white transition-colors"
                  >
                    <span>Try now</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
