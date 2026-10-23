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
  ArrowUpRight,
  ChevronRight,
  Scale
} from "lucide-react";
import ToolIcon from "@/components/ToolIcon";
import { getDirectoryItemBySlug, getAllDirectoryItems } from "@/lib/directoryService";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";
export const revalidate = 60;

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const tool = await getDirectoryItemBySlug(slug);

  if (!tool) {
    return {
      title: "AI System Not Found — Optimus Prime",
    };
  }

  return {
    title: `${tool.name} Specifications & Architecture — Optimus Prime`,
    description: tool.tagline || tool.description,
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
  
  // Find other tools by the same company or related tools
  const sameCompanyTools = allTools
    .filter((t) => {
      const itemSlug = t.slug || String(t.id || "");
      if (itemSlug === currentSlug) return false;
      if (relSlugs.includes(itemSlug)) return true;
      return t.company === tool.company;
    })
    .slice(0, 3);

  const fallbackRelatedTools = sameCompanyTools.length > 0 ? sameCompanyTools : allTools
    .filter((t) => {
      const itemSlug = t.slug || String(t.id || "");
      return itemSlug !== currentSlug && t.category === tool.category;
    })
    .slice(0, 3);

  const keyFeatures = Array.isArray(tool.keyFeatures) ? tool.keyFeatures : [];

  return (
    <div className="min-h-screen bg-[#FFFFFF] dark:bg-[#060608] text-[#1F1F1F] dark:text-[#E3E3E3] pt-28 pb-24 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-sans text-[#5F6368] dark:text-[#8E9196] border-b border-black/[0.06] dark:border-white/[0.08] pb-4">
          <Link href="/" className="hover:text-[#1F1F1F] dark:hover:text-white transition">
            Home
          </Link>
          <span>/</span>
          <Link href="/models" className="hover:text-[#1F1F1F] dark:hover:text-white transition">
            Models
          </Link>
          <span>/</span>
          <Link
            href="/ecosystems"
            className="hover:text-[#1F1F1F] dark:hover:text-white transition"
          >
            {tool.company}
          </Link>
          <span>/</span>
          <span className="text-[#1F1F1F] dark:text-white font-medium">{tool.name}</span>
        </div>

        {/* Main Hero Header */}
        <div className="p-8 sm:p-12 rounded-3xl bg-[#F8FAFD] dark:bg-[#111318] border border-black/[0.08] dark:border-white/[0.1] shadow-sm relative overflow-hidden space-y-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="space-y-4 max-w-3xl">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 text-xs font-sans">
                <Link
                  href={`/models?company=${encodeURIComponent(tool.company || "")}`}
                  className="px-3.5 py-1.5 rounded-full bg-[#F0F4F9] dark:bg-white/[0.06] text-[#4285F4] dark:text-[#8AB4F8] border border-black/[0.06] dark:border-white/[0.08] font-medium"
                >
                  {tool.company || "Independent"} Ecosystem
                </Link>
                <span className="px-3.5 py-1.5 rounded-full bg-[#9B72CB]/10 text-[#9B72CB] border border-[#9B72CB]/20 font-medium">
                  {tool.category}
                </span>
                <span className="px-3.5 py-1.5 rounded-full bg-black/[0.04] dark:bg-white/[0.04] text-[#5F6368] dark:text-zinc-400 border border-black/[0.06] dark:border-white/[0.06]">
                  {tool.pricing || "Freemium"}
                </span>
              </div>

              <div className="flex items-center gap-4 pt-1">
                <ToolIcon
                  name={tool.name}
                  company={tool.company}
                  officialUrl={tool.officialUrl}
                  category={tool.category}
                  size={56}
                />
                <div>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-normal text-[#1F1F1F] dark:text-white tracking-tight">
                    {tool.name}
                  </h1>
                </div>
              </div>

              <p className="text-base sm:text-lg text-[#5F6368] dark:text-[#8E9196] leading-relaxed font-sans">
                {tool.tagline}
              </p>
            </div>

            {/* Action CTAs */}
            <div className="shrink-0 pt-2 flex flex-col sm:flex-row md:flex-col gap-2.5">
              {tool.officialUrl && (
                <a
                  href={tool.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 rounded-full bg-[#1F1F1F] dark:bg-white text-white dark:text-[#1F1F1F] font-medium text-xs sm:text-sm hover:bg-[#333] dark:hover:bg-zinc-200 transition-all inline-flex items-center justify-center gap-2 shadow-md"
                >
                  <span>Visit Official Website</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
              <Link
                href={`/compare?tools=${encodeURIComponent(tool.slug || tool.id)},gemini-4-argon,cursor`}
                className="px-5 py-3 rounded-full bg-white dark:bg-white/[0.06] hover:bg-black/[0.04] dark:hover:bg-white/[0.12] text-xs font-medium text-[#1F1F1F] dark:text-white transition-all inline-flex items-center justify-center gap-2 border border-black/[0.08] dark:border-white/[0.08] shadow-sm"
              >
                <Scale className="w-3.5 h-3.5 text-[#4285F4]" />
                <span>Compare Model</span>
              </Link>
            </div>
          </div>

          {/* Quick Highlights Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-black/[0.06] dark:border-white/[0.08] pt-6 text-xs font-sans">
            <div>
              <span className="text-[#5F6368] dark:text-[#8E9196] font-medium uppercase block text-[11px] mb-1">
                Parent Lab
              </span>
              <p className="text-[#1F1F1F] dark:text-white font-medium text-sm">{tool.company}</p>
            </div>
            <div>
              <span className="text-[#5F6368] dark:text-[#8E9196] font-medium uppercase block text-[11px] mb-1">
                Primary Role
              </span>
              <p className="text-[#1F1F1F] dark:text-white font-medium text-sm">{tool.category}</p>
            </div>
            <div>
              <span className="text-[#5F6368] dark:text-[#8E9196] font-medium uppercase block text-[11px] mb-1">
                Pricing Model
              </span>
              <p className="text-[#1F1F1F] dark:text-white font-medium text-sm">{tool.pricing || "Freemium"}</p>
            </div>
            <div>
              <span className="text-[#5F6368] dark:text-[#8E9196] font-medium uppercase block text-[11px] mb-1">
                Best Suited For
              </span>
              <p className="text-[#1F1F1F] dark:text-white font-medium text-sm">{tool.bestFor || "Enterprise & Developers"}</p>
            </div>
          </div>
        </div>

        {/* Deep-Dive Specifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left 2 Cols: Description & Capabilities */}
          <div className="md:col-span-2 space-y-8">
            {/* Architectural Overview */}
            <div className="p-8 rounded-3xl bg-[#F8FAFD] dark:bg-[#111318] border border-black/[0.08] dark:border-white/[0.08] space-y-4 shadow-sm">
              <h3 className="text-lg font-heading font-normal text-[#1F1F1F] dark:text-white">
                Architecture &amp; System Overview
              </h3>
              <p className="text-sm sm:text-base text-[#5F6368] dark:text-zinc-300 leading-relaxed font-sans">
                {tool.description || "Detailed system architectural analysis recorded by Optimus Prime."}
              </p>
              {tool.architectureDetails && (
                <div className="p-4 rounded-2xl bg-white dark:bg-black/40 border border-black/[0.06] dark:border-white/[0.05] mt-4 shadow-sm">
                  <span className="text-xs font-medium uppercase tracking-wider text-[#4285F4] dark:text-[#8AB4F8] block mb-1">
                    Engine &amp; Inference Pipeline
                  </span>
                  <p className="text-xs text-[#5F6368] dark:text-zinc-300 font-sans leading-relaxed">
                    {tool.architectureDetails}
                  </p>
                </div>
              )}
            </div>

            {/* Verified Capabilities */}
            {keyFeatures.length > 0 && (
              <div className="p-8 rounded-3xl bg-[#F8FAFD] dark:bg-[#111318] border border-black/[0.08] dark:border-white/[0.08] space-y-4 shadow-sm">
                <h3 className="text-lg font-heading font-normal text-[#1F1F1F] dark:text-white">
                  Verified Capabilities &amp; Features
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {keyFeatures.map((feat, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-white dark:bg-black/40 border border-black/[0.06] dark:border-white/[0.05] text-xs text-[#1F1F1F] dark:text-zinc-300 font-sans shadow-sm"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#4285F4] dark:text-[#8AB4F8] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right 1 Col: Company Context & Meta */}
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-[#F8FAFD] dark:bg-[#111318] border border-black/[0.08] dark:border-white/[0.08] space-y-4 shadow-sm">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#4285F4]" />
                <h4 className="text-sm font-medium text-[#1F1F1F] dark:text-white">About {tool.company}</h4>
              </div>
              <p className="text-xs text-[#5F6368] dark:text-[#8E9196] leading-relaxed font-sans">
                {tool.companyBackground ||
                  `${tool.company} develops and releases foundation artificial intelligence systems, multimodal reasoning models, and developer infrastructure.`}
              </p>
              <Link
                href="/ecosystems"
                className="text-xs text-[#4285F4] dark:text-[#8AB4F8] hover:underline inline-flex items-center gap-1 font-medium pt-1"
              >
                <span>Explore {tool.company} tree</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Related Tools by Company */}
        {fallbackRelatedTools.length > 0 && (
          <div className="space-y-6 border-t border-black/[0.06] dark:border-white/[0.08] pt-12">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-heading font-normal text-[#1F1F1F] dark:text-white">
                Other AI Systems by {tool.company}
              </h3>
              <Link
                href={`/models?company=${encodeURIComponent(tool.company || "")}`}
                className="text-xs text-[#4285F4] dark:text-[#8AB4F8] hover:underline inline-flex items-center gap-1 font-medium"
              >
                <span>View all in directory</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {fallbackRelatedTools.map((rel) => {
                const relSlug = rel.slug || String(rel.id || "");
                return (
                  <div
                    key={rel.id || rel.slug}
                    className="p-6 rounded-3xl bg-[#F8FAFD] dark:bg-[#111318] border border-black/[0.08] dark:border-white/[0.08] hover:border-[#4285F4]/30 dark:hover:border-white/[0.2] transition flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-[#5F6368] dark:text-[#8E9196]">
                        <span className="font-medium">{rel.company}</span>
                        <span>{rel.pricing || "Freemium"}</span>
                      </div>
                      <Link
                        href={`/tool/${relSlug}`}
                        className="text-lg font-heading font-normal text-[#1F1F1F] dark:text-white hover:text-[#4285F4] dark:hover:text-[#8AB4F8] transition block"
                      >
                        {rel.name}
                      </Link>
                      <p className="text-xs text-[#5F6368] dark:text-[#8E9196] line-clamp-2 leading-relaxed">
                        {rel.tagline || rel.description}
                      </p>
                    </div>

                    <Link
                      href={`/tool/${relSlug}`}
                      className="text-xs text-[#4285F4] dark:text-[#8AB4F8] hover:underline inline-flex items-center gap-1 font-medium pt-2 border-t border-black/[0.06] dark:border-white/[0.05]"
                    >
                      <span>Read specifications</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
