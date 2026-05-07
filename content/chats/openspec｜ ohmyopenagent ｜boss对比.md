---
tags:
  - openspec
  - ohmyopenagent
  - boss
  - DIG
  - vibe-coding
  - harness
author:
  - cursor
published: true
created:
title: 几种harness对比
---






是的，你观察得很准确：OpenSpec 的默认 `spec-driven` 流程，天然偏“快速落文档”，不是“强制先问很多问题”。

## OpenSpec 内定流程（spec-driven）

大体是这条线：

1. `proposal`：先把想法落成“Why + What + Capabilities”
2. `specs`：按 capability 写需求条款（`SHALL/MUST + Scenario`）
3. `design`：写怎么实现（架构、决策、风险）
4. `tasks`：拆成可执行任务
5. `apply`：按任务实施并勾选
6. `archive`：归档变更

所以你说完一句话，它“马上落到 md”——从工具设计上是允许、甚至鼓励的（先成文，再迭代）。

---

## 为什么它可能“不提问就落文档”

不是因为流程要求“不能提问”，而是因为默认策略通常是：

- 信息“看起来够”就先写草案，保持推进速度；
- 只有遇到明显阻断才强制提问；
- 很多 agent 模板会“先给可运行初稿，再补澄清”。

这就是你看到的现象：第二次一句话也能产出文档。

---

## 这会不会有问题

会，有风险，尤其在你这种复杂项目里：

- 边界误判（范围漂移）
- 验收口径缺失
- 技术选型/合规被默认
- 后续返工大

所以你前面提的“先全流程思考+苏格拉底式提问”是对的。

---

## 关键结论

- OpenSpec 内定流程本身不是“必须先问清再写”；
- 它是“可以快速写草案，再迭代修正”；
- 你要更严格，需要在命令/规则里加门禁（例如“未完成关键澄清不得生成 proposal”）。

openspec， 快速开始、快速更新、快速迭代。
中间会停顿，每个spec都不会很大


你是否拥有 Claude Pro/Max 订阅？如果是，是否在 max20（20x mode）？
有，普通
你是否拥有 OpenAI/ChatGPT Plus 订阅？（提供 GPT-5.5 给 Oracle 代理）
没有
你是否要集成 Gemini 模型？
集成
你是否拥有 GitHub Copilot 订阅？
没有
你是否拥有 OpenCode Zen（opencode/ 模型）访问权限？
有
你是否拥有 Z.ai Coding Plan 订阅？
没有
你是否拥有 OpenCode Go 订阅？（$10/月，提供 GLM-5、Kimi K2.5、MiniMax M2.7）
没有
你是否拥有 Kimi for Coding 订阅？
没有
你是否使用 Vercel AI Gateway？
否

![[Pasted image 20260507162207.png]]