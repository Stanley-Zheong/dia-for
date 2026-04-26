# AGENTS.md — content/

> Obsidian Markdown 源文件目录。这是 dia-for 的唯一内容真源。

## 目录结构

```
content/
└── chats/          # AI 聊天记录 Markdown 文件
    └── *.md
```

## Frontmatter 字段

```yaml
---
title: "聊天标题"           # 必填
topic: "话题名称"           # 必填
models:                      # 必填
  - ChatGPT
  - Claude
published: true              # 必须为 true 才会发布
created: 2026-04-25          # 可选
tags:                        # 可选
  - tag1
  - tag2
insights: |                  # 可选，人工撰写的价值提炼
  ## 核心价值
  
  这篇对话展示了...
  
  ## 关键收获
  
  - 收获 1
  - 收获 2
---
```

### insights 字段说明

- 使用 YAML `|` 语法存储多行 Markdown
- 内容会在聊天详情页右侧面板渲染
- 支持完整 Markdown 格式（链接、列表、粗体等）
- 如果没有 `insights` 字段，右侧面板显示占位符

## Slug 生成规则

- 文件名（不含 `.md`）→ URL slug
- 通过 `lib/slug.ts` 标准化

## 约束

- **不要用代码修改这里的文件** —— 内容管理在 Obsidian 中进行
- **测试 fixture 可以添加到这里**，但必须设置 `published: false` 除非是真正要发布的内容
- **frontmatter 格式必须正确**，否则 `content:manifest` 会失败
