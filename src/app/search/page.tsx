import { AppShell } from "@/components/AppShell";
import { SearchClient } from "@/app/search/SearchClient";

export default function SearchPage() {
  return (
    <AppShell active="search">
      <div className="topic-layout">
        <section>
          <p className="eyebrow">Search</p>
          <h1 className="page-title">搜索公开记录</h1>
          <p className="page-intro">
            用自然语言搜索已发布内容，结果会带来源链接，方便回到原始文章。
          </p>
          <SearchClient />
        </section>
        <aside className="panel">
          <h2>搜索说明</h2>
          <p>公开站是静态导出，搜索使用本地 manifest，不依赖运行时 API。</p>
        </aside>
      </div>
    </AppShell>
  );
}
