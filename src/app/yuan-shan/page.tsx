import Link from "next/link";

import { AppShell } from "@/components/AppShell";
import { ArticleCard } from "@/components/ArticleCard";
import { KeywordFilter } from "@/components/KeywordFilter";
import { getArticlesBySection, getYuanShanCategories } from "@/lib/content";
import { keywordSummariesFor } from "@/lib/presentation";

export default async function YuanShanPage() {
  const [articles, categories] = await Promise.all([
    getArticlesBySection("yuan-shan"),
    getYuanShanCategories(),
  ]);
  const keywords = keywordSummariesFor(articles);

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

        <div className="category-layout" data-filter-scope="yuan-shan">
          <div>
            <section className="page-head" id="all">
              <p className="eyebrow">Distant Hills · RSS / Miniflux / industry intelligence</p>
              <h1 className="page-title">远山</h1>
              <p className="page-intro">
                全网数据自动化采集矩阵，构筑行业认知基座。
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
            <p>多种方式数据聚合引擎，随时获取全球动态。在这里，杂乱的生数据被清洗为结构化的行业数据矩阵，成为对抗信息噪声的防线与坚固的数据基座。</p>
            <KeywordFilter scope="yuan-shan" keywords={keywords} label="关键字：" />
          </aside>
        </div>
      </div>
    </AppShell>
  );
}
