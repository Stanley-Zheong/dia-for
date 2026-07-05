import Link from "next/link";
import type { ReactNode } from "react";

import { siteConfig } from "@/lib/config";

type AppShellProps = {
  children: ReactNode;
  active?: "home" | "brainwave" | "yuan-shan" | "xiao-ju-deng" | "topics" | "tags" | "search";
};

const navItems = [
  { key: "home", href: "/", label: "首页" },
  { key: "brainwave", href: "/brainwave", label: "脑电波" },
  { key: "yuan-shan", href: "/yuan-shan", label: "远山" },
  { key: "xiao-ju-deng", href: "/xiao-ju-deng", label: "小桔灯" },
  { key: "topics", href: "/topics", label: "话题" },
  { key: "tags", href: "/tags", label: "标签" },
] as const;

export function AppShell({ children, active = "home" }: AppShellProps) {
  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <Link prefetch={false} className="brand" href="/">
            三he水
          </Link>
          <nav className="site-nav" aria-label="Main navigation">
            {navItems.map((item) => (
              <Link
                prefetch={false}
                key={item.key}
                className={active === item.key ? "active" : undefined}
                href={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="header-tools">
            <form className="search-box" action="/search">
              <label className="sr-only" htmlFor="global-search">
                搜索标题、标签和内容
              </label>
              <input id="global-search" name="q" type="search" placeholder="搜索双链 / 标签" />
            </form>
            <Link prefetch={false} className="theme-toggle" aria-label="打开搜索" href="/search">
              ⌕
            </Link>
          </div>
        </div>
      </header>

      <main className="page-shell">{children}</main>

      <footer className="site-footer rich-footer">
        <section className="subscribe-block">
          <p className="eyebrow">Subscribe</p>
          <h2>订阅 RSS-Daily 与站点更新</h2>
          <form className="subscribe-form">
            <input type="email" placeholder="you@example.com" />
            <button type="button">订阅</button>
          </form>
          <p>{siteConfig.description}</p>
        </section>
        <section className="qr-grid" aria-label="Social QR links">
          <div className="qr-card"><span className="qr-mark" /><strong>X</strong></div>
          <div className="qr-card"><span className="qr-mark" /><strong>公众号</strong></div>
          <div className="qr-card"><span className="qr-mark" /><strong>小红书</strong></div>
          <div className="qr-card"><span className="qr-mark" /><strong>知乎</strong></div>
        </section>
        <section className="footer-meta">
          <strong>三he水</strong>
          <span>
            <Link prefetch={false} href="/yuan-shan">RSS</Link> ·{" "}
            <Link prefetch={false} href="/search">搜索</Link> · 归档 · © 2026
          </span>
        </section>
      </footer>
    </>
  );
}
