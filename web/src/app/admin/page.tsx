"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Shield, 
  Lock, 
  Terminal, 
  Newspaper, 
  Cpu, 
  Plus, 
  Trash2, 
  Edit3, 
  Pin, 
  Star, 
  RefreshCw, 
  Check, 
  AlertCircle, 
  ExternalLink,
  LogOut,
  Save,
  X,
  Database,
  ArrowLeft
} from "lucide-react";
import { AIDirectoryItem, NewsArticle } from "@/lib/types";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [authError, setAuthError] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"directory" | "news" | "actions">("directory");

  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [directoryItems, setDirectoryItems] = useState<AIDirectoryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>("");

  // Edit states
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);
  const [editingTool, setEditingTool] = useState<AIDirectoryItem | null>(null);

  // New item modal states
  const [isNewArticleOpen, setIsNewArticleOpen] = useState(false);
  const [isNewToolOpen, setIsNewToolOpen] = useState(false);

  // Form states for new article
  const [newArticleForm, setNewArticleForm] = useState({
    title: "",
    summary: "",
    url: "",
    category: "LLMs",
    source_name: "Editorial Wire",
    related_tools: "",
    is_pinned: false,
  });

  // Form states for new tool
  const [newToolForm, setNewToolForm] = useState({
    name: "",
    creator: "",
    short_purpose: "",
    primary_category: "Chatbots & Assistants",
    tags: "",
    detailed_overview: "",
    key_capabilities: "",
    best_use_cases: "",
    pricing_model: "",
    official_url: "",
    release_status: "Generally Available",
    is_featured: false,
  });

  // Check session
  useEffect(() => {
    const savedAuth = sessionStorage.getItem("admin_session");
    if (savedAuth === "true") {
      setIsAuthenticated(true);
      fetchData();
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: passwordInput }),
      });
      const data = await res.json();
      if (res.ok && data.authenticated) {
        setIsAuthenticated(true);
        sessionStorage.setItem("admin_session", "true");
        fetchData();
      } else {
        setAuthError(data.error || "Access denied. Invalid password.");
      }
    } catch {
      setAuthError("Failed to authenticate. Check server connection.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("admin_session");
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [artRes, dirRes] = await Promise.all([
        fetch("/api/news"),
        fetch("/api/directory"),
      ]);
      const artData = await artRes.json();
      const dirData = await dirRes.json();
      setArticles(artData.articles || []);
      setDirectoryItems(dirData.items || []);
    } catch (err) {
      console.error("Failed to load admin data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // -------------------------------------------------------------
  // News Handlers
  // -------------------------------------------------------------

  const handleCreateArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newArticleForm),
      });
      if (res.ok) {
        setIsNewArticleOpen(false);
        setNewArticleForm({
          title: "",
          summary: "",
          url: "",
          category: "LLMs",
          source_name: "Editorial Wire",
          related_tools: "",
          is_pinned: false,
        });
        flashMessage("Breaking news article published successfully!");
        fetchData();
      }
    } catch (err) {
      alert("Failed to create article: " + err);
    }
  };

  const handleUpdateArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle) return;
    try {
      const res = await fetch("/api/news", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingArticle),
      });
      if (res.ok) {
        setEditingArticle(null);
        flashMessage("Article updated successfully!");
        fetchData();
      }
    } catch (err) {
      alert("Failed to update article: " + err);
    }
  };

  const handleTogglePin = async (article: NewsArticle) => {
    try {
      const res = await fetch("/api/news", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: article.id, is_pinned: !article.is_pinned }),
      });
      if (res.ok) {
        flashMessage(`Story ${article.is_pinned ? "unpinned" : "pinned to top"}!`);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteArticle = async (id: number) => {
    if (!confirm("Are you sure you want to delete this article? This action cannot be undone.")) return;
    try {
      const res = await fetch(`/api/news?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        flashMessage("Article deleted.");
        fetchData();
      }
    } catch (err) {
      alert("Failed to delete article: " + err);
    }
  };

  // -------------------------------------------------------------
  // AI Directory Handlers
  // -------------------------------------------------------------

  const handleCreateTool = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/directory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newToolForm),
      });
      if (res.ok) {
        setIsNewToolOpen(false);
        setNewToolForm({
          name: "",
          creator: "",
          short_purpose: "",
          primary_category: "Code Builders",
          tags: "",
          detailed_overview: "",
          key_capabilities: "",
          best_use_cases: "",
          pricing_model: "",
          official_url: "",
          release_status: "Generally Available",
          is_featured: false,
        });
        flashMessage("AI model added to directory!");
        fetchData();
      }
    } catch (err) {
      alert("Failed to create tool: " + err);
    }
  };

  const handleUpdateTool = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTool) return;
    try {
      const res = await fetch("/api/directory", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingTool),
      });
      if (res.ok) {
        setEditingTool(null);
        flashMessage("AI Model specifications updated!");
        fetchData();
      }
    } catch (err) {
      alert("Failed to update tool: " + err);
    }
  };

  const handleToggleFeatured = async (tool: AIDirectoryItem) => {
    try {
      const res = await fetch("/api/directory", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: tool.slug, is_featured: !tool.is_featured }),
      });
      if (res.ok) {
        flashMessage(`${tool.name} ${tool.is_featured ? "removed from" : "marked as"} featured!`);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTool = async (slug: string) => {
    if (!confirm(`Are you sure you want to delete "${slug}" from the directory?`)) return;
    try {
      const res = await fetch(`/api/directory?slug=${slug}`, { method: "DELETE" });
      if (res.ok) {
        flashMessage("AI Model deleted from catalogue.");
        fetchData();
      }
    } catch (err) {
      alert("Failed to delete tool: " + err);
    }
  };

  const handleResetSeed = async () => {
    if (!confirm("Reset database directory to the 22 default premier AI models and seed articles?")) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/seed", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        flashMessage(data.message || "Directory re-seeded successfully!");
        fetchData();
      }
    } catch (err) {
      alert("Failed to reset seed: " + err);
    } finally {
      setIsLoading(false);
    }
  };

  const flashMessage = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(""), 4000);
  };

  // -------------------------------------------------------------
  // Unauthenticated Screen
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#09090B] text-[#FAFAFA]">
        <div className="w-full max-w-md border border-[#27272A] bg-[#121215] p-6 sm:p-8 shadow-2xl">
          <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-[#1F1F23]">
            <div className="flex h-10 w-10 items-center justify-center border border-[#27272A] bg-[#18181B] text-emerald-400">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-base font-bold uppercase tracking-wider text-white">
                ADMIN CONTROL CENTER
              </h1>
              <p className="text-xs font-mono text-[#71717A]">
                AUTHENTICATION REQUIRED
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#A1A1AA] mb-1.5">
                Admin Security Passcode
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#71717A]" />
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter ADMIN_PASSWORD..."
                  className="w-full border border-[#27272A] bg-[#09090B] pl-9 pr-4 py-2.5 text-xs font-mono text-[#FAFAFA] placeholder-[#71717A] focus:border-emerald-500/50 focus:outline-hidden"
                  autoFocus
                />
              </div>
            </div>

            {authError && (
              <div className="flex items-center space-x-2 border border-rose-900/40 bg-rose-950/30 p-2.5 text-xs font-mono text-rose-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-2 border border-emerald-500/60 bg-emerald-600/30 py-2.5 text-xs font-mono font-bold text-emerald-300 hover:bg-emerald-600/40 transition-colors"
            >
              <span>Authenticate & Enter Console</span>
            </button>

            <div className="pt-2 text-center">
              <Link
                href="/"
                className="inline-flex items-center space-x-1.5 text-xs font-mono text-[#71717A] hover:text-[#FAFAFA]"
              >
                <ArrowLeft className="h-3 w-3" />
                <span>Return to Public Wire</span>
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Calculate metrics
  const featuredCount = directoryItems.filter((i) => i.is_featured).length;
  const pinnedCount = articles.filter((a) => a.is_pinned).length;

  return (
    <div className="min-h-screen flex flex-col bg-[#09090B] text-[#FAFAFA] font-sans">
      {/* Admin Header */}
      <header className="border-b border-[#27272A] bg-[#121215] sticky top-0 z-40">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center border border-emerald-500/40 bg-[#18181B] text-emerald-400">
              <Shield className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-sm font-bold uppercase tracking-wider text-white">
                  ADMIN CONTROL CENTER
                </h1>
                <span className="rounded-xs border border-emerald-500/40 bg-emerald-500/20 px-1.5 py-0.2 text-[9px] font-mono text-emerald-400">
                  AUTHENTICATED
                </span>
              </div>
              <p className="text-[10px] font-mono text-[#71717A] hidden sm:block">
                SUPABASE CRUD OBSERVATORY // FULL PERMISSIONS
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/"
              className="flex items-center space-x-1 border border-[#27272A] bg-[#18181B] px-3 py-1.5 text-xs font-mono text-[#A1A1AA] hover:text-white transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Public Hub</span>
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 border border-rose-900/40 bg-rose-950/20 px-3 py-1.5 text-xs font-mono text-rose-400 hover:bg-rose-950/40 transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Status Toast */}
        {statusMessage && (
          <div className="bg-emerald-950/80 border-b border-emerald-500/40 px-4 py-2 text-xs font-mono text-emerald-300 flex items-center justify-center space-x-2 animate-in fade-in">
            <Check className="h-3.5 w-3.5 text-emerald-400" />
            <span>{statusMessage}</span>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 py-6 space-y-6">
        {/* Overview Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="border border-[#27272A] bg-[#121215] p-4">
            <div className="text-[10px] font-mono uppercase text-[#71717A]">Published News Stories</div>
            <div className="text-2xl font-bold font-mono text-white mt-1">{articles.length}</div>
            <div className="text-[10px] font-mono text-emerald-400 mt-1">{pinnedCount} Stories Pinned</div>
          </div>

          <div className="border border-[#27272A] bg-[#121215] p-4">
            <div className="text-[10px] font-mono uppercase text-[#71717A]">AI Models / Agents</div>
            <div className="text-2xl font-bold font-mono text-white mt-1">{directoryItems.length}</div>
            <div className="text-[10px] font-mono text-emerald-400 mt-1">{featuredCount} Featured Systems</div>
          </div>

          <div className="border border-[#27272A] bg-[#121215] p-4">
            <div className="text-[10px] font-mono uppercase text-[#71717A]">Pipeline Cron Status</div>
            <div className="text-sm font-bold font-mono text-emerald-400 mt-2">Active (07:30 IST)</div>
            <div className="text-[10px] font-mono text-[#71717A] mt-1">GitHub Actions Runner</div>
          </div>

          <div className="border border-[#27272A] bg-[#121215] p-4">
            <div className="text-[10px] font-mono uppercase text-[#71717A]">Database Connection</div>
            <div className="text-sm font-bold font-mono text-white mt-2">PostgreSQL</div>
            <div className="text-[10px] font-mono text-[#71717A] mt-1">Transaction Pooler</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-2 border-b border-[#27272A] pb-3 text-xs font-mono">
          <button
            onClick={() => setActiveTab("directory")}
            className={`flex items-center space-x-2 border px-4 py-2 transition-colors ${
              activeTab === "directory"
                ? "border-emerald-500/50 bg-[#27272A] text-white font-semibold"
                : "border-[#27272A] bg-[#121215] text-[#A1A1AA] hover:text-white"
            }`}
          >
            <Cpu className="h-3.5 w-3.5 text-emerald-400" />
            <span>AI Directory Manager ({directoryItems.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("news")}
            className={`flex items-center space-x-2 border px-4 py-2 transition-colors ${
              activeTab === "news"
                ? "border-emerald-500/50 bg-[#27272A] text-white font-semibold"
                : "border-[#27272A] bg-[#121215] text-[#A1A1AA] hover:text-white"
            }`}
          >
            <Newspaper className="h-3.5 w-3.5 text-sky-400" />
            <span>News Wire Manager ({articles.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("actions")}
            className={`flex items-center space-x-2 border px-4 py-2 transition-colors ${
              activeTab === "actions"
                ? "border-emerald-500/50 bg-[#27272A] text-white font-semibold"
                : "border-[#27272A] bg-[#121215] text-[#A1A1AA] hover:text-white"
            }`}
          >
            <Database className="h-3.5 w-3.5 text-purple-400" />
            <span>Database & Workflow Actions</span>
          </button>
        </div>

        {/* TAB 1: AI Directory Manager */}
        {activeTab === "directory" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white tracking-tight">AI Models & Agents Directory Catalogue</h2>
                <p className="text-xs font-mono text-[#71717A]">Add, update, feature, or delete models in Supabase</p>
              </div>

              <button
                onClick={() => setIsNewToolOpen(true)}
                className="flex items-center space-x-1.5 border border-emerald-500/60 bg-emerald-600/30 px-3 py-1.5 text-xs font-mono font-bold text-emerald-300 hover:bg-emerald-600/40 transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add New AI Tool</span>
              </button>
            </div>

            {/* Models Table */}
            <div className="border border-[#27272A] bg-[#121215] overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="border-b border-[#27272A] bg-[#0E0E11] text-[#71717A]">
                  <tr>
                    <th className="p-3">STATUS</th>
                    <th className="p-3">NAME & CREATOR</th>
                    <th className="p-3">CATEGORY</th>
                    <th className="p-3">PRICING</th>
                    <th className="p-3">FEATURED</th>
                    <th className="p-3 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1F1F23]">
                  {directoryItems.map((item) => (
                    <tr key={item.slug} className="hover:bg-[#16161B] transition-colors">
                      <td className="p-3">
                        <span className="border border-[#27272A] bg-[#18181B] px-1.5 py-0.5 text-[10px] text-[#A1A1AA]">
                          {item.release_status}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="font-bold text-white">{item.name}</div>
                        <div className="text-[10px] text-[#71717A]">by {item.creator}</div>
                      </td>
                      <td className="p-3">
                        <span className="text-emerald-400 font-medium">{item.primary_category}</span>
                      </td>
                      <td className="p-3 text-[#A1A1AA] max-w-xs truncate">
                        {item.pricing_model}
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => handleToggleFeatured(item)}
                          className={`flex items-center space-x-1 border px-2 py-0.5 text-[10px] transition-colors ${
                            item.is_featured
                              ? "border-emerald-500/60 bg-emerald-500/20 text-emerald-400 font-bold"
                              : "border-[#27272A] bg-[#18181B] text-[#71717A] hover:text-white"
                          }`}
                        >
                          <Star className={`h-2.5 w-2.5 ${item.is_featured ? "fill-emerald-400" : ""}`} />
                          <span>{item.is_featured ? "Featured" : "Regular"}</span>
                        </button>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => setEditingTool(item)}
                            className="border border-[#27272A] bg-[#18181B] p-1.5 text-[#A1A1AA] hover:text-white hover:border-[#3F3F46]"
                            title="Edit Tool"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteTool(item.slug)}
                            className="border border-rose-900/30 bg-rose-950/20 p-1.5 text-rose-400 hover:bg-rose-950/40"
                            title="Delete Tool"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: News Wire Manager */}
        {activeTab === "news" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white tracking-tight">Daily News Wire Editorial Control</h2>
                <p className="text-xs font-mono text-[#71717A]">Publish breaking articles, pin important dispatches, or tweak summaries</p>
              </div>

              <button
                onClick={() => setIsNewArticleOpen(true)}
                className="flex items-center space-x-1.5 border border-sky-500/60 bg-sky-600/30 px-3 py-1.5 text-xs font-mono font-bold text-sky-300 hover:bg-sky-600/40 transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Publish Breaking Story</span>
              </button>
            </div>

            {/* Articles Table */}
            <div className="border border-[#27272A] bg-[#121215] overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="border-b border-[#27272A] bg-[#0E0E11] text-[#71717A]">
                  <tr>
                    <th className="p-3">PIN</th>
                    <th className="p-3">HEADLINE & SOURCE</th>
                    <th className="p-3">CATEGORY</th>
                    <th className="p-3">RELATED TOOLS</th>
                    <th className="p-3 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1F1F23]">
                  {articles.map((article) => (
                    <tr key={article.id} className="hover:bg-[#16161B] transition-colors">
                      <td className="p-3">
                        <button
                          onClick={() => handleTogglePin(article)}
                          className={`flex items-center space-x-1 border px-2 py-0.5 text-[10px] transition-colors ${
                            article.is_pinned
                              ? "border-emerald-500/60 bg-emerald-500/20 text-emerald-400 font-bold"
                              : "border-[#27272A] bg-[#18181B] text-[#71717A] hover:text-white"
                          }`}
                        >
                          <Pin className="h-2.5 w-2.5 rotate-45" />
                          <span>{article.is_pinned ? "Pinned" : "Pin"}</span>
                        </button>
                      </td>
                      <td className="p-3 max-w-md">
                        <div className="font-bold text-white truncate">{article.title}</div>
                        <div className="text-[10px] text-[#71717A]">Source: {article.source_name || "Feed"}</div>
                      </td>
                      <td className="p-3">
                        <span className="border border-[#27272A] bg-[#18181B] px-1.5 py-0.5 text-[10px] text-sky-400">
                          {article.category}
                        </span>
                      </td>
                      <td className="p-3 text-[#A1A1AA] max-w-xs truncate">
                        {article.related_tools || "—"}
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => setEditingArticle(article)}
                            className="border border-[#27272A] bg-[#18181B] p-1.5 text-[#A1A1AA] hover:text-white hover:border-[#3F3F46]"
                            title="Edit Story"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteArticle(article.id!)}
                            className="border border-rose-900/30 bg-rose-950/20 p-1.5 text-rose-400 hover:bg-rose-950/40"
                            title="Delete Story"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: Quick Database Actions */}
        {activeTab === "actions" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-[#27272A] bg-[#121215] p-5 space-y-3">
              <div className="flex items-center space-x-2 text-white font-bold text-sm">
                <Database className="h-4 w-4 text-emerald-400" />
                <span>Re-seed Premier AI Directory</span>
              </div>
              <p className="text-xs text-[#A1A1AA]">
                Resets the database catalogue to the default 22 verified AI models, agents, code builders, and IDEs (including Gemini, Codex, Antigravity, Claude, Cursor, CrewAI, DeepSeek, Sora, etc.).
              </p>
              <button
                onClick={handleResetSeed}
                disabled={isLoading}
                className="flex items-center space-x-2 border border-emerald-500/50 bg-emerald-600/30 px-3 py-2 text-xs font-mono font-bold text-emerald-300 hover:bg-emerald-600/40 transition-colors"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
                <span>Re-seed Default Catalogue</span>
              </button>
            </div>

            <div className="border border-[#27272A] bg-[#121215] p-5 space-y-3">
              <div className="flex items-center space-x-2 text-white font-bold text-sm">
                <Terminal className="h-4 w-4 text-sky-400" />
                <span>GitHub Actions Workflow Trigger</span>
              </div>
              <p className="text-xs text-[#A1A1AA]">
                The daily AI Tech Journalist pipeline runs every morning at 07:30 IST. You can trigger an instant manual import run from the GitHub Actions dashboard.
              </p>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-2 border border-[#27272A] bg-[#18181B] px-3 py-2 text-xs font-mono text-[#FAFAFA] hover:bg-[#27272A] transition-colors"
              >
                <span>Open GitHub Actions Runner</span>
                <ExternalLink className="h-3.5 w-3.5 text-sky-400" />
              </a>
            </div>
          </div>
        )}
      </main>

      {/* MODAL: New Article */}
      {isNewArticleOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="border border-[#27272A] bg-[#121215] w-full max-w-xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#1F1F23] pb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">Publish Breaking Story</h3>
              <button onClick={() => setIsNewArticleOpen(false)} className="text-[#71717A] hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateArticle} className="space-y-3 text-xs font-mono">
              <div>
                <label className="block text-[#A1A1AA] mb-1">Headline Title</label>
                <input
                  type="text"
                  required
                  value={newArticleForm.title}
                  onChange={(e) => setNewArticleForm({ ...newArticleForm, title: e.target.value })}
                  placeholder="e.g. OpenAI Unveils Next-Gen Reasoning Engine..."
                  className="w-full border border-[#27272A] bg-[#09090B] p-2 text-[#FAFAFA] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[#A1A1AA] mb-1">Executive Summary (2 Sentences)</label>
                <textarea
                  required
                  rows={3}
                  value={newArticleForm.summary}
                  onChange={(e) => setNewArticleForm({ ...newArticleForm, summary: e.target.value })}
                  placeholder="Editorial neutral technical summary..."
                  className="w-full border border-[#27272A] bg-[#09090B] p-2 text-[#FAFAFA] focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#A1A1AA] mb-1">Category</label>
                  <select
                    value={newArticleForm.category}
                    onChange={(e) => setNewArticleForm({ ...newArticleForm, category: e.target.value })}
                    className="w-full border border-[#27272A] bg-[#09090B] p-2 text-[#FAFAFA] focus:outline-hidden"
                  >
                    <option value="LLMs">LLMs</option>
                    <option value="Code Builders">Code Builders</option>
                    <option value="Hardware">Hardware</option>
                    <option value="Robotics">Robotics</option>
                    <option value="Startups">Startups</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#A1A1AA] mb-1">Source Name</label>
                  <input
                    type="text"
                    value={newArticleForm.source_name}
                    onChange={(e) => setNewArticleForm({ ...newArticleForm, source_name: e.target.value })}
                    placeholder="e.g. TechCrunch"
                    className="w-full border border-[#27272A] bg-[#09090B] p-2 text-[#FAFAFA] focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#A1A1AA] mb-1">Original Publisher URL</label>
                <input
                  type="url"
                  required
                  value={newArticleForm.url}
                  onChange={(e) => setNewArticleForm({ ...newArticleForm, url: e.target.value })}
                  placeholder="https://..."
                  className="w-full border border-[#27272A] bg-[#09090B] p-2 text-[#FAFAFA] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[#A1A1AA] mb-1">Related AI Tools (Optional)</label>
                <input
                  type="text"
                  value={newArticleForm.related_tools}
                  onChange={(e) => setNewArticleForm({ ...newArticleForm, related_tools: e.target.value })}
                  placeholder="e.g. Claude 3.7 Sonnet, DeepSeek"
                  className="w-full border border-[#27272A] bg-[#09090B] p-2 text-[#FAFAFA] focus:outline-hidden"
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="new_is_pinned"
                  checked={newArticleForm.is_pinned}
                  onChange={(e) => setNewArticleForm({ ...newArticleForm, is_pinned: e.target.checked })}
                  className="accent-emerald-500"
                />
                <label htmlFor="new_is_pinned" className="text-[#D4D4D8]">Pin this story to the top of Daily Wire</label>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-[#1F1F23]">
                <button
                  type="button"
                  onClick={() => setIsNewArticleOpen(false)}
                  className="border border-[#27272A] bg-[#18181B] px-3 py-1.5 text-[#A1A1AA] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="border border-emerald-500/60 bg-emerald-600/30 px-4 py-1.5 font-bold text-emerald-300 hover:bg-emerald-600/40"
                >
                  Publish Story
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Edit Article */}
      {editingArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="border border-[#27272A] bg-[#121215] w-full max-w-xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#1F1F23] pb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">Edit News Story</h3>
              <button onClick={() => setEditingArticle(null)} className="text-[#71717A] hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateArticle} className="space-y-3 text-xs font-mono">
              <div>
                <label className="block text-[#A1A1AA] mb-1">Headline Title</label>
                <input
                  type="text"
                  required
                  value={editingArticle.title}
                  onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
                  className="w-full border border-[#27272A] bg-[#09090B] p-2 text-[#FAFAFA] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[#A1A1AA] mb-1">Summary</label>
                <textarea
                  required
                  rows={3}
                  value={editingArticle.summary}
                  onChange={(e) => setEditingArticle({ ...editingArticle, summary: e.target.value })}
                  className="w-full border border-[#27272A] bg-[#09090B] p-2 text-[#FAFAFA] focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#A1A1AA] mb-1">Category</label>
                  <select
                    value={editingArticle.category}
                    onChange={(e) => setEditingArticle({ ...editingArticle, category: e.target.value })}
                    className="w-full border border-[#27272A] bg-[#09090B] p-2 text-[#FAFAFA] focus:outline-hidden"
                  >
                    <option value="LLMs">LLMs</option>
                    <option value="Code Builders">Code Builders</option>
                    <option value="Hardware">Hardware</option>
                    <option value="Robotics">Robotics</option>
                    <option value="Startups">Startups</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#A1A1AA] mb-1">Source Name</label>
                  <input
                    type="text"
                    value={editingArticle.source_name || ""}
                    onChange={(e) => setEditingArticle({ ...editingArticle, source_name: e.target.value })}
                    className="w-full border border-[#27272A] bg-[#09090B] p-2 text-[#FAFAFA] focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="edit_is_pinned"
                  checked={editingArticle.is_pinned}
                  onChange={(e) => setEditingArticle({ ...editingArticle, is_pinned: e.target.checked })}
                  className="accent-emerald-500"
                />
                <label htmlFor="edit_is_pinned" className="text-[#D4D4D8]">Pin story to top of Daily Wire</label>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-[#1F1F23]">
                <button
                  type="button"
                  onClick={() => setEditingArticle(null)}
                  className="border border-[#27272A] bg-[#18181B] px-3 py-1.5 text-[#A1A1AA] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="border border-emerald-500/60 bg-emerald-600/30 px-4 py-1.5 font-bold text-emerald-300 hover:bg-emerald-600/40"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: New AI Tool */}
      {isNewToolOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="border border-[#27272A] bg-[#121215] w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#1F1F23] pb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">Add New AI Model or Agent</h3>
              <button onClick={() => setIsNewToolOpen(false)} className="text-[#71717A] hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTool} className="space-y-3 text-xs font-mono">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#A1A1AA] mb-1">Model / Tool Name</label>
                  <input
                    type="text"
                    required
                    value={newToolForm.name}
                    onChange={(e) => setNewToolForm({ ...newToolForm, name: e.target.value })}
                    placeholder="e.g. Claude 3.7 Sonnet"
                    className="w-full border border-[#27272A] bg-[#09090B] p-2 text-[#FAFAFA] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[#A1A1AA] mb-1">Creator / Organization</label>
                  <input
                    type="text"
                    required
                    value={newToolForm.creator}
                    onChange={(e) => setNewToolForm({ ...newToolForm, creator: e.target.value })}
                    placeholder="e.g. Anthropic"
                    className="w-full border border-[#27272A] bg-[#09090B] p-2 text-[#FAFAFA] focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#A1A1AA] mb-1">Primary Category</label>
                  <select
                    value={newToolForm.primary_category}
                    onChange={(e) => setNewToolForm({ ...newToolForm, primary_category: e.target.value })}
                    className="w-full border border-[#27272A] bg-[#09090B] p-2 text-[#FAFAFA] focus:outline-hidden"
                  >
                    <option value="Chatbots & Assistants">Chatbots & Assistants</option>
                    <option value="Code Builders & IDEs">Code Builders & IDEs</option>
                    <option value="Autonomous Agents">Autonomous Agents</option>
                    <option value="Foundation LLMs">Foundation LLMs</option>
                    <option value="Image & Video Gen">Image & Video Gen</option>
                    <option value="Voice & Audio">Voice & Audio</option>
                    <option value="Search & Research">Search & Research</option>
                    <option value="Agent Frameworks">Agent Frameworks</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#A1A1AA] mb-1">Release Status</label>
                  <select
                    value={newToolForm.release_status}
                    onChange={(e) => setNewToolForm({ ...newToolForm, release_status: e.target.value })}
                    className="w-full border border-[#27272A] bg-[#09090B] p-2 text-[#FAFAFA] focus:outline-hidden"
                  >
                    <option value="Generally Available">Generally Available</option>
                    <option value="Active Preview">Active Preview</option>
                    <option value="Open Source">Open Source</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#A1A1AA] mb-1">Short Purpose</label>
                <input
                  type="text"
                  required
                  value={newToolForm.short_purpose}
                  onChange={(e) => setNewToolForm({ ...newToolForm, short_purpose: e.target.value })}
                  placeholder="One sentence purpose statement..."
                  className="w-full border border-[#27272A] bg-[#09090B] p-2 text-[#FAFAFA] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[#A1A1AA] mb-1">Detailed Architectural Overview</label>
                <textarea
                  rows={3}
                  value={newToolForm.detailed_overview}
                  onChange={(e) => setNewToolForm({ ...newToolForm, detailed_overview: e.target.value })}
                  placeholder="Detailed architectural breakdown..."
                  className="w-full border border-[#27272A] bg-[#09090B] p-2 text-[#FAFAFA] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[#A1A1AA] mb-1">Tags (Comma-separated)</label>
                <input
                  type="text"
                  value={newToolForm.tags}
                  onChange={(e) => setNewToolForm({ ...newToolForm, tags: e.target.value })}
                  placeholder="Multimodal, 200K Context, Reasoning..."
                  className="w-full border border-[#27272A] bg-[#09090B] p-2 text-[#FAFAFA] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[#A1A1AA] mb-1">Key Capabilities (One per line)</label>
                <textarea
                  rows={3}
                  value={newToolForm.key_capabilities}
                  onChange={(e) => setNewToolForm({ ...newToolForm, key_capabilities: e.target.value })}
                  placeholder="Line 1 capability&#10;Line 2 capability..."
                  className="w-full border border-[#27272A] bg-[#09090B] p-2 text-[#FAFAFA] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[#A1A1AA] mb-1">Production Use Cases (One per line)</label>
                <textarea
                  rows={3}
                  value={newToolForm.best_use_cases}
                  onChange={(e) => setNewToolForm({ ...newToolForm, best_use_cases: e.target.value })}
                  placeholder="Line 1 use case&#10;Line 2 use case..."
                  className="w-full border border-[#27272A] bg-[#09090B] p-2 text-[#FAFAFA] focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#A1A1AA] mb-1">Pricing Model</label>
                  <input
                    type="text"
                    value={newToolForm.pricing_model}
                    onChange={(e) => setNewToolForm({ ...newToolForm, pricing_model: e.target.value })}
                    placeholder="e.g. Free Tier; $3 / 1M tokens"
                    className="w-full border border-[#27272A] bg-[#09090B] p-2 text-[#FAFAFA] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[#A1A1AA] mb-1">Official Website URL</label>
                  <input
                    type="url"
                    required
                    value={newToolForm.official_url}
                    onChange={(e) => setNewToolForm({ ...newToolForm, official_url: e.target.value })}
                    placeholder="https://..."
                    className="w-full border border-[#27272A] bg-[#09090B] p-2 text-[#FAFAFA] focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="new_tool_featured"
                  checked={newToolForm.is_featured}
                  onChange={(e) => setNewToolForm({ ...newToolForm, is_featured: e.target.checked })}
                  className="accent-emerald-500"
                />
                <label htmlFor="new_tool_featured" className="text-[#D4D4D8]">Pin this AI system as Featured in the directory</label>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-[#1F1F23]">
                <button
                  type="button"
                  onClick={() => setIsNewToolOpen(false)}
                  className="border border-[#27272A] bg-[#18181B] px-3 py-1.5 text-[#A1A1AA] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="border border-emerald-500/60 bg-emerald-600/30 px-4 py-1.5 font-bold text-emerald-300 hover:bg-emerald-600/40"
                >
                  Add Model to Directory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Edit AI Tool */}
      {editingTool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="border border-[#27272A] bg-[#121215] w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#1F1F23] pb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">Edit AI Tool: {editingTool.name}</h3>
              <button onClick={() => setEditingTool(null)} className="text-[#71717A] hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateTool} className="space-y-3 text-xs font-mono">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#A1A1AA] mb-1">Name</label>
                  <input
                    type="text"
                    required
                    value={editingTool.name}
                    onChange={(e) => setEditingTool({ ...editingTool, name: e.target.value })}
                    className="w-full border border-[#27272A] bg-[#09090B] p-2 text-[#FAFAFA] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[#A1A1AA] mb-1">Creator</label>
                  <input
                    type="text"
                    required
                    value={editingTool.creator}
                    onChange={(e) => setEditingTool({ ...editingTool, creator: e.target.value })}
                    className="w-full border border-[#27272A] bg-[#09090B] p-2 text-[#FAFAFA] focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#A1A1AA] mb-1">Short Purpose</label>
                <input
                  type="text"
                  required
                  value={editingTool.short_purpose}
                  onChange={(e) => setEditingTool({ ...editingTool, short_purpose: e.target.value })}
                  className="w-full border border-[#27272A] bg-[#09090B] p-2 text-[#FAFAFA] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[#A1A1AA] mb-1">Detailed Overview</label>
                <textarea
                  rows={3}
                  value={editingTool.detailed_overview}
                  onChange={(e) => setEditingTool({ ...editingTool, detailed_overview: e.target.value })}
                  className="w-full border border-[#27272A] bg-[#09090B] p-2 text-[#FAFAFA] focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#A1A1AA] mb-1">Category</label>
                  <select
                    value={editingTool.primary_category}
                    onChange={(e) => setEditingTool({ ...editingTool, primary_category: e.target.value })}
                    className="w-full border border-[#27272A] bg-[#09090B] p-2 text-[#FAFAFA] focus:outline-hidden"
                  >
                    <option value="Chatbots & Assistants">Chatbots & Assistants</option>
                    <option value="Code Builders & IDEs">Code Builders & IDEs</option>
                    <option value="Autonomous Agents">Autonomous Agents</option>
                    <option value="Foundation LLMs">Foundation LLMs</option>
                    <option value="Image & Video Gen">Image & Video Gen</option>
                    <option value="Voice & Audio">Voice & Audio</option>
                    <option value="Search & Research">Search & Research</option>
                    <option value="Agent Frameworks">Agent Frameworks</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#A1A1AA] mb-1">Pricing Model</label>
                  <input
                    type="text"
                    value={editingTool.pricing_model}
                    onChange={(e) => setEditingTool({ ...editingTool, pricing_model: e.target.value })}
                    className="w-full border border-[#27272A] bg-[#09090B] p-2 text-[#FAFAFA] focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="edit_tool_featured"
                  checked={editingTool.is_featured}
                  onChange={(e) => setEditingTool({ ...editingTool, is_featured: e.target.checked })}
                  className="accent-emerald-500"
                />
                <label htmlFor="edit_tool_featured" className="text-[#D4D4D8]">Feature this model at the top of the directory</label>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-[#1F1F23]">
                <button
                  type="button"
                  onClick={() => setEditingTool(null)}
                  className="border border-[#27272A] bg-[#18181B] px-3 py-1.5 text-[#A1A1AA] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="border border-emerald-500/60 bg-emerald-600/30 px-4 py-1.5 font-bold text-emerald-300 hover:bg-emerald-600/40"
                >
                  Save Tool Specs
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
