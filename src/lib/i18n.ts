import { parseMessages } from "@/lib/content";
import type { ArticleRecord, ChatRecordMeta } from "@/lib/types";

export type Locale = "zh" | "en";

export const locales: Locale[] = ["zh", "en"];
export const defaultLocale: Locale = "zh";

export function isLocale(value: string | undefined): value is Locale {
  return value === "zh" || value === "en";
}

export function localePrefix(locale: Locale = defaultLocale) {
  return `/${locale}`;
}

export function withLocale(path: string, locale: Locale = defaultLocale) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${localePrefix(locale)}${normalized === "/" ? "" : normalized}`;
}

export function t(locale: Locale, zh: string, en: string) {
  return locale === "en" ? en : zh;
}

function localizedTags(meta: ChatRecordMeta, locale: Locale) {
  if (locale === "en" && meta.tags_en?.length) return meta.tags_en;
  if (locale === "zh" && meta.tags_zh?.length) return meta.tags_zh;
  return meta.tags;
}

export function localizedMarkdown(markdown: string, locale: Locale) {
  const pattern = new RegExp(`<!--\\s*lang:${locale}\\s*-->([\\s\\S]*?)<!--\\s*/lang:${locale}\\s*-->`, "i");
  const match = markdown.match(pattern);
  if (match?.[1]?.trim()) {
    return match[1].trim();
  }

  return markdown
    .replace(/<!--\s*\/?lang:[a-z-]+\s*-->/gi, "")
    .trim();
}

export function localizeArticle<T extends ArticleRecord>(article: T, locale: Locale): T {
  const rawMarkdown = localizedMarkdown(article.rawMarkdown, locale);
  const parsed = parseMessages(rawMarkdown);
  return {
    ...article,
    rawMarkdown,
    messages: parsed.messages,
    parseStatus: parsed.parseStatus,
    meta: {
      ...article.meta,
      title: locale === "en" && article.meta.title_en ? article.meta.title_en : article.meta.title,
      summary:
        locale === "en" && article.meta.summary_en
          ? article.meta.summary_en
          : article.meta.summary,
      tags: localizedTags(article.meta, locale),
    },
  };
}

