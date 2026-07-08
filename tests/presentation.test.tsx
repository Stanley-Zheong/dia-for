import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ArticleCard } from "@/components/ArticleCard";
import { AppShell } from "@/components/AppShell";
import { ChatCard } from "@/components/ChatCard";
import { HomeHeroIdentity } from "@/components/HomeHeroIdentity";
import type { ArticleRecord, ChatRecord } from "@/lib/types";

const chat: ChatRecord = {
  slug: "sample-chat",
  aliases: [],
  rawMarkdown: "## user\nQuestion\n\n## Claude\nAnswer",
  parseStatus: "complete",
  messages: [
    { id: "m-1", role: "user", speaker: "user", content: "Question" },
    { id: "m-2", role: "assistant", speaker: "Claude", content: "Answer" },
  ],
  meta: {
    title: "Sample chat",
    section: "brainwave",
    category: "脑电波",
    topic: "高阶 Prompt 架构",
    models: ["GPT5.5", "Claude"],
    published: true,
    created: "Tue Apr 21 2026 20:00:00 GMT-0400 (Eastern Daylight Time)",
    tags: ["Prompt", "反向测试"],
  },
};

const yuanShan: ArticleRecord = {
  slug: "sample-yuan-shan",
  aliases: [],
  rawMarkdown: "正文",
  parseStatus: "partial",
  messages: [],
  meta: {
    title: "Sample intelligence",
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

describe("public card presentation", () => {
  it("renders the enlarged logo and home identity block", () => {
    const shellMarkup = renderToStaticMarkup(<AppShell><main /></AppShell>);
    const heroMarkup = renderToStaticMarkup(<HomeHeroIdentity copy="Sample copy" />);

    expect(shellMarkup).toContain('width="46"');
    expect(shellMarkup).toContain('height="46"');
    expect(heroMarkup).toContain("二dd水 (DAL · DIL)");
    expect(heroMarkup).toContain("聚数成海，滴水成智");
    expect(heroMarkup).toContain("hero-tagline-gradient");
  });

  it("uses topic, model names, and YYYY-MM-DD for brainwave card metadata", () => {
    const markup = renderToStaticMarkup(<ChatCard chat={chat} />);

    expect(markup).toContain("高阶 Prompt 架构 · GPT5.5 / Claude · 2026-04-21");
    expect(markup).not.toContain("脑电波 · 高阶 Prompt 架构");
    expect(markup).not.toContain("轮");
  });

  it("uses source name, source title, and YYYY-MM-DD for yuan-shan card metadata", () => {
    const markup = renderToStaticMarkup(<ArticleCard article={yuanShan} />);

    expect(markup).toContain("公众号 玄姐聊AGI，2026-07-04");
    expect(markup).not.toContain("远山 · AI");
  });

  it("emits normalized keyword data for page-level filtering", () => {
    const chatMarkup = renderToStaticMarkup(<ChatCard chat={chat} />);
    const yuanShanMarkup = renderToStaticMarkup(<ArticleCard article={yuanShan} />);

    expect(chatMarkup).toContain("data-filter-item=\"true\"");
    expect(chatMarkup).toContain("高阶 prompt 架构");
    expect(chatMarkup).toContain("gpt5.5");
    expect(yuanShanMarkup).toContain("data-filter-item=\"true\"");
    expect(yuanShanMarkup).toContain("玄姐聊agi");
    expect(yuanShanMarkup).toContain("推理服务");
  });
});
