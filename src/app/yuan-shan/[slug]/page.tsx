import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { AppShell } from "@/components/AppShell";
import { ArticleCard } from "@/components/ArticleCard";
import { ArticleDetail } from "@/components/ArticleDetail";
import {
  getArticleBySectionSlug,
  getArticlesBySection,
  getYuanShanCategoryBySlug,
  getYuanShanCategories,
} from "@/lib/content";

type YuanShanPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const [articles, categories] = await Promise.all([
    getArticlesBySection("yuan-shan"),
    getYuanShanCategories(),
  ]);

  return [
    ...articles.map((article) => ({ slug: article.slug })),
    ...categories.map((category) => ({ slug: category.slug })),
  ];
}

export default async function YuanShanDetailOrCategoryPage({ params }: YuanShanPageProps) {
  const { slug } = await params;
  const category = await getYuanShanCategoryBySlug(slug);

  if (category) {
    return (
      <AppShell active="yuan-shan">
        <div className="content-grid">
          <aside className="sidebar" aria-label="Yuan Shan categories">
            <div className="sidebar-label">Distant Hills</div>
            <nav className="sidebar-nav">
              <Link prefetch={false} href="/yuan-shan">全部</Link>
              <Link prefetch={false} className="active" href={`/yuan-shan/${category.slug}`}>
                {category.name}
              </Link>
            </nav>
          </aside>
          <div className="category-layout">
            <div>
              <section className="page-head">
                <p className="eyebrow">Distant Hills · {category.name}</p>
                <h1 className="page-title">远山 · {category.name}</h1>
                <p className="page-intro">{category.articles.length} 篇累计资讯。</p>
              </section>
              <section className="stream">
                {category.articles.map((article) => (
                  <ArticleCard key={article.slug} article={article} />
                ))}
              </section>
            </div>
            <aside className="panel">
              <h2>{category.name}</h2>
              <p>该分类收纳已确认可发布的远山情报，内容以累计文章页形式保留。</p>
            </aside>
          </div>
        </div>
      </AppShell>
    );
  }

  const article = await getArticleBySectionSlug("yuan-shan", slug);
  if (!article) {
    notFound();
  }
  if (slug !== article.slug) {
    redirect(`/yuan-shan/${article.slug}`);
  }

  const related = (await getArticlesBySection("yuan-shan")).filter(
    (item) => item.slug !== article.slug && item.meta.category === article.meta.category,
  );

  return (
    <AppShell active="yuan-shan">
      <ArticleDetail article={article} related={related} />
    </AppShell>
  );
}
