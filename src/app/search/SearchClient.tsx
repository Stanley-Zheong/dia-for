"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

import type { SearchAnswer } from "@/lib/search";

export function SearchClient() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<SearchAnswer | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

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
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = (await response.json()) as SearchAnswer;

      if (!response.ok) {
        setError(data.answer || "AI Search 暂时不可用。");
        return;
      }

      setResult(data);
    } catch {
      setError("AI Search 请求失败，请稍后重试。");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={onSubmit} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <label htmlFor="query" className="mb-2 block text-sm font-semibold text-slate-900">
          询问公开聊天记录
        </label>
        <textarea
          id="query"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="例如：哪个模型提到 AI Search 要显示来源？"
          className="min-h-28 w-full resize-y rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="mt-3 rounded-full bg-[#4285f4] px-5 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? "搜索中..." : "AI Search"}
        </button>
      </form>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {result ? (
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold text-slate-950">回答</h2>
          <p className="leading-7 text-slate-700">{result.answer}</p>
          <div className="mt-6">
            <h3 className="mb-3 text-sm font-semibold text-slate-900">来源</h3>
            {result.sources.length > 0 ? (
              <div className="space-y-3">
                {result.sources.map((source) => (
                  <Link
                    key={`${source.chatSlug}-${source.excerpt}`}
                    href={`/chats/${source.chatSlug}`}
                    className="block rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm hover:bg-blue-50"
                  >
                    <div className="font-semibold text-slate-950">{source.title}</div>
                    <div className="mt-1 text-slate-500">{source.topic}</div>
                    <p className="mt-2 leading-6 text-slate-600">{source.excerpt}</p>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">没有可引用的公开来源。</p>
            )}
          </div>
        </section>
      ) : null}
    </div>
  );
}
