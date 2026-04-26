import Link from "next/link";

import { AppShell } from "@/components/AppShell";
import { getTags } from "@/lib/content";

export default async function TagsPage() {
  const tags = await getTags();

  return (
    <AppShell>
      <section className="rounded-[2rem] border border-slate-200 bg-white/75 p-6 shadow-sm">
        <h1 className="mb-6 text-4xl font-bold tracking-tight text-slate-950">标签</h1>
        {tags.length === 0 ? (
          <p className="text-slate-500">暂无标签。</p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {tags.map((tag) => (
              <Link
                key={tag.slug}
                href={`/tags/${tag.slug}`}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm hover:shadow-md"
              >
                <span className="font-medium text-slate-950">{tag.name}</span>
                <span className="ml-2 text-sm text-slate-500">{tag.chats.length}</span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </AppShell>
  );
}
