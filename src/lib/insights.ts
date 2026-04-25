import { readJsonCache, writeJsonCache } from "@/lib/cache";
import { generateGeminiJson } from "@/lib/gemini";
import type { ChatInsights, ChatRecord, TopicComparison, TopicSummary } from "@/lib/types";

function compactText(value: string, maxLength = 5000) {
  return value.replace(/\s+/g, " ").trim().slice(0, maxLength);
}

function fallbackChatInsights(chat: ChatRecord): ChatInsights {
  const firstAssistant = chat.messages.find((message) => message.role === "assistant");

  return {
    summary: `${chat.meta.title} 围绕「${chat.meta.topic}」展开，包含 ${chat.meta.models.join("、")} 的多轮观点。`,
    viewpoints: chat.meta.models.length
      ? chat.meta.models.map((model) => `${model} 对该话题给出了可供引用的回答。`)
      : ["这篇记录保留了原始对话，可从正文继续提炼观点。"],
    conclusions: firstAssistant
      ? [compactText(firstAssistant.content, 120)]
      : ["当前记录需要更多结构化消息后才能提取结论。"],
    references: [
      {
        chatSlug: chat.slug,
        title: chat.meta.title,
        excerpt: compactText(chat.rawMarkdown, 160),
      },
    ],
  };
}

export async function getChatInsights(chat: ChatRecord): Promise<ChatInsights> {
  const cacheKey = `chat-${chat.slug}`;
  const cached = await readJsonCache<ChatInsights>(cacheKey);

  if (cached) {
    return cached;
  }

  const fallback = fallbackChatInsights(chat);
  const insights = await generateGeminiJson<ChatInsights>({
    fallback,
    prompt: `你是公开 AI 聊天记录站的编辑。请只基于给定内容输出 JSON，不要输出 Markdown。
JSON schema:
{
  "summary": "一句中文摘要",
  "viewpoints": ["观点1", "观点2"],
  "conclusions": ["结论1", "结论2"],
  "references": [{"chatSlug": "${chat.slug}", "title": "${chat.meta.title}", "excerpt": "引用片段"}]
}

聊天标题：${chat.meta.title}
话题：${chat.meta.topic}
模型：${chat.meta.models.join(", ")}
内容：
${compactText(chat.rawMarkdown)}`,
  });

  await writeJsonCache(cacheKey, insights);
  return insights;
}

function fallbackTopicComparison(topic: TopicSummary): TopicComparison {
  return {
    consensus: [
      `该话题下共有 ${topic.chats.length} 篇公开记录，核心内容都围绕「${topic.name}」。`,
    ],
    differences:
      topic.models.length > 1
        ? [`涉及 ${topic.models.join("、")}，适合继续比较不同模型的表达重点。`]
        : ["当前只有一个模型参与，暂时没有足够材料比较分歧。"],
    modelObservations: topic.models.map((model) => ({
      model,
      observation: `${model} 在该话题下有公开记录可供追溯。`,
    })),
    references: topic.chats.map((chat) => ({
      chatSlug: chat.slug,
      title: chat.meta.title,
      excerpt: compactText(chat.rawMarkdown, 120),
    })),
  };
}

export async function getTopicComparison(topic: TopicSummary): Promise<TopicComparison> {
  const cacheKey = `topic-${topic.slug}`;
  const cached = await readJsonCache<TopicComparison>(cacheKey);

  if (cached) {
    return cached;
  }

  const fallback = fallbackTopicComparison(topic);
  const corpus = topic.chats
    .map(
      (chat) =>
        `标题：${chat.meta.title}\n模型：${chat.meta.models.join(", ")}\n内容：${compactText(chat.rawMarkdown, 2200)}`,
    )
    .join("\n\n---\n\n");

  const comparison = await generateGeminiJson<TopicComparison>({
    fallback,
    prompt: `你是公开 AI 聊天记录站的研究助理。请比较同一话题下不同模型的观点，只输出 JSON。
JSON schema:
{
  "consensus": ["共同观点"],
  "differences": ["明显差异"],
  "modelObservations": [{"model": "模型名", "observation": "该模型独特观察"}],
  "references": [{"chatSlug": "记录 slug", "title": "记录标题", "excerpt": "引用片段"}]
}

话题：${topic.name}
内容：
${corpus}`,
  });

  await writeJsonCache(cacheKey, comparison);
  return comparison;
}
