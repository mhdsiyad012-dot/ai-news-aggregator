"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, Sparkles, AlertCircle } from "lucide-react";
import OptimusLogo from "@/components/OptimusLogo";

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
    <div className="min-h-[85vh] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 pt-28 pb-16 relative">
      {/* Background radial ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] bg-gradient-to-tr from-[#6366F1]/15 via-[#06B6D4]/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Back button */}
      <div className="w-full max-w-md mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 font-mono text-xs text-[#9AA0A6] hover:text-white transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Optimus Prime</span>
        </Link>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md p-8 sm:p-10 rounded-[28px] bg-[#11131A] border border-white/[0.1] shadow-2xl space-y-6 relative overflow-hidden backdrop-blur-2xl">
        <div className="space-y-3 text-center">
          <div className="flex justify-center mb-2">
            <OptimusLogo size={48} showWordmark={false} />
          </div>

          <h1 className="font-heading font-normal text-2xl tracking-tight text-white">
            Super Admin Access
          </h1>

          <p className="font-sans text-xs text-[#9AA0A6] max-w-sm mx-auto leading-relaxed">
            Enter your secret master passcode to manage dynamic site branding, custom logos, Gemini API keys, and Supabase catalog records.
          </p>
        </div>

        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 font-mono text-xs flex items-center gap-2 animate-in fade-in duration-150">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block font-mono text-[11px] text-[#9AA0A6] uppercase tracking-wider">
              Admin Master Passcode
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin passcode..."
                className="w-full pl-3.5 pr-10 py-3 rounded-xl bg-black/40 border border-white/[0.08] text-sm text-white placeholder-[#9AA0A6] focus:outline-none focus:border-[#6366F1] transition font-mono"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9AA0A6] hover:text-white p-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-white hover:bg-zinc-200 text-black font-medium text-xs transition disabled:opacity-50 shadow-md"
          >
            <span>{isLoading ? "Authenticating..." : "Enter Command Center"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between font-mono text-[10px] text-[#9AA0A6]">
          <span>Protected Session (7 Days)</span>
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Encrypted Cookie Auth
          </span>
        </div>
      </div>
    </div>
  );
}
