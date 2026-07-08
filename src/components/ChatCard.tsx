import Link from "next/link";

import { MetaPills } from "@/components/MetaPills";
import type { ChatRecord } from "@/lib/types";
import type { Locale } from "@/lib/i18n";
import { defaultLocale, localizeArticle, t } from "@/lib/i18n";
import { cardKeywordsFor, formatPublicDate, modelNamesFor, primaryKeywordFor } from "@/lib/presentation";
import { articleHref } from "@/lib/routes";

type ChatCardProps = {
  chat: ChatRecord;
  locale?: Locale;
};

export function ChatCard({ chat, locale = defaultLocale }: ChatCardProps) {
  const display = localizeArticle(chat, locale);
  const models = modelNamesFor(display, t(locale, "未标注模型", "Unlabeled model")).join(" / ");
  const date = formatPublicDate(display.meta.created, t(locale, "未标注日期", "Undated"));
  const excerpt =
    display.messages[0]?.content.replace(/\s+/g, " ").slice(0, 140) ??
    display.rawMarkdown.replace(/\s+/g, " ").slice(0, 140);

  return (
    <article className="post-card article-row" data-filter-item="true" data-filter-keywords={cardKeywordsFor(display).join("|")}>
      <div className="post-meta">
        {primaryKeywordFor(display)} · {models} · {date}
      </div>
      <Link prefetch={false} href={articleHref(display, locale)}>
        <h2 className="post-title">{display.meta.title}</h2>
      </Link>
      <p className="post-summary">{excerpt}</p>
      <MetaPills chat={display} locale={locale} />
    </article>
  );
}
