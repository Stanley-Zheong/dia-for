import { ChatMessage } from "@/components/ChatMessage";
import { MarkdownContent } from "@/components/MarkdownContent";
import type { ChatRecord } from "@/lib/types";

type ChatTranscriptProps = {
  chat: ChatRecord;
};

export function ChatTranscript({ chat }: ChatTranscriptProps) {
  if (chat.messages.length === 0) {
    return (
      <section className="article-callout">
        <p>
          这篇记录没有识别出标准角色标题，已按原始 Markdown 渲染。
        </p>
        <MarkdownContent content={chat.rawMarkdown} />
      </section>
    );
  }

  return (
    <section className="chat-transcript">
      {chat.parseStatus === "partial" ? (
        <div className="article-callout">
          部分标题不是已知用户或模型角色，页面仍保留原文渲染。
        </div>
      ) : null}
      {chat.messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}
    </section>
  );
}
