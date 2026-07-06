import { describe, expect, it } from "vitest";

import { localizeArticle, localizedMarkdown, withLocale } from "@/lib/i18n";
import type { ArticleRecord } from "@/lib/types";

const article: ArticleRecord = {
  slug: "sample",
  aliases: [],
  rawMarkdown: `<!-- lang:zh -->
## 背景

中文正文。
<!-- /lang:zh -->

<!-- lang:en -->
## Background

English body.
<!-- /lang:en -->`,
  parseStatus: "partial",
  messages: [],
  meta: {
    title: "中文标题",
    title_en: "English Title",
    section: "yuan-shan",
    category: "AI",
    topic: "远山",
    models: [],
    summary: "中文摘要",
    summary_en: "English summary",
    published: true,
    tags: ["远山"],
    tags_zh: ["远山"],
    tags_en: ["Distant Hills"],
  },
};

describe("i18n helpers", () => {
  it("builds locale-prefixed URLs", () => {
    expect(withLocale("/yuan-shan/sample", "en")).toBe("/en/yuan-shan/sample");
    expect(withLocale("/", "zh")).toBe("/zh");
  });

  it("extracts markdown language blocks", () => {
    expect(localizedMarkdown(article.rawMarkdown, "zh")).toContain("中文正文");
    expect(localizedMarkdown(article.rawMarkdown, "en")).toContain("English body");
  });

  it("localizes article metadata and body", () => {
    const english = localizeArticle(article, "en");

    expect(english.meta.title).toBe("English Title");
    expect(english.meta.summary).toBe("English summary");
    expect(english.meta.tags).toEqual(["Distant Hills"]);
    expect(english.rawMarkdown).toContain("English body");
  });
});
