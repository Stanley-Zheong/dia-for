import fs from "node:fs/promises";
import path from "node:path";

import matter from "gray-matter";

const repoRoot = process.cwd();
const contentDir = path.resolve(repoRoot, process.env.OBSIDIAN_CONTENT_DIR ?? "content/chats");
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
  const slug = String(value)
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(nonAsciiPattern, "-")
    .replace(/^-+|-+$/g, "");

  return slug || null;
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
  return {
    title: typeof data.title === "string" && data.title.length > 0 ? data.title : "Untitled chat",
    topic: typeof data.topic === "string" && data.topic.length > 0 ? data.topic : "General",
    models: normalizeArray(data.models),
    source: typeof data.source === "string" ? data.source : undefined,
    published: data.published === true,
    created: data.created ? String(data.created) : undefined,
    tags: normalizeArray(data.tags),
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

function parseMessages(markdown) {
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

  return {
    messages,
    parseStatus: messages.every((message) => message.role !== "unknown") ? "complete" : "partial",
  };
}

async function loadRecord(filePath, existingSlugs) {
  const file = await fs.readFile(filePath, "utf8");
  const parsed = matter(file);
  const meta = normalizeMeta(parsed.data);

  if (!meta.published) {
    return null;
  }

  const fallbackSlug = path.basename(filePath, ".md");
  const slugSource = parsed.data.slug ?? asciiSlugify(fallbackSlug) ?? fallbackSlug;
  const slug = uniqueSlug(slugSource, existingSlugs);
  const { messages, parseStatus } = parseMessages(parsed.content);

  return {
    slug,
    rawMarkdown: parsed.content.trim(),
    parseStatus,
    meta,
    messages,
  };
}

const files = await discoverMarkdownFiles(contentDir);
const existingSlugs = new Set();
const records = (
  await Promise.all(files.map((filePath) => loadRecord(filePath, existingSlugs)))
)
  .filter(Boolean)
  .sort((a, b) => (b.meta.created ?? "").localeCompare(a.meta.created ?? ""));

await fs.mkdir(path.dirname(outputPath), { recursive: true });
await fs.writeFile(outputPath, `${JSON.stringify(records, null, 2)}\n`, "utf8");

console.log(`Generated content manifest with ${records.length} published chats.`);
