import { z } from "zod";

import contentManifest from "@/generated/content-manifest.json";
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
  ["perplexity", "assistant"],
  ["assistant", "assistant"],
  ["model", "assistant"],
]);

function normalizeMeta(data: unknown): ChatRecordMeta {
  const parsed = frontmatterSchema.parse(data);

  return {
    ...parsed,
    models: parsed.models.filter(Boolean),
    tags: parsed.tags.filter(Boolean),
  };
}

function parseSpeaker(rawSpeaker: string): Pick<ChatMessage, "role" | "speaker"> {
  const speaker = rawSpeaker.trim().replace(/[：:]+$/u, "");
  const role = roleAliases.get(speaker.toLowerCase()) ?? "unknown";

  return { role, speaker };
}

function isKnownSpeaker(rawSpeaker: string) {
  return parseSpeaker(rawSpeaker).role !== "unknown";
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

  const speakerMatches = matches.filter((match) => isKnownSpeaker(match[1]));

  if (speakerMatches.length === 0) {
    return {
      messages: [],
      parseStatus: markdown.trim() ? "partial" : "complete",
    };
  }

  const messages = speakerMatches
    .map((match, index) => {
      const start = (match.index ?? 0) + match[0].length;
      const end = speakerMatches[index + 1]?.index ?? markdown.length;
      const content = markdown.slice(start, end).trim();
      const speaker = parseSpeaker(match[1]);

      return {
        id: `m-${index + 1}`,
        ...speaker,
        content,
      };
    })
    .filter((message) => message.content.length > 0);

  const leadingContent = markdown.slice(0, speakerMatches[0]?.index ?? 0).trim();
  const parseStatus = leadingContent ? "partial" : "complete";

  return { messages, parseStatus };
}

export async function getAllChats(): Promise<ChatRecord[]> {
  const existingSlugs = new Set<string>();

  return (contentManifest as ChatRecord[])
    .filter((record) => record.meta.published)
    .map((record) => ({
      ...record,
      slug: uniqueSlug(record.slug, existingSlugs),
      meta: normalizeMeta(record.meta),
    }))
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
