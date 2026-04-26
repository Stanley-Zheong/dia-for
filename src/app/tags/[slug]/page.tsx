import { notFound } from "next/navigation";

import { AppShell } from "@/components/AppShell";
import { ChatCard } from "@/components/ChatCard";
import { getTagBySlug, getTags } from "@/lib/content";

type TagPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const tags = await getTags();
  return tags.map((tag) => ({ slug: tag.slug }));
}

export default async function TagPage({ params }: TagPageProps) {
  const { slug } = await params;
  const tag = await getTagBySlug(slug);

  if (!tag) {
    notFound();
  }

  return (
    <AppShell>
      <section className="rounded-[2rem] border border-slate-200 bg-white/75 p-6 shadow-sm">
        <p className="mb-2 text-sm font-semibold text-blue-600">Tag</p>
        <h1 className="mb-3 text-4xl font-bold tracking-tight text-slate-950">{tag.name}</h1>
        <p className="mb-8 text-slate-600">{tag.chats.length} 篇公开记录。</p>
        <div className="space-y-4">
          {tag.chats.map((chat) => (
            <ChatCard key={chat.slug} chat={chat} />
          ))}
        </div>
      </section>
    </AppShell>
  );
}
