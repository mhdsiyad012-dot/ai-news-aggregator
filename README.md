# AI Intelligence Wire // AI Models & Agents Directory

An industrial-grade editorial intelligence platform and technical directory built with **Next.js (App Router)**, **Tailwind CSS**, **Supabase (PostgreSQL)**, and **Google Gemini 2.0**. Engineered in a multi-folder architecture for **Vercel** deployment with an **Admin Control Center** and autonomous background pipelines running via **GitHub Actions**.

---

## ⚡ Architecture Overview

```
ai-news-aggregator/
├── .github/workflows/
│   └── news_bot.yml          # Runs `python pipeline/ai_journalist.py` daily at 7:30 AM IST
├── pipeline/                 # Python backend scripts
│   ├── ai_journalist.py      # Multi-source RSS + Gemini summarizer + auto-tagging
│   ├── seed_directory.py     # Seeds 22+ premier AI Models, Agents & IDEs into Supabase
│   ├── database.py           # Supabase SQLAlchemy connection (articles + ai_directory tables)
│   └── requirements.txt      # Python dependencies for GitHub Actions
├── sql/
│   ├── 001_create_articles.sql      # Initial schema
│   ├── 002_create_ai_directory.sql  # Directory schema
│   └── 003_complete_schema.sql      # Complete consolidated schema + RLS policies
├── web/                      # Next.js (App Router) + TypeScript + Tailwind CSS frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx      # Main Hub (Daily Wire + AI Directory tabs)
│   │   │   ├── layout.tsx    # Geist/Inter + JetBrains Mono fonts & dark theme
│   │   │   ├── admin/
│   │   │   │   └── page.tsx  # Protected Admin Control Center (Full CRUD)
│   │   │   └── api/
│   │   │       ├── news/route.ts      # GET/POST/PUT/DELETE articles in Supabase
│   │   │       ├── directory/route.ts # GET/POST/PUT/DELETE AI models in Supabase
│   │   │       └── admin/
│   │   │           ├── auth/route.ts  # Admin passcode verification
│   │   │           └── seed/route.ts  # Re-seed directory action
│   │   ├── components/
│   │   │   ├── Navbar.tsx             # Telemetry ticker & view switcher
│   │   │   ├── NewsFeed.tsx           # Daily Wire with pinned articles
│   │   │   ├── AiDirectory.tsx        # Technical model catalogue & featured badges
│   │   │   ├── ModelDetailDrawer.tsx  # Slide-over right-hand specification panel
│   │   │   └── CompareModal.tsx       # Side-by-side comparison matrix (up to 3 tools)
│   │   └── lib/
│   │       ├── supabase.ts   # Server/Client DB connection using DATABASE_URL
│   │       ├── types.ts      # TypeScript interfaces
│   │       └── data/
│   │           ├── directoryData.ts   # 22 premier AI models & agents
│   │           └── newsData.ts        # Seed breaking articles
│   ├── package.json
│   └── tailwind.config.ts
├── vercel.json               # Configured for web/ build deployment
└── README.md
```

---

## 🎨 Industrial Editorial Design System

- **Strict Industrial Dark Palette**: `#09090B` background, `#121215` cards/surfaces, and `1px #27272A` borders.
- **High-Contrast Typography**: Modern sans (Inter / Geist) for headlines, paired with strict monospace (Geist / JetBrains Mono) for tags, telemetry metrics, shortcuts, and code slugs.
- **Zero Generic Neon/Bubbly AI Templates**: Sharp, tactile, engineering-first aesthetic inspired by Swiss typography and modern high-frequency developer consoles.

---

## 🚀 Core Frontend Features (`web/`)

1. **Top Navigation & Telemetry** (`Navbar.tsx`):
   - Instant toggle between **[01] Daily News Wire** and **[02] AI Models & Agents Directory**.
   - Real-time live status indicator and indexed metrics counter.
   - Quick search trigger (`Ctrl+K` / `⌘K`).
   - Direct link to the `/admin` control center.

