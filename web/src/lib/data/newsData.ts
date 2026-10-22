import { NewsArticle } from "../types";

export const SEED_NEWS_ARTICLES: NewsArticle[] = [
  {
    id: 1,
    title: "Blackstone AI Infrastructure Fund Commits $25B to Next-Gen GPU Hyperscalers",
    summary: "Senior executives push back on AI capex bubble fears, citing unprecedented multi-year enterprise demand for gigawatt-scale data center facilities and high-density liquid cooling clusters.",
    url: "https://techcrunch.com/category/artificial-intelligence/",
    category: "Hardware",
    source_name: "TechCrunch",
    related_tools: "NVIDIA Blackwell, Google TPU",
    is_pinned: true,
    published_at: "2 hours ago"
  },
  {
    id: 2,
    title: "Recursive Releases Flint: A 14B Local Coding Model Optimized for On-Device Agentic Loops",
    summary: "The lightweight weights run in under 8GB VRAM on consumer laptops, leveraging synthetic execution traces to achieve competitive SWE-bench performance against 70B parameter models.",
    url: "https://venturebeat.com/category/ai/",
    category: "Code Builders",
    source_name: "VentureBeat AI",
    related_tools: "Cursor, Windsurf, Qwen 2.5 Coder",
    is_pinned: true,
    published_at: "3 hours ago"
  },
  {
    id: 3,
    title: "Anthropic Introduces Granular Extended Thinking Controls to Claude 3.7 Sonnet API",
    summary: "Developers can now budget exact reasoning token caps between 1,024 and 64,000 tokens, enabling deterministic latency trade-offs for production agent pipelines and automated code refactoring.",
    url: "https://arstechnica.com/technology-lab/",
    category: "LLMs",
    source_name: "Ars Technica",
    related_tools: "Claude 3.7 Sonnet, DeepSeek-R1",
    is_pinned: false,
    published_at: "4 hours ago"
  },
  {
    id: 4,
    title: "Boston Dynamics & Toyota Research Institute Announce Breakthrough Humanoid Manipulation Policy",
    summary: "Atlas humanoids demonstrate sub-millimeter precision in dynamic assembly line parts sorting, powered by vision-language-action foundation models trained on 10,000 hours of teleoperation data.",
    url: "https://theverge.com/tech/",
    category: "Robotics",
    source_name: "The Verge",
    related_tools: "Google Gemini Vision, Figure 02",
    is_pinned: false,
    published_at: "5 hours ago"
  },
  {
    id: 5,
    title: "Physical Intelligence Raises $400M Series A to Build Universal Robot Foundation Models",
    summary: "Backed by prominent silicon valley investors, the robotics startup focuses on developing 'π0' (pi-zero), a general-purpose model enabling disparate robotic morphologies to perform zero-shot household chores.",
    url: "https://technologyreview.com/",
    category: "Startups",
    source_name: "MIT Tech Review",
    related_tools: "CrewAI, Devin",
    is_pinned: false,
    published_at: "6 hours ago"
  },
  {
    id: 6,
    title: "DeepSeek-R1 Open Architecture Sparks Renaissance in Local Verifiable Reasoning Engines",
    summary: "Researchers across open source communities successfully distill DeepSeek-R1 reasoning traces into 1.5B and 7B edge models, matching proprietary model performance on competition mathematics benchmarks.",
    url: "https://venturebeat.com/category/ai/",
    category: "LLMs",
    source_name: "VentureBeat AI",
    related_tools: "DeepSeek-V3, Qwen 2.5",
    is_pinned: false,
    published_at: "7 hours ago"
  },
  {
    id: 7,
    title: "TSMC Accelerates 2nm High-NA EUV Mass Production for 2026 AI Accelerators",
    summary: "Fab tooling installations begin ahead of schedule in Hsinchu, targeting 15% performance efficiency leaps and 30% power reductions for next-generation AI accelerators and hyperscale silicon.",
    url: "https://arstechnica.com/technology-lab/",
    category: "Hardware",
    source_name: "Ars Technica",
    related_tools: "NVIDIA Blackwell, Apple M4",
    is_pinned: false,
    published_at: "8 hours ago"
  },
  {
    id: 8,
    title: "Windsurf Unveils Real-time Cascade Multi-File Collaboration Architecture",
    summary: "The agentic IDE introduces predictive shadow execution trees that analyze terminal errors and file ASTs concurrently, allowing developers to approve speculative refactors in single-click reviews.",
    url: "https://techcrunch.com/category/artificial-intelligence/",
    category: "Code Builders",
    source_name: "TechCrunch",
    related_tools: "Windsurf, Cursor, Antigravity",
    is_pinned: false,
    published_at: "9 hours ago"
  },
  {
    id: 9,
    title: "Figure AI Deploys Figure 02 Fleet to Commercial BMW Manufacturing Facilities",
    summary: "Commercial pilot validates continuous 10-hour autonomous shifts inserting sheet metal chassis components with 99.4% reliability, demonstrating viability of bipedal workforce integration.",
    url: "https://theverge.com/tech/",
    category: "Robotics",
    source_name: "The Verge",
    related_tools: "Figure 02, Boston Dynamics",
    is_pinned: false,
    published_at: "10 hours ago"
  },
  {
    id: 10,
    title: "OpenAI Closes Landmark Multi-Billion Strategic Enterprise Ingestion Partnerships",
    summary: "New licensing consortium grants high-throughput real-time streaming rights to major news archives and industrial technical manuals for continuous frontier model pretraining.",
    url: "https://techcrunch.com/category/artificial-intelligence/",
    category: "Startups",
    source_name: "TechCrunch",
    related_tools: "ChatGPT Plus, Sora, Codex",
    is_pinned: false,
    published_at: "11 hours ago"
  },
  {
    id: 11,
    title: "Google DeepMind Demonstrates Linear 2M-Token Multi-Modal Needle-in-a-Haystack Recall",
    summary: "Gemini 2.0 architecture demonstrates 99.8% accurate cross-modal retrieval across 3 hours of unbroken video footage and 800,000 lines of complex C++ monorepo source code.",
    url: "https://technologyreview.com/",
    category: "LLMs",
    source_name: "MIT Tech Review",
    related_tools: "Google Gemini 2.0, Antigravity",
    is_pinned: false,
    published_at: "12 hours ago"
  },
  {
    id: 12,
    title: "Alibaba Cloud Open-Sources Qwen 2.5-Coder-32B: Parity with Closed Proprietary Models",
    summary: "Trained on 5.5 trillion specialized tokens, the model sets new state-of-the-art records on MultiPL-E polyglot benchmarks while running comfortably on single 24GB GPUs via 4-bit quantization.",
    url: "https://arstechnica.com/technology-lab/",
    category: "Code Builders",
    source_name: "Ars Technica",
    related_tools: "Qwen 2.5 Coder, Ollama",
    is_pinned: false,
    published_at: "14 hours ago"
  }
];
