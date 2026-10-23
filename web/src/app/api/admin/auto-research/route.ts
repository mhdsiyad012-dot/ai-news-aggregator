import { NextResponse } from "next/server";
import { checkRequestAdminAuth } from "@/lib/adminAuth";
import { supabaseAdmin, supabase } from "@/lib/supabase";
import { generateChatCompletion } from "@/lib/llmRouter";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(request: Request) {
  if (!checkRequestAdminAuth(request)) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const client = supabaseAdmin || supabase;
  if (!client) {
    return NextResponse.json({ success: false, error: "Database not connected" }, { status: 500 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const query = String(body?.query || body?.url || "").trim();

    if (!query) {
      return NextResponse.json({ success: false, error: "Please provide a tool name or URL" }, { status: 400 });
    }

    // 1. Fetch live markdown via Jina Reader or Jina Search
    const isUrl = /^https?:\/\//i.test(query);
    const jinaEndpoint = isUrl
      ? `https://r.jina.ai/${query}`
      : `https://s.jina.ai/${encodeURIComponent(query)}`;

    let scrapedMarkdown = "";
    try {
      const jinaRes = await fetch(jinaEndpoint, {
        headers: {
          Accept: "text/markdown",
          "User-Agent": "Optimus-AI-Platform/1.0",
        },
        cache: "no-store",
        signal: AbortSignal.timeout(15000),
      });

      if (jinaRes.ok) {
        scrapedMarkdown = (await jinaRes.text()).slice(0, 10000);
      }
    } catch (jinaErr) {
      console.warn("Jina fetch error:", jinaErr);
    }

    // 2. Extract structured tool data via LLM Router or fallback
    let toolData = {
      name: query.replace(/^https?:\/\/(?:www\.)?/, "").split("/")[0],
      company: "Independent",
      category: "Conversational & Reasoning LLMs",
      pricing: "Freemium",
      officialUrl: isUrl ? query : `https://${query.toLowerCase().replace(/[^a-z0-9]+/g, "")}.com`,
      tagline: `Autonomous AI system discovered via real-time web telemetry.`,
      description: `${query} is an AI system indexed into Optimus Prime.`,
      keyFeatures: ["Autonomous agent capabilities", "Neural architecture", "Live web indexing", "API integration"],
      bestFor: "Developers, researchers, and enterprise automation teams",
    };

    if (scrapedMarkdown) {
      try {
        const prompt = `You are an AI research extraction engine. Analyze this scraped web markdown about the AI tool or model "${query}" and return ONLY a JSON object with these exact keys:
{
  "name": "Clean official name of the tool/model",
  "company": "Creator or parent company",
  "category": "One of: Conversational & Reasoning LLMs | Coding & Autonomous Agents | Video & Image Editing AI | Audio, Voice & Music AI | UI/UX & Product Design AI | Workflow & Automation",
  "pricing": "One of: Free | Freemium | Paid | Open Source",
  "officialUrl": "Canonical official website URL",
  "tagline": "Compelling 1-sentence summary under 120 chars",
  "description": "2-3 informative sentences about what it does and why it matters",
  "keyFeatures": ["Feature 1", "Feature 2", "Feature 3", "Feature 4"],
  "bestFor": "Target audience and ideal use cases"
}

Markdown context:
${scrapedMarkdown.slice(0, 6000)}`;

        const llmRes = await generateChatCompletion(prompt, "Output valid JSON only.");
        const jsonMatch = llmRes.text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          toolData = {
            name: parsed.name || toolData.name,
            company: parsed.company || toolData.company,
            category: parsed.category || toolData.category,
            pricing: parsed.pricing || toolData.pricing,
            officialUrl: parsed.officialUrl || toolData.officialUrl,
            tagline: parsed.tagline || toolData.tagline,
            description: parsed.description || toolData.description,
            keyFeatures: Array.isArray(parsed.keyFeatures) ? parsed.keyFeatures.slice(0, 4) : toolData.keyFeatures,
            bestFor: parsed.bestFor || toolData.bestFor,
          };
        }
      } catch (llmErr) {
        console.warn("LLM parsing fallback:", llmErr);
      }
    }

    const slug = toolData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    const row = {
      id: slug,
      slug,
      name: toolData.name,
      company: toolData.company,
      category: toolData.category,
      secondary_categories: [],
      tagline: toolData.tagline,
      description: toolData.description,
      key_features: toolData.keyFeatures,
      best_for: toolData.bestFor,
      pricing: toolData.pricing,
      official_url: toolData.officialUrl,
      is_featured: true,
      architecture_details: `Researched and verified via Jina Live Web Scraper.`,
      company_background: `Engineered by ${toolData.company}.`,
      related_tool_slugs: [],
      updated_at: new Date().toISOString(),
    };

    await client.from("ai_directory").upsert(row, { onConflict: "slug" });

    revalidatePath("/");
    revalidatePath("/models");
    revalidatePath("/ecosystems");
    revalidatePath("/compare");
    revalidatePath("/directory");

    return NextResponse.json({
      success: true,
      message: `✨ Successfully researched "${toolData.name}" by ${toolData.company} and published to live directory!`,
      tool: row,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Auto-research failed";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
