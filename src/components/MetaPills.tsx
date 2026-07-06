import Link from "next/link";

import { slugify } from "@/lib/slug";
import type { ChatRecord } from "@/lib/types";
import type { Locale } from "@/lib/i18n";
import { defaultLocale, withLocale } from "@/lib/i18n";

type MetaPillsProps = {
  chat: ChatRecord;
  locale?: Locale;
};

export function MetaPills({ chat, locale = defaultLocale }: MetaPillsProps) {
  return (
    <div className="tag-row">
      <Link prefetch={false}
        href={withLocale(`/topics/${slugify(chat.meta.topic)}`, locale)}
        className="tag"
      >
        {chat.meta.topic}
      </Link>
      {chat.meta.models.map((model) => (
        <Link prefetch={false}
          key={model}
          href={withLocale(`/models/${slugify(model)}`, locale)}
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
