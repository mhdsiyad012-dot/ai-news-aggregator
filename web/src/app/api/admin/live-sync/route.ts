import { NextResponse } from "next/server";
import { checkRequestAdminAuth } from "@/lib/adminAuth";
import { supabaseAdmin, supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";
export const maxDuration = 60; // Allow full 60s for multi-source ingestion

interface OpenRouterModel {
  id: string;
  name?: string;
  created?: number;
  description?: string;
  context_length?: number;
  architecture?: {
    modality?: string;
    instruct_type?: string;
  };
  pricing?: {
    prompt?: string | number;
    completion?: string | number;
  };
}

interface HuggingFaceModel {
  id: string;
  likes?: number;
  downloads?: number;
  pipeline_tag?: string;
  lastModified?: string;
  tags?: string[];
}

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  owner?: { login: string };
  html_url: string;
  homepage?: string;
  description?: string;
  stargazers_count?: number;
  language?: string;
  pushed_at?: string;
}

// Canonical company mapper for OpenRouter models
function mapOpenRouterCompany(id: string): { company: string; officialUrl: string } {
  const lower = id.toLowerCase();
  if (lower.startsWith("google/")) return { company: "Google", officialUrl: "https://deepmind.google/models/gemini/" };
  if (lower.startsWith("openai/")) return { company: "OpenAI", officialUrl: "https://openai.com" };
  if (lower.startsWith("anthropic/")) return { company: "Anthropic", officialUrl: "https://www.anthropic.com" };
  if (lower.startsWith("x-ai/")) return { company: "xAI", officialUrl: "https://x.ai" };
  if (lower.startsWith("deepseek/")) return { company: "DeepSeek", officialUrl: "https://www.deepseek.com" };
  if (lower.startsWith("meta-llama/") || lower.startsWith("meta/")) return { company: "Meta", officialUrl: "https://llama.meta.com" };
  if (lower.startsWith("mistralai/")) return { company: "Mistral AI", officialUrl: "https://mistral.ai" };
  if (lower.startsWith("qwen/")) return { company: "Alibaba Qwen", officialUrl: "https://qwenlm.github.io" };
  if (lower.startsWith("cohere/")) return { company: "Cohere", officialUrl: "https://cohere.com" };
  if (lower.startsWith("minimax/")) return { company: "MiniMax", officialUrl: "https://www.minimaxi.com" };
  if (lower.startsWith("moonshotai/")) return { company: "Moonshot AI", officialUrl: "https://www.moonshot.cn" };
  if (lower.startsWith("z-ai/") || lower.startsWith("zhipu/")) return { company: "Zhipu AI", officialUrl: "https://zhipuai.cn" };
  if (lower.startsWith("nvidia/")) return { company: "NVIDIA", officialUrl: "https://build.nvidia.com" };
  if (lower.startsWith("microsoft/")) return { company: "Microsoft", officialUrl: "https://azure.microsoft.com" };
  if (lower.startsWith("amazon/") || lower.startsWith("nova/")) return { company: "Amazon", officialUrl: "https://aws.amazon.com/bedrock/" };

  const parts = id.split("/");
  const prefix = parts.length > 1 ? parts[0] : "Open Source";
  const capitalized = prefix.charAt(0).toUpperCase() + prefix.slice(1);
  return { company: capitalized, officialUrl: `https://openrouter.ai/${id}` };
}

