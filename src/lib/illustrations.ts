import type { ArticleRecord } from "@/lib/types";

const generatedIllustrationBase = "/assets/generated-illustrations";
const unsafeFilePartPattern = /[^a-z0-9-]+/g;

function safeFilePart(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(unsafeFilePartPattern, "-")
    .replace(/^-+|-+$/g, "") || "untitled";
}

export function illustrationFileName(article: ArticleRecord) {
  return `${safeFilePart(article.meta.section)}-${safeFilePart(article.slug)}.svg`;
}

export function illustrationForArticle(article: ArticleRecord) {
  return {
    src: `${generatedIllustrationBase}/${illustrationFileName(article)}`,
    alt: `自然风景配图：${article.meta.title}`,
  };
}
