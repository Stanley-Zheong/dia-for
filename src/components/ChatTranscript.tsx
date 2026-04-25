import { ChatMessage } from "@/components/ChatMessage";
import { MarkdownContent } from "@/components/MarkdownContent";
import type { ChatRecord } from "@/lib/types";

type ChatTranscriptProps = {
  chat: ChatRecord;
};

export function ChatTranscript({ chat }: ChatTranscriptProps) {
  if (chat.messages.length === 0) {
    return (
      <section className="rounded-3xl border border-amber-200 bg-amber-50/80 p-5">
        <p className="mb-3 text-sm font-medium text-amber-800">
          这篇记录没有识别出标准角色标题，已按原始 Markdown 渲染。
        </p>
        <MarkdownContent content={chat.rawMarkdown} />
      </section>
    );
  }

  return (
    <section className="space-y-5">
      {chat.parseStatus === "partial" ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          部分标题不是已知用户或模型角色，页面仍保留原文渲染。
        </div>
      ) : null}
      {chat.messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}
    </section>
  );
}
