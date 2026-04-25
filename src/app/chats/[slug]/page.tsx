import { notFound } from "next/navigation";

import { AppShell } from "@/components/AppShell";
import { ChatTranscript } from "@/components/ChatTranscript";
import { MetaPills } from "@/components/MetaPills";
import { getAllChats, getChatBySlug } from "@/lib/content";
import { getChatInsights } from "@/lib/insights";

type ChatPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const chats = await getAllChats();
  return chats.map((chat) => ({ slug: chat.slug }));
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { slug } = await params;
  const chat = await getChatBySlug(slug);

  if (!chat) {
    notFound();
  }

  const insights = await getChatInsights(chat);

  return (
    <AppShell
      aside={
        <div className="space-y-6">
          <div>
            <div className="mb-2 text-sm font-semibold text-slate-900">摘要</div>
            <p className="text-sm leading-6 text-slate-600">{insights.summary}</p>
          </div>
          <div>
            <div className="mb-2 text-sm font-semibold text-slate-900">关键观点</div>
            <ul className="space-y-2 text-sm leading-6 text-slate-600">
              {insights.viewpoints.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </div>
          <div>
            <div className="mb-2 text-sm font-semibold text-slate-900">结论</div>
            <ul className="space-y-2 text-sm leading-6 text-slate-600">
              {insights.conclusions.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </div>
        </div>
      }
    >
      <article className="rounded-[2rem] border border-slate-200 bg-white/75 p-6 shadow-sm">
        <header className="mb-8">
          <p className="mb-2 text-sm text-slate-500">
            {chat.meta.created ?? "未标注日期"} · {chat.meta.source ?? "Obsidian"}
          </p>
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-slate-950">
            {chat.meta.title}
          </h1>
          <MetaPills chat={chat} />
        </header>
        <ChatTranscript chat={chat} />
      </article>
    </AppShell>
  );
}
