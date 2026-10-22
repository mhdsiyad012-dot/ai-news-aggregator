"""Seed script populating the AI Directory with 22+ premier AI models, agents, and code builders into Supabase / local DB.

Usage:
    python pipeline/seed_directory.py
"""

import json
import os
import sys
from pathlib import Path

# Add current pipeline dir to path so imports work
sys.path.insert(0, str(Path(__file__).resolve().parent))

from sqlalchemy import select
from database import AIDirectoryItem, SessionLocal, engine, init_db

DIRECTORY_ITEMS = [
    {
        "slug": "google-gemini",
        "name": "Google Gemini 2.0 / 1.5 Pro",
        "creator": "Google DeepMind",
        "short_purpose": "Next-generation multimodal foundation model with native 2-million-token context window and sub-second real-time streaming audio/video.",
        "primary_category": "Foundation LLMs",
        "tags": ["Multimodal", "2M Context", "Deep Thinking", "Enterprise API", "Vision & Audio"],
        "detailed_overview": "Google Gemini represents DeepMind's flagship native multimodal architecture designed from the ground up to process text, code, audio, image, and video across unprecedented context lengths. Gemini 1.5 Pro and 2.0 Flash introduce native linear-scaling context windows up to 2M tokens, sub-second multimodal live streaming API latency, and integrated deep thinking/reasoning modes capable of processing entire repos, multi-hour videos, and extensive document libraries in a single prompt.",
        "key_capabilities": [
            "2,000,000 token context window handling massive codebases and hour-long media without indexing loss",
            "Native multimodal ingestion of interleaved video, spatial imagery, audio, and code",
            "Built-in Google Search grounding and function-calling verification",
            "Deep Thinking mode for complex algorithmic problem-solving and mathematical proofs",
            "Flash variant optimized for high-throughput, sub-300ms agentic feedback loops"
        ],
        "best_use_cases": [
            "Auditing enterprise monorepos and refactoring multi-million-line legacy systems",
            "Real-time voice-and-vision interactive agents in robotics and browser automation",
            "Deep financial and legal document synthesis spanning years of reports",
            "Complex data analysis combining tabular data, charts, and technical whitepapers"
        ],
        "pricing_model": "Generous Free Tier; $1.25 - $2.50 / 1M input tokens, $5.00 - $10.00 / 1M output tokens",
        "official_url": "https://ai.google.dev",
        "release_status": "Generally Available",
        "is_featured": True
    },
    {
        "slug": "antigravity",
        "name": "Antigravity",
        "creator": "Google DeepMind",
        "short_purpose": "Next-generation agentic AI software development platform and pair programming environment with native browser subagents and terminal autonomy.",
        "primary_category": "Antigravity & IDEs",
        "tags": ["Agentic IDE", "Browser Subagents", "Autonomous Coding", "DeepMind", "Full Workspace Awareness"],
        "detailed_overview": "Antigravity is Google DeepMind's flagship advanced agentic coding environment built specifically for full-stack autonomous software engineering. Operating through high-agency multi-turn cognitive loops, Antigravity combines deep workspace AST awareness, autonomous shell execution, interactive browser subagents with DOM video capture, knowledge item retrieval, and scheduled background workers to execute end-to-end migrations, frontend overhauls, and bug triage without human micromanagement.",
        "key_capabilities": [
            "Autonomous browser subagents capable of driving real browser sessions, verifying UI renders, and recording WebP demos",
            "Full workspace indexation, multi-chunk precise surgical file replacement, and terminal process orchestration",
            "Knowledge Item (KI) memory architecture storing repository-specific invariants and design patterns",
            "Multi-modal visual UI generation and interactive clarification modal flows",
            "Background task daemon management with reactive wakeup and cron scheduling"
        ],
        "best_use_cases": [
            "Autonomous end-to-end legacy frontend migrations (e.g. Streamlit to Next.js App Router)",
            "Complex full-stack debugging and verification using visual browser subagent recording",
            "Automated CI/CD pipeline modernization and multi-service cloud deployments",
            "Pair-programming enterprise architectures with strict aesthetic and performance standards"
        ],
        "pricing_model": "Google Internal / Early Access Developer Preview",
        "official_url": "https://deepmind.google/technologies/gemini/",
        "release_status": "Active Preview",
        "is_featured": True
    },
    {
        "slug": "openai-codex",
        "name": "OpenAI Codex",
        "creator": "OpenAI",
        "short_purpose": "Specialized code generation and natural-language-to-executable-program engine underpinning early AI pair-programming revolutions.",
        "primary_category": "Code Builders",
        "tags": ["Code Generation", "Python", "API", "Syntax AST", "Foundational"],
        "detailed_overview": "OpenAI Codex is the seminal descendant of GPT-3 fine-tuned on billions of lines of public GitHub source code across dozens of programming languages. Codex demonstrated unprecedented zero-shot proficiency in translating human intentions into idiomatic code, synthesizing unit test suites, converting between programming languages, and powering the foundational initial engine of GitHub Copilot before succeeding generations moved to GPT-4o and o-series reasoning models.",
        "key_capabilities": [
            "High-accuracy syntax generation across Python, JavaScript, TypeScript, Go, Ruby, and Bash",
            "Docstring-to-implementation code synthesis with type annotation adherence",
            "Algorithmic competitive programming problem resolution",
            "Automated translation of legacy code across frameworks and runtimes"
        ],
        "best_use_cases": [
            "In-editor code completion and function body synthesis from descriptive docstrings",
            "Automated unit test generation for coverage improvements",
            "SQL query synthesis from plain business requirement statements",
            "Rapid boilerplate scaffolding in web and CLI tooling"
        ],
        "pricing_model": "Integrated in OpenAI API platform ($2.50 - $10.00 / 1M tokens)",
        "official_url": "https://openai.com/index/openai-codex/",
        "release_status": "Generally Available",
        "is_featured": False
    },
    {
        "slug": "claude",
        "name": "Claude 3.7 Sonnet & Opus",
        "creator": "Anthropic",
        "short_purpose": "Leading frontier model featuring hybrid instantaneous response and adjustable extended thinking with premier coding benchmark scores.",
        "primary_category": "Foundation LLMs",
        "tags": ["Hybrid Reasoning", "Extended Thinking", "200K Context", "SWE-bench Leader", "Computer Use"],
        "detailed_overview": "Claude 3.7 Sonnet is Anthropic's state-of-the-art hybrid model that unites standard instantaneous generation with fine-grained extended thinking controls. Renowned for surgical refactoring precision, adherence to intricate system prompts, and minimal hallucination, Claude powers production agent workflows worldwide. Claude 3.5/3.7 also pioneered direct 'Computer Use' API capabilities allowing agents to move mouse cursors, click, type, and navigate desktop applications.",
        "key_capabilities": [
            "Controllable extended thinking budget allowing dynamic allocation of reasoning tokens",
            "World-leading SWE-bench verified performance on real-world software engineering issues",
            "Native Computer Use API enabling direct mouse and keyboard desktop interaction",
            "200K high-fidelity context window with near-perfect multi-needle recall",
            "Artifacts system providing live visual previews of SVG, React, HTML, and diagrams"
        ],
        "best_use_cases": [
            "Complex architectural refactoring across multi-thousand-line single files and modules",
            "Autonomous bug fixing against real GitHub issues and pull requests",
            "Precision legal, compliance, and regulatory document dissection",
            "Design system translation from Figma screenshots directly to clean React/Tailwind code"
        ],
        "pricing_model": "$3.00 / 1M input tokens, $15.00 / 1M output tokens (Thinking tokens billed as output)",
        "official_url": "https://www.anthropic.com/claude",
        "release_status": "Generally Available",
        "is_featured": True
    },
    {
        "slug": "cursor",
        "name": "Cursor",
        "creator": "Anysphere",
        "short_purpose": "AI-native VS Code fork featuring multi-file Composer edits, speculative shadow workspaces, and codebase indexing.",
        "primary_category": "Antigravity & IDEs",
        "tags": ["AI IDE", "Composer", "Shadow Workspace", "VS Code Fork", "Multi-File Editing"],
        "detailed_overview": "Cursor is a purpose-built AI code editor forked from VS Code that re-architected developer UX around generative agents. With features like Composer (Ctrl+I), full-codebase vector and BM25 indexing, Cursor Tab for multi-token speculative autocompletions, and terminal command execution, Cursor allows engineers to coordinate sweeping multi-file changes and test executions in real time with continuous diff review.",
        "key_capabilities": [
            "Composer multi-file generation with interactive inline unified diff inspection",
            "Cursor Tab smart autocomplete anticipating multi-line cursor hops and edits",
            "Local and remote semantic codebase indexing with @Codebase and @Docs referencing",
            "Terminal error auto-repair with single-click diagnostic synthesis",
            "Flexible model routing supporting Claude 3.7 Sonnet, GPT-4o, and DeepSeek-R1"
        ],
        "best_use_cases": [
            "Rapid full-stack feature implementation spanning frontend components, API routes, and DB schemas",
            "Interactive refactoring of large TypeScript and Python packages",
            "Navigating and onboarding onto complex unfamiliar codebases using natural language queries",
            "Iterative terminal debugging and test suite remediation"
        ],
        "pricing_model": "Free 14-day trial; $20/month Pro tier; $40/seat/month Business",
        "official_url": "https://www.cursor.com",
        "release_status": "Generally Available",
        "is_featured": True
    },
    {
        "slug": "crewai",
        "name": "CrewAI",
        "creator": "CrewAI Inc.",
        "short_purpose": "Leading open-source framework for orchestrating role-playing autonomous AI agent crews with structured task delegation.",
        "primary_category": "Frameworks",
        "tags": ["Multi-Agent", "Orchestration", "Open Source", "Role Playing", "Task Delegation"],
        "detailed_overview": "CrewAI is the premier open-source multi-agent orchestration framework enabling software engineers to assemble collaborative squads of specialized autonomous AI agents. By assigning distinct personas, tools, goals, and backstories to agents (e.g. Researcher, Senior Writer, Code Reviewer), CrewAI choreographs complex sequential, hierarchical, and consensual problem-solving pipelines with native memory persistence and human-in-the-loop oversight.",
        "key_capabilities": [
            "Role-based agent design with customized system prompts, specialized tools, and reasoning memory",
            "Hierarchical process management with managerial agents dynamically delegating tasks",
            "Integration with LangChain tools, custom Python functions, and enterprise APIs",
            "Built-in short-term, long-term, and entity memory systems powered by vector stores",
            "CrewAI Enterprise cloud platform providing visual agent trace analytics and deployments"
        ],
        "best_use_cases": [
            "End-to-end automated market analysis and competitive intelligence report synthesis",
            "Multi-stage automated code auditing, unit testing, and documentation generation",
            "Autonomous customer outreach, research, and personalized onboarding workflows",
            "Complex financial compliance reviews cross-referencing multi-source datasets"
        ],
        "pricing_model": "Open Source (Apache 2.0); Enterprise Cloud pricing available",
        "official_url": "https://www.crewai.com",
        "release_status": "Generally Available",
        "is_featured": True
    },
    {
        "slug": "windsurf",
        "name": "Windsurf",
        "creator": "Codeium",
        "short_purpose": "Agentic IDE powered by Flow paradigm, deep multi-file contextual cascading, and collaborative human-in-the-loop agents.",
        "primary_category": "Antigravity & IDEs",
        "tags": ["Flow AI", "Cascades", "Agentic IDE", "Codeium", "Live Context"],
        "detailed_overview": "Windsurf is Codeium's premier agentic IDE designed to maintain unbroken developer flow state. Anchored by 'Cascades'—an agentic interface that seamlessly switches between answering deep architectural questions, proposing multi-step refactoring plans, executing terminal commands, and applying code modifications—Windsurf monitors developer cursor movements, opened tabs, and recent edits to predict developer intent before instructions are even typed.",
        "key_capabilities": [
            "Cascade Agent orchestrating multi-step plans, terminal commands, and multi-file updates",
            "Real-time Supercomplete anticipating intent across files without blocking the editor UI",
            "Rich contextual awareness tracking active terminal output, errors, and git diffs",
            "Enterprise compliance with self-hosted and zero-data-retention security guarantees",
            "Instant conversion and settings import from existing VS Code configurations"
        ],
        "best_use_cases": [
            "Zero-friction development where the AI writes terminal commands and tests alongside you",
            "Iterative UI styling and component building with real-time feedback loops",
            "Enterprise teams requiring rigorous SOC2 and on-premise governance",
            "Refactoring complex asynchronous workflows and database models"
        ],
        "pricing_model": "Free Community tier; $15/month Pro tier; Custom Enterprise pricing",
        "official_url": "https://codeium.com/windsurf",
        "release_status": "Generally Available",
        "is_featured": False
    },
    {
        "slug": "deepseek",
        "name": "DeepSeek-V3 & R1",
        "creator": "DeepSeek AI",
        "short_purpose": "Ultra-efficient open-weights mixture-of-experts model and reasoning engine trained with large-scale reinforcement learning.",
        "primary_category": "Foundation LLMs",
        "tags": ["Open Weights", "MoE Architecture", "Reasoning R1", "Low Cost", "Multi-Head Latent Attention"],
        "detailed_overview": "DeepSeek shocked the AI ecosystem by releasing DeepSeek-V3 (671B parameter Mixture-of-Experts with 37B active parameters per token) and DeepSeek-R1 (pure reinforcement-learning-driven reasoning model). Utilizing Multi-Head Latent Attention (MLA) and DeepSeekMoE architectures, DeepSeek delivers benchmark parity with frontier proprietary models at roughly one-tenth the training and inference compute costs, accompanied by open weights under permissive licenses.",
        "key_capabilities": [
            "DeepSeek-R1 verifiable step-by-step reasoning with visible chain-of-thought traces",
            "DeepSeek-V3 high-throughput code and prose synthesis across 128K context",
            "Multi-Head Latent Attention significantly compressing KV cache memory consumption",
            "Full FP8 mixed-precision training and native distributed pipeline inference",
            "Distilled smaller models (1.5B to 70B) capable of running locally on consumer hardware"
        ],
        "best_use_cases": [
            "Low-cost high-volume batch analysis and summarization pipelines",
            "Self-hosted enterprise AI deployments needing complete data sovereignty",
            "Complex mathematical reasoning, algorithm derivation, and logic verification",
            "Local offline code generation via distilled Qwen/Llama backbones"
        ],
        "pricing_model": "Open Weights (MIT License); API: $0.14 / 1M input tokens, $0.28 - $2.19 / 1M output tokens",
        "official_url": "https://www.deepseek.com",
        "release_status": "Generally Available",
        "is_featured": True
    },
    {
        "slug": "qwen",
        "name": "Qwen 2.5 & Qwen 2.5 Coder",
        "creator": "Alibaba Cloud",
        "short_purpose": "Top-tier open-source foundation model family specialized in polyglot code generation, mathematical reasoning, and 128K context.",
        "primary_category": "Foundation LLMs",
        "tags": ["Open Source", "Coding Specialist", "Multilingual", "128K Context", "Local Inference"],
        "detailed_overview": "Qwen 2.5 and its specialized sibling Qwen 2.5-Coder are high-performance open-source models developed by Alibaba Cloud. Available in sizes from 0.5B to 72B parameters, Qwen 2.5-Coder rivals top closed proprietary models on HumanEval, MultiPL-E, and live code completion benchmarks. Its strong support for 29+ natural languages and deep comprehension of esoteric programming languages have made it the premier backend for local AI coding tools like Continue.dev, Ollama, and vLLM.",
        "key_capabilities": [
            "128,000 token context window with up to 8K generated tokens per inference",
            "Trained on over 5.5 trillion tokens of code, synthetic execution traces, and math",
            "Unrivaled polyglot language coverage across natural languages and niche DSLs",
            "Optimized for low-latency quantized deployment (GGUF, AWQ, EXL2)",
            "Native tool use and structured JSON output schema conformance"
        ],
        "best_use_cases": [
            "Private corporate code assistance running on local NVIDIA RTX workstations or private clusters",
            "Polyglot translation of niche software (COBOL, Fortran, Ada to Rust and Go)",
            "Automated test harness generation and edge-case synthetic data creation",
            "Embedded edge AI code generation on Apple Silicon MacBooks via Ollama"
        ],
        "pricing_model": "Open Source (Apache 2.0 / Qwen License); Alibaba Cloud API pay-per-token",
        "official_url": "https://github.com/QwenLM/Qwen2.5",
        "release_status": "Generally Available",
        "is_featured": False
    },
    {
        "slug": "llama",
        "name": "Llama 3.1 & 3.3",
        "creator": "Meta AI",
        "short_purpose": "Industry standard open-access foundation models (8B, 70B, 405B) powering the modern open source AI ecosystem.",
        "primary_category": "Foundation LLMs",
        "tags": ["Open Access", "Meta AI", "128K Context", "Fine-Tuning Base", "Industry Benchmark"],
        "detailed_overview": "Meta's Llama family represents the backbone of open AI innovation. Llama 3.1 and 3.3 (offered in 8B, 70B, and the colossal 405B flagship) provide 128K context windows, enhanced multi-lingual capabilities, and exceptional general reasoning. Trained on over 15 trillion tokens with cutting-edge DPO and RLHF alignments, Llama serves as the foundational substrate upon which thousands of enterprise fine-tunes, agent frameworks, and quantized on-device models are constructed.",
        "key_capabilities": [
            "405B flagship model offering rival capabilities to leading closed models with full weight access",
            "128K token context window with robust long-context retrieval performance",
            "Native tool-calling, custom Python code interpreter execution, and Brave Search integrations",
            "Permissive community license allowing commercial enterprise fine-tuning and hosting",
            "Llama Stack reference implementation standardizing agentic toolchains and memory"
        ],
        "best_use_cases": [
            "Enterprise proprietary model fine-tuning with full ownership of intellectual property",
            "Synthetic data generation for training smaller task-specific specialized models",
            "Sovereign government and defense AI systems operating behind strict air-gaps",
            "Standard benchmark baseline for evaluating new generative algorithms"
        ],
        "pricing_model": "Free Community License (Up to 700M monthly active users); Cloud hosting via AWS/Together/Groq",
        "official_url": "https://llama.meta.com",
        "release_status": "Generally Available",
        "is_featured": False
    },
    {
        "slug": "kling-ai",
        "name": "Kling AI 1.5",
        "creator": "Kuaishou",
        "short_purpose": "Breakthrough generative video platform capable of producing hyper-realistic 1080p clips with high physical realism and camera control.",
        "primary_category": "Media Gen",
        "tags": ["Video Generation", "1080p", "Physics Simulation", "Motion Brush", "Text-to-Video"],
        "detailed_overview": "Kling AI is an advanced diffusion transformer video generation platform developed by Kuaishou. Capable of generating cinematic 1080p video clips up to 2 minutes long at 30fps, Kling excels at modeling physical dynamics (gravity, fluid flow, cloth collision, realistic human motion) that have historically challenged generative models. Its toolset includes precision camera path directors, motion brushes for selective localized animation, and image-to-video character consistency.",
        "key_capabilities": [
            "High-definition 1080p video generation with cinematic lens flare and lighting physics",
            "Duration extension up to 2 minutes with continuous narrative coherence",
            "Motion Brush allowing granular brush-painted vectors of dynamic movement across static images",
            "Camera Control simulation (Pan, Tilt, Zoom, Roll, Dolly) matching virtual cinematography rigs",
            "Lip-sync and facial micro-expression audio synchronization"
        ],
        "best_use_cases": [
            "Commercial advertising and product commercial B-roll video production",
            "Rapid cinematic storyboarding and mood reels for film directors and art studios",
            "Social media content generation with high-fidelity realistic visual effects",
            "Architectural visualization showing dynamic human transit and ambient environmental motion"
        ],
        "pricing_model": "Credit-based subscription; Free tier available; Paid plans start at $10/month",
        "official_url": "https://klingai.com",
        "release_status": "Generally Available",
        "is_featured": False
    },
    {
        "slug": "sora",
        "name": "Sora",
        "creator": "OpenAI",
        "short_purpose": "Text-to-video diffusion transformer simulating the physical world with high temporal coherence and multi-shot cinematic fidelity.",
        "primary_category": "Media Gen",
        "tags": ["World Simulator", "Video Diffusion", "OpenAI", "Cinematic", "Temporal Coherence"],
        "detailed_overview": "Sora is OpenAI's diffusion transformer video generation model that conceptualizes video generation as physical world simulation. Operating on spacetime latent patches, Sora generates high-resolution video scenes featuring complex camera movements, multiple interacting characters, and accurate physical persistence across continuous camera angles. Sora powers both the Sora web creation suite and direct creative studio API integrations.",
        "key_capabilities": [
            "Generation of full-resolution widescreen (1080p) or vertical format video up to 60 seconds",
            "Spacetime latent patches maintaining visual persistence of objects even when temporarily obscured",
            "Multi-shot sequences seamlessly stitched with matching set design, lighting, and wardrobe",
            "Video-to-video editing and looping background generation",
            "C2PA metadata watermarking and automated content safety verification"
        ],
        "best_use_cases": [
            "Cinematic film pre-visualization and dynamic virtual location scouting",
            "High-concept promotional campaign videos and brand storytelling",
            "Educational and scientific simulation visualizers",
            "Creative music video background generation and surrealist digital art"
        ],
        "pricing_model": "Included in ChatGPT Plus ($20/mo) & Pro ($200/mo) plans",
        "official_url": "https://openai.com/sora",
        "release_status": "Active Preview",
        "is_featured": False
    },
    {
        "slug": "perplexity",
        "name": "Perplexity AI & Sonar",
        "creator": "Perplexity AI",
        "short_purpose": "Conversational answer engine combining multi-source web retrieval with citation-backed synthetic research reports.",
        "primary_category": "Autonomous Agents",
        "tags": ["Search Engine", "Live Citations", "Deep Research", "Sonar API", "Fact Verification"],
        "detailed_overview": "Perplexity AI is an AI-native search and discovery engine designed to replace traditional link-based search with direct, synthesized answers backed by clickable real-time citations. Features like Pro Search, Deep Research, and Spaces allow users to execute recursive web exploration queries, cross-examine multiple sources, generate structured academic tables, and monitor live topics. Perplexity also exposes its fine-tuned 'Sonar' models via an API for real-time grounded search applications.",
        "key_capabilities": [
            "Live web search synthesis with instant inline numbered citations and publisher links",
            "Deep Research mode conducting multi-stage recursive querying across dozens of sources",
            "Pro Search interactive clarifying questions to narrow down ambiguous queries",
            "File upload and analysis combining web data with user-provided PDFs and CSVs",
            "Perplexity Sonar API providing developers with live-grounded generative search endpoints"
        ],
        "best_use_cases": [
            "Technical, competitive, and market intelligence research with verifiable citations",
            "Real-time news tracking and fact-checking of emerging global events",
            "Academic literature reviews and synthesis of whitepapers and statistical databases",
            "Building AI applications that require current, non-hallucinated web-grounded knowledge"
        ],
        "pricing_model": "Free search; $20/month Pro tier; API: Pay-per-search + token pricing",
        "official_url": "https://www.perplexity.ai",
        "release_status": "Generally Available",
        "is_featured": False
    },
    {
        "slug": "vercel-v0",
        "name": "Vercel v0",
        "creator": "Vercel",
        "short_purpose": "Generative UI design tool turning natural language prompts into production-ready React, Next.js, and Tailwind CSS code.",
        "primary_category": "Code Builders",
        "tags": ["Generative UI", "React", "Next.js", "Tailwind CSS", "shadcn/ui", "Frontend"],
        "detailed_overview": "v0 by Vercel is a generative user interface development environment that creates accessible, modern React and Tailwind CSS components from plain text descriptions, wireframes, and uploaded screenshots. Built on top of the shadcn/ui component ecosystem and Lucide icons, v0 allows frontend engineers and product designers to iterate through variations, edit specific DOM nodes visually, and directly copy or CLI-import the code into existing Next.js repositories.",
        "key_capabilities": [
            "Instant generation of responsive React components styled with modern Tailwind CSS classes",
            "Direct integration with shadcn/ui design tokens and Lucide React iconography",
            "One-click CLI import into Next.js projects via `npx v0 add`",
            "Interactive in-browser canvas with live stateful React rendering and viewport switching",
            "Vision prompt input allowing screenshot-to-code replication and redesign"
        ],
        "best_use_cases": [
            "Rapid prototyping of modern dashboards, landing pages, and interactive UI forms",
            "Translating static Figma mockups or whiteboard sketches into functional Next.js components",
            "Generating accessible, keyboard-navigable UI patterns without manual CSS boilerplate",
            "Design system exploration and customer onboarding flow iterations"
        ],
        "pricing_model": "Free tier with monthly credits; $20/month Premium tier for team collaboration",
        "official_url": "https://v0.dev",
        "release_status": "Generally Available",
        "is_featured": False
    },
    {
        "slug": "github-copilot",
        "name": "GitHub Copilot & Copilot Workspace",
        "creator": "GitHub / Microsoft",
        "short_purpose": "Ubiquitous AI pair programmer integrated across major IDEs, CLI, and PR workflows with multi-file Workspace planning.",
        "primary_category": "Code Builders",
        "tags": ["Pair Programmer", "GitHub", "Copilot Workspace", "PR Reviews", "IDE Extension"],
        "detailed_overview": "GitHub Copilot is the pioneer of developer AI pair-programming, now supporting millions of engineers inside VS Code, Visual Studio, JetBrains, and Neovim. Expanding far beyond inline ghost-text completions, Copilot now incorporates Copilot Chat, CLI terminal assistance, automated pull request summarization, and Copilot Workspace—a task-centric environment where agents brainstorm, specify, plan, and implement full issues from specification to git commit.",
        "key_capabilities": [
            "Inline ghost text autocompletion matching local project coding conventions and idioms",
            "Copilot Workspace turning GitHub issues into full multi-step implementation roadmaps and PRs",
            "Multi-model flexibility allowing switching between Claude 3.5 Sonnet, GPT-4o, and Gemini",
            "Automated Pull Request descriptions and vulnerability scanning in GitHub Advanced Security",
            "Copilot CLI explaining complex bash pipelines and flags directly inside terminal sessions"
        ],
        "best_use_cases": [
            "Daily engineering productivity acceleration across standard boilerplate and test creation",
            "Automating GitHub issue triage and drafting initial PR branches",
            "Explaining unfamiliar legacy codebase algorithms to junior developers",
            "Reviewing incoming pull requests for security vulnerabilities and missing test cases"
        ],
        "pricing_model": "$10/month Individual plan; $19/user/month Business; $39/user/month Enterprise",
        "official_url": "https://github.com/features/copilot",
        "release_status": "Generally Available",
        "is_featured": False
    },
    {
        "slug": "devin",
        "name": "Devin",
        "creator": "Cognition AI",
        "short_purpose": "The world's first autonomous AI software engineer capable of building, testing, and deploying entire software projects independently.",
        "primary_category": "Autonomous Agents",
        "tags": ["Autonomous Engineer", "Sandboxed Shell", "Browser", "SWE-bench", "End-to-End"],
        "detailed_overview": "Devin is Cognition's autonomous AI software engineer. Equipped with its own sandboxed shell, code editor, and live web browser inside an isolated virtual machine, Devin can plan and execute complex software engineering tasks from start to finish. When given a task, Devin searches documentation, writes code, creates test harnesses, fixes compilation errors, and deploys applications while keeping human developers updated with live progress reports.",
        "key_capabilities": [
            "Fully sandboxed container with bash terminal, browser, and code editor under agent control",
            "Autonomous multi-step long-horizon planning and execution lasting hours without human input",
            "Real-time self-debugging: runs tests, inspects tracebacks, and iterates until code passes",
            "Web research: browses API docs, reads GitHub releases, and learns new libraries on the fly",
            "Interactive collaboration mode letting engineers intervene or direct Devin via Slack and web"
        ],
        "best_use_cases": [
            "Autonomous end-to-end bug resolution for issues in GitHub repositories",
            "Migrating legacy codebases (e.g. upgrading Python 2 to 3, or React class components to hooks)",
            "Automating routine dependency updates and resolving broken build configurations",
            "Building proof-of-concept web applications and APIs from product specification documents"
        ],
        "pricing_model": "Enterprise team pricing (Starts at ~$500/month or enterprise contracts)",
        "official_url": "https://cognition.ai",
        "release_status": "Generally Available",
        "is_featured": True
    },
    {
        "slug": "mistral-large",
        "name": "Mistral Large 2 & Le Chat",
        "creator": "Mistral AI",
        "short_purpose": "Frontier European AI model with 128K context, multilingual European language supremacy, and premier reasoning capabilities.",
        "primary_category": "Foundation LLMs",
        "tags": ["European AI", "128K Context", "Multilingual", "Code Synthesis", "Le Chat"],
        "detailed_overview": "Mistral Large 2 is Mistral AI's flagship foundation model, engineered with a strong emphasis on reasoning, mathematics, multilingual fluency (French, German, Spanish, Italian, Chinese, Japanese, Arabic), and code generation. Rivaling leading closed frontier models, Mistral Large provides 128K context, high instruction adherence, native JSON output, and fine-grained agentic function calling, exposed through the enterprise La Plateforme API and consumer Le Chat interface.",
        "key_capabilities": [
            "128,000 token context window with high needle-in-a-haystack accuracy",
            "Superior native proficiency across dozens of natural languages and coding frameworks",
            "Precise agentic tool-calling with enforced JSON schema validation",
            "Privacy-first hosting available on European cloud infrastructure and Azure AI Studio",
            "Le Chat web interface providing integrated web search, document processing, and image gen"
        ],
        "best_use_cases": [
            "GDPR-compliant European enterprise deployments requiring sovereign data hosting",
            "Cross-border multilingual customer support and technical documentation localization",
            "High-complexity mathematical modeling and algorithmic code generation",
            "Contract comparison and regulatory compliance checks across European jurisdictions"
        ],
        "pricing_model": "API: $2.00 / 1M input tokens, $6.00 / 1M output tokens; Free consumer tier on Le Chat",
        "official_url": "https://mistral.ai",
        "release_status": "Generally Available",
        "is_featured": False
    },
    {
        "slug": "grok",
        "name": "Grok 2 & Grok 3",
        "creator": "xAI",
        "short_purpose": "Real-time conversational and reasoning AI model trained on the massive Colossus supercluster with live X/Twitter integration.",
        "primary_category": "Foundation LLMs",
        "tags": ["Real-time Knowledge", "xAI", "Colossus", "Aurora Vision", "Reasoning"],
        "detailed_overview": "Grok is developed by xAI and trained on the Colossus supercluster comprising over 100,000 NVIDIA H100 GPUs. Grok combines state-of-the-art benchmark reasoning with unfiltered live situational awareness derived from the X firehose. Grok features deep thinking/reasoning modes, image generation via Flux, and live news summarization with zero latency delay behind breaking world events.",
        "key_capabilities": [
            "Sub-second integration with real-time global news, breaking developments, and social discourse",
            "Frontier mathematical, scientific, and coding benchmark performance on Grok 3",
            "Deep search and reasoning modes dissecting multifaceted social and technical questions",
            "Integrated image generation and computer vision analysis",
            "Developer API on xAI platform offering high-rate-limit enterprise endpoints"
        ],
        "best_use_cases": [
            "Monitoring breaking financial market developments and geopolitical news in real time",
            "Competitive intelligence and social sentiment analysis across technical communities",
            "Advanced scientific hypothesis generation and technical debugging",
            "Uncensored philosophical and academic exploration with minimal guardrail refusals"
        ],
        "pricing_model": "Included in X Premium ($8/mo) & Premium+ ($16/mo); xAI API: $2.00 / 1M input tokens",
        "official_url": "https://x.ai",
        "release_status": "Generally Available",
        "is_featured": False
    },
    {
        "slug": "replit-agent",
        "name": "Replit Agent",
        "creator": "Replit",
        "short_purpose": "Autonomous development agent creating full-stack web applications, databases, and deployments directly inside Replit's cloud environment.",
        "primary_category": "Autonomous Agents",
        "tags": ["Cloud IDE", "Full-Stack Builder", "Automated Deployment", "Postgres", "Mobile Ready"],
        "detailed_overview": "Replit Agent is an autonomous software development agent natively embedded inside the Replit cloud runtime. By understanding natural language prompts, Replit Agent provisions PostgreSQL databases, installs package dependencies, writes frontend and backend code, configures environment variables, and deploys scalable production URLs within minutes, even from mobile devices via the Replit mobile app.",
        "key_capabilities": [
            "Full-stack scaffolding including database schema design, backend endpoints, and frontend UI",
            "Instant cloud provisioning of PostgreSQL databases, serverless compute, and SSL certificates",
            "Autonomous terminal command execution and dependency conflict resolution",
            "Collaborative checkpointing allowing rollbacks to any stage in the agent's build history",
            "Mobile-first app creation: build and deploy live web apps entirely from a smartphone"
        ],
        "best_use_cases": [
            "Building and launching working SaaS MVPs and internal prototypes in under 15 minutes",
            "Creating custom internal business tools connected to persistent databases",
            "Rapid weekend hackathon projects and interactive concept validation",
            "Teaching software development through interactive step-by-step code assembly"
        ],
        "pricing_model": "Included in Replit Core ($25/month) subscription",
        "official_url": "https://replit.com/agent",
        "release_status": "Generally Available",
        "is_featured": False
    },
    {
        "slug": "elevenlabs",
        "name": "ElevenLabs Voice AI",
        "creator": "ElevenLabs",
        "short_purpose": "Industry-leading voice AI platform for ultra-realistic voice cloning, text-to-speech, and conversational AI agents.",
        "primary_category": "Media Gen",
        "tags": ["Voice AI", "Text-to-Speech", "Voice Cloning", "Conversational Agents", "Sound Effects"],
        "detailed_overview": "ElevenLabs is the benchmark platform for AI audio and voice generation. Featuring emotive, human-like cadence, dynamic breath control, and multi-lingual voice synthesis across 30+ languages, ElevenLabs powers audiobooks, game character voices, video dubbing, and real-time Conversational Voice Agents capable of holding latency-free phone and web calls.",
        "key_capabilities": [
            "Ultra-realistic text-to-speech capturing human emotion, whisper, laugh, and dramatic pacing",
            "Instant and professional voice cloning from short audio reference samples",
            "Conversational Voice AI Agent SDK with sub-500ms turn-taking for customer service",
            "AI Dubbing translating video dialogue into 30+ languages while preserving the original voice timbre",
            "Generative Sound Effects synthesis producing game audio and foley effects from text prompts"
        ],
        "best_use_cases": [
            "Building real-time conversational voice assistants for customer support and sales",
            "Publishing professional narration for audiobooks, podcasts, and video voiceovers",
            "Dynamic voice generation for video game non-player characters (NPCs)",
            "Automated video localization and multilingual video marketing campaigns"
        ],
        "pricing_model": "Free tier (10k chars/mo); Starter $5/mo; Creator $22/mo; Enterprise usage plans",
        "official_url": "https://elevenlabs.io",
        "release_status": "Generally Available",
        "is_featured": False
    },
    {
        "slug": "midjourney",
        "name": "Midjourney v6.1",
        "creator": "Midjourney Inc.",
        "short_purpose": "Premier generative AI art and image creation engine renowned for photorealism, artistic aesthetics, and lighting mastery.",
        "primary_category": "Media Gen",
        "tags": ["AI Art", "Photorealism", "Diffusion", "Aesthetics", "Web Canvas"],
        "detailed_overview": "Midjourney is the benchmark generative image system celebrated for artistic sensitivity, lighting realism, and high visual appeal. Version 6.1 delivers photorealistic skin textures, accurate reflections, coherent small text rendering, and character consistency across multiple generations. Accessible via Discord and a standalone web canvas with inpainting, outpainting, and pan tools, Midjourney is the tool of choice for creative studios.",
        "key_capabilities": [
            "Exceptional compositional coherence with cinematic dynamic lighting and lens optics",
            "Reliable rendering of short text strings on signs, clothing, and packaging",
            "Web canvas editor featuring Inpainting (Vary Region), Pan, Zoom Out, and Panoramas",
            "Style Reference (--sref) and Character Reference (--cref) preserving artistic continuity",
            "Granular camera parameter overrides including aspect ratio, stylize, and chaos controls"
        ],
        "best_use_cases": [
            "Concept art, character design, and environment matte paintings for game and film studios",
            "Commercial graphic design, advertising campaigns, and magazine cover illustrations",
            "Architectural exterior and interior conceptual visualization",
            "Brand identity moodboards and creative creative exploration"
        ],
        "pricing_model": "Basic $10/mo; Standard $30/mo; Pro $60/mo; Mega $120/mo",
        "official_url": "https://www.midjourney.com",
        "release_status": "Generally Available",
        "is_featured": False
    },
    {
        "slug": "whisper",
        "name": "OpenAI Whisper v3 Large",
        "creator": "OpenAI",
        "short_purpose": "Robust open-source multilingual speech recognition and translation model trained on 680,000 hours of diverse audio.",
        "primary_category": "Foundation LLMs",
        "tags": ["Speech-to-Text", "Open Source", "Whisper", "Transcription", "Multilingual"],
        "detailed_overview": "Whisper is OpenAI's seminal speech recognition system trained on 680,000 hours of multilingual and multitask supervised audio data collected from the web. Whisper Large-v3 and Turbo deliver human-parity transcription accuracy even in noisy acoustic environments, handle heavy regional accents and technical jargon, and provide direct speech translation from 99+ languages into English with automatic timestamp alignment.",
        "key_capabilities": [
            "Near-zero word error rate (WER) across noisy audio, crosstalk, and low-fidelity recordings",
            "Direct speech-to-English translation from 99+ languages without intermediate text steps",
            "Precise word-level timestamp generation for subtitle synchronization (SRT / VTT)",
            "Open weights deployable locally on edge hardware via whisper.cpp and faster-whisper",
            "Extreme speed improvements in Whisper Large-v3 Turbo with minimal accuracy tradeoff"
        ],
        "best_use_cases": [
            "Automated transcription and caption generation for video, podcasts, and broadcast media",
            "Live speech input frontend for conversational AI and voice agents",
            "Medical, legal, and boardroom audio transcription with high jargon fidelity",
            "Offline privacy-sensitive audio transcription on local laptops and smartphones"
        ],
        "pricing_model": "Open Source (MIT License); OpenAI API: $0.006 / minute of audio",
        "official_url": "https://github.com/openai/whisper",
        "release_status": "Generally Available",
        "is_featured": False
    }
]


