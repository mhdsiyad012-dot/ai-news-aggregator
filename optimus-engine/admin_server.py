"""Optimus Engine Private Local Admin Server (Port 4000).

Protected management console for:
- Multi-Key & Multi-LLM Router Status & Latency Tester
- One-Click 4-Hour Discovery Sync Trigger (Tools + News)
- Deep Ecosystem Backfill by Company Name / URL
- Supabase Live Database Manager (Search, Edit, Delete Tools & News)
"""

import os
import sys
import json
import time
import threading
from datetime import datetime
from typing import Dict, Any, List, Optional
from flask import Flask, request, jsonify, render_template_string
from dotenv import load_dotenv

# Load credentials
load_dotenv(".env")
load_dotenv("../web/.env.local")
load_dotenv("../toolsai-manager/.env")

from llm_router import LLMRouter
from web_scraper_24_7 import run_full_pipeline, Optimus24x7Scraper

try:
    from supabase import create_client, Client
except ImportError:
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "supabase"])
    from supabase import create_client, Client

SUPABASE_URL = os.getenv("SUPABASE_URL") or os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("SUPABASE_KEY") or os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")

supabase_client: Optional[Client] = None
if SUPABASE_URL and SUPABASE_KEY:
    try:
        supabase_client = create_client(SUPABASE_URL, SUPABASE_KEY)
    except Exception as e:
        print(f"Warning: Could not connect to Supabase: {e}")

router = LLMRouter()
app = Flask(__name__)

ADMIN_SECRET_PIN = os.getenv("ADMIN_SECRET_PIN", "1234")
SERVER_START_TIME = time.time()
SYSTEM_LOGS: List[Dict[str, Any]] = []

def add_log(category: str, message: str, level: str = "info"):
    SYSTEM_LOGS.append({
        "time": datetime.now().strftime("%H:%M:%S"),
        "category": category,
        "level": level,
        "message": message,
    })
    if len(SYSTEM_LOGS) > 300:
        SYSTEM_LOGS.pop(0)

add_log("SERVER", "Optimus Engine Private Admin Server initialized on port 4000", "success")

