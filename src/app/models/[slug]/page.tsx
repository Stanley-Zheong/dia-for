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
    <AppShell active="brainwave">
      <div className="category-layout">
        <section>
          <p className="eyebrow">Model</p>
          <h1 className="page-title">{model.name}</h1>
          <p className="page-intro">{model.chats.length} 篇公开聊天记录。</p>
          <div className="stream">
            {model.chats.map((chat) => (
              <ChatCard key={chat.slug} chat={chat} />
            ))}
          </div>
        </section>
        <aside className="panel">
          <h2>{model.name}</h2>
          <p>按模型反向查看公开对话，适合比较同一工具在不同问题里的表现。</p>
        </aside>
      </div>
    </AppShell>
  );
}
