## Context

当前 chat 详情页通过 `getChatInsights(chat)` 获取 AI 生成的 insights，结果包含 `summary`、`viewpoints`、`conclusions`、`references`。这些内容由 Gemini API 生成并缓存。

用户希望改为人工撰写的 Markdown 内容，存储在 frontmatter 的 `insights` 字段。

## Goals / Non-Goals

**Goals:**
- 在 frontmatter 支持 `insights` 字段存储多行 Markdown
- 右侧面板优先显示人工 `insights`，Markdown 渲染
- 无 insights 时显示友好的占位符
- 简化数据流，移除 chat 级 AI 生成依赖

**Non-Goals:**
- 不修改 Topic comparison 的 AI 生成逻辑（保留）
- 不迁移现有 AI 生成的 insights 到 frontmatter
- 不做 insights 编辑界面（Obsidian 是编辑入口）

## Decisions

### 1. insights 字段存储格式

**决定**：在 frontmatter 中使用 YAML 多行字符串（`|` 语法）

```yaml
---
title: "..."
insights: |
  ## 核心价值

  这篇对话展示了...

  ## 关键收获

  - 收获 1
  - 收获 2
---
```

**理由**：
- YAML `|` 语法天然支持保留换行的多行字符串
- gray-matter 库自动处理
- 和现有 frontmatter 格式一致

### 2. TypeScript 类型变更

**决定**：`ChatRecordMeta` 新增可选 `insights?: string` 字段

**理由**：字段可选，向后兼容，现有 content 文件无需改动

### 3. 右侧面板渲染

**决定**：使用现有的 `MarkdownContent` 组件渲染 insights

**理由**：
- 复用现有 Markdown 渲染能力（react-markdown + remark-gfm + rehype-highlight）
- 保持和中间栏一致的视觉风格

### 4. 占位符设计

**决定**：无 insights 时显示静态文案

```
暂无价值提炼

这篇对话记录保留了原始内容，欢迎在 Obsidian 中补充你的思考。
```

**理由**：简单明确，鼓励用户补充内容

### 5. AI insights 迁移策略

**决定**：不迁移，逐步手动补充

**理由**：
- AI 生成的内容质量参差，不值得自动迁移
- 手动补充能确保每篇都有人工审视

## Risks / Trade-offs

**[Frontmatter 过长]** → 长 insights 会让 frontmatter 变大
- Mitigation：insights 预期 100-500 字，可接受；如果太长考虑改用 sidecar 文件

**[Markdown 渲染安全]** → 人工内容可能包含意外格式
- Mitigation：react-markdown 默认安全，不执行脚本

## Files to Update

**修改:**
- `src/lib/types.ts` — `ChatRecordMeta` 新增 `insights?: string`
- `src/lib/content.ts` — frontmatter schema 新增 `insights` 字段
- `src/app/chats/[slug]/page.tsx` — 移除 `getChatInsights()` 调用，改用 `meta.insights` + Markdown 渲染
- `docs/acceptance.md` — 更新 Chat Detail 验收标准

**可选更新（示例）:**
- `content/chats/ai-coding-tools-chatgpt.md` — 添加示例 insights 内容

## Impact on content:manifest

无影响。`insights` 字段会被包含在 manifest 的 meta 中，但不影响 published 过滤或其他逻辑。
