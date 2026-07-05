import Link from "next/link";

import { AppShell } from "@/components/AppShell";
import { ArticleCard } from "@/components/ArticleCard";
import { getProducts } from "@/lib/content";

export default async function XiaoJuDengPage() {
  const products = await getProducts();

  return (
    <AppShell active="xiao-ju-deng">
      <div className="content-grid">
        <aside className="sidebar" aria-label="Columns">
          <div className="sidebar-label">Little Lantern</div>
          <nav className="sidebar-nav">
            <a className="active" href="#products">产品矩阵</a>
            <Link prefetch={false} href="/brainwave">脑电波</Link>
            <Link prefetch={false} href="/yuan-shan">远山</Link>
          </nav>
        </aside>

        <div className="category-layout">
          <div>
            <section className="page-head" id="products">
              <p className="eyebrow">Little Lantern · Product matrix</p>
              <h1 className="page-title">小桔灯</h1>
              <p className="page-intro">
                产品矩阵介绍。第一版从本机 codebases 扫描候选项目，确认公开后进入这里。
              </p>
            </section>
            <section className="stream" aria-label="Products">
              {products.map((product) => (
                <ArticleCard key={product.slug} article={product} />
              ))}
            </section>
          </div>
          <aside className="panel">
            <h2>产品矩阵</h2>
            <p>这里记录已经可以公开介绍的项目、工具和产品底座，后续可扩展为产品页、路线图和案例页。</p>
            <div className="stat-list">
              <div className="stat"><strong>{products.length}</strong><span className="caption">Products</span></div>
            </div>
          </aside>
        </div>
      </div>
    </AppShell>
  );
}
