import { AppShell } from "@/components/AppShell";
import { ChatCard } from "@/components/ChatCard";
import { getAllChats } from "@/lib/content";

export default async function HomePage() {
  const chats = await getAllChats();

  return (
    <AppShell>
      <section className="rounded-[2rem] border border-slate-200 bg-white/75 p-6 shadow-sm">
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold text-blue-600">Public AI Chat Archive</p>
          <h1 className="text-4xl font-bold tracking-tight text-slate-950">
            公开记录你与大模型的多轮对话
          </h1>
          <p className="mt-4 max-w-2xl text-slate-600">
            从 Obsidian 发布 Markdown，按话题、模型和时间浏览，并用 Gemini 做搜索、总结和观点对比。
          </p>
        </div>
        <div className="space-y-4">
          {chats.map((chat) => (
            <ChatCard key={chat.slug} chat={chat} />
          ))}
        </div>
      </section>
    </AppShell>
  );
}
