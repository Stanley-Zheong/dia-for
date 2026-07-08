import type { ArticleRecord, ChatMessage, ChatRecord } from "@/lib/types";

const monthNumbers: Record<string, string> = {
  jan: "01",
  feb: "02",
  mar: "03",
  apr: "04",
  may: "05",
  jun: "06",
  jul: "07",
  aug: "08",
  sep: "09",
  oct: "10",
  nov: "11",
  dec: "12",
};

function unique(values: string[]) {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const value of values) {
    const label = value.trim();
    const key = normalizeKeyword(label);
    if (!label || seen.has(key)) continue;
    seen.add(key);
    result.push(label);
  }
  return result;
}

export function normalizeKeyword(value: string) {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

export function formatPublicDate(value?: string, fallback = "未标注日期") {
  if (!value) return fallback;

  const iso = value.match(/\b(\d{4})-(\d{2})-(\d{2})\b/);
  if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}`;

  const english = value.match(/\b(?:mon|tue|wed|thu|fri|sat|sun)\s+([a-z]{3})\s+(\d{1,2})\s+(\d{4})\b/i);
  if (english) {
    const month = monthNumbers[english[1].toLowerCase()];
    if (month) return `${english[3]}-${month}-${english[2].padStart(2, "0")}`;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toISOString().slice(0, 10);
}

function assistantSpeakerModels(messages: ChatMessage[]) {
  return unique(
    messages
      .filter((message) => message.role === "assistant")
      .map((message) => message.speaker),
  );
}

export function modelNamesFor(chat: ChatRecord, fallback = "未标注模型") {
  const models = unique(chat.meta.models.length ? chat.meta.models : assistantSpeakerModels(chat.messages));
  return models.length ? models : [fallback];
}

export function primaryKeywordFor(article: ArticleRecord) {
  if (article.meta.section === "brainwave") {
    return article.meta.topic && article.meta.topic !== "General"
      ? article.meta.topic
      : article.meta.tags[0] ?? article.meta.category ?? "脑电波";
  }

  return article.meta.category ?? article.meta.tags[0] ?? article.meta.topic;
}

export function sourceLabelFor(article: ArticleRecord, fallback = "站内文章") {
  const sourceName = article.meta.source_name?.trim();
  const source = article.meta.source?.trim();
  const rssSource = article.meta.rss_source?.trim();
  const detail = source && source !== sourceName ? source : rssSource && rssSource !== sourceName ? rssSource : "";
  const label = unique([sourceName ?? "", detail]).join(" ");
  return label || fallback;
}

export function cardKeywordsFor(article: ArticleRecord) {
  const values =
    article.meta.section === "brainwave"
      ? [
          article.meta.topic,
          article.meta.category ?? "",
          ...modelNamesFor(article, ""),
          ...article.meta.tags,
        ]
      : [
          article.meta.category ?? "",
          sourceLabelFor(article, ""),
          article.meta.source_name ?? "",
          article.meta.source ?? "",
          article.meta.rss_source ?? "",
          ...article.meta.tags,
        ];

  return unique(values).map(normalizeKeyword).filter(Boolean);
}

export function keywordSummariesFor(articles: ArticleRecord[]) {
  const counts = new Map<string, { label: string; count: number }>();

  for (const article of articles) {
    const displayKeywords =
      article.meta.section === "brainwave"
        ? [
            article.meta.topic && article.meta.topic !== "General" ? article.meta.topic : "",
            ...modelNamesFor(article, ""),
            ...article.meta.tags,
          ]
        : [
            article.meta.category ?? "",
            sourceLabelFor(article, ""),
            ...article.meta.tags,
          ];

    for (const label of unique(displayKeywords)) {
      const normalized = normalizeKeyword(label);
      if (!normalized) continue;
      const current = counts.get(normalized) ?? { label, count: 0 };
      current.count += 1;
      counts.set(normalized, current);
    }
  }

  return Array.from(counts.values()).sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}
