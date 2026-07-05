"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";

import contentManifest from "@/generated/content-manifest.json";
import { answerLocalSearch, buildSearchCorpus, type SearchAnswer } from "@/lib/local-search";
import { sectionHref } from "@/lib/routes";
import type { ArticleRecord } from "@/lib/types";

export function SearchClient() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<SearchAnswer | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const corpus = useMemo(
    () => buildSearchCorpus(contentManifest as ArticleRecord[]),
    [],
  );

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setResult(null);

    if (!query.trim()) {
      setError("请输入搜索问题。");
      return;
    }

    setIsLoading(true);

    try {
      setResult(answerLocalSearch(query, corpus));
    } catch {
      setError("搜索失败，请稍后重试。");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="search-panel">
      <form onSubmit={onSubmit} className="search-form-large">
        <label htmlFor="query" className="caption">
          询问公开聊天记录
        </label>
        <textarea
          id="query"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="例如：哪个模型提到 AI Search 要显示来源？"
          className="search-textarea"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="search-submit"
        >
          {isLoading ? "搜索中..." : "Search"}
        </button>
      </form>

      {error ? (
        <div className="article-callout">
          {error}
        </div>
      ) : null}

      {result ? (
        <section className="panel search-result">
          <h2>回答</h2>
          <p>{result.answer}</p>
          <div>
            <h3>来源</h3>
            {result.sources.length > 0 ? (
              <div className="trend-list">
                {result.sources.map((source) => (
                  <Link prefetch={false}
                    key={`${source.chatSlug}-${source.excerpt}`}
                    href={`${sectionHref(source.section)}/${source.chatSlug}`}
                  >
                    <strong>{source.title}</strong>
                    <span>{source.topic} · {source.excerpt}</span>
                  </Link>
                ))}
              </div>
            ) : (
              <p>没有可引用的公开来源。</p>
            )}
          </div>
        </section>
      ) : null}
    </div>
  );
}
