import fs from "node:fs/promises";
import path from "node:path";

import matter from "gray-matter";
import { z } from "zod";

import { siteConfig } from "@/lib/config";
import { slugify, uniqueSlug } from "@/lib/slug";
import type {
  ChatMessage,
  ChatRecord,
  ChatRecordMeta,
  ModelSummary,
  TopicSummary,
} from "@/lib/types";

const frontmatterSchema = z.object({
  title: z.string().min(1).default("Untitled chat"),
  topic: z.string().min(1).default("General"),
  models: z
    .union([z.array(z.string()), z.string()])
    .transform((value) => (Array.isArray(value) ? value : [value]))
    .default([]),
  source: z.string().optional(),
  published: z.boolean().default(false),
  created: z.coerce.string().optional(),
  tags: z
    .union([z.array(z.string()), z.string()])
    .transform((value) => (Array.isArray(value) ? value : [value]))
    .default([]),
});

const roleAliases = new Map<string, "user" | "assistant">([
  ["user", "user"],
  ["human", "user"],
  ["me", "user"],
  ["我", "user"],
  ["chatgpt", "assistant"],
  ["claude", "assistant"],
  ["gemini", "assistant"],
  ["deepseek", "assistant"],
  ["grok", "assistant"],
  ["assistant", "assistant"],
  ["model", "assistant"],
]);

async function discoverMarkdownFiles(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true }).catch(() => []);
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        return discoverMarkdownFiles(fullPath);
      }
      if (entry.isFile() && entry.name.endsWith(".md")) {
        return [fullPath];
      }
      return [];
    }),
  );

  return files.flat().sort();
}

function normalizeMeta(data: unknown): ChatRecordMeta {
  const parsed = frontmatterSchema.parse(data);

  return {
    ...parsed,
    models: parsed.models.filter(Boolean),
    tags: parsed.tags.filter(Boolean),
  };
}

function parseSpeaker(rawSpeaker: string): Pick<ChatMessage, "role" | "speaker"> {
  const speaker = rawSpeaker.trim();
  const role = roleAliases.get(speaker.toLowerCase()) ?? "unknown";

  return { role, speaker };
}

export function parseMessages(markdown: string): {
  messages: ChatMessage[];
  parseStatus: ChatRecord["parseStatus"];
} {
  const headingPattern = /^##\s+(.+)$/gm;
  const matches = [...markdown.matchAll(headingPattern)];

  if (matches.length === 0) {
    return {
      messages: [],
      parseStatus: markdown.trim() ? "partial" : "complete",
    };
  }

  const messages = matches
    .map((match, index) => {
      const start = (match.index ?? 0) + match[0].length;
      const end = matches[index + 1]?.index ?? markdown.length;
      const content = markdown.slice(start, end).trim();
      const speaker = parseSpeaker(match[1]);

      return {
        id: `m-${index + 1}`,
        ...speaker,
        content,
      };
    })
    .filter((message) => message.content.length > 0);

  const parseStatus = messages.every((message) => message.role !== "unknown")
    ? "complete"
    : "partial";

  return { messages, parseStatus };
}

async function loadChatRecord(filePath: string, existingSlugs: Set<string>) {
  const file = await fs.readFile(filePath, "utf8");
  const parsed = matter(file);
  const meta = normalizeMeta(parsed.data);

  if (!meta.published) {
    return null;
  }

  const fallbackSlug = path.basename(filePath, ".md");
  const slug = uniqueSlug(slugify(parsed.data.slug ?? fallbackSlug), existingSlugs);
  const { messages, parseStatus } = parseMessages(parsed.content);

  return {
    slug,
    rawMarkdown: parsed.content.trim(),
    parseStatus,
    meta,
    messages,
  } satisfies ChatRecord;
}

export async function getAllChats(): Promise<ChatRecord[]> {
  const files = await discoverMarkdownFiles(siteConfig.contentDir);
  const existingSlugs = new Set<string>();
  const records = await Promise.all(
    files.map((filePath) => loadChatRecord(filePath, existingSlugs)),
  );

  return records
    .filter((record): record is ChatRecord => record !== null)
    .sort((a, b) => (b.meta.created ?? "").localeCompare(a.meta.created ?? ""));
}

export async function getChatBySlug(slug: string) {
  const chats = await getAllChats();
  return chats.find((chat) => chat.slug === slug) ?? null;
}

export async function getTopics(): Promise<TopicSummary[]> {
  const chats = await getAllChats();
  const topics = new Map<string, TopicSummary>();

  for (const chat of chats) {
    const slug = slugify(chat.meta.topic);
    const current = topics.get(slug) ?? {
      slug,
      name: chat.meta.topic,
      chats: [],
      models: [],
    };

    current.chats.push(chat);
    current.models = Array.from(new Set([...current.models, ...chat.meta.models])).sort();
    topics.set(slug, current);
  }

  return Array.from(topics.values()).sort((a, b) => a.name.localeCompare(b.name));
}

export async function getTopicBySlug(slug: string) {
  const topics = await getTopics();
  return topics.find((topic) => topic.slug === slug) ?? null;
}

export async function getModels(): Promise<ModelSummary[]> {
  const chats = await getAllChats();
  const models = new Map<string, ModelSummary>();

  for (const chat of chats) {
    for (const model of chat.meta.models) {
      const slug = slugify(model);
      const current = models.get(slug) ?? { slug, name: model, chats: [] };
      current.chats.push(chat);
      models.set(slug, current);
    }
  }

  return Array.from(models.values()).sort((a, b) => a.name.localeCompare(b.name));
}

export async function getModelBySlug(slug: string) {
  const models = await getModels();
  return models.find((model) => model.slug === slug) ?? null;
}
