import Link from "next/link";
import type { ReactNode } from "react";

import { siteConfig } from "@/lib/config";
import type { Locale } from "@/lib/i18n";
import { defaultLocale, t, withLocale } from "@/lib/i18n";

type AppShellProps = {
  children: ReactNode;
  active?: "home" | "brainwave" | "yuan-shan" | "xiao-ju-deng" | "topics" | "tags" | "search";
  locale?: Locale;
};

export function AppShell({ children, active = "home", locale = defaultLocale }: AppShellProps) {
  const navItems = [
    { key: "home", href: withLocale("/", locale), label: t(locale, "首页", "Home") },
    { key: "brainwave", href: withLocale("/brainwave", locale), label: t(locale, "脑电波", "Brainwave") },
    { key: "yuan-shan", href: withLocale("/yuan-shan", locale), label: t(locale, "远山", "Distant Hills") },
    { key: "xiao-ju-deng", href: withLocale("/xiao-ju-deng", locale), label: t(locale, "小桔灯", "Little Lantern") },
    { key: "topics", href: withLocale("/topics", locale), label: t(locale, "话题", "Topics") },
    { key: "tags", href: withLocale("/tags", locale), label: t(locale, "标签", "Tags") },
  ] as const;
  const otherLocale = locale === "en" ? "zh" : "en";

  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <Link prefetch={false} className="brand" href={withLocale("/", locale)}>
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
                {t(locale, "搜索标题、标签和内容", "Search titles, tags, and content")}
              </label>
              <input id="global-search" name="q" type="search" placeholder={t(locale, "搜索双链 / 标签", "Search notes / tags")} />
            </form>
            <Link prefetch={false} className="theme-toggle" aria-label={t(locale, "打开搜索", "Open search")} href={withLocale("/search", locale)}>
              ⌕
            </Link>
            <Link prefetch={false} className="theme-toggle" href={withLocale("/", otherLocale)} hrefLang={otherLocale}>
              {otherLocale.toUpperCase()}
            </Link>
          </div>
        </div>
      </header>

      <main className="page-shell">{children}</main>

      <footer className="site-footer rich-footer">
        <section className="subscribe-block">
          <p className="eyebrow">Subscribe</p>
          <h2>{t(locale, "订阅 RSS-Daily 与站点更新", "Subscribe to RSS-Daily and site updates")}</h2>
          <form className="subscribe-form">
            <input type="email" placeholder="you@example.com" />
            <button type="button">{t(locale, "订阅", "Subscribe")}</button>
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
            <Link prefetch={false} href={withLocale("/yuan-shan", locale)}>RSS</Link> ·{" "}
            <Link prefetch={false} href={withLocale("/search", locale)}>{t(locale, "搜索", "Search")}</Link> · {t(locale, "归档", "Archive")} · © 2026
          </span>
        </section>
      </footer>
    </>
  );
}
