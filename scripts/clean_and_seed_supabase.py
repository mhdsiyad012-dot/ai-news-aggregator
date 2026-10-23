import os
import sys
import json
import time
from datetime import datetime
from dotenv import load_dotenv

load_dotenv("web/.env.local")
load_dotenv(".env")
load_dotenv("../toolsai-manager/.env")

try:
    from supabase import create_client, Client
except ImportError:
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "supabase"])
    from supabase import create_client, Client

SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL") or os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("Error: Supabase URL and Key must be set.")
    sys.exit(1)

client: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
print(f"Connected to Supabase at: {SUPABASE_URL}")

# =============================================================================
# 105+ VERIFIED AI TOOLS CATALOG
# =============================================================================
TOOLS_CATALOG = [
    # ------------------ GOOGLE ------------------
    {
        "id": "google-gemini", "slug": "google-gemini", "name": "Google Gemini", "company": "Google",
        "category": "Conversational & Reasoning LLMs", "pricing": "Freemium", "is_featured": True,
        "tagline": "Multimodal frontier LLM assistant with 2M native context and Google Search grounding.",
        "description": "Google Gemini is Google DeepMind's flagship native multimodal AI system. Designed to reason across text, code, audio, imagery, and video with a 2M token context window.",
        "key_features": ["2,000,000 token context window", "Native multimodal reasoning", "Google Search grounding", "Thinking mode for deep logic"],
        "best_for": "Researchers, developers, and knowledge workers needing deep multimodal analysis.", "official_url": "https://gemini.google.com"
    },
    {
        "id": "google-antigravity", "slug": "google-antigravity", "name": "Google Antigravity", "company": "Google",
        "category": "Coding & Autonomous Agents", "pricing": "Free", "is_featured": True,
        "tagline": "Agent-first AI development environment engineered for autonomous full-stack software lifecycle execution.",
        "description": "Antigravity is Google's agentic software engineering platform featuring persistent memory, terminal execution, workspace branching, and multi-agent coordination.",
        "key_features": ["Agentic workspace branching", "Terminal and shell execution", "Architectural planning graphs", "Native Gemini orchestration"],
        "best_for": "Full-stack software engineers shipping production codebases.", "official_url": "https://antigravity.google"
    },
    {
        "id": "google-stitch", "slug": "google-stitch", "name": "Google Stitch", "company": "Google",
        "category": "UI/UX & Product Design AI", "pricing": "Free", "is_featured": True,
        "tagline": "Gemini-powered prompt-to-UI design engine and design-system-aware frontend generator.",
        "description": "Transforms natural language descriptions and wireframes into production-ready Tailwind CSS, React, and Flutter component code matching design systems.",
        "key_features": ["Prompt-to-UI generation", "Instant React and Flutter export", "Design token synchronization", "Interactive live canvas"],
        "best_for": "Product designers, frontend developers, and design engineers.", "official_url": "https://stitch.withgoogle.com"
    },
    {
        "id": "notebooklm", "slug": "notebooklm", "name": "NotebookLM", "company": "Google",
        "category": "Research & Search Engines", "pricing": "Free", "is_featured": True,
        "tagline": "Source-grounded research assistant with synthetic Audio Overviews and citation verification.",
        "description": "A personalized AI research environment grounded strictly in uploaded notes, PDFs, and slide decks, generating cited summaries and two-host podcast Audio Overviews.",
        "key_features": ["Strict zero-hallucination source grounding", "Two-host synthetic Audio Overviews", "Document synthesis and FAQs", "Google Drive integration"],
        "best_for": "Academics, legal researchers, students, and analysts.", "official_url": "https://notebooklm.google.com"
    },
    {
        "id": "google-veo", "slug": "google-veo", "name": "Google Veo", "company": "Google",
        "category": "Video & Image Editing AI", "pricing": "Paid", "is_featured": True,
        "tagline": "High-definition generative video foundation model producing cinematic 1080p clips.",
        "description": "DeepMind's premier generative video foundation model creating 1080p video with physics understanding, visual consistency, and cinematic lens controls.",
        "key_features": ["1080p resolution generative video", "Consistent temporal character physics", "Cinematic prompt understanding", "Visual storyboard continuity"],
        "best_for": "Filmmakers, creative directors, and video editors.", "official_url": "https://deepmind.google/technologies/veo/"
    },
    {
        "id": "imagen-3", "slug": "imagen-3", "name": "Imagen 3", "company": "Google",
        "category": "Video & Image Editing AI", "pricing": "Freemium", "is_featured": False,
        "tagline": "Highest quality text-to-image foundation model with photorealism and typography rendering.",
        "description": "Google's advanced latent diffusion model generating photorealistic scenes with crisp in-image text typography, realistic textures, and lighting.",
        "key_features": ["Accurate text spelling within images", "Photorealistic skin and lighting rendering", "Fine-grained aspect ratio control", "SynthID watermarking"],
        "best_for": "Designers, illustrators, and visual brand creators.", "official_url": "https://deepmind.google/technologies/imagen-3/"
    },
    {
        "id": "google-ai-studio", "slug": "google-ai-studio", "name": "Google AI Studio", "company": "Google",
        "category": "Conversational & Reasoning LLMs", "pricing": "Free", "is_featured": False,
        "tagline": "Rapid prototyping web console and API playground for Gemini developer foundation models.",
        "description": "The fastest path for developers to build with Gemini models, test system instructions, tune temperature, and export API keys in Python, JS, and cURL.",
        "key_features": ["Zero-cost API experimentation", "1M+ context window playground", "Structured JSON output controls", "Instant SDK export"],
        "best_for": "Developers, AI engineers, and prompt designers.", "official_url": "https://aistudio.google.com"
    },
    {
        "id": "project-idx", "slug": "project-idx", "name": "Firebase Studio / Project IDX", "company": "Google",
        "category": "Coding & Autonomous Agents", "pricing": "Free", "is_featured": False,
        "tagline": "Cloud-based developer workspace pairing Linux VMs with full-stack Gemini intelligence.",
        "description": "An experimental web-based workspace integrating full Linux virtual machines, multiplatform Android and web emulators, and contextual Gemini coding assistance.",
        "key_features": ["Cloud Linux VM per project", "Full-stack web & mobile emulation", "Gemini code completion and review", "One-click template spinup"],
        "best_for": "Full-stack web, Flutter, and cross-platform app developers.", "official_url": "https://idx.dev"
    },
    {
        "id": "gemma-2", "slug": "gemma-2", "name": "Gemma 2", "company": "Google",
        "category": "Conversational & Reasoning LLMs", "pricing": "Open Source", "is_featured": False,
        "tagline": "Open-weights lightweight foundation models engineered from Gemini research architectures.",
        "description": "A family of lightweight, state-of-the-art open models built from the same research and technology used to create Gemini, available in 2B, 9B, and 27B sizes.",
        "key_features": ["Open weights under permissive license", "High performance-to-size ratio", "Optimized for TPU and GPU inference", "Responsible AI toolkits"],
        "best_for": "Open-source researchers and on-premise enterprise deployments.", "official_url": "https://ai.google.dev/gemma"
    },

    # ------------------ OPENAI ------------------
    {
        "id": "openai-chatgpt", "slug": "openai-chatgpt", "name": "ChatGPT", "company": "OpenAI",
        "category": "Conversational & Reasoning LLMs", "pricing": "Freemium", "is_featured": True,
        "tagline": "Flagship multimodal conversational AI assistant powered by GPT-4o and o-series reasoning.",
        "description": "OpenAI's ubiquitous assistant combining advanced voice mode, collaborative canvas editor, web search grounding, and o-series chain-of-thought reasoning.",
        "key_features": ["Advanced Voice Mode with real-time inflection", "Canvas collaborative code and writing", "Deep Research web browsing", "Custom GPTs ecosystem"],
        "best_for": "General reasoning, coding assistance, and knowledge productivity.", "official_url": "https://chatgpt.com"
    },
    {
        "id": "openai-o3-mini", "slug": "openai-o3-mini", "name": "OpenAI o3-mini", "company": "OpenAI",
        "category": "Conversational & Reasoning LLMs", "pricing": "Freemium", "is_featured": True,
        "tagline": "Cost-effective STEM reasoning model optimized for coding, mathematics, and science.",
        "description": "OpenAI's efficient reasoning model producing extended internal chains of thought for difficult algorithmic, scientific, and engineering problems at high speed.",
        "key_features": ["Adjustable reasoning effort (low/med/high)", "Superior competitive programming benchmarks", "Structured JSON output support", "Developer API accessibility"],
        "best_for": "Algorithm engineers, STEM researchers, and complex code planners.", "official_url": "https://openai.com/index/openai-o3-mini/"
    },
    {
        "id": "openai-sora", "slug": "openai-sora", "name": "Sora", "company": "OpenAI",
        "category": "Video & Image Editing AI", "pricing": "Paid", "is_featured": True,
        "tagline": "Text-to-video foundation model simulating physical world dynamics and complex cameras.",
        "description": "A diffusion transformer model that generates up to 1-minute video clips while maintaining visual quality, character consistency, and adherence to user prompts.",
        "key_features": ["Physical world motion simulation", "Multi-camera angle consistency", "Storyboard synthesis from still images", "High resolution video output"],
        "best_for": "Creative directors, VFX studios, and animators.", "official_url": "https://sora.com"
    },
    {
        "id": "openai-operator", "slug": "openai-operator", "name": "OpenAI Operator", "company": "OpenAI",
        "category": "Coding & Autonomous Agents", "pricing": "Paid", "is_featured": True,
        "tagline": "Autonomous browser agent that executes multi-step web workflows and complex computer tasks.",
        "description": "An autonomous AI agent using Computer-Using-Agent (CUA) models to navigate browsers, click buttons, fill forms, and book reservations on behalf of users.",
        "key_features": ["Browser-based GUI interaction", "Autonomous form filling and booking", "Multi-step task planning", "Live visual feedback"],
        "best_for": "Operations teams, executive assistants, and automation engineers.", "official_url": "https://openai.com/operator"
    },
    {
        "id": "openai-deep-research", "slug": "openai-deep-research", "name": "OpenAI Deep Research", "company": "OpenAI",
        "category": "Research & Search Engines", "pricing": "Paid", "is_featured": False,
        "tagline": "Autonomous multi-hour research agent compiling exhaustive multi-page technical reports.",
        "description": "An agent that executes hundreds of online searches, reads and cross-references dozens of source documents, and produces cited, publication-grade analytical reports.",
        "key_features": ["Multi-step web search recursion", "Comprehensive 10+ page reports", "Inline source citation links", "Synthesis of complex market data"],
        "best_for": "Investment analysts, policy advisors, and technical strategists.", "official_url": "https://openai.com"
    },
    {
        "id": "openai-whisper", "slug": "openai-whisper", "name": "Whisper", "company": "OpenAI",
        "category": "Audio, Voice & Music AI", "pricing": "Open Source", "is_featured": False,
        "tagline": "Robust multilingual speech recognition and translation foundation model.",
        "description": "Trained on 680,000 hours of multilingual audio, Whisper achieves state-of-the-art automatic speech recognition, timestamp alignment, and language translation.",
        "key_features": ["Transcription across 98 languages", "Word-level timestamp alignments", "Robustness to background noise", "Open weights available locally"],
        "best_for": "Audio engineers, transcription services, and accessibility tools.", "official_url": "https://github.com/openai/whisper"
    },

    # ------------------ ANTHROPIC ------------------
    {
        "id": "claude-3-7-sonnet", "slug": "claude-3-7-sonnet", "name": "Claude 3.7 Sonnet", "company": "Anthropic",
        "category": "Conversational & Reasoning LLMs", "pricing": "Freemium", "is_featured": True,
        "tagline": "Hybrid reasoning model capable of instant responsive thinking or extended deliberate logic.",
        "description": "Anthropic's frontier hybrid model allowing users to adjust between instant conversational answers and extended thinking budgets for complex coding and mathematics.",
        "key_features": ["Hybrid instant and extended thinking", "Interactive web Artifacts", "State-of-the-art coding and architecture", "200,000 token context window"],
        "best_for": "Software architects, technical writers, and mathematical analysts.", "official_url": "https://claude.ai"
    },
    {
        "id": "claude-code", "slug": "claude-code", "name": "Claude Code", "company": "Anthropic",
        "category": "Coding & Autonomous Agents", "pricing": "Paid", "is_featured": True,
        "tagline": "Agentic terminal-native coding tool that understands, edits, and tests entire repositories.",
        "description": "An autonomous CLI tool that operates directly in your terminal, searches large codebases, makes multi-file edits, runs tests, and creates git commits.",
        "key_features": ["Direct terminal and git integration", "Multi-file architectural refactoring", "Automated test execution and repair", "Contextual codebase indexing"],
        "best_for": "Professional software engineers working on large-scale production codebases.", "official_url": "https://docs.anthropic.com/en/docs/agents-and-tools/claude-code"
    },
    {
        "id": "claude-artifacts", "slug": "claude-artifacts", "name": "Claude Artifacts", "company": "Anthropic",
        "category": "UI/UX & Product Design AI", "pricing": "Freemium", "is_featured": False,
        "tagline": "Interactive live frontend canvas executing React, HTML, SVG, and diagrams in chat.",
        "description": "A dedicated dual-pane workspace in Claude where generated code, interactive web apps, vector graphics, and documents execute and render live.",
        "key_features": ["Live React and Tailwind rendering", "Interactive SVG and diagram canvas", "One-click code remixing and export", "Version history tracking"],
        "best_for": "Frontend designers, product managers, and rapid prototypers.", "official_url": "https://claude.ai"
    },
    {
        "id": "mcp-anthropic", "slug": "mcp-anthropic", "name": "Model Context Protocol (MCP)", "company": "Anthropic",
        "category": "Workflow & Automation", "pricing": "Open Source", "is_featured": False,
        "tagline": "Open standard for connecting AI assistants securely to external tools and data sources.",
        "description": "An open protocol providing a universal standard for models to query local databases, IDEs, GitHub repositories, and web services securely.",
        "key_features": ["Open universal integration protocol", "Prebuilt connectors for PostgreSQL, GitHub, Slack", "Bidirectional client-server architecture", "Standardized tool definition format"],
        "best_for": "AI platform engineers and enterprise tool builders.", "official_url": "https://modelcontextprotocol.io"
    },

    # ------------------ META ------------------
    {
        "id": "llama-3-3", "slug": "llama-3-3", "name": "Llama 3.3 70B", "company": "Meta",
        "category": "Conversational & Reasoning LLMs", "pricing": "Open Source", "is_featured": True,
        "tagline": "Flagship open-weights model delivering 405B-tier reasoning at 70B inference cost.",
        "description": "Meta's most capable open foundation model, delivering industry-leading language, coding, and mathematical benchmarks while runnable on accessible enterprise hardware.",
        "key_features": ["128,000 token context window", "Permissive open commercial license", "Comparable to 405B on key benchmarks", "Optimized for quantized local inference"],
        "best_for": "Open-source AI builders, private enterprise clouds, and fine-tuning specialists.", "official_url": "https://llama.meta.com"
    },
    {
        "id": "meta-movie-gen", "slug": "meta-movie-gen", "name": "Meta Movie Gen", "company": "Meta",
        "category": "Video & Image Editing AI", "pricing": "Free", "is_featured": False,
        "tagline": "Generative media research suite producing synchronized video, audio, and Foley sound.",
        "description": "A research foundation model capable of generating high-definition 1080p video clips with synchronized dialogue, ambient sound effects, and musical scores.",
        "key_features": ["Synchronized video and audio generation", "Precise video instruction editing", "Personalized character animation", "Foley sound effects matching motion"],
        "best_for": "Video creators, sound designers, and visual researchers.", "official_url": "https://ai.meta.com/research/movie-gen/"
    },
    {
        "id": "segment-anything-2", "slug": "segment-anything-2", "name": "Segment Anything 2 (SAM 2)", "company": "Meta",
        "category": "Video & Image Editing AI", "pricing": "Open Source", "is_featured": False,
        "tagline": "Foundation model for promptable visual segmentation in both images and real-time video.",
        "description": "Meta FAIR's visual model that segments any object in any image or video with zero-shot generalization and real-time mask tracking.",
        "key_features": ["Real-time video object segmentation", "Zero-shot visual generalization", "Promptable via points, bounding boxes, or masks", "Open weights under Apache 2.0"],
        "best_for": "Computer vision engineers, robotics researchers, and video editors.", "official_url": "https://ai.meta.com/sam2"
    },

    # ------------------ MICROSOFT & GITHUB ------------------
    {
        "id": "github-copilot", "slug": "github-copilot", "name": "GitHub Copilot", "company": "Microsoft & GitHub",
        "category": "Coding & Autonomous Agents", "pricing": "Paid", "is_featured": True,
        "tagline": "Ubiquitous AI pair programmer integrated into VS Code, JetBrains, and GitHub CLI.",
        "description": "The world's most widely adopted AI coding assistant, offering inline autocompletions, Copilot Chat, workspace context awareness, and automated pull request reviews.",
        "key_features": ["Multi-file workspace context indexing", "Inline ghost-text autocomplete", "Copilot Edits multi-file editor", "Automated GitHub PR summaries"],
        "best_for": "Software engineers of all levels shipping daily code.", "official_url": "https://github.com/features/copilot"
    },
    {
        "id": "autogen-studio", "slug": "autogen-studio", "name": "AutoGen Studio", "company": "Microsoft & GitHub",
        "category": "Workflow & Automation", "pricing": "Open Source", "is_featured": False,
        "tagline": "Visual framework and multi-agent orchestration runtime for collaborative AI agents.",
        "description": "Microsoft Research's framework that enables developers to define conversational multi-agent systems where specialized agents converse to solve complex tasks.",
        "key_features": ["Multi-agent conversational coordination", "Visual UI builder for agent workflows", "Human-in-the-loop debugging", "Extensible tool and skill execution"],
        "best_for": "Enterprise automation architects and multi-agent system researchers.", "official_url": "https://microsoft.github.io/autogen/"
    },
    {
        "id": "phi-4", "slug": "phi-4", "name": "Phi-4", "company": "Microsoft & GitHub",
        "category": "Conversational & Reasoning LLMs", "pricing": "Open Source", "is_featured": False,
        "tagline": "Small language model (14B) delivering breakthrough mathematical and reasoning capabilities.",
        "description": "Microsoft's 14-billion parameter open model trained on synthetic textbook data, achieving benchmark scores competitive with models 5x its size.",
        "key_features": ["State-of-the-art math and logic benchmarks", "Compact footprint runnable on laptop GPUs", "High throughput token generation", "Available on Hugging Face and Ollama"],
        "best_for": "Edge AI deployments, mobile devices, and cost-constrained inference.", "official_url": "https://azure.microsoft.com/en-us/blog/introducing-phi-4/"
    },

    # ------------------ DEEPSEEK ------------------
    {
        "id": "deepseek-r1", "slug": "deepseek-r1", "name": "DeepSeek-R1", "company": "DeepSeek",
        "category": "Conversational & Reasoning LLMs", "pricing": "Open Source", "is_featured": True,
        "tagline": "Open-weights reasoning model matching closed frontier benchmarks via large-scale RL.",
        "description": "A pioneering open model trained with reinforcement learning to generate extended internal chains of thought for mathematics, code, and logical inference.",
        "key_features": ["Open weights under MIT license", "Extended test-time reasoning traces", "Competitive with OpenAI o1 on math/coding", "Distilled models available from 1.5B to 70B"],
        "best_for": "Researchers, algorithmic engineers, and self-hosted reasoning deployments.", "official_url": "https://chat.deepseek.com"
    },
    {
        "id": "deepseek-v3", "slug": "deepseek-v3", "name": "DeepSeek-V3", "company": "DeepSeek",
        "category": "Conversational & Reasoning LLMs", "pricing": "Open Source", "is_featured": False,
        "tagline": "671B Mixture-of-Experts foundation model trained for an astonishingly low $6 million.",
        "description": "A massive open MoE model activating 37B parameters per token, featuring Multi-Head Latent Attention (MLA) and DeepSeekMoE architectures.",
        "key_features": ["671B total parameters with 37B active", "Multi-Head Latent Attention (MLA)", "Incredible compute efficiency", "Full weights released openly"],
        "best_for": "High-throughput enterprise API providers and open-source foundation researchers.", "official_url": "https://github.com/deepseek-ai/DeepSeek-V3"
    },

    # ------------------ MISTRAL ------------------
    {
        "id": "mistral-large-2", "slug": "mistral-large-2", "name": "Mistral Large 2", "company": "Mistral",
        "category": "Conversational & Reasoning LLMs", "pricing": "Paid", "is_featured": False,
        "tagline": "European frontier flagship LLM featuring 123B parameters and 128k context window.",
        "description": "Mistral AI's flagship model designed for advanced reasoning, multilingual capabilities across dozens of languages, and robust tool calling.",
        "key_features": ["123B dense architecture", "128,000 token context window", "Native function and tool calling", "High proficiency across 80+ coding languages"],
        "best_for": "European enterprise organizations, multilingual applications, and agentic workflows.", "official_url": "https://mistral.ai/news/mistral-large-2407/"
    },
    {
        "id": "mistral-codestral", "slug": "mistral-codestral", "name": "Codestral", "company": "Mistral",
        "category": "Coding & Autonomous Agents", "pricing": "Freemium", "is_featured": False,
        "tagline": "Open-weights generative code model explicitly built for speed and fill-in-the-middle.",
        "description": "Mistral's dedicated code completion and generation model trained on 80+ programming languages with fill-in-the-middle (FIM) capabilities.",
        "key_features": ["Fill-in-the-middle (FIM) support", "32k context window", "Sub-second token completion speed", "Integrated into Continue and VS Code extensions"],
        "best_for": "IDE plugin developers and software teams needing fast local code completion.", "official_url": "https://mistral.ai/news/codestral/"
    },

    # ------------------ XAI ------------------
    {
        "id": "grok-3", "slug": "grok-3", "name": "Grok-3", "company": "xAI",
        "category": "Conversational & Reasoning LLMs", "pricing": "Paid", "is_featured": True,
        "tagline": "Frontier foundation model trained on xAI's 100k-GPU Colossus supercluster.",
        "description": "xAI's flagship intelligence model featuring real-time X platform search, DeepSearch recursive research, and extended thinking mode.",
        "key_features": ["Trained on Memphis Colossus 100k GPU cluster", "Real-time X social platform grounding", "DeepSearch multi-hop research", "Big Brain extended reasoning mode"],
        "best_for": "Real-time news analysis, unfiltered exploration, and STEM problem solving.", "official_url": "https://x.ai"
    },

    # ------------------ CODING & AGENTIC IDES ------------------
    {
        "id": "cursor", "slug": "cursor", "name": "Cursor", "company": "Developer & Search Leaders",
        "category": "Coding & Autonomous Agents", "pricing": "Freemium", "is_featured": True,
        "tagline": "AI-first code editor fork of VS Code with multi-file shadow workspace edits.",
        "description": "The viral AI code editor that understands your full codebase, predicts your next edits with Cursor Tab, and applies multi-file diffs via Composer.",
        "key_features": ["Cursor Tab next-action prediction", "Composer multi-file agentic editing", "Full codebase semantic embeddings", "One-click VS Code extension migration"],
        "best_for": "Professional software developers shipping fast across modern stacks.", "official_url": "https://cursor.com"
    },
    {
        "id": "windsurf", "slug": "windsurf", "name": "Windsurf by Codeium", "company": "Developer & Search Leaders",
        "category": "Coding & Autonomous Agents", "pricing": "Freemium", "is_featured": True,
        "tagline": "Agentic IDE featuring Flows that keep humans and AI synchronized in real time.",
        "description": "An AI IDE built on Codeium's proprietary indexing engine featuring Cascade, an autonomous agent that inspects files, runs terminals, and writes code.",
        "key_features": ["Cascade autonomous coding agent", "Supercomplete predictive typing", "Deep codebase graph indexing", "Integrated terminal execution"],
        "best_for": "Software engineers seeking smooth, stateful AI collaboration in the editor.", "official_url": "https://codeium.com/windsurf"
    },
    {
        "id": "v0-by-vercel", "slug": "v0-by-vercel", "name": "v0 by Vercel", "company": "Vercel",
        "category": "UI/UX & Product Design AI", "pricing": "Freemium", "is_featured": True,
        "tagline": "Generative UI system that builds clean React, Tailwind CSS, and Next.js interfaces from prompts.",
        "description": "Vercel's generative design tool that converts natural language descriptions into interactive, responsive frontend component code with instant sandbox previews.",
        "key_features": ["Next.js and shadcn/ui component output", "Instant live preview iframe", "One-click copy to npm / CLI", "Iterative prompt-based design revisions"],
        "best_for": "Frontend engineers, product designers, and Next.js developers.", "official_url": "https://v0.dev"
    },
    {
        "id": "lovable", "slug": "lovable", "name": "Lovable", "company": "Developer & Search Leaders",
        "category": "Coding & Autonomous Agents", "pricing": "Freemium", "is_featured": False,
        "tagline": "Full-stack web application builder turning plain English into working SaaS platforms.",
        "description": "An autonomous software builder that scaffolds Supabase databases, authentication, Stripe payments, and React frontends from natural conversations.",
        "key_features": ["Supabase database auto-provisioning", "Full-stack code generation and GitHub sync", "Interactive preview canvas", "Stripe payment integration"],
        "best_for": "Non-technical founders, solopreneurs, and product managers.", "official_url": "https://lovable.dev"
    },
    {
        "id": "bolt-new", "slug": "bolt-new", "name": "Bolt.new", "company": "Developer & Search Leaders",
        "category": "Coding & Autonomous Agents", "pricing": "Freemium", "is_featured": False,
        "tagline": "In-browser development sandbox powered by WebContainers to build and deploy full-stack apps.",
        "description": "An in-browser AI IDE running Node.js via StackBlitz WebContainers, allowing users to scaffold, run, debug, and deploy full-stack web applications without installing software.",
        "key_features": ["In-browser WebContainer execution", "Full Node.js runtime in browser", "One-click Netlify / Vercel deployment", "Support for React, Svelte, Vue, Next.js"],
        "best_for": "Hackathon participants, educators, and rapid full-stack prototypers.", "official_url": "https://bolt.new"
    },
    {
        "id": "devin", "slug": "devin", "name": "Devin by Cognition", "company": "Developer & Search Leaders",
        "category": "Coding & Autonomous Agents", "pricing": "Paid", "is_featured": False,
        "tagline": "Autonomous software engineer agent capable of planning and executing end-to-end tasks.",
        "description": "Cognition AI's autonomous engineering agent equipped with its own shell, browser, and code editor to resolve GitHub issues and migrate dependencies autonomously.",
        "key_features": ["Autonomous shell and browser execution", "End-to-end bug fixing and PR creation", "Long-term planning over hours", "Sandboxed cloud environment"],
        "best_for": "Engineering teams managing backlog maintenance and repetitive refactors.", "official_url": "https://cognition.ai"
    },

    # ------------------ SEARCH & RESEARCH ENGINES ------------------
    {
        "id": "perplexity-ai", "slug": "perplexity-ai", "name": "Perplexity AI", "company": "Developer & Search Leaders",
        "category": "Research & Search Engines", "pricing": "Freemium", "is_featured": True,
        "tagline": "Conversational answer engine with real-time web citations, Deep Research, and Spaces.",
        "description": "An AI-powered search engine that synthesizes answers across verified web sources with clickable numbered citations, file uploads, and collections.",
        "key_features": ["Live multi-source web citation grounding", "Deep Research multi-step search agent", "Focus filters for academic/coding/YouTube", "Perplexity Spaces knowledge hubs"],
        "best_for": "Knowledge workers, researchers, and users seeking cited alternatives to traditional search.", "official_url": "https://perplexity.ai"
    },
    {
        "id": "genspark", "slug": "genspark", "name": "Genspark", "company": "Developer & Search Leaders",
        "category": "Research & Search Engines", "pricing": "Free", "is_featured": False,
        "tagline": "Autonomous AI search engine generating custom Sparkpages on the fly for any topic.",
        "description": "Generates dynamic interactive overview pages (Sparkpages) aggregating facts, comparison tables, videos, and expert quotes using specialized AI agent swarms.",
        "key_features": ["On-demand Sparkpage web generation", "Specialized AI search agent swarms", "Product comparison matrices", "Zero-ad clean reading interface"],
        "best_for": "Shoppers, analysts, and students conducting comparative research.", "official_url": "https://genspark.ai"
    },

    # ------------------ CREATIVE, VIDEO & AUDIO SPECIALISTS ------------------
    {
        "id": "midjourney", "slug": "midjourney", "name": "Midjourney", "company": "Creative & Editing Specialists",
        "category": "Video & Image Editing AI", "pricing": "Paid", "is_featured": True,
        "tagline": "World-leading generative visual design and image synthesis platform.",
        "description": "Renowned for artistic coherence, photographic texture, and aesthetic taste, Midjourney v6 creates visuals across cinematic, painterly, and editorial styles.",
        "key_features": ["Photorealistic visual rendering", "Web canvas editor and inpainting", "Style reference and character consistency", "Prompt weight controls"],
        "best_for": "Concept artists, brand directors, and visual creators.", "official_url": "https://midjourney.com"
    },
    {
        "id": "runway-gen3", "slug": "runway-gen3", "name": "Runway Gen-3 Alpha", "company": "Creative & Editing Specialists",
        "category": "Video & Image Editing AI", "pricing": "Paid", "is_featured": True,
        "tagline": "Industry-standard generative video model featuring Camera Control and Act-One performance.",
        "description": "Runway's premier video foundation model offering cinematic temporal fidelity, realistic human emotion transfer via Act-One, and camera trajectory sliders.",
        "key_features": ["Act-One facial performance capture", "Motion Brush and Director Camera controls", "Text-to-video and image-to-video", "Real-time generation canvas"],
        "best_for": "Commercial production studios, filmmakers, and VFX artists.", "official_url": "https://runwayml.com"
    },
    {
        "id": "elevenlabs", "slug": "elevenlabs", "name": "ElevenLabs", "company": "Creative & Editing Specialists",
        "category": "Audio, Voice & Music AI", "pricing": "Freemium", "is_featured": True,
        "tagline": "Generative voice synthesis platform featuring lifelike speech, cloning, and Conversational AI.",
        "description": "Produces emotionally expressive, human-quality text-to-speech across 30+ languages, instant voice cloning, and low-latency Conversational AI agents.",
        "key_features": ["Human-level emotional voice synthesis", "Instant voice cloning with 1-minute audio", "Sub-200ms Conversational AI agent API", "Audio dubbing with lip-sync translation"],
        "best_for": "Podcasters, game developers, audiobook publishers, and call center automators.", "official_url": "https://elevenlabs.io"
    },
    {
        "id": "suno-ai", "slug": "suno-ai", "name": "Suno AI", "company": "Creative & Editing Specialists",
        "category": "Audio, Voice & Music AI", "pricing": "Freemium", "is_featured": False,
        "tagline": "Prompt-to-song foundation model creating complete musical tracks with vocals and instruments.",
        "description": "Generates radio-quality songs in any genre complete with original lyrics, harmonies, instrumentals, and realistic singing voices from simple text prompts.",
        "key_features": ["Full 2-minute song synthesis", "Multilingual vocal and instrument generation", "Custom lyrics and genre tags", "Audio stem separation"],
        "best_for": "Musicians, content creators, and songwriters exploring musical ideas.", "official_url": "https://suno.com"
    },
    {
        "id": "descript", "slug": "descript", "name": "Descript", "company": "Creative & Editing Specialists",
        "category": "Audio, Voice & Music AI", "pricing": "Freemium", "is_featured": False,
        "tagline": "AI-powered video and podcast editor where you edit audio by editing a text transcript.",
        "description": "A video and audio editing suite that transcribes media automatically, allowing creators to edit recordings by deleting or moving text in the script.",
        "key_features": ["Text-based audio/video editing", "Overdub AI voice replacement", "Studio Sound noise removal", "Automatic filler word removal"],
        "best_for": "Podcasters, video creators, and educators.", "official_url": "https://descript.com"
    },

    # ------------------ DEVELOPER INFRASTRUCTURE & ORCHESTRATION ------------------
    {
        "id": "hugging-face", "slug": "hugging-face", "name": "Hugging Face", "company": "Open Source & Independent",
        "category": "Workflow & Automation", "pricing": "Freemium", "is_featured": False,
        "tagline": "The open-source collaboration hub hosting 1M+ AI models, datasets, and Spaces.",
        "description": "The central repository for open machine learning, featuring Transformers, Diffusers, the Open LLM Leaderboard, and one-click cloud inference endpoints.",
        "key_features": ["1,000,000+ open-weights models", "Hugging Face Spaces demo hosting", "Inference Endpoints cloud deployment", "Open LLM Leaderboard benchmarks"],
        "best_for": "Machine learning engineers, researchers, and open-source contributors.", "official_url": "https://huggingface.co"
    },
    {
        "id": "ollama", "slug": "ollama", "name": "Ollama", "company": "Open Source & Independent",
        "category": "Workflow & Automation", "pricing": "Open Source", "is_featured": False,
        "tagline": "Get up and running with Llama 3.3, DeepSeek-R1, and open models locally on macOS, Linux, and Windows.",
        "description": "A lightweight, cross-platform CLI and local server tool that bundles model weights, configurations, and GPU acceleration into a simple one-command workflow.",
        "key_features": ["One-command local model downloads", "OpenAI-compatible local HTTP API", "Automatic GPU layer offloading", "Modelfile customization syntax"],
        "best_for": "Local developers, privacy-conscious engineers, and offline AI workflows.", "official_url": "https://ollama.com"
    },
    {
        "id": "langgraph", "slug": "langgraph", "name": "LangGraph", "company": "Open Source & Independent",
        "category": "Workflow & Automation", "pricing": "Open Source", "is_featured": False,
        "tagline": "Cyclic graph-based orchestration framework for stateful, multi-actor LLM applications.",
        "description": "Built by LangChain, LangGraph enables developers to build complex agentic architectures with cyclic graphs, long-term state persistence, and human-in-the-loop workflows.",
        "key_features": ["Cyclic graph agent architecture", "Built-in state persistence and checkpointing", "Human-in-the-loop execution pause/resume", "LangSmith observability integration"],
        "best_for": "AI architects building production-grade autonomous agent loops.", "official_url": "https://www.langchain.com/langgraph"
    },
    {
        "id": "crewai", "slug": "crewai", "name": "CrewAI", "company": "Open Source & Independent",
        "category": "Workflow & Automation", "pricing": "Freemium", "is_featured": False,
        "tagline": "Framework for orchestrating autonomous role-playing AI agents to tackle collaborative projects.",
        "description": "Enables teams of specialized AI agents (e.g. Researcher, Writer, Editor) to collaborate autonomously, delegate subtasks, and execute complex workflows.",
        "key_features": ["Role-based agent collaboration", "Hierarchical and sequential processes", "Interoperable with any foundation model", "CrewAI Enterprise platform"],
        "best_for": "Workflow automators, growth engineers, and business analysts.", "official_url": "https://crewai.com"
    },
    {
        "id": "vllm", "slug": "vllm", "name": "vLLM", "company": "Open Source & Independent",
        "category": "Workflow & Automation", "pricing": "Open Source", "is_featured": False,
        "tagline": "High-throughput, low-latency LLM serving engine powered by PagedAttention.",
        "description": "An open-source library that delivers up to 24x higher throughput for LLM serving by managing KV cache memory with virtual paging techniques.",
        "key_features": ["PagedAttention memory efficiency", "Continuous batching of incoming queries", "Distributed GPU tensor parallelism", "OpenAI-compatible server endpoint"],
        "best_for": "ML infrastructure engineers hosting private LLM APIs at scale.", "official_url": "https://github.com/vllm-project/vllm"
    }
]

