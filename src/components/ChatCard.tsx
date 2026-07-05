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
    <article className="post-card article-row">
      <div className="post-meta">
        脑电波 · {chat.meta.topic} · {chat.meta.created ?? "未标注日期"} · {chat.messages.length} 轮
      </div>
      <Link prefetch={false} href={`/brainwave/${chat.slug}`}>
        <h2 className="post-title">{chat.meta.title}</h2>
      </Link>
      <p className="post-summary">{excerpt}</p>
      <MetaPills chat={chat} />
    </article>
  );
}
