import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ChatMessage } from "@/components/ChatMessage";
import { getAllChats, getChatBySlug, getTopics } from "@/lib/content";

const contentDir = path.join(process.cwd(), "content", "chats");

function publishedSourceFiles() {
  return fs
    .readdirSync(contentDir)
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => {
      const filePath = path.join(contentDir, fileName);
      const file = fs.readFileSync(filePath, "utf8");
      const parsed = matter(file);

      return {
        fileName,
        body: parsed.content.trim(),
        data: parsed.data as {
          title?: string;
          topic?: string;
          published?: boolean;
        },
      };
    })
    .filter((source) => source.data.published === true);
}

describe("published content acceptance", () => {
  it("matches published Markdown files exactly without extra or missing chats", async () => {
    const sources = publishedSourceFiles();
    const chats = await getAllChats();

    expect(chats).toHaveLength(sources.length);
    expect(chats.map((chat) => chat.meta.title).sort()).toEqual(
      sources.map((source) => source.data.title).sort(),
    );
  });

  it("derives topics and counts exactly from published Markdown files", async () => {
    const sources = publishedSourceFiles();
    const expectedTopics = new Map<string, number>();

    for (const source of sources) {
      const topic = source.data.topic ?? "General";
      expectedTopics.set(topic, (expectedTopics.get(topic) ?? 0) + 1);
    }

    const topics = await getTopics();

    expect(topics).toHaveLength(expectedTopics.size);
    for (const topic of topics) {
      expect(topic.chats).toHaveLength(expectedTopics.get(topic.name) ?? 0);
    }
  });

  it("resolves every published chat by slug and preserves the Markdown body", async () => {
    const chats = await getAllChats();
    const sources = publishedSourceFiles();
    const sourcesByTitle = new Map(
      sources.map((source) => [source.data.title, source.body]),
    );

    for (const chat of chats) {
      const resolved = await getChatBySlug(chat.slug);
      expect(resolved?.meta.title).toBe(chat.meta.title);
      expect(resolved?.rawMarkdown).toBe(sourcesByTitle.get(chat.meta.title));
    }
  });

  it("keeps harness answer headings inside Perplexity messages instead of creating fake turns", async () => {
    const harness = (await getAllChats()).find(
      (chat) => chat.meta.title === "harness 自动化开发思考",
    );

    expect(harness).toBeDefined();
    expect(harness?.messages.some((message) => message.role === "unknown")).toBe(false);
    expect(harness?.messages.length).toBeLessThan(20);
    expect(harness?.messages[1]?.content).toContain("## 典型项目样本");
  });

  it("renders user turns on the right and model turns on the left", () => {
    const userMarkup = renderToStaticMarkup(
      <ChatMessage
        message={{
          id: "u1",
          role: "user",
          speaker: "User",
          content: "Question",
        }}
      />,
    );
    const assistantMarkup = renderToStaticMarkup(
      <ChatMessage
        message={{
          id: "a1",
          role: "assistant",
          speaker: "Claude",
          content: "Answer",
        }}
      />,
    );

    expect(userMarkup).toContain('data-chat-turn-align="right"');
    expect(assistantMarkup).toContain('data-chat-turn-align="left"');
  });
});
