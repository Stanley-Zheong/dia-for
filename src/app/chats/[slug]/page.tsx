import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { AppShell } from "@/components/AppShell";
import { ArticleIllustration } from "@/components/ArticleIllustration";
import { ChatTranscript } from "@/components/ChatTranscript";
import { MarkdownContent } from "@/components/MarkdownContent";
import { MetaPills } from "@/components/MetaPills";
import { getAllChats, getChatBySlug } from "@/lib/content";
import { slugify } from "@/lib/slug";

type ChatPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const chats = await getAllChats();
  return chats.map((chat) => ({ slug: chat.slug }));
}

function InsightsPanel({ insights }: { insights?: string }) {
  if (!insights) {
    return (
      <div className="tip-related open">
        <div className="related-card">
          <strong>价值提炼</strong>
          暂无价值提炼。
          <span>这篇对话记录保留了原始内容，欢迎在 Obsidian 中补充你的思考。</span>
        </div>
      </div>
    );
  }

  return (
    <div className="tip-related open">
      <div className="related-card">
        <strong>价值提炼</strong>
        <MarkdownContent content={insights} />
      </div>
    </div>
  );
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { slug } = await params;
  const chat = await getChatBySlug(slug);

  if (!chat) {
    notFound();
  }

  if (slug !== chat.slug) {
    redirect(`/brainwave/${chat.slug}`);
  }

  return (
    <AppShell active="brainwave">
      <div className="content-grid with-tips">
        <aside className="sidebar article-nav" aria-label="Article navigation">
          <div className="sidebar-label">Brainwave</div>
          <nav className="sidebar-nav">
            <Link prefetch={false} href="/brainwave">栏目首页</Link>
            <Link prefetch={false} href={`/topics/${slugify(chat.meta.topic)}`}>话题</Link>
            <Link prefetch={false} href="/tags">标签</Link>
          </nav>
        </aside>

        <article className="article-body">
          <div className="article-meta">
            首页 / 脑电波 / {chat.meta.topic} · {chat.meta.created ?? "未标注日期"} ·{" "}
            {chat.meta.source ?? "Obsidian"}
          </div>
          <h1 className="article-title">{chat.meta.title}</h1>
          <div className="article-lead">
            <MetaPills chat={chat} />
          </div>
          <ArticleIllustration article={chat} />
          <ChatTranscript chat={chat} />
        </article>

        <aside className="tips-panel" aria-label="Article tips">
          <h2 className="tips-title">关联 Tips</h2>
          <button className="tip-button" type="button" aria-expanded="true">
            价值提炼
          </button>
          <InsightsPanel insights={chat.meta.insights} />
        </aside>
      </div>
    </AppShell>
  );
}
