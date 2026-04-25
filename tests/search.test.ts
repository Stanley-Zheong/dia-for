import { describe, expect, it } from "vitest";

import { buildSearchCorpus, retrieveRelevantSources } from "@/lib/search";
import type { ChatRecord } from "@/lib/types";

const chat: ChatRecord = {
  slug: "published-chat",
  rawMarkdown: "Gemini 建议搜索回答展示来源链接。",
  parseStatus: "complete",
  meta: {
    title: "公开搜索记录",
    topic: "AI Search",
    models: ["Gemini"],
    published: true,
    tags: ["search"],
  },
  messages: [
    {
      id: "m-1",
      role: "assistant",
      speaker: "Gemini",
      content: "搜索回答必须显示来源链接。",
    },
  ],
};

describe("search corpus", () => {
  it("builds searchable snippets from published chat records", () => {
    const corpus = buildSearchCorpus([chat]);

    expect(corpus).toHaveLength(1);
    expect(corpus[0]).toMatchObject({
      chatSlug: "published-chat",
      title: "公开搜索记录",
      topic: "AI Search",
    });
  });

  it("retrieves matching sources", () => {
    const corpus = buildSearchCorpus([chat]);
    const sources = retrieveRelevantSources("来源链接", corpus);

    expect(sources).toHaveLength(1);
    expect(sources[0].chatSlug).toBe("published-chat");
  });
});
