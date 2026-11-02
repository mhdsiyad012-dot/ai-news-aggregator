# Optimus Prime — Live AI Intelligence & Ecosystem Index

Optimus Prime is a premier Daily AI News Aggregator & Comprehensive AI Ecosystem Directory engineered with **Next.js 16 (App Router)**, **Tailwind CSS**, and **Google Gemini (3.8 Flash)**.

Designed with a strict anti-"AI slop" aesthetic inspired by **Linear, Vercel Geist, Raycast, and The Verge**: Deep Carbon Obsidian (`#09090B`), hairline borders (`#27272A`), Google Fonts (`Space Grotesk`, `Inter`, `JetBrains Mono`), and Signal Orange (`#F97316`) / Emerald (`#10B981`) telemetry.

---

## 🏛 Multi-Page Architecture

```
/
├── /                              # Overview Command Center: Top 4 Breaking Stories + Ecosystem Hubs
├── /news                          # Section 1: Daily AI News Wire + Gemini Executive Briefing + Live Search
├── /directory                     # Section 2: Dual-Filter AI Directory (Purpose + Company) + Gemini Live Lookup
└── /directory/:slug               # Dynamic AI Tool Specification Breakdown + Official Launch Actions
```

### Key Capabilities
1. **Live Data Pipeline**: Ingests real-time public feeds from Hacker News Algolia and Dev.to with relative/UTC timestamps and zero fake URLs.
2. **Gemini Intelligence**: Synthesizes the Daily Executive Briefing and on-demand 2-sentence technical takeaways using `gemini-3.8-flash`.
3. **Dual-Filter Directory**: Filter 45+ verified AI systems simultaneously by **Purpose/Category** AND **Company/Creator** with live URL search query synchronization.
4. **Gemini Live AI Lookup**: In real time, any unindexed AI tool searched by a user can be queried, structured, and presented via Gemini.

---

## 🚀 Getting Started

### 1. Environment Variables
Add your Google Gemini API Key to `.env` or `web/.env.local`:
```env
GEMINI_API_KEYS=your_gemini_api_key_here
```

### 2. Install & Run
```bash
cd web
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build
```bash
npm run build
npm run start
```
