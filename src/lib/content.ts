import { z } from "zod";

import contentManifest from "@/generated/content-manifest.json";
import { slugify, uniqueSlug } from "@/lib/slug";
import type {
  ArticleRecord,
  ChatMessage,
  ChatRecord,
  ChatRecordMeta,
  ContentSection,
  ModelSummary,
  TagSummary,
  TopicSummary,
  YuanShanCategorySummary,
} from "@/lib/types";

const frontmatterSchema = z.object({
  title: z.string().min(1).default("Untitled chat"),
  section: z
    .enum(["brainwave", "yuan-shan", "xiao-ju-deng"])
    .default("brainwave"),
  category: z.string().min(1).optional(),
  topic: z.string().min(1).default("General"),
  models: z
    .union([z.array(z.string()), z.string()])
    .transform((value) => (Array.isArray(value) ? value : [value]))
    .default([]),
  source: z.string().optional(),
  source_name: z.string().optional(),
  source_url: z.string().optional(),
  canonical_url: z.string().optional(),
  summary: z.string().optional(),
  published: z.boolean().default(false),
  created: z.coerce.string().optional(),
  tags: z
    .union([z.array(z.string()), z.string()])
    .transform((value) => (Array.isArray(value) ? value : [value]))
    .default([]),
  insights: z.string().optional(),
  rss_source: z.string().optional(),
  score: z.coerce.number().optional(),
  impact_score: z.coerce.number().optional(),
  urgency_score: z.coerce.number().optional(),
  confidence_score: z.coerce.number().optional(),
  repo_path: z.string().optional(),
  stack: z
    .union([z.array(z.string()), z.string()])
    .transform((value) => (Array.isArray(value) ? value : [value]))
    .optional(),
  status: z.string().optional(),
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
    category: parsed.category ?? defaultCategoryForSection(parsed.section),
    topic: parsed.topic === "General" ? defaultTopicForSection(parsed.section) : parsed.topic,
    models: parsed.models.filter(Boolean),
    tags: parsed.tags.filter(Boolean),
    stack: parsed.stack?.filter(Boolean),
  };
}

export const yuanShanCategoryConfig = [
  { slug: "ai", name: "AI" },
  { slug: "data", name: "数据" },
  { slug: "new-energy", name: "新能源" },
  { slug: "traditional-ai", name: "传统AI+" },
  { slug: "education-ai", name: "教育AI+" },
] as const;

const sectionNames: Record<ContentSection, string> = {
  brainwave: "脑电波",
  "yuan-shan": "远山",
  "xiao-ju-deng": "小桔灯",
};

function defaultCategoryForSection(section: ContentSection) {
  return sectionNames[section];
}

function defaultTopicForSection(section: ContentSection) {
  if (section === "brainwave") {
    return "General";
  }

  return sectionNames[section];
}

function normalizeYuanShanCategorySlug(category: string) {
  const normalized = category.trim().toLowerCase();
  if (["ai", "01_ai技术", "02_ai产品", "ai技术", "ai产品"].includes(normalized)) {
    return "ai";
  }
  if (["data", "数据", "08_cdo中央数据组织", "cdo"].includes(normalized)) {
    return "data";
  }
  if (["new-energy", "新能源", "07_新能源"].includes(normalized)) {
    return "new-energy";
  }
  if (["traditional-ai", "传统ai+", "传统ai", "03_ai传统行业落地", "05_制造业"].includes(normalized)) {
    return "traditional-ai";
  }
  if (["education-ai", "教育ai+", "教育ai", "04_高等教育职业发展"].includes(normalized)) {
    return "education-ai";
  }
  return "ai";
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

export async function getAllArticles(): Promise<ArticleRecord[]> {
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

export async function getAllChats(): Promise<ChatRecord[]> {
  const articles = await getAllArticles();
  return articles.filter((article) => article.meta.section === "brainwave");
}

export async function getArticlesBySection(section: ContentSection): Promise<ArticleRecord[]> {
  const articles = await getAllArticles();
  return articles.filter((article) => article.meta.section === section);
}

export async function getArticleBySectionSlug(section: ContentSection, slug: string) {
  const articles = await getArticlesBySection(section);
  const slugs = new Set([slug]);

  try {
    slugs.add(decodeURIComponent(slug));
  } catch {
    // Keep the original slug when it is not URI encoded.
  }

  return (
    articles.find(
      (article) => slugs.has(article.slug) || article.aliases?.some((alias) => slugs.has(alias)),
    ) ?? null
  );
}

export async function getProducts() {
  return getArticlesBySection("xiao-ju-deng");
}

export async function getYuanShanCategories(): Promise<YuanShanCategorySummary[]> {
  const articles = await getArticlesBySection("yuan-shan");
  return yuanShanCategoryConfig.map((category) => ({
    ...category,
    articles: articles.filter(
      (article) =>
        normalizeYuanShanCategorySlug(article.meta.category ?? "AI") === category.slug,
    ),
  }));
}

export async function getYuanShanCategoryBySlug(slug: string) {
  const categories = await getYuanShanCategories();
  return categories.find((category) => category.slug === slug) ?? null;
}

export async function getChatBySlug(slug: string) {
  const chats = await getAllChats();
  const slugs = new Set([slug]);

  try {
    slugs.add(decodeURIComponent(slug));
  } catch {
    // Keep the original slug when it is not URI encoded.
  }

  return (
    chats.find(
      (chat) => slugs.has(chat.slug) || chat.aliases?.some((alias) => slugs.has(alias)),
    ) ?? null
  );
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

export async function getTags(): Promise<TagSummary[]> {
  const articles = await getAllArticles();
  const tags = new Map<string, TagSummary>();

  for (const article of articles) {
    for (const tag of article.meta.tags) {
      const slug = slugify(tag);
      const current = tags.get(slug) ?? { slug, name: tag, chats: [] };
      current.chats.push(article);
      tags.set(slug, current);
    }
  }

  return Array.from(tags.values()).sort((a, b) => a.name.localeCompare(b.name));
}

export async function getTagBySlug(slug: string) {
  const tags = await getTags();
  return tags.find((tag) => tag.slug === slug) ?? null;
}
