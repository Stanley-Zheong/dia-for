import { notFound } from "next/navigation";

import { AppShell } from "@/components/AppShell";
import { ArticleCard } from "@/components/ArticleCard";
import { getTagBySlug, getTags } from "@/lib/content";

type TagPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const tags = await getTags();
  return tags.map((tag) => ({ slug: tag.slug }));
}

export default async function TagPage({ params }: TagPageProps) {
  const { slug } = await params;
  const tag = await getTagBySlug(slug);

  if (!tag) {
    notFound();
  }

  return (
    <AppShell active="tags">
      <div className="category-layout">
        <section>
          <p className="eyebrow">Tag</p>
          <h1 className="page-title">{tag.name}</h1>
          <p className="page-intro">{tag.chats.length} 篇公开文章。</p>
          <div className="stream">
          {tag.chats.map((article) => (
            <ArticleCard
              key={`${article.meta.section}-${article.slug}`}
              article={article}
            />
          ))}
          </div>
        </section>
        <aside className="panel">
          <h2>{tag.name}</h2>
          <p>这个标签下的内容来自多个栏目，适合从关键词反向进入文章网络。</p>
        </aside>
      </div>
    </AppShell>
  );
}
