import Link from "next/link";

import { MarkdownContent } from "@/components/MarkdownContent";
import { articleHref, sectionHref, sectionName } from "@/lib/routes";
import type { ArticleRecord } from "@/lib/types";

type ArticleDetailProps = {
  article: ArticleRecord;
  related?: ArticleRecord[];
};

export function ArticleDetail({ article, related = [] }: ArticleDetailProps) {
  const sourceUrl = article.meta.canonical_url ?? article.meta.source_url ?? article.meta.source;

  return (
    <div className="content-grid with-tips">
      <aside className="sidebar article-nav" aria-label="Article navigation">
        <div className="sidebar-label">{sectionName(article.meta.section)}</div>
        <nav className="sidebar-nav">
          <Link prefetch={false} href={sectionHref(article.meta.section)}>栏目首页</Link>
          <Link prefetch={false} href="/topics">话题</Link>
          <Link prefetch={false} href="/tags">标签</Link>
        </nav>
        {related.length > 0 ? (
          <div className="quick-posts">
            <p className="caption">同栏阅读</p>
            {related.slice(0, 4).map((item) => (
              <Link prefetch={false} key={`${item.meta.section}-${item.slug}`} href={articleHref(item)}>
                {item.meta.title}
              </Link>
            ))}
          </div>
        ) : null}
      </aside>

      <article className="article-body">
        <div className="article-meta">
          首页 / {sectionName(article.meta.section)} / {article.meta.category} ·{" "}
          {article.meta.created ?? "未标注日期"} ·{" "}
          {article.meta.source_name ?? article.meta.source ?? "站内文章"}
        </div>
        <h1 className="article-title">{article.meta.title}</h1>
        {article.meta.summary ? <p className="article-lead">{article.meta.summary}</p> : null}
        <MarkdownContent content={article.rawMarkdown} />
        <div className="source-note">
          来源：{article.meta.source_name ?? article.meta.source ?? "站内文章"}
          {sourceUrl ? (
            <>
              {" · "}
              <a href={sourceUrl} target="_blank" rel="noopener noreferrer">
                查看原始来源
              </a>
            </>
          ) : null}
        </div>
      </article>

      <aside className="tips-panel" aria-label="Article tips">
        <h2 className="tips-title">关联 Tips</h2>
        <button className="tip-button" type="button" aria-expanded="true">
          这篇文章属于 {sectionName(article.meta.section)}
        </button>
        <div className="tip-related open">
          <Link prefetch={false} className="related-card" href={sectionHref(article.meta.section)}>
            <strong>{sectionName(article.meta.section)}栏目</strong>
            {article.meta.category} · {article.meta.tags.join(" / ") || "未标注标签"}
            <span>{article.meta.created ?? "未标注日期"}</span>
          </Link>
        </div>
        {related.length > 0 ? (
          <>
            <button className="tip-button" type="button" aria-expanded="true">
              同栏相关文章
            </button>
            <div className="tip-related open">
              {related.slice(0, 3).map((item) => (
                <Link
                  prefetch={false}
                  key={`${item.meta.section}-${item.slug}`}
                  className="related-card"
                  href={articleHref(item)}
                >
                  <strong>{item.meta.title}</strong>
                  {item.meta.summary ?? item.rawMarkdown.replace(/\s+/g, " ").slice(0, 90)}
                  <span>{item.meta.created ?? "未标注日期"}</span>
                </Link>
              ))}
            </div>
          </>
        ) : null}
        {article.meta.score !== undefined ? (
          <div className="panel compact-panel">
            <h3>评分</h3>
            <div className="stat-list">
              <div className="stat"><strong>{article.meta.score}</strong><span className="caption">综合分</span></div>
              <div className="stat"><strong>{article.meta.confidence_score ?? "-"}</strong><span className="caption">置信度</span></div>
            </div>
          </div>
        ) : null}
      </aside>
    </div>
  );
}
