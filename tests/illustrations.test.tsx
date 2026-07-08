import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ArticleIllustration } from "@/components/ArticleIllustration";
import { illustrationForArticle } from "@/lib/illustrations";
import type { ArticleRecord } from "@/lib/types";

const sampleArticle: ArticleRecord = {
  slug: "sample-yuan-shan",
  aliases: [],
  rawMarkdown: "正文",
  parseStatus: "partial",
  messages: [],
  meta: {
    title: "AI 产业观察",
    section: "yuan-shan",
    category: "AI",
    topic: "远山",
    models: [],
    source: "玄姐聊AGI",
    source_name: "公众号",
    published: true,
    created: "2026-07-04",
    tags: ["AI", "推理服务"],
  },
};

describe("content illustrations", () => {
  it("derives a stable generated nature image path from article identity", () => {
    const illustration = illustrationForArticle(sampleArticle);

    expect(illustration.src).toBe("/assets/generated-illustrations/yuan-shan-sample-yuan-shan.svg");
    expect(illustration.alt).toContain("AI 产业观察");
    expect(illustration.alt).toContain("自然风景配图");
  });

  it("renders an accessible lazy-loaded image for article pages", () => {
    const markup = renderToStaticMarkup(<ArticleIllustration article={sampleArticle} />);

    expect(markup).toContain('class="article-illustration"');
    expect(markup).toContain('src="/assets/generated-illustrations/yuan-shan-sample-yuan-shan.svg"');
    expect(markup).toContain('loading="lazy"');
    expect(markup).toContain('decoding="async"');
    expect(markup).toContain("自然风景配图");
  });
});
