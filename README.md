# dia-for

## 📌 项目速览

| 维度 | 内容 |
|---|---|
| **项目类型** | 工具型项目 |
| **关注等级** | 高 |
| **阻塞点** | 无 |
| **恢复条件** | 随时可继续 |
| **整理日期** | 2026-06-08 |

## Multica 项目信息

| 字段 | 内容 |
|---|---|
| **项目名称** | chatweb |
| **Multica 项目 ID** | `92f99a7c-b021-443f-8dc0-b061be9cf4c1` |
| **负责人** | `hcode`（agent，`3e993c67-e60d-46c2-923c-29aed495b645`） |
| **GitHub** | `https://github.com/Stanley-Zheong/dia-for.git` |
| **本地目录** | `/Users/laosanzheong/Documents/codebases/chatweb` |
| **运行环境** | Next.js 16 + React 19 + TypeScript 6 + Tailwind CSS 4；部署目标为 Cloudflare Workers Assets，普通构建走 `npm run build`。 |

### 🔗 项目关系与整合

chatweb（**发布端**）与 [`knowcle`](../knowcle)（**采集端**）是同一条知识管线的两端：
**knowcle 把各大模型对话/agent 日志归一化采集进 Obsidian → 人工在 Obsidian 提炼 → chatweb 把 `published: true` 的内容发布到公网**。两者互补，可考虑合并为同一 monorepo 的两个包（但运行时不同：knowcle 是 Node CLI 批处理，chatweb 是 Next.js Web 应用，属"逻辑合并、物理分包"）。

当前 `chatweb/dia-for` 已确定为 `info.19999991.xyz` 的统一信息站发布端：

- **脑电波**：`content/chats/`，路由 `/brainwave`，来源为我和大模型的对话。
- **远山**：`content/yuan-shan/`，路由 `/yuan-shan`，来源为 RSS/Miniflux/industry-crawler 情报。
- **小桔灯**：`content/products/`，路由 `/xiao-ju-deng`，来源为产品矩阵和本地项目扫描。

> ⚠️ **注意**：[`cross-loop`](../cross-loop) 与本管线**无关**（它是 AI 编码 CLI 编排器），不应并入。

> 仓库目录名为 `chatweb`，package name 为 `dia-for`，对外项目名以 `dia-for` 为准。

`dia-for` 是一个采用 OpenSpec 工作流驱动的公开项目，用来记录、整理和发布"人与各种 AI / 大模型对话过程中产生的思考、体会和判断"。

它不是传统博客，也不是又一个个人知识库。个人知识沉淀仍然发生在 Obsidian 中，`dia-for` 是一个**派生的公开发布层**：把已经整理好的 AI 对话记录发布出来，并围绕这些对话继续做检索、总结、观点提取和多模型对比。

---

## 项目目标

保留"人和模型共同思考"的过程，而不只是输出一篇被整理过的结论文章。我会把和 AI 对话中有长期价值的内容整理到这里，包括但不限于：

- **技术实现方案**：前端、后端、工程化、架构设计、工具链选择等。
- **商业模式探索**：产品机会、定价假设、增长路径、市场判断等。
- **大模型开发**：AI Coding、Agent 工作流、Prompt、RAG、AI Search、多模型比较等。
- **个人实践体会**：使用不同模型和工具后的经验、局限、误判和收获。

核心定位：**Obsidian 是 source of truth，网站是派生的发布层。**

---

## 核心功能

当前版本（MVP 已落地 + 若干增量）实现了一个公开 AI 聊天记录站的基础能力：

- 从 Obsidian 导出 / 同步的 Markdown 中读取内容。
- **Published 过滤**：只发布 frontmatter 中 `published: true` 的记录；所有路由、索引、AI insights、搜索语料都严格只包含已发布条目。
- 按 ChatGPT / Claude 等大模型聊天布局展示多轮对话（用户消息右对齐、模型消息左对齐）。
- 页面路由：
  - 首页（三大栏目入口 + 最新文章）
  - 脑电波 `/brainwave` 与详情 `/brainwave/[slug]`
  - 远山 `/yuan-shan`、子栏目 `/yuan-shan/ai|data|new-energy|traditional-ai|education-ai`、详情 `/yuan-shan/[slug]`
  - 小桔灯 `/xiao-ju-deng` 与产品详情 `/xiao-ju-deng/[slug]`
  - 兼容旧聊天详情页 `/chats/[slug]`
  - 话题索引 `/topics` 与详情 `/topics/[slug]`
  - 模型索引 `/models/[slug]`
  - 标签索引 `/tags` 与详情 `/tags/[slug]`
  - 搜索页 `/search`（静态站内本地检索）
