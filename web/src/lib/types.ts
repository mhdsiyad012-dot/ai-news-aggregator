export type DirectoryCategory =
  | "All Purpose"
  | "Video & Image Editing AI"
  | "UI/UX & Product Design AI"
  | "Coding & Autonomous Agents"
  | "Conversational & Reasoning LLMs"
  | "Audio, Voice & Music AI"
  | "Research & Search Engines"
  | "Workflow & Automation";

export type CompanyFilter =
  | "All Companies"
  | "Google"
  | "OpenAI"
  | "Anthropic"
  | "Meta"
  | "xAI"
  | "Microsoft & GitHub"
  | "Vercel"
  | "Creative & Editing Specialists"
  | "Developer & Search Leaders"
  | "Open Source & Independent";

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
  release_status?: string;
  architectureDetails?: string;
  companyBackground?: string;
  relatedToolSlugs?: string[];
  tags?: string[];
  example_prompts?: string[];
  created_at?: string;
}

export interface LiveNewsItem {
  id: string | number;
  title: string;
  summary: string;
  url: string;
  sourceDomain: string;
  relativeTime: string;
  utcTimestamp: string;
  category: NewsCategory;
  score?: number;
  commentsCount?: number;
  aiTakeaway?: string;
  publishedAt?: string;
  publishedUtc?: string;
  aiBrief?: string;
  isPinned?: boolean;
  is_pinned?: boolean;
}

// Backward compatibility aliases
export type Category = DirectoryCategory | string;
export type WireCategory = NewsCategory;
export type PricingFilter = "All" | PricingType;
export type NewsArticle = {
  id?: number | string;
  title: string;
  summary: string;
  url: string;
  category: string;
  source_name?: string;
  related_tools?: string;
  is_pinned?: boolean;
  published_at?: string;
  created_at?: string;
};

export interface SavedLibraryState {
  toolSlugs: string[];
  articleIds: number[];
}
