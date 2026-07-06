import fs from "node:fs/promises";
import crypto from "node:crypto";
import path from "node:path";

import matter from "gray-matter";

const repoRoot = process.cwd();
const contentDir = path.resolve(repoRoot, process.env.OBSIDIAN_CONTENT_DIR ?? "content/chats");
const yuanShanDir = path.resolve(repoRoot, process.env.YUAN_SHAN_CONTENT_DIR ?? "content/yuan-shan");
const productsDir = path.resolve(repoRoot, process.env.PRODUCTS_CONTENT_DIR ?? "content/products");
const outputPath = path.join(repoRoot, "src", "generated", "content-manifest.json");
const nonWordPattern = /[^\p{L}\p{N}]+/gu;
const nonAsciiPattern = /[^a-z0-9]+/g;

const roleAliases = new Map([
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

function slugify(value) {
  const slug = String(value)
    .trim()
    .toLowerCase()
    .replace(nonWordPattern, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "untitled";
}

function asciiSlugify(value) {
  if (typeof value !== "string" || value.trim().length === 0) {
    return null;
  }

  const slug = String(value)
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(nonAsciiPattern, "-")
    .replace(/^-+|-+$/g, "");

  return slug || null;
}

function shortHash(value) {
  return crypto.createHash("sha1").update(String(value)).digest("hex").slice(0, 8);
}

function canonicalChatSlug(data, meta, fallbackSlug) {
  return (
    asciiSlugify(data.slug) ??
    asciiSlugify(fallbackSlug) ??
    asciiSlugify(meta.title) ??
    `chat-${shortHash(fallbackSlug)}`
  );
}

function uniqueSlug(base, existing) {
  let candidate = slugify(base);
  let suffix = 2;

  while (existing.has(candidate)) {
    candidate = `${slugify(base)}-${suffix}`;
    suffix += 1;
  }

  existing.add(candidate);
  return candidate;
}

async function discoverMarkdownFiles(dir) {
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

function normalizeArray(value) {
  if (Array.isArray(value)) {
    return value.map(String).filter(Boolean);
  }
  if (typeof value === "string" && value.length > 0) {
    return [value];
  }
  return [];
}

function normalizeMeta(data) {
  const section = typeof data.section === "string" ? data.section : "brainwave";
  const defaultTopic = section === "brainwave" ? "General" : section;

  return {
    title: typeof data.title === "string" && data.title.length > 0 ? data.title : "Untitled chat",
    title_en: typeof data.title_en === "string" && data.title_en.length > 0 ? data.title_en : undefined,
    section,
    category: typeof data.category === "string" && data.category.length > 0 ? data.category : section,
    topic: typeof data.topic === "string" && data.topic.length > 0 ? data.topic : defaultTopic,
    models: normalizeArray(data.models),
    source: typeof data.source === "string" ? data.source : undefined,
    source_name: typeof data.source_name === "string" ? data.source_name : undefined,
    source_url: typeof data.source_url === "string" ? data.source_url : undefined,
    canonical_url: typeof data.canonical_url === "string" ? data.canonical_url : undefined,
    summary: typeof data.summary === "string" ? data.summary : undefined,
    summary_en: typeof data.summary_en === "string" ? data.summary_en : undefined,
    published: data.published === true,
    created: data.created ? String(data.created) : undefined,
    tags: normalizeArray(data.tags),
    tags_zh: normalizeArray(data.tags_zh),
    tags_en: normalizeArray(data.tags_en),
    language: typeof data.language === "string" ? data.language : undefined,
    rss_source: typeof data.rss_source === "string" ? data.rss_source : undefined,
    score: typeof data.score === "number" ? data.score : undefined,
    impact_score: typeof data.impact_score === "number" ? data.impact_score : undefined,
    urgency_score: typeof data.urgency_score === "number" ? data.urgency_score : undefined,
    confidence_score: typeof data.confidence_score === "number" ? data.confidence_score : undefined,
    repo_path: typeof data.repo_path === "string" ? data.repo_path : undefined,
    stack: normalizeArray(data.stack),
    status: typeof data.status === "string" ? data.status : undefined,
  };
}

function normalizeSpeaker(rawSpeaker) {
  return rawSpeaker.trim().replace(/[：:]+$/u, "");
}

function parseSpeaker(rawSpeaker) {
  const speaker = normalizeSpeaker(rawSpeaker);
  const role = roleAliases.get(speaker.toLowerCase()) ?? "unknown";

  return { role, speaker };
}

function isKnownSpeaker(rawSpeaker) {
  return parseSpeaker(rawSpeaker).role !== "unknown";
}

function parseMessages(markdown) {
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

  return {
    messages,
    parseStatus: markdown.slice(0, speakerMatches[0]?.index ?? 0).trim() ? "partial" : "complete",
  };
}

async function loadRecord(filePath, existingSlugs, section) {
  const file = await fs.readFile(filePath, "utf8");
  const parsed = matter(file);
  const meta = normalizeMeta({ section, ...parsed.data });

  if (!meta.published) {
    return null;
  }

  const fallbackSlug = path.basename(filePath, ".md");
  const slugSource = canonicalChatSlug(parsed.data, meta, fallbackSlug);
  const slug = uniqueSlug(slugSource, existingSlugs);
  const aliases = Array.from(
    new Set(
      [parsed.data.slug, meta.title, fallbackSlug]
        .filter((value) => typeof value === "string" && value.trim().length > 0)
        .map(slugify)
        .filter((alias) => alias !== slug),
    ),
  );
  const { messages, parseStatus } = parseMessages(parsed.content);

  return {
    slug,
    aliases,
    rawMarkdown: parsed.content.trim(),
    parseStatus,
    meta,
    messages,
  };
}

const contentSources = [
  { dir: contentDir, section: "brainwave" },
  { dir: yuanShanDir, section: "yuan-shan" },
  { dir: productsDir, section: "xiao-ju-deng" },
];
const existingSlugs = new Set();
const records = [];

for (const source of contentSources) {
  const files = await discoverMarkdownFiles(source.dir);
  for (const filePath of files) {
    const record = await loadRecord(filePath, existingSlugs, source.section);
    if (record) {
      records.push(record);
    }
  }
}

records.sort((a, b) => (b.meta.created ?? "").localeCompare(a.meta.created ?? ""));

await fs.mkdir(path.dirname(outputPath), { recursive: true });
await fs.writeFile(outputPath, `${JSON.stringify(records, null, 2)}\n`, "utf8");

console.log(`Generated content manifest with ${records.length} published articles.`);