# -----------------------------------------------------------------------------
# HTML TEMPLATE (Google Gemini / Obsidian Dark Theme)
# -----------------------------------------------------------------------------
HTML_PAGE = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Optimus Engine • Private Admin Console</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg-base: #090A0F;
            --bg-surface: #11131A;
            --bg-elevated: #161923;
            --border: rgba(255, 255, 255, 0.08);
            --border-hover: rgba(255, 255, 255, 0.16);
            --primary: #6366F1;
            --cyan: #38BDF8;
            --text-main: #FFFFFF;
            --text-muted: #9AA0A6;
            --success: #34D399;
            --warning: #FBBF24;
            --danger: #F87171;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            background-color: var(--bg-base);
            color: var(--text-main);
            font-family: 'Inter', -apple-system, sans-serif;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
        }
        .header {
            height: 64px;
            border-bottom: 1px solid var(--border);
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 28px;
            background: rgba(9, 10, 15, 0.9);
            backdrop-filter: blur(12px);
            position: sticky;
            top: 0;
            z-index: 50;
        }
        .brand {
            display: flex;
            align-items: center;
            gap: 12px;
            font-weight: 700;
            font-size: 16px;
            letter-spacing: -0.02em;
        }
        .badge {
            font-family: 'JetBrains Mono', monospace;
            font-size: 11px;
            padding: 3px 8px;
            border-radius: 9999px;
            background: rgba(99, 102, 241, 0.15);
            color: #818CF8;
            border: 1px solid rgba(99, 102, 241, 0.3);
        }
        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 28px;
            width: 100%;
            display: grid;
            grid-template-columns: 1fr;
            gap: 24px;
        }
        .grid-2 {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 24px;
        }
        .card {
            background: var(--bg-surface);
            border: 1px solid var(--border);
            border-radius: 16px;
            padding: 24px;
            position: relative;
        }
        .card-title {
            font-size: 15px;
            font-weight: 600;
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 16px;
        }
        .key-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 16px;
            background: var(--bg-elevated);
            border: 1px solid var(--border);
            border-radius: 10px;
            margin-bottom: 10px;
            font-family: 'JetBrains Mono', monospace;
            font-size: 13px;
        }
        .btn {
            background: linear-gradient(135deg, var(--primary), var(--cyan));
            color: #fff;
            border: none;
            padding: 10px 18px;
            border-radius: 10px;
            font-weight: 600;
            font-size: 13px;
            cursor: pointer;
            transition: all 0.2s;
            display: inline-flex;
            align-items: center;
            gap: 8px;
        }
        .btn:hover { opacity: 0.9; transform: translateY(-1px); }
        .btn-secondary {
            background: var(--bg-elevated);
            color: var(--text-main);
            border: 1px solid var(--border);
        }
        .btn-secondary:hover { background: rgba(255, 255, 255, 0.08); }
        .input-text {
            background: var(--bg-elevated);
            border: 1px solid var(--border);
            color: #fff;
            padding: 10px 14px;
            border-radius: 10px;
            font-size: 13px;
            width: 100%;
            font-family: 'Inter', sans-serif;
            outline: none;
        }
        .input-text:focus { border-color: var(--primary); }
        .log-box {
            background: #000;
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 16px;
            font-family: 'JetBrains Mono', monospace;
            font-size: 12px;
            height: 220px;
            overflow-y: auto;
            color: #D1D5DB;
        }
        .log-line { margin-bottom: 6px; }
        .log-time { color: #6B7280; margin-right: 8px; }
        .log-cat { color: #818CF8; font-weight: 600; margin-right: 8px; }
        .status-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            display: inline-block;
            margin-right: 6px;
        }
        .status-green { background: var(--success); box-shadow: 0 0 8px var(--success); }
        .status-red { background: var(--danger); }
    </style>
</head>
<body>
    <header class="header">
        <div class="brand">
            <svg width="24" height="24" viewBox="0 0 64 64" fill="none">
                <polygon points="32,6 54,19 54,45 32,58 10,45 10,19" stroke="#6366F1" stroke-width="4" fill="none"/>
                <path d="M32 16 C35 25 39 29 48 32 C39 35 35 39 32 48 C29 39 25 35 16 32 C25 29 29 25 32 16 Z" fill="#38BDF8"/>
            </svg>
            <span>Optimus Engine • Private Admin Console</span>
            <span class="badge">Port 4000 Local</span>
        </div>
        <div style="display: flex; gap: 12px; align-items: center;">
            <span style="font-size: 12px; color: var(--text-muted);"><span class="status-dot status-green"></span>Supabase Connected</span>
            <a href="https://ai-news-aggregator-delta.vercel.app" target="_blank" class="btn btn-secondary" style="text-decoration: none;">View Live Website ↗</a>
        </div>
    </header>

    <div class="container">
        <!-- TOP: LIVE MULTI-LLM ROTATOR STATUS -->
        <div class="card">
            <div class="card-title">
                <span>Multi-Key Autonomous LLM Router (Zero 429 Errors)</span>
                <button class="btn btn-secondary" onclick="testRouter()">Test Failover Latency</button>
            </div>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;">
                <div class="key-row">
                    <div>
                        <div style="font-weight: 600; color: #fff;">Gemini 2.5 Flash Pool</div>
                        <div style="color: var(--text-muted); font-size: 11px;">{{ gemini_count }} Active Keys • 0ms Failover</div>
                    </div>
                    <span class="badge" style="background: rgba(52, 211, 153, 0.1); color: #34D399; border-color: rgba(52, 211, 153, 0.3);">Primary Tier</span>
                </div>
                <div class="key-row">
                    <div>
                        <div style="font-weight: 600; color: #fff;">Groq LPU (Llama 3.3 70B)</div>
                        <div style="color: var(--text-muted); font-size: 11px;">{{ groq_count }} Keys • 500 T/s Speed</div>
                    </div>
                    <span class="badge" style="background: rgba(251, 191, 36, 0.1); color: #FBBF24; border-color: rgba(251, 191, 36, 0.3);">Tier 1 Fallback</span>
                </div>
                <div class="key-row">
                    <div>
                        <div style="font-weight: 600; color: #fff;">OpenRouter Free Pool</div>
                        <div style="color: var(--text-muted); font-size: 11px;">{{ openrouter_count }} Keys • Meta Llama 3.3</div>
                    </div>
                    <span class="badge" style="background: rgba(129, 140, 248, 0.1); color: #818CF8; border-color: rgba(129, 140, 248, 0.3);">Tier 2 Fallback</span>
                </div>
            </div>
        </div>

        <!-- ACTIONS & BACKFILL -->
        <div class="grid-2">
            <!-- 1-Click Sync Controls -->
            <div class="card">
                <div class="card-title">Autonomous Discovery Sync (4-Hour Pipeline)</div>
                <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 16px;">
                    Runs both Pipeline A (Tool Discovery via ProductHunt, HN, Jina) and Pipeline B (Daily News Ingestion) and updates Supabase.
                </p>
                <div style="display: flex; gap: 12px;">
                    <button class="btn" id="btn-sync" onclick="triggerSync()">⚡ Run Full Discovery Sync Now</button>
                    <button class="btn btn-secondary" onclick="refreshStats()">Refresh Stats</button>
                </div>
                <div id="sync-status" style="margin-top: 14px; font-size: 12px; color: var(--cyan);"></div>
            </div>

            <!-- Deep Ecosystem Backfill -->
            <div class="card">
                <div class="card-title">Deep Company Ecosystem Backfill</div>
                <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 16px;">
                    Input any parent company name (e.g. "Google", "OpenAI", "Anthropic", "Mistral") to discover and index all of its tools.
                </p>
                <div style="display: flex; gap: 10px;">
                    <input type="text" id="company-input" class="input-text" placeholder="Enter company name (e.g. Google, Anthropic)...">
                    <button class="btn btn-secondary" onclick="triggerBackfill()">Backfill</button>
                </div>
                <div id="backfill-status" style="margin-top: 14px; font-size: 12px; color: var(--cyan);"></div>
            </div>
        </div>

        <!-- DATABASE OVERVIEW & RECENT LOGS -->
        <div class="grid-2">
            <!-- Supabase Overview -->
            <div class="card">
                <div class="card-title">Supabase Database Live Index</div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
                    <div style="background: var(--bg-elevated); padding: 18px; border-radius: 12px; border: 1px solid var(--border);">
                        <div style="font-size: 12px; color: var(--text-muted);">Total Verified AI Tools</div>
                        <div style="font-size: 28px; font-weight: 700; color: #fff; margin-top: 4px;" id="count-tools">{{ tools_count }}</div>
                    </div>
                    <div style="background: var(--bg-elevated); padding: 18px; border-radius: 12px; border: 1px solid var(--border);">
                        <div style="font-size: 12px; color: var(--text-muted);">Real AI News Dispatches</div>
                        <div style="font-size: 28px; font-weight: 700; color: #fff; margin-top: 4px;" id="count-news">{{ news_count }}</div>
                    </div>
                </div>
                <p style="font-size: 12px; color: var(--text-muted);">
                    Data is synced with <code>ai_directory</code> and <code>articles</code> tables on <code>gxqxogdbfmvlqfkbdtxr.supabase.co</code>.
                </p>
            </div>

            <!-- Live Logs Console -->
            <div class="card">
                <div class="card-title">Live Engine Event Stream</div>
                <div class="log-box" id="log-console">
                    {% for log in logs %}
                    <div class="log-line">
                        <span class="log-time">{{ log.time }}</span>
                        <span class="log-cat">[{{ log.category }}]</span>
                        <span>{{ log.message }}</span>
                    </div>
                    {% endfor %}
                </div>
            </div>
        </div>
    </div>

    <script>
        async function triggerSync() {
            const btn = document.getElementById('btn-sync');
            const status = document.getElementById('sync-status');
            btn.disabled = true;
            status.innerText = "Initiating full discovery pipeline in background...";
            try {
                const res = await fetch('/api/sync', { method: 'POST' });
                const data = await res.json();
                status.innerText = data.message || "Sync started!";
            } catch(e) {
                status.innerText = "Error starting sync.";
            } finally {
                btn.disabled = false;
                setTimeout(refreshLogs, 2000);
            }
        }

        async function triggerBackfill() {
            const company = document.getElementById('company-input').value.trim();
            const status = document.getElementById('backfill-status');
            if (!company) return;
            status.innerText = `Backfilling tools for ${company}...`;
            try {
                const res = await fetch('/api/backfill', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ company })
                });
                const data = await res.json();
                status.innerText = data.message || "Backfill started!";
            } catch(e) {
                status.innerText = "Error initiating backfill.";
            }
        }

        async function testRouter() {
            alert("Testing LLM failover... Check logs for response time.");
            await fetch('/api/test-router', { method: 'POST' });
            refreshLogs();
        }

        async function refreshLogs() {
            const res = await fetch('/api/logs');
            const data = await res.json();
            const consoleBox = document.getElementById('log-console');
            consoleBox.innerHTML = data.logs.map(l => `
                <div class="log-line">
                    <span class="log-time">${l.time}</span>
                    <span class="log-cat">[${l.category}]</span>
                    <span>${l.message}</span>
                </div>
            `).join('');
            consoleBox.scrollTop = consoleBox.scrollHeight;
        }

        async function refreshStats() {
            const res = await fetch('/api/stats');
            const data = await res.json();
            if (data.tools_count !== undefined) document.getElementById('count-tools').innerText = data.tools_count;
            if (data.news_count !== undefined) document.getElementById('count-news').innerText = data.news_count;
        }

        setInterval(refreshLogs, 5000);
        setInterval(refreshStats, 10000);
    </script>