def seed_database() -> int:
    """Populate database with premier models, agents, and IDEs."""
    init_db()
    inserted = 0
    updated = 0

    with SessionLocal() as db:
        for item in DIRECTORY_ITEMS:
            existing = db.scalar(select(AIDirectoryItem).where(AIDirectoryItem.slug == item["slug"]))
            tags_str = json.dumps(item["tags"])
            capabilities_str = json.dumps(item["key_capabilities"])
            use_cases_str = json.dumps(item["best_use_cases"])

            if existing:
                existing.name = item["name"]
                existing.creator = item["creator"]
                existing.short_purpose = item["short_purpose"]
                existing.primary_category = item["primary_category"]
                existing.tags = tags_str
                existing.detailed_overview = item["detailed_overview"]
                existing.key_capabilities = capabilities_str
                existing.best_use_cases = use_cases_str
                existing.pricing_model = item["pricing_model"]
                existing.official_url = item["official_url"]
                existing.release_status = item["release_status"]
                existing.is_featured = item.get("is_featured", False)
                updated += 1
            else:
                new_item = AIDirectoryItem(
                    slug=item["slug"],
                    name=item["name"],
                    creator=item["creator"],
                    short_purpose=item["short_purpose"],
                    primary_category=item["primary_category"],
                    tags=tags_str,
                    detailed_overview=item["detailed_overview"],
                    key_capabilities=capabilities_str,
                    best_use_cases=use_cases_str,
                    pricing_model=item["pricing_model"],
                    official_url=item["official_url"],
                    release_status=item["release_status"],
                    is_featured=item.get("is_featured", False)
                )
                db.add(new_item)
                inserted += 1

        db.commit()

    print(f"Directory seeding completed: {inserted} inserted, {updated} updated (total {len(DIRECTORY_ITEMS)} tools).")
    return inserted + updated


if __name__ == "__main__":
    seed_database()
