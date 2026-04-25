import { AppShell } from "@/components/AppShell";
import { SearchClient } from "@/app/search/SearchClient";

export default function SearchPage() {
  return (
    <AppShell
      aside={
        <div>
          <div className="mb-2 text-sm font-semibold text-slate-900">搜索说明</div>
          <p className="text-sm leading-6 text-slate-600">
            AI Search 只使用 `published: true` 的公开 Obsidian 笔记作为上下文，并在回答后展示来源记录。
          </p>
        </div>
      }
    >
      <section className="rounded-[2rem] border border-slate-200 bg-white/75 p-6 shadow-sm">
        <p className="mb-2 text-sm font-semibold text-blue-600">Gemini AI Search</p>
        <h1 className="mb-3 text-4xl font-bold tracking-tight text-slate-950">
          搜索公开聊天记录
        </h1>
        <p className="mb-8 max-w-2xl text-slate-600">
          用自然语言询问你发布过的模型对话，回答会尽量基于公开片段并附带来源。
        </p>
        <SearchClient />
      </section>
    </AppShell>
  );
}
