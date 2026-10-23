import { MetadataRoute } from "next";
import { getAllDirectoryItems } from "@/lib/directoryService";
import { AI_DIRECTORY_DATA } from "@/data/aiDirectoryData";

export const dynamic = "force-dynamic";
export const revalidate = 3600; // 1 hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://ai-news-aggregator-delta.vercel.app";

  // Static core routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/models`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/ecosystems`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/compare`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/news`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // Dynamic tool routes
  let tools = [];
  try {
    tools = await getAllDirectoryItems();
  } catch {
    tools = AI_DIRECTORY_DATA;
  }

  const toolRoutes: MetadataRoute.Sitemap = tools.map((tool) => {
    const slug = tool.slug || String(tool.id);
    return {
      url: `${baseUrl}/tool/${slug}`,
      lastModified: tool.created_at ? new Date(tool.created_at) : new Date(),
      changeFrequency: "daily",
      priority: tool.isFeatured ? 0.8 : 0.65,
    };
  });

  return [...staticRoutes, ...toolRoutes];
}
