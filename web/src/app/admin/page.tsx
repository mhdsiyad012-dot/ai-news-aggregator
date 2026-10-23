"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Shield,
  Key,
  Database,
  Newspaper,
  Sliders,
  Sparkles,
  RefreshCw,
  Plus,
  Trash2,
  Edit3,
  Pin,
  ExternalLink,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  Eye,
  EyeOff,
  X,
  Layers,
  Palette,
  Image as ImageIcon,
  Type,
  Globe,
  Check,
  ChevronRight
} from "lucide-react";
import { AIDirectoryItem, LiveNewsItem, DirectoryCategory, PricingType } from "@/lib/types";
import OptimusLogo, { OptimusLogoIcon } from "@/components/OptimusLogo";

const ALL_CATEGORIES: DirectoryCategory[] = [
  "All Purpose",
  "Video & Image Editing AI",
  "UI/UX & Product Design AI",
  "Coding & Autonomous Agents",
  "Conversational & Reasoning LLMs",
  "Audio, Voice & Music AI",
  "Research & Search Engines",
  "Workflow & Automation",
];

const ALL_PRICINGS: PricingType[] = ["Free", "Freemium", "Paid", "Open Source"];

export default function SuperAdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // Tabs
  const [activeTab, setActiveTab] = useState<"key" | "branding" | "directory" | "news">("key");

  // Gemini Key State
  const [maskedKey, setMaskedKey] = useState<string>("");
  const [newKeyInput, setNewKeyInput] = useState<string>("");
  const [isUpdatingKey, setIsUpdatingKey] = useState(false);
  const [isTestingKey, setIsTestingKey] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    latencyMs: number;
    model: string;
    error?: string;
  } | null>(null);

  // Branding & Live Customization State
  const [siteName, setSiteName] = useState<string>("Optimus Prime");
  const [siteLogoMode, setSiteLogoMode] = useState<"preset" | "image_url" | "custom_svg">("preset");
  const [siteLogoPreset, setSiteLogoPreset] = useState<"prism" | "spark" | "neural" | "minimal">("prism");
  const [siteLogoCustom, setSiteLogoCustom] = useState<string>("");
  const [headlineInput, setHeadlineInput] = useState<string>("");
  const [taglineInput, setTaglineInput] = useState<string>("");
  const [heroBadgeText, setHeroBadgeText] = useState<string>("");
  const [themeAccent, setThemeAccent] = useState<"gemini" | "indigo-cyan" | "emerald" | "violet" | "monochrome">("indigo-cyan");
  const [announcementActive, setAnnouncementActive] = useState<boolean>(false);
  const [announcementText, setAnnouncementText] = useState<string>("");
  const [announcementLink, setAnnouncementLink] = useState<string>("/models");
  const [socialTwitter, setSocialTwitter] = useState<string>("");
  const [socialGithub, setSocialGithub] = useState<string>("");
  const [socialDiscord, setSocialDiscord] = useState<string>("");
  const [footerText, setFooterText] = useState<string>("");
  const [isSavingBranding, setIsSavingBranding] = useState(false);

  // Directory State
  const [directoryItems, setDirectoryItems] = useState<AIDirectoryItem[]>([]);
  const [dirSearch, setDirSearch] = useState("");
  const [dirCategoryFilter, setDirCategoryFilter] = useState<string>("All");
  const [isSeeding, setIsSeeding] = useState(false);

  // News State
  const [newsArticles, setNewsArticles] = useState<LiveNewsItem[]>([]);
  const [isSyncingNews, setIsSyncingNews] = useState(false);

  // Drawer / Modal States
  const [editingTool, setEditingTool] = useState<AIDirectoryItem | null>(null);
  const [isNewToolModalOpen, setIsNewToolModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<LiveNewsItem | null>(null);
  const [isNewArticleModalOpen, setIsNewArticleModalOpen] = useState(false);

  // Notifications
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showNotification = (message: string, type: "success" | "error" = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Auth check & data load
  useEffect(() => {
    async function checkAuthAndLoad() {
      try {
        const authRes = await fetch("/api/admin/auth");
        const authData = await authRes.json();

        if (!authData?.authenticated) {
          router.push("/admin/login");
          return;
        }

        setIsAuthenticated(true);
        loadAllData();
      } catch {
        router.push("/admin/login");
      }
    }

    checkAuthAndLoad();
  }, [router]);

  const loadAllData = async () => {
    // 1. Settings & Key
    try {
      const res = await fetch("/api/admin/settings");
      if (res.ok) {
        const data = await res.json();
        if (data?.settings) {
          setMaskedKey(data.settings.geminiApiKeyMasked || "");
          setSiteName(data.settings.siteName || "Optimus Prime");
          setSiteLogoMode(data.settings.siteLogoMode || "preset");
          setSiteLogoPreset(data.settings.siteLogoPreset || "prism");
          setSiteLogoCustom(data.settings.siteLogoCustom || "");
          setHeadlineInput(data.settings.siteHeadline || "");
          setTaglineInput(data.settings.siteTagline || "");
          setHeroBadgeText(data.settings.heroBadgeText || "");
          setThemeAccent(data.settings.themeAccent || "indigo-cyan");
          setAnnouncementActive(Boolean(data.settings.announcementActive));
          setAnnouncementText(data.settings.announcementText || "");
          setAnnouncementLink(data.settings.announcementLink || "/models");
          setSocialTwitter(data.settings.socialTwitter || "");
          setSocialGithub(data.settings.socialGithub || "");
          setSocialDiscord(data.settings.socialDiscord || "");
          setFooterText(data.settings.footerText || "");
        }
      }
    } catch (err) {
      console.warn("Failed loading settings:", err);
    }

    // 2. Directory Tools
    try {
      const res = await fetch("/api/admin/directory");
      if (res.ok) {
        const data = await res.json();
        if (data?.items) {
          setDirectoryItems(data.items);
        }
      }
    } catch (err) {
      console.warn("Failed loading directory:", err);
    }

    // 3. News Articles
    try {
      const res = await fetch("/api/admin/news");
      if (res.ok) {
        const data = await res.json();
        if (data?.articles) {
          setNewsArticles(data.articles);
        }
      }
    } catch (err) {
      console.warn("Failed loading news:", err);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
      router.push("/admin/login");
      router.refresh();
    } catch {
      router.push("/admin/login");
    }
  };

  // Test Gemini Key Latency
  const handleTestKey = async (customKey?: string) => {
    setIsTestingKey(true);
    setTestResult(null);

    try {
      const res = await fetch("/api/admin/settings/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ geminiApiKey: customKey || undefined }),
      });

      const data = await res.json();
      setTestResult(data);
      if (data.success) {
        showNotification(`Gemini Key Online! Latency: ${data.latencyMs}ms (${data.model})`);
      } else {
        showNotification(data.error || "Gemini Key verification failed.", "error");
      }
    } catch {
      showNotification("Network error testing Gemini key.", "error");
    } finally {
      setIsTestingKey(false);
    }
  };

  // Update Gemini Key
  const handleUpdateGeminiKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyInput.trim()) return;

    setIsUpdatingKey(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ geminiApiKey: newKeyInput.trim() }),
      });

      const data = await res.json();
      if (data.success) {
        setMaskedKey(data.settings.geminiApiKeyMasked);
        setNewKeyInput("");
        showNotification("Gemini API Key updated and cached across all instances!");
        handleTestKey();
      } else {
        showNotification(data.error || "Failed to update API key.", "error");
      }
    } catch {
      showNotification("Failed to update API key.", "error");
    } finally {
      setIsUpdatingKey(false);
    }
  };

  // Save Branding, Logo & Customization
  const handleSaveBranding = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingBranding(true);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteName,
          siteLogoMode,
          siteLogoPreset,
          siteLogoCustom,
          siteHeadline: headlineInput,
          siteTagline: taglineInput,
          heroBadgeText,
          themeAccent,
          announcementActive,
          announcementText,
          announcementLink,
          socialTwitter,
          socialGithub,
          socialDiscord,
          footerText,
        }),
      });

      const data = await res.json();
      if (data.success) {
        showNotification("Branding, custom logo, and site identity updated live!");
      } else {
        showNotification(data.error || "Failed to update branding settings.", "error");
      }
    } catch {
      showNotification("Failed to update branding settings.", "error");
    } finally {
      setIsSavingBranding(false);
    }
  };

  // Tool Save
  const handleSaveTool = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTool) return;

    try {
      const res = await fetch("/api/admin/directory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingTool),
      });

      const data = await res.json();
      if (data.success) {
        showNotification(`Saved system: ${editingTool.name}`);
        setEditingTool(null);
        setIsNewToolModalOpen(false);
        loadAllData();
      } else {
        showNotification(data.error || "Failed to save AI tool.", "error");
      }
    } catch {
      showNotification("Failed to save AI tool.", "error");
    }
  };

  // Tool Delete
  const handleDeleteTool = async (slug: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;

    try {
      const res = await fetch(`/api/admin/directory?slug=${encodeURIComponent(slug)}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (data.success) {
        showNotification(`Deleted system: ${name}`);
        loadAllData();
      } else {
        showNotification(data.error || "Failed to delete tool.", "error");
      }
    } catch {
      showNotification("Failed to delete tool.", "error");
    }
  };

  // Article Save
  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle) return;

    try {
      const res = await fetch("/api/admin/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingArticle),
      });

      const data = await res.json();
      if (data.success) {
        showNotification(`Saved article: ${editingArticle.title.slice(0, 30)}...`);
        setEditingArticle(null);
        setIsNewArticleModalOpen(false);
        loadAllData();
      } else {
        showNotification(data.error || "Failed to save article.", "error");
      }
    } catch {
      showNotification("Failed to save article.", "error");
    }
  };

  // Article Pin Toggle
  const handleTogglePin = async (id: string | number, currentPin: boolean) => {
    try {
      const res = await fetch("/api/admin/news", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isPinned: !currentPin }),
      });

      const data = await res.json();
      if (data.success) {
        showNotification(currentPin ? "Article unpinned." : "Article pinned to top of wire!");
        loadAllData();
      }
    } catch {
      showNotification("Failed to update article pin status.", "error");
    }
  };

  // Article Delete
  const handleDeleteArticle = async (id: string | number, title: string) => {
    if (!confirm(`Delete article: "${title.slice(0, 40)}..."?`)) return;

    try {
      const res = await fetch(`/api/admin/news?id=${encodeURIComponent(String(id))}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (data.success) {
        showNotification("Article deleted from wire.");
        loadAllData();
      }
    } catch {
      showNotification("Failed to delete article.", "error");
    }
  };

  // News Sync
  const handleSyncNewsWithGemini = async () => {
    setIsSyncingNews(true);
    try {
      const res = await fetch("/api/admin/news/sync", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        showNotification(data.message || "News synchronized with Supabase!");
        loadAllData();
      } else {
        showNotification(data.error || "Sync error.", "error");
      }
    } catch {
      showNotification("Failed to trigger live news sync.", "error");
    } finally {
      setIsSyncingNews(false);
    }
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#090A0F] flex items-center justify-center text-white font-mono text-xs">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          <span>Verifying Super Admin session...</span>
        </div>
      </div>
    );
  }

  const filteredDirectory = directoryItems.filter((tool) => {
    const matchesCat = dirCategoryFilter === "All" || tool.category === dirCategoryFilter;
    const q = dirSearch.toLowerCase().trim();
    const matchesSearch =
      !q ||
      (tool.name || "").toLowerCase().includes(q) ||
      (tool.company || "").toLowerCase().includes(q) ||
      (tool.tagline || "").toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#090A0F] text-white p-4 sm:p-8 lg:p-12 space-y-8 max-w-7xl mx-auto pt-28">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 font-sans text-xs font-medium border animate-in slide-in-from-bottom duration-200 ${
            notification.type === "success"
              ? "bg-emerald-950/90 text-emerald-300 border-emerald-500/30"
              : "bg-rose-950/90 text-rose-300 border-rose-500/30"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div className="flex items-center gap-4">
          <OptimusLogo size={36} showWordmark={false} />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading text-xl sm:text-2xl font-normal text-white">
                Super Admin Command Center
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-[#6366F1]/15 text-[#38BDF8] border border-[#6366F1]/30 font-mono text-[10px]">
                LIVE RLS
              </span>
            </div>
            <p className="font-sans text-xs text-[#9AA0A6] mt-0.5">
              Full control over site branding, custom logos, Gemini API hot-swapping, and Supabase data.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#11131A] hover:bg-white/[0.06] border border-white/[0.1] text-xs font-sans text-[#9AA0A6] hover:text-white transition-all"
          >
            <span>View Live Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#11131A] hover:bg-rose-950/30 border border-white/[0.1] hover:border-rose-500/30 text-xs font-sans text-zinc-400 hover:text-rose-400 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* Primary 4-Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-white/[0.08] pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab("key")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-medium transition-all shrink-0 ${
            activeTab === "key"
              ? "bg-white text-black shadow-md"
              : "text-[#9AA0A6] hover:text-white hover:bg-white/[0.05]"
          }`}
        >
          <Key className="w-3.5 h-3.5" />
          <span>Gemini API Key</span>
        </button>

        <button
          onClick={() => setActiveTab("branding")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-medium transition-all shrink-0 ${
            activeTab === "branding"
              ? "bg-white text-black shadow-md"
              : "text-[#9AA0A6] hover:text-white hover:bg-white/[0.05]"
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Branding &amp; Custom Logo</span>
        </button>

        <button
          onClick={() => setActiveTab("directory")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-medium transition-all shrink-0 ${
            activeTab === "directory"
              ? "bg-white text-black shadow-md"
              : "text-[#9AA0A6] hover:text-white hover:bg-white/[0.05]"
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>AI Directory ({directoryItems.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("news")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-medium transition-all shrink-0 ${
            activeTab === "news"
              ? "bg-white text-black shadow-md"
              : "text-[#9AA0A6] hover:text-white hover:bg-white/[0.05]"
          }`}
        >
          <Newspaper className="w-3.5 h-3.5" />
          <span>News Wire ({newsArticles.length})</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: GEMINI API KEY CONTROLLER                         */}
      {/* ======================================================== */}
      {activeTab === "key" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-150">
          <div className="lg:col-span-2 p-8 rounded-2xl bg-[#11131A] border border-white/[0.08] space-y-6">
            <div className="space-y-1.5">
              <h2 className="font-heading font-medium text-xl sm:text-2xl text-white flex items-center gap-2">
                <span>Gemini API Key Controller</span>
              </h2>
              <p className="font-sans text-xs sm:text-sm text-[#9AA0A6] leading-relaxed">
                Update the active Google Gemini API Key on the fly. Key is securely persisted in Supabase and cached across Vercel serverless instances. Zero redeployment needed.
              </p>
            </div>

            {/* Active Key Status Box */}
            <div className="p-5 rounded-xl bg-black/60 border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs">
              <div className="space-y-1">
                <span className="text-[#9AA0A6] text-[11px] uppercase tracking-wider block">
                  ACTIVE KEY IN USE:
                </span>
                <span className="text-emerald-400 font-bold text-sm tracking-wide">
                  {maskedKey || "AQ.Ab8...IWLQ"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleTestKey()}
                  disabled={isTestingKey}
                  className="px-4 py-2 rounded-full bg-[#161822] hover:bg-white/[0.08] border border-white/15 text-white font-sans text-xs font-medium transition-all flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
                  <span>Verify Active Key</span>
                </button>
              </div>
            </div>

            {/* Update Form */}
            <form onSubmit={handleUpdateGeminiKey} className="space-y-4 pt-4 border-t border-white/[0.08]">
              <div className="space-y-1.5">
                <label className="block font-mono text-xs text-[#9AA0A6] uppercase tracking-wider">
                  HOT-SWAP NEW GEMINI API KEY
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={newKeyInput}
                    onChange={(e) => setNewKeyInput(e.target.value)}
                    placeholder="Enter AQ.Ab8... or AIzaSy... API key"
                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/[0.08] text-sm text-white font-mono focus:outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => handleTestKey(newKeyInput)}
                  disabled={!newKeyInput.trim() || isTestingKey}
                  className="px-4 py-2.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-sans text-zinc-300 disabled:opacity-40 transition-all"
                >
                  {isTestingKey ? "Testing Latency..." : "Test Before Saving"}
                </button>

                <button
                  type="submit"
                  disabled={!newKeyInput.trim() || isUpdatingKey}
                  className="px-6 py-2.5 rounded-full bg-white text-black hover:bg-zinc-200 text-xs font-medium disabled:opacity-40 transition-all shadow-md"
                >
                  {isUpdatingKey ? "Updating Key..." : "Save & Activate Key"}
                </button>
              </div>
            </form>
          </div>

          {/* Latency Benchmark Card */}
          <div className="p-8 rounded-2xl bg-[#11131A] border border-white/[0.08] space-y-5">
            <h3 className="font-heading font-medium text-lg text-white">
              Latency Benchmark
            </h3>

            {testResult ? (
              <div className="p-4 rounded-xl bg-black/60 border border-white/[0.08] space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#9AA0A6]">Target Model:</span>
                  <span className="text-white">{testResult.model}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#9AA0A6]">Response Time:</span>
                  <span className={testResult.success ? "text-emerald-400 font-bold" : "text-rose-400"}>
                    {testResult.latencyMs} ms
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#9AA0A6]">Status:</span>
                  <span className={testResult.success ? "text-emerald-400 font-bold" : "text-rose-400"}>
                    {testResult.success ? "Authenticated & Online" : "Failed"}
                  </span>
                </div>
                {testResult.error && (
                  <p className="text-rose-400 text-[11px] pt-2 border-t border-white/[0.08]">
                    {testResult.error}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-xs text-[#9AA0A6] font-sans leading-relaxed">
                Click &quot;Verify Active Key&quot; to test live sub-second round-trip latency against Google&apos;s Gemini 2.5 Flash infrastructure.
              </p>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: BRANDING & CUSTOM LOGO STUDIO                     */}
      {/* ======================================================== */}
      {activeTab === "branding" && (
        <form onSubmit={handleSaveBranding} className="space-y-8 animate-in fade-in duration-150">
          {/* Section 1: Live Interactive Preview */}
          <div className="p-8 rounded-2xl bg-[#11131A] border border-white/[0.08] space-y-4">
            <span className="text-xs font-mono uppercase tracking-wider text-[#38BDF8] block">
              LIVE BRANDING PREVIEW
            </span>
            <div className="p-6 rounded-2xl bg-black/70 border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <OptimusLogoIcon
                  size={36}
                  preset={siteLogoPreset}
                  customLogoUrl={siteLogoMode === "image_url" ? siteLogoCustom : undefined}
                  customSvgCode={siteLogoMode === "custom_svg" ? siteLogoCustom : undefined}
                />
                <span className="font-heading font-medium text-xl text-white">
                  {siteName || "Optimus Prime"}
                </span>
              </div>
              <div className="text-xs font-mono text-[#9AA0A6]">
                Theme Accent: <span className="text-white capitalize">{themeAccent}</span>
              </div>
            </div>
          </div>

          {/* Section 2: Logo Customization Studio */}
          <div className="p-8 rounded-2xl bg-[#11131A] border border-white/[0.08] space-y-6">
            <div className="space-y-1">
              <h2 className="font-heading font-medium text-xl text-white">
                Brand Logo &amp; Favicon Customization
              </h2>
              <p className="font-sans text-xs text-[#9AA0A6]">
                Choose how your brand icon is rendered across the navbar, hero, browser tab, and footer.
              </p>
            </div>

            {/* Mode Switcher */}
            <div className="flex flex-wrap gap-2 pt-2">
              {[
                { id: "preset", label: "Vector Presets (SVG)" },
                { id: "image_url", label: "Custom Image URL" },
                { id: "custom_svg", label: "Raw SVG Code" },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setSiteLogoMode(m.id as any)}
                  className={`px-4 py-2 rounded-xl text-xs font-medium transition ${
                    siteLogoMode === m.id
                      ? "bg-white text-black shadow"
                      : "bg-white/[0.04] text-[#9AA0A6] hover:text-white border border-white/[0.06]"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* Mode 1: Vector Presets */}
            {siteLogoMode === "preset" && (
              <div className="space-y-3 pt-3">
                <label className="block font-mono text-xs text-[#9AA0A6] uppercase">
                  Select Vector Icon Preset:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { id: "prism", name: "Hex Neural Prism", desc: "Hexagonal prism with central 4-point prime spark" },
                    { id: "spark", name: "Prime Spark", desc: "Glowing multi-point astronomical star" },
                    { id: "neural", name: "Synapse Node", desc: "Connected neural network graph" },
                    { id: "minimal", name: "Minimalist Glyph", desc: "Clean geometric monogram" },
                  ].map((p) => {
                    const isSelected = siteLogoPreset === p.id;
                    return (
                      <div
                        key={p.id}
                        onClick={() => setSiteLogoPreset(p.id as any)}
                        className={`p-4 rounded-xl border cursor-pointer transition flex flex-col items-center text-center space-y-3 ${
                          isSelected
                            ? "bg-white/[0.08] border-[#38BDF8] shadow-lg shadow-sky-500/10"
                            : "bg-black/40 border-white/[0.06] hover:border-white/[0.15]"
                        }`}
                      >
                        <OptimusLogoIcon size={36} preset={p.id as any} />
                        <div>
                          <span className="font-medium text-xs text-white block">{p.name}</span>
                          <span className="text-[10px] text-[#9AA0A6] block mt-0.5 line-clamp-2">{p.desc}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Mode 2: Custom Image URL */}
            {siteLogoMode === "image_url" && (
              <div className="space-y-2 pt-2">
                <label className="block font-mono text-xs text-[#9AA0A6] uppercase">
                  Custom Logo Image URL (PNG / WebP / SVG)
                </label>
                <input
                  type="url"
                  value={siteLogoCustom}
                  onChange={(e) => setSiteLogoCustom(e.target.value)}
                  placeholder="https://example.com/my-logo.png"
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/[0.08] text-sm text-white font-mono focus:outline-none focus:border-[#6366F1]"
                />
              </div>
            )}

            {/* Mode 3: Raw SVG Code */}
            {siteLogoMode === "custom_svg" && (
              <div className="space-y-2 pt-2">
                <label className="block font-mono text-xs text-[#9AA0A6] uppercase">
                  Paste Custom SVG Code (&lt;svg ...&gt;...&lt;/svg&gt;)
                </label>
                <textarea
                  value={siteLogoCustom}
                  onChange={(e) => setSiteLogoCustom(e.target.value)}
                  rows={4}
                  placeholder="<svg viewBox='0 0 64 64' fill='none'>...</svg>"
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/[0.08] text-xs text-white font-mono focus:outline-none focus:border-[#6366F1]"
                />
              </div>
            )}
          </div>

          {/* Section 3: Identity & Display Text */}
          <div className="p-8 rounded-2xl bg-[#11131A] border border-white/[0.08] space-y-6">
            <h2 className="font-heading font-medium text-xl text-white">
              Site Identity &amp; Hero Content
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="block font-mono text-xs text-[#9AA0A6] uppercase">
                  Site Name / Brand Wordmark
                </label>
                <input
                  type="text"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/[0.08] text-sm text-white font-sans focus:outline-none focus:border-[#6366F1]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-mono text-xs text-[#9AA0A6] uppercase">
                  Hero Badge Text
                </label>
                <input
                  type="text"
                  value={heroBadgeText}
                  onChange={(e) => setHeroBadgeText(e.target.value)}
                  placeholder="Frontier Intelligence Index • 24/7 Verified"
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/[0.08] text-sm text-white font-sans focus:outline-none focus:border-[#6366F1]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block font-mono text-xs text-[#9AA0A6] uppercase">
                Hero Display Headline
              </label>
              <input
                type="text"
                value={headlineInput}
                onChange={(e) => setHeadlineInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/[0.08] text-sm text-white font-sans focus:outline-none focus:border-[#6366F1]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block font-mono text-xs text-[#9AA0A6] uppercase">
                Hero Subtitle / Editorial Tagline
              </label>
              <textarea
                value={taglineInput}
                onChange={(e) => setTaglineInput(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/[0.08] text-sm text-white font-sans focus:outline-none focus:border-[#6366F1]"
              />
            </div>
          </div>

          {/* Section 4: Announcement Banner */}
          <div className="p-8 rounded-2xl bg-[#11131A] border border-white/[0.08] space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-heading font-medium text-xl text-white">
                  Top Announcement Banner
                </h2>
                <p className="text-xs text-[#9AA0A6] mt-0.5">
                  Display a dynamic ribbon at the very top of all pages.
                </p>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={announcementActive}
                  onChange={(e) => setAnnouncementActive(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-white/[0.1] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6366F1]"></div>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block font-mono text-xs text-[#9AA0A6] uppercase">
                  Banner Text Message
                </label>
                <input
                  type="text"
                  value={announcementText}
                  onChange={(e) => setAnnouncementText(e.target.value)}
                  placeholder="e.g. Claude 3.7 Sonnet Released — Hybrid Extended Reasoning"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/[0.08] text-sm text-white font-sans focus:outline-none focus:border-[#6366F1]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-mono text-xs text-[#9AA0A6] uppercase">
                  Target Destination URL
                </label>
                <input
                  type="text"
                  value={announcementLink}
                  onChange={(e) => setAnnouncementLink(e.target.value)}
                  placeholder="/models or https://..."
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/[0.08] text-sm text-white font-sans focus:outline-none focus:border-[#6366F1]"
                />
              </div>
            </div>
          </div>

          {/* Section 5: Footer & Social Links */}
          <div className="p-8 rounded-2xl bg-[#11131A] border border-white/[0.08] space-y-6">
            <h2 className="font-heading font-medium text-xl text-white">
              Footer &amp; Social Links
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="font-mono text-[11px] text-[#9AA0A6] uppercase">Twitter / X</label>
                <input
                  type="url"
                  value={socialTwitter}
                  onChange={(e) => setSocialTwitter(e.target.value)}
                  placeholder="https://x.com/..."
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/[0.08] text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[11px] text-[#9AA0A6] uppercase">GitHub</label>
                <input
                  type="url"
                  value={socialGithub}
                  onChange={(e) => setSocialGithub(e.target.value)}
                  placeholder="https://github.com/..."
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/[0.08] text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[11px] text-[#9AA0A6] uppercase">Discord / Community</label>
                <input
                  type="url"
                  value={socialDiscord}
                  onChange={(e) => setSocialDiscord(e.target.value)}
                  placeholder="https://discord.gg/..."
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/[0.08] text-xs text-white"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block font-mono text-xs text-[#9AA0A6] uppercase">
                Footer Copyright Text
              </label>
              <input
                type="text"
                value={footerText}
                onChange={(e) => setFooterText(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/[0.08] text-xs text-white"
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isSavingBranding}
              className="px-8 py-3.5 rounded-full bg-white text-black hover:bg-zinc-200 font-medium text-sm transition-all shadow-lg"
            >
              {isSavingBranding ? "Saving Branding & Revalidating..." : "Save All Branding & Customization"}
            </button>
          </div>
        </form>
      )}

      {/* ======================================================== */}
      {/* TAB 3: AI DIRECTORY MANAGEMENT                           */}
      {/* ======================================================== */}
      {activeTab === "directory" && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="p-6 rounded-2xl bg-[#11131A] border border-white/[0.08] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="font-heading font-medium text-xl text-white">
                AI Directory Catalog ({directoryItems.length})
              </h2>
              <p className="font-sans text-xs text-[#9AA0A6]">
                Direct CRUD management for indexed AI models and tools in Supabase <code className="text-[#38BDF8]">ai_directory</code>.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  setEditingTool({
                    id: "",
                    slug: "",
                    name: "",
                    company: "Independent",
                    category: "Workflow & Automation",
                    secondaryCategories: [],
                    tagline: "",
                    description: "",
                    keyFeatures: [],
                    pricing: "Freemium",
                    officialUrl: "",
                    isFeatured: false,
                    relatedToolSlugs: [],
                  });
                  setIsNewToolModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white text-black hover:bg-zinc-200 text-xs font-medium transition shadow"
              >
                <Plus className="w-4 h-4" />
                <span>Add AI System</span>
              </button>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={dirSearch}
              onChange={(e) => setDirSearch(e.target.value)}
              placeholder="Search by name, company, or capability..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-[#11131A] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-[#6366F1]"
            />
            <select
              value={dirCategoryFilter}
              onChange={(e) => setDirCategoryFilter(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-[#11131A] border border-white/[0.08] text-xs text-white focus:outline-none cursor-pointer"
            >
              <option value="All">All Categories</option>
              {ALL_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Directory Table */}
          <div className="rounded-2xl bg-[#11131A] border border-white/[0.08] overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-sans text-xs">
                <thead className="bg-black/60 border-b border-white/[0.08] text-[#9AA0A6] uppercase text-[10px] font-mono tracking-wider">
                  <tr>
                    <th className="py-3 px-4">System</th>
                    <th className="py-3 px-4">Company</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Pricing</th>
                    <th className="py-3 px-4 text-center">Featured</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {filteredDirectory.map((tool) => (
                    <tr key={tool.id || tool.slug} className="hover:bg-white/[0.02] transition">
                      <td className="py-3 px-4 max-w-xs">
                        <span className="font-medium text-white block">{tool.name}</span>
                        <span className="text-[11px] text-[#9AA0A6] line-clamp-1">{tool.tagline}</span>
                      </td>
                      <td className="py-3 px-4 font-mono text-[#9AA0A6]">{tool.company}</td>
                      <td className="py-3 px-4 text-zinc-300">{tool.category}</td>
                      <td className="py-3 px-4 font-mono text-zinc-400">{tool.pricing}</td>
                      <td className="py-3 px-4 text-center">
                        {tool.isFeatured ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] border border-emerald-500/20">
                            Flagship
                          </span>
                        ) : (
                          <span className="text-[#9AA0A6] text-[10px]">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setEditingTool({ ...tool });
                              setIsNewToolModalOpen(false);
                            }}
                            className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-zinc-300 hover:text-white"
                            title="Edit Tool"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteTool(tool.slug || String(tool.id), tool.name)}
                            className="p-1.5 rounded-lg bg-rose-950/20 hover:bg-rose-950/40 text-rose-400 border border-rose-500/20"
                            title="Delete Tool"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: NEWS WIRE MANAGEMENT                              */}
      {/* ======================================================== */}
      {activeTab === "news" && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="p-6 rounded-2xl bg-[#11131A] border border-white/[0.08] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="font-heading font-medium text-xl text-white">
                Daily AI News Wire ({newsArticles.length})
              </h2>
              <p className="font-sans text-xs text-[#9AA0A6]">
                Manage live research dispatches in Supabase <code className="text-[#38BDF8]">articles</code>.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleSyncNewsWithGemini}
                disabled={isSyncingNews}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#10B981]/10 hover:bg-[#10B981]/20 border border-[#10B981]/30 font-sans text-xs text-[#10B981] font-medium transition disabled:opacity-50"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isSyncingNews ? "animate-spin" : ""}`} />
                <span>{isSyncingNews ? "Syncing Wire..." : "Sync Live News"}</span>
              </button>

              <button
                onClick={() => {
                  setEditingArticle({
                    id: "",
                    title: "",
                    summary: "",
                    url: "",
                    category: "LLMs",
                    sourceDomain: "editorial.wire",
                    relativeTime: "Just now",
                    utcTimestamp: new Date().toISOString(),
                    aiTakeaway: "",
                  });
                  setIsNewArticleModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white text-black hover:bg-zinc-200 text-xs font-medium transition shadow"
              >
                <Plus className="w-4 h-4" />
                <span>Post Article</span>
              </button>
            </div>
          </div>

          {/* News Table */}
          <div className="rounded-2xl bg-[#11131A] border border-white/[0.08] overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-sans text-xs">
                <thead className="bg-black/60 border-b border-white/[0.08] text-[#9AA0A6] uppercase text-[10px] font-mono tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Headline</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Domain</th>
                    <th className="py-3 px-4 text-center">Pin</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {newsArticles.map((art) => {
                    const isPinned = Boolean((art as any).isPinned);
                    return (
                      <tr key={art.id} className="hover:bg-white/[0.02] transition">
                        <td className="py-3.5 px-4 max-w-md">
                          <span className="font-medium text-sm text-white line-clamp-1 block">
                            {art.title}
                          </span>
                          <span className="text-[11px] text-[#9AA0A6] line-clamp-1 mt-0.5 block">
                            {art.aiTakeaway || art.summary}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-[#9AA0A6] font-mono">{art.category}</td>
                        <td className="py-3.5 px-4 text-[#9AA0A6] font-mono">{art.sourceDomain}</td>
                        <td className="py-3.5 px-4 text-center">
                          <button
                            onClick={() => handleTogglePin(art.id, isPinned)}
                            className={`p-1.5 rounded-lg border transition ${
                              isPinned
                                ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                                : "bg-transparent border-transparent text-[#9AA0A6] hover:text-white"
                            }`}
                            title={isPinned ? "Unpin story" : "Pin to top of wire"}
                          >
                            <Pin className="w-3.5 h-3.5" />
                          </button>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setEditingArticle({ ...art });
                                setIsNewArticleModalOpen(false);
                              }}
                              className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-zinc-300 hover:text-white"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteArticle(art.id, art.title)}
                              className="p-1.5 rounded-lg bg-rose-950/20 hover:bg-rose-950/40 text-rose-400 border border-rose-500/20"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* DRAWER FOR EDITING / ADDING AI TOOLS                     */}
      {/* ======================================================== */}
      {(editingTool !== null || isNewToolModalOpen) && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => {
              setEditingTool(null);
              setIsNewToolModalOpen(false);
            }}
          />

          <div className="relative w-full max-w-2xl bg-[#11131A] border-l border-white/[0.1] h-full overflow-y-auto p-6 sm:p-8 space-y-6 z-10 shadow-2xl animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <h3 className="font-heading font-medium text-lg text-white">
                {editingTool?.name ? `Edit: ${editingTool.name}` : "Add New AI System"}
              </h3>
              <button
                onClick={() => {
                  setEditingTool(null);
                  setIsNewToolModalOpen(false);
                }}
                className="p-1.5 rounded-lg text-[#9AA0A6] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {editingTool && (
              <form onSubmit={handleSaveTool} className="space-y-4 font-sans text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-mono text-[11px] text-[#9AA0A6] uppercase">Name</label>
                    <input
                      type="text"
                      value={editingTool.name}
                      onChange={(e) => setEditingTool({ ...editingTool, name: e.target.value })}
                      required
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/[0.08] text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono text-[11px] text-[#9AA0A6] uppercase">Slug</label>
                    <input
                      type="text"
                      value={editingTool.slug}
                      onChange={(e) => setEditingTool({ ...editingTool, slug: e.target.value })}
                      placeholder="e.g. google-stitch"
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/[0.08] text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-mono text-[11px] text-[#9AA0A6] uppercase">Company</label>
                    <input
                      type="text"
                      value={editingTool.company}
                      onChange={(e) => setEditingTool({ ...editingTool, company: e.target.value })}
                      required
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/[0.08] text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono text-[11px] text-[#9AA0A6] uppercase">Category</label>
                    <select
                      value={editingTool.category}
                      onChange={(e) => setEditingTool({ ...editingTool, category: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/[0.08] text-white"
                    >
                      {ALL_CATEGORIES.filter((c) => c !== "All Purpose").map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-mono text-[11px] text-[#9AA0A6] uppercase">Pricing Tier</label>
                    <select
                      value={editingTool.pricing}
                      onChange={(e) => setEditingTool({ ...editingTool, pricing: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/[0.08] text-white"
                    >
                      {ALL_PRICINGS.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono text-[11px] text-[#9AA0A6] uppercase">Official Website URL</label>
                    <input
                      type="url"
                      value={editingTool.officialUrl}
                      onChange={(e) => setEditingTool({ ...editingTool, officialUrl: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/[0.08] text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-[11px] text-[#9AA0A6] uppercase">Tagline / Short Summary</label>
                  <input
                    type="text"
                    value={editingTool.tagline}
                    onChange={(e) => setEditingTool({ ...editingTool, tagline: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/[0.08] text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-[11px] text-[#9AA0A6] uppercase">System Description</label>
                  <textarea
                    value={editingTool.description}
                    onChange={(e) => setEditingTool({ ...editingTool, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/[0.08] text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-[11px] text-[#9AA0A6] uppercase">
                    Verified Capabilities (Comma-Separated)
                  </label>
                  <input
                    type="text"
                    value={
                      Array.isArray(editingTool.keyFeatures)
                        ? editingTool.keyFeatures.join(", ")
                        : String(editingTool.keyFeatures || "")
                    }
                    onChange={(e) =>
                      setEditingTool({
                        ...editingTool,
                        keyFeatures: e.target.value
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean),
                      })
                    }
                    placeholder="e.g. 1M token context, Multimodal synthesis, Web canvas"
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/[0.08] text-white"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="toolFeatured"
                    checked={Boolean(editingTool.isFeatured)}
                    onChange={(e) => setEditingTool({ ...editingTool, isFeatured: e.target.checked })}
                    className="rounded bg-black border-white/15 text-[#6366F1]"
                  />
                  <label htmlFor="toolFeatured" className="font-mono text-xs text-white cursor-pointer">
                    Feature on Homepage Flagship Grid
                  </label>
                </div>

                <div className="pt-4 border-t border-white/[0.08] flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingTool(null);
                      setIsNewToolModalOpen(false);
                    }}
                    className="px-4 py-2 rounded-xl bg-white/[0.06] text-xs font-mono text-[#9AA0A6]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-white text-black font-medium text-xs shadow"
                  >
                    Save System Specs
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL FOR EDITING / ADDING NEWS ARTICLE                  */}
      {/* ======================================================== */}
      {(editingArticle !== null || isNewArticleModalOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => {
              setEditingArticle(null);
              setIsNewArticleModalOpen(false);
            }}
          />

          <div className="relative w-full max-w-xl bg-[#11131A] border border-white/[0.1] rounded-2xl p-6 sm:p-8 space-y-5 z-10 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <h3 className="font-heading font-medium text-lg text-white">
                {editingArticle?.title ? "Edit Article" : "Post News Article"}
              </h3>
              <button
                onClick={() => {
                  setEditingArticle(null);
                  setIsNewArticleModalOpen(false);
                }}
                className="p-1.5 rounded-lg text-[#9AA0A6] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {editingArticle && (
              <form onSubmit={handleSaveArticle} className="space-y-4 font-sans text-xs">
                <div className="space-y-1">
                  <label className="font-mono text-[11px] text-[#9AA0A6] uppercase">Headline Title</label>
                  <input
                    type="text"
                    value={editingArticle.title}
                    onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/[0.08] text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-mono text-[11px] text-[#9AA0A6] uppercase">Category</label>
                    <select
                      value={editingArticle.category}
                      onChange={(e) => setEditingArticle({ ...editingArticle, category: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/[0.08] text-white"
                    >
                      <option value="LLMs">LLMs</option>
                      <option value="Coding & Agents">Coding &amp; Agents</option>
                      <option value="Design & Media">Design &amp; Media</option>
                      <option value="Hardware & Chips">Hardware &amp; Chips</option>
                      <option value="Open Source">Open Source</option>
                      <option value="Enterprise & Policy">Enterprise &amp; Policy</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono text-[11px] text-[#9AA0A6] uppercase">Source Domain</label>
                    <input
                      type="text"
                      value={editingArticle.sourceDomain}
                      onChange={(e) => setEditingArticle({ ...editingArticle, sourceDomain: e.target.value })}
                      placeholder="e.g. blog.google"
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/[0.08] text-white font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-[11px] text-[#9AA0A6] uppercase">External Article URL</label>
                  <input
                    type="url"
                    value={editingArticle.url}
                    onChange={(e) => setEditingArticle({ ...editingArticle, url: e.target.value })}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/[0.08] text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-[11px] text-[#9AA0A6] uppercase">Summary</label>
                  <textarea
                    value={editingArticle.summary}
                    onChange={(e) => setEditingArticle({ ...editingArticle, summary: e.target.value })}
                    rows={2}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/[0.08] text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-[11px] text-[#9AA0A6] uppercase">Technical Takeaway</label>
                  <textarea
                    value={editingArticle.aiTakeaway || ""}
                    onChange={(e) => setEditingArticle({ ...editingArticle, aiTakeaway: e.target.value })}
                    rows={2}
                    placeholder="Enter technical & strategic takeaway..."
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/[0.08] text-white"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="articlePinned"
                    checked={Boolean((editingArticle as any).isPinned)}
                    onChange={(e) => setEditingArticle({ ...editingArticle, isPinned: e.target.checked } as any)}
                    className="rounded bg-black border-white/15 text-[#6366F1]"
                  />
                  <label htmlFor="articlePinned" className="font-mono text-xs text-white cursor-pointer">
                    Pin story to top of the Wire
                  </label>
                </div>

                <div className="pt-4 border-t border-white/[0.08] flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingArticle(null);
                      setIsNewArticleModalOpen(false);
                    }}
                    className="px-4 py-2 rounded-xl bg-white/[0.06] text-xs font-mono text-[#9AA0A6]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-white text-black font-medium text-xs shadow"
                  >
                    Save Article
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
