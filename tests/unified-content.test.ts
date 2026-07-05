import { describe, expect, it } from "vitest";

import {
  getAllArticles,
  getArticleBySectionSlug,
  getArticlesBySection,
  getProducts,
  getYuanShanCategories,
  getYuanShanCategoryBySlug,
} from "@/lib/content";

describe("unified information site content", () => {
  it("accumulates published articles from brainwave, yuan-shan, and xiao-ju-deng", async () => {
    const articles = await getAllArticles();
    const sections = new Set(articles.map((article) => article.meta.section));

    expect(sections.has("brainwave")).toBe(true);
    expect(sections.has("yuan-shan")).toBe(true);
    expect(sections.has("xiao-ju-deng")).toBe(true);
    expect(articles.some((article) => article.meta.title.includes("异构Token工厂"))).toBe(true);
  });

  it("resolves a yuan-shan article through a stable section URL slug", async () => {
    const yuanShan = await getArticlesBySection("yuan-shan");
    const article = yuanShan.find((item) => item.meta.title.includes("异构Token工厂"));

    expect(article).toBeDefined();
    const resolved = await getArticleBySectionSlug("yuan-shan", article!.slug);
    expect(resolved?.meta.title).toBe(article?.meta.title);
    expect(resolved?.rawMarkdown).toContain("建议动作");
  });

  it("groups yuan-shan articles into the required five categories", async () => {
    const categories = await getYuanShanCategories();
    const slugs = categories.map((category) => category.slug);

    expect(slugs).toEqual([
      "ai",
      "data",
      "new-energy",
      "traditional-ai",
      "education-ai",
    ]);

    const ai = await getYuanShanCategoryBySlug("ai");
    expect(ai?.articles.some((article) => article.meta.title.includes("异构Token工厂"))).toBe(true);
  });

  it("loads xiao-ju-deng products as published product articles", async () => {
    const products = await getProducts();

    expect(products.some((product) => product.meta.title === "dia-for")).toBe(true);
    expect(products.every((product) => product.meta.section === "xiao-ju-deng")).toBe(true);
  });
});
