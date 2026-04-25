import Link from "next/link";

import { MetaPills } from "@/components/MetaPills";
import type { ChatRecord } from "@/lib/types";

type ChatCardProps = {
  chat: ChatRecord;
};

export function ChatCard({ chat }: ChatCardProps) {
  const excerpt =
    chat.messages[0]?.content.replace(/\s+/g, " ").slice(0, 140) ??
    chat.rawMarkdown.replace(/\s+/g, " ").slice(0, 140);

  return (
    <article className="rounded-3xl border border-slate-200 bg-white/85 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="mb-3 flex items-start justify-between gap-4">
        <div>
          <Link href={`/chats/${chat.slug}`} className="text-lg font-semibold text-slate-950">
            {chat.meta.title}
          </Link>
          <p className="mt-1 text-sm text-slate-500">
            {chat.meta.created ?? "未标注日期"} · {chat.meta.source ?? "Obsidian"}
          </p>
        </div>
        <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">
          {chat.messages.length} 轮
        </span>
      </div>
      <p className="mb-4 text-sm leading-6 text-slate-600">{excerpt}</p>
      <MetaPills chat={chat} />
    </article>
  );
}
