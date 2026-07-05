import Link from "next/link";

import { slugify } from "@/lib/slug";
import type { ChatRecord } from "@/lib/types";

type MetaPillsProps = {
  chat: ChatRecord;
};

export function MetaPills({ chat }: MetaPillsProps) {
  return (
    <div className="tag-row">
      <Link prefetch={false}
        href={`/topics/${slugify(chat.meta.topic)}`}
        className="tag"
      >
        {chat.meta.topic}
      </Link>
      {chat.meta.models.map((model) => (
        <Link prefetch={false}
          key={model}
          href={`/models/${slugify(model)}`}
          className="tag"
        >
          {model}
        </Link>
      ))}
      {chat.meta.tags.map((tag) => (
        <span key={tag} className="tag">
          #{tag}
        </span>
      ))}
    </div>
  );
}
