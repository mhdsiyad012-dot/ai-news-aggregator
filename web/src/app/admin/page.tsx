"use client";

import React, { useState, useEffect, useRef } from "react";
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
  ChevronRight,
  Upload,
  Lock,
  Cpu,
  Zap,
  Terminal,
  Activity
} from "lucide-react";
import { AIDirectoryItem, LiveNewsItem, DirectoryCategory, PricingType } from "@/lib/types";
import OptimusLogo, { OptimusLogoIcon } from "@/components/OptimusLogo";
import ThemeToggle from "@/components/ThemeToggle";

const ALL_CATEGORIES: DirectoryCategory[] = [
  "Conversational & Reasoning LLMs",
  "Coding & Autonomous Agents",
  "Video & Image Editing AI",
  "Audio & Speech AI",
  "UI/UX & Product Design AI",
  "Research & Search Engines",
  "Workflow & Enterprise Automation",
];

const ALL_PRICINGS: PricingType[] = ["Free", "Freemium", "Paid"];

export default function SuperAdminPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // 4 Flagship Tabs
  const [activeTab, setActiveTab] = useState<"branding" | "security" | "sync" | "directory">("branding");

  // Notifications
  const [notification, setNotification] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showNotification = (msg: string, type: "success" | "error" = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4500);
  };

  // 1. Branding & Logo Studio State
  const [siteName, setSiteName] = useState<string>("Optimus Prime");
  const [siteLogoMode, setSiteLogoMode] = useState<"preset" | "image_url" | "custom_svg" | "upload">("preset");
  const [siteLogoPreset, setSiteLogoPreset] = useState<"aurora" | "deepmind" | "prism" | "spark" | "neural" | "minimal">("aurora");
  const [siteLogoCustom, setSiteLogoCustom] = useState<string>("");
  const [headlineInput, setHeadlineInput] = useState<string>("");
  const [taglineInput, setTaglineInput] = useState<string>("");
  const [heroBadgeText, setHeroBadgeText] = useState<string>("");
  const [announcementActive, setAnnouncementActive] = useState<boolean>(false);
  const [announcementText, setAnnouncementText] = useState<string>("");
  const [announcementLink, setAnnouncementLink] = useState<string>("/models");
  const [isSavingBranding, setIsSavingBranding] = useState(false);

  // 2. Security & Password Manager State
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [newStealthKey, setNewStealthKey] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSavingSecurity, setIsSavingSecurity] = useState(false);

  // 3. 24/7 Live Sync & Ingest State
  const [geminiApiKeyInput, setGeminiApiKeyInput] = useState("");
  const [geminiApiKeysPool, setGeminiApiKeysPool] = useState("");
  const [groqApiKeysPool, setGroqApiKeysPool] = useState("");
  const [openrouterApiKeyInput, setOpenrouterApiKeyInput] = useState("");
  const [maskedKey, setMaskedKey] = useState("");
  const [isTestingKey, setIsTestingKey] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    latencyMs: number;
    model: string;
    error?: string;
  } | null>(null);
  const [isSavingKeys, setIsSavingKeys] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  // Quick Ingest State
  const [quickName, setQuickName] = useState("");
  const [quickCompany, setQuickCompany] = useState("");
  const [quickUrl, setQuickUrl] = useState("");
  const [quickCategory, setQuickCategory] = useState<DirectoryCategory>("Conversational & Reasoning LLMs");
  const [quickTagline, setQuickTagline] = useState("");
  const [isQuickIngesting, setIsQuickIngesting] = useState(false);

  // 4. Directory & News State
  const [directoryItems, setDirectoryItems] = useState<AIDirectoryItem[]>([]);
  const [dirSearch, setDirSearch] = useState("");
  const [dirCategoryFilter, setDirCategoryFilter] = useState<string>("All");
  const [newsArticles, setNewsArticles] = useState<LiveNewsItem[]>([]);
  const [newsSearch, setNewsSearch] = useState("");
  const [editingTool, setEditingTool] = useState<AIDirectoryItem | null>(null);
  const [isNewToolModalOpen, setIsNewToolModalOpen] = useState(false);

  // Initial Auth Check
  useEffect(() => {
    async function verifyAuth() {
      try {
        const res = await fetch("/api/admin/auth");
        const data = await res.json();
        if (data.authenticated) {
          setIsAuthenticated(true);
          loadAllData();
        } else {
          setIsAuthenticated(false);
          router.push("/admin/login");
        }
      } catch {
        setIsAuthenticated(false);
        router.push("/admin/login");
      }
    }
    verifyAuth();
  }, [router]);

  const loadAllData = async () => {
    // 1. Settings
    try {
      const res = await fetch("/api/admin/settings");
      if (res.ok) {
        const data = await res.json();
        if (data?.settings) {
          setMaskedKey(data.settings.geminiApiKeyMasked || "");
          setSiteName(data.settings.siteName || "Optimus Prime");
          setSiteLogoMode(data.settings.siteLogoMode || "preset");
          setSiteLogoPreset(data.settings.siteLogoPreset || "aurora");
          setSiteLogoCustom(data.settings.siteLogoCustom || "");
          setHeadlineInput(data.settings.siteHeadline || "");
          setTaglineInput(data.settings.siteTagline || "");
          setHeroBadgeText(data.settings.heroBadgeText || "");
          setAnnouncementActive(Boolean(data.settings.announcementActive));
          setAnnouncementText(data.settings.announcementText || "");
          setAnnouncementLink(data.settings.announcementLink || "/models");
        }
      }
    } catch (err) {
      console.warn("Failed loading settings:", err);
    }

    // 2. Directory
    try {
      const res = await fetch("/api/admin/directory");
      if (res.ok) {
        const data = await res.json();
        if (data?.items) setDirectoryItems(data.items);
      }
    } catch (err) {
      console.warn("Failed loading directory:", err);
    }

    // 3. News
    try {
      const res = await fetch("/api/admin/news");
      if (res.ok) {
        const data = await res.json();
        if (data?.articles) setNewsArticles(data.articles);
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

  // Device File Upload for Logo
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showNotification("File size exceeds 2MB limit. Please choose an SVG or optimized PNG.", "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setSiteLogoMode("upload");
      setSiteLogoCustom(base64);
      showNotification("Logo file uploaded from device! Click 'Save Branding & Identity' to publish live.");
    };
    reader.readAsDataURL(file);
  };

  // Save Branding & Identity
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
          announcementActive,
          announcementText,
          announcementLink,
        }),
      });

      const data = await res.json();
      if (data.success) {
        showNotification("Branding, custom logo, and identity published across all live instances!");
      } else {
        showNotification(data.error || "Failed to update branding settings.", "error");
      }
    } catch {
      showNotification("Failed to update branding settings.", "error");
    } finally {
      setIsSavingBranding(false);
    }
  };

  // Save Security & Live Password
  const handleSaveSecurity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminPassword && !newStealthKey) {
      showNotification("Please enter a new password or stealth unlock key.", "error");
      return;
    }

    setIsSavingSecurity(true);
    try {
      const res = await fetch("/api/admin/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          newPassword: newAdminPassword || undefined,
          newUnlockKey: newStealthKey || undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        showNotification(data.message);
        setNewAdminPassword("");
        setNewStealthKey("");
      } else {
        showNotification(data.error || "Failed to update credentials", "error");
      }
    } catch {
      showNotification("Failed to update credentials", "error");
    } finally {
      setIsSavingSecurity(false);
    }
  };

  // Test Gemini Key Latency
  const handleTestKey = async () => {
    setIsTestingKey(true);
    setTestResult(null);

    try {
      const res = await fetch("/api/admin/test-key", { method: "POST" });
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

  // Save Multi-LLM Keys
  const handleSaveKeys = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingKeys(true);

    try {
      const res = await fetch("/api/admin/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_keys",
          geminiApiKeys: geminiApiKeysPool || undefined,
          groqApiKeys: groqApiKeysPool || undefined,
          openrouterApiKey: openrouterApiKeyInput || undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        showNotification(data.message);
        setGeminiApiKeysPool("");
        setGroqApiKeysPool("");
        setOpenrouterApiKeyInput("");
        loadAllData();
      } else {
        showNotification(data.error || "Failed to update API keys", "error");
      }
    } catch {
      showNotification("Failed to update API keys", "error");
    } finally {
      setIsSavingKeys(false);
    }
  };

  // Clean Reset Catalog (Seeds verified 2026 dataset)
  const handleResetCatalog = async () => {
    if (!confirm("Confirm Hard Reset: This will wipe stale data and seed the verified 2026 AI catalog.")) return;
    setIsSeeding(true);

    try {
      const res = await fetch("/api/admin/reset-catalog", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        showNotification(data.message);
        loadAllData();
      } else {
        showNotification(data.error || "Reset failed", "error");
      }
    } catch {
      showNotification("Failed to execute database reset", "error");
    } finally {
      setIsSeeding(false);
    }
  };

  // Quick Ingest Tool
  const handleQuickIngest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickName.trim() || !quickUrl.trim()) {
      showNotification("Name and Official URL are required.", "error");
      return;
    }

    setIsQuickIngesting(true);
    try {
      const res = await fetch("/api/admin/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "quick_ingest",
          quickToolName: quickName,
          quickToolUrl: quickUrl,
          company: quickCompany || "Independent",
          category: quickCategory,
          tagline: quickTagline,
          isFeatured: true,
        }),
      });

      const data = await res.json();
      if (data.success) {
        showNotification(data.message);
        setQuickName("");
        setQuickCompany("");
        setQuickUrl("");
        setQuickTagline("");
        loadAllData();
      } else {
        showNotification(data.error || "Quick ingest failed", "error");
      }
    } catch {
      showNotification("Quick ingest failed", "error");
    } finally {
      setIsQuickIngesting(false);
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
        showNotification(data.error || "Failed to delete tool", "error");
      }
    } catch {
      showNotification("Failed to delete tool", "error");
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
        showNotification("Article removed from news wire.");
        loadAllData();
      } else {
        showNotification(data.error || "Failed to delete article", "error");
      }
    } catch {
      showNotification("Failed to delete article", "error");
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
      showNotification("Failed to update pin status", "error");
    }
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#FFFFFF] dark:bg-[#060608] flex items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-[#5F6368] dark:text-[#8E9196] font-sans">
          <div className="w-5 h-5 border-2 border-[#4285F4] border-t-transparent rounded-full animate-spin" />
          <span>Authenticating Super Admin session...</span>
        </div>
      </div>
    );
  }

  const filteredTools = directoryItems.filter((tool) => {
    const matchQuery =
      (tool.name || "").toLowerCase().includes(dirSearch.toLowerCase()) ||
      (tool.company || "").toLowerCase().includes(dirSearch.toLowerCase());
    const matchCat = dirCategoryFilter === "All" || tool.category === dirCategoryFilter;
    return matchQuery && matchCat;
  });

  const filteredNews = newsArticles.filter((art) =>
    (art.title || "").toLowerCase().includes(newsSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FFFFFF] dark:bg-[#060608] text-[#1F1F1F] dark:text-[#E3E3E3] font-sans selection:bg-[#4285F4]/20 selection:text-[#4285F4]">
      {/* Super Admin Top Header */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#060608]/90 backdrop-blur-md border-b border-black/[0.06] dark:border-white/[0.08] px-6 lg:px-12 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <OptimusLogo
            size={32}
            showWordmark={true}
            brandName={siteName}
            preset={siteLogoPreset}
            customLogoUrl={siteLogoMode === "upload" || siteLogoMode === "image_url" ? siteLogoCustom : undefined}
            customSvgCode={siteLogoMode === "custom_svg" ? siteLogoCustom : undefined}
            href="/"
          />
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#4285F4]/10 text-[#4285F4] border border-[#4285F4]/20">
            <Shield className="w-3 h-3" />
            Super Admin Console
          </span>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/"
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-[#5F6368] dark:text-[#8E9196] hover:text-[#1F1F1F] dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition"
          >
            <span>Live Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-500/10 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Floating Notifications */}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-5 py-3 rounded-2xl shadow-xl text-sm font-medium backdrop-blur-md border animate-in slide-in-from-bottom-3 ${
            notification.type === "success"
              ? "bg-white/95 dark:bg-[#131314]/95 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
              : "bg-white/95 dark:bg-[#131314]/95 text-red-600 dark:text-red-400 border-red-500/20"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{notification.msg}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="max-w-[1380px] mx-auto px-6 lg:px-10 py-8">
        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-2 border-b border-black/[0.06] dark:border-white/[0.08] pb-4 mb-8 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("branding")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition shrink-0 flex items-center gap-2 ${
              activeTab === "branding"
                ? "bg-[#4285F4] text-white shadow-sm"
                : "text-[#5F6368] dark:text-[#8E9196] hover:text-[#1F1F1F] dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>Logo & Brand Studio</span>
          </button>

          <button
            onClick={() => setActiveTab("security")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition shrink-0 flex items-center gap-2 ${
              activeTab === "security"
                ? "bg-[#4285F4] text-white shadow-sm"
                : "text-[#5F6368] dark:text-[#8E9196] hover:text-[#1F1F1F] dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Security & Passwords</span>
          </button>

          <button
            onClick={() => setActiveTab("sync")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition shrink-0 flex items-center gap-2 ${
              activeTab === "sync"
                ? "bg-[#4285F4] text-white shadow-sm"
                : "text-[#5F6368] dark:text-[#8E9196] hover:text-[#1F1F1F] dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>24/7 Live Sync & Ingest</span>
          </button>

          <button
            onClick={() => setActiveTab("directory")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition shrink-0 flex items-center gap-2 ${
              activeTab === "directory"
                ? "bg-[#4285F4] text-white shadow-sm"
                : "text-[#5F6368] dark:text-[#8E9196] hover:text-[#1F1F1F] dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Directory & News Wire</span>
          </button>
        </div>

        {/* =====================================================================
            TAB 1: LOGO & BRAND STUDIO
        ===================================================================== */}
        {activeTab === "branding" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in-50">
            {/* Form Column */}
            <div className="lg:col-span-7 space-y-6">
              <form onSubmit={handleSaveBranding} className="space-y-6">
                {/* Logo Customization Card */}
                <div className="p-7 rounded-3xl bg-[#F0F4F9] dark:bg-[#131314] border border-black/[0.06] dark:border-white/[0.08] shadow-sm space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold tracking-tight text-[#1F1F1F] dark:text-white">
                        Logo & Visual Identity
                      </h2>
                      <p className="text-xs text-[#5F6368] dark:text-[#8E9196] mt-0.5">
                        Super Admin can change anything: upload any file from device, paste URL/SVG, or select Google presets.
                      </p>
                    </div>
                  </div>

                  {/* Mode Selector */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: "preset", label: "Presets", icon: Sparkles },
                      { id: "upload", label: "File Upload", icon: Upload },
                      { id: "image_url", label: "Image URL", icon: Globe },
                      { id: "custom_svg", label: "Raw SVG", icon: Terminal },
                    ].map((mode) => (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => setSiteLogoMode(mode.id as any)}
                        className={`p-3 rounded-2xl border text-xs font-medium flex flex-col items-center gap-1.5 transition ${
                          siteLogoMode === mode.id
                            ? "bg-[#4285F4]/10 border-[#4285F4] text-[#4285F4]"
                            : "bg-white dark:bg-[#1A1D24] border-black/[0.06] dark:border-white/[0.08] text-[#5F6368] dark:text-[#8E9196] hover:text-[#1F1F1F] dark:hover:text-white"
                        }`}
                      >
                        <mode.icon className="w-4 h-4" />
                        <span>{mode.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Mode 1: Presets */}
                  {siteLogoMode === "preset" && (
                    <div className="space-y-3">
                      <label className="text-xs font-semibold text-[#5F6368] dark:text-[#8E9196]">
                        Select Vector Preset
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {[
                          { id: "aurora", name: "Gemini Aurora", desc: "Google Tri-Color Flow" },
                          { id: "deepmind", name: "DeepMind", desc: "Geometric Spark" },
                          { id: "prism", name: "Hex Prism", desc: "Interlocking Neural" },
                          { id: "spark", name: "Cosmic Spark", desc: "4-Point Flare" },
                          { id: "neural", name: "Synapse", desc: "Graph Network" },
                          { id: "minimal", name: "Minimal", desc: "Clean Monogram" },
                        ].map((p) => (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => setSiteLogoPreset(p.id as any)}
                            className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition ${
                              siteLogoPreset === p.id
                                ? "bg-white dark:bg-[#1E2028] border-[#4285F4] ring-2 ring-[#4285F4]/20"
                                : "bg-white dark:bg-[#1A1D24] border-black/[0.06] dark:border-white/[0.08] hover:border-black/20 dark:hover:border-white/20"
                            }`}
                          >
                            <OptimusLogoIcon preset={p.id as any} size={28} />
                            <div>
                              <div className="text-xs font-semibold text-[#1F1F1F] dark:text-white">{p.name}</div>
                              <div className="text-[10px] text-[#5F6368] dark:text-[#8E9196]">{p.desc}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Mode 2: Device File Upload */}
                  {siteLogoMode === "upload" && (
                    <div className="space-y-3">
                      <label className="text-xs font-semibold text-[#5F6368] dark:text-[#8E9196]">
                        Upload Logo File from Device (.png, .svg, .webp)
                      </label>
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/png,image/svg+xml,image/jpeg,image/webp"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="p-6 rounded-2xl border-2 border-dashed border-black/15 dark:border-white/15 bg-white dark:bg-[#1A1D24] hover:bg-black/[0.02] dark:hover:bg-white/[0.02] cursor-pointer flex flex-col items-center justify-center gap-2 transition"
                      >
                        <Upload className="w-6 h-6 text-[#4285F4]" />
                        <span className="text-xs font-medium text-[#1F1F1F] dark:text-white">
                          Click to browse image from your computer
                        </span>
                        <span className="text-[10px] text-[#5F6368] dark:text-[#8E9196]">
                          Supports PNG, SVG, WebP up to 2MB (Saved as Base64 Data URI)
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Mode 3: Image URL */}
                  {siteLogoMode === "image_url" && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#5F6368] dark:text-[#8E9196]">
                        Custom Image or CDN URL
                      </label>
                      <input
                        type="url"
                        value={siteLogoCustom}
                        onChange={(e) => setSiteLogoCustom(e.target.value)}
                        placeholder="https://example.com/logo.png"
                        className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-[#1A1D24] border border-black/[0.08] dark:border-white/[0.08] text-xs focus:outline-none focus:border-[#4285F4]"
                      />
                    </div>
                  )}

                  {/* Mode 4: Custom SVG Code */}
                  {siteLogoMode === "custom_svg" && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#5F6368] dark:text-[#8E9196]">
                        Paste Raw SVG Code
                      </label>
                      <textarea
                        value={siteLogoCustom}
                        onChange={(e) => setSiteLogoCustom(e.target.value)}
                        placeholder="<svg viewBox='0 0 64 64' ...>...</svg>"
                        rows={4}
                        className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-[#1A1D24] border border-black/[0.08] dark:border-white/[0.08] font-mono text-xs focus:outline-none focus:border-[#4285F4]"
                      />
                    </div>
                  )}
                </div>

                {/* Identity & Content Card */}
                <div className="p-7 rounded-3xl bg-[#F0F4F9] dark:bg-[#131314] border border-black/[0.06] dark:border-white/[0.08] shadow-sm space-y-4">
                  <h2 className="text-lg font-semibold tracking-tight text-[#1F1F1F] dark:text-white">
                    Site Identity & Headlines
                  </h2>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#5F6368] dark:text-[#8E9196]">Brand Name</label>
                    <input
                      type="text"
                      value={siteName}
                      onChange={(e) => setSiteName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-[#1A1D24] border border-black/[0.08] dark:border-white/[0.08] text-xs focus:outline-none focus:border-[#4285F4]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#5F6368] dark:text-[#8E9196]">Hero Subtitle / Tagline</label>
                    <textarea
                      value={taglineInput}
                      onChange={(e) => setTaglineInput(e.target.value)}
                      rows={2}
                      className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-[#1A1D24] border border-black/[0.08] dark:border-white/[0.08] text-xs focus:outline-none focus:border-[#4285F4]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#5F6368] dark:text-[#8E9196]">Hero Pill Badge Text</label>
                    <input
                      type="text"
                      value={heroBadgeText}
                      onChange={(e) => setHeroBadgeText(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-[#1A1D24] border border-black/[0.08] dark:border-white/[0.08] text-xs focus:outline-none focus:border-[#4285F4]"
                    />
                  </div>

                  {/* Announcement Banner */}
                  <div className="pt-2 border-t border-black/[0.06] dark:border-white/[0.08] space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-[#1F1F1F] dark:text-white">
                        Global Announcement Top Banner
                      </label>
                      <button
                        type="button"
                        onClick={() => setAnnouncementActive(!announcementActive)}
                        className={`w-11 h-6 rounded-full transition relative ${
                          announcementActive ? "bg-[#4285F4]" : "bg-black/20 dark:bg-white/20"
                        }`}
                      >
                        <span
                          className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                            announcementActive ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>

                    {announcementActive && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={announcementText}
                          onChange={(e) => setAnnouncementText(e.target.value)}
                          placeholder="Banner announcement message"
                          className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-[#1A1D24] border border-black/[0.08] dark:border-white/[0.08] text-xs focus:outline-none focus:border-[#4285F4]"
                        />
                        <input
                          type="text"
                          value={announcementLink}
                          onChange={(e) => setAnnouncementLink(e.target.value)}
                          placeholder="/models or /news"
                          className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-[#1A1D24] border border-black/[0.08] dark:border-white/[0.08] text-xs focus:outline-none focus:border-[#4285F4]"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSavingBranding}
                  className="w-full py-3.5 rounded-2xl bg-[#4285F4] hover:bg-[#3367D6] text-white text-sm font-medium shadow-md transition disabled:opacity-50"
                >
                  {isSavingBranding ? "Publishing live..." : "Save Branding & Identity Live"}
                </button>
              </form>
            </div>

            {/* Live Preview Column */}
            <div className="lg:col-span-5 space-y-6">
              <div className="sticky top-24 p-7 rounded-3xl bg-[#F0F4F9] dark:bg-[#131314] border border-black/[0.06] dark:border-white/[0.08] shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-[#1F1F1F] dark:text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#4285F4]" />
                    <span>Real-Time Live Preview</span>
                  </h3>
                  <span className="text-[10px] text-[#5F6368] dark:text-[#8E9196] uppercase font-mono">Dynamic</span>
                </div>

                {/* Navbar Preview */}
                <div className="p-4 rounded-2xl bg-white dark:bg-[#060608] border border-black/[0.06] dark:border-white/[0.08] space-y-3">
                  <div className="text-[10px] text-[#5F6368] dark:text-[#8E9196]">Header Branding</div>
                  <OptimusLogo
                    size={32}
                    showWordmark={true}
                    brandName={siteName}
                    preset={siteLogoPreset}
                    customLogoUrl={siteLogoMode === "upload" || siteLogoMode === "image_url" ? siteLogoCustom : undefined}
                    customSvgCode={siteLogoMode === "custom_svg" ? siteLogoCustom : undefined}
                  />
                </div>

                {/* Hero Preview */}
                <div className="p-5 rounded-2xl bg-white dark:bg-[#060608] border border-black/[0.06] dark:border-white/[0.08] space-y-3">
                  <div className="text-[10px] text-[#5F6368] dark:text-[#8E9196]">Hero Badge & Subtitle</div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-[#4285F4]/10 text-[#4285F4] border border-[#4285F4]/20">
                    <span>{heroBadgeText || "Neural Expressive Index"}</span>
                  </div>
                  <p className="text-xs text-[#5F6368] dark:text-[#8E9196] leading-relaxed">
                    {taglineInput || "Frontier intelligence platform tracking real-time models and verified ecosystems."}
                  </p>
                </div>

                {/* Announcement Banner Preview */}
                {announcementActive && announcementText && (
                  <div className="p-3 rounded-xl bg-gradient-to-r from-[#4285F4]/20 via-[#9B72CB]/20 to-[#D96570]/20 border border-[#4285F4]/30 text-xs text-center">
                    <span className="font-medium text-[#1F1F1F] dark:text-white">{announcementText}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 2: SECURITY & PASSWORDS
        ===================================================================== */}
        {activeTab === "security" && (
          <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in-50">
            <div className="p-8 rounded-3xl bg-[#F0F4F9] dark:bg-[#131314] border border-black/[0.06] dark:border-white/[0.08] shadow-sm space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#4285F4]/10 text-[#4285F4] flex items-center justify-center">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-[#1F1F1F] dark:text-white">
                    Super Admin Password & Stealth Key
                  </h2>
                  <p className="text-xs text-[#5F6368] dark:text-[#8E9196] mt-0.5">
                    Update credentials directly in database. Changes take effect instantly without restarting servers or redeploying.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSaveSecurity} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#5F6368] dark:text-[#8E9196]">
                    New Super Admin Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={newAdminPassword}
                      onChange={(e) => setNewAdminPassword(e.target.value)}
                      placeholder="Leave blank to keep current password"
                      className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-[#1A1D24] border border-black/[0.08] dark:border-white/[0.08] text-xs focus:outline-none focus:border-[#4285F4]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-[#5F6368] dark:text-[#8E9196] hover:text-[#1F1F1F] dark:hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#5F6368] dark:text-[#8E9196]">
                    Stealth Unlock Key (Query Parameter)
                  </label>
                  <input
                    type="text"
                    value={newStealthKey}
                    onChange={(e) => setNewStealthKey(e.target.value)}
                    placeholder="e.g. optimus2026 (default: optimus2026)"
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-[#1A1D24] border border-black/[0.08] dark:border-white/[0.08] text-xs focus:outline-none focus:border-[#4285F4]"
                  />
                  <p className="text-[11px] text-[#5F6368] dark:text-[#8E9196]">
                    On public Vercel, visiting <code>/admin</code> returns a 404 page. Visiting{" "}
                    <code>/admin?unlock_key=&lt;key&gt;</code> sets an authorized cookie and opens the panel.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSavingSecurity}
                  className="w-full py-3.5 rounded-2xl bg-[#4285F4] hover:bg-[#3367D6] text-white text-sm font-medium shadow-md transition disabled:opacity-50"
                >
                  {isSavingSecurity ? "Saving credentials..." : "Update Password & Stealth Key"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 3: 24/7 LIVE SYNC & INGEST
        ===================================================================== */}
        {activeTab === "sync" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in-50">
            {/* Multi-LLM API Keys */}
            <div className="lg:col-span-7 space-y-6">
              <div className="p-7 rounded-3xl bg-[#F0F4F9] dark:bg-[#131314] border border-black/[0.06] dark:border-white/[0.08] shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-[#1F1F1F] dark:text-white">
                        Multi-LLM Autonomous Keys
                      </h2>
                      <p className="text-xs text-[#5F6368] dark:text-[#8E9196] mt-0.5">
                        Keys are rotated autonomously by ToolsAI Manager & GitHub Actions for 24/7 telemetry.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleTestKey}
                    disabled={isTestingKey}
                    className="px-3 py-1.5 rounded-xl bg-black/[0.04] dark:bg-white/[0.06] hover:bg-[#4285F4]/10 hover:text-[#4285F4] text-xs font-medium transition"
                  >
                    {isTestingKey ? "Testing..." : "Test Latency"}
                  </button>
                </div>

                {testResult && (
                  <div
                    className={`p-3.5 rounded-2xl border text-xs flex items-center gap-2.5 ${
                      testResult.success
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                        : "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"
                    }`}
                  >
                    {testResult.success ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                    <span>
                      {testResult.success
                        ? `Connected! Latency: ${testResult.latencyMs}ms (${testResult.model})`
                        : testResult.error}
                    </span>
                  </div>
                )}

                <form onSubmit={handleSaveKeys} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#5F6368] dark:text-[#8E9196]">
                      Google Gemini API Key Pool (Comma-separated)
                    </label>
                    <textarea
                      value={geminiApiKeysPool}
                      onChange={(e) => setGeminiApiKeysPool(e.target.value)}
                      placeholder="AIzaSy... , AIzaSy..."
                      rows={2}
                      className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-[#1A1D24] border border-black/[0.08] dark:border-white/[0.08] text-xs font-mono focus:outline-none focus:border-[#4285F4]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#5F6368] dark:text-[#8E9196]">
                      Groq API Keys Pool (Comma-separated)
                    </label>
                    <input
                      type="text"
                      value={groqApiKeysPool}
                      onChange={(e) => setGroqApiKeysPool(e.target.value)}
                      placeholder="gsk_..."
                      className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-[#1A1D24] border border-black/[0.08] dark:border-white/[0.08] text-xs font-mono focus:outline-none focus:border-[#4285F4]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#5F6368] dark:text-[#8E9196]">
                      OpenRouter API Key
                    </label>
                    <input
                      type="text"
                      value={openrouterApiKeyInput}
                      onChange={(e) => setOpenrouterApiKeyInput(e.target.value)}
                      placeholder="sk-or-v1-..."
                      className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-[#1A1D24] border border-black/[0.08] dark:border-white/[0.08] text-xs font-mono focus:outline-none focus:border-[#4285F4]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSavingKeys}
                    className="w-full py-3 rounded-2xl bg-[#4285F4] hover:bg-[#3367D6] text-white text-xs font-medium shadow-md transition disabled:opacity-50"
                  >
                    {isSavingKeys ? "Updating keys..." : "Save Autonomous API Keys"}
                  </button>
                </form>
              </div>

              {/* Hard Database Reset Button */}
              <div className="p-7 rounded-3xl bg-red-500/5 border border-red-500/20 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-red-600 dark:text-red-400">
                      Hard Database Reset & 2026 Frontier Seed
                    </h3>
                    <p className="text-xs text-[#5F6368] dark:text-[#8E9196] mt-0.5">
                      Wipes all stale/synthetic rows from database and seeds genuine 2026 models (Gemini 4 Argon, Genie 3, GPT-6 Astra, Claude Opus 5.5).
                    </p>
                  </div>
                  <button
                    onClick={handleResetCatalog}
                    disabled={isSeeding}
                    className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-medium transition disabled:opacity-50 shrink-0"
                  >
                    {isSeeding ? "Purging & Seeding..." : "Reset Database"}
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Tool Ingest Column */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-7 rounded-3xl bg-[#F0F4F9] dark:bg-[#131314] border border-black/[0.06] dark:border-white/[0.08] shadow-sm space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#4285F4]/10 text-[#4285F4] flex items-center justify-center">
                    <Plus className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-[#1F1F1F] dark:text-white">
                      Quick Single-Tool Ingest
                    </h3>
                    <p className="text-xs text-[#5F6368] dark:text-[#8E9196] mt-0.5">
                      Instantly publish an AI tool into the directory.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleQuickIngest} className="space-y-3">
                  <input
                    type="text"
                    value={quickName}
                    onChange={(e) => setQuickName(e.target.value)}
                    placeholder="Tool Name (e.g. Gemini 4 Argon)"
                    className="w-full px-4 py-2 rounded-xl bg-white dark:bg-[#1A1D24] border border-black/[0.08] dark:border-white/[0.08] text-xs focus:outline-none focus:border-[#4285F4]"
                  />

                  <input
                    type="text"
                    value={quickCompany}
                    onChange={(e) => setQuickCompany(e.target.value)}
                    placeholder="Company / Lab (e.g. Google DeepMind)"
                    className="w-full px-4 py-2 rounded-xl bg-white dark:bg-[#1A1D24] border border-black/[0.08] dark:border-white/[0.08] text-xs focus:outline-none focus:border-[#4285F4]"
                  />

                  <input
                    type="url"
                    value={quickUrl}
                    onChange={(e) => setQuickUrl(e.target.value)}
                    placeholder="Official URL (e.g. https://deepmind.google)"
                    className="w-full px-4 py-2 rounded-xl bg-white dark:bg-[#1A1D24] border border-black/[0.08] dark:border-white/[0.08] text-xs focus:outline-none focus:border-[#4285F4]"
                  />

                  <select
                    value={quickCategory}
                    onChange={(e) => setQuickCategory(e.target.value as any)}
                    className="w-full px-4 py-2 rounded-xl bg-white dark:bg-[#1A1D24] border border-black/[0.08] dark:border-white/[0.08] text-xs focus:outline-none focus:border-[#4285F4]"
                  >
                    {ALL_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>

                  <textarea
                    value={quickTagline}
                    onChange={(e) => setQuickTagline(e.target.value)}
                    placeholder="Short description or tagline"
                    rows={2}
                    className="w-full px-4 py-2 rounded-xl bg-white dark:bg-[#1A1D24] border border-black/[0.08] dark:border-white/[0.08] text-xs focus:outline-none focus:border-[#4285F4]"
                  />

                  <button
                    type="submit"
                    disabled={isQuickIngesting}
                    className="w-full py-2.5 rounded-xl bg-[#4285F4] hover:bg-[#3367D6] text-white text-xs font-medium shadow-sm transition disabled:opacity-50"
                  >
                    {isQuickIngesting ? "Ingesting..." : "Ingest & Publish to Directory"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 4: DIRECTORY & NEWS WIRE MANAGER
        ===================================================================== */}
        {activeTab === "directory" && (
          <div className="space-y-8 animate-in fade-in-50">
            {/* Tools Catalog */}
            <div className="p-7 rounded-3xl bg-[#F0F4F9] dark:bg-[#131314] border border-black/[0.06] dark:border-white/[0.08] shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-[#1F1F1F] dark:text-white">
                    AI Directory Systems ({directoryItems.length})
                  </h2>
                  <p className="text-xs text-[#5F6368] dark:text-[#8E9196] mt-0.5">
                    Live database records synced with Supabase.
                  </p>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <input
                    type="text"
                    value={dirSearch}
                    onChange={(e) => setDirSearch(e.target.value)}
                    placeholder="Filter tools..."
                    className="px-4 py-1.5 rounded-full bg-white dark:bg-[#1A1D24] border border-black/[0.08] dark:border-white/[0.08] text-xs focus:outline-none focus:border-[#4285F4]"
                  />
                  <select
                    value={dirCategoryFilter}
                    onChange={(e) => setDirCategoryFilter(e.target.value)}
                    className="px-3 py-1.5 rounded-full bg-white dark:bg-[#1A1D24] border border-black/[0.08] dark:border-white/[0.08] text-xs focus:outline-none"
                  >
                    <option value="All">All Categories</option>
                    {ALL_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="divide-y divide-black/[0.06] dark:divide-white/[0.06] max-h-[480px] overflow-y-auto pr-2">
                {filteredTools.map((tool) => (
                  <div key={tool.slug || tool.id} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-white dark:bg-[#1A1D24] border border-black/[0.06] dark:border-white/[0.08] flex items-center justify-center font-bold text-xs">
                        {tool.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-[#1F1F1F] dark:text-white truncate">
                          {tool.name}
                        </div>
                        <div className="text-[10px] text-[#5F6368] dark:text-[#8E9196] truncate">
                          {tool.company} • {tool.category}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={tool.officialUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg text-[#5F6368] dark:text-[#8E9196] hover:text-[#1F1F1F] dark:hover:text-white"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <button
                        onClick={() => handleDeleteTool(tool.slug, tool.name)}
                        className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* News Articles Wire */}
            <div className="p-7 rounded-3xl bg-[#F0F4F9] dark:bg-[#131314] border border-black/[0.06] dark:border-white/[0.08] shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-[#1F1F1F] dark:text-white">
                    News Articles Wire ({newsArticles.length})
                  </h2>
                  <p className="text-xs text-[#5F6368] dark:text-[#8E9196] mt-0.5">
                    Live dispatches from frontier AI labs.
                  </p>
                </div>
                <input
                  type="text"
                  value={newsSearch}
                  onChange={(e) => setNewsSearch(e.target.value)}
                  placeholder="Filter news..."
                  className="px-4 py-1.5 rounded-full bg-white dark:bg-[#1A1D24] border border-black/[0.08] dark:border-white/[0.08] text-xs focus:outline-none focus:border-[#4285F4]"
                />
              </div>

              <div className="divide-y divide-black/[0.06] dark:divide-white/[0.06] max-h-[480px] overflow-y-auto pr-2">
                {filteredNews.map((art) => (
                  <div key={art.id} className="py-3 flex items-center justify-between gap-4">
                    <div className="min-w-0 space-y-0.5">
                      <div className="text-xs font-semibold text-[#1F1F1F] dark:text-white truncate">
                        {art.isPinned && <span className="text-[#4285F4] mr-1.5">📌</span>}
                        {art.title}
                      </div>
                      <div className="text-[10px] text-[#5F6368] dark:text-[#8E9196] truncate">
                        {art.sourceDomain} • {art.category}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleTogglePin(art.id, Boolean(art.isPinned))}
                        className={`p-1.5 rounded-lg transition ${
                          art.isPinned
                            ? "text-[#4285F4] bg-[#4285F4]/10"
                            : "text-[#5F6368] dark:text-[#8E9196] hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
                        }`}
                      >
                        <Pin className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteArticle(art.id, art.title)}
                        className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
