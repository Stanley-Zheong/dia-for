import Link from "next/link";

import { AppShell } from "@/components/AppShell";
import { getTags } from "@/lib/content";

export default async function TagsPage() {
  const tags = await getTags();

  return (
    <AppShell active="tags">
      <div className="topic-layout">
        <section>
          <p className="eyebrow">Tags</p>
          <h1 className="page-title">标签</h1>
          {tags.length === 0 ? (
            <p className="page-intro">暂无标签。</p>
          ) : (
            <div className="keyword-cloud">
              {tags.map((tag) => (
                <Link
                  prefetch={false}
                  key={tag.slug}
                  href={`/tags/${tag.slug}`}
                  className="keyword"
                >
                  {tag.name} <span>{tag.chats.length}</span>
                </Link>
              ))}
            </div>
          )}
        </section>
        <aside className="panel">
          <h2>标签网络</h2>
          <p>标签连接脑电波、远山和小桔灯，不同栏目可以通过同一个关键词互相穿透。</p>
        </aside>
      </div>
    </AppShell>
  );
}
