import React from "react";
import Link from "next/link";

export interface OptimusLogoProps {
  className?: string;
  size?: number;
  showWordmark?: boolean;
  wordmarkClassName?: string;
  href?: string;
  customLogoUrl?: string;
  customSvgCode?: string;
  preset?: "aurora" | "deepmind" | "prism" | "spark" | "neural" | "minimal";
  brandName?: string;
}

export function OptimusLogoIcon({
  size = 32,
  className = "",
  customLogoUrl,
  customSvgCode,
  preset = "aurora",
}: {
  size?: number;
  className?: string;
  customLogoUrl?: string;
  customSvgCode?: string;
  preset?: "aurora" | "deepmind" | "prism" | "spark" | "neural" | "minimal";
}) {
  // 1. Custom Image URL or Uploaded Base64 Data URI Override
  if (customLogoUrl && customLogoUrl.trim()) {
    return (
      <img
        src={customLogoUrl}
        alt="Brand Logo"
        width={size}
        height={size}
        className={`object-contain rounded-xl ${className}`}
        style={{ width: `${size}px`, height: `${size}px` }}
      />
    );
  }

  // 2. Custom Raw SVG Code Override
  if (customSvgCode && customSvgCode.trim().startsWith("<svg")) {
    return (
      <span
        className={`inline-flex items-center justify-center shrink-0 ${className}`}
        style={{ width: `${size}px`, height: `${size}px` }}
        dangerouslySetInnerHTML={{ __html: customSvgCode }}
      />
    );
  }

  // 3. Preset: Aurora (Google Gemini Aurora Flow: Blue -> Violet -> Coral)
  if (preset === "aurora") {
    return (
      <div
        className={`shrink-0 flex items-center justify-center rounded-2xl bg-[#F0F4F9] dark:bg-[#131314] border border-black/[0.06] dark:border-white/[0.1] shadow-sm p-1.5 ${className}`}
        style={{ width: `${size}px`, height: `${size}px` }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="auroraFlow" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#4285F4" />
              <stop offset="50%" stopColor="#9B72CB" />
              <stop offset="100%" stopColor="#D96570" />
            </linearGradient>
            <radialGradient id="auroraGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#4285F4" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#D96570" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="32" cy="32" r="28" fill="url(#auroraGlow)" opacity="0.25" />
          <path
            d="M32 8 C36 22 42 28 56 32 C42 36 36 42 32 56 C28 42 22 36 8 32 C22 28 28 22 32 8 Z"
            fill="url(#auroraFlow)"
          />
          <circle cx="32" cy="32" r="3.5" fill="#FFFFFF" />
        </svg>
      </div>
    );
  }

  // 4. Preset: DeepMind (Dual Interlocking Geometric Spark)
  if (preset === "deepmind") {
    return (
      <div
        className={`shrink-0 flex items-center justify-center rounded-2xl bg-[#F0F4F9] dark:bg-[#131314] border border-black/[0.06] dark:border-white/[0.1] shadow-sm p-1.5 ${className}`}
        style={{ width: `${size}px`, height: `${size}px` }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="deepGrad" x1="4" y1="4" x2="60" y2="60" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#1A73E8" />
              <stop offset="100%" stopColor="#8AB4F8" />
            </linearGradient>
          </defs>
          <rect x="12" y="12" width="24" height="24" rx="8" fill="url(#deepGrad)" opacity="0.9" />
          <rect x="28" y="28" width="24" height="24" rx="8" fill="#9B72CB" opacity="0.85" />
          <circle cx="32" cy="32" r="4" fill="#FFFFFF" />
        </svg>
      </div>
    );
  }

  // 5. Preset: Prism
  if (preset === "prism") {
    return (
      <div
        className={`shrink-0 flex items-center justify-center rounded-2xl bg-[#F0F4F9] dark:bg-[#131314] border border-black/[0.06] dark:border-white/[0.1] shadow-sm p-1.5 ${className}`}
        style={{ width: `${size}px`, height: `${size}px` }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="prismGrad" x1="8" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="50%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#A855F7" />
            </linearGradient>
          </defs>
          <polygon
            points="32,8 54,20 54,44 32,56 10,44 10,20"
            stroke="url(#prismGrad)"
            strokeWidth="3.5"
            fill="none"
            strokeLinejoin="round"
          />
          <path
            d="M32 18 C35 25 39 29 46 32 C39 35 35 39 32 46 C29 39 25 35 18 32 C25 29 29 25 32 18 Z"
            fill="url(#prismGrad)"
          />
        </svg>
      </div>
    );
  }

  // 6. Preset: Spark
  if (preset === "spark") {
    return (
      <div
        className={`shrink-0 flex items-center justify-center rounded-2xl bg-[#F0F4F9] dark:bg-[#131314] border border-black/[0.06] dark:border-white/[0.1] shadow-sm p-1.5 ${className}`}
        style={{ width: `${size}px`, height: `${size}px` }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="optSparkGrad" x1="4" y1="4" x2="60" y2="60" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="50%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#A855F7" />
            </linearGradient>
          </defs>
          <circle cx="32" cy="32" r="22" stroke="url(#optSparkGrad)" strokeWidth="2.5" strokeDasharray="3 3" opacity="0.6" />
          <path
            d="M32 10 C36 24 40 28 54 32 C40 36 36 40 32 54 C28 40 24 36 10 32 C24 28 28 24 32 10 Z"
            fill="url(#optSparkGrad)"
          />
          <circle cx="32" cy="32" r="3" fill="#FFFFFF" />
        </svg>
      </div>
    );
  }

  // 7. Preset: Neural
  if (preset === "neural") {
    return (
      <div
        className={`shrink-0 flex items-center justify-center rounded-2xl bg-[#F0F4F9] dark:bg-[#131314] border border-black/[0.06] dark:border-white/[0.1] shadow-sm p-1.5 ${className}`}
        style={{ width: `${size}px`, height: `${size}px` }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="optNeuralGrad" x1="8" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#06B6D4" />
              <stop offset="50%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
          </defs>
          <circle cx="32" cy="18" r="5" stroke="url(#optNeuralGrad)" strokeWidth="2.5" fill="none" />
          <circle cx="18" cy="42" r="5" stroke="url(#optNeuralGrad)" strokeWidth="2.5" fill="none" />
          <circle cx="46" cy="42" r="5" stroke="url(#optNeuralGrad)" strokeWidth="2.5" fill="none" />
          <circle cx="32" cy="34" r="4" fill="url(#optNeuralGrad)" />
          <line x1="32" y1="23" x2="32" y2="30" stroke="url(#optNeuralGrad)" strokeWidth="2" />
          <line x1="22" y1="39" x2="28" y2="36" stroke="url(#optNeuralGrad)" strokeWidth="2" />
          <line x1="42" y1="39" x2="36" y2="36" stroke="url(#optNeuralGrad)" strokeWidth="2" />
        </svg>
      </div>
    );
  }

  // Default: Minimal
  return (
    <div
      className={`shrink-0 flex items-center justify-center rounded-2xl bg-[#F0F4F9] dark:bg-[#131314] border border-black/[0.06] dark:border-white/[0.1] shadow-sm p-1.5 ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="optMinGrad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#4285F4" />
            <stop offset="100%" stopColor="#9B72CB" />
          </linearGradient>
        </defs>
        <path d="M22 42 V22 L42 42 V22" stroke="url(#optMinGrad)" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

export default function OptimusLogo({
  className = "",
  size = 32,
  showWordmark = true,
  wordmarkClassName = "text-[18px] sm:text-[20px] font-semibold text-[#1F1F1F] dark:text-white tracking-[-0.02em]",
  href = "/",
  customLogoUrl,
  customSvgCode,
  preset = "aurora",
  brandName = "Optimus Prime",
}: OptimusLogoProps) {
  const content = (
    <div className={`inline-flex items-center gap-3 transition-opacity hover:opacity-90 ${className}`}>
      <OptimusLogoIcon
        size={size}
        customLogoUrl={customLogoUrl}
        customSvgCode={customSvgCode}
        preset={preset}
      />
      {showWordmark && (
        <span className={wordmarkClassName}>
          {brandName}
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center focus:outline-none">
        {content}
      </Link>
    );
  }

  return content;
}
