import Link from "next/link";

import { AppShell } from "@/components/AppShell";
import { getTopics } from "@/lib/content";

export default async function TopicsPage() {
  const topics = await getTopics();

  return (
    <AppShell active="topics">
      <div className="topic-layout">
        <section>
          <p className="eyebrow">Topics</p>
          <h1 className="page-title">话题</h1>
          <div className="topic-cloud">
          {topics.map((topic) => (
            <Link prefetch={false}
              key={topic.slug}
              href={`/topics/${topic.slug}`}
              className="topic-pill"
            >
              {topic.name} · {topic.chats.length}
            </Link>
          ))}
          </div>
        </section>
        <aside className="panel">
          <h2>话题索引</h2>
          <p>话题页用于把多篇脑电波对话串联起来，适合比较模型观点和回看判断路径。</p>
        </aside>
      </div>
    </AppShell>
  );
}
