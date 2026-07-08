import Link from "next/link";

import { articleHref, sectionHref, sectionName } from "@/lib/routes";
import { cardKeywordsFor, formatPublicDate, sourceLabelFor } from "@/lib/presentation";
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
  const date = formatPublicDate(display.meta.created, t(locale, "未标注日期", "Undated"));
  const sourceLabel = sourceLabelFor(display, t(locale, "站内文章", "Site article"));
  const meta =
    display.meta.section === "yuan-shan"
      ? `${sourceLabel}，${date}`
      : `${sectionName(display.meta.section, locale)} · ${display.meta.category} · ${date} · ${sourceLabel}`;

  return (
    <article className="post-card article-row" data-filter-item="true" data-filter-keywords={cardKeywordsFor(display).join("|")}>
      <div className="post-meta">
        {display.meta.section === "yuan-shan" ? meta : (
          <>
            <Link prefetch={false} href={sectionHref(display.meta.section, locale)}>
              {sectionName(display.meta.section, locale)}
            </Link>{" "}
            · {display.meta.category} · {date} · {sourceLabel}
          </>
        )}
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
