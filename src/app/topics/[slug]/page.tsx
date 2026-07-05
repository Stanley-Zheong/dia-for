import { notFound } from "next/navigation";

import { AppShell } from "@/components/AppShell";
import { ChatCard } from "@/components/ChatCard";
import { getTopicComparison } from "@/lib/insights";
import { getTopicBySlug, getTopics } from "@/lib/content";

type TopicPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const topics = await getTopics();
  return topics.map((topic) => ({ slug: topic.slug }));
}

export default async function TopicPage({ params }: TopicPageProps) {
  const { slug } = await params;
  const topic = await getTopicBySlug(slug);

  if (!topic) {
    notFound();
  }

  const comparison = await getTopicComparison(topic);

  return (
    <AppShell active="topics">
      <div className="topic-layout">
        <section>
          <p className="eyebrow">Topic</p>
          <h1 className="page-title">{topic.name}</h1>
          <p className="page-intro">
            {topic.chats.length} 篇公开记录，涉及 {topic.models.join("、")}。
          </p>
          <div className="stream">
            {topic.chats.map((chat) => (
              <ChatCard key={chat.slug} chat={chat} />
            ))}
          </div>
        </section>
        <aside className="panel">
          <h2>共同观点</h2>
          <ul>
            {comparison.consensus.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <h2>差异</h2>
          <ul>
            {comparison.differences.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <h2>模型观察</h2>
          <ul>
            {comparison.modelObservations.map((item) => (
              <li key={`${item.model}-${item.observation}`}>
                <strong>{item.model}</strong>：{item.observation}
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </AppShell>
  );
}
