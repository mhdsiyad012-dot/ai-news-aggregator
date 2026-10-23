"use client";

import React, { useState } from "react";

interface ToolIconProps {
  name: string;
  company?: string;
  officialUrl?: string;
  category?: string;
  size?: number;
  className?: string;
}

// Authentic SVG brand mappings from @lobehub/icons-static-svg
const BRAND_ICON_MAP: Record<string, { slug: string; invertInDark?: boolean }> = {
  // Google / DeepMind
  "gemini": { slug: "gemini-color.svg" },
  "deepmind": { slug: "gemini-color.svg" },
  "google": { slug: "google-color.svg" },
  "nano banana": { slug: "gemini-color.svg" },
  "genie": { slug: "gemini-color.svg" },
  "antigravity": { slug: "gemini-color.svg" },
  "stitch": { slug: "google-color.svg" },

  // OpenAI
  "openai": { slug: "openai.svg", invertInDark: true },
  "chatgpt": { slug: "openai.svg", invertInDark: true },
  "gpt": { slug: "openai.svg", invertInDark: true },
  "dall-e": { slug: "openai.svg", invertInDark: true },
  "sora": { slug: "openai.svg", invertInDark: true },
  "o3": { slug: "openai.svg", invertInDark: true },
  "o4": { slug: "openai.svg", invertInDark: true },

  // Anthropic
  "anthropic": { slug: "claude-color.svg" },
  "claude": { slug: "claude-color.svg" },

  // DeepSeek
  "deepseek": { slug: "deepseek-color.svg" },

  // xAI
  "xai": { slug: "grok.svg", invertInDark: true },
  "grok": { slug: "grok.svg", invertInDark: true },

  // Meta
  "meta": { slug: "meta-color.svg" },
  "llama": { slug: "meta-color.svg" },

  // Mistral
  "mistral": { slug: "mistral-color.svg" },
  "codestral": { slug: "mistral-color.svg" },
  "le chat": { slug: "mistral-color.svg" },

  // Perplexity
  "perplexity": { slug: "perplexity-color.svg" },

  // Cursor / Anysphere
  "cursor": { slug: "cursor.svg", invertInDark: true },
  "anysphere": { slug: "cursor.svg", invertInDark: true },

  // Microsoft / GitHub
  "microsoft": { slug: "microsoft-color.svg" },
  "copilot": { slug: "microsoft-color.svg" },
  "github": { slug: "github.svg", invertInDark: true },

  // Hugging Face
  "huggingface": { slug: "huggingface-color.svg" },
  "hugging face": { slug: "huggingface-color.svg" },

  // Midjourney
  "midjourney": { slug: "midjourney.svg", invertInDark: true },

  // Qwen / Alibaba
  "qwen": { slug: "qwen-color.svg" },
  "alibaba": { slug: "qwen-color.svg" },

  // Moonshot / Kimi
  "kimi": { slug: "kimi-color.svg" },
  "moonshot": { slug: "kimi-color.svg" },

  // MiniMax
  "minimax": { slug: "minimax-color.svg" },

  // Zhipu / GLM
  "zhipu": { slug: "zhipu-color.svg" },
  "glm": { slug: "zhipu-color.svg" },

  // Vercel / v0
  "vercel": { slug: "vercel.svg", invertInDark: true },
  "v0": { slug: "vercel.svg", invertInDark: true },

  // Apple
  "apple": { slug: "apple.svg", invertInDark: true },
};

function getBrandMatch(name: string, company: string): { slug: string; invertInDark?: boolean } | null {
  const n = name.toLowerCase().trim();
  const c = company.toLowerCase().trim();

  // Match specific tokens
  for (const [key, val] of Object.entries(BRAND_ICON_MAP)) {
    if (n.includes(key) || c.includes(key)) {
      return val;
    }
  }
  return null;
}

function extractDomain(url?: string): string {
  if (!url) return "";
  try {
    const cleanUrl = url.startsWith("http") ? url : `https://${url}`;
    const parsed = new URL(cleanUrl);
    return parsed.hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

// Deterministic monogram gradient colors with Google Neural styling
const GRADIENTS = [
  "from-blue-500 to-indigo-600",
  "from-violet-500 to-purple-600",
  "from-amber-500 to-rose-500",
  "from-emerald-500 to-teal-600",
  "from-cyan-500 to-blue-600",
  "from-rose-500 to-orange-500",
];

function getHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export default function ToolIcon({
  name,
  company = "AI",
  officialUrl,
  category,
  size = 40,
  className = "",
}: ToolIconProps) {
  const [brandSvgFailed, setBrandSvgFailed] = useState(false);
  const [faviconFailed, setFaviconFailed] = useState(false);

  const brand = getBrandMatch(name, company);
  const domain = extractDomain(officialUrl);

  const containerStyle = {
    width: size,
    height: size,
    minWidth: size,
    minHeight: size,
  };

  // 1. Official Vector Brand Icon from @lobehub CDN
  if (brand && !brandSvgFailed) {
    const iconUrl = `https://unpkg.com/@lobehub/icons-static-svg@latest/icons/${brand.slug}`;
    const invertClass = brand.invertInDark ? "dark:invert" : "";

    return (
      <div
        className={`shrink-0 flex items-center justify-center rounded-2xl bg-[#F0F4F9] dark:bg-[#1A1D24] border border-black/[0.06] dark:border-white/[0.08] p-2 transition-transform duration-200 group-hover:scale-105 shadow-sm ${className}`}
        style={containerStyle}
      >
        <img
          src={iconUrl}
          alt={`${company} ${name} logo`}
          width={Math.round(size * 0.65)}
          height={Math.round(size * 0.65)}
          className={`object-contain max-w-full max-h-full ${invertClass}`}
          onError={() => setBrandSvgFailed(true)}
          loading="lazy"
        />
      </div>
    );
  }

  // 2. High-Resolution 128px Favicon via Google S2
  if (domain && !faviconFailed) {
    const faviconUrl = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`;
    return (
      <div
        className={`shrink-0 flex items-center justify-center rounded-2xl bg-[#F0F4F9] dark:bg-[#1A1D24] border border-black/[0.06] dark:border-white/[0.08] p-2 transition-transform duration-200 group-hover:scale-105 shadow-sm ${className}`}
        style={containerStyle}
      >
        <img
          src={faviconUrl}
          alt={`${name} favicon`}
          width={Math.round(size * 0.65)}
          height={Math.round(size * 0.65)}
          className="object-contain max-w-full max-h-full rounded-md"
          onError={() => setFaviconFailed(true)}
          loading="lazy"
        />
      </div>
    );
  }

  // 3. Fallback: Clean Neural Monogram Badge
  const words = name.trim().split(/\s+/);
  const monogram =
    words.length > 1
      ? (words[0][0] + words[1][0]).toUpperCase()
      : name.slice(0, 2).toUpperCase();

  const gradientIdx = getHash(name + company) % GRADIENTS.length;
  const gradient = GRADIENTS[gradientIdx];

  return (
    <div
      className={`shrink-0 flex items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} p-0.5 shadow-sm transition-transform duration-200 group-hover:scale-105 ${className}`}
      style={containerStyle}
    >
      <div className="w-full h-full rounded-[14px] bg-white dark:bg-[#131314] flex items-center justify-center">
        <span
          className="font-bold tracking-tight text-[#1F1F1F] dark:text-white select-none"
          style={{ fontSize: Math.max(11, Math.round(size * 0.36)) }}
        >
          {monogram}
        </span>
      </div>
    </div>
  );
}
