import clsx from "clsx";

import { MarkdownContent } from "@/components/MarkdownContent";
import type { ChatMessage as ChatMessageType } from "@/lib/types";

type ChatMessageProps = {
  message: ChatMessageType;
};

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <article
      className={clsx(
        "rounded-3xl border p-5 shadow-sm",
        isUser
          ? "border-blue-100 bg-blue-50/80"
          : "border-slate-200 bg-white/90",
      )}
    >
      <div className="mb-3 flex items-center gap-3">
        <div
          className={clsx(
            "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold text-white",
            isUser ? "bg-[#4285f4]" : "bg-[#34a853]",
          )}
        >
          {message.speaker.slice(0, 1).toUpperCase()}
        </div>
        <div>
          <div className="text-sm font-semibold text-slate-900">{message.speaker}</div>
          <div className="text-xs text-slate-500">
            {isUser ? "提问" : message.role === "assistant" ? "模型回复" : "原始片段"}
          </div>
        </div>
      </div>
      <MarkdownContent content={message.content} />
    </article>
  );
}
