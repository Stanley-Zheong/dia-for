# AGENTS.md — dia-for

> 本文件是 AI agent 的项目宪法。所有 AI 编码 agent（OmO Sisyphus、Codex、Cursor 等）在本项目工作时必须遵守以下约束。

## 项目定位

`dia-for` 是一个 AI 对话记录的公开发布层。Obsidian 是 source of truth，网站是派生的发布层。

## 核心约束（不可违反）

### 1. Published 语义

- **唯一真源**：`content/chats/*.md` 中 frontmatter 包含 `published: true` 的条目
- **严格过滤**：所有路由（首页、chats、topics、models、tags、search）、所有索引、所有 AI insights、所有搜索语料，都必须只包含 `published: true` 的条目
- **不可泄露**：`published: false` 或缺失 `published` 字段的条目绝不能出现在任何公开页面、manifest、或搜索结果中

### 2. 部署门禁 `verify:deploy`

- 每个开发任务**结束时必须执行** `npm run verify:deploy`
- 该命令会：
  1. 先检查 git status —— `src/`, `tests/`, `scripts/`, `content/`, `docs/`, 核心配置文件有未提交改动则直接 **fail**
  2. 依次执行 `lint` → `typecheck` → `test` → `build`
- **交付说明必须包含 `verify:deploy` 的输出**
- 不通过则不允许声称任务完成

### 3. 渲染契约

- 用户消息右对齐，模型消息左对齐
- 模型回答内部的 markdown heading（如 `###`）**不能**被切分成假消息
- 回归 fixture：`content/chats/harness 自动化开发.md` 的 `perplexity` 回答中的内部 heading 必须保留在同一消息内

### 4. 构建依赖顺序

- `npm run content:manifest` 必须在 `build` 和 `test` 之前执行（已内置到 `npm run build` 和 `npm run test`）
- `src/generated/content-manifest.json` 是构建产物，不要手动编辑

### 5. AI 降级路径

- 没有 `GEMINI_API_KEY` 时站点必须仍可 build 和浏览
- AI Search 和 insight 生成走本地降级结果，不能 crash

## 技术栈

- **框架**：Next.js 16 + React 19 + TypeScript 6
- **样式**：Tailwind CSS 4
- **测试**：Vitest 4（node 环境，`tests/**/*.test.{ts,tsx}`）
- **部署**：Cloudflare Workers via `@opennextjs/cloudflare`
- **AI**：Gemini API（`@google/genai`）
- **工作流**：OpenSpec

## 部署链路

```
npm run build:cloudflare   # 构建 worker
npm run preview            # 本地预览
npm run deploy             # 部署到 Cloudflare
```

配置文件：`wrangler.jsonc`（`compatibility_date: 2026-04-25`，`nodejs_compat` 已开启）

## 路径别名

- `@/*` → `./src/*`（在 `tsconfig.json` 和 `vitest.config.ts` 中配置）

## 新版本库警告

Next 16、React 19、TypeScript 6、Tailwind 4、Vitest 4 都是较新版本，AI 训练数据可能滞后。

**强制要求**：遇到这些库的 API 问题时，优先使用 Context7 MCP 或官方文档查证，不要凭记忆猜测。

## OpenSpec 工作流

- 所有功能开发应先通过 `openspec-propose` 创建 change
- Change 结构：`openspec/changes/<name>/{proposal.md, design.md, tasks.md}`
- 实现后通过 `openspec-archive-change` 归档到 `openspec/changes/archive/`
- Capability specs 沉淀到 `openspec/specs/`

## 目录结构速查

```
src/
├── app/          # Next.js App Router 路由
│   ├── api/      # API routes
│   ├── chats/    # /chats/[slug]
│   ├── models/   # /models/[slug]
│   ├── topics/   # /topics/[slug]
│   └── search/   # /search
├── components/   # React 组件
├── generated/    # 构建产物（content-manifest.json）
└── lib/          # 核心逻辑模块
tests/            # Vitest 测试
content/chats/    # Obsidian Markdown 源文件
scripts/          # 构建脚本
docs/             # 项目文档
openspec/         # OpenSpec 工作流
```

## 验收标准参考

详见 `docs/acceptance.md`。关键点：

- published 数 == manifest 数 == 首页数
- topic/model 页严格映射 published frontmatter
- 每个 published chat 有可访问的 `/chats/[slug]` 页面
- 内容保留原始 Markdown body
