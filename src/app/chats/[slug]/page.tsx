import { notFound, redirect } from "next/navigation";

import { AppShell } from "@/components/AppShell";
import { ChatTranscript } from "@/components/ChatTranscript";
import { MarkdownContent } from "@/components/MarkdownContent";
import { MetaPills } from "@/components/MetaPills";
import { getAllChats, getChatBySlug } from "@/lib/content";

type ChatPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const chats = await getAllChats();
  return chats.map((chat) => ({ slug: chat.slug }));
}

function InsightsPanel({ insights }: { insights?: string }) {
  if (!insights) {
    return (
      <div className="space-y-4">
        <div className="text-sm font-semibold text-slate-900">价值提炼</div>
        <p className="text-sm leading-6 text-slate-500">
          暂无价值提炼
        </p>
        <p className="text-xs leading-5 text-slate-400">
          这篇对话记录保留了原始内容，欢迎在 Obsidian 中补充你的思考。
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-sm font-semibold text-slate-900">价值提炼</div>
      <div className="prose prose-sm prose-slate max-w-none">
        <MarkdownContent content={insights} />
      </div>
    </div>
  );
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { slug } = await params;
  const chat = await getChatBySlug(slug);

  if (!chat) {
    notFound();
  }

  if (slug !== chat.slug) {
    redirect(`/chats/${chat.slug}`);
  }

  return (
    <AppShell aside={<InsightsPanel insights={chat.meta.insights} />}>
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
