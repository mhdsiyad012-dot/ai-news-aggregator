export type Category =
  | "All"
  | "Code Builders"
  | "Antigravity & IDEs"
  | "Autonomous Agents"
  | "Foundation LLMs"
  | "Media Gen"
  | "Frameworks";

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
  primary_category: string;
  tags: string[];
  detailed_overview: string;
  key_capabilities: string[];
  best_use_cases: string[];
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