- 右侧面板展示**人工撰写的 insights**（frontmatter `insights` 字段，多行 Markdown 渲染）。
- 支持站内搜索，并在回答中展示来源记录。公开站当前是静态导出，搜索在浏览器本地检索 manifest，不依赖运行时 API。
- 保留原始 Markdown 正文，AI 总结 / 对比 / 搜索只是派生层。
- **AI 降级路径**：未配置 `GEMINI_API_KEY` 时站点仍可 build 与浏览，AI Search 和 insight 生成走本地降级结果，不会 crash。

---

## 技术架构

### 技术栈

- **框架**：Next.js 16（App Router）+ React 19 + TypeScript 6
- **样式**：Tailwind CSS 4（PostCSS 集成）
- **Markdown 渲染**：`react-markdown` + `remark-gfm` + `rehype-highlight`
- **Frontmatter 解析**：`gray-matter`
- **校验**：`zod`
- **测试**：Vitest 4（node 环境，`tests/**/*.test.{ts,tsx}`）
- **AI**：Gemini API（`@google/genai`，默认模型 `gemini-2.5-flash`）
- **工作流**：OpenSpec（spec-driven）

### 部署方式

部署到 **Cloudflare Workers Assets**。Next.js 先静态导出到 `out/`，`src/worker.ts` 只负责从 `ASSETS` 绑定服务静态文件，并兼容无尾斜杠 URL。

```
npm run build              # 生成 manifest、静态导出 out/
npm run build:cloudflare   # 当前等同 npm run build
npm run preview            # 本地预览 Workers Assets
npm run deploy             # build + wrangler deploy
npm run qa:live            # Playwright 线上链接与页面完整性验收
```

- 配置文件：`wrangler.jsonc`
  - `main: src/worker.ts`，`name: dia-for`
  - `assets.directory: out`，绑定 `ASSETS`
  - `compatibility_date: 2026-04-25`，开启 observability
- 普通 `npm run build` 会先清理 `out/`，再执行 `next build --webpack`，最后生成静态路径别名。

### src 结构

```
src/
├── app/                      # Next.js App Router
│   ├── chats/[slug]/page.tsx # 聊天详情页
│   ├── topics/               # /topics 与 /topics/[slug]
│   ├── models/[slug]/        # /models/[slug]
│   ├── tags/                 # /tags 与 /tags/[slug]
│   ├── search/               # /search 页面 + SearchClient
│   ├── layout.tsx            # 根布局
│   ├── page.tsx              # 首页
│   └── globals.css
├── components/               # AppShell / ChatCard / ChatMessage /
│                             # ChatTranscript / MarkdownContent / MetaPills
├── generated/
│   └── content-manifest.json # 构建产物（不要手动编辑）
└── lib/                      # 核心逻辑
    ├── config.ts             # 站点配置 / 环境变量
    ├── content.ts            # 读取 manifest、published 过滤、slug 映射
    ├── slug.ts               # slug 标准化
    ├── types.ts              # ChatRecord / ChatMessage 等类型
    ├── gemini.ts             # Gemini 客户端封装
    ├── insights.ts           # 摘要 / 对比生成（带降级）
    ├── local-search.ts       # 浏览器本地搜索
    ├── search.ts             # 服务器侧 AI Search 逻辑（保留给后续动态服务）
    ├── markdown-example.ts   # 紧凑 markdown 展开（消息切分相关）
    └── cache.ts              # 内存 / 文件缓存
```

### 数据流

```
我与大模型聊天
    ↓
Obsidian Web Clipping 保存为 Markdown
    ↓
在 Obsidian 中整理 frontmatter 和正文，设置 published: true
    ↓
scripts/sync-from-obsidian.sh  →  同步到 content/chats/*.md
    ↓
npm run content:manifest  →  生成 src/generated/content-manifest.json（published 过滤）
    ↓
next build 静态导出
    ↓
Cloudflare Workers Assets 上的公开站点（脑电波 / 远山 / 小桔灯 / 详情 / 话题 / 模型 / 标签 / 搜索）
    ↓
公开站不依赖运行时 API；搜索使用本地 manifest，insight 在构建期无 key 时走本地降级
```

