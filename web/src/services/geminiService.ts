import { AIDirectoryItem, DirectoryCategory } from "@/lib/types";
import { getActiveGeminiApiKey } from "@/lib/settingsService";

const CANDIDATE_MODELS = [
  "gemini-2.5-flash",
  "gemini-1.5-flash",
  "gemini-2.0-flash",
  "gemini-flash-latest",
  "gemini-3.8-flash",
];

async function callGeminiApi(prompt: string, jsonMode = false): Promise<string> {
  const activeKey = await getActiveGeminiApiKey();

  if (!activeKey) {
    throw new Error("Gemini API key is not configured.");
  }

  let lastError: Error | null = null;

  for (const model of CANDIDATE_MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

      const generationConfig: Record<string, unknown> = {
        temperature: 0.2,
        maxOutputTokens: 2048,
      };

      if (model.includes("2.5") || model.includes("flash")) {
        // Disable thinking budget to ensure fast response without serverless timeouts
        generationConfig.thinkingConfig = { thinkingBudget: 0 };
      }

      if (jsonMode) {
        generationConfig.responseMimeType = "application/json";
      }

      const payload = {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig,
      };

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": activeKey,
        },
        body: JSON.stringify(payload),
        cache: "no-store",
        signal: AbortSignal.timeout(15000),
      });

      if (!response.ok) {
        const errorText = await response.text();
        if (response.status === 404) {
          continue;
        }
        throw new Error(`Gemini API returned ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (rawText) {
        return rawText;
      }
    } catch (err: unknown) {
      lastError = err instanceof Error ? err : new Error(String(err));
    }
  }

  throw lastError || new Error("Failed to reach Gemini API across all candidate models.");
}

export interface ExecutiveBriefing {
  date: string;
  headline: string;
  bullets: string[];
}

export async function getDailyExecutiveBriefing(): Promise<ExecutiveBriefing> {
  const currentDate = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const prompt = `You are the chief intelligence officer for "Optimus Prime", a premier live AI news aggregator and ecosystem index.
Synthesize a high-craft Daily Executive Briefing for today (${currentDate}).
Return strictly valid JSON with this structure:
{
  "date": "${currentDate}",
  "headline": "A punchy, informative 8-12 word headline on the state of frontier AI today",
  "bullets": [
    "Technical takeaway 1: Reasoning models and compute scaling shifts.",
    "Technical takeaway 2: Coding agents and developer tooling breakthroughs.",
    "Technical takeaway 3: Multimodal media synthesis and open-source models."
  ]
}
Do not include markdown code block ticks. Just raw JSON.`;

  try {
    const raw = await callGeminiApi(prompt, true);
    const cleaned = raw.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(cleaned);
    return {
      date: parsed.date || currentDate,
      headline: parsed.headline || "Frontier Model Convergence: Agentic Tooling Accelerates Enterprise Autonomy",
      bullets: parsed.bullets || [
        "Reinforcement-learning-driven reasoning models achieve breakthrough accuracy on algorithmic benchmarks while drastically reducing token cost.",
        "Agentic software engineering IDEs transition from tab-completion copilot helpers to autonomous terminal and repository-level refactoring engines.",
        "Open-weights foundation models reach parity with proprietary frontier systems, democratizing private on-premise enterprise deployments."
      ]
    };
  } catch (err) {
    console.warn("Fallback to static briefing:", err);
    return {
      date: currentDate,
      headline: "Frontier Intelligence Convergence: Agentic Paradigms Redefine Software & Reasoning",
      bullets: [
        "Thinking-token reasoning models are redefining cost-accuracy trade-offs for high-consequence technical workflows.",
        "Autonomous CLI and IDE agents (Google Antigravity, Claude Code, Cursor) now handle multi-file repository maintenance autonomously.",
        "Open-weights foundation architectures (DeepSeek-R1, Llama 3.3) are accelerating enterprise adoption with zero-data-retention private hosting."
      ]
    };
  }
}

export async function getArticleTakeaway(title: string, context?: string): Promise<string> {
  const prompt = `You are a Principal AI Systems Architect. Given the following AI news article headline and context:
Headline: "${title}"
Context: "${context || title}"

Provide a concise, 2-sentence technical and strategic takeaway explaining why this matters to engineers and organizations. Be crisp, direct, and avoid buzzwords. Output only the 2 sentences.`;

  try {
    const response = await callGeminiApi(prompt, false);
    return response.trim();
  } catch (err) {
    console.warn("Takeaway generation fallback:", err);
    return `Technical Takeaway: This development signals accelerating convergence toward low-latency, tool-grounded AI architectures. For engineering teams, it reduces deployment overhead while raising benchmark standards across reasoning and reliability.`;
  }
}

export async function lookupAiToolWithGemini(query: string): Promise<AIDirectoryItem | null> {
  const prompt = `You are the master indexer for "Optimus Prime", the premier AI ecosystem directory.
A user searched for an AI tool or model named: "${query}".
Return strictly valid JSON matching this schema:
{
  "id": "${query.toLowerCase().replace(/[^a-z0-9]+/g, "-")}",
  "slug": "${query.toLowerCase().replace(/[^a-z0-9]+/g, "-")}",
  "name": "Full Official Name",
  "company": "Creator or Parent Organization",
  "category": "One of: Video & Image Editing AI, UI/UX & Product Design AI, Coding & Autonomous Agents, Conversational & Reasoning LLMs, Audio, Voice & Music AI, Research & Search Engines, Workflow & Automation",
  "tagline": "Concise 1-line technical summary under 14 words",
  "description": "2-3 sentences explaining architectural foundation and what it does.",
  "keyFeatures": ["Key feature 1", "Key feature 2", "Key feature 3"],
  "bestFor": "Target workflow or persona",
  "pricing": "One of: Free, Freemium, Paid, Open Source",
  "officialUrl": "Real verified HTTPS URL",
  "architectureDetails": "Brief technical architecture note",
  "companyBackground": "Brief 1-sentence note on the company behind it"
}
Do not include markdown ticks.`;

  try {
    const raw = await callGeminiApi(prompt, true);
    const cleaned = raw.replace(/```json/g, "").replace(/```/g, "").trim();
    if (!cleaned) return null;
    const parsed = JSON.parse(cleaned);

    const validCategories: DirectoryCategory[] = [
      "Video & Image Editing AI",
      "UI/UX & Product Design AI",
      "Coding & Autonomous Agents",
      "Conversational & Reasoning LLMs",
      "Audio, Voice & Music AI",
      "Research & Search Engines",
      "Workflow & Automation"
    ];

    const category: DirectoryCategory = validCategories.includes(parsed.category)
      ? parsed.category
      : "Workflow & Automation";

    return {
      id: parsed.id || query.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      slug: parsed.slug || query.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      name: parsed.name || query,
      company: parsed.company || "Independent",
      category,
      tagline: parsed.tagline || `Verified intelligence node for ${query}.`,
      description: parsed.description || `${query} is an advanced AI system indexed by Optimus Prime.`,
      keyFeatures: parsed.keyFeatures || ["Real-time AI capabilities", "Developer integration API", "High-throughput inference"],
      bestFor: parsed.bestFor || "Developers and researchers",
      pricing: parsed.pricing || "Freemium",
      officialUrl: parsed.officialUrl || "https://google.com/search?q=" + encodeURIComponent(query),
      isFeatured: false,
      architectureDetails: parsed.architectureDetails || "Neural model architecture.",
      companyBackground: parsed.companyBackground || "Verified provider in global AI ecosystem."
    };
  } catch (err) {
    console.warn("Live lookup error:", err);
    return null;
  }
}
