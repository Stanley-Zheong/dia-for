import { ChatMessage } from "@/components/ChatMessage";
import { MarkdownContent } from "@/components/MarkdownContent";
import type { ChatRecord } from "@/lib/types";
import type { Locale } from "@/lib/i18n";
import { defaultLocale, t } from "@/lib/i18n";

type ChatTranscriptProps = {
  chat: ChatRecord;
  locale?: Locale;
};

export function ChatTranscript({ chat, locale = defaultLocale }: ChatTranscriptProps) {
  if (chat.messages.length === 0) {
    return (
      <section className="article-callout">
        <p>
          {t(locale, "这篇记录没有识别出标准角色标题，已按原始 Markdown 渲染。", "This note has no standard speaker headings, so the original Markdown is rendered.")}
        </p>
        <MarkdownContent content={chat.rawMarkdown} />
      </section>
    );
  }

  return (
    <section className="chat-transcript">
      {chat.parseStatus === "partial" ? (
        <div className="article-callout">
          {t(locale, "部分标题不是已知用户或模型角色，页面仍保留原文渲染。", "Some headings are not recognized speakers; the page keeps the original rendering.")}
        </div>
      ) : null}
      {chat.messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}
    </section>
  );
}
