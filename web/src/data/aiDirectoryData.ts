import { AIDirectoryItem } from "@/lib/types";

export const AI_DIRECTORY_DATA: AIDirectoryItem[] = [
  // ==========================================
  // GOOGLE ECOSYSTEM
  // ==========================================
  {
    id: "google-gemini",
    slug: "google-gemini",
    name: "Google Gemini",
    company: "Google",
    category: "Conversational & Reasoning LLMs",
    secondaryCategories: ["Research & Search Engines", "Coding & Autonomous Agents"],
    tagline: "Multimodal frontier LLM assistant with 2M native context and Google ecosystem integration.",
    description: "Google Gemini is Google DeepMind's flagship native multimodal AI system. Designed from the ground up to reason across text, code, audio, high-resolution imagery, and video, Gemini natively integrates with Google Search grounding, Workspace tools, and a massive 2-million-token context window.",
    keyFeatures: [
      "2,000,000 token context window for digesting enterprise repos and multi-hour video",
      "Native multimodal comprehension spanning text, audio, images, and video",
      "Live Google Search grounding for verifiable up-to-date real-world facts",
      "Thinking mode for step-by-step mathematical, scientific, and logic reasoning"
    ],
    bestFor: "Full-stack researchers, software architects, and knowledge workers needing deep multimodal analysis.",
    pricing: "Freemium",
    officialUrl: "https://gemini.google.com",
    isFeatured: true,
    architectureDetails: "Native multimodal Transformer with mixture-of-experts (MoE) routing, trained on TPU v5p clusters.",
    companyBackground: "Built by Google DeepMind, Google's premier artificial intelligence research laboratory headquartered in London and Mountain View.",
    relatedToolSlugs: ["google-antigravity", "google-stitch", "notebooklm", "google-veo", "imagen-3", "project-idx"]
  },
  {
    id: "google-antigravity",
    slug: "google-antigravity",
    name: "Google Antigravity",
    company: "Google",
    category: "Coding & Autonomous Agents",
    secondaryCategories: ["Workflow & Automation"],
    tagline: "Agent-first AI development environment engineered for autonomous full-stack software lifecycle execution.",
    description: "Google Antigravity is Google's next-generation autonomous software engineering platform. Rather than merely offering inline completions, Antigravity acts as an agentic pair-programmer with persistent memory, terminal execution, workspace branching, test generation, and multi-agent coordination.",
    keyFeatures: [
      "Agentic workspace branching and subagent delegation for concurrent tasks",
      "Deep terminal, shell, and filesystem access with interactive supervision",
      "Architectural planning engine with verifiable step-by-step execution graphs",
      "Native Google Cloud and Gemini API foundation model orchestration"
    ],
    bestFor: "Senior engineers, tech leads, and autonomous agent builders shipping production codebases.",
    pricing: "Free",
    officialUrl: "https://antigravity.google.com",
    isFeatured: true,
    architectureDetails: "Multi-agent autonomous runtime with isolated execution sandboxes, language server protocol (LSP) hooks, and tree-of-thought planning.",
    companyBackground: "Developed by Google Labs & DeepMind as the flagship agent-first IDE paradigm.",
    relatedToolSlugs: ["google-gemini", "google-stitch", "project-idx"]
  },
  {
    id: "google-stitch",
    slug: "google-stitch",
    name: "Google Stitch",
    company: "Google",
    category: "UI/UX & Product Design AI",
    secondaryCategories: ["Coding & Autonomous Agents"],
    tagline: "Gemini-powered prompt-to-UI design engine and design-system-aware frontend generator.",
    description: "Google Stitch transforms natural language descriptions and design tokens into production-ready frontend user interfaces. Powered by Gemini's multimodal design understanding, Stitch generates clean Tailwind CSS, React, and Flutter code matching design system constraints.",
    keyFeatures: [
      "Natural language and wireframe sketch conversion to responsive component code",
      "Instant export to React, Next.js, Flutter, and HTML/Tailwind CSS",
      "Design token synchronization matching Material Design 3 and custom style guides",
      "Interactive visual canvas with iterative live code editing"
    ],
    bestFor: "Product designers, frontend developers, and design technologists rapid-prototyping user journeys.",
    pricing: "Free",
    officialUrl: "https://stitch.withgoogle.com",
    isFeatured: true,
    architectureDetails: "Multimodal Gemini vision-and-code synthesis engine mapped to an interactive WebAssembly design canvas.",
    companyBackground: "Engineered by Google to bridge the divide between design artifacts and production code.",
    relatedToolSlugs: ["google-gemini", "google-antigravity", "v0-by-vercel"]
  },
  {
    id: "notebooklm",
    slug: "notebooklm",
    name: "NotebookLM",
    company: "Google",
    category: "Research & Search Engines",
    secondaryCategories: ["Audio, Voice & Music AI", "Conversational & Reasoning LLMs"],
    tagline: "Source-grounded research assistant with synthetic Audio Overviews and citation verification.",
    description: "NotebookLM is a personalized AI research environment grounded strictly in the notes, PDFs, slide decks, and documents you provide. It generates accurate synthesized summaries, cited answers, and lifelike podcast-style 'Audio Overviews' discussing your uploaded materials.",
    keyFeatures: [
      "Strict zero-hallucination source grounding with clickable inline citations",
      "Groundbreaking two-host synthetic 'Audio Overview' deep-dive podcasts",
      "Support for PDFs, Google Docs, Slides, web URLs, and raw text uploads",
      "Automatic generation of study guides, FAQs, timelines, and briefing docs"
    ],
    bestFor: "Academics, legal researchers, medical professionals, and students analyzing complex source documents.",
    pricing: "Free",
    officialUrl: "https://notebooklm.google.com",
    isFeatured: true,
    architectureDetails: "Gemini 1.5/2.0 context retrieval pipeline paired with Google's advanced speech synthesis and dialogue generation models.",
    companyBackground: "Created by Google Labs in collaboration with author Steven Johnson.",
    relatedToolSlugs: ["google-gemini", "perplexity-ai", "descript"]
  },
  {
    id: "google-veo",
    slug: "google-veo",
    name: "Google Veo",
    company: "Google",
    category: "Video & Image Editing AI",
    secondaryCategories: ["UI/UX & Product Design AI"],
    tagline: "High-definition generative video model producing cinematic 1080p clips with visual consistency.",
    description: "Google Veo is DeepMind's most capable generative video foundation model. It creates high-definition 1080p video clips from text, image, and video prompts, accurately understanding cinematic terms like 'timelapse', 'aerial pan', and lens focal lengths.",
    keyFeatures: [
      "1080p cinematic video generation with temporal coherence",
      "Nuanced understanding of filmmaking vocabulary and camera physics",
      "Visual style consistency across sequential camera angles",
      "Integrated audio effects and masked video editing"
    ],
    bestFor: "Cinematographers, creative directors, VFX artists, and digital advertisers.",
    pricing: "Paid",
    officialUrl: "https://deepmind.google/technologies/veo",
    isFeatured: false,
    architectureDetails: "Spatiotemporal latent diffusion Transformer optimized for physics consistency and cinematic composition.",
    companyBackground: "Developed by Google DeepMind's generative media research divisions.",
    relatedToolSlugs: ["imagen-3", "sora", "runway-gen3", "kling-ai"]
  },
  {
    id: "imagen-3",
    slug: "imagen-3",
    name: "Imagen 3",
    company: "Google",
    category: "Video & Image Editing AI",
    secondaryCategories: ["UI/UX & Product Design AI"],
    tagline: "Photorealistic image generation model with exceptional prompt fidelity and typography rendering.",
    description: "Imagen 3 is Google's highest-quality image generation model to date. It delivers photorealistic rendering, intricate textures, realistic lighting, and vastly improved in-image typography without synthetic visual artifacts.",
    keyFeatures: [
      "Exceptional typography rendering for legible text within generated graphics",
      "Photorealistic skin tones, fine hair, reflections, and natural lighting",
      "Inpainting and outpainting capabilities with strict prompt fidelity",
      "Comprehensive SynthID digital watermarking for responsible media verification"
    ],
    bestFor: "Graphic artists, creative agencies, game concept illustrators, and UI designers.",
    pricing: "Freemium",
    officialUrl: "https://deepmind.google/technologies/imagen-3",
    isFeatured: false,
    architectureDetails: "Cascaded latent diffusion model conditioned on multimodal Gemini text representations.",
    companyBackground: "Researched and trained by Google DeepMind.",
    relatedToolSlugs: ["google-veo", "midjourney", "adobe-firefly"]
  },
  {
    id: "project-idx",
    slug: "project-idx",
    name: "Firebase Studio / Project IDX",
    company: "Google",
    category: "Coding & Autonomous Agents",
    secondaryCategories: ["Workflow & Automation"],
    tagline: "Cloud-native AI workspace featuring full-stack multiplatform emulators and Gemini Code Assist.",
    description: "Project IDX (now evolving into Firebase Studio) is an entirely browser-based workspace for multiplatform app development. Powered by Codey and Gemini, it provides cloud Linux containers, built-in Android and web emulators, and deep framework templates.",
    keyFeatures: [
      "Zero-install cloud Linux workspaces spun up in seconds",
      "Integrated web and Android emulators running live side-by-side with code",
      "Gemini Code Assist for contextual codebase reasoning and refactoring",
      "Instant deployment to Firebase App Hosting and Google Cloud"
    ],
    bestFor: "Full-stack web, mobile (Flutter/React Native), and cloud backend developers.",
    pricing: "Free",
    officialUrl: "https://idx.dev",
    isFeatured: false,
    architectureDetails: "Web-based Code-OSS fork orchestrated atop Google Cloud Workstations and Nix environment configuration.",
    companyBackground: "Developed by Google Developer Group and Firebase team.",
    relatedToolSlugs: ["google-gemini", "google-antigravity", "cursor", "v0-by-vercel"]
  },

  // ==========================================
  // OPENAI ECOSYSTEM
  // ==========================================
  {
    id: "chatgpt",
    slug: "chatgpt",
    name: "ChatGPT",
    company: "OpenAI",
    category: "Conversational & Reasoning LLMs",
    secondaryCategories: ["Research & Search Engines", "Workflow & Automation"],
    tagline: "Ubiquitous conversational AI assistant with Voice Mode, canvas code/writing editor, and Search.",
    description: "ChatGPT is the globally adopted conversational AI platform created by OpenAI. Powered by GPT-4o and the o-series reasoning models, it offers real-time voice conversations, interactive Canvas writing/coding spaces, live web browsing, and custom GPT workflows.",
    keyFeatures: [
      "Advanced Voice Mode with sub-300ms natural conversational audio latency",
      "Interactive Canvas interface for dedicated code and essay collaboration",
      "SearchGPT live web citations with verified publication sourcing",
      "Custom GPT store and ecosystem integrations with third-party APIs"
    ],
    bestFor: "General consumers, enterprise knowledge teams, students, and software engineers.",
    pricing: "Freemium",
    officialUrl: "https://chatgpt.com",
    isFeatured: true,
    architectureDetails: "Omni-modal Transformer (GPT-4o) trained natively on speech, vision, and text tokens.",
    companyBackground: "Created by OpenAI, the San Francisco AI research company founded in 2015.",
    relatedToolSlugs: ["gpt-4o", "openai-o3-mini", "claude", "google-gemini", "grok-3"]
  },
  {
    id: "sora",
    slug: "sora",
    name: "Sora",
    company: "OpenAI",
    category: "Video & Image Editing AI",
    secondaryCategories: [],
    tagline: "Text-to-video foundation model simulating physical world dynamics and complex camera trajectories.",
    description: "Sora is OpenAI's state-of-the-art video generation model capable of generating up to 60-second scenes featuring multiple characters, specific motions, and accurate background details. It acts as a world simulator understanding physical interactions.",
    keyFeatures: [
      "Up to 1080p cinematic scenes with physical dynamics simulation",
      "Storyboard extension forwards and backwards in time",
      "Multi-shot video sequences maintaining subject and setting continuity",
      "Video-to-video style remixing and latent video inpainting"
    ],
    bestFor: "Filmmakers, VFX artists, animators, and creative advertising studios.",
    pricing: "Paid",
    officialUrl: "https://sora.com",
    isFeatured: true,
    architectureDetails: "Diffusion Transformer (DiT) operating on spacetime latent patches representing video data.",
    companyBackground: "Built by OpenAI's visual research division.",
    relatedToolSlugs: ["google-veo", "runway-gen3", "kling-ai"]
  },
  {
    id: "openai-codex",
    slug: "openai-codex",
    name: "OpenAI Codex",
    company: "OpenAI",
    category: "Coding & Autonomous Agents",
    secondaryCategories: ["Workflow & Automation"],
    tagline: "Software engineering agent model powering modern code synthesis, refactoring, and execution.",
    description: "OpenAI Codex is the specialized code-generation and software execution foundation developed by OpenAI. It translates natural language instructions into functional code across dozens of programming languages and drives autonomous terminal coding agents.",
    keyFeatures: [
      "Proficient across 20+ languages including Python, TypeScript, Go, Rust, and SQL",
      "API and CLI command generation with syntax validation",
      "Automated unit test writing and test assertion generation",
      "Powers autonomous terminal agents and interactive coding assistants"
    ],
    bestFor: "Software engineers, DevOps leads, and automation developers.",
    pricing: "Paid",
    officialUrl: "https://openai.com/index/openai-codex",
    isFeatured: false,
    architectureDetails: "GPT architecture fine-tuned on billions of lines of open-source and proprietary codebases.",
    companyBackground: "OpenAI research milestone that initially seeded GitHub Copilot.",
    relatedToolSlugs: ["claude-code", "cursor", "github-copilot"]
  },
  {
    id: "gpt-4o",
    slug: "gpt-4o",
    name: "GPT-4o",
    company: "OpenAI",
    category: "Conversational & Reasoning LLMs",
    secondaryCategories: ["Coding & Autonomous Agents", "Research & Search Engines"],
    tagline: "Flagship omni model natively integrating text, vision, and real-time audio at frontier speed.",
    description: "GPT-4o ('omni') is OpenAI's flagship frontier model that processes and generates text, audio, and visual information in a single neural network. It matches GPT-4 Turbo performance on English text and coding while delivering 2x faster token generation.",
    keyFeatures: [
      "Single-model native audio/vision/text tokenization without transcription bottlenecks",
      "Vision comprehension benchmark leader across chart, diagram, and UI inspection",
      "128k context window with structured JSON output enforcement",
      "High-throughput enterprise API with halved inference cost"
    ],
    bestFor: "Enterprise developers, real-time agent architects, and product engineering teams.",
    pricing: "Paid",
    officialUrl: "https://openai.com/index/hello-gpt-4o",
    isFeatured: true,
    architectureDetails: "Omni-modal Transformer trained end-to-end across text, audio, and pixel tokens.",
    companyBackground: "Launched by OpenAI in May 2024 as their unified multimodal intelligence engine.",
    relatedToolSlugs: ["chatgpt", "openai-o3-mini", "google-gemini", "claude"]
  },
  {
    id: "openai-o3-mini",
    slug: "openai-o3-mini",
    name: "OpenAI o3-mini",
    company: "OpenAI",
    category: "Conversational & Reasoning LLMs",
    secondaryCategories: ["Coding & Autonomous Agents", "Research & Search Engines"],
    tagline: "High-speed STEM and coding reasoning model employing reinforcement learning thinking tokens.",
    description: "OpenAI o3-mini is OpenAI's cost-effective reasoning model optimized for coding, mathematics, and science. Utilizing reinforcement learning to deliberate before answering, o3-mini achieves exceptional performance on competitive programming and complex logic tasks.",
    keyFeatures: [
      "Configurable reasoning effort (Low, Medium, High) matching latency constraints",
      "Frontier competitive coding performance on Codeforces benchmarks",
      "Chain-of-thought self-correction and mathematical proofs verification",
      "Native function calling and structured outputs support"
    ],
    bestFor: "Algorithmic software engineers, quantitative analysts, and automated test runners.",
    pricing: "Freemium",
    officialUrl: "https://openai.com/index/openai-o3-mini",
    isFeatured: false,
    architectureDetails: "Reinforcement-learning-trained reasoning model using internal thinking tokens before generation.",
    companyBackground: "Part of OpenAI's o-series reasoning lineup launched in early 2025.",
    relatedToolSlugs: ["gpt-4o", "deepseek-r1", "claude"]
  },

  // ==========================================
  // ANTHROPIC ECOSYSTEM
  // ==========================================
  {
    id: "claude",
    slug: "claude",
    name: "Claude (Sonnet & Opus)",
    company: "Anthropic",
    category: "Conversational & Reasoning LLMs",
    secondaryCategories: ["Coding & Autonomous Agents", "Research & Search Engines"],
    tagline: "Frontier reasoning model known for superior coding benchmarks, nuanced writing, and Artifacts.",
    description: "Claude is Anthropic's premier AI assistant family, headlined by Claude 3.7 Sonnet and Claude 3.5 Opus. Renowned for leading software engineering benchmarks, constitutional safety, and the interactive 'Artifacts' live application sandbox.",
    keyFeatures: [
      "Artifacts workspace rendering live interactive React components, SVG, and HTML apps",
      "Leader across SWE-bench Verified coding and system refactoring benchmarks",
      "Hybrid thinking mode balancing instantaneous answers with deliberate chain-of-thought",
      "200,000-token context window with near-perfect needle-in-a-haystack recall"
    ],
    bestFor: "Software engineers, systems architects, legal analysts, and technical product teams.",
    pricing: "Freemium",
    officialUrl: "https://claude.ai",
    isFeatured: true,
    architectureDetails: "Constitutional AI-aligned Transformer with hybrid instant and deep-thought deliberation paths.",
    companyBackground: "Developed by Anthropic, the AI safety and research public benefit corporation founded by former OpenAI researchers.",
    relatedToolSlugs: ["claude-code", "cursor", "google-gemini", "chatgpt"]
  },
  {
    id: "claude-code",
    slug: "claude-code",
    name: "Claude Code",
    company: "Anthropic",
    category: "Coding & Autonomous Agents",
    secondaryCategories: ["Workflow & Automation"],
    tagline: "Agentic command-line tool that navigates, refactors, and tests full git repositories directly in terminal.",
    description: "Claude Code is Anthropic's agentic command-line interface that brings Claude directly into your terminal. It understands git history, edits multiple files simultaneously, runs test suites, fixes compilation errors, and crafts atomic pull requests autonomously.",
    keyFeatures: [
      "Direct CLI terminal integration with automatic bash command execution",
      "Multi-file architectural codebase navigation and context grep",
      "Automated test-driven repair: executes npm test/pytest and fixes failing tests",
      "Git commit and PR generation with semantic change summaries"
    ],
    bestFor: "Terminal-centric developers, DevOps engineers, and open-source maintainers.",
    pricing: "Paid",
    officialUrl: "https://docs.anthropic.com/en/docs/agents-and-tools/claude-code/overview",
    isFeatured: true,
    architectureDetails: "Terminal agent runtime leveraging Claude 3.7 Sonnet with automated bash sandbox permissions.",
    companyBackground: "Built by Anthropic's developer tooling division.",
    relatedToolSlugs: ["claude", "google-antigravity", "cursor", "openai-codex"]
  },

  // ==========================================
  // META ECOSYSTEM
  // ==========================================
  {
    id: "llama-3-3",
    slug: "llama-3-3",
    name: "Llama 3.3 (70B & 405B)",
    company: "Meta",
    category: "Conversational & Reasoning LLMs",
    secondaryCategories: ["Coding & Autonomous Agents", "Workflow & Automation"],
    tagline: "Industry-standard open-weights foundation model offering frontier performance on private infrastructure.",
    description: "Meta's Llama 3.3 is the world's leading open-weights large language model. Providing 70B and 405B parameter variants with a 128k context window, Llama 3.3 delivers GPT-4 class coding, math, and multilingual performance that can be self-hosted securely on private hardware.",
    keyFeatures: [
      "Open weights allowing on-premises hosting with zero data telemetry",
      "Matches proprietary frontier models on multilingual reasoning and coding benchmarks",
      "128k context window with Grouped-Query Attention (GQA) for fast inference",
      "Extensive ecosystem support across Ollama, vLLM, TensorRT-LLM, and Hugging Face"
    ],
    bestFor: "Enterprise security teams, privacy-conscious developers, and local AI deployers.",
    pricing: "Open Source",
    officialUrl: "https://llama.meta.com",
    isFeatured: true,
    architectureDetails: "Dense decoder-only auto-regressive Transformer trained on over 15 trillion tokens with supervised fine-tuning and DPO.",
    companyBackground: "Released by Meta AI / FAIR (Fundamental AI Research).",
    relatedToolSlugs: ["meta-ai", "sam-2", "deepseek-r1", "qwen-2-5-coder"]
  },
  {
    id: "meta-ai",
    slug: "meta-ai",
    name: "Meta AI",
    company: "Meta",
    category: "Conversational & Reasoning LLMs",
    secondaryCategories: ["Video & Image Editing AI", "Research & Search Engines"],
    tagline: "Mass-scale consumer assistant embedded across WhatsApp, Instagram, Messenger, and Ray-Ban smart glasses.",
    description: "Meta AI is Meta's consumer-facing assistant integrated directly across Instagram, WhatsApp, Messenger, web browsers, and Ray-Ban Meta smart glasses. Powered by Llama 3 models, it handles text generation, real-time image creation, and multimodal voice interactions.",
    keyFeatures: [
      "Native real-time multimodal vision on Ray-Ban Meta smart glasses",
      "Imagine feature generating real-time animated images as you type",
      "Deep integration inside WhatsApp groups and Instagram direct messages",
      "Web browsing and search integration powered by Bing and Google"
    ],
    bestFor: "Everyday consumers, wearable device users, and social community managers.",
    pricing: "Free",
    officialUrl: "https://www.meta.ai",
    isFeatured: false,
    architectureDetails: "Llama foundation models optimized for low-latency edge multimodal inference on wearable sensors.",
    companyBackground: "Developed by Meta's Consumer AI team.",
    relatedToolSlugs: ["llama-3-3", "sam-2", "chatgpt"]
  },
  {
    id: "sam-2",
    slug: "sam-2",
    name: "Segment Anything 2 (SAM 2)",
    company: "Meta",
    category: "Video & Image Editing AI",
    secondaryCategories: ["UI/UX & Product Design AI"],
    tagline: "Foundation model for zero-shot object segmentation and visual tracking across real-time video and images.",
    description: "Segment Anything Model 2 (SAM 2) is Meta FAIR's open foundation model for promptable visual segmentation in both images and videos. It tracks any object across video frames with a single click, handling occlusions and camera perspective shifts seamlessly.",
    keyFeatures: [
      "Zero-shot real-time video object segmentation and continuous tracking",
      "Interactive promptable mask generation via clicks, bounding boxes, or masks",
      "Memory attention mechanism storing object appearance across long video sequences",
      "Open source weights and training code for computer vision pipelines"
    ],
    bestFor: "Computer vision researchers, video VFX editors, robotics engineers, and medical imaging specialists.",
    pricing: "Open Source",
    officialUrl: "https://segment-anything.com",
    isFeatured: false,
    architectureDetails: "Streaming video Transformer architecture with a memory module and promptable mask decoder.",
    companyBackground: "Published by Meta FAIR (Fundamental AI Research).",
    relatedToolSlugs: ["llama-3-3", "runway-gen3", "descript"]
  },

  // ==========================================
  // XAI ECOSYSTEM
  // ==========================================
  {
    id: "grok-3",
    slug: "grok-3",
    name: "Grok 3",
    company: "xAI",
    category: "Conversational & Reasoning LLMs",
    secondaryCategories: ["Research & Search Engines", "Coding & Autonomous Agents"],
    tagline: "Colossus-trained reasoning model with real-time X news grounding and DeepSearch capabilities.",
    description: "Grok 3 is xAI's flagship intelligence model trained on the Memphis 'Colossus' 100k+ H100/H200 GPU cluster. Featuring DeepSearch real-time news retrieval, Think mode for mathematics and science, and unrestricted conversational tone.",
    keyFeatures: [
      "Real-time live news and social intelligence ingestion from the X platform",
      "Think mode executing deep multi-step mathematical and algorithmic proofs",
      "DeepSearch agent synthesizing hundreds of primary sources for complex queries",
      "Multimodal document analysis with high-fidelity image inspection"
    ],
    bestFor: "Finance analysts, investigative researchers, developers, and breaking news followers.",
    pricing: "Paid",
    officialUrl: "https://x.ai/grok",
    isFeatured: true,
    architectureDetails: "Massive scale Mixture-of-Experts trained on xAI's Colossus supercomputer in Memphis, Tennessee.",
    companyBackground: "Founded by Elon Musk in 2023 to advance artificial general intelligence.",
    relatedToolSlugs: ["grok-build", "chatgpt", "perplexity-ai"]
  },
  {
    id: "grok-build",
    slug: "grok-build",
    name: "Grok Build / xAI API",
    company: "xAI",
    category: "Coding & Autonomous Agents",
    secondaryCategories: ["Workflow & Automation"],
    tagline: "Developer platform and OpenAI-compatible API for integrating Grok reasoning and live search into applications.",
    description: "The xAI API provides developers with direct access to Grok 3, Grok 2 Vision, and live X search endpoints. Offering drop-in OpenAI client SDK compatibility, function calling, vision processing, and high token throughput.",
    keyFeatures: [
      "Drop-in OpenAI SDK compatibility for instant migration",
      "Live search and real-time social knowledge endpoints",
      "Structured JSON output and function/tool calling",
      "High rate limits and scalable cloud inference"
    ],
    bestFor: "API developers building financial trackers, sentiment bots, and agentic workflows.",
    pricing: "Paid",
    officialUrl: "https://console.x.ai",
    isFeatured: false,
    architectureDetails: "Cloud inference endpoint optimized for low time-to-first-token (TTFT) and high concurrency.",
    companyBackground: "The developer platform of xAI.",
    relatedToolSlugs: ["grok-3", "openai-codex", "claude-code"]
  },

  // ==========================================
  // MICROSOFT & GITHUB ECOSYSTEM
  // ==========================================
  {
    id: "github-copilot",
    slug: "github-copilot",
    name: "GitHub Copilot",
    company: "Microsoft & GitHub",
    category: "Coding & Autonomous Agents",
    secondaryCategories: ["Workflow & Automation"],
    tagline: "The world's most widely adopted developer AI pair programmer with multi-model chat and workspace edits.",
    description: "GitHub Copilot integrates directly inside Visual Studio Code, Visual Studio, JetBrains, and GitHub.com. It supports inline multi-line completions, chat-based refactoring with model switching (Claude, GPT-4o, Gemini), and autonomous Copilot Workspace issue resolution.",
    keyFeatures: [
      "Multi-model flexibility: switch between Claude 3.7 Sonnet, GPT-4o, and Gemini 2.0 Flash in chat",
      "Copilot Workspace for turning GitHub issues into full pull requests automatically",
      "Copilot Edits for multi-file cross-repo code modifications",
      "Enterprise security governance and IP indemnification"
    ],
    bestFor: "Enterprise engineering organizations and developers working in VS Code and JetBrains.",
    pricing: "Paid",
    officialUrl: "https://github.com/features/copilot",
    isFeatured: true,
    architectureDetails: "IDE integration extension routing context through Azure OpenAI Service and Anthropic API endpoints.",
    companyBackground: "Collaboratively engineered by GitHub and Microsoft.",
    relatedToolSlugs: ["microsoft-copilot-studio", "cursor", "google-antigravity", "claude-code"]
  },
  {
    id: "microsoft-copilot-studio",
    slug: "microsoft-copilot-studio",
    name: "Microsoft Copilot Studio",
    company: "Microsoft & GitHub",
    category: "Workflow & Automation",
    secondaryCategories: ["Conversational & Reasoning LLMs"],
    tagline: "Low-code graphical tool for building and orchestrating enterprise autonomous Copilot agents.",
    description: "Microsoft Copilot Studio allows enterprise teams to create, customize, and orchestrate standalone AI agents. It connects with 1,000+ business data connectors, SAP, Microsoft 365 Graph, and Salesforce with enterprise role-based access control.",
    keyFeatures: [
      "Autonomous agent triggers for event-driven business process automation",
      "1,000+ pre-built connectors to SharePoint, Salesforce, SAP, and ServiceNow",
      "Generative orchestration choosing dynamic execution paths based on user input",
      "Built-in compliance, data loss prevention (DLP), and governance telemetry"
    ],
    bestFor: "Enterprise architects, IT managers, and operations teams building internal workforce agents.",
    pricing: "Paid",
    officialUrl: "https://copilotstudio.microsoft.com",
    isFeatured: false,
    architectureDetails: "Azure-hosted low-code bot framework powered by Azure OpenAI Service and Microsoft Graph.",
    companyBackground: "Enterprise SaaS platform from Microsoft Business Applications.",
    relatedToolSlugs: ["github-copilot", "langgraph", "crewai"]
  },

  // ==========================================
  // VERCEL ECOSYSTEM
  // ==========================================
  {
    id: "v0-by-vercel",
    slug: "v0-by-vercel",
    name: "v0 by Vercel",
    company: "Vercel",
    category: "UI/UX & Product Design AI",
    secondaryCategories: ["Coding & Autonomous Agents"],
    tagline: "Generative UI and full-stack web application builder turning natural language into modern React apps.",
    description: "v0 is Vercel's generative UI pair programmer. It creates accessible, responsive UI components and complete full-stack web applications using React, Next.js App Router, Tailwind CSS, and shadcn/ui. Featuring instant preview sandboxes and git pull request sync.",
    keyFeatures: [
      "Instant visual preview with interactive client-side React rendering",
      "Native shadcn/ui and Tailwind CSS component generation",
      "One-click 'Add to Codebase' CLI command (npx shadcn add ...)",
      "Full-stack Next.js project scaffolding with API route generation"
    ],
    bestFor: "Design engineers, indie hackers, and frontend developers building polished web applications.",
    pricing: "Freemium",
    officialUrl: "https://v0.dev",
    isFeatured: true,
    architectureDetails: "Specialized generative UI system fine-tuned on React, Radix UI primitives, and Tailwind design patterns.",
    companyBackground: "Built by Vercel, the creators of Next.js.",
    relatedToolSlugs: ["vercel-ai-sdk", "google-stitch", "lovable", "bolt-new"]
  },
  {
    id: "vercel-ai-sdk",
    slug: "vercel-ai-sdk",
    name: "Vercel AI SDK",
    company: "Vercel",
    category: "Workflow & Automation",
    secondaryCategories: ["Coding & Autonomous Agents"],
    tagline: "The open-source TypeScript library for building AI-powered web applications and streaming agent UIs.",
    description: "The Vercel AI SDK is the industry-standard TypeScript toolkit for building generative AI applications. It offers unified streaming APIs for OpenAI, Anthropic, Google, and Mistral, alongside client-side React hooks for streaming chat and Generative UI.",
    keyFeatures: [
      "Unified provider abstraction across OpenAI, Anthropic, Gemini, Groq, and Ollama",
      "StreamText and generateObject APIs for type-safe structured data generation via Zod",
      "React server actions and client hooks (useChat, useCompletion) for seamless UX",
      "Multi-agent tool orchestration and tool-calling loops"
    ],
    bestFor: "Full-stack TypeScript and Next.js developers building AI-native user interfaces.",
    pricing: "Open Source",
    officialUrl: "https://sdk.vercel.ai",
    isFeatured: false,
    architectureDetails: "Isomorphic TypeScript library with Web Streams API primitives and provider adapter architecture.",
    companyBackground: "Open source framework maintained by Vercel.",
    relatedToolSlugs: ["v0-by-vercel", "langgraph", "crewai"]
  },

  // ==========================================
  // CREATIVE & EDITING SPECIALISTS
  // ==========================================
  {
    id: "runway-gen3",
    slug: "runway-gen3",
    name: "Runway (Gen-3 Alpha)",
    company: "Creative & Editing Specialists",
    category: "Video & Image Editing AI",
    secondaryCategories: ["UI/UX & Product Design AI"],
    tagline: "Pioneering generative video and VFX suite featuring precision camera controls and motion brush.",
    description: "Runway Gen-3 Alpha is a state-of-the-art video generation and editing platform built for filmmakers and creative studios. It provides fine-grained control over camera movements, character performance, motion brush masking, and style transfers.",
    keyFeatures: [
      "Motion Brush for assigning directional velocities to specific elements in a frame",
      "Precision camera controls including pan, zoom, tilt, roll, and tracking",
      "Gen-3 Alpha text-to-video, image-to-video, and video-to-video pipelines",
      "Enterprise VFX asset suite with background removal and generative expansion"
    ],
    bestFor: "Creative agencies, VFX supervisors, commercial video editors, and music video directors.",
    pricing: "Paid",
    officialUrl: "https://runwayml.com",
    isFeatured: true,
    architectureDetails: "Spatiotemporal video foundation models co-trained on multimodal video and structural metadata.",
    companyBackground: "Runway AI Inc., founded in 2018 in New York City.",
    relatedToolSlugs: ["google-veo", "sora", "kling-ai", "descript"]
  },
  {
    id: "midjourney",
    slug: "midjourney",
    name: "Midjourney (v6.1)",
    company: "Creative & Editing Specialists",
    category: "Video & Image Editing AI",
    secondaryCategories: ["UI/UX & Product Design AI"],
    tagline: "The benchmark for artistic fidelity, textural nuance, and visual aesthetic in generative imagery.",
    description: "Midjourney is an independent research lab producing the world's most aesthetically celebrated AI image generation engine. Known for hyper-realistic textures, editorial photography simulation, and artistic mastery accessible via Discord and web.",
    keyFeatures: [
      "Unmatched artistic aesthetics, lighting nuances, and photorealistic skin textures",
      "Inpainting / Vary Region and generative canvas zoom/pan (outpainting)",
      "Style reference (--sref) and character consistency (--cref) parameters",
      "Dedicated web creation studio with canvas curation tools"
    ],
    bestFor: "Concept artists, editorial photographers, game designers, and creative directors.",
    pricing: "Paid",
    officialUrl: "https://www.midjourney.com",
    isFeatured: true,
    architectureDetails: "Proprietary generative latent diffusion models trained on vast visual culture corpora.",
    companyBackground: "Independent research lab founded by David Holz in San Francisco.",
    relatedToolSlugs: ["imagen-3", "adobe-firefly", "runway-gen3"]
  },
  {
    id: "descript",
    slug: "descript",
    name: "Descript",
    company: "Creative & Editing Specialists",
    category: "Audio, Voice & Music AI",
    secondaryCategories: ["Video & Image Editing AI", "Workflow & Automation"],
    tagline: "Text-based video and podcast editor with AI voice cloning, filler word removal, and Eye Contact.",
    description: "Descript revolutionizes podcast and video post-production by treating audio/video editing like editing a text document. Delete words from the transcript to cut them from the footage, fix misspoken words with cloned voices, and adjust eye contact automatically.",
    keyFeatures: [
      "Transcript-based video editing: edit audio and video by simply deleting or typing text",
      "Overdub AI voice cloning to generate spoken fixes for script changes",
      "One-click filler word remover (strips 'um', 'uh', and awkward pauses)",
      "AI Eye Contact fixer repositioning gaze directly toward the camera lens"
    ],
    bestFor: "Podcasters, YouTube creators, corporate communications teams, and video educators.",
    pricing: "Freemium",
    officialUrl: "https://www.descript.com",
    isFeatured: false,
    architectureDetails: "Desktop audio-video engine coupled with cloud neural speech transcription and voice synthesis pipelines.",
    companyBackground: "Founded by former Groupon CEO Andrew Mason.",
    relatedToolSlugs: ["elevenlabs", "suno", "capcut-ai"]
  },
  {
    id: "adobe-firefly",
    slug: "adobe-firefly",
    name: "Adobe Firefly",
    company: "Creative & Editing Specialists",
    category: "Video & Image Editing AI",
    secondaryCategories: ["UI/UX & Product Design AI"],
    tagline: "Commercially safe generative creative engine embedded in Photoshop, Illustrator, and Premiere.",
    description: "Adobe Firefly is Adobe's family of creative generative AI models trained exclusively on Adobe Stock and public domain content. Powers Generative Fill in Photoshop, vector recoloring in Illustrator, and generative video extensions in Premiere Pro with enterprise IP indemnification.",
    keyFeatures: [
      "Commercially safe enterprise model trained on licensed Adobe Stock images",
      "Generative Fill and Generative Expand embedded natively inside Adobe Photoshop",
      "Text to Vector Graphic generation in Adobe Illustrator with scalable SVG output",
      "Generative Extend in Premiere Pro adding seamless frames to audio and video clips"
    ],
    bestFor: "Enterprise creative departments, brand designers, and professional retouchers.",
    pricing: "Paid",
    officialUrl: "https://www.adobe.com/products/firefly.html",
    isFeatured: false,
    architectureDetails: "Diffusion foundation models trained under strict commercial licensing guidelines with Content Credentials (C2PA).",
    companyBackground: "Developed by Adobe Inc. in San Jose, California.",
    relatedToolSlugs: ["midjourney", "imagen-3", "runway-gen3"]
  },
  {
    id: "capcut-ai",
    slug: "capcut-ai",
    name: "CapCut AI",
    company: "Creative & Editing Specialists",
    category: "Video & Image Editing AI",
    secondaryCategories: ["Audio, Voice & Music AI"],
    tagline: "Automated short-form video creation suite with viral auto-captions and script-to-video generation.",
    description: "CapCut AI provides mobile and desktop creators with automated AI video editing tools. It features one-click viral dynamic subtitles, automated script-to-video assembly, background removal, and smart audio beat matching optimized for TikTok, Reels, and Shorts.",
    keyFeatures: [
      "Automated animated viral captions with multi-language translation and styling",
      "Script-to-video generator compiling B-roll stock, voiceovers, and transitions",
      "AI body effects, automated chromakey, and seamless background cutout",
      "Smart audio sync matching clip cuts to musical beats"
    ],
    bestFor: "Short-form video creators, TikTok and Instagram creators, and social media agencies.",
    pricing: "Freemium",
    officialUrl: "https://www.capcut.com",
    isFeatured: false,
    architectureDetails: "Client-side video editing engine backed by ByteDance's multimodal recommendation and media models.",
    companyBackground: "ByteDance's flagship consumer video editing ecosystem.",
    relatedToolSlugs: ["descript", "runway-gen3", "elevenlabs"]
  },
  {
    id: "elevenlabs",
    slug: "elevenlabs",
    name: "ElevenLabs",
    company: "Creative & Editing Specialists",
    category: "Audio, Voice & Music AI",
    secondaryCategories: ["Workflow & Automation"],
    tagline: "Industry-leading realistic text-to-speech, voice cloning, and multilingual conversational AI agents.",
    description: "ElevenLabs produces the most emotionally nuanced and natural-sounding AI voices in existence. It provides high-fidelity speech synthesis across 32 languages, instant and professional voice cloning, sound effects generation, and conversational agent infrastructure.",
    keyFeatures: [
      "Hyper-realistic emotional speech synthesis with pacing, laughter, and breath nuances",
      "Voice cloning requiring as little as 1 minute of reference audio",
      "Conversational AI Agent SDK with sub-400ms end-to-end voice latency",
      "AI sound effects generator creating cinematic SFX from descriptive text prompts"
    ],
    bestFor: "Audiobook publishers, game developers, conversational bot builders, and filmmakers.",
    pricing: "Freemium",
    officialUrl: "https://elevenlabs.io",
    isFeatured: true,
    architectureDetails: "Neural speech foundation models with latent audio diffusion and prosody conditioning.",
    companyBackground: "AI voice technology company founded by Piotr Dabkowski and Mati Staniszewski.",
    relatedToolSlugs: ["suno", "descript", "notebooklm"]
  },
  {
    id: "suno",
    slug: "suno",
    name: "Suno",
    company: "Creative & Editing Specialists",
    category: "Audio, Voice & Music AI",
    secondaryCategories: [],
    tagline: "Full-length song generation system creating professional vocals, instrumentals, and lyrics from text prompts.",
    description: "Suno turns any prompt into complete, radio-quality musical tracks spanning pop, rock, jazz, classical, electronic, and hip-hop. It generates coherent vocal melodies, lyrical verses, harmonic progressions, and studio mastering in under 30 seconds.",
    keyFeatures: [
      "Generates full 2-minute songs with intro, verses, chorus, bridge, and outro",
      "Realistic male and female singing vocals with genre-specific timbre and style",
      "Custom lyrics input mode allowing lyricists to compose original songs",
      "Audio extension and stem separation capabilities"
    ],
    bestFor: "Musicians, content creators, game composers, and digital marketers.",
    pricing: "Freemium",
    officialUrl: "https://suno.com",
    isFeatured: false,
    architectureDetails: "Autoregressive audio token model trained on paired musical waveforms, stems, and lyrical transcripts.",
    companyBackground: "Cambridge, Massachusetts music AI research lab founded by former Kensho machine learning pioneers.",
    relatedToolSlugs: ["elevenlabs", "descript"]
  },
  {
    id: "kling-ai",
    slug: "kling-ai",
    name: "Kling AI",
    company: "Creative & Editing Specialists",
    category: "Video & Image Editing AI",
    secondaryCategories: [],
    tagline: "High-motion generative video model producing realistic physical interactions and 1080p clips up to 2 minutes.",
    description: "Kling AI is Kuaishou's generative video model celebrated for simulating realistic complex physics (liquids pouring, food chewing, athlete movements) and generating continuous video scenes up to 2 minutes at 1080p 30fps.",
    keyFeatures: [
      "Simulates complex real-world physical motion and character body kinematics",
      "Extended generation duration creating up to 2-minute cohesive video clips",
      "Camera motion presets matching cinematic dolly, pan, and crane movements",
      "Image-to-video with keyframe start-to-end transition interpolation"
    ],
    bestFor: "Video producers, 3D animators, commercial directors, and motion designers.",
    pricing: "Freemium",
    officialUrl: "https://klingai.com",
    isFeatured: false,
    architectureDetails: "3D spatiotemporal joint attention mechanism running on proprietary neural video architecture.",
    companyBackground: "Developed by Kuaishou Technology.",
    relatedToolSlugs: ["runway-gen3", "google-veo", "sora"]
  },

  // ==========================================
  // DEVELOPER & SEARCH LEADERS
  // ==========================================
  {
    id: "cursor",
    slug: "cursor",
    name: "Cursor",
    company: "Developer & Search Leaders",
    category: "Coding & Autonomous Agents",
    secondaryCategories: ["Workflow & Automation"],
    tagline: "The premier AI-first code editor with whole-codebase Composer and predictive multi-line editing.",
    description: "Cursor is an AI-first fork of VS Code engineered to augment human developers. Featuring 'Composer' for multi-file generation, instant codebase indexing for semantic search, and predictive edits that anticipate your next keystroke across files.",
    keyFeatures: [
      "Composer mode orchestrating multi-file codebase modifications and terminal commands",
      "Semantic codebase indexing using embeddings to answer architecture questions accurately",
      "Tab autocomplete with predictive cursor positioning across disparate files",
      "Flexible model selection: Claude 3.7 Sonnet, GPT-4o, and o3-mini"
    ],
    bestFor: "Professional software engineers, tech leads, and fast-moving startup engineering teams.",
    pricing: "Freemium",
    officialUrl: "https://www.cursor.com",
    isFeatured: true,
    architectureDetails: "VS Code upstream fork augmented with local Merkle-tree codebase indexing and streaming agent orchestration.",
    companyBackground: "Created by Anysphere, an applied research lab founded by MIT researchers.",
    relatedToolSlugs: ["windsurf", "google-antigravity", "claude-code", "github-copilot"]
  },
  {
    id: "windsurf",
    slug: "windsurf",
    name: "Windsurf",
    company: "Developer & Search Leaders",
    category: "Coding & Autonomous Agents",
    secondaryCategories: ["Workflow & Automation"],
    tagline: "Agentic IDE powered by 'Flows' that seamlessly blend copilot assistance with autonomous coding agent workflows.",
    description: "Windsurf by Codeium is an agentic code editor designed around the concept of 'Flows'. It allows developers to seamlessly transition between interactive inline assistance and fully autonomous agent execution where the AI reads files, edits code, and executes terminal commands.",
    keyFeatures: [
      "Flow paradigm balancing developer control with autonomous agent delegation",
      "Cascade agent with full workspace terminal and file editing tools",
      "Supercomplete multi-line completions anticipating architectural refactors",
      "Enterprise on-premises and self-hosted deployment models"
    ],
    bestFor: "Enterprise developers, systems programmers, and teams desiring autonomous IDE capabilities.",
    pricing: "Freemium",
    officialUrl: "https://codeium.com/windsurf",
    isFeatured: false,
    architectureDetails: "Custom IDE architecture built on Codeium's proprietary indexing engine and Cascade agent runtime.",
    companyBackground: "Developed by Codeium (Exafunction Inc.), based in Mountain View, California.",
    relatedToolSlugs: ["cursor", "google-antigravity", "claude-code"]
  },
  {
    id: "lovable",
    slug: "lovable",
    name: "Lovable",
    company: "Developer & Search Leaders",
    category: "Coding & Autonomous Agents",
    secondaryCategories: ["UI/UX & Product Design AI"],
    tagline: "Full-stack application builder that crafts complete, deployable web apps from natural language.",
    description: "Lovable enables anyone to build real, scalable software through conversation. It generates complete React frontends, integrates with Supabase for databases and authentication, manages GitHub repositories, and handles deployment automatically.",
    keyFeatures: [
      "Natural language to full-stack production application development",
      "Automatic Supabase backend integration (Postgres, Auth, Edge Functions)",
      "Continuous synchronization with your personal or organization GitHub repositories",
      "Interactive visual canvas with live sandbox preview and responsive views"
    ],
    bestFor: "Indie hackers, startup founders, product managers, and non-technical builders shipping MVPs.",
    pricing: "Freemium",
    officialUrl: "https://lovable.dev",
    isFeatured: true,
    architectureDetails: "Autonomous software development engine fine-tuned for React, Vite, Tailwind, and Supabase cloud architectures.",
    companyBackground: "European software startup founded by Anton Osika and Fabian Hedin.",
    relatedToolSlugs: ["v0-by-vercel", "bolt-new", "cursor"]
  },
  {
    id: "perplexity-ai",
    slug: "perplexity-ai",
    name: "Perplexity AI",
    company: "Developer & Search Leaders",
    category: "Research & Search Engines",
    secondaryCategories: ["Conversational & Reasoning LLMs"],
    tagline: "Conversational answer engine delivering real-time synthesized answers with interactive source citations.",
    description: "Perplexity AI is a conversational search engine that replaces traditional search link lists with direct, synthesized answers backed by clickable citations. Features 'Pro Search' for multi-step research queries, file analysis, and curated Pages publication.",
    keyFeatures: [
      "Cited answers with interactive, verifiable sources and publication metadata",
      "Pro Search executing multi-step search queries, clarifying questions, and Python calculations",
      "Collections feature for organizing research projects and shared team knowledge bases",
      "Choice of underlying frontier models: Claude 3.7 Sonnet, GPT-4o, and Sonar models"
    ],
    bestFor: "Researchers, knowledge workers, students, and executives needing verified real-time information.",
    pricing: "Freemium",
    officialUrl: "https://www.perplexity.ai",
    isFeatured: true,
    architectureDetails: "Retrieval-Augmented Generation (RAG) architecture with real-time web indexing and Sonar models.",
    companyBackground: "Founded in 2022 by Aravind Srinivas, Denis Yarats, Johnny Ho, and Andy Konwinski.",
    relatedToolSlugs: ["notebooklm", "google-gemini", "chatgpt"]
  },
  {
    id: "bolt-new",
    slug: "bolt-new",
    name: "Bolt.new",
    company: "Developer & Search Leaders",
    category: "Coding & Autonomous Agents",
    secondaryCategories: ["Workflow & Automation"],
    tagline: "In-browser AI full-stack development environment utilizing WebContainers to run full Node.js servers.",
    description: "Bolt.new by StackBlitz allows developers to prompt, build, run, and deploy full-stack web applications entirely inside the browser. Powered by WebContainers, it runs an actual Node.js runtime inside your browser tab without remote container lag.",
    keyFeatures: [
      "Runs full Node.js runtimes, package installations, and dev servers inside browser memory via WebContainers",
      "Full-stack scaffolding across Vite, Next.js, Remix, Astro, and SvelteKit",
      "Direct deployment to Netlify and cloud hosting providers with one click",
      "Live error detection and automatic agentic debugging loops"
    ],
    bestFor: "Full-stack developers prototyping rapid apps and educators building live interactive tutorials.",
    pricing: "Freemium",
    officialUrl: "https://bolt.new",
    isFeatured: false,
    architectureDetails: "WebAssembly-based WebContainer operating system runtime paired with frontier LLM orchestration.",
    companyBackground: "Built by StackBlitz, the creators of WebContainers.",
    relatedToolSlugs: ["v0-by-vercel", "lovable", "cursor"]
  },
  {
    id: "devin-by-cognition",
    slug: "devin-by-cognition",
    name: "Devin",
    company: "Developer & Search Leaders",
    category: "Coding & Autonomous Agents",
    secondaryCategories: ["Workflow & Automation"],
    tagline: "Autonomous AI software engineer equipped with its own shell, code editor, and browser sandbox.",
    description: "Devin by Cognition is recognized as the first autonomous AI software engineer. Given an issue or pull request, Devin plans the implementation, browses documentation, writes code, executes tests in a secure sandboxed cloud container, and reports progress to engineers.",
    keyFeatures: [
      "Autonomous end-to-end task execution: from GitHub issue triage to passing pull request",
      "Equipped with its own sandboxed Linux shell, browser, and code editor",
      "Learns unfamiliar APIs and technologies on the fly by reading online documentation",
      "Slack and GitHub integration for real-time collaboration with engineering teams"
    ],
    bestFor: "Enterprise engineering teams automating backlog triage, migrations, and bug fixes.",
    pricing: "Paid",
    officialUrl: "https://devin.ai",
    isFeatured: false,
    architectureDetails: "Long-horizon autonomous planning agent operating inside isolated cloud sandboxes with browser-use tooling.",
    companyBackground: "Cognition AI, founded by competitive programming gold medalists led by Scott Wu.",
    relatedToolSlugs: ["google-antigravity", "claude-code", "replit-agent"]
  },
  {
    id: "replit-agent",
    slug: "replit-agent",
    name: "Replit Agent",
    company: "Developer & Search Leaders",
    category: "Coding & Autonomous Agents",
    secondaryCategories: ["Workflow & Automation"],
    tagline: "Autonomous cloud agent that architects, builds, provisions, and deploys full applications from mobile or web.",
    description: "Replit Agent builds full-stack applications from scratch by understanding project requirements, designing database schemas, writing backend/frontend code, and provisioning live cloud deployment natively within the Replit ecosystem.",
    keyFeatures: [
      "End-to-end application architecture from natural language specification",
      "Automated database provisioning (PostgreSQL) and schema migration",
      "One-click mobile and web access: build software on your smartphone",
      "Instant serverless hosting on custom domains"
    ],
    bestFor: "Founders, product builders, non-programmers, and engineers building prototypes on the go.",
    pricing: "Paid",
    officialUrl: "https://replit.com",
    isFeatured: false,
    architectureDetails: "Agentic supervisor orchestrating Replit's cloud development environment and Nix containers.",
    companyBackground: "Created by Replit Inc., led by Amjad Masad in San Francisco.",
    relatedToolSlugs: ["lovable", "bolt-new", "devin-by-cognition"]
  },

  // ==========================================
  // OPEN SOURCE & INDEPENDENT
  // ==========================================
  {
    id: "deepseek-r1",
    slug: "deepseek-r1",
    name: "DeepSeek-R1",
    company: "Open Source & Independent",
    category: "Conversational & Reasoning LLMs",
    secondaryCategories: ["Coding & Autonomous Agents", "Research & Search Engines"],
    tagline: "Open-weights reasoning model matching frontier standards via pure reinforcement learning.",
    description: "DeepSeek-R1 is a groundbreaking open-weights reasoning model developed by DeepSeek. Trained with large-scale reinforcement learning (RL) without heavy supervised fine-tuning, R1 exhibits emergent human-like chain-of-thought self-correction and frontier math/coding benchmarks.",
    keyFeatures: [
      "Open weights (671B MoE with 37B active parameters) and MIT-licensed distilled models (1.5B to 70B)",
      "Emergent chain-of-thought deliberation and self-verification capabilities",
      "Competitive with proprietary reasoning models on AIME and Codeforces",
      "Extremely cost-efficient inference via Multi-Head Latent Attention (MLA)"
    ],
    bestFor: "Researchers, privacy-first enterprises, quantitative modelers, and open-source practitioners.",
    pricing: "Open Source",
    officialUrl: "https://www.deepseek.com",
    isFeatured: true,
    architectureDetails: "Mixture-of-Experts with Multi-Head Latent Attention and DeepSeekMoE architecture trained via large-scale RL.",
    companyBackground: "Developed by DeepSeek AI, a Chinese artificial intelligence research company headquartered in Hangzhou.",
    relatedToolSlugs: ["llama-3-3", "qwen-2-5-coder", "openai-o3-mini"]
  },
  {
    id: "qwen-2-5-coder",
    slug: "qwen-2-5-coder",
    name: "Qwen 2.5 Coder (32B)",
    company: "Open Source & Independent",
    category: "Coding & Autonomous Agents",
    secondaryCategories: ["Conversational & Reasoning LLMs"],
    tagline: "The world's leading open-weights coding LLM, rivaling proprietary frontier models in code synthesis.",
    description: "Qwen 2.5 Coder is Alibaba Cloud's flagship open-weights coding foundation model. Available in sizes from 0.5B to 32B, the 32B model rivals GPT-4o in software engineering benchmarks, supporting 128k context and 92 programming languages.",
    keyFeatures: [
      "32B parameter model matching proprietary frontier coding benchmarks on consumer hardware",
      "Support for 92 programming languages and 128k context window",
      "Specialized in code generation, code repair, and natural language code reasoning",
      "Permissive Apache 2.0 open-source commercial licensing"
    ],
    bestFor: "Software developers, self-hosted coding assistants, and automated code review pipelines.",
    pricing: "Open Source",
    officialUrl: "https://github.com/QwenLM/Qwen2.5-Coder",
    isFeatured: false,
    architectureDetails: "Dense Transformer trained on 5.5 trillion tokens of code, math, and synthetic reasoning datasets.",
    companyBackground: "Created by Alibaba Cloud's Qwen AI research group.",
    relatedToolSlugs: ["deepseek-r1", "llama-3-3", "claude-code"]
  },
  {
    id: "mistral-large-2",
    slug: "mistral-large-2",
    name: "Mistral Large 2",
    company: "Open Source & Independent",
    category: "Conversational & Reasoning LLMs",
    secondaryCategories: ["Coding & Autonomous Agents"],
    tagline: "European flagship foundation model delivering multi-lingual prowess, 128k context, and strict function calling.",
    description: "Mistral Large 2 (123B) is Mistral AI's flagship frontier model. Built for enterprise reasoning, advanced code synthesis, and multilingual mastery across dozens of languages with native JSON mode and precise tool execution.",
    keyFeatures: [
      "123B parameter model with high reasoning density and reduced hallucination rates",
      "Native multilingual fluency in French, German, Spanish, Italian, Chinese, and Arabic",
      "128,000-token context window with high precision",
      "Available via self-hosting license or Mistral La Plateforme API"
    ],
    bestFor: "European enterprises, multilingual organizations, and developers building sovereign AI stacks.",
    pricing: "Paid",
    officialUrl: "https://mistral.ai",
    isFeatured: false,
    architectureDetails: "Dense autoregressive Transformer engineered for low-overhead inference and deterministic function calling.",
    companyBackground: "French AI champion based in Paris, founded by Arthur Mensch, Guillaume Lample, and Timothée Lacroix.",
    relatedToolSlugs: ["llama-3-3", "deepseek-r1", "claude"]
  },
  {
    id: "langgraph",
    slug: "langgraph",
    name: "LangGraph",
    company: "Open Source & Independent",
    category: "Workflow & Automation",
    secondaryCategories: ["Coding & Autonomous Agents"],
    tagline: "Graph-based framework for orchestrating cyclic multi-agent architectures with human-in-the-loop control.",
    description: "LangGraph is an open-source library developed by LangChain for building resilient multi-agent applications. Unlike linear pipelines, LangGraph models agent workflows as stateful cyclic graphs with built-in persistence, time-travel debugging, and human approval gates.",
    keyFeatures: [
      "Cyclic graph execution enabling agent loops, self-correction, and reflection",
      "State persistence and memory snapshots for time-travel inspection and rollbacks",
      "Native human-in-the-loop review nodes before executing sensitive actions",
      "Available in both Python and TypeScript with LangGraph Cloud deployment"
    ],
    bestFor: "AI engineers and software architects building complex production agent swarms.",
    pricing: "Open Source",
    officialUrl: "https://www.langchain.com/langgraph",
    isFeatured: true,
    architectureDetails: "Stateful graph execution engine with pluggable checkpoint savers (PostgreSQL, Redis, SQLite).",
    companyBackground: "Developed by LangChain Inc. in San Francisco.",
    relatedToolSlugs: ["crewai", "vercel-ai-sdk", "google-antigravity"]
  },
  {
    id: "crewai",
    slug: "crewai",
    name: "CrewAI",
    company: "Open Source & Independent",
    category: "Workflow & Automation",
    secondaryCategories: ["Coding & Autonomous Agents"],
    tagline: "Collaborative multi-agent framework empowering autonomous AI role-playing teams to execute enterprise tasks.",
    description: "CrewAI enables developers to orchestrate autonomous AI agents that assume distinct roles, share goals, and collaborate like a real human team. Agents delegate tasks to one another, share context, and utilize tools in structured enterprise workflows.",
    keyFeatures: [
      "Role-based agent design (e.g., Researcher, Senior Writer, Technical Reviewer)",
      "Sequential, hierarchical, and consensual task delegation mechanisms",
      "Interoperable with any foundation model via LiteLLM and LangChain tool integrations",
      "CrewAI Enterprise platform for visual monitoring and orchestration"
    ],
    bestFor: "Enterprise workflow automators, content studios, and operations analysts.",
    pricing: "Freemium",
    officialUrl: "https://www.crewai.com",
    isFeatured: false,
    architectureDetails: "Python and TypeScript multi-agent orchestration runtime with memory and hierarchical managers.",
    companyBackground: "Founded by João Moura, based in San Francisco.",
    relatedToolSlugs: ["langgraph", "vercel-ai-sdk", "microsoft-copilot-studio"]
  },
  {
    id: "hugging-face",
    slug: "hugging-face",
    name: "Hugging Face",
    company: "Open Source & Independent",
    category: "Workflow & Automation",
    secondaryCategories: ["Conversational & Reasoning LLMs", "Video & Image Editing AI"],
    tagline: "The central open-source collaboration hub hosting over 1 million AI models, datasets, and ML spaces.",
    description: "Hugging Face is the definitive platform where the global open-source machine learning community collaborates on models, datasets, and interactive demos. Featuring transformers, diffusers, Spaces web hosting, and the TGI inference engine.",
    keyFeatures: [
      "Repository of 1,000,000+ open-weights models and 200,000+ open datasets",
      "Hugging Face Spaces for hosting interactive Gradio, Streamlit, and Docker demos",
      "Inference Endpoints for one-click production model deployment on AWS and GCP",
      "Open LLM Leaderboard evaluating global open foundation models objectively"
    ],
    bestFor: "Machine learning engineers, researchers, data scientists, and open-source contributors.",
    pricing: "Freemium",
    officialUrl: "https://huggingface.co",
    isFeatured: false,
    architectureDetails: "Git-LFS distributed model repository coupled with containerized inference runtimes and hardware acceleration.",
    companyBackground: "New York and Paris based AI company founded by Clément Delangue, Julien Chaumond, and Thomas Wolf.",
    relatedToolSlugs: ["llama-3-3", "deepseek-r1", "qwen-2-5-coder"]
  },
  {
    id: "whisper",
    slug: "whisper",
    name: "Whisper by OpenAI",
    company: "Open Source & Independent",
    category: "Audio, Voice & Music AI",
    secondaryCategories: ["Workflow & Automation"],
    tagline: "Robust open-source speech recognition and multilingual transcription foundation model.",
    description: "Whisper is OpenAI's open-weights automatic speech recognition (ASR) system. Trained on 680,000 hours of multilingual and multitask supervised data, Whisper achieves human-level speech recognition, accents robustness, and translation into English.",
    keyFeatures: [
      "Exceptional robustness to background noise, accents, and technical jargon",
      "Multilingual speech recognition spanning 98 languages and direct translation to English",
      "Open weights (tiny to large-v3) runnable locally with whisper.cpp and faster-whisper",
      "Timestamp-level word alignments for subtitle generation"
    ],
    bestFor: "Podcast transcribers, video captioning tools, medical dictation, and voice assistants.",
    pricing: "Open Source",
    officialUrl: "https://github.com/openai/whisper",
    isFeatured: false,
    architectureDetails: "Encoder-decoder Transformer trained on diverse audio spectrogram representations.",
    companyBackground: "Open source release from OpenAI's audio research division.",
    relatedToolSlugs: ["descript", "elevenlabs"]
  }
];

export const FEATURED_AI_TOOLS = AI_DIRECTORY_DATA.filter((tool) => tool.isFeatured);
