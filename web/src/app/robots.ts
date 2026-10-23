import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://ai-news-aggregator-delta.vercel.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/admin/", "/_not-found"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
