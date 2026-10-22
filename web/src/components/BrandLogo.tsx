"use client";

import React from "react";

interface BrandLogoProps {
  name?: string;
  creator?: string;
  slug?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function BrandLogo({
  name = "",
  creator = "",
  slug = "",
  size = "md",
  className = "",
}: BrandLogoProps) {
  const identifier = `${slug} ${name} ${creator}`.toLowerCase();

  // Size mapping
  const sizeClasses = {
    xs: "h-4 w-4 text-[10px]",
    sm: "h-5 w-5 text-xs",
    md: "h-7 w-7 text-sm",
    lg: "h-9 w-9 text-base",
    xl: "h-11 w-11 text-lg",
  }[size];

  const iconSizes = {
    xs: 12,
    sm: 14,
    md: 18,
    lg: 22,
    xl: 26,
  }[size];

  // 1. OpenAI (ChatGPT, Codex, Sora, Whisper, Operator, o3, GPT-4)
  if (
    identifier.includes("openai") ||
    identifier.includes("chatgpt") ||
    identifier.includes("codex") ||
    identifier.includes("sora") ||
    identifier.includes("whisper") ||
    identifier.includes("operator") ||
    identifier.includes("o3")
  ) {
    return (
      <div
        className={`flex items-center justify-center rounded-lg bg-[#10A37F]/15 border border-[#10A37F]/30 text-[#10A37F] shrink-0 ${sizeClasses} ${className}`}
        title="OpenAI"
      >
        <svg
          width={iconSizes}
          height={iconSizes}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2a4 4 0 0 0-4 4v1.5a4 4 0 0 0-3.5 2.1 4 4 0 0 0 .5 4.9 4 4 0 0 0-.5 4.9 4 4 0 0 0 3.5 2.1V22a4 4 0 0 0 8 0v-1.5a4 4 0 0 0 3.5-2.1 4 4 0 0 0-.5-4.9 4 4 0 0 0 .5-4.9 4 4 0 0 0-3.5-2.1V6a4 4 0 0 0-4-4Z" />
          <path d="M12 8v8" />
          <path d="m8.5 10 7 4" />
          <path d="m8.5 14 7-4" />
        </svg>
      </div>
    );
  }

  // 2. Google / DeepMind (Gemini, Antigravity, Gemma)
  if (
    identifier.includes("gemini") ||
    identifier.includes("antigravity") ||
    identifier.includes("deepmind") ||
    identifier.includes("google") ||
    identifier.includes("gemma")
  ) {
    return (
      <div
        className={`flex items-center justify-center rounded-lg bg-[#4285F4]/15 border border-[#4285F4]/30 text-[#4285F4] shrink-0 ${sizeClasses} ${className}`}
        title="Google DeepMind"
      >
        <svg
          width={iconSizes}
          height={iconSizes}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
        </svg>
      </div>
    );
  }

  // 3. Anthropic (Claude, Claude Code, Computer Use)
  if (identifier.includes("anthropic") || identifier.includes("claude")) {
    return (
      <div
        className={`flex items-center justify-center rounded-lg bg-[#D97706]/15 border border-[#D97706]/30 text-[#F59E0B] shrink-0 ${sizeClasses} ${className}`}
        title="Anthropic"
      >
        <svg
          width={iconSizes}
          height={iconSizes}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M14.5 4h-5l-6 16h4.5l1.5-4h5l1.5 4h4.5l-6-16zm-3.5 9l1.5-4.5 1.5 4.5h-3z" />
        </svg>
      </div>
    );
  }

  // 4. Meta (Llama, Meta AI)
  if (identifier.includes("meta") || identifier.includes("llama")) {
    return (
      <div
        className={`flex items-center justify-center rounded-lg bg-[#0081FB]/15 border border-[#0081FB]/30 text-[#0081FB] shrink-0 ${sizeClasses} ${className}`}
        title="Meta AI"
      >
        <svg
          width={iconSizes}
          height={iconSizes}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 14.5c-1.8 0-3.4-1.2-4.1-2.9 1.1-2.5 3-4.1 4.1-4.1s3 1.6 4.1 4.1c-.7 1.7-2.3 2.9-4.1 2.9zm-7-2.5c0 3.3 2.5 6 6 6 1.8 0 3.4-.8 4.6-2 1.2 1.2 2.8 2 4.6 2 3.5 0 6-2.7 6-6s-2.5-6-6-6c-1.8 0-3.4.8-4.6 2-1.2-1.2-2.8-2-4.6-2-3.5 0-6 2.7-6 6z" />
        </svg>
      </div>
    );
  }

  // 5. DeepSeek (R1, V3)
  if (identifier.includes("deepseek")) {
    return (
      <div
        className={`flex items-center justify-center rounded-lg bg-[#1E88E5]/15 border border-[#1E88E5]/30 text-[#42A5F5] shrink-0 ${sizeClasses} ${className}`}
        title="DeepSeek"
      >
        <svg
          width={iconSizes}
          height={iconSizes}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M3 13c1.5 0 3-1 4-2.5s2.5-2.5 5-2.5 4 1 5 2.5 2.5 2.5 4 2.5v2c-2 0-3.5-1-4.5-2.5S14.5 10 12 10s-3.5 1.5-4.5 2.5S5 15 3 15v-2zm9-8a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" />
        </svg>
      </div>
    );
  }

  // 6. Alibaba / Qwen
  if (identifier.includes("qwen") || identifier.includes("alibaba")) {
    return (
      <div
        className={`flex items-center justify-center rounded-lg bg-[#7C3AED]/15 border border-[#7C3AED]/30 text-[#A78BFA] shrink-0 ${sizeClasses} ${className}`}
        title="Alibaba Qwen"
      >
        <svg
          width={iconSizes}
          height={iconSizes}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
      </div>
    );
  }

  // 7. xAI (Grok)
  if (identifier.includes("xai") || identifier.includes("grok")) {
    return (
      <div
        className={`flex items-center justify-center rounded-lg bg-white/10 border border-white/20 text-white shrink-0 ${sizeClasses} ${className}`}
        title="xAI Grok"
      >
        <svg
          width={iconSizes}
          height={iconSizes}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </div>
    );
  }

  // 8. Mistral AI
  if (identifier.includes("mistral")) {
    return (
      <div
        className={`flex items-center justify-center rounded-lg bg-[#FF5722]/15 border border-[#FF5722]/30 text-[#FF7043] shrink-0 ${sizeClasses} ${className}`}
        title="Mistral AI"
      >
        <svg
          width={iconSizes}
          height={iconSizes}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <rect x="4" y="5" width="4" height="4" />
          <rect x="16" y="5" width="4" height="4" />
          <rect x="8" y="9" width="8" height="4" />
          <rect x="4" y="13" width="16" height="4" />
        </svg>
      </div>
    );
  }

  // 9. Cursor
  if (identifier.includes("cursor")) {
    return (
      <div
        className={`flex items-center justify-center rounded-lg bg-zinc-800/80 border border-white/15 text-zinc-100 shrink-0 ${sizeClasses} ${className}`}
        title="Cursor AI"
      >
        <svg
          width={iconSizes}
          height={iconSizes}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M4 3l14 8-6.5 1.5L9 19z" />
        </svg>
      </div>
    );
  }

  // 10. Windsurf / Codeium
  if (identifier.includes("windsurf") || identifier.includes("codeium")) {
    return (
      <div
        className={`flex items-center justify-center rounded-lg bg-[#00E599]/15 border border-[#00E599]/30 text-[#00E599] shrink-0 ${sizeClasses} ${className}`}
        title="Windsurf by Codeium"
      >
        <svg
          width={iconSizes}
          height={iconSizes}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M2 12c3-4 6-6 10-6s7 2 10 6c-3 4-6 6-10 6s-7-2-10-6z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </div>
    );
  }

  // 11. GitHub Copilot / Microsoft (Phi-4)
  if (
    identifier.includes("copilot") ||
    identifier.includes("github") ||
    identifier.includes("microsoft") ||
    identifier.includes("phi-4")
  ) {
    return (
      <div
        className={`flex items-center justify-center rounded-lg bg-white/10 border border-white/20 text-white shrink-0 ${sizeClasses} ${className}`}
        title="GitHub / Microsoft"
      >
        <svg
          width={iconSizes}
          height={iconSizes}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
        </svg>
      </div>
    );
  }

  // 12. Perplexity
  if (identifier.includes("perplexity")) {
    return (
      <div
        className={`flex items-center justify-center rounded-lg bg-[#20B2AA]/15 border border-[#20B2AA]/30 text-[#20B2AA] shrink-0 ${sizeClasses} ${className}`}
        title="Perplexity AI"
      >
        <svg
          width={iconSizes}
          height={iconSizes}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M12 3v18" />
          <path d="M3 12h18" />
          <path d="m5.5 5.5 13 13" />
          <path d="m5.5 18.5 13-13" />
        </svg>
      </div>
    );
  }

  // 13. Vercel (v0)
  if (identifier.includes("vercel") || identifier.includes("v0")) {
    return (
      <div
        className={`flex items-center justify-center rounded-lg bg-white/10 border border-white/20 text-white shrink-0 ${sizeClasses} ${className}`}
        title="Vercel v0"
      >
        <svg
          width={iconSizes}
          height={iconSizes}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 2L2 19.5h20L12 2z" />
        </svg>
      </div>
    );
  }

  // 14. Midjourney
  if (identifier.includes("midjourney")) {
    return (
      <div
        className={`flex items-center justify-center rounded-lg bg-[#3B82F6]/15 border border-[#3B82F6]/30 text-[#60A5FA] shrink-0 ${sizeClasses} ${className}`}
        title="Midjourney"
      >
        <svg
          width={iconSizes}
          height={iconSizes}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M2 19c3-2 6-2 9 0 3-2 6-2 9 0" />
          <path d="M5 19l4-14 3 6 4-6 3 14" />
        </svg>
      </div>
    );
  }

  // 15. Kling AI
  if (identifier.includes("kling")) {
    return (
      <div
        className={`flex items-center justify-center rounded-lg bg-[#EC4899]/15 border border-[#EC4899]/30 text-[#F472B6] shrink-0 ${sizeClasses} ${className}`}
        title="Kling AI"
      >
        <svg
          width={iconSizes}
          height={iconSizes}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M6 4h4v6.5l5-6.5h5l-6.5 8L20 20h-5l-5-6.5V20H6V4z" />
        </svg>
      </div>
    );
  }

  // 16. Runway (Gen-3)
  if (identifier.includes("runway")) {
    return (
      <div
        className={`flex items-center justify-center rounded-lg bg-[#10B981]/15 border border-[#10B981]/30 text-[#34D399] shrink-0 ${sizeClasses} ${className}`}
        title="Runway"
      >
        <svg
          width={iconSizes}
          height={iconSizes}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M5 4h8a5 5 0 0 1 5 5c0 2.2-1.4 4-3.4 4.7L19 20h-4.5l-4-6H9v6H5V4zm4 4v3h4a1.5 1.5 0 0 0 0-3H9z" />
        </svg>
      </div>
    );
  }

  // 17. ElevenLabs
  if (identifier.includes("elevenlabs") || identifier.includes("eleven")) {
    return (
      <div
        className={`flex items-center justify-center rounded-lg bg-white/10 border border-white/20 text-white shrink-0 ${sizeClasses} ${className}`}
        title="ElevenLabs"
      >
        <svg
          width={iconSizes}
          height={iconSizes}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <rect x="7" y="4" width="3.5" height="16" rx="1.5" />
          <rect x="13.5" y="4" width="3.5" height="16" rx="1.5" />
        </svg>
      </div>
    );
  }

  // 18. Suno
  if (identifier.includes("suno")) {
    return (
      <div
        className={`flex items-center justify-center rounded-lg bg-[#F97316]/15 border border-[#F97316]/30 text-[#FB923C] shrink-0 ${sizeClasses} ${className}`}
        title="Suno AI"
      >
        <svg
          width={iconSizes}
          height={iconSizes}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="8" />
          <path d="M9 12a3 3 0 0 0 6 0" />
          <path d="M12 9v6" />
        </svg>
      </div>
    );
  }

  // 19. Cognition (Devin)
  if (identifier.includes("cognition") || identifier.includes("devin")) {
    return (
      <div
        className={`flex items-center justify-center rounded-lg bg-[#06B6D4]/15 border border-[#06B6D4]/30 text-[#22D3EE] shrink-0 ${sizeClasses} ${className}`}
        title="Cognition Devin"
      >
        <svg
          width={iconSizes}
          height={iconSizes}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect width="18" height="18" x="3" y="3" rx="2" />
          <path d="m8 9 3 3-3 3" />
          <path d="M13 15h3" />
        </svg>
      </div>
    );
  }

  // 20. CrewAI
  if (identifier.includes("crewai") || identifier.includes("crew")) {
    return (
      <div
        className={`flex items-center justify-center rounded-lg bg-[#E11D48]/15 border border-[#E11D48]/30 text-[#FB7185] shrink-0 ${sizeClasses} ${className}`}
        title="CrewAI"
      >
        <svg
          width={iconSizes}
          height={iconSizes}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      </div>
    );
  }

  // 21. LangChain / LangGraph
  if (identifier.includes("langchain") || identifier.includes("langgraph")) {
    return (
      <div
        className={`flex items-center justify-center rounded-lg bg-[#10B981]/15 border border-[#10B981]/30 text-[#34D399] shrink-0 ${sizeClasses} ${className}`}
        title="LangChain / LangGraph"
      >
        <svg
          width={iconSizes}
          height={iconSizes}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="6" cy="6" r="3" />
          <circle cx="18" cy="18" r="3" />
          <circle cx="18" cy="6" r="3" />
          <path d="M9 6h6" />
          <path d="m8 8 8 8" />
          <path d="M18 9v6" />
        </svg>
      </div>
    );
  }

  // 22. AutoGen
  if (identifier.includes("autogen")) {
    return (
      <div
        className={`flex items-center justify-center rounded-lg bg-[#6366F1]/15 border border-[#6366F1]/30 text-[#818CF8] shrink-0 ${sizeClasses} ${className}`}
        title="Microsoft AutoGen"
      >
        <svg
          width={iconSizes}
          height={iconSizes}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="12 2 19 8.5 19 15.5 12 22 5 15.5 5 8.5 12 2" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </div>
    );
  }

  // 23. OpenHands
  if (identifier.includes("openhands")) {
    return (
      <div
        className={`flex items-center justify-center rounded-lg bg-[#F59E0B]/15 border border-[#F59E0B]/30 text-[#FBBF24] shrink-0 ${sizeClasses} ${className}`}
        title="OpenHands"
      >
        <svg
          width={iconSizes}
          height={iconSizes}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v4" />
          <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v6" />
          <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" />
          <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
        </svg>
      </div>
    );
  }

  // 24. Replit
  if (identifier.includes("replit")) {
    return (
      <div
        className={`flex items-center justify-center rounded-lg bg-[#F26207]/15 border border-[#F26207]/30 text-[#F26207] shrink-0 ${sizeClasses} ${className}`}
        title="Replit"
      >
        <svg
          width={iconSizes}
          height={iconSizes}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M2 3h9v6H2zM11 9h9v6h-9zM2 15h9v6H2z" />
        </svg>
      </div>
    );
  }

  // 25. Hugging Face
  if (identifier.includes("hugging") || identifier.includes("hf")) {
    return (
      <div
        className={`flex items-center justify-center rounded-lg bg-[#FFD21E]/15 border border-[#FFD21E]/30 text-[#FFD21E] shrink-0 ${sizeClasses} ${className}`}
        title="Hugging Face"
      >
        <span className="font-bold">🤗</span>
      </div>
    );
  }

  // 26. Stability AI / Flux (Black Forest Labs)
  if (
    identifier.includes("flux") ||
    identifier.includes("stability") ||
    identifier.includes("black forest")
  ) {
    return (
      <div
        className={`flex items-center justify-center rounded-lg bg-[#A855F7]/15 border border-[#A855F7]/30 text-[#C084FC] shrink-0 ${sizeClasses} ${className}`}
        title="Flux / Stability AI"
      >
        <svg
          width={iconSizes}
          height={iconSizes}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      </div>
    );
  }

  // 27. Lovable / Bolt.new
  if (identifier.includes("lovable") || identifier.includes("bolt")) {
    return (
      <div
        className={`flex items-center justify-center rounded-lg bg-[#EC4899]/15 border border-[#EC4899]/30 text-[#F472B6] shrink-0 ${sizeClasses} ${className}`}
        title="Bolt / Lovable"
      >
        <svg
          width={iconSizes}
          height={iconSizes}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      </div>
    );
  }

  // Fallback: Elegant modern letter badge
  const initial = (name || creator || slug || "AI").charAt(0).toUpperCase();
  return (
    <div
      className={`flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-zinc-300 font-mono font-bold shrink-0 ${sizeClasses} ${className}`}
    >
      {initial}
    </div>
  );
}
