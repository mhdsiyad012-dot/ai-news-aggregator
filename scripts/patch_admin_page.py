import re

path = 'web/src/app/admin/page.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Pattern for activeTab === "sync" block
sync_pattern = r'\{activeTab === "sync" && \([\s\S]*?\)\s*\}\s*\{/\* ===+[\s\r\n]*TAB 4: DIRECTORY'

new_sync_content = '''{activeTab === "sync" && (
          <div className="space-y-8 animate-in fade-in-50">
            {/* Real-Time Live Internet Sync Engine Card */}
            <div className="p-8 rounded-3xl bg-[#F0F4F9] dark:bg-[#131314] border border-black/[0.06] dark:border-white/[0.08] shadow-sm space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-[#4285F4]/10 text-[#4285F4] flex items-center justify-center shrink-0">
                    <Globe className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-semibold text-[#1F1F1F] dark:text-white">
                        Live Internet Sync Engine
                      </h2>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        REAL-TIME TELEMETRY
                      </span>
                    </div>
                    <p className="text-xs text-[#5F6368] dark:text-[#8E9196] mt-1 max-w-2xl">
                      Fetches 100% genuine, live AI models, open-source repositories, and breaking news articles directly from OpenRouter API, Hugging Face, GitHub, and RSS feeds into Supabase.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => handleLiveSync(false)}
                    disabled={isLiveSyncing}
                    className="px-5 py-2.5 rounded-2xl bg-[#4285F4] hover:bg-[#3367D6] text-white text-xs font-medium shadow-md transition flex items-center gap-2 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLiveSyncing ? "animate-spin" : ""}`} />
                    <span>{isLiveSyncing ? "Syncing Live Internet..." : "Sync Live Models & News Now"}</span>
                  </button>

                  <button
                    onClick={() => handleLiveSync(true)}
                    disabled={isLiveSyncing}
                    className="px-4 py-2.5 rounded-2xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20 text-xs font-medium transition flex items-center gap-2 disabled:opacity-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Purge Stale & Re-Sync Live Only</span>
                  </button>
                </div>
              </div>

              {/* Live Feeds Status Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-3 rounded-2xl bg-white dark:bg-[#1A1D24] border border-black/[0.06] dark:border-white/[0.06] flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-medium text-[#1F1F1F] dark:text-white">OpenRouter Live API</span>
                </div>
                <div className="p-3 rounded-2xl bg-white dark:bg-[#1A1D24] border border-black/[0.06] dark:border-white/[0.06] flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-medium text-[#1F1F1F] dark:text-white">Hugging Face API</span>
                </div>
                <div className="p-3 rounded-2xl bg-white dark:bg-[#1A1D24] border border-black/[0.06] dark:border-white/[0.06] flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-medium text-[#1F1F1F] dark:text-white">GitHub Trending API</span>
                </div>
                <div className="p-3 rounded-2xl bg-white dark:bg-[#1A1D24] border border-black/[0.06] dark:border-white/[0.06] flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-medium text-[#1F1F1F] dark:text-white">AI Breaking RSS Feeds</span>
                </div>
              </div>

              {liveSyncResult && (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-3 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{liveSyncResult}</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Multi-LLM API Keys & Dynamic Model Discovery */}
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
                          Dynamic model auto-discovery enables automatic failover across Gemini, Groq & OpenRouter without 404 errors.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleTestKey}
                      disabled={isTestingKey}
                      className="px-3.5 py-1.5 rounded-xl bg-black/[0.04] dark:bg-white/[0.06] hover:bg-[#4285F4]/10 hover:text-[#4285F4] text-xs font-medium transition shrink-0"
                    >
                      {isTestingKey ? "Auto-Discovering..." : "Test Latency"}
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
                          ? `✓ Connected via ${testResult.model} (${testResult.latencyMs}ms)`
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
                        placeholder="Enter Gemini API keys, comma-separated (discovers models dynamically)"
                        rows={2}
                        className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-[#1A1D24] border border-black/[0.08] dark:border-white/[0.08] text-xs font-mono focus:outline-none focus:border-[#4285F4]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#5F6368] dark:text-[#8E9196]">
                        Groq LPU API Keys (Tier 1 Instant Failover)
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
                        OpenRouter API Key (Tier 2 Free & Multimodal Failover)
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
              </div>

              {/* Quick Single-Tool Ingest & 1-Box Web Scraper */}
              <div className="lg:col-span-5 space-y-6">
                <div className="p-7 rounded-3xl bg-[#F0F4F9] dark:bg-[#131314] border border-black/[0.06] dark:border-white/[0.08] shadow-sm space-y-6">
                  {/* Top: 1-Click Auto-Research Web Scraper */}
                  <div className="space-y-3 pb-6 border-b border-black/[0.06] dark:border-white/[0.08]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-[#1F1F1F] dark:text-white">
                          Auto-Research by Name or URL
                        </h3>
                        <p className="text-[11px] text-[#5F6368] dark:text-[#8E9196]">
                          Enter any AI tool name or URL. Jina + LLM extracts all specs and publishes automatically.
                        </p>
                      </div>
                    </div>

                    <form onSubmit={handleAutoResearch} className="space-y-2.5">
                      <input
                        type="text"
                        value={autoResearchQuery}
                        onChange={(e) => setAutoResearchQuery(e.target.value)}
                        placeholder="e.g. Google Stitch or https://antigravity.google"
                        className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-[#1A1D24] border border-black/[0.08] dark:border-white/[0.08] text-xs focus:outline-none focus:border-[#4285F4]"
                      />
                      <button
                        type="submit"
                        disabled={isAutoResearching}
                        className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium shadow-sm transition flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        <Sparkles className={`w-3.5 h-3.5 ${isAutoResearching ? "animate-spin" : ""}`} />
                        <span>{isAutoResearching ? "Scraping & Researching..." : "Auto-Scrape & Publish"}</span>
                      </button>
                    </form>
                  </div>

                  {/* Manual Entry */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold text-[#5F6368] dark:text-[#8E9196] uppercase tracking-wider">
                      Or Manual Tool Entry
                    </h4>

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
            </div>
          </div>
        )}\n\n        {/* =====================================================================\n            TAB 4: DIRECTORY'''

new_content, count = re.subn(sync_pattern, new_sync_content, content)
print(f"Replaced {count} occurrences in admin/page.tsx")

# Add "Purge & Sync Live" button to directory header
dir_header_pattern = r'(<div className="flex items-center gap-3 w-full sm:w-auto">)'
dir_header_replacement = r'''\1
                  <button
                    onClick={() => handleLiveSync(true)}
                    disabled={isLiveSyncing}
                    className="px-3.5 py-1.5 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20 text-xs font-medium transition flex items-center gap-1.5 shrink-0 disabled:opacity-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{isLiveSyncing ? "Purging..." : "Wipe Seed Data & Sync Live"}</span>
                  </button>'''

new_content, count_dir = re.subn(dir_header_pattern, dir_header_replacement, new_content)
print(f"Replaced {count_dir} occurrences for directory header")

with open(path, 'w', encoding='utf-8') as f:
    f.write(new_content)
print("Finished updating admin/page.tsx")
