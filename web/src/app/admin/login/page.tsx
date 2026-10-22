"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, Sparkles, AlertCircle } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setErrorMessage("Please enter the administrator passcode.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok && data?.success) {
        router.push("/admin");
        router.refresh();
      } else {
        setErrorMessage(data?.error || "Invalid administrator passcode.");
      }
    } catch {
      setErrorMessage("Network connection error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 pt-28 pb-12 relative">
      {/* Background radial ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-[#38bdf8]/10 via-[#818cf8]/5 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Back button */}
      <div className="w-full max-w-md mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 font-mono text-xs text-[#71717A] hover:text-[#FAFAFA] transition-editorial"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Optimus Prime</span>
        </Link>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md p-8 sm:p-10 rounded-2xl bg-[#0D0D12] border border-white/10 shadow-2xl space-y-6 relative overflow-hidden backdrop-blur-xl">
        <div className="space-y-3 text-center">
          <div className="w-12 h-12 rounded-xl bg-[#F97316]/10 border border-[#F97316]/20 flex items-center justify-center mx-auto text-[#F97316]">
            <Shield className="w-6 h-6" />
          </div>

          <h1 className="font-heading font-bold text-2xl tracking-tight text-[#FAFAFA]">
            Super Admin Access
          </h1>

          <p className="font-sans text-xs text-[#A1A1AA] max-w-sm mx-auto leading-relaxed">
            Enter your secret master passcode to manage dynamic Gemini API keys, live news ingestion, and 45+ indexed ecosystem tools.
          </p>
        </div>

        {errorMessage && (
          <div className="p-3.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 font-mono text-xs flex items-center gap-2 animate-in fade-in duration-150">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block font-mono text-[11px] text-[#A1A1AA] uppercase tracking-wider">
              Admin Master Passcode
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin secret..."
                className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-[#050507] border border-white/10 text-sm text-[#FAFAFA] placeholder-[#52525B] focus:outline-none focus:border-[#F97316] transition-editorial font-mono"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#71717A] hover:text-[#FAFAFA] p-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#FAFAFA] hover:bg-white text-[#09090B] font-mono text-xs font-bold transition-editorial disabled:opacity-50 shadow-md"
          >
            <span>{isLoading ? "Authenticating..." : "Enter Command Center"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="pt-4 border-t border-white/5 flex items-center justify-between font-mono text-[10px] text-[#52525B]">
          <span>Protected Session (7 Days)</span>
          <span className="flex items-center gap-1 text-[#10B981]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
            Encrypted Cookie Auth
          </span>
        </div>
      </div>
    </div>
  );
}
