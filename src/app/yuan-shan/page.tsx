import Link from "next/link";

import { AppShell } from "@/components/AppShell";
import { ArticleCard } from "@/components/ArticleCard";
import { getArticlesBySection, getYuanShanCategories } from "@/lib/content";

export default async function YuanShanPage() {
  const [articles, categories] = await Promise.all([
    getArticlesBySection("yuan-shan"),
    getYuanShanCategories(),
  ]);

  return (
    <AppShell active="yuan-shan">
      <div className="content-grid">
        <aside className="sidebar" aria-label="Columns">
          <div className="sidebar-label">Distant Hills</div>
          <nav className="sidebar-nav">
            <a className="active" href="#all">全部</a>
            {categories.map((category) => (
              <a key={category.slug} href={`/yuan-shan/${category.slug}`}>
                {category.name}
              </a>
            ))}
          </nav>
        </aside>

        <div className="category-layout">
          <div>
            <section className="page-head" id="all">
              <p className="eyebrow">Distant Hills · RSS / Miniflux / industry intelligence</p>
              <h1 className="page-title">远山</h1>
              <p className="page-intro">
                来自 RSS、公众号、Miniflux 和 AI 评分管道的行业资讯，按 AI、数据、新能源、传统AI+、教育AI+ 累计归档。
              </p>
            </section>
            <div className="filter-bar" aria-label="Subcategory filters">
              <Link prefetch={false} className="filter active" href="/yuan-shan">全部</Link>
              {categories.map((category) => (
                <Link prefetch={false} className="filter" key={category.slug} href={`/yuan-shan/${category.slug}`}>
                  {category.name} · {category.articles.length}
                </Link>
              ))}
            </div>
            <section className="stream" aria-label="Column posts">
              {articles.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </section>
          </div>
          <aside className="panel">
            <h2>栏目结构</h2>
            <p>远山只承接经过筛选、摘要和人工确认的情报 Markdown；RSS 是信源增强方式，不直接变成站点内容。</p>
            <div className="taxonomy-grid">
              {categories.map((category) => (
                <span key={category.slug}>{category.name} · {category.articles.length}</span>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </AppShell>
  );
}
