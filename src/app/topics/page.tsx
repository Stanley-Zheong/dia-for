import Link from "next/link";

import { AppShell } from "@/components/AppShell";
import { getTopics } from "@/lib/content";

export default async function TopicsPage() {
  const topics = await getTopics();

  return (
    <AppShell>
      <section className="rounded-[2rem] border border-slate-200 bg-white/75 p-6 shadow-sm">
        <h1 className="mb-6 text-4xl font-bold tracking-tight text-slate-950">话题</h1>
        <div className="grid gap-4 md:grid-cols-2">
          {topics.map((topic) => (
            <Link
              key={topic.slug}
              href={`/topics/${topic.slug}`}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md"
            >
              <div className="text-lg font-semibold text-slate-950">{topic.name}</div>
              <p className="mt-2 text-sm text-slate-500">
                {topic.chats.length} 篇记录 · {topic.models.join("、")}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
