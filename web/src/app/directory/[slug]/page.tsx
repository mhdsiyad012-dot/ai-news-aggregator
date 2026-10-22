import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ExternalLink,
  ShieldCheck,
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
  const relatedTools = allTools
    .filter((t) => {
      if (t.slug === tool.slug) return false;
      if (tool.relatedToolSlugs?.includes(t.slug)) return true;
      return t.company === tool.company || t.category === tool.category;
    })
    .slice(0, 3);

  return (
    <div className="space-y-12 animate-in fade-in duration-300">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center justify-between font-mono text-xs text-zinc-500 border-b border-white/[0.08] pb-4">
        <div className="flex items-center gap-2">
          <Link
            href="/directory"
            className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Directory</span>
          </Link>
          <span className="text-zinc-600">/</span>
          <span className="text-zinc-300 font-medium">{tool.name}</span>
        </div>

        <div className="flex items-center gap-2 text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>VERIFIED NODE</span>
        </div>
      </div>

      {/* Hero Header Card */}
      <div className="p-8 sm:p-10 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-4 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs">
              <span className="px-3 py-1 rounded-md bg-white/[0.05] text-white border border-white/[0.08] uppercase font-semibold">
                {tool.company}
              </span>
              <span className="px-3 py-1 rounded-md bg-white/[0.03] text-orange-400 border border-white/[0.08]">
                {tool.category}
              </span>
              <span className="px-3 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                {tool.pricing}
              </span>
            </div>

            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              {tool.name}
            </h1>

            <p className="font-sans text-base sm:text-lg text-zinc-400 leading-relaxed">
              {tool.tagline}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <a
              href={tool.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-zinc-100 text-zinc-950 font-mono text-xs font-bold transition-all shadow-lg"
            >
              <span>Launch Official Site</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>

            <Link
              href="/directory"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-zinc-300 border border-white/[0.08] font-mono text-xs font-medium transition-colors"
            >
              <span>Explore More Tools</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Spec Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Architecture Card */}
          <div className="p-7 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-4">
            <h2 className="font-heading font-bold text-xl text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-orange-400" />
              <span>Architectural Breakdown &amp; Purpose</span>
            </h2>

            <p className="font-sans text-sm text-zinc-400 leading-relaxed">
              {tool.description}
            </p>

            {tool.architectureDetails && (
              <div className="p-4 rounded-xl bg-black/40 border border-white/[0.06] font-mono text-xs text-zinc-300 space-y-1">
                <span className="text-orange-400 font-semibold block uppercase text-[10px]">
                  Underlying Neural Architecture:
                </span>
                <span>{tool.architectureDetails}</span>
              </div>
            )}
          </div>

          {/* Core Capabilities */}
          <div className="p-7 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-4">
            <h2 className="font-heading font-bold text-xl text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <span>Core Capabilities &amp; Benchmark Features</span>
            </h2>

            <ul className="space-y-3 font-sans text-sm text-zinc-400">
              {(tool.keyFeatures || []).map((feat, idx) => (
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
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-5">
            <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-orange-400" />
              <span>Quick Specifications</span>
            </h3>

            <div className="space-y-3 text-xs font-mono">
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
                <span className="text-emerald-400 font-semibold">{tool.pricing}</span>
              </div>

              {tool.bestFor && (
                <div className="py-2 border-b border-white/[0.06] space-y-1">
                  <span className="text-zinc-500 block">Best For</span>
                  <span className="text-zinc-300 font-sans text-xs block leading-relaxed">{tool.bestFor}</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <span className="text-zinc-500">Official Endpoint</span>
                {tool.officialUrl ? (
                  <a
                    href={tool.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1"
                  >
                    <span>{new URL(tool.officialUrl).hostname}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-zinc-600">N/A</span>
                )}
              </div>
            </div>
          </div>

          {tool.companyBackground && (
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-2">
              <h3 className="font-heading font-semibold text-sm text-white flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-zinc-400" />
                <span>About {tool.company}</span>
              </h3>
              <p className="font-sans text-xs text-zinc-400 leading-relaxed">
                {tool.companyBackground}
              </p>
            </div>
          )}

          <div className="p-5 rounded-2xl bg-black/40 border border-white/[0.06] space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified Entity Registry</span>
            </div>
            <p className="font-sans text-[11px] text-zinc-500 leading-relaxed">
              Every system in Optimus Prime is verified against official product releases, API docs, and primary research publications.
            </p>
          </div>
        </div>
      </div>

      {/* Related Systems */}
      {relatedTools.length > 0 && (
        <div className="space-y-6 pt-6 border-t border-white/[0.08]">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-mono text-xs text-orange-400 uppercase tracking-wider block">
                Ecosystem Links
              </span>
              <h2 className="font-heading font-bold text-2xl text-white mt-1">
                Related Systems from {tool.company} &amp; {tool.category}
              </h2>
            </div>

            <Link
              href="/directory"
              className="font-mono text-xs text-zinc-400 hover:text-white transition-colors flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {relatedTools.map((rel) => (
              <div
                key={rel.slug}
                className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-white/20 hover:bg-white/[0.04] transition-all space-y-3 group"
              >
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="px-2.5 py-0.5 rounded-md bg-white/[0.04] text-zinc-300 border border-white/[0.08] text-[10px] uppercase font-semibold">
                    {rel.company}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-semibold font-mono">
                    {rel.pricing}
                  </span>
                </div>

                <Link
                  href={`/directory/${rel.slug}`}
                  className="font-heading font-bold text-lg text-white group-hover:text-emerald-300 transition-colors block"
                >
                  {rel.name}
                </Link>

                <p className="font-sans text-xs text-zinc-400 leading-relaxed line-clamp-2">
                  {rel.tagline}
                </p>

                <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between font-mono text-xs">
                  <Link
                    href={`/directory/${rel.slug}`}
                    className="inline-flex items-center gap-1 text-white hover:text-emerald-400 font-semibold transition-colors"
                  >
                    <span>Inspect Specs</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <a
                    href={rel.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-zinc-500 hover:text-white transition-colors text-[11px]"
                  >
                    <span>Official Site</span>
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
