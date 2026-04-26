import { describe, expect, it } from "vitest";

import { getAllChats, getTags, getTagBySlug, parseMessages } from "@/lib/content";
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
    expect(result.messages).toHaveLength(0);
  });

  it("keeps answer-internal markdown headings inside the current model message", () => {
    const result = parseMessages(`## user：

Question

## perplexity

Answer opening.

## 典型项目样本

This heading is part of the model answer.

## user

Follow up`);

    expect(result.parseStatus).toBe("complete");
    expect(result.messages).toHaveLength(3);
    expect(result.messages[1]).toMatchObject({
      role: "assistant",
      speaker: "perplexity",
    });
    expect(result.messages[1].content).toContain("## 典型项目样本");
    expect(result.messages[1].content).toContain("This heading is part of the model answer.");
  });
});

describe("tags", () => {
  it("getTags returns only tags from published chats", async () => {
    const tags = await getTags();

    // Tags should exist (from published chats that have tags)
    // Each tag should only contain published chats
    for (const tag of tags) {
      for (const chat of tag.chats) {
        expect(chat.meta.published).toBe(true);
      }
    }
  });

  it("getTagBySlug returns null for non-existent tag", async () => {
    const tag = await getTagBySlug("this-tag-does-not-exist-anywhere");
    expect(tag).toBeNull();
  });

  it("tag chats only include published records", async () => {
    const tags = await getTags();

    if (tags.length > 0) {
      const firstTag = tags[0];
      const tagBySlug = await getTagBySlug(firstTag.slug);
      expect(tagBySlug).not.toBeNull();
      expect(tagBySlug!.chats.length).toBeGreaterThan(0);
      for (const chat of tagBySlug!.chats) {
        expect(chat.meta.published).toBe(true);
      }
    }
  });
});
