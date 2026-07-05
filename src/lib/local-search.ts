import type { ArticleRecord, SearchSource } from "@/lib/types";

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

export function buildSearchCorpus(articles: ArticleRecord[]): SearchSource[] {
  return articles.flatMap((article) => {
    const messageSources = article.messages.map((message) => ({
      chatSlug: article.slug,
      section: article.meta.section,
      title: article.meta.title,
      topic: article.meta.topic,
      excerpt: compact(`${message.speaker}: ${message.content}`),
    }));

    if (messageSources.length > 0) {
      return messageSources;
    }

    return [
      {
        chatSlug: article.slug,
        section: article.meta.section,
        title: article.meta.title,
        topic: article.meta.topic,
        excerpt: compact(article.rawMarkdown),
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
      const haystack = normalize(`${source.title} ${source.topic} ${source.excerpt}`);
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

export function answerLocalSearch(query: string, corpus: SearchSource[]): SearchAnswer {
  const sources = retrieveRelevantSources(query, corpus);

  return {
    answer:
      sources.length > 0
        ? "已找到相关公开记录。请查看下方来源回到原始页面。"
        : "没有在已发布记录中找到足够相关的内容。",
    sources,
  };
}
