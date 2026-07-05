import Link from "next/link";

import { AppShell } from "@/components/AppShell";
import { ChatCard } from "@/components/ChatCard";
import { getAllChats, getTopics } from "@/lib/content";

export default async function BrainwavePage() {
  const [chats, topics] = await Promise.all([getAllChats(), getTopics()]);

  return (
    <AppShell active="brainwave">
      <div className="content-grid">
        <aside className="sidebar" aria-label="Columns">
          <div className="sidebar-label">Site map</div>
          <nav className="sidebar-nav">
            <a className="active" href="#brainwave">脑电波</a>
            <Link prefetch={false} href="/yuan-shan">远山</Link>
            <Link prefetch={false} href="/xiao-ju-deng">小桔灯</Link>
            <Link prefetch={false} href="/tags">标签</Link>
          </nav>
        </aside>

        <div className="category-layout">
          <div>
            <section className="page-head" id="brainwave">
              <p className="eyebrow">Brainwave · 按话题 / 模型整理</p>
              <h1 className="page-title">脑电波</h1>
              <p className="page-intro">
                来源于我和大模型的公开对话，保留原始上下文，并按话题、模型和标签穿透访问。
              </p>
            </section>
            <div className="filter-bar" aria-label="Subcategory filters">
              <Link prefetch={false} className="filter active" href="/brainwave">全部</Link>
              <Link prefetch={false} className="filter" href="/topics">话题</Link>
              <Link prefetch={false} className="filter" href="/tags">标签</Link>
              <Link prefetch={false} className="filter" href="/search">搜索</Link>
            </div>
            <section className="stream" aria-label="Column posts">
              {chats.map((chat) => (
                <ChatCard key={chat.slug} chat={chat} />
              ))}
            </section>
          </div>
          <aside className="panel">
            <h2>栏目结构</h2>
            <p>脑电波按对话主题组织，适合回看一段判断如何形成，也适合从话题页横向比较多个模型的观点。</p>
            <div className="stat-list">
              <div className="stat"><strong>{chats.length}</strong><span className="caption">Published posts</span></div>
              <div className="stat"><strong>{topics.length}</strong><span className="caption">Topics</span></div>
            </div>
          </aside>
        </div>
      </div>
    </AppShell>
  );
}
