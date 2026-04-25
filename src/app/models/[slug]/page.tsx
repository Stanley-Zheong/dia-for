import { notFound } from "next/navigation";

import { AppShell } from "@/components/AppShell";
import { ChatCard } from "@/components/ChatCard";
import { getModelBySlug, getModels } from "@/lib/content";

type ModelPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const models = await getModels();
  return models.map((model) => ({ slug: model.slug }));
}

export default async function ModelPage({ params }: ModelPageProps) {
  const { slug } = await params;
  const model = await getModelBySlug(slug);

  if (!model) {
    notFound();
  }

  return (
    <AppShell>
      <section className="rounded-[2rem] border border-slate-200 bg-white/75 p-6 shadow-sm">
        <p className="mb-2 text-sm font-semibold text-blue-600">Model</p>
        <h1 className="mb-3 text-4xl font-bold tracking-tight text-slate-950">{model.name}</h1>
        <p className="mb-8 text-slate-600">{model.chats.length} 篇公开聊天记录。</p>
        <div className="space-y-4">
          {model.chats.map((chat) => (
            <ChatCard key={chat.slug} chat={chat} />
          ))}
        </div>
      </section>
    </AppShell>
  );
}
