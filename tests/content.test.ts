import { describe, expect, it } from "vitest";

import { getAllChats, parseMessages } from "@/lib/content";
import { slugify } from "@/lib/slug";

describe("content ingestion", () => {
  it("filters unpublished notes from public content", async () => {
    const chats = await getAllChats();
    const titles = chats.map((chat) => chat.meta.title);

    expect(titles).toContain("AI 编程工具选型：ChatGPT 视角");
    expect(titles).not.toContain("未发布的私人草稿");
  });

  it("normalizes slugs", () => {
    expect(slugify("AI 编程工具选型")).toBe("ai-编程工具选型");
    expect(slugify("  Gemini AI Search  ")).toBe("gemini-ai-search");
  });

  it("extracts user and model messages from markdown headings", () => {
    const result = parseMessages(`## User

Hello

## Claude

Hi there`);

    expect(result.parseStatus).toBe("complete");
    expect(result.messages).toHaveLength(2);
    expect(result.messages[0]).toMatchObject({ role: "user", speaker: "User" });
    expect(result.messages[1]).toMatchObject({ role: "assistant", speaker: "Claude" });
  });

  it("keeps partial status for unknown speakers", () => {
    const result = parseMessages(`## Editor

Raw note`);

    expect(result.parseStatus).toBe("partial");
    expect(result.messages[0]).toMatchObject({ role: "unknown", speaker: "Editor" });
  });
});
