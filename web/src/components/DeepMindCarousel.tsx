"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, ArrowUpRight, Sparkles } from "lucide-react";
import { LiveNewsItem } from "@/lib/types";

interface DeepMindCarouselProps {
  articles: LiveNewsItem[];
}

export function DeepMindCarousel({ articles }: DeepMindCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  if (!articles || articles.length === 0) return null;

  const totalSlides = Math.min(articles.length, 4);
  const activeArticle = articles[currentSlide];

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-6">
      {/* Header Row: "Explore the latest" + Slide Counter + Controls */}
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-3xl sm:text-4xl font-normal text-white tracking-tight">
          Explore the latest
        </h2>

        <div className="flex items-center gap-4">
          <span className="font-sans text-xs sm:text-sm text-[#9AA0A6]">
            Slide {currentSlide + 1} of {totalSlides}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              aria-label="Previous slide"
              className="w-9 h-9 rounded-full bg-[#161922] hover:bg-[#1E222D] border border-white/10 flex items-center justify-center text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={handleNext}
              aria-label="Next slide"
              className="w-9 h-9 rounded-full bg-[#161922] hover:bg-[#1E222D] border border-white/10 flex items-center justify-center text-white transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Large Featured Showcase Card (DeepMind rounded-[28px]) */}
      <div className="relative rounded-[28px] bg-[#111318] border border-white/[0.08] overflow-hidden group transition-all duration-300">
        {/* Ambient Gradient Canvas Header */}
        <div className="relative h-48 sm:h-64 w-full bg-gradient-to-r from-[#171c2b] via-[#201c33] to-[#121622] overflow-hidden flex items-end p-8 border-b border-white/[0.06]">
          {/* Subtle Ambient Wave Effect */}
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_30%_30%,#4285F4_0%,transparent_50%),radial-gradient(circle_at_70%_70%,#9B72CB_0%,transparent_50%)] filter blur-3xl pointer-events-none" />

          <div className="relative z-10 flex items-center gap-2 text-xs font-sans text-[#8AB4F8]">
            <Sparkles className="w-4 h-4 text-[#8AB4F8]" />
            <span className="font-medium">Featured Breakthrough</span>
            <span className="text-zinc-600">•</span>
            <span className="text-[#9AA0A6]">{activeArticle.sourceDomain}</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-8 sm:p-10 space-y-4">
          <div className="flex items-center gap-2 text-xs font-sans text-[#9AA0A6]">
            <span>{activeArticle.category}</span>
            <span>•</span>
            <span>{activeArticle.publishedAt || activeArticle.relativeTime || "Recent"}</span>
          </div>

          <a
            href={activeArticle.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group/link block"
          >
            <h3 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-normal text-white group-hover/link:text-[#8AB4F8] transition-colors leading-[1.18] tracking-tight">
              {activeArticle.title}
            </h3>
          </a>

          <p className="font-sans text-sm sm:text-base text-[#9AA0A6] leading-relaxed max-w-4xl">
            {activeArticle.aiTakeaway || activeArticle.summary}
          </p>

          <div className="pt-4 flex items-center">
            <a
              href={activeArticle.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-sans text-[#8AB4F8] hover:text-[#A8C7FA] transition-colors"
            >
              <span>Read full story</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
