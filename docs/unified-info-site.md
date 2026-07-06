# 统一信息站设计

`dia-for/chatweb` 是 `info.19999991.xyz` 的统一发布端。它不再只是聊天记录站，而是一个累计式信息站：所有公开内容先落成 Markdown，再由 Next.js 静态导出为可穿透链接的网站，并由 Cloudflare Workers Assets 服务。

## 栏目

| 栏目 | 路由 | 内容来源 | 内容目录 |
| --- | --- | --- | --- |
| 脑电波 | `/brainwave` | 我和大模型的对话、人工整理后的判断 | `content/chats/` |
| 远山 | `/yuan-shan` | RSS/Miniflux/industry-crawler 产生的行业情报 | `content/yuan-shan/` |
| 小桔灯 | `/xiao-ju-deng` | 本地产品矩阵、项目说明、后续产品页 | `content/products/` |

远山固定子栏目：

- `AI` -> `/yuan-shan/ai`
- `数据` -> `/yuan-shan/data`
- `新能源` -> `/yuan-shan/new-energy`
- `传统AI+` -> `/yuan-shan/traditional-ai`
- `教育AI+` -> `/yuan-shan/education-ai`

## 发布链路

```text
Miniflux / RSSHub / industry-crawler
  ↓
NetNewsWire / Miniflux star
  ↓
ai-intel-daily/scripts/sync_miniflux.py
  ↓
intelligence_items(status = starred_pending_ai)
  ↓
ai-intel-daily/scripts/ai_enrich.py
  ↓
AI 检索原文、RSS 元数据和历史库，生成中英双语情报
  ↓
intelligence_items(status = publish_ready)
  ↓
ai-intel-daily/scripts/publish_to_chatweb.py
  ↓
ai-intel-daily/generator/export_yuan_shan_markdown.py
  ↓
chatweb/content/yuan-shan/*.md + obsidian/raw/rss/**/*.md
  ↓
npm run content:manifest
  ↓
npm run build:cloudflare
  ↓
Cloudflare Workers Assets / info.19999991.xyz
```

关键约束：

- RSS 与 `industry-crawler` 不和 `chatweb` 部署在一起，只通过 Markdown/JSON 产物交互。
- RSS 是 `industry-crawler` 的信源增强方式之一；`industry-crawler` 可以反向输出关键词、主题、指定 RSS 源或采集需求。
- 正式公开页面只由 `chatweb` 生成；RSS 旧仓库的 `docs/index.html` 仅作历史兼容。
- 所有文章必须累计存储为 Markdown 文件，不能用一个 HTML 页面覆盖式发布。
- RSS 进入 `chatweb` 必须先经过 AI enrichment；不得把 RSS 原文或简单摘要直接作为公开文章发布。
- `publish_to_chatweb.py` 必须做 manifest 校验：每条可发布 DB 行都要出现在远山 Markdown 和 `content-manifest.json` 中。
- 公开站不使用 OpenNext SSR；所有公开页面必须在构建期生成为静态 HTML，避免 Cloudflare Worker 资源上限导致 1102。
- topic/tag URL 使用 ASCII slug，页面显示仍保留中文名称，避免中文路径在 Cloudflare Assets 上出现 percent-encoding 兼容问题。
- 双语 URL 使用 `/zh/...` 和 `/en/...`；无语言前缀的旧 URL 由 Cloudflare Worker 按 cookie 或浏览器 `Accept-Language` 跳转。

## Frontmatter Contract

三类内容共享基础字段：

```yaml
---
title: "文章标题"
title_en: "Article title"
section: "brainwave | yuan-shan | xiao-ju-deng"
category: "AI"
topic: "远山"
published: true
created: "2026-07-05"
tags:
  - 远山
tags_zh:
  - 远山
tags_en:
  - Distant Hills
source_name: "来源名称"
source_url: "https://example.com/source"
canonical_url: "https://example.com/source"
summary: "一句话摘要"
summary_en: "One-line summary"
language: "bilingual"
---
```

远山内容还可以带评分字段：

```yaml
score: 88
impact_score: 90
urgency_score: 70
confidence_score: 95
rss_source: "Miniflux"
```

小桔灯内容还可以带产品字段：

```yaml
repo_path: "/Users/laosanzheong/Documents/codebases/chatweb"
stack:
  - Next.js
  - Cloudflare Workers
status: "active"
```

## 验收标准

- 首页能看到三大栏目入口和跨栏目最新文章。
- `/brainwave` 只列出 `section: brainwave` 的文章。
- `/yuan-shan` 展示远山文章和五个固定子栏目。
- `/yuan-shan/[slug]` 同时支持分类页和文章详情页。
- `/xiao-ju-deng` 展示产品矩阵，产品详情有稳定 URL。
- `/zh/...` 和 `/en/...` 生成同一批文章的双语静态页面。
- `npm run content:manifest` 能把三个内容目录都写入 `src/generated/content-manifest.json`。
- `npm run test`、`npm run typecheck`、`npm run lint`、`npm run build:cloudflare` 必须通过。
- `npm run qa:live` 必须通过：Chromium/WebKit 打开线上站，所有内部链接可打开，12 篇发布文章页数量与 manifest 对齐，无 1102/503/Next error/乱码/空页面。
- 新 RSS 情报导出后是新增/更新 Markdown 文件，不删除历史文章。
