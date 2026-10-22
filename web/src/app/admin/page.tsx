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
  Layers
} from "lucide-react";
import { AIDirectoryItem, LiveNewsItem, DirectoryCategory, PricingType } from "@/lib/types";

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
  const [activeTab, setActiveTab] = useState<"key" | "directory" | "news" | "settings">("key");

  // Settings State
  const [maskedKey, setMaskedKey] = useState<string>("");
  const [newKeyInput, setNewKeyInput] = useState<string>("");
  const [headlineInput, setHeadlineInput] = useState<string>("");
  const [taglineInput, setTaglineInput] = useState<string>("");
  const [announcementActive, setAnnouncementActive] = useState<boolean>(true);
  const [announcementText, setAnnouncementText] = useState<string>("");

  // Key Test State
  const [isTestingKey, setIsTestingKey] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; latencyMs: number; model: string; error?: string } | null>(null);

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
          setHeadlineInput(data.settings.siteHeadline || "");
          setTaglineInput(data.settings.siteTagline || "");
          setAnnouncementActive(Boolean(data.settings.announcementActive));
          setAnnouncementText(data.settings.announcementText || "");
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
        showNotification(data.error || "Gemini key test failed", "error");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Network error testing key";
      setTestResult({ success: false, latencyMs: 0, model: "gemini-3.8-flash", error: msg });
      showNotification(msg, "error");
    } finally {
      setIsTestingKey(false);
    }
  };

  // Update Gemini Key
  const handleUpdateGeminiKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyInput.trim()) {
      showNotification("Please enter a valid Gemini API key", "error");
      return;
    }

    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ geminiApiKey: newKeyInput.trim() }),
      });

      const data = await res.json();
      if (res.ok && data?.success) {
        setMaskedKey(data.settings.geminiApiKeyMasked);
        setNewKeyInput("");
        showNotification("Gemini API key updated and propagated across Vercel!");
        handleTestKey(); // automatically run live test
      } else {
        showNotification(data?.error || "Failed to update Gemini key", "error");
      }
    } catch {
      showNotification("Failed to update Gemini key due to network error", "error");
    }
  };

  // Update Site Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteHeadline: headlineInput,
          siteTagline: taglineInput,
          announcementActive,
          announcementText,
        }),
      });

      const data = await res.json();
      if (res.ok && data?.success) {
        showNotification("Site branding & settings saved globally!");
      } else {
        showNotification(data?.error || "Failed to save settings", "error");
      }
    } catch {
      showNotification("Network error saving settings", "error");
    }
  };

  // Seed / Sync 45+ Tools
  const handleSeedTools = async () => {
    if (!confirm("Synchronize default 45+ verified AI systems into the database?")) return;
    setIsSeeding(true);

    try {
      const res = await fetch("/api/admin/seed", { method: "POST" });
      const data = await res.json();
      if (res.ok && data?.success) {
        showNotification(data.message || "45+ Tools synchronized!");
        loadAllData();
      } else {
        showNotification(data?.error || "Seeding failed", "error");
      }
    } catch {
      showNotification("Network error executing seed", "error");
    } finally {
      setIsSeeding(false);
    }
  };

  // Save / Edit Directory Item
  const handleSaveTool = async (e: React.FormEvent) => {
    e.preventDefault();
    const tool = editingTool;
    if (!tool || !tool.name || !tool.officialUrl) {
      showNotification("Tool Name and Official URL are required.", "error");
      return;
    }

    try {
      const res = await fetch("/api/admin/directory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tool),
      });

      const data = await res.json();
      if (res.ok && data?.success) {
        showNotification(`Saved "${tool.name}" successfully!`);
        setEditingTool(null);
        setIsNewToolModalOpen(false);
        loadAllData();
      } else {
        showNotification(data?.error || "Failed to save tool", "error");
      }
    } catch {
      showNotification("Network error saving tool", "error");
    }
  };

  // Delete Directory Item
  const handleDeleteTool = async (slug: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/directory?slug=${encodeURIComponent(slug)}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (res.ok && data?.success) {
        showNotification(`Deleted "${name}".`);
        loadAllData();
      } else {
        showNotification(data?.error || "Failed to delete tool", "error");
      }
    } catch {
      showNotification("Network error deleting tool", "error");
    }
  };

  // Sync Live News with Gemini
  const handleSyncNewsWithGemini = async () => {
    setIsSyncingNews(true);

    try {
      const res = await fetch("/api/admin/news/sync", { method: "POST" });
      const data = await res.json();
      if (res.ok && data?.success) {
        showNotification(data.message || "News synchronized with Gemini takeaways!");
        loadAllData();
      } else {
        showNotification(data?.error || "News sync failed", "error");
      }
    } catch {
      showNotification("Network error syncing news", "error");
    } finally {
      setIsSyncingNews(false);
    }
  };

  // Save / Edit News Article
  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    const article = editingArticle;
    if (!article || !article.title || !article.url || !article.summary) {
      showNotification("Title, URL, and summary are required.", "error");
      return;
    }

    try {
      const res = await fetch("/api/admin/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(article),
      });

      const data = await res.json();
      if (res.ok && data?.success) {
        showNotification(`Article "${article.title}" saved!`);
        setEditingArticle(null);
        setIsNewArticleModalOpen(false);
        loadAllData();
      } else {
        showNotification(data?.error || "Failed to save article", "error");
      }
    } catch {
      showNotification("Network error saving article", "error");
    }
  };

  // Delete News Article
  const handleDeleteArticle = async (id: string | number, title: string) => {
    if (!confirm(`Are you sure you want to delete this article: "${title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/news?id=${encodeURIComponent(String(id))}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (res.ok && data?.success) {
        showNotification("Article deleted.");
        loadAllData();
      } else {
        showNotification(data?.error || "Failed to delete article", "error");
      }
    } catch {
      showNotification("Network error deleting article", "error");
    }
  };

  // Toggle Article Pin Status
  const handleTogglePin = async (id: string | number, currentPin: boolean) => {
    try {
      const res = await fetch("/api/admin/news", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isPinned: currentPin }),
      });

      const data = await res.json();
      if (res.ok && data?.success) {
        showNotification(data.isPinned ? "Article pinned to top of wire." : "Article unpinned.");
        loadAllData();
      }
    } catch {
      showNotification("Network error updating pin status", "error");
    }
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center font-mono text-xs text-[#71717A]">
        Verifying Super Admin Authorization...
      </div>
    );
  }

  // Filtered directory items for admin table
  const filteredDirectory = directoryItems.filter((item) => {
    const matchCat =
      dirCategoryFilter === "All" || item.category === dirCategoryFilter;
    const matchQ =
      !dirSearch.trim() ||
      (item.name || "").toLowerCase().includes(dirSearch.toLowerCase()) ||
      (item.company || "").toLowerCase().includes(dirSearch.toLowerCase()) ||
      (item.tagline || "").toLowerCase().includes(dirSearch.toLowerCase());
    return matchCat && matchQ;
  });

  return (
    <div className="pt-28 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl border shadow-2xl font-mono text-xs flex items-center gap-2.5 animate-in slide-in-from-bottom-4 duration-150 ${
            notification.type === "success"
              ? "bg-[#050507] text-[#10B981] border-[#10B981]/30"
              : "bg-[#050507] text-rose-400 border-rose-500/30"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-[#10B981]" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Top Header & Telemetry Bar */}
      <div className="p-6 rounded-2xl bg-[#111318] border border-white/10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="space-y-1.5">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-full bg-[#f97316]/15 border border-[#f97316]/30 text-[#f97316] flex items-center justify-center font-bold font-mono text-sm">
              OP
            </span>
            <div>
              <h1 className="font-heading font-medium text-xl sm:text-2xl text-white flex items-center gap-2.5">
                <span>Super Admin Command Center</span>
                <span className="font-mono text-[11px] px-3 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold tracking-wider">
                  ROOT PRIVILEGES
                </span>
              </h1>
              <p className="font-sans text-xs text-[#9aa0a6] mt-0.5">
                Optimus Prime Live Telemetry &amp; Dynamic Entity Registry
              </p>
            </div>
          </div>
        </div>

        {/* Status / Quick Action Group */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Active Key Status Pill */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/60 border border-white/10 font-mono text-xs text-zinc-300">
            <span>🔑</span>
            <span className="text-[#9aa0a6]">Gemini Key:</span>
            <span className="text-emerald-400 font-semibold">{maskedKey || "AQ.Ab8...IWLQ"}</span>
          </div>

          {/* Test Latency Button */}
          <button
            onClick={() => handleTestKey()}
            disabled={isTestingKey}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#16181d] hover:bg-white/[0.08] border border-white/15 text-xs font-sans text-white transition-all disabled:opacity-50"
            title="Ping Gemini live"
          >
            <Sparkles className={`w-3.5 h-3.5 text-[#8ab4f8] ${isTestingKey ? "animate-spin" : ""}`} />
            <span>{isTestingKey ? "Testing..." : "⚡ Test Latency"}</span>
            {testResult && (
              <span
                className={`ml-1 px-2 py-0.5 rounded-full text-[10px] font-mono ${
                  testResult.success ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"
                }`}
              >
                {testResult.success ? `${testResult.latencyMs}ms` : "Error"}
              </span>
            )}
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#16181d] hover:bg-rose-950/30 border border-white/15 hover:border-rose-500/30 text-xs font-sans text-zinc-400 hover:text-rose-400 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>[→ Log Out</span>
          </button>
        </div>
      </div>

      {/* Primary 4-Tab Switcher (Pure Capsule Pills) */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab("key")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-medium transition-all shrink-0 ${
            activeTab === "key"
              ? "bg-white text-black shadow-md"
              : "text-[#9aa0a6] hover:text-white hover:bg-white/5"
          }`}
        >
          <Key className="w-3.5 h-3.5" />
          <span>🔑 Gemini API Key Controller</span>
        </button>

        <button
          onClick={() => setActiveTab("directory")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-medium transition-all shrink-0 ${
            activeTab === "directory"
              ? "bg-white text-black shadow-md"
              : "text-[#9aa0a6] hover:text-white hover:bg-white/5"
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>🗄️ AI Directory ({directoryItems.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("news")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-medium transition-all shrink-0 ${
            activeTab === "news"
              ? "bg-white text-black shadow-md"
              : "text-[#9aa0a6] hover:text-white hover:bg-white/5"
          }`}
        >
          <Newspaper className="w-3.5 h-3.5" />
          <span>📰 News Wire ({newsArticles.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("settings")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-medium transition-all shrink-0 ${
            activeTab === "settings"
              ? "bg-white text-black shadow-md"
              : "text-[#9aa0a6] hover:text-white hover:bg-white/5"
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>🎛️ Site Settings &amp; Branding</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: GEMINI API KEY CONTROLLER */}
      {/* ======================================================== */}
      {activeTab === "key" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-150">
          <div className="lg:col-span-2 p-8 rounded-2xl bg-[#111318] border border-white/10 space-y-6">
            <div className="space-y-1.5">
              <h2 className="font-heading font-medium text-xl sm:text-2xl text-white flex items-center gap-2">
                <span>🔑 Dynamic Gemini API Key Management</span>
              </h2>
              <p className="font-sans text-xs sm:text-sm text-[#9aa0a6] leading-relaxed">
                Update the active Google Gemini API Key on the fly. Key is securely persisted in Supabase and cached across Vercel serverless instances. Zero redeployment needed.
              </p>
            </div>

            {/* Active Key Status Box */}
            <div className="p-5 rounded-xl bg-black/60 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs">
              <div className="space-y-1">
                <span className="text-[#9aa0a6] text-[11px] uppercase tracking-wider block">
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
                  className="px-4 py-2 rounded-full bg-[#16181d] hover:bg-white/[0.08] border border-white/15 text-white font-sans text-xs font-medium transition-all flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#8ab4f8]" />
                  <span>✨ Verify Active Key</span>
                </button>
              </div>
            </div>

            {/* Update Form */}
            <form onSubmit={handleUpdateGeminiKey} className="space-y-4 pt-4 border-t border-white/[0.08]">
              <div className="space-y-2">
                <label className="block font-mono text-xs text-[#9aa0a6] uppercase tracking-wider">
                  UPDATE GEMINI API KEY:
                </label>
                <input
                  type="password"
                  value={newKeyInput}
                  onChange={(e) => setNewKeyInput(e.target.value)}
                  placeholder="Paste new Gemini API Key (AQ.Ab8... or AIzaSy...)"
                  className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 text-sm font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-[#8ab4f8] transition-all"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-white hover:bg-zinc-200 text-black font-sans text-xs font-medium transition-all shadow-md"
                >
                  Save &amp; Apply Globally
                </button>
                <button
                  type="button"
                  onClick={() => handleTestKey(newKeyInput)}
                  disabled={!newKeyInput.trim() || isTestingKey}
                  className="px-5 py-2.5 rounded-full bg-[#16181d] hover:bg-white/[0.08] border border-white/15 text-xs font-sans text-white transition-all disabled:opacity-40"
                >
                  Test This Input First
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Key Security & Diagnostics Panel */}
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-[#111318] border border-white/10 space-y-4 font-mono text-xs">
              <h3 className="text-white font-medium uppercase tracking-wider text-[11px] pb-3 border-b border-white/10">
                SECURITY &amp; ENCRYPTION STANDARD
              </h3>

              <div className="space-y-3 font-sans text-xs text-[#9aa0a6] leading-relaxed">
                <p>
                  <strong className="text-white">Server-Only Isolation:</strong> API keys are strictly retained on the server and never sent to client-side bundles or public endpoints.
                </p>
                <p>
                  <strong className="text-white">Cache Invalidation:</strong> Changing the key invokes <code className="font-mono text-[#8ab4f8]">revalidateTag(&apos;app-settings&apos;)</code> to instantly synchronize all Vercel Lambdas.
                </p>
              </div>
            </div>

            {testResult && (
              <div
                className={`p-6 rounded-2xl border font-mono text-xs space-y-2.5 ${
                  testResult.success
                    ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400"
                    : "bg-rose-500/5 border-rose-500/20 text-rose-400"
                }`}
              >
                <div className="flex items-center justify-between font-bold text-sm">
                  <span>{testResult.success ? "✓ Test Passed" : "✕ Test Failed"}</span>
                  <span>{testResult.latencyMs}ms</span>
                </div>
                <div className="text-[11px] text-[#9aa0a6]">
                  Target Model: <span className="text-white font-bold">{testResult.model}</span>
                </div>
                {testResult.error && (
                  <p className="text-rose-400 text-xs pt-1 border-t border-rose-500/20">
                    {testResult.error}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: AI DIRECTORY CRUD */}
      {/* ======================================================== */}
      {activeTab === "directory" && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="p-6 rounded-2xl bg-[#0D0D12] border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="font-heading font-bold text-xl text-[#FAFAFA]">
                AI Directory Systems Management
              </h2>
              <p className="font-sans text-xs text-[#A1A1AA]">
                Full CRUD control over {directoryItems.length} verified AI foundation models, IDEs, and agents.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleSeedTools}
                disabled={isSeeding}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#18181C] hover:bg-[#27272A] border border-white/10 font-mono text-xs text-[#FAFAFA] transition-editorial disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-[#10B981] ${isSeeding ? "animate-spin" : ""}`} />
                <span>{isSeeding ? "Syncing..." : "Sync Default 45+ to DB"}</span>
              </button>

              <button
                onClick={() => {
                  setEditingTool({
                    id: "",
                    slug: "",
                    name: "",
                    company: "Google",
                    category: "Coding & Autonomous Agents",
                    tagline: "",
                    description: "",
                    keyFeatures: ["", "", ""],
                    bestFor: "",
                    pricing: "Freemium",
                    officialUrl: "",
                    isFeatured: false,
                  });
                  setIsNewToolModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FAFAFA] hover:bg-white text-[#050507] font-mono text-xs font-bold transition-editorial"
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
              placeholder="Search tools by name, company, or capability..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-[#0D0D12] border border-white/10 text-sm font-sans text-[#FAFAFA] placeholder-[#52525B] focus:outline-none focus:border-[#F97316]"
            />
            <select
              value={dirCategoryFilter}
              onChange={(e) => setDirCategoryFilter(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl bg-[#0D0D12] border border-white/10 text-xs font-mono text-[#FAFAFA] focus:outline-none"
            >
              <option value="All">All Categories</option>
              {ALL_CATEGORIES.filter((c) => c !== "All Purpose").map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Table */}
          <div className="rounded-2xl bg-[#0D0D12] border border-white/10 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead className="bg-[#050507] border-b border-white/10 text-[#71717A] uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">System Name</th>
                    <th className="py-3 px-4">Company</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Pricing</th>
                    <th className="py-3 px-4 text-center">Featured</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredDirectory.map((tool) => (
                    <tr key={tool.slug} className="hover:bg-white/[0.02] transition-editorial">
                      <td className="py-3.5 px-4">
                        <div className="font-heading font-bold text-sm text-[#FAFAFA]">
                          {tool.name}
                        </div>
                        <div className="font-sans text-[11px] text-[#71717A] line-clamp-1">
                          {tool.tagline}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-[#A1A1AA]">{tool.company}</td>
                      <td className="py-3.5 px-4 text-[#F97316]">{tool.category}</td>
                      <td className="py-3.5 px-4 text-[#10B981] font-semibold">{tool.pricing}</td>
                      <td className="py-3.5 px-4 text-center">
                        {tool.isFeatured ? (
                          <span className="px-2 py-0.5 rounded-full bg-[#F97316]/10 text-[#F97316] text-[10px] font-semibold">
                            Featured
                          </span>
                        ) : (
                          <span className="text-[#52525B] text-[11px]">—</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setEditingTool({ ...tool });
                              setIsNewToolModalOpen(false);
                            }}
                            className="p-1.5 rounded-lg bg-[#18181C] hover:bg-[#27272A] text-[#A1A1AA] hover:text-[#FAFAFA] border border-white/10"
                            title="Edit Tool Specs"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteTool(tool.slug, tool.name)}
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
      {/* TAB 3: NEWS WIRE MANAGEMENT */}
      {/* ======================================================== */}
      {activeTab === "news" && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="p-6 rounded-2xl bg-[#0D0D12] border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="font-heading font-bold text-xl text-[#FAFAFA]">
                Daily AI News Wire Management
              </h2>
              <p className="font-sans text-xs text-[#A1A1AA]">
                Live feed ingestion from Hacker News &amp; Dev.to paired with Gemini 3.8 Flash summary synthesis.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleSyncNewsWithGemini}
                disabled={isSyncingNews}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#10B981]/10 hover:bg-[#10B981]/20 border border-[#10B981]/30 font-mono text-xs text-[#10B981] font-semibold transition-editorial disabled:opacity-50"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isSyncingNews ? "animate-spin" : ""}`} />
                <span>{isSyncingNews ? "Syncing Wire..." : "Sync Live AI News via Gemini"}</span>
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
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FAFAFA] hover:bg-white text-[#050507] font-mono text-xs font-bold transition-editorial"
              >
                <Plus className="w-4 h-4" />
                <span>Post Article</span>
              </button>
            </div>
          </div>

          {/* News Table */}
          <div className="rounded-2xl bg-[#0D0D12] border border-white/10 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead className="bg-[#050507] border-b border-white/10 text-[#71717A] uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Headline</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Domain</th>
                    <th className="py-3 px-4 text-center">Pin</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {newsArticles.map((art) => {
                    const isPinned = Boolean((art as any).isPinned);
                    return (
                      <tr key={art.id} className="hover:bg-white/[0.02] transition-editorial">
                        <td className="py-3.5 px-4 max-w-md">
                          <div className="font-heading font-bold text-sm text-[#FAFAFA] line-clamp-1">
                            {art.title}
                          </div>
                          {art.aiTakeaway ? (
                            <div className="font-sans text-[11px] text-[#F97316] line-clamp-1 mt-0.5">
                              Takeaway: {art.aiTakeaway}
                            </div>
                          ) : (
                            <div className="font-sans text-[11px] text-[#71717A] line-clamp-1 mt-0.5">
                              {art.summary}
                            </div>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-[#A1A1AA]">{art.category}</td>
                        <td className="py-3.5 px-4 text-[#71717A]">{art.sourceDomain}</td>
                        <td className="py-3.5 px-4 text-center">
                          <button
                            onClick={() => handleTogglePin(art.id, isPinned)}
                            className={`p-1.5 rounded-lg border transition-editorial ${
                              isPinned
                                ? "bg-[#F97316]/10 border-[#F97316]/30 text-[#F97316]"
                                : "bg-transparent border-transparent text-[#52525B] hover:text-[#FAFAFA]"
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
                              className="p-1.5 rounded-lg bg-[#18181C] hover:bg-[#27272A] text-[#A1A1AA] hover:text-[#FAFAFA] border border-white/10"
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
      {/* TAB 4: SITE SETTINGS & BRANDING */}
      {/* ======================================================== */}
      {activeTab === "settings" && (
        <div className="p-8 rounded-2xl bg-[#0D0D12] border border-white/10 space-y-6 max-w-3xl animate-in fade-in duration-150">
          <div className="space-y-1">
            <h2 className="font-heading font-bold text-xl text-[#FAFAFA]">
              Platform Settings &amp; Global Branding
            </h2>
            <p className="font-sans text-xs text-[#A1A1AA]">
              Configure platform display titles, hero metadata, and announcements across Optimus Prime.
            </p>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-5">
            <div className="space-y-1.5">
              <label className="block font-mono text-xs text-[#A1A1AA] uppercase tracking-wider">
                Hero Display Headline
              </label>
              <input
                type="text"
                value={headlineInput}
                onChange={(e) => setHeadlineInput(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#050507] border border-white/10 text-sm text-[#FAFAFA] font-sans focus:outline-none focus:border-[#F97316]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block font-mono text-xs text-[#A1A1AA] uppercase tracking-wider">
                Hero Sub-Copy / Tagline
              </label>
              <textarea
                value={taglineInput}
                onChange={(e) => setTaglineInput(e.target.value)}
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl bg-[#050507] border border-white/10 text-sm text-[#FAFAFA] font-sans focus:outline-none focus:border-[#F97316]"
              />
            </div>

            <div className="p-4 rounded-xl bg-[#050507] border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-[#FAFAFA] font-medium">
                  Announcement Banner
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={announcementActive}
                    onChange={(e) => setAnnouncementActive(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-[#27272A] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#10B981]"></div>
                </label>
              </div>

              <input
                type="text"
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                placeholder="Banner message..."
                className="w-full px-3.5 py-2 rounded-lg bg-[#0D0D12] border border-white/10 text-xs text-[#FAFAFA] font-sans focus:outline-none focus:border-[#10B981]"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#FAFAFA] hover:bg-white text-[#050507] font-mono text-xs font-bold transition-editorial shadow"
            >
              Save Site Settings
            </button>
          </form>
        </div>
      )}

      {/* ======================================================== */}
      {/* SLIDE-OVER DRAWER FOR EDITING / ADDING AI TOOLS */}
      {/* ======================================================== */}
      {(editingTool !== null || isNewToolModalOpen) && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-[#050507]/80 backdrop-blur-sm transition-opacity"
            onClick={() => {
              setEditingTool(null);
              setIsNewToolModalOpen(false);
            }}
          />

          <div className="relative w-full max-w-2xl bg-[#0D0D12] border-l border-white/10 h-full overflow-y-auto p-6 sm:p-8 space-y-6 z-10 shadow-2xl animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="font-heading font-bold text-lg text-[#FAFAFA]">
                {editingTool?.name ? `Edit: ${editingTool.name}` : "Add New AI System"}
              </h3>
              <button
                onClick={() => {
                  setEditingTool(null);
                  setIsNewToolModalOpen(false);
                }}
                className="p-1.5 rounded-lg text-[#71717A] hover:text-[#FAFAFA]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {editingTool && (
              <form onSubmit={handleSaveTool} className="space-y-4 font-sans text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-mono text-[11px] text-[#A1A1AA] uppercase">Name</label>
                    <input
                      type="text"
                      value={editingTool.name}
                      onChange={(e) => setEditingTool({ ...editingTool, name: e.target.value })}
                      required
                      className="w-full px-3 py-2 rounded-lg bg-[#050507] border border-white/10 text-[#FAFAFA] focus:outline-none focus:border-[#F97316]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono text-[11px] text-[#A1A1AA] uppercase">Company / Creator</label>
                    <input
                      type="text"
                      value={editingTool.company || ""}
                      onChange={(e) => setEditingTool({ ...editingTool, company: e.target.value })}
                      required
                      className="w-full px-3 py-2 rounded-lg bg-[#050507] border border-white/10 text-[#FAFAFA] focus:outline-none focus:border-[#F97316]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-mono text-[11px] text-[#A1A1AA] uppercase">Category (Purpose)</label>
                    <select
                      value={editingTool.category}
                      onChange={(e) => setEditingTool({ ...editingTool, category: e.target.value as DirectoryCategory })}
                      className="w-full px-3 py-2 rounded-lg bg-[#050507] border border-white/10 text-[#FAFAFA] focus:outline-none font-mono text-xs"
                    >
                      {ALL_CATEGORIES.filter((c) => c !== "All Purpose").map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono text-[11px] text-[#A1A1AA] uppercase">Pricing</label>
                    <select
                      value={editingTool.pricing}
                      onChange={(e) => setEditingTool({ ...editingTool, pricing: e.target.value as PricingType })}
                      className="w-full px-3 py-2 rounded-lg bg-[#050507] border border-white/10 text-[#FAFAFA] focus:outline-none font-mono text-xs"
                    >
                      {ALL_PRICINGS.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-[11px] text-[#A1A1AA] uppercase">Official URL</label>
                  <input
                    type="url"
                    value={editingTool.officialUrl}
                    onChange={(e) => setEditingTool({ ...editingTool, officialUrl: e.target.value })}
                    required
                    className="w-full px-3 py-2 rounded-lg bg-[#050507] border border-white/10 text-[#FAFAFA] focus:outline-none focus:border-[#F97316]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-[11px] text-[#A1A1AA] uppercase">1-Line Tagline</label>
                  <input
                    type="text"
                    value={editingTool.tagline}
                    onChange={(e) => setEditingTool({ ...editingTool, tagline: e.target.value })}
                    required
                    className="w-full px-3 py-2 rounded-lg bg-[#050507] border border-white/10 text-[#FAFAFA] focus:outline-none focus:border-[#F97316]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-[11px] text-[#A1A1AA] uppercase">Full Description</label>
                  <textarea
                    value={editingTool.description}
                    onChange={(e) => setEditingTool({ ...editingTool, description: e.target.value })}
                    rows={3}
                    required
                    className="w-full px-3 py-2 rounded-lg bg-[#050507] border border-white/10 text-[#FAFAFA] focus:outline-none focus:border-[#F97316]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-[11px] text-[#A1A1AA] uppercase">Key Features (One per line)</label>
                  <textarea
                    value={(editingTool.keyFeatures || []).join("\n")}
                    onChange={(e) =>
                      setEditingTool({
                        ...editingTool,
                        keyFeatures: e.target.value.split("\n").filter((f) => f.trim()),
                      })
                    }
                    rows={3}
                    placeholder="Enter key capabilities..."
                    className="w-full px-3 py-2 rounded-lg bg-[#050507] border border-white/10 text-[#FAFAFA] focus:outline-none font-mono text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-[11px] text-[#A1A1AA] uppercase">Best For (Target Persona)</label>
                  <input
                    type="text"
                    value={editingTool.bestFor}
                    onChange={(e) => setEditingTool({ ...editingTool, bestFor: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#050507] border border-white/10 text-[#FAFAFA] focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="toolFeatured"
                    checked={Boolean(editingTool.isFeatured)}
                    onChange={(e) => setEditingTool({ ...editingTool, isFeatured: e.target.checked })}
                    className="rounded bg-[#050507] border-white/10 text-[#F97316] focus:ring-0"
                  />
                  <label htmlFor="toolFeatured" className="font-mono text-xs text-[#FAFAFA] cursor-pointer">
                    Feature on Homepage Flagship Grid
                  </label>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingTool(null);
                      setIsNewToolModalOpen(false);
                    }}
                    className="px-4 py-2 rounded-lg bg-[#18181C] hover:bg-[#27272A] text-xs font-mono text-[#A1A1AA]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-[#FAFAFA] hover:bg-white text-[#050507] font-mono text-xs font-bold shadow"
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
      {/* MODAL FOR EDITING / ADDING NEWS ARTICLE */}
      {/* ======================================================== */}
      {(editingArticle !== null || isNewArticleModalOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-[#050507]/80 backdrop-blur-sm"
            onClick={() => {
              setEditingArticle(null);
              setIsNewArticleModalOpen(false);
            }}
          />

          <div className="relative w-full max-w-xl bg-[#0D0D12] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-5 z-10 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-heading font-bold text-lg text-[#FAFAFA]">
                {editingArticle?.title ? "Edit Article" : "Post News Article"}
              </h3>
              <button
                onClick={() => {
                  setEditingArticle(null);
                  setIsNewArticleModalOpen(false);
                }}
                className="p-1.5 rounded-lg text-[#71717A] hover:text-[#FAFAFA]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {editingArticle && (
              <form onSubmit={handleSaveArticle} className="space-y-4 font-sans text-xs">
                <div className="space-y-1">
                  <label className="font-mono text-[11px] text-[#A1A1AA] uppercase">Headline Title</label>
                  <input
                    type="text"
                    value={editingArticle.title}
                    onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
                    required
                    className="w-full px-3 py-2 rounded-lg bg-[#050507] border border-white/10 text-[#FAFAFA] focus:outline-none focus:border-[#F97316]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-mono text-[11px] text-[#A1A1AA] uppercase">Category</label>
                    <select
                      value={editingArticle.category}
                      onChange={(e) => setEditingArticle({ ...editingArticle, category: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-lg bg-[#050507] border border-white/10 text-[#FAFAFA] font-mono text-xs focus:outline-none"
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
                    <label className="font-mono text-[11px] text-[#A1A1AA] uppercase">Source Domain</label>
                    <input
                      type="text"
                      value={editingArticle.sourceDomain}
                      onChange={(e) => setEditingArticle({ ...editingArticle, sourceDomain: e.target.value })}
                      placeholder="e.g. blog.google"
                      className="w-full px-3 py-2 rounded-lg bg-[#050507] border border-white/10 text-[#FAFAFA] font-mono text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-[11px] text-[#A1A1AA] uppercase">External Article URL</label>
                  <input
                    type="url"
                    value={editingArticle.url}
                    onChange={(e) => setEditingArticle({ ...editingArticle, url: e.target.value })}
                    required
                    className="w-full px-3 py-2 rounded-lg bg-[#050507] border border-white/10 text-[#FAFAFA] focus:outline-none focus:border-[#F97316]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-[11px] text-[#A1A1AA] uppercase">Summary</label>
                  <textarea
                    value={editingArticle.summary}
                    onChange={(e) => setEditingArticle({ ...editingArticle, summary: e.target.value })}
                    rows={2}
                    required
                    className="w-full px-3 py-2 rounded-lg bg-[#050507] border border-white/10 text-[#FAFAFA] focus:outline-none focus:border-[#F97316]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-[11px] text-[#A1A1AA] uppercase">Gemini Technical Takeaway</label>
                  <textarea
                    value={editingArticle.aiTakeaway || ""}
                    onChange={(e) => setEditingArticle({ ...editingArticle, aiTakeaway: e.target.value })}
                    rows={2}
                    placeholder="Enter 2-sentence technical & strategic takeaway..."
                    className="w-full px-3 py-2 rounded-lg bg-[#050507] border border-white/10 text-[#FAFAFA] font-mono text-xs focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="articlePinned"
                    checked={Boolean((editingArticle as any).isPinned)}
                    onChange={(e) => setEditingArticle({ ...editingArticle, isPinned: e.target.checked } as any)}
                    className="rounded bg-[#050507] border-white/10 text-[#F97316] focus:ring-0"
                  />
                  <label htmlFor="articlePinned" className="font-mono text-xs text-[#FAFAFA] cursor-pointer">
                    Pin story to the top of the Wire
                  </label>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingArticle(null);
                      setIsNewArticleModalOpen(false);
                    }}
                    className="px-4 py-2 rounded-lg bg-[#18181C] hover:bg-[#27272A] text-xs font-mono text-[#A1A1AA]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-[#FAFAFA] hover:bg-white text-[#050507] font-mono text-xs font-bold shadow"
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
