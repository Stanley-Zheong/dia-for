import type { ArticleRecord, ContentSection } from "@/lib/types";
import type { Locale } from "@/lib/i18n";
import { defaultLocale, withLocale } from "@/lib/i18n";

export function sectionHref(section: ContentSection, locale: Locale = defaultLocale) {
  const path = section === "brainwave" ? "/brainwave" : section === "yuan-shan" ? "/yuan-shan" : "/xiao-ju-deng";
  return withLocale(path, locale);
}

export function articleHref(article: Pick<ArticleRecord, "slug" | "meta">, locale: Locale = defaultLocale) {
  return `${sectionHref(article.meta.section, locale)}/${article.slug}`;
}

export function sectionName(section: ContentSection, locale: Locale = defaultLocale) {
  if (section === "brainwave") return locale === "en" ? "Brainwave" : "脑电波";
  if (section === "yuan-shan") return locale === "en" ? "Distant Hills" : "远山";
  return locale === "en" ? "Little Lantern" : "小桔灯";
}
