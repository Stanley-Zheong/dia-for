import { generateGeminiJson } from "@/lib/gemini";
import type { ChatRecord, SearchSource } from "@/lib/types";

export type SearchAnswer = {
  answer: string;
  sources: SearchSource[];
};

function normalize(value: string) {
  return value.toLowerCase();
}

function compact(value: string, maxLength = 420) {
  return value.replace(/\s+/g, " ").trim().slice(0, maxLength);
}

export function buildSearchCorpus(chats: ChatRecord[]): SearchSource[] {
  return chats.flatMap((chat) => {
    const messageSources = chat.messages.map((message) => ({
      chatSlug: chat.slug,
      title: chat.meta.title,
      topic: chat.meta.topic,
      excerpt: compact(`${message.speaker}: ${message.content}`),
    }));

    if (messageSources.length > 0) {
      return messageSources;
    }

    return [
      {
        chatSlug: chat.slug,
        title: chat.meta.title,
        topic: chat.meta.topic,
        excerpt: compact(chat.rawMarkdown),
      },
    ];
  });
}

export function retrieveRelevantSources(query: string, corpus: SearchSource[], limit = 6) {
  const terms = normalize(query)
    .split(/\s+/)
    .map((term) => term.trim())
    .filter(Boolean);

  return corpus
    .map((source) => {
      const haystack = normalize(
        `${source.title} ${source.topic} ${source.excerpt}`,
      );
      const score = terms.reduce(
        (total, term) => total + (haystack.includes(term) ? 2 : 0),
        0,
      );

      return { source, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ source }) => source);
}

export async function answerSearch(query: string, sources: SearchSource[]) {
  const fallback: SearchAnswer = {
    answer:
      sources.length > 0
        ? "已找到相关公开聊天记录。请查看下方来源以回到原始对话。"
        : "没有在已发布聊天记录中找到足够相关的内容。",
    sources,
  };

  if (sources.length === 0) {
    return fallback;
  }

  return generateGeminiJson<SearchAnswer>({
    fallback,
    prompt: `你是公开 AI 聊天记录站的搜索助手。请只基于给定公开片段回答用户问题，并只输出 JSON。
JSON schema:
{
  "answer": "中文回答。如果证据不足，明确说明没有足够依据。",
  "sources": [{"chatSlug": "slug", "title": "标题", "topic": "话题", "excerpt": "引用片段"}]
}

用户问题：${query}

公开片段：
${sources
  .map(
    (source, index) =>
      `[${index + 1}] slug=${source.chatSlug}\ntitle=${source.title}\ntopic=${source.topic}\nexcerpt=${source.excerpt}`,
  )
  .join("\n\n")}`,
  });
}