// Clean HTML tags and entities
function cleanHtml(raw: string): string {
  if (!raw) return "";
  return raw
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export async function POST(request: Request) {
  if (!checkRequestAdminAuth(request)) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const shouldPurge = Boolean(body?.purge);
  return executeLiveSync(shouldPurge);
}

export async function GET(request: Request) {
  if (!checkRequestAdminAuth(request)) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const shouldPurge = searchParams.get("purge") === "true";
  return executeLiveSync(shouldPurge);
}

async function executeLiveSync(shouldPurge: boolean) {
  const client = supabaseAdmin || supabase;
  if (!client) {
    return NextResponse.json({ success: false, error: "Supabase client not initialized" }, { status: 500 });
  }

  try {
    if (shouldPurge) {
      await client.from("ai_directory").delete().neq("id", "___nonexistent___");
      await client.from("articles").delete().neq("id", "___nonexistent___");
    }

    const counts = {
      openrouter: 0,
      huggingface: 0,
      github: 0,
      news: 0,
    };

    const directoryRowsToUpsert: any[] = [];
    const newsRowsToUpsert: any[] = [];
    const nowIso = new Date().toISOString();

    // =========================================================================
    // SOURCE 1: OpenRouter Public Live Models Feed
    // =========================================================================
    try {
      const orRes = await fetch("https://openrouter.ai/api/v1/models", {
        headers: { "User-Agent": "Optimus-AI-Platform/1.0" },
        cache: "no-store",
        signal: AbortSignal.timeout(12000),
      });

      if (orRes.ok) {
        const orData = await orRes.json();
        const models: OpenRouterModel[] = Array.isArray(orData.data) ? orData.data : [];

        // Sort newest created models first
        models.sort((a, b) => (b.created || 0) - (a.created || 0));

        // Take the top 80 current models
        const selectedModels = models.slice(0, 80);

        for (const m of selectedModels) {
          const { company, officialUrl } = mapOpenRouterCompany(m.id);
          const slug = m.id.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
          const name = m.name || m.id.split("/")[1] || m.id;

          const isCoding =
            /code|coder|agent|deepcoder/i.test(m.id) ||
            /code|coder|agent/i.test(name) ||
            /coding|agentic/i.test(m.description || "");

          const isVision =
            /vision|image|vl|multimodal/i.test(m.id) ||
            /multimodal|vision/i.test(m.description || "");

          let category = "Conversational & Reasoning LLMs";
          if (isCoding) category = "Coding & Autonomous Agents";
          else if (isVision) category = "Video & Image Editing AI";

          const promptCost = Number(m.pricing?.prompt || 0);
          const compCost = Number(m.pricing?.completion || 0);
          const isFree = promptCost === 0 && compCost === 0;
          const pricing = isFree ? "Free" : "Paid";

          const promptStr = (promptCost * 1000000).toFixed(2);
          const compStr = (compCost * 1000000).toFixed(2);
          const ctxStr = (m.context_length || 128000).toLocaleString();

          const tagline = m.description
            ? m.description.split(". ")[0].slice(0, 130) + "."
            : `Live frontier model by ${company} with ${ctxStr} token context.`;

          const keyFeatures = [
            `Context Window: ${ctxStr} tokens`,
            isFree ? "Free API Access Tier" : `Input: $${promptStr} / 1M | Output: $${compStr} / 1M`,
            `Architecture: ${m.architecture?.modality || "Text & Code Multimodal"}`,
            `Direct OpenRouter Endpoint: ${m.id}`,
          ];

          const isFeatured =
            Boolean(m.created && m.created > 1730000000) &&
            ["Google", "OpenAI", "Anthropic", "xAI", "DeepSeek", "Meta"].includes(company);

          directoryRowsToUpsert.push({
            id: slug,
            slug,
            name,
            company,
            category,
            secondary_categories: [],
            tagline,
            description: m.description || `${name} is an active frontier AI system by ${company}.`,
            key_features: keyFeatures,
            best_for: m.architecture?.modality ? `${m.architecture.modality} reasoning and production workflows` : "Frontier reasoning, chat, and agentic workflows",
            pricing,
            official_url: officialUrl,
            is_featured: isFeatured,
            architecture_details: `Live OpenRouter telemetry: ${m.id} | Context: ${ctxStr}`,
            company_background: `Maintained by ${company}.`,
            related_tool_slugs: [],
            updated_at: nowIso,
          });

          counts.openrouter++;
        }
      }
    } catch (err) {
      console.warn("OpenRouter live sync failed:", err);
    }

    // =========================================================================
    // SOURCE 2: Hugging Face Trending Models
    // =========================================================================
    try {
      const hfRes = await fetch("https://huggingface.co/api/models?sort=trendingScore&direction=-1&limit=25", {
        headers: { "User-Agent": "Optimus-AI-Platform/1.0" },
        cache: "no-store",
        signal: AbortSignal.timeout(10000),
      });

      if (hfRes.ok) {
        const hfModels: HuggingFaceModel[] = await hfRes.json();
        for (const m of hfModels) {
          const parts = m.id.split("/");
          const author = parts.length > 1 ? parts[0] : "Open Source";
          const rawName = parts.length > 1 ? parts[1] : parts[0];
          const slug = m.id.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

          let category = "Conversational & Reasoning LLMs";
          if (m.pipeline_tag) {
            if (/image|video|diffusion/i.test(m.pipeline_tag)) category = "Video & Image Editing AI";
            else if (/audio|speech|voice/i.test(m.pipeline_tag)) category = "Audio, Voice & Music AI";
            else if (/code|agent/i.test(m.pipeline_tag)) category = "Coding & Autonomous Agents";
          }

          const likes = m.likes || 0;
          const downloads = m.downloads || 0;

          directoryRowsToUpsert.push({
            id: slug,
            slug,
            name: rawName,
            company: author,
            category,
            secondary_categories: [],
            tagline: `Trending on Hugging Face with ${likes.toLocaleString()} likes and ${downloads.toLocaleString()} downloads.`,
            description: `Trending open-weights AI model ${m.id} on Hugging Face. Pipeline: ${m.pipeline_tag || "open-weights"}. Last updated: ${m.lastModified || "recent"}.`,
            key_features: [
              `Hugging Face Trending Score Top-25`,
              `${likes.toLocaleString()} Community Likes`,
              `${downloads.toLocaleString()} Monthly Downloads`,
              `Pipeline: ${m.pipeline_tag || "general"}`,
            ],
            best_for: m.pipeline_tag ? `Specialized ${m.pipeline_tag} tasks` : "Open-source research and local deployment",
            pricing: "Open Source",
            official_url: `https://huggingface.co/${m.id}`,
            is_featured: likes > 400,
            architecture_details: `Hugging Face Repository: ${m.id}`,
            company_background: `Open source AI by ${author}.`,
            related_tool_slugs: [],
            updated_at: nowIso,
          });

          counts.huggingface++;
        }
      }
    } catch (err) {
      console.warn("Hugging Face live sync failed:", err);
    }

    // =========================================================================
    // SOURCE 3: GitHub Trending AI Tools & Agents
    // =========================================================================
    try {
      const q = encodeURIComponent("ai agent stars:>1000");
      const ghRes = await fetch(`https://api.github.com/search/repositories?q=${q}&sort=stars&order=desc&per_page=25`, {
        headers: {
          "User-Agent": "Optimus-AI-Platform/1.0",
          Accept: "application/vnd.github.v3+json",
        },
        cache: "no-store",
        signal: AbortSignal.timeout(10000),
      });

      if (ghRes.ok) {
        const ghData = await ghRes.json();
        const repos: GitHubRepo[] = Array.isArray(ghData.items) ? ghData.items : [];

        for (const repo of repos) {
          const slug = `gh-${repo.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
          const stars = repo.stargazers_count || 0;
          const owner = repo.owner?.login || "Open Source";

          directoryRowsToUpsert.push({
            id: slug,
            slug,
            name: repo.name,
            company: owner,
            category: "Coding & Autonomous Agents",
            secondary_categories: [],
            tagline: repo.description ? repo.description.slice(0, 140) : `Open-source autonomous AI tool with ${stars.toLocaleString()} stars.`,
            description: repo.description || `Autonomous AI agent repository ${repo.full_name} on GitHub.`,
            key_features: [
              `${stars.toLocaleString()} GitHub Stars`,
              `Primary Language: ${repo.language || "Python / TypeScript"}`,
              `Open Source Repository: ${repo.full_name}`,
              `Real-time Developer Activity`,
            ],
            best_for: "Software engineers building autonomous agent workflows and local LLM pipelines",
            pricing: "Open Source",
            official_url: repo.homepage && repo.homepage.startsWith("http") ? repo.homepage : repo.html_url,
            is_featured: stars > 5000,
            architecture_details: `GitHub Open Source: ${repo.html_url}`,
            company_background: `Maintained by ${owner}.`,
            related_tool_slugs: [],
            updated_at: nowIso,
          });

          counts.github++;
        }
      }
    } catch (err) {
      console.warn("GitHub live sync failed:", err);
    }

    // Upsert all directory models in batches of 50
    if (directoryRowsToUpsert.length > 0) {
      for (let i = 0; i < directoryRowsToUpsert.length; i += 50) {
        const batch = directoryRowsToUpsert.slice(i, i + 50);
        await client.from("ai_directory").upsert(batch, { onConflict: "slug" });
      }
    }

    // =========================================================================
    // SOURCE 4: Live AI News RSS Scraper (Google AI, TechCrunch, Verge, etc.)
    // =========================================================================
    const rssFeeds = [
      { name: "Google AI Blog", url: "https://blog.google/technology/ai/rss/", domain: "blog.google" },
      { name: "TechCrunch AI", url: "https://techcrunch.com/category/artificial-intelligence/feed/", domain: "techcrunch.com" },
      { name: "The Verge AI", url: "https://www.theverge.com/rss/ai-artificial-intelligence/index.xml", domain: "theverge.com" },
      { name: "MIT Tech Review AI", url: "https://www.technologyreview.com/feed/", domain: "technologyreview.com" },
    ];

    for (const feed of rssFeeds) {
      try {
        const res = await fetch(feed.url, {
          headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
          cache: "no-store",
          signal: AbortSignal.timeout(8000),
        });

        if (res.ok) {
          const xmlText = await res.text();
          // Match <item> blocks or <entry> blocks
          const itemRegex = /<(?:item|entry)[\s>]([\s\S]*?)<\/(?:item|entry)>/gi;
          let match: RegExpExecArray | null;

          while ((match = itemRegex.exec(xmlText)) !== null) {
            const itemBlock = match[1];

            const titleMatch = itemBlock.match(/<title[\s>]([\s\S]*?)<\/title>/i);
            const linkMatch = itemBlock.match(/<link[\s>]([\s\S]*?)<\/link>/i) || itemBlock.match(/<link[^>]+href=["']([^"']+)["']/i);
            const pubDateMatch = itemBlock.match(/<(?:pubDate|published|updated)[\s>]([\s\S]*?)<\/(?:pubDate|published|updated)>/i);
            const descMatch = itemBlock.match(/<(?:description|summary|content:encoded)[\s>]([\s\S]*?)<\/(?:description|summary|content:encoded)>/i);

            const title = cleanHtml(titleMatch ? titleMatch[1] : "");
            let link = linkMatch ? (linkMatch[1] || "").trim() : "";
            if (link.startsWith("<![CDATA[")) {
              link = link.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").trim();
            }

            if (!title || !link || !link.startsWith("http")) continue;

            const rawDate = pubDateMatch ? cleanHtml(pubDateMatch[1]) : "";
            let publishedAt = nowIso;
            if (rawDate) {
              const parsed = new Date(rawDate);
              if (!isNaN(parsed.getTime())) publishedAt = parsed.toISOString();
            }

            const rawDesc = descMatch ? cleanHtml(descMatch[1]) : "";
            const summary = rawDesc.length > 30 ? rawDesc.slice(0, 320) + "..." : title;
            const aiTakeaway = summary.split(". ")[0].slice(0, 200) + ".";

            let category = "Frontier Models";
            const lowerContent = (title + " " + summary).toLowerCase();
            if (/agent|code|coder|cli|terminal|ide/i.test(lowerContent)) category = "Coding & Agents";
            else if (/chip|gpu|hardware|datacenter|tpu/i.test(lowerContent)) category = "Hardware & Chips";
            else if (/open-source|weights|llama|deepseek|hugging/i.test(lowerContent)) category = "Open Source";
            else if (/image|video|design|flux|suno|runway/i.test(lowerContent)) category = "Design & Media";
            else if (/policy|regulation|governance|enterprise/i.test(lowerContent)) category = "Enterprise & Policy";

            newsRowsToUpsert.push({
              title,
              summary,
              url: link,
              category,
              source_domain: feed.domain,
              relative_time: publishedAt.split("T")[0],
              published_at: publishedAt,
              ai_takeaway: aiTakeaway,
              is_pinned: /gemini|gpt|claude|deepseek|grok/i.test(title),
              score: 0,
              comments_count: 0,
            });

            counts.news++;
          }
        }
      } catch (feedErr) {
        console.warn(`Feed ${feed.name} error:`, feedErr);
      }
    }

    // Upsert news articles in batches
    if (newsRowsToUpsert.length > 0) {
      for (let i = 0; i < newsRowsToUpsert.length; i += 50) {
        const batch = newsRowsToUpsert.slice(i, i + 50);
        await client.from("articles").upsert(batch, { onConflict: "url" });
      }
    }

    revalidatePath("/");
    revalidatePath("/models");
    revalidatePath("/ecosystems");
    revalidatePath("/compare");
    revalidatePath("/news");
    revalidatePath("/directory");

    return NextResponse.json({
      success: true,
      message: `Live Internet Sync Complete! Synced ${counts.openrouter} OpenRouter models, ${counts.huggingface} Hugging Face models, ${counts.github} GitHub AI tools, and ${counts.news} breaking news articles.`,
      counts,
      totalModels: directoryRowsToUpsert.length,
      totalNews: newsRowsToUpsert.length,
      purgedOldSeedData: shouldPurge,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Live sync failed";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
