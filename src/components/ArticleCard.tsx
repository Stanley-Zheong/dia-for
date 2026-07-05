import Link from "next/link";

import { articleHref, sectionHref, sectionName } from "@/lib/routes";
import { slugify } from "@/lib/slug";
import type { ArticleRecord } from "@/lib/types";

type ArticleCardProps = {
  article: ArticleRecord;
};

function excerptFor(article: ArticleRecord) {
  return (
    article.meta.summary ??
    article.messages[0]?.content.replace(/\s+/g, " ").slice(0, 150) ??
    article.rawMarkdown.replace(/\s+/g, " ").slice(0, 150)
  );
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <article className="post-card article-row">
      <div className="post-meta">
        <Link prefetch={false} href={sectionHref(article.meta.section)}>
          {sectionName(article.meta.section)}
        </Link>{" "}
        · {article.meta.category} · {article.meta.created ?? "未标注日期"} ·{" "}
        {article.meta.source_name ?? article.meta.source ?? "站内文章"}
      </div>
      <Link prefetch={false} href={articleHref(article)}>
        <h2 className="post-title">{article.meta.title}</h2>
      </Link>
      <p className="post-summary">{excerptFor(article)}</p>
      <div className="tag-row">
        {article.meta.tags.map((tag) => (
          <Link prefetch={false} key={tag} href={`/tags/${slugify(tag)}`} className="tag">
            {tag}
          </Link>
        ))}
        {article.meta.score !== undefined ? (
          <span className="tag">
            {article.meta.score} 分
          </span>
        ) : null}
      </div>
    </article>
  );
}
