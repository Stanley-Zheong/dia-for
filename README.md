# dia-for

`dia-for` 是一个采用 OpenSpec 工作流尝试启动的全新公开项目，用来记录、整理和发布我与各种 AI / 大模型对话过程中产生的思考、体会和判断。

这个项目不是一个传统博客，也不是另一个个人知识库。个人知识沉淀仍然发生在 Obsidian 中，`dia-for` 更像是一个公开发布层：把已经整理好的 AI 对话记录发布出来，并围绕这些对话继续做检索、总结、观点提取和多模型对比。

## 项目定位

我会把和 AI 对话中有长期价值的内容整理到这里，包括但不限于：

- 技术实现方案：前端、后端、工程化、架构设计、工具链选择等。
- 商业模式探索：产品机会、定价假设、增长路径、市场判断等。
- 大模型开发：AI Coding、Agent 工作流、Prompt、RAG、AI Search、多模型比较等。
- 个人实践体会：使用不同模型和工具后的经验、局限、误判和收获。

核心目标是保留“人和模型共同思考”的过程，而不只是输出一篇被整理过的结论文章。

## 为什么用 OpenSpec

这个项目从一开始就尝试采用 OpenSpec 来驱动需求和实现：

- 先把想做的事情写成 change proposal。
- 再拆成 design、specs 和 tasks。
- 最后按任务逐步实现。

这让项目从第一天起就有比较清晰的意图、边界和验收标准。对于一个会持续演化的公开内容站来说，这种方式也方便以后回看每个功能为什么被加入、当时考虑过哪些取舍。

当前 MVP 的 OpenSpec change 是：

```text
build-public-chat-archive-mvp
```

## 当前 MVP

当前版本实现了一个公开 AI 聊天记录站的基础能力：

- 从 Obsidian 导出的 Markdown 中读取内容。
- 只发布 frontmatter 中 `published: true` 的记录。
- 按 ChatGPT / Claude 等大模型聊天布局展示多轮对话。
- 支持首页、聊天详情页、话题页、模型页和搜索页。
- 支持右侧摘要、观点和多模型对比面板。
- 支持 Gemini AI Search，并在回答中展示来源记录。
- 保留原始 Markdown，AI 总结和对比只是派生层。

## 内容发布流程

预期内容流是：

```text
我与大模型聊天
    ↓
Obsidian Web Clipping 保存为 Markdown
    ↓
在 Obsidian 中整理 frontmatter 和正文
    ↓
设置 published: true
    ↓
dia-for 读取并发布到公开网站
```

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
---
```

## 技术栈

- Next.js
- React
- TypeScript
- Tailwind CSS
- Obsidian Markdown + frontmatter
- Gemini API
- OpenSpec

## 本地开发

安装依赖：

```bash
npm install
```

复制环境变量：

```bash
cp .env.example .env
```

启动开发服务：

```bash
npm run dev
```

常用检查：

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

## 环境变量

```bash
OBSIDIAN_CONTENT_DIR=content/chats
NEXT_PUBLIC_SITE_NAME=dia-for
NEXT_PUBLIC_SITE_DESCRIPTION="Public AI conversation archive."
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.5-flash
```

如果没有配置 `GEMINI_API_KEY`，站点仍可构建和浏览；AI Search 和 insight 生成会使用本地降级结果。

## 项目状态

这是一个早期公开项目。当前重点是先把 Obsidian 到公开站点的发布链路跑通，然后逐步扩展：

- 更稳定的聊天记录解析格式。
- 更好的多模型观点对比。
- 更强的 AI Search 和引用机制。
- 更适合公开阅读的视觉设计。
- 对商业模式、AI 产品和大模型开发主题的持续沉淀。

## License

暂未选择开源许可证。项目代码和内容当前公开可见，但不代表自动授予复用、分发或商业使用授权。
