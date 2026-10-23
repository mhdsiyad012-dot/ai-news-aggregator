export type DirectoryCategory =
  | "All Purpose"
  | "Video & Image Editing AI"
  | "UI/UX & Product Design AI"
  | "Coding & Autonomous Agents"
  | "Conversational & Reasoning LLMs"
  | "Audio, Voice & Music AI"
  | "Audio & Speech AI"
  | "Research & Search Engines"
  | "Workflow & Automation"
  | "Workflow & Enterprise Automation"
  | (string & {});

export type CompanyFilter =
  | "All Companies"
  | "Google"
  | "OpenAI"
  | "Anthropic"
  | "Meta"
  | "xAI"
  | "Microsoft & GitHub"
  | "DeepSeek"
  | "Mistral"
  | "Cohere"
  | "Perplexity"
  | "NVIDIA"
  | "Vercel"
  | "Creative & Editing Specialists"
  | "Developer & Search Leaders"
  | "Enterprise & Productivity"
  | "Open Source & Independent"
  | (string & {});

export type PricingType = "Free" | "Freemium" | "Paid" | "Open Source";

export type NewsCategory =
  | "All"
  | "LLMs"
  | "Coding & Agents"
  | "Design & Media"
  | "Hardware & Chips"
  | "Open Source"
  | "Enterprise & Policy";

export interface AIDirectoryItem {
  id: string | number;
  slug: string;
  name: string;
  company?: string;
  creator?: string;
  category?: DirectoryCategory | string;
  primary_category?: string;
  secondaryCategories?: (DirectoryCategory | string)[];
  tagline?: string;
  short_purpose?: string;
  description?: string;
  detailed_overview?: string;
  keyFeatures?: string[];
  key_capabilities?: string[];
  bestFor?: string;
  best_use_cases?: string[];
  pricing?: PricingType | string;
  pricing_model?: string;
  officialUrl?: string;
  official_url?: string;
  isFeatured?: boolean;
  is_featured?: boolean;
  architectureDetails?: string;
  companyBackground?: string;
  relatedToolSlugs?: string[];
  tags?: string[];
  example_prompts?: string[];
  release_status?: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}

export interface LiveNewsItem {
  id: string | number;
  title: string;
  summary: string;
  url: string;
  category: NewsCategory;
  sourceDomain: string;
  relativeTime: string;
  publishedAt?: string;
  utcTimestamp?: string;
  publishedUtc?: string;
  aiTakeaway?: string;
  aiBrief?: string;
  isPinned?: boolean;
  score?: number;
  commentsCount?: number;
}

export interface NewsArticle {
  id: number | string;
  title: string;
  summary: string;
  url: string;
  category: string;
  source_name: string;
  related_tools?: string;
  is_pinned?: boolean;
  published_at?: string;
  created_at?: string;
}
