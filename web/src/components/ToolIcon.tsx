"use client";

import React, { useState } from "react";
import Image from "next/image";

interface ToolIconProps {
  name: string;
  company?: string;
  officialUrl?: string;
  category?: string;
  size?: number;
  className?: string;
}

// Crisp SVGs for premier ecosystems
const ECOSYSTEM_BRAND_SVGS: Record<string, (size: number) => React.ReactNode> = {
  google: (size) => (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z"
      />
    </svg>
  ),
  openai: (size) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className="text-emerald-400">
      <path d="M22.28 9.37a5.99 5.99 0 0 0-.52-4.94 6.07 6.07 0 0 0-6.52-2.73A6.07 6.07 0 0 0 10.7.2 6.08 6.08 0 0 0 5 3.52a6.04 6.04 0 0 0-4.08 2.9 6.07 6.07 0 0 0 .73 7.02 5.99 5.99 0 0 0 .52 4.94 6.07 6.07 0 0 0 6.52 2.73 6.07 6.07 0 0 0 4.54 1.5 6.08 6.08 0 0 0 5.7-3.32 6.04 6.04 0 0 0 4.08-2.9 6.07 6.07 0 0 0-.73-7.02ZM12 21.84c-1.4 0-2.74-.43-3.87-1.2l.19-.11 4.5-2.6a1 1 0 0 0 .5-.86v-6.35l1.9 1.1a.95.95 0 0 1 .5.83v5.27a4.95 4.95 0 0 1-3.72 3.92Zm-8.4-4.85a4.94 4.94 0 0 1-.64-3.95 4.93 4.93 0 0 1 2.37-3.13l.19.11 4.5 2.6a1 1 0 0 0 1 0l5.5-3.17v2.2a.96.96 0 0 1-.36.75l-4.56 2.63a4.97 4.97 0 0 1-7.06-2.04Zm-1.84-9.6a4.95 4.95 0 0 1 3.08-2.75 4.94 4.94 0 0 1 3.9.46l-.19.11-4.5 2.6a1 1 0 0 0-.5.87v6.34l-1.9-1.1a.95.95 0 0 1-.5-.83V8.89a4.98 4.98 0 0 1 .61-1.5Zm16.73 3.65-5.5 3.18v-2.2a.96.96 0 0 1 .36-.75l4.56-2.63a4.97 4.97 0 0 1 6.42 1.58 4.94 4.94 0 0 1 .64 3.95 4.93 4.93 0 0 1-2.37 3.13l-.19-.11-4.5-2.6a1 1 0 0 0-.92-.55Zm2.75-3.36a4.95 4.95 0 0 1-3.08 2.75 4.94 4.94 0 0 1-3.9-.46l.19-.11 4.5-2.6a1 1 0 0 0 .5-.87V4.05l1.9 1.1a.95.95 0 0 1 .5.83v5.28c0 .26-.04.53-.11.78ZM8.84 9.17l1.9-1.1a.96.96 0 0 1 .9-.05l4.57 2.64a4.97 4.97 0 0 1 2.14 4.09 4.94 4.94 0 0 1-1.5 3.73 4.94 4.94 0 0 1-3.73 1.5c-1.4 0-2.73-.43-3.86-1.2l-.19-.11v-5.2a1 1 0 0 0-.5-.86L6.67 11.5l1.9-1.1.27-1.23Z" />
    </svg>
  ),
  anthropic: (size) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className="text-amber-400">
      <path d="M13.827 2.5h3.754L24 21.5h-4.045l-1.89-5.182H9.954L8.064 21.5H4L10.19 2.5h3.637Zm2.774 10.636-2.71-7.445-2.71 7.445h5.42Z" />
    </svg>
  ),
  meta: (size) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className="text-blue-500">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm4.88 13.92c-1.39 0-2.58-.87-3.32-2.12-.51-.86-.97-1.9-1.56-3.08-.59 1.18-1.05 2.22-1.56 3.08-.74 1.25-1.93 2.12-3.32 2.12-2.14 0-3.88-1.74-3.88-3.88s1.74-3.88 3.88-3.88c1.39 0 2.58.87 3.32 2.12.51.86.97 1.9 1.56 3.08.59-1.18 1.05-2.22 1.56-3.08.74-1.25 1.93-2.12 3.32-2.12 2.14 0 3.88 1.74 3.88 3.88s-1.74 3.88-3.88 3.88Z" />
    </svg>
  ),
  xai: (size) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className="text-white">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  deepseek: (size) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="#0066FF" strokeWidth="2.5" />
      <path d="M7 12a5 5 0 0 1 10 0c0 2.5-2 4.5-5 4.5S7 14.5 7 12Z" fill="#0066FF" />
      <circle cx="12" cy="12" r="2" fill="#fff" />
    </svg>
  ),
  mistral: (size) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className="text-amber-500">
      <path d="M4 4h4v4H4V4Zm6 0h4v4h-4V4Zm6 0h4v4h-4V4ZM4 10h4v4H4v-4Zm12 0h4v4h-4v-4ZM4 16h4v4H4v-4Zm6 0h4v4h-4v-4Zm6 0h4v4h-4v-4Z" />
    </svg>
  ),
  vercel: (size) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className="text-white">
      <path d="M12 1L24 22H0L12 1Z" />
    </svg>
  ),
  github: (size) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className="text-white">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z" />
    </svg>
  ),
};

// Deterministic monogram gradient colors
const GRADIENTS = [
  "from-indigo-500 to-cyan-400",
  "from-purple-500 to-pink-500",
  "from-blue-600 to-indigo-500",
  "from-emerald-500 to-teal-400",
  "from-amber-500 to-orange-500",
  "from-rose-500 to-red-400",
  "from-cyan-500 to-blue-500",
];

function getHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
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

export default function ToolIcon({
  name,
  company = "AI",
  officialUrl,
  category,
  size = 40,
  className = "",
}: ToolIconProps) {
  const [imageFailed, setImageFailed] = useState(false);

  // Normalize company name for SVG lookups
  const compKey = company.toLowerCase().trim();
  const nameKey = name.toLowerCase().trim();

  // 1. Direct premier SVG match
  if (compKey.includes("google") && ECOSYSTEM_BRAND_SVGS.google) {
    return (
      <div
        className={`shrink-0 flex items-center justify-center rounded-2xl bg-white/[0.04] border border-white/[0.08] p-2 ${className}`}
        style={{ width: size, height: size }}
      >
        {ECOSYSTEM_BRAND_SVGS.google(size * 0.55)}
      </div>
    );
  }

  if (compKey.includes("openai") && ECOSYSTEM_BRAND_SVGS.openai) {
    return (
      <div
        className={`shrink-0 flex items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-2 ${className}`}
        style={{ width: size, height: size }}
      >
        {ECOSYSTEM_BRAND_SVGS.openai(size * 0.55)}
      </div>
    );
  }

  if (compKey.includes("anthropic") && ECOSYSTEM_BRAND_SVGS.anthropic) {
    return (
      <div
        className={`shrink-0 flex items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/20 p-2 ${className}`}
        style={{ width: size, height: size }}
      >
        {ECOSYSTEM_BRAND_SVGS.anthropic(size * 0.55)}
      </div>
    );
  }

  if (compKey.includes("meta") && ECOSYSTEM_BRAND_SVGS.meta) {
    return (
      <div
        className={`shrink-0 flex items-center justify-center rounded-2xl bg-blue-500/10 border border-blue-500/20 p-2 ${className}`}
        style={{ width: size, height: size }}
      >
        {ECOSYSTEM_BRAND_SVGS.meta(size * 0.55)}
      </div>
    );
  }

  if ((compKey.includes("xai") || nameKey.includes("grok")) && ECOSYSTEM_BRAND_SVGS.xai) {
    return (
      <div
        className={`shrink-0 flex items-center justify-center rounded-2xl bg-white/[0.08] border border-white/[0.12] p-2 ${className}`}
        style={{ width: size, height: size }}
      >
        {ECOSYSTEM_BRAND_SVGS.xai(size * 0.55)}
      </div>
    );
  }

  if (compKey.includes("deepseek") && ECOSYSTEM_BRAND_SVGS.deepseek) {
    return (
      <div
        className={`shrink-0 flex items-center justify-center rounded-2xl bg-blue-600/10 border border-blue-600/20 p-2 ${className}`}
        style={{ width: size, height: size }}
      >
        {ECOSYSTEM_BRAND_SVGS.deepseek(size * 0.55)}
      </div>
    );
  }

  if (compKey.includes("mistral") && ECOSYSTEM_BRAND_SVGS.mistral) {
    return (
      <div
        className={`shrink-0 flex items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/20 p-2 ${className}`}
        style={{ width: size, height: size }}
      >
        {ECOSYSTEM_BRAND_SVGS.mistral(size * 0.55)}
      </div>
    );
  }

  if ((compKey.includes("vercel") || nameKey.includes("v0")) && ECOSYSTEM_BRAND_SVGS.vercel) {
    return (
      <div
        className={`shrink-0 flex items-center justify-center rounded-2xl bg-black border border-white/[0.15] p-2 ${className}`}
        style={{ width: size, height: size }}
      >
        {ECOSYSTEM_BRAND_SVGS.vercel(size * 0.55)}
      </div>
    );
  }

  if ((compKey.includes("github") || compKey.includes("microsoft")) && ECOSYSTEM_BRAND_SVGS.github) {
    return (
      <div
        className={`shrink-0 flex items-center justify-center rounded-2xl bg-white/[0.06] border border-white/[0.1] p-2 ${className}`}
        style={{ width: size, height: size }}
      >
        {ECOSYSTEM_BRAND_SVGS.github(size * 0.55)}
      </div>
    );
  }

  // 2. High-Resolution Favicon via Google or Unavatar
  const domain = extractDomain(officialUrl);
  if (domain && !imageFailed) {
    const faviconUrl = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`;
    return (
      <div
        className={`shrink-0 relative overflow-hidden rounded-2xl bg-[#161923] border border-white/[0.08] flex items-center justify-center p-1.5 shadow-inner ${className}`}
        style={{ width: size, height: size }}
      >
        <img
          src={faviconUrl}
          alt={name}
          width={Math.round(size * 0.65)}
          height={Math.round(size * 0.65)}
          className="rounded-lg object-contain"
          onError={() => setImageFailed(true)}
          loading="lazy"
        />
      </div>
    );
  }

  // 3. Fallback: Clean Geometric Monogram Badge
  const monogram = name
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase() || name.slice(0, 2).toUpperCase();

  const gradientIdx = getHash(name + company) % GRADIENTS.length;
  const gradient = GRADIENTS[gradientIdx];

  return (
    <div
      className={`shrink-0 flex items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} p-0.5 shadow-md shadow-indigo-500/10 ${className}`}
      style={{ width: size, height: size }}
    >
      <div className="w-full h-full rounded-[14px] bg-[#0E1017]/90 flex items-center justify-center">
        <span
          className="font-mono font-bold tracking-tight text-white select-none"
          style={{ fontSize: Math.max(11, Math.round(size * 0.35)) }}
        >
          {monogram}
        </span>
      </div>
    </div>
  );
}