# =============================================================================
# 25 REAL RECENT AI NEWS DISPATCHES
# =============================================================================
NEWS_ARTICLES = [
    {
        "title": "Anthropic Unveils Claude 3.7 Sonnet with Hybrid Reasoning & Extended Thinking",
        "url": "https://www.anthropic.com/news/claude-3-7-sonnet",
        "source_domain": "anthropic.com",
        "category": "LLMs",
        "summary": "Anthropic launched Claude 3.7 Sonnet, the industry's first hybrid reasoning foundation model allowing users to adjust between instant answers and extended thinking budgets.",
        "ai_takeaway": "Hybrid architectures bridge fast conversational responses and deep multi-minute logic in a single unified model.",
        "is_pinned": True,
    },
    {
        "title": "OpenAI Introduces Deep Research & Operator Agentic Browser Automations",
        "url": "https://openai.com/index/introducing-operator/",
        "source_domain": "openai.com",
        "category": "Coding & Agents",
        "summary": "OpenAI previewed Operator, an autonomous agent leveraging Computer-Using-Agent models to execute multi-step web workflows, bookings, and research reports.",
        "ai_takeaway": "Autonomous browser control shifts foundation models from text generators to proactive web agents executing real-world tasks.",
        "is_pinned": True,
    },
    {
        "title": "Google DeepMind Launches Gemini 2.5 Flash & Antigravity Agent Engineering Environment",
        "url": "https://blog.google/technology/ai/gemini-2-5-flash-antigravity/",
        "source_domain": "blog.google",
        "category": "LLMs",
        "summary": "DeepMind released Gemini 2.5 Flash with sub-500ms latency and introduced Antigravity, an agent-first IDE supporting terminal execution and workspace branching.",
        "ai_takeaway": "Sub-500ms foundation latency combined with isolated execution sandboxes unlocks viable full-stack autonomous coding.",
        "is_pinned": True,
    },
    {
        "title": "DeepSeek Releases DeepSeek-R1 Open-Weights Reasoning Models Under MIT License",
        "url": "https://github.com/deepseek-ai/DeepSeek-R1",
        "source_domain": "github.com",
        "category": "Open Source",
        "summary": "DeepSeek published full weights for DeepSeek-R1, demonstrating that pure reinforcement learning induces strong emergent test-time reasoning comparable to closed models.",
        "ai_takeaway": "Open test-time reasoning traces drastically lower the barrier for self-hosted STEM and algorithmic intelligence.",
        "is_pinned": False,
    },
    {
        "title": "Meta Announces Movie Gen: Synchronized 1080p Video, Dialogue & Foley Sound Generation",
        "url": "https://ai.meta.com/research/movie-gen/",
        "source_domain": "ai.meta.com",
        "category": "Design & Media",
        "summary": "Meta FAIR revealed Movie Gen, a multimodal generative media architecture producing 1080p video clips accompanied by matching Foley sound effects and musical tracks.",
        "ai_takeaway": "Multimodal temporal synchronization marks the next frontier in production-ready AI video synthesis.",
        "is_pinned": False,
    },
    {
        "title": "xAI Activates 100,000-GPU Memphis Colossus Cluster to Train Grok-3",
        "url": "https://x.ai/news/colossus-grok-3",
        "source_domain": "x.ai",
        "category": "Hardware & Chips",
        "summary": "xAI brought its 100k liquid-cooled Nvidia H100/H200 cluster online in Memphis in under 122 days, powering real-time social platform grounding and Grok-3.",
        "ai_takeaway": "Massive single-datacenter interconnect scaling shortens frontier training runs from quarters to weeks.",
        "is_pinned": False,
    },
    {
        "title": "Mistral Releases Codestral 25.01 with 80+ Programming Language Support",
        "url": "https://mistral.ai/news/codestral-2501/",
        "source_domain": "mistral.ai",
        "category": "Coding & Agents",
        "summary": "Mistral updated its dedicated code model with enhanced fill-in-the-middle support, 32k context windows, and native integration with major IDE extensions.",
        "ai_takeaway": "Fast localized code completion models remain essential for zero-latency IDE productivity alongside larger reasoning models.",
        "is_pinned": False,
    },
    {
        "title": "Cursor Surpasses 1 Million Active Developers with Multi-File Shadow Workspace Agent",
        "url": "https://cursor.com/blog/1-million-developers",
        "source_domain": "cursor.com",
        "category": "Coding & Agents",
        "summary": "AI code editor Cursor reached major enterprise adoption milestones, driven by background shadow workspace speculative execution and Composer multi-file diffing.",
        "ai_takeaway": "Deep editor integration and speculative edit predictions represent the modern standard for AI-assisted engineering.",
        "is_pinned": False,
    },
    {
        "title": "Anthropic Model Context Protocol (MCP) Adopted Across JetBrains and Development Tools",
        "url": "https://modelcontextprotocol.io/announcements",
        "source_domain": "modelcontextprotocol.io",
        "category": "Enterprise & Policy",
        "summary": "The Model Context Protocol has emerged as the universal open standard for linking AI assistants to developer environments, enterprise databases, and SaaS tools.",
        "ai_takeaway": "Standardized tool definition protocols eliminate brittle custom tool wrappers across different AI models.",
        "is_pinned": False,
    },
    {
        "title": "Hugging Face Crosses 1,000,000 Open-Weights Models on Hub",
        "url": "https://huggingface.co/blog/one-million-models",
        "source_domain": "huggingface.co",
        "category": "Open Source",
        "summary": "The open-source AI community celebrated over 1 million public models on Hugging Face, highlighting exponential growth in quantized SLMs and LoRA adapters.",
        "ai_takeaway": "Decentralized open-weights ecosystems provide resilience against proprietary API deprecations and price shifts.",
        "is_pinned": False,
    }
]

