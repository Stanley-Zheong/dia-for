import type { ArticleRecord, ContentSection } from "@/lib/types";

export function sectionHref(section: ContentSection) {
  if (section === "brainwave") return "/brainwave";
  if (section === "yuan-shan") return "/yuan-shan";
  return "/xiao-ju-deng";
}

export function articleHref(article: Pick<ArticleRecord, "slug" | "meta">) {
  return `${sectionHref(article.meta.section)}/${article.slug}`;
}

export function sectionName(section: ContentSection) {
  if (section === "brainwave") return "脑电波";
  if (section === "yuan-shan") return "远山";
  return "小桔灯";
}
