import Link from "next/link";

import { ArticleIllustration } from "@/components/ArticleIllustration";
import { MarkdownContent } from "@/components/MarkdownContent";
import { articleHref, sectionHref, sectionName } from "@/lib/routes";
import type { ArticleRecord } from "@/lib/types";
import type { Locale } from "@/lib/i18n";
import { defaultLocale, localizeArticle, t, withLocale } from "@/lib/i18n";

type ArticleDetailProps = {
  article: ArticleRecord;
  related?: ArticleRecord[];
  locale?: Locale;
};

export function ArticleDetail({ article, related = [], locale = defaultLocale }: ArticleDetailProps) {
  const display = localizeArticle(article, locale);
  const localizedRelated = related.map((item) => localizeArticle(item, locale));
  const sourceUrl = display.meta.canonical_url ?? display.meta.source_url ?? display.meta.source;

  return (
    <div className="content-grid with-tips">
      <aside className="sidebar article-nav" aria-label="Article navigation">
        <div className="sidebar-label">{sectionName(display.meta.section, locale)}</div>
        <nav className="sidebar-nav">
          <Link prefetch={false} href={sectionHref(display.meta.section, locale)}>{t(locale, "栏目首页", "Section home")}</Link>
          <Link prefetch={false} href={withLocale("/topics", locale)}>{t(locale, "话题", "Topics")}</Link>
          <Link prefetch={false} href={withLocale("/tags", locale)}>{t(locale, "标签", "Tags")}</Link>
        </nav>
        {localizedRelated.length > 0 ? (
          <div className="quick-posts">
            <p className="caption">{t(locale, "同栏阅读", "Related")}</p>
            {localizedRelated.slice(0, 4).map((item) => (
              <Link prefetch={false} key={`${item.meta.section}-${item.slug}`} href={articleHref(item, locale)}>
                {item.meta.title}
              </Link>
            ))}
          </div>
        ) : null}
      </aside>

      <article className="article-body">
        <div className="article-meta">
          {t(locale, "首页", "Home")} / {sectionName(display.meta.section, locale)} / {display.meta.category} ·{" "}
          {display.meta.created ?? t(locale, "未标注日期", "Undated")} ·{" "}
          {display.meta.source_name ?? display.meta.source ?? t(locale, "站内文章", "Site article")}
        </div>
        <h1 className="article-title">{display.meta.title}</h1>
        {display.meta.summary ? <p className="article-lead">{display.meta.summary}</p> : null}
        <ArticleIllustration article={display} />
        <MarkdownContent content={display.rawMarkdown} />
        <div className="source-note">
          {t(locale, "来源", "Source")}：{display.meta.source_name ?? display.meta.source ?? t(locale, "站内文章", "Site article")}
          {sourceUrl ? (
            <>
              {" · "}
              <a href={sourceUrl} target="_blank" rel="noopener noreferrer">
                {t(locale, "查看原始来源", "View original source")}
              </a>
            </>
          ) : null}
        </div>
      </article>

      <aside className="tips-panel" aria-label="Article tips">
        <h2 className="tips-title">{t(locale, "关联 Tips", "Related Tips")}</h2>
        <button className="tip-button" type="button" aria-expanded="true">
          {t(locale, "这篇文章属于", "This article belongs to")} {sectionName(display.meta.section, locale)}
        </button>
        <div className="tip-related open">
          <Link prefetch={false} className="related-card" href={sectionHref(display.meta.section, locale)}>
            <strong>{sectionName(display.meta.section, locale)}</strong>
            {display.meta.category} · {display.meta.tags.join(" / ") || t(locale, "未标注标签", "No tags")}
            <span>{display.meta.created ?? t(locale, "未标注日期", "Undated")}</span>
          </Link>
        </div>
        {localizedRelated.length > 0 ? (
          <>
            <button className="tip-button" type="button" aria-expanded="true">
              {t(locale, "同栏相关文章", "Related Articles")}
            </button>
            <div className="tip-related open">
              {localizedRelated.slice(0, 3).map((item) => (
                <Link
                  prefetch={false}
                  key={`${item.meta.section}-${item.slug}`}
                  className="related-card"
                  href={articleHref(item, locale)}
                >
                  <strong>{item.meta.title}</strong>
                  {item.meta.summary ?? item.rawMarkdown.replace(/\s+/g, " ").slice(0, 90)}
                  <span>{item.meta.created ?? t(locale, "未标注日期", "Undated")}</span>
                </Link>
              ))}
            </div>
          </>
        ) : null}
        {display.meta.score !== undefined ? (
          <div className="panel compact-panel">
            <h3>{t(locale, "评分", "Scores")}</h3>
            <div className="stat-list">
              <div className="stat"><strong>{display.meta.score}</strong><span className="caption">{t(locale, "综合分", "Overall")}</span></div>
              <div className="stat"><strong>{display.meta.confidence_score ?? "-"}</strong><span className="caption">{t(locale, "置信度", "Confidence")}</span></div>
            </div>
          </div>
        ) : null}
      </aside>
    </div>
  );
}
