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
    <AppShell
      aside={
        <div className="space-y-6">
          <div>
            <div className="mb-2 text-sm font-semibold text-slate-900">共同观点</div>
            <ul className="space-y-2 text-sm leading-6 text-slate-600">
              {comparison.consensus.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </div>
          <div>
            <div className="mb-2 text-sm font-semibold text-slate-900">差异</div>
            <ul className="space-y-2 text-sm leading-6 text-slate-600">
              {comparison.differences.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </div>
          <div>
            <div className="mb-2 text-sm font-semibold text-slate-900">模型观察</div>
            <ul className="space-y-2 text-sm leading-6 text-slate-600">
              {comparison.modelObservations.map((item) => (
                <li key={`${item.model}-${item.observation}`}>
                  <strong>{item.model}</strong>：{item.observation}
                </li>
              ))}
            </ul>
          </div>
        </div>
      }
    >
      <section className="rounded-[2rem] border border-slate-200 bg-white/75 p-6 shadow-sm">
        <p className="mb-2 text-sm font-semibold text-green-600">Topic</p>
        <h1 className="mb-3 text-4xl font-bold tracking-tight text-slate-950">{topic.name}</h1>
        <p className="mb-8 text-slate-600">
          {topic.chats.length} 篇公开记录，涉及 {topic.models.join("、")}。
        </p>
        <div className="space-y-4">
          {topic.chats.map((chat) => (
            <ChatCard key={chat.slug} chat={chat} />
          ))}
        </div>
      </section>
    </AppShell>
  );
}
