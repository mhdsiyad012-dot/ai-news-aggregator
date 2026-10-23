"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, Sparkles, AlertCircle } from "lucide-react";
import OptimusLogo from "@/components/OptimusLogo";
import ThemeToggle from "@/components/ThemeToggle";

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
    <div className="min-h-screen bg-[#FFFFFF] dark:bg-[#060608] text-[#1F1F1F] dark:text-[#E3E3E3] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-16 relative">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      {/* Back button */}
      <div className="w-full max-w-md mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-[#5F6368] dark:text-[#8E9196] hover:text-[#1F1F1F] dark:hover:text-white transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Optimus Prime</span>
        </Link>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md p-8 sm:p-10 rounded-[32px] bg-[#F8FAFD] dark:bg-[#111318] border border-black/[0.08] dark:border-white/[0.08] shadow-xl space-y-6 relative overflow-hidden backdrop-blur-2xl">
        <div className="space-y-3 text-center">
          <div className="flex justify-center mb-2">
            <OptimusLogo size={48} showWordmark={false} />
          </div>

          <h1 className="font-heading font-normal text-2xl tracking-tight text-[#1F1F1F] dark:text-white">
            Super Admin Access
          </h1>

          <p className="font-sans text-xs text-[#5F6368] dark:text-[#8E9196] max-w-sm mx-auto leading-relaxed">
            Enter your secret master passcode to manage dynamic site branding, custom logos, Gemini API keys, and Supabase catalog records.
          </p>
        </div>

        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-2 animate-in fade-in duration-150">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#5F6368] dark:text-[#8E9196]">
              Admin Master Passcode
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin passcode..."
                className="w-full pl-4 pr-10 py-3 rounded-2xl bg-white dark:bg-[#1A1D24] border border-black/[0.1] dark:border-white/[0.1] text-sm text-[#1F1F1F] dark:text-white placeholder-[#5F6368] dark:placeholder-[#8E9196] focus:outline-none focus:border-[#4285F4] transition"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#5F6368] dark:text-[#8E9196] hover:text-[#1F1F1F] dark:hover:text-white p-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#4285F4] hover:bg-[#3367D6] text-white font-medium text-xs transition disabled:opacity-50 shadow-md"
          >
            <span>{isLoading ? "Authenticating..." : "Enter Command Center"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="pt-4 border-t border-black/[0.06] dark:border-white/[0.06] flex items-center justify-between text-[11px] text-[#5F6368] dark:text-[#8E9196]">
          <span>Protected Session (7 Days)</span>
          <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Encrypted Cookie Auth
          </span>
        </div>
      </div>
    </div>
  );
}
