import clsx from "clsx";

import { MarkdownContent } from "@/components/MarkdownContent";
import type { ChatMessage as ChatMessageType } from "@/lib/types";

type ChatMessageProps = {
  message: ChatMessageType;
};

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={clsx("flex w-full", isUser ? "justify-end" : "justify-start")}
      data-chat-turn-role={message.role}
      data-chat-turn-align={isUser ? "right" : "left"}
    >
      <article
        className={clsx(
          "max-w-[82%] rounded-[1.6rem] border p-5 shadow-sm",
          isUser
            ? "border-blue-100 bg-blue-50/90"
            : "border-slate-200 bg-white/95",
        )}
      >
        <div
          className={clsx(
            "mb-3 flex items-center gap-3",
            isUser ? "justify-end text-right" : "justify-start",
          )}
        >
          {!isUser ? (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#34a853] text-sm font-semibold text-white">
              {message.speaker.slice(0, 1).toUpperCase()}
            </div>
          ) : null}
          <div>
            <div className="text-sm font-semibold text-slate-900">{message.speaker}</div>
            <div className="text-xs text-slate-500">
              {isUser ? "提问" : message.role === "assistant" ? "模型回复" : "原始片段"}
            </div>
          </div>
          {isUser ? (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#4285f4] text-sm font-semibold text-white">
              {message.speaker.slice(0, 1).toUpperCase()}
            </div>
          ) : null}
        </div>
        <MarkdownContent content={message.content} />
      </article>
    </div>
  );
}