RSS 情报进入远山的累计式双语链路：

```
Miniflux / RSSHub / industry-crawler
    ↓
NetNewsWire / Miniflux star
    ↓
ai-intel-daily/scripts/sync_miniflux.py
    ↓
status = starred_pending_ai
    ↓
ai-intel-daily/scripts/ai_enrich.py
    ↓
status = publish_ready（中英双语正文、tags、评分）
    ↓
ai-intel-daily/scripts/publish_to_chatweb.py
    ↓
ai-intel-daily/generator/export_yuan_shan_markdown.py
    ↓
content/yuan-shan/*.md + obsidian/raw/rss/**/*.md
    ↓
npm run content:manifest
    ↓
npm run build:cloudflare
```

`publish_to_chatweb.py` 会校验每条可发布 DB 行都已经进入远山 Markdown 和
`src/generated/content-manifest.json`，否则非零退出，避免 RSS 管道静默只发布一篇或跳过历史文章。

公开站支持 `/zh/...` 与 `/en/...` 双语静态 URL。没有语言前缀的旧 URL 会由 Cloudflare Worker 按浏览器语言或 `locale` cookie 跳转。

详见 `docs/unified-info-site.md`。

构建依赖顺序（已内置到脚本）：`content:manifest` 必须在 `build` 和 `test` 之前执行。

示例 frontmatter：

```yaml
---
title: "AI 编程工具选型讨论"
topic: "AI 编程工具"
models:
  - ChatGPT
  - Claude
source: "web-clipping"
published: true
created: 2026-04-25
tags:
  - ai-tools
  - coding
insights: |
  ## 核心价值
  这篇对话展示了...
---
```

---

## 当前进展

- MVP（`build-public-chat-archive-mvp`）已实现并归档：Obsidian → 公开站点的发布链路跑通。
- 已归档的增量 change：
  - `add-tags-pages`：`/tags` 索引与详情页（仅 published）。
  - `human-written-insights`：右侧面板从 AI 生成的 insights 改为人工撰写的 Markdown（frontmatter `insights`）。
- 内容侧：`content/chats/` 当前有 10 篇 Markdown，全部 `published: true`（如自动化开发实践、智能时代的商业逻辑、Agent 训练与评估、AI 系统开发思维、AI 产品研发思路、harness 自动化开发等）。
- 已加入统一信息站结构：`content/yuan-shan/` 存 RSS 情报，`content/products/` 存产品矩阵，`src/generated/content-manifest.json` 统一索引三个目录。
- 新增 `scripts/sync-from-obsidian.sh` 与 manifest 生成脚本；近期 git 历史以"content: sync … from Obsidian"为主，并修复了 Obsidian sync manifest 生成与 chat slug 安全问题。
- 已增强 Markdown 排版（ChatGPT 风格 typography）。
- 测试：`tests/` 下有 acceptance、content、search、markdown-example 等用例。

---

## TODO / 待办

以下为 `openspec/changes/` 中**尚未归档**（即进行中 / 计划中）的 change：

- **`obsidian-image-upload`**：将 Obsidian 本地粘贴图片上传到 Cloudflare R2 并替换为 CDN URL；新增 `content/attachments/`（gitignored）与 R2 环境变量（`R2_ACCESS_KEY_ID` / `R2_SECRET_ACCESS_KEY` / `R2_BUCKET_NAME` / `R2_PUBLIC_URL`）。
- **`html-attachment-upload`**：支持在对话中分享交互式 HTML 附件，上传到 R2，并提供独立访问路由（如 `/attachments/[filename]`）。
- **`split-content-manifest`**（BREAKING）：将单体 `content-manifest.json`（当前约 764KB / 9 篇）拆分为轻量索引 + 每篇 `src/generated/chats/{slug}.json`，实现按需加载，降低构建与运行时内存。

README 中既有的中长期方向（仍有效）：

- 更稳定的聊天记录解析格式。
- 更好的多模型观点对比。
- 更强的 AI Search 与引用机制。
- 更适合公开阅读的视觉设计。
- 对商业模式、AI 产品、大模型开发主题的持续沉淀。

