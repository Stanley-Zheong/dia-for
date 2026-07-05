import { generateGeminiJson } from "@/lib/gemini";
import {
  buildSearchCorpus,
  retrieveRelevantSources,
  type SearchAnswer,
} from "@/lib/local-search";
import type { SearchSource } from "@/lib/types";

export { buildSearchCorpus, retrieveRelevantSources, type SearchAnswer };

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
  "sources": [{"chatSlug": "slug", "section": "brainwave|yuan-shan|xiao-ju-deng", "title": "标题", "topic": "话题", "excerpt": "引用片段"}]
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