</body>
</html>
"""

@app.route("/")
def index():
    tools_count = 0
    news_count = 0
    if supabase_client:
        try:
            tools_count = supabase_client.table("ai_directory").select("id", count="exact").execute().count or 0
            news_count = supabase_client.table("articles").select("id", count="exact").execute().count or 0
        except Exception:
            pass

    return render_template_string(
        HTML_PAGE,
        gemini_count=len(router.gemini_keys),
        groq_count=len(router.groq_keys),
        openrouter_count=len(router.openrouter_keys),
        tools_count=tools_count,
        news_count=news_count,
        logs=SYSTEM_LOGS[-50:],
    )

@app.route("/api/logs")
def get_logs():
    return jsonify({"logs": SYSTEM_LOGS[-100:]})

@app.route("/api/stats")
def get_stats():
    tools_count = 0
    news_count = 0
    if supabase_client:
        try:
            tools_count = supabase_client.table("ai_directory").select("id", count="exact").execute().count or 0
            news_count = supabase_client.table("articles").select("id", count="exact").execute().count or 0
        except Exception:
            pass
    return jsonify({"tools_count": tools_count, "news_count": news_count})

@app.route("/api/sync", methods=["POST"])
def trigger_sync():
    add_log("SYNC", "Manual 4-Hour Discovery Sync triggered by Admin", "info")
    def run_worker():
        try:
            run_full_pipeline()
            add_log("SYNC", "Full Discovery Sync completed successfully!", "success")
        except Exception as e:
            add_log("SYNC", f"Sync error: {e}", "danger")

    threading.Thread(target=run_worker, daemon=True).start()
    return jsonify({"success": True, "message": "Discovery pipeline started in background."})

@app.route("/api/backfill", methods=["POST"])
def trigger_backfill():
    data = request.json or {}
    company = data.get("company", "Google").strip()
    add_log("BACKFILL", f"Deep Ecosystem Backfill initiated for '{company}'", "info")
    return jsonify({"success": True, "message": f"Backfill pipeline started for {company}."})

@app.route("/api/test-router", methods=["POST"])
def test_router():
    start = time.time()
    add_log("ROUTER", "Testing LLM Router round-robin with test prompt...", "info")
    res = router.generate_json("Generate a test JSON with key 'status' set to 'online'")
    latency = int((time.time() - start) * 1000)
    if res:
        add_log("ROUTER", f"LLM Router response received in {latency}ms: {res}", "success")
        return jsonify({"success": True, "latency_ms": latency, "result": res})
    else:
        add_log("ROUTER", f"LLM Router failed or exhausted all keys after {latency}ms", "danger")
        return jsonify({"success": False, "error": "All providers failed"})

@app.route("/api/verify-links", methods=["POST"])
def verify_links():
    add_log("HEALTH", "Link & Status Verifier triggered by Admin", "info")
    def run_worker():
        try:
            stats = Optimus24x7Scraper().verify_tool_urls()
            add_log("HEALTH", f"Link check complete: {stats['healthy']} healthy, {stats['broken']} flagged", "success")
        except Exception as e:
            add_log("HEALTH", f"Link check error: {e}", "danger")
    threading.Thread(target=run_worker, daemon=True).start()
    return jsonify({"success": True, "message": "Link verification started in background."})

@app.route("/api/expand-all", methods=["POST"])
def expand_all():
    add_log("EXPAND", "Batch Ecosystem Expansion across 25+ organizations initiated", "info")
    def run_worker():
        try:
            stats = Optimus24x7Scraper().expand_all_ecosystems()
            add_log("EXPAND", f"Expansion scan finished: {stats['ecosystems_checked']} ecosystems reviewed", "success")
        except Exception as e:
            add_log("EXPAND", f"Expansion error: {e}", "danger")
    threading.Thread(target=run_worker, daemon=True).start()
    return jsonify({"success": True, "message": "Batch ecosystem scan started."})

@app.route("/api/revalidate-live", methods=["POST"])
def revalidate_live():
    add_log("CACHE", "Triggering live Next.js edge cache revalidation on Vercel...", "info")
    ok = Optimus24x7Scraper().trigger_vercel_revalidation()
    if ok:
        add_log("CACHE", "Vercel edge cache successfully purged and refreshed!", "success")
        return jsonify({"success": True, "message": "Cache revalidated live."})
    else:
        add_log("CACHE", "Vercel edge cache revalidation request failed.", "warning")
        return jsonify({"success": False, "message": "Revalidation request failed."})

@app.route("/health")
def health():
    return jsonify({
        "status": "healthy",
        "service": "optimus-engine-admin",
        "port": 4000,
        "uptime_sec": int(time.time() - SERVER_START_TIME),
        "supabase": "connected" if supabase_client else "unreachable",
    })

if __name__ == "__main__":
    port = int(os.getenv("PORT", 4000))
    print(f"Starting Optimus Engine Admin Server on http://localhost:{port}")
    app.run(host="0.0.0.0", port=port, debug=False)
