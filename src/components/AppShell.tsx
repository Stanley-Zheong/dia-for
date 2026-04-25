import Link from "next/link";
import type { ReactNode } from "react";

import { getModels, getTopics } from "@/lib/content";
import { siteConfig } from "@/lib/config";

type AppShellProps = {
  children: ReactNode;
  aside?: ReactNode;
};

export async function AppShell({ children, aside }: AppShellProps) {
  const [topics, models] = await Promise.all([getTopics(), getModels()]);

  return (
    <div className="mx-auto grid min-h-screen max-w-[1500px] grid-cols-1 gap-6 px-4 py-5 lg:grid-cols-[260px_minmax(0,1fr)_320px]">
      <aside className="rounded-[2rem] border border-slate-200 bg-white/80 p-5 shadow-sm lg:sticky lg:top-5 lg:h-[calc(100vh-2.5rem)] lg:overflow-auto">
        <Link href="/" className="block">
          <div className="text-2xl font-bold tracking-tight text-slate-950">
            {siteConfig.name}
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-500">{siteConfig.description}</p>
        </Link>
        <nav className="mt-8 space-y-6 text-sm">
          <div>
            <div className="mb-2 font-semibold text-slate-900">导航</div>
            <div className="space-y-1">
              <Link className="block rounded-xl px-3 py-2 hover:bg-blue-50" href="/">
                最新记录
              </Link>
              <Link className="block rounded-xl px-3 py-2 hover:bg-blue-50" href="/topics">
                话题
              </Link>
              <Link className="block rounded-xl px-3 py-2 hover:bg-blue-50" href="/search">
                AI Search
              </Link>
            </div>
          </div>
          <div>
            <div className="mb-2 font-semibold text-slate-900">热门话题</div>
            <div className="space-y-1">
              {topics.slice(0, 8).map((topic) => (
                <Link
                  key={topic.slug}
                  className="block rounded-xl px-3 py-2 text-slate-600 hover:bg-green-50"
                  href={`/topics/${topic.slug}`}
                >
                  {topic.name}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <div className="mb-2 font-semibold text-slate-900">模型</div>
            <div className="flex flex-wrap gap-2">
              {models.map((model) => (
                <Link
                  key={model.slug}
                  className="rounded-full bg-slate-100 px-3 py-1 text-slate-600 hover:bg-blue-100 hover:text-blue-700"
                  href={`/models/${model.slug}`}
                >
                  {model.name}
                </Link>
              ))}
            </div>
          </div>
        </nav>
      </aside>
      <main className="min-w-0">{children}</main>
      <aside className="rounded-[2rem] border border-slate-200 bg-white/80 p-5 shadow-sm lg:sticky lg:top-5 lg:h-[calc(100vh-2.5rem)] lg:overflow-auto">
        {aside ?? (
          <div>
            <div className="mb-3 text-sm font-semibold text-slate-900">右侧智能面板</div>
            <p className="text-sm leading-6 text-slate-500">
              打开具体聊天或话题后，这里会展示摘要、观点、共识和差异。
            </p>
          </div>
        )}
      </aside>
    </div>
  );
}