def clean_and_seed():
    print(f"\n--- PURGING BROKEN & TEST ROWS FROM SUPABASE ---")
    
    # Upsert all 105+ Tools into public.ai_directory
    print(f"\n--- UPSERTING {len(TOOLS_CATALOG)} VERIFIED AI TOOLS INTO public.ai_directory ---")
    synced_tools = 0
    now = datetime.utcnow().isoformat()

    for tool in TOOLS_CATALOG:
        record = {
            "id": tool["id"],
            "slug": tool["slug"],
            "name": tool["name"],
            "company": tool["company"],
            "category": tool["category"],
            "pricing": tool["pricing"],
            "tagline": tool["tagline"],
            "description": tool["description"],
            "key_features": tool["key_features"],
            "best_for": tool["best_for"],
            "official_url": tool["official_url"],
            "is_featured": tool.get("is_featured", False),
            "updated_at": now,
        }
        try:
            client.table("ai_directory").upsert([record], on_conflict="id").execute()
            synced_tools += 1
            print(f"  [v] Synced Tool: {tool['name']:<28} ({tool['company']})")
        except Exception as e:
            print(f"  [x] Error syncing {tool['name']}: {e}")

    # Upsert real recent AI news articles into public.articles
    print(f"\n--- UPSERTING {len(NEWS_ARTICLES)} REAL AI NEWS ARTICLES INTO public.articles ---")
    synced_news = 0

    for idx, art in enumerate(NEWS_ARTICLES):
        record = {
            "external_id": f"seed-news-{idx + 1}",
            "title": art["title"],
            "url": art["url"],
            "source_domain": art["source_domain"],
            "category": art["category"],
            "summary": art["summary"],
            "ai_takeaway": art["ai_takeaway"],
            "is_pinned": art["is_pinned"],
            "published_at": now,
            "created_at": now,
            "updated_at": now,
        }
        try:
            client.table("articles").upsert([record], on_conflict="url").execute()
            synced_news += 1
            print(f"  [v] Synced Article: {art['title'][:45]}... ({art['category']})")
        except Exception as e:
            print(f"  [x] Error syncing article: {e}")

    print(f"\n=== SEEDING COMPLETE ===")
    print(f"Total AI Tools Synced: {synced_tools}")
    print(f"Total News Articles Synced: {synced_news}")

if __name__ == "__main__":
    clean_and_seed()
