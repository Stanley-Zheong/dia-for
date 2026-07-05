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
      className={clsx("chat-turn", isUser ? "chat-turn-user" : "chat-turn-assistant")}
      data-chat-turn-role={message.role}
      data-chat-turn-align={isUser ? "right" : "left"}
    >
      <article
        className={clsx("chat-bubble", isUser ? "chat-bubble-user" : "chat-bubble-assistant")}
      >
        <div
          className={clsx("chat-speaker", isUser ? "chat-speaker-user" : "chat-speaker-assistant")}
        >
          {!isUser ? (
            <div className="chat-avatar">
              {message.speaker.slice(0, 1).toUpperCase()}
            </div>
          ) : null}
          <div>
            <div className="chat-speaker-name">{message.speaker}</div>
            <div className="caption">
              {isUser ? "提问" : message.role === "assistant" ? "模型回复" : "原始片段"}
            </div>
          </div>
          {isUser ? (
            <div className="chat-avatar">
              {message.speaker.slice(0, 1).toUpperCase()}
            </div>
          ) : null}
        </div>
        <MarkdownContent content={message.content} />
      </article>
    </div>
  );
}
