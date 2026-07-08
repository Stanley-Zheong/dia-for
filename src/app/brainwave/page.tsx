import Link from "next/link";

import { AppShell } from "@/components/AppShell";
import { ChatCard } from "@/components/ChatCard";
import { KeywordFilter } from "@/components/KeywordFilter";
import { getAllChats } from "@/lib/content";
import { keywordSummariesFor } from "@/lib/presentation";

export default async function BrainwavePage() {
  const chats = await getAllChats();
  const keywords = keywordSummariesFor(chats);

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

        <div className="category-layout" data-filter-scope="brainwave">
          <div>
            <section className="page-head" id="brainwave">
              <p className="eyebrow">Brainwave · 按话题 / 模型整理</p>
              <h1 className="page-title">脑电波</h1>
              <p className="page-intro">
                与大模型的极限对垒，捕捉人机思辨的火花。
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
            <p>拒绝灌水与公式化问答。这里完整复盘、记录并蒸馏高价值的 AI 对话全过程。通过拆解高阶 Prompt 架构与逻辑反向测试，探索 AI 的能力边界，把调教过程沉淀为可复用的启智方法论。</p>
            <KeywordFilter scope="brainwave" keywords={keywords} label="关键字：" />
          </aside>
        </div>
      </div>
    </AppShell>
  );
}
