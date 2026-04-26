# AGENTS.md — src/lib/

> 本目录包含 dia-for 的核心业务逻辑模块。

## 模块速查

| 文件 | 用途 |
|------|------|
| `config.ts` | 环境变量和配置常量 |
| `content.ts` | Obsidian Markdown 解析、manifest 查询、published 过滤 |
| `gemini.ts` | Gemini API 客户端封装 |
| `insights.ts` | AI 生成的摘要/观点/对比 |
| `search.ts` | AI Search 语料构建和查询 |
| `slug.ts` | URL slug 标准化 |
| `types.ts` | TypeScript 类型定义 |
| `cache.ts` | 缓存层（insights 等） |
| `markdown-example.ts` | Markdown 消息解析和归一化 |

## 约束

- **不要在这里直接 import React** —— 这是纯 Node.js 逻辑层
- **所有 content 查询必须过 `published: true` 过滤**
- **修改 `content.ts` 后必须跑 `npm run test` 验证**

## 路径别名

- 使用 `@/lib/...` 从 `src/` 外部引用
