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
  preset?: "prism" | "spark" | "neural" | "minimal";
  brandName?: string;
}

export function OptimusLogoIcon({
  size = 32,
  className = "",
  customLogoUrl,
  customSvgCode,
  preset = "prism",
}: {
  size?: number;
  className?: string;
  customLogoUrl?: string;
  customSvgCode?: string;
  preset?: "prism" | "spark" | "neural" | "minimal";
}) {
  // 1. Custom Image URL Override
  if (customLogoUrl && customLogoUrl.trim()) {
    return (
      <img
        src={customLogoUrl}
        alt="Brand Logo"
        width={size}
        height={size}
        className={`object-contain rounded-lg ${className}`}
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

  // 3. Preset: Spark
  if (preset === "spark") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 ${className}`}
      >
        <defs>
          <linearGradient id="optSparkGrad" x1="4" y1="4" x2="60" y2="60" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="50%" stopColor="#6366F1" />
            <stop offset="100%" stopColor="#A855F7" />
          </linearGradient>
        </defs>
        <rect width="64" height="64" rx="16" fill="#090A0F" />
        <circle cx="32" cy="32" r="22" stroke="url(#optSparkGrad)" strokeWidth="2.5" strokeDasharray="3 3" opacity="0.6" />
        <path
          d="M32 10 C36 24 40 28 54 32 C40 36 36 40 32 54 C28 40 24 36 10 32 C24 28 28 24 32 10 Z"
          fill="url(#optSparkGrad)"
        />
        <circle cx="32" cy="32" r="3" fill="#FFFFFF" />
      </svg>
    );
  }

  // 4. Preset: Neural
  if (preset === "neural") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 ${className}`}
      >
        <defs>
          <linearGradient id="optNeuralGrad" x1="8" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#06B6D4" />
            <stop offset="50%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
        <rect width="64" height="64" rx="16" fill="#090A0F" />
        <circle cx="32" cy="18" r="5" stroke="url(#optNeuralGrad)" strokeWidth="2.5" fill="#090A0F" />
        <circle cx="18" cy="42" r="5" stroke="url(#optNeuralGrad)" strokeWidth="2.5" fill="#090A0F" />
        <circle cx="46" cy="42" r="5" stroke="url(#optNeuralGrad)" strokeWidth="2.5" fill="#090A0F" />
        <circle cx="32" cy="34" r="4" fill="url(#optNeuralGrad)" />
        <line x1="32" y1="23" x2="32" y2="30" stroke="url(#optNeuralGrad)" strokeWidth="2" />
        <line x1="22" y1="39" x2="28" y2="36" stroke="url(#optNeuralGrad)" strokeWidth="2" />
        <line x1="42" y1="39" x2="36" y2="36" stroke="url(#optNeuralGrad)" strokeWidth="2" />
      </svg>
    );
  }

  // 5. Preset: Minimal
  if (preset === "minimal") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 ${className}`}
      >
        <defs>
          <linearGradient id="optMinGrad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#6366F1" />
          </linearGradient>
        </defs>
        <rect width="64" height="64" rx="14" fill="#090A0F" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
        <path d="M22 42 V22 L42 42 V22" stroke="url(#optMinGrad)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  // Default: Interlocking Hexagonal Neural Prism with 4-Point Prime Spark
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
    >
      <defs>
        <linearGradient id="optimusGrad" x1="8" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="50%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#A855F7" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill="#090A0F" />
      <polygon
        points="32,6 54,19 54,45 32,58 10,45 10,19"
        stroke="url(#optimusGrad)"
        strokeWidth="3.5"
        fill="none"
        strokeLinejoin="round"
      />
      <path
        d="M32 6 L32 22 M54 19 L40 27 M54 45 L40 37 M32 58 L32 42 M10 45 L24 37 M10 19 L24 27"
        stroke="url(#optimusGrad)"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.65"
      />
      <path
        d="M32 16 C35 25 39 29 48 32 C39 35 35 39 32 48 C29 39 25 35 16 32 C25 29 29 25 32 16 Z"
        fill="url(#optimusGrad)"
      />
    </svg>
  );
}

export default function OptimusLogo({
  className = "",
  size = 32,
  showWordmark = true,
  wordmarkClassName = "text-[18px] sm:text-[20px] font-semibold text-white tracking-[-0.02em]",
  href = "/",
  customLogoUrl,
  customSvgCode,
  preset = "prism",
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
