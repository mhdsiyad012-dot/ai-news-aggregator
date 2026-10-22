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
  ArrowRight
} from "lucide-react";
import { AI_DIRECTORY_DATA } from "@/data/aiDirectoryData";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const tool = AI_DIRECTORY_DATA.find(
    (t) => t.slug.toLowerCase() === slug.toLowerCase() || String(t.id).toLowerCase() === slug.toLowerCase()
  );

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
  const tool = AI_DIRECTORY_DATA.find(
    (t) => t.slug.toLowerCase() === slug.toLowerCase() || String(t.id).toLowerCase() === slug.toLowerCase()
  );

  if (!tool) {
    notFound();
  }

  const relatedTools = AI_DIRECTORY_DATA.filter((t) => {
    if (t.slug === tool.slug) return false;
    if (tool.relatedToolSlugs?.includes(t.slug)) return true;
    return t.company === tool.company || t.category === tool.category;
  }).slice(0, 3);

  return (
    <div className="space-y-12 animate-in fade-in duration-200">
      <div className="flex items-center justify-between font-mono text-xs text-[#71717A] border-b border-[#27272A] pb-4">
        <div className="flex items-center gap-2">
          <Link
            href="/directory"
            className="text-[#A1A1AA] hover:text-[#FAFAFA] transition-editorial flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Directory</span>
          </Link>
          <span>/</span>
          <span className="text-[#FAFAFA] font-medium">{tool.name}</span>
        </div>

        <div className="flex items-center gap-2 text-[#10B981]">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
          <span>VERIFIED NODE</span>
        </div>
      </div>

      <div className="p-8 sm:p-10 rounded-2xl bg-[#121215] border border-[#27272A] space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-4 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs">
              <span className="px-2.5 py-1 rounded-md bg-[#18181C] text-[#FAFAFA] border border-[#27272A] uppercase font-semibold">
                {tool.company}
              </span>
              <span className="px-2.5 py-1 rounded-md bg-[#09090B] text-[#F97316] border border-[#27272A]">
                {tool.category}
              </span>
              <span className="px-2.5 py-1 rounded-md bg-[#09090B] text-[#10B981] border border-[#27272A] font-semibold">
                {tool.pricing}
              </span>
            </div>

            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#FAFAFA] tracking-tight">
              {tool.name}
            </h1>

            <p className="font-sans text-base sm:text-lg text-[#A1A1AA] leading-relaxed">
              {tool.tagline}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <a
              href={tool.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#FAFAFA] hover:bg-white text-[#09090B] font-mono text-xs font-bold transition-editorial shadow-lg"
            >
              <span>Launch Official Site</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <Link
              href="/directory"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#18181C] hover:bg-[#27272A] text-[#FAFAFA] border border-[#27272A] font-mono text-xs font-medium transition-editorial"
            >
              <span>Explore More Tools</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="p-7 rounded-xl bg-[#121215] border border-[#27272A] space-y-4">
            <h2 className="font-heading font-bold text-xl text-[#FAFAFA] flex items-center gap-2">
              <Cpu className="w-5 h-5 text-[#F97316]" />
              <span>Architectural Breakdown &amp; Purpose</span>
            </h2>

            <p className="font-sans text-sm text-[#A1A1AA] leading-relaxed">
              {tool.description}
            </p>

            {tool.architectureDetails && (
              <div className="p-4 rounded-lg bg-[#09090B] border border-[#27272A] font-mono text-xs text-[#A1A1AA] space-y-1">
                <span className="text-[#F97316] font-semibold block uppercase text-[10px]">
                  Underlying Neural Architecture:
                </span>
                <span>{tool.architectureDetails}</span>
              </div>
            )}
          </div>

          <div className="p-7 rounded-xl bg-[#121215] border border-[#27272A] space-y-4">
            <h2 className="font-heading font-bold text-xl text-[#FAFAFA] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#10B981]" />
              <span>Core Capabilities &amp; Benchmark Features</span>
            </h2>

            <ul className="space-y-3 font-sans text-sm text-[#A1A1AA]">
              {(tool.keyFeatures || []).map((feat, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="mt-1 w-4 h-4 rounded-full bg-[#10B981]/10 text-[#10B981] flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span className="leading-snug text-[#FAFAFA]">{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-7 rounded-xl bg-[#121215] border border-[#27272A] space-y-3">
            <h2 className="font-heading font-bold text-lg text-[#FAFAFA] flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#F97316]" />
              <span>Target Persona &amp; Optimal Workflows</span>
            </h2>
            <p className="font-sans text-sm text-[#A1A1AA] leading-relaxed">
              {tool.bestFor}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 rounded-xl bg-[#121215] border border-[#27272A] space-y-4 font-mono text-xs">
            <h3 className="text-[#FAFAFA] font-semibold uppercase tracking-wider text-[11px] pb-2 border-b border-[#27272A]">
              System Metadata
            </h3>

            <div className="space-y-3 divide-y divide-[#27272A]/40">
              <div className="flex items-center justify-between pt-2">
                <span className="text-[#71717A]">Organization:</span>
                <span className="text-[#FAFAFA] font-medium">{tool.company}</span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-[#71717A]">Primary Category:</span>
                <span className="text-[#F97316] text-right font-medium">{tool.category}</span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-[#71717A]">Pricing Model:</span>
                <span className="text-[#10B981] font-semibold">{tool.pricing}</span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-[#71717A]">Official Domain:</span>
                {tool.officialUrl ? (
                  <a
                    href={tool.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#A1A1AA] hover:text-[#FAFAFA] transition-editorial inline-flex items-center gap-1"
                  >
                    <span>{new URL(tool.officialUrl).hostname}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-[#71717A]">N/A</span>
                )}
              </div>
            </div>
          </div>

          {tool.companyBackground && (
            <div className="p-6 rounded-xl bg-[#121215] border border-[#27272A] space-y-2">
              <h3 className="font-heading font-semibold text-sm text-[#FAFAFA] flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-[#A1A1AA]" />
                <span>About {tool.company}</span>
              </h3>
              <p className="font-sans text-xs text-[#A1A1AA] leading-relaxed">
                {tool.companyBackground}
              </p>
            </div>
          )}

          <div className="p-5 rounded-xl bg-[#09090B] border border-[#27272A] space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-[#10B981]">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified Entity Registry</span>
            </div>
            <p className="font-sans text-[11px] text-[#71717A] leading-relaxed">
              Every system in Optimus Prime is verified against official product releases, API docs, and primary research publications.
            </p>
          </div>
        </div>
      </div>

      {relatedTools.length > 0 && (
        <div className="space-y-6 pt-6 border-t border-[#27272A]">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-mono text-xs text-[#F97316] uppercase tracking-wider block">
                Ecosystem Links
              </span>
              <h2 className="font-heading font-bold text-2xl text-[#FAFAFA] mt-1">
                Related Systems from {tool.company} &amp; {tool.category}
              </h2>
            </div>

            <Link
              href="/directory"
              className="font-mono text-xs text-[#A1A1AA] hover:text-[#FAFAFA] transition-editorial flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {relatedTools.map((rel) => (
              <div
                key={rel.slug}
                className="p-6 rounded-xl bg-[#121215] border border-[#27272A] hover:border-[#3F3F46] hover:bg-[#18181C] transition-editorial space-y-3 group"
              >
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="px-2 py-0.5 rounded bg-[#18181C] text-[#FAFAFA] border border-[#27272A] text-[10px] uppercase font-semibold">
                    {rel.company}
                  </span>
                  <span className="text-[10px] text-[#10B981] font-semibold">
                    {rel.pricing}
                  </span>
                </div>

                <Link
                  href={`/directory/${rel.slug}`}
                  className="font-heading font-bold text-lg text-[#FAFAFA] group-hover:text-white transition-editorial block"
                >
                  {rel.name}
                </Link>

                <p className="font-sans text-xs text-[#A1A1AA] leading-relaxed line-clamp-2">
                  {rel.tagline}
                </p>

                <div className="pt-3 border-t border-[#27272A]/70 flex items-center justify-between font-mono text-xs">
                  <Link
                    href={`/directory/${rel.slug}`}
                    className="inline-flex items-center gap-1 text-[#FAFAFA] hover:text-[#10B981] font-semibold transition-editorial"
                  >
                    <span>Inspect Specs</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <a
                    href={rel.officialUrl}
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
        </div>
      )}
    </div>
  );
}