---

## 注意事项

- `src/generated/content-manifest.json` 是**构建产物**，不要手动编辑；改内容请改 `content/chats/*.md` 后重跑 `npm run content:manifest`。
- **不要用代码修改 `content/chats/` 下的文件**——内容管理在 Obsidian 中进行。测试 fixture 可加入此目录，但除非真要发布，否则必须 `published: false`。
- **渲染契约**：用户消息右对齐、模型消息左对齐；模型回答内部的 Markdown heading（如 `###`）不能被切分成假消息。回归 fixture 为 `content/chats/harness 自动化开发.md` 中 `perplexity` 回答的内部 heading。
- `GEMINI_API_KEY` 为 server-only，不能暴露到浏览器；缺失时全站走本地降级。
- Next 16 / React 19 / TS 6 / Tailwind 4 / Vitest 4 均为较新版本，AI 训练数据可能滞后——遇到 API 问题请优先查官方文档 / Context7，不要凭记忆猜测。
- 仓库内 `NEXT_PUBLIC_SITE_NAME` 在不同文件中不一致（`.env.example` / `docs/deployment.md` 为 `ChatWeb`，本 README 历史示例为 `dia-for`），部署时以实际 `.env` 为准。

---

## 约束（来自 `AGENTS.md`，不可违反）

1. **Published 语义**：唯一真源是 `content/chats/*.md` 中 `published: true` 的条目；所有路由、索引、insights、搜索语料严格过滤；`published: false` 或缺失字段的条目绝不能泄露到任何公开页面 / manifest / 搜索结果。
2. **部署门禁 `verify:deploy`**：每个开发任务结束**必须**执行 `npm run verify:deploy`（检查 `src/ tests/ scripts/ content/ docs/` 及核心配置的 git status，再依次 `lint → typecheck → test → build`）；不通过不得声称完成，交付说明须含其输出。
3. **构建依赖顺序**：`content:manifest` 必须先于 `build` / `test`（已内置）。
4. **AI 降级路径**：无 `GEMINI_API_KEY` 时仍可 build 与浏览。
5. **OpenSpec 工作流**：功能开发先 `openspec-propose` 创建 change（`proposal.md` / `design.md` / `tasks.md` / `specs/`），实现后 `openspec-archive-change` 归档到 `openspec/changes/archive/`，capability spec 沉淀到 `openspec/specs/`。
6. 验收标准详见 `docs/acceptance.md`：published 数 == manifest 数 == 首页数；topic/model 页严格映射 published frontmatter；每篇 published chat 有可访问的 `/chats/[slug]`；内容保留原始 Markdown body。

---

## 本地开发

```bash
npm install              # 安装依赖
cp .env.example .env     # 复制环境变量

npm run dev              # 启动开发服务

npm run content:manifest # 生成内容 manifest（build/test 已内置）
npm run content:sync     # 从 Obsidian 同步内容

npm run lint
npm run typecheck
npm run test
npm run build
npm run verify:deploy    # 部署前必跑：git status + lint + typecheck + test + build
```

### 环境变量

```bash
OBSIDIAN_CONTENT_DIR=content/chats
NEXT_PUBLIC_SITE_NAME=ChatWeb
NEXT_PUBLIC_SITE_DESCRIPTION="Public AI chat archive powered by Obsidian and Gemini."
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.5-flash
```

未配置 `GEMINI_API_KEY` 时，站点仍可构建和浏览；AI Search 与 insight 生成使用本地降级结果。

### 路径别名

- `@/*` → `./src/*`（配置于 `tsconfig.json` 与 `vitest.config.ts`）

---

## 相关文档

- `AGENTS.md` — AI agent 项目宪法（核心约束）
- `docs/acceptance.md` — 验收标准
- `docs/deployment.md` — 部署与环境变量
- `docs/obsidian-publishing.md` — Obsidian 发布流程
- `openspec/` — OpenSpec change 与 spec
- `content/AGENTS.md` — frontmatter 字段与内容约束

---

## License

暂未选择开源许可证（`package.json` 标注 `UNLICENSED`）。项目代码和内容当前公开可见，但不代表自动授予复用、分发或商业使用授权。