2. **Daily News Wire** (`NewsFeed.tsx`):
   - Ingests multiple AI/technology RSS feeds (TechCrunch, The Verge, Ars Technica, MIT Tech Review, VentureBeat).
   - Auto-categorized by Gemini into **LLMs**, **Code Builders**, **Hardware**, **Robotics**, and **Startups**.
   - **Pinned Articles**: Important dispatches stay anchored at the top with an emerald pin badge.
   - Executive 2-sentence neutral summaries with publisher links and citation copy feature.

3. **AI Models & Agents Directory** (`AiDirectory.tsx`):
   - 22 premier released systems tracked: *Google Gemini 2.0, OpenAI Codex, Antigravity, Claude 3.7 Sonnet, Cursor, CrewAI, Windsurf, DeepSeek-V3/R1, Qwen 2.5, Llama 3.3, Kling AI, Sora, Perplexity, Vercel v0, GitHub Copilot, Devin, Mistral Large, Grok, Replit Agent, ElevenLabs, Midjourney, OpenAI Whisper*.
   - Filter pills: `All`, `Code Builders`, `Antigravity & IDEs`, `Autonomous Agents`, `Foundation LLMs`, `Media Gen`, `Frameworks`.
   - **Featured Models**: Pinned to the top of the directory with a `FEATURED` badge.

4. **Slide-Over Right-Hand Inspector Drawer** (`ModelDetailDrawer.tsx`):
   - Clicking **"Inspect Specs →"** on any tool smoothly slides open a right-hand panel displaying:
     - Architectural deep dive & overview
     - Key capabilities & performance highlights
     - Recommended production engineering use cases
     - Pricing model & commercial licensing terms
     - Official portal launch button and copy endpoint action.

5. **Side-by-Side Comparison Matrix** (`CompareModal.tsx`):
   - Select up to **3 AI tools** simultaneously via the `+ Compare` button.
   - Launches a comparative matrix aligning purpose, pricing, capabilities, use cases, and official portals side by side.

---

## 🛡️ Full Admin Panel (`/admin`)

Password-protected administrative control center:
- **Authentication**: Gated with `ADMIN_PASSWORD` environment variable (default: `admin123`).
- **Overview Metrics Bar**: Real-time counter of total articles, indexed AI models, featured systems, and pinned stories.
- **Tab 1: AI Directory Manager (Full CRUD)**:
  - Add new AI model/agent with full specification form.
  - Edit existing models.
  - One-click toggle "Featured" status.
  - Delete outdated models with confirmation dialog.
- **Tab 2: News Wire Manager (Full CRUD)**:
  - Manually publish breaking stories or announcements.
  - Edit titles, summaries, or categories.
  - One-click toggle "Pin Story" to keep it anchored at top of the Daily Wire.
  - Delete duplicate or unwanted articles.
- **Tab 3: Database & Actions**:
  - Re-seed default AI directory items directly.
  - Direct link to trigger the GitHub Actions workflow manually.

---

## 🌐 Deploy to Vercel

In the Vercel dashboard:
1. Connect your GitHub repository.
2. Under **Project Settings**:
   - Set **Root Directory** to `web` (or rely on root `vercel.json`).
3. Add the following **Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase Project URL (`https://your-project.supabase.co`)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase Anon Key
   - `DATABASE_URL`: Your Supabase Postgres connection URI (Transaction Pooler port 6543)
   - `ADMIN_PASSWORD`: Your secret passcode for the `/admin` control center (default: `admin123`)
4. Click **Deploy**.

---

## 🤖 GitHub Actions Pipeline Setup

Runs daily at **07:30 IST / 02:00 UTC**:

In your GitHub repository, navigate to **Settings > Secrets and variables > Actions** and add:

| Secret Name | Value |
|---|---|
| `DATABASE_URL` | Supabase **Transaction pooler** URI (port `6543`) |
| `GEMINI_API_KEY` | Google AI Studio API key (from [aistudio.google.com](https://aistudio.google.com/app/apikey)) |

---

## 💻 Local Development

### 1. Run Frontend
```bash
cd web
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) (Hub) or [http://localhost:3000/admin](http://localhost:3000/admin) (Admin).

### 2. Run Python Data Pipeline
```bash
cd pipeline
pip install -r requirements.txt

# Seed 22 premier AI models into database
python seed_directory.py

# Ingest live feeds + Gemini summarization
python ai_journalist.py
```
