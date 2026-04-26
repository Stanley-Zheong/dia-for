# AGENTS.md — src/app/

> Next.js 16 App Router 路由目录。

## 路由结构

| 路径 | 用途 |
|------|------|
| `page.tsx` | 首页，列出最新 published chats |
| `layout.tsx` | 根布局（AppShell、全局样式） |
| `globals.css` | Tailwind 入口 |
| `chats/[slug]/` | 聊天详情页 |
| `topics/` | 话题索引和详情页 |
| `models/` | 模型索引和详情页 |
| `search/` | AI Search 页面 |
| `api/` | API 路由（search 等） |

## Server vs Client Component

- **默认 Server Component**：所有 `page.tsx` 和 `layout.tsx` 默认是 Server Component
- **Client Component 标记**：需要 interactivity 的组件用 `'use client'` 指令
- **数据获取**：在 Server Component 中直接 `await` 调用 `lib/content.ts` 的函数

## 约束

- **新增路由时**：确保只渲染 `published: true` 的内容
- **修改路由后**：跑 `npm run build` 确认 static generation 正常
- **导航更新**：如果新增顶层路由，同步更新 `src/components/AppShell.tsx`
