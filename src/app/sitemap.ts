import type { MetadataRoute } from "next";

import { getAllArticles, getTags, getTopics, getYuanShanCategories } from "@/lib/content";
import { siteConfig } from "@/lib/config";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, topics, tags, categories] = await Promise.all([
    getAllArticles(),
    getTopics(),
    getTags(),
    getYuanShanCategories(),
  ]);

  const paths = new Set<string>([
    "/",
    "/brainwave",
    "/yuan-shan",
    "/xiao-ju-deng",
    "/topics",
    "/tags",
    "/search",
    ...articles.map((article) => `/${article.meta.section}/${article.slug}`),
    ...topics.map((topic) => `/topics/${topic.slug}`),
    ...tags.map((tag) => `/tags/${tag.slug}`),
    ...categories.map((category) => `/yuan-shan/${category.slug}`),
  ]);

  return siteConfig.locales.flatMap((locale) =>
    Array.from(paths).map((path) => ({
      url: `${siteConfig.primaryUrl}/${locale}${path === "/" ? "" : path}`,
      lastModified: new Date(),
      changeFrequency: path === "/" ? "daily" : "weekly",
      priority: path === "/" ? 1 : 0.7,
    })),
  );
}
