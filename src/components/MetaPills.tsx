import Link from "next/link";

import { slugify } from "@/lib/slug";
import type { ChatRecord } from "@/lib/types";

type MetaPillsProps = {
  chat: ChatRecord;
};

export function MetaPills({ chat }: MetaPillsProps) {
  return (
    <div className="flex flex-wrap gap-2 text-sm">
      <Link
        href={`/topics/${slugify(chat.meta.topic)}`}
        className="rounded-full bg-blue-100 px-3 py-1 text-blue-700"
      >
        {chat.meta.topic}
      </Link>
      {chat.meta.models.map((model) => (
        <Link
          key={model}
          href={`/models/${slugify(model)}`}
          className="rounded-full bg-green-100 px-3 py-1 text-green-700"
        >
          {model}
        </Link>
      ))}
      {chat.meta.tags.map((tag) => (
        <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">
          #{tag}
        </span>
      ))}
    </div>
  );
}
