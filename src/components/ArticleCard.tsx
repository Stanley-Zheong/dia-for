import Link from "next/link";

import { articleHref, sectionHref, sectionName } from "@/lib/routes";
import { slugify } from "@/lib/slug";
import type { ArticleRecord } from "@/lib/types";
import type { Locale } from "@/lib/i18n";
import { defaultLocale, localizeArticle, t, withLocale } from "@/lib/i18n";

type ArticleCardProps = {
  article: ArticleRecord;
  locale?: Locale;
};

function excerptFor(article: ArticleRecord) {
  return (
    article.meta.summary ??
    article.messages[0]?.content.replace(/\s+/g, " ").slice(0, 150) ??
    article.rawMarkdown.replace(/\s+/g, " ").slice(0, 150)
  );
}

export function ArticleCard({ article, locale = defaultLocale }: ArticleCardProps) {
  const display = localizeArticle(article, locale);
  return (
    <article className="post-card article-row">
      <div className="post-meta">
        <Link prefetch={false} href={sectionHref(display.meta.section, locale)}>
          {sectionName(display.meta.section, locale)}
        </Link>{" "}
        · {display.meta.category} · {display.meta.created ?? t(locale, "未标注日期", "Undated")} ·{" "}
        {display.meta.source_name ?? display.meta.source ?? t(locale, "站内文章", "Site article")}
      </div>
      <Link prefetch={false} href={articleHref(display, locale)}>
        <h2 className="post-title">{display.meta.title}</h2>
      </Link>
      <p className="post-summary">{excerptFor(display)}</p>
      <div className="tag-row">
        {display.meta.tags.map((tag) => (
          <Link prefetch={false} key={tag} href={withLocale(`/tags/${slugify(tag)}`, locale)} className="tag">
            {tag}
          </Link>
        ))}
        {display.meta.score !== undefined ? (
          <span className="tag">
            {display.meta.score} {t(locale, "分", "pts")}
          </span>
        ) : null}
      </div>
    </article>
  );
}
