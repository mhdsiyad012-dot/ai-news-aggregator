export type Category =
  | "All"
  | "Chatbots & Assistants"
  | "Code Builders & IDEs"
  | "Autonomous Agents"
  | "Foundation LLMs"
  | "Image & Video Gen"
  | "Voice & Audio"
  | "Search & Research"
  | "Agent Frameworks";

export type CompanyFilter =
  | "All Companies"
  | "Google"
  | "OpenAI"
  | "Anthropic"
  | "Meta"
  | "DeepSeek"
  | "Alibaba / Qwen"
  | "Cursor"
  | "xAI"
  | "Mistral"
  | "Microsoft / GitHub"
  | "Perplexity"
  | "Vercel"
  | "Runway & Kling"
  | "Independent / Open Source";

export type PricingFilter = "All" | "Free" | "Freemium" | "Open Source" | "Paid / API";

export type WireCategory =
  | "All"
  | "LLMs"
  | "Code Builders"
  | "Hardware"
  | "Robotics"
  | "Startups";

export interface AIDirectoryItem {
  id?: number;
  slug: string;
  name: string;
  creator: string;
  short_purpose: string;
  primary_category: Category | string;
  tags: string[];
  detailed_overview: string;
  key_capabilities: string[];
  best_use_cases: string[];
  example_prompts?: string[];
  pricing_model: string;
  official_url: string;
  release_status: "Generally Available" | "Active Preview" | "Open Source" | "Research Preview" | string;
  is_featured?: boolean;
  created_at?: string;
}

export interface NewsArticle {
  id?: number;
  title: string;
  summary: string;
  url: string;
  category: "LLMs" | "Code Builders" | "Hardware" | "Robotics" | "Startups" | string;
  source_name?: string;
  related_tools?: string;
  is_pinned?: boolean;
  published_at?: string;
  created_at?: string;
}

export interface SavedLibraryState {
  toolSlugs: string[];
  articleIds: number[];
}

