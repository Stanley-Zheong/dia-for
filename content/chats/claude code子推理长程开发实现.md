---
title: 两小时工作效率分析与改进建议
source: https://claude.ai/chat/25345618-96ed-4e70-a8b5-22fa8ce454ce
author:
published: true
created: 2026-04-28
description: Claude conversation with 8 messages
tags:
  - clippings
---
##user
我现在有好几种尝试了， cursor+openspec claudecode+openspec cursor+openspec+dig 还有： discord+codex+superpowers slack+codex discord+openclaw 应该还有很多种，所以我想要的： 1.***基于spec

1. ****可以多模型，开发、编程可以不同模型完成
2. ***完善的验证/测试条件，
3. ****多个issures一起执行，无需人工干预，自动执行，不需要不停的yes or no，
4. ***指定工作流，需求确认、分析、编码、测试、代码提交合并、归档，下一个循环，出现错误，自动修复，然后再继续流程
5. ****可以发现问题，总结问题，沉淀经验
6. ****可以对一个大项目进行长期迭代。 这样的开发环境或规范，需要怎么实现。 现在是使用git，多仓库、不用考虑CI，现在想优先搞定流程中可以多个agent承担不同职责使用不同模型的问题。 请你给出具体建议，使用哪个组件，agent都包括哪些，怎么进行调度&在哪里配置。需要遵从什么规范，是否要对某些组件进行二次开发。给出具体配置方案， 不要提出一堆理论，要实际落地的东西；建议要充分结合实际情况，可以被顺畅运行，不要一步一个坑。



##claude



好，现在有足够的实际信息了。给你一个**完全落地的方案**，直接可以操作。

---

### 结论先行：用什么

**Claude Code 原生 Subagent 体系**，不需要任何第三方组件，不需要二次开发，今天就能跑。

你列的那些组合（cursor+openspec+dig、discord+codex等）都是**工具叠工具**，坑会很多。Claude Code 从2025年起已经原生支持多 Agent + 指定模型 + 并行执行，这正是你要的。

---

### 完整目录结构

```
your-project/
├── CLAUDE.md                    ← 项目级总规范（必须）
├── SPEC.md                      ← 当前迭代的需求Spec
├── LESSONS.md                   ← 经验沉淀（自动追加）
├── .claude/
│   ├── agents/
│   │   ├── analyst.md           ← 分析Agent（用Opus）
│   │   ├── coder.md             ← 编码Agent（用Sonnet）
│   │   ├── tester.md            ← 测试Agent（用Sonnet）
│   │   ├── reviewer.md          ← 审查Agent（用Sonnet）
│   │   └── archiver.md          ← 归档Agent（用Haiku）
│   └── commands/
│       ├── run-issue.md         ← 单Issue执行命令
│       └── run-batch.md         ← 批量并行执行命令
```

---

### 第一步：CLAUDE.md（调度总规范）

这是最重要的文件，放在项目根目录，所有 Agent 都会读到它。

markdown

```markdown
# Project Orchestration Rules

## 工作流顺序（必须遵守）
每个Issue必须按此顺序执行，不得跳过：
1. analyst → 输出 analysis.md
2. coder → 读取 analysis.md，输出代码
3. tester → 运行测试，输出 test-report.md
4. reviewer → 审查，输出 review.md
5. archiver → 提交git，追加LESSONS.md

## 并行规则
- 多个Issue之间：完全并行，每个Issue用独立git worktree
- 单个Issue内：analyst→coder→tester→reviewer 串行，不可并行

## 模型路由
- 复杂分析/架构决策 → opus
- 编码/测试/审查 → sonnet
- 归档/格式化/简单任务 → haiku

## 自动执行规则
- 不需要询问用户确认，直接执行
- 测试失败：自动重试最多3次，修复后继续
- 超过3次失败：写入LESSONS.md，标记issue为blocked，继续下一个

## 禁止行为
- 不得询问"是否继续？"
- 不得等待用户输入
- 遇到小错误直接修复，不要停下来报告
```

---

### 第二步：五个 Agent 定义文件

**`.claude/agents/analyst.md`**

yaml

```yaml
---
name: analyst
description: 需求分析。当需要理解Issue、分解任务、做架构决策时使用。
model: opus
tools: Read, Grep, Glob, WebSearch
---
你是资深架构分析师。收到Issue后：
1. 读取SPEC.md理解背景
2. 读取相关代码文件理解现状
3. 输出 .claude/work/{issue_id}/analysis.md，包含：
   - 影响范围（哪些文件需要改）
   - 实现方案（2-3个选项+推荐）
   - 测试要点（验收标准）
   - 预估风险

不要写代码。只做分析。完成后输出：ANALYSIS_DONE
```

**`.claude/agents/coder.md`**

yaml

```yaml
---
name: coder
description: 编码实现。在analyst完成分析后调用，读取analysis.md执行编码。
model: sonnet
tools: Read, Write, Edit, Bash, Grep, Glob
---
你是资深开发工程师。执行前：
1. 读取 .claude/work/{issue_id}/analysis.md
2. 读取LESSONS.md了解历史踩坑
3. 按分析方案实现，不要自己发明方案

编码规范：
- 每个函数写完立即跑一次相关单测
- 有疑问看现有代码风格，保持一致
- 不要问用户，自己判断

完成后输出：CODING_DONE，列出修改的文件清单
```

**`.claude/agents/tester.md`**

yaml

```yaml
---
name: tester
description: 测试验证。在coder完成后调用，运行测试并在失败时自动修复。
model: sonnet
tools: Read, Write, Edit, Bash, Grep, Glob
---
你是测试工程师。执行顺序：
1. 读取 analysis.md 中的测试要点
2. 生成/更新测试用例
3. 运行：npm test 或 pytest 或对应命令
4. 如果失败：
   - 分析错误原因
   - 修复代码（最多3次重试）
   - 每次修复后重新运行测试
5. 超过3次仍失败：
   - 写入 .claude/work/{issue_id}/test-report.md 标记FAILED
   - 把错误信息写入LESSONS.md
   - 输出：TEST_FAILED，停止

测试全部通过后输出：TEST_PASSED
```

**`.claude/agents/reviewer.md`**

yaml

```yaml
---
name: reviewer
description: 代码审查。测试通过后调用，检查代码质量和安全性。
model: sonnet
tools: Read, Grep, Glob, Bash
---
你是代码审查官。只读不写。检查：
1. git diff 查看所有改动
2. 对照 analysis.md 的方案检查实现是否符合
3. 安全问题（注入、权限、敏感信息）
4. 性能问题（明显的N+1、大循环）
5. 规范问题（命名、注释）

输出 .claude/work/{issue_id}/review.md：
- APPROVE：可以合并
- REQUEST_CHANGES：列出必须改的问题（coder重新处理）

不要提建议性修改，只标注必须修复的问题。
```

**`.claude/agents/archiver.md`**

yaml

```yaml
---
name: archiver
description: 归档提交。reviewer通过后调用，负责git操作和经验沉淀。
model: haiku
tools: Bash, Read, Write
---
你是归档专员。执行：
1. git add -A
2. git commit -m "feat(#{issue_id}): {issue标题}"
3. git push origin {branch_name}
4. 把这次的关键经验追加到 LESSONS.md：
   格式：## {date} Issue#{id} | {一句话总结} | 踩坑：{如有} | 解法：{方案}
5. 清理 .claude/work/{issue_id}/ 下的临时文件

完成后输出：ARCHIVED
```

---

### 第三步：命令文件

**`.claude/commands/run-issue.md`**

markdown

```markdown
---
description: 执行单个Issue的完整工作流
argument-hint: "<issue_id> <issue描述>"
---

## 执行 Issue $ARGUMENTS

按顺序调用以下Agent，每个完成后才能进入下一步：

1. 使用 analyst agent 分析 Issue $ARGUMENTS
2. 等待 ANALYSIS_DONE
3. 使用 coder agent 实现
4. 等待 CODING_DONE
5. 使用 tester agent 测试
6. 如果 TEST_FAILED → 停止，标记blocked
7. 如果 TEST_PASSED → 使用 reviewer agent 审查
8. 如果 REQUEST_CHANGES → 返回步骤3（最多2次）
9. 如果 APPROVE → 使用 archiver agent 归档
10. 输出：ISSUE_COMPLETE #{issue_id}
```

**`.claude/commands/run-batch.md`**

markdown

```markdown
---
description: 并行执行多个Issue
argument-hint: "<issue_id1> <issue_id2> <issue_id3>..."
---

## 并行执行多个Issue

将以下 Issue 各自在独立上下文中并行执行：
$ARGUMENTS

对每个Issue：
- 创建 git worktree：git worktree add .worktrees/{issue_id} -b fix/{issue_id}
- 在各自worktree目录中执行完整工作流（/run-issue）
- 完成后 git worktree remove .worktrees/{issue_id}

所有Issue完成后汇总输出结果。
```

---

### 第四步：启动方式

**单个Issue（调试用）：**

bash

```bash
cd your-project
claude --dangerously-skip-permissions
# 在 Claude Code 中输入：
/run-issue 42 "用户登录接口增加rate limiting"
```

**多个Issue并行（正式用）：**

bash

```bash
claude --dangerously-skip-permissions
# 输入：
/run-batch 42 43 44 45
```

**完全无人值守（挂着跑）：**

bash

```bash
claude --dangerously-skip-permissions -p "/run-batch 42 43 44 45" 2>&1 | tee run.log
```

---

### 模型成本控制（每个agent的model字段）

| Agent | 模型 | 理由 |
| --- | --- | --- |
| analyst | opus | 架构决策不能省，贵但关键 |
| coder | sonnet | 主力，平衡质量和成本 |
| tester | sonnet | 需要理解逻辑生成测试 |
| reviewer | sonnet | 安全检查不能用haiku |
| archiver | haiku | 纯机械操作，haiku够用 |

---

### 不需要的东西（省掉这些坑）

- ❌ OpenSpec —— CLAUDE.md + SPEC.md 够了，OpenSpec增加复杂度
- ❌ Discord/Slack/Codex —— 与这套体系没有集成点
- ❌ 任何Python编排脚本 —— Claude Code内置调度，不需要外部脚本
- ❌ Redis/任务队列 —— git worktree已经隔离并行环境

---

### 第一次运行前检查清单

bash

```bash
# 1. 确认 Claude Code 版本够新
claude --version   # 需要 >= 1.0

# 2. 确认 API 是 key 模式而不是 OAuth
echo $ANTHROPIC_API_KEY   # 要有值

# 3. 初始化 worktree 目录
mkdir -p .worktrees .claude/work

# 4. 把 .worktrees 加入 .gitignore
echo ".worktrees/" >> .gitignore
echo ".claude/work/" >> .gitignore
```

这套方案今天下午就能跑起来，先用单个 `/run-issue` 验证流程通，再开 `/run-batch` 并行。


##user

很好，但是也有个问题：

1. 项目背景知识在哪里积累？
2. 需求信息记录在哪里，从哪些维度记录，其实现方案是否要讨论并记录，开发的时候遵从。
3. 项目验收标准没有提及，怎么做验收呢？怎么判断验收通过了呢
4. 项目迭代周期长了，之前做了哪些功能，都怎么做的，完全不知道了啊

这些正是openspec尝试解决的问题吗，你完全没选它。怎么解决上面的问题呢

## claude

###
好问题。让我先看看 OpenSpec 实际能做什么，再给你判断。 好，现在我清楚了。先给你一个直接的判断，然后解决你的4个问题。

好问题。让我先看看 OpenSpec 实际能做什么，再给你判断。

Searched the web

Searched the web

好，现在我清楚了。先给你一个直接的判断，然后解决你的4个问题。

---

### 先说结论：OpenSpec 该不该用

OpenSpec 解决的核心问题是：**每个功能变更有结构化的提案→设计→任务→归档记录**，这恰好覆盖你的问题2、4。

它**不解决**的：项目背景知识库（问题1）、验收标准执行（问题3）。

所以答案是：**用 OpenSpec 管 Spec 层，用上一版方案管 Agent 执行层，两者组合**。不是二选一。

---

### 修订后的完整目录结构

```
your-project/
├── CLAUDE.md                        ← Agent调度规范（不变）
├── LESSONS.md                       ← 经验沉淀（不变）
│
├── openspec/                        ← OpenSpec接管Spec层
│   ├── project.md                   ← ★ 问题1：项目背景知识库
│   ├── AGENTS.md                    ← AI读取规范的入口
│   ├── specs/                       ← ★ 问题4：当前系统完整状态
│   │   ├── features/                ← 已上线功能的Spec
│   │   └── architecture.md          ← 架构决策记录
│   └── changes/                     ← ★ 问题2：需求记录
│       ├── active/
│       │   └── feat-xxx/
│       │       ├── proposal.md      ← 为什么做，背景，范围
│       │       ├── specs/           ← GIVEN/WHEN/THEN验收场景
│       │       ├── design.md        ← 技术方案（讨论并锁定）
│       │       └── tasks.md         ← 实现拆解清单
│       └── archive/                 ← 历史变更存档
│           └── 2025-01-23-feat-xxx/ ← 完成后合并进specs/
│
└── .claude/
    ├── agents/                      ← Agent定义（同上一版）
    └── commands/
        ├── new-feature.md           ← 新需求入口命令
        └── run-issue.md             ← 执行命令（调整）
```

---

### 问题1：项目背景知识在哪里积累

**文件：`openspec/project.md`**

初始化时让 AI 内省项目，填写 `openspec/project.md`，产出约250行的结构化项目描述。 [Hashrocket](https://hashrocket.com/blog/posts/openspec-vs-spec-kit-choosing-the-right-ai-driven-development-workflow-for-your-team)第一次运行：

bash

```bash
npm install -g @fission-ai/openspec
cd your-project
openspec init   # 选择 Claude Code
# 然后在 Claude Code 里：
# "请内省我的项目，填写 openspec/project.md"
```

`project.md` 的内容结构：

markdown

```markdown
# 项目背景

## 业务背景
- 这个项目是什么，解决什么问题
- 目标用户是谁
- 核心业务约束（如：合规要求、性能红线）

## 技术栈
- 前端：...
- 后端：...
- 数据库：...
- 主要依赖库及版本

## 架构原则
- 我们遵守的设计决策（如：所有API必须版本化）
- 我们主动避免的模式（如：不用全局状态）

## 代码规范
- 命名约定
- 错误处理方式
- 测试覆盖要求

## 关键模块说明
- 模块A：负责什么，核心逻辑在哪里
- 模块B：...
```

**关键：这个文件是活文档，每次架构决策变化时更新它。** 所有 Agent 启动时都会读 `openspec/AGENTS.md`，里面指向 `project.md`，确保每个 Agent 都有项目背景。

---

### 问题2：需求信息从哪些维度记录，方案是否讨论

**每个需求对应 `openspec/changes/active/{feature-name}/` 下四个文件。**

流程是：先跑 `/opsx:propose`，人工审查确认，再跑 Agent 执行。

**`proposal.md`** — 为什么做

markdown

```markdown
## 背景
用户反馈登录超时没有提示，直接跳转导致数据丢失。

## 目标
用户在 token 过期前5分钟收到警告，可以选择续期或保存。

## 范围
- 涉及：auth模块、前端弹窗组件
- 不涉及：后端session存储（不改）

## 风险
- 与现有的"记住我"功能有交互，需要验证
```

**`specs/`** — ★ 问题3的核心，GIVEN/WHEN/THEN 格式的验收场景

markdown

```markdown
## 场景1：正常续期
GIVEN 用户已登录且token剩余5分钟
WHEN  系统检测到剩余时间
THEN  弹出续期提示框
AND   用户点击续期后token刷新成功
AND   提示框消失

## 场景2：用户忽略提示
GIVEN 弹出续期提示
WHEN  用户不操作，token过期
THEN  自动登出
AND   跳转到登录页
AND   显示"会话已过期"提示，不丢失当前表单数据

## 场景3：边界——已是最长续期
GIVEN 用户已达到最大续期次数（3次）
WHEN  token即将过期
THEN  不显示续期选项
AND   只显示"请保存工作后重新登录"
```

**`design.md`** — 技术方案讨论并锁定

markdown

```markdown
## 方案选择

### 方案A：前端轮询（推荐）
- 每60秒检查一次token剩余时间
- 优点：简单，不需要WebSocket
- 缺点：有最多60秒延迟

### 方案B：后端推送
- 需要WebSocket支持
- 优点：精确
- 缺点：增加架构复杂度，当前项目不值得

## 决定：选方案A

## 实现细节
- 检查逻辑放在 AuthService.checkTokenExpiry()
- 弹窗组件：SessionWarningModal
- 存储续期次数：localStorage key='renewal_count'
```

**`tasks.md`** — 实现拆解，Agent 直接按这个执行

markdown

```markdown
- [ ] 1.1 AuthService 增加 checkTokenExpiry() 方法
- [ ] 1.2 在 App.tsx 挂载时启动定时器
- [ ] 2.1 创建 SessionWarningModal 组件
- [ ] 2.2 实现续期按钮调用 refreshToken API
- [ ] 3.1 编写场景1的集成测试
- [ ] 3.2 编写场景2的集成测试
- [ ] 3.3 编写场景3的边界测试
```

---

### 问题3：验收标准怎么执行，怎么判断通过

**`specs/` 里的 GIVEN/WHEN/THEN 就是验收标准，tester Agent 直接对照执行。**

修改 `tester.md` Agent：

yaml

```yaml
---
name: tester
description: 测试验证Agent
model: sonnet
tools: Read, Write, Edit, Bash, Grep, Glob
---
执行前，先读取：
1. openspec/changes/active/{feature}/specs/ — 这是验收标准，必须全部通过
2. openspec/project.md — 了解测试框架

验收流程：
1. 对每个 GIVEN/WHEN/THEN 场景，编写对应的测试用例
2. 场景描述即测试用例名称，保持一致，便于追溯
3. 运行测试
4. 输出验收报告：
   - 场景X：PASS / FAIL（附失败原因）
5. 所有场景PASS → 输出 ACCEPTANCE_PASSED
6. 任何场景FAIL → 最多重试3次修复 → 仍失败输出 ACCEPTANCE_FAILED

判断通过的标准：specs/里每一个场景对应的测试用例全部为绿。
```

**这样验收就是客观的**：不是"感觉差不多"，而是场景1通过、场景2通过、场景3通过，全部绿灯才算验收通过。

---

### 问题4：长期迭代，之前的功能怎么追溯

OpenSpec 把当前系统状态（`specs/`）和历史变更（`archive/`）分开存放，archive 里保留每次变更的完整提案和设计，形成审计追踪，让人能理解每个决策是如何和为何做出的。 [Intent-driven](https://intent-driven.dev/knowledge/openspec/)

每次 `/opsx:archive` 执行后：

- 这次变更的 proposal/specs/design/tasks 打包进 `archive/2025-01-23-feat-xxx/`
- delta spec 合并进 `openspec/specs/features/`，更新当前系统状态

**六个月后想知道"登录续期是怎么做的"**：

```
openspec/
├── specs/features/auth.md          ← 当前状态（含续期功能描述）
└── archive/2025-01-23-feat-login-renewal/
    ├── proposal.md                  ← 当时为什么做
    ├── design.md                    ← 当时选了什么方案，为什么
    └── specs/                       ← 当时的验收标准
```

`openspec list` 可以看所有历史变更列表，`openspec show feat-login-renewal` 可以看详情。

---

### 完整工作流（修订版）

```
需求来了
    ↓
/opsx:propose {feature-name}     ← OpenSpec 生成提案结构
    ↓
人工填写/审查 proposal.md + specs/ + design.md
（这是唯一需要人工介入的环节）
    ↓
/run-issue {feature-name}        ← Claude Code Agent 接管
    ├── analyst 读 design.md → 确认实现路径
    ├── coder 读 tasks.md → 编码
    ├── tester 读 specs/ → 对照验收场景测试
    ├── reviewer 审查
    └── archiver 提交 + 触发 /opsx:archive
    ↓
openspec/specs/ 更新，archive/ 存档
    ↓
下一个需求
```

**安装 OpenSpec 只需要两行命令：**

bash

```bash
npm install -g @fission-ai/openspec
openspec init   # 在项目根目录，选 Claude Code
```

然后 `openspec/AGENTS.md` 会自动生成，Claude Code 的所有 Agent 都能读到它，不需要额外配置。


##user

我想让coder和test使用不同模型，这样可以相互印证，还需要做哪些可以让他们

1. 流程衔接顺畅
2. 同用文件系统的记录，比如feature的描述、技术实现设定、测试范围等
3. 出现问题可以相互告知。


## claude
### Claude responded: 好问题，这是多Agent协作最精细的地方。先搞清楚一个关键限制。 有一个重要的现实情况需要先告诉你，再给方案。

好问题，这是多Agent协作最精细的地方。先搞清楚一个关键限制。

Searched the web

Searched the web

有一个重要的现实情况需要先告诉你，再给方案。

---

### 先说清楚一个坑

Claude Code 目前对 `model:` frontmatter 字段的支持存在争议——有 issue 记录显示该字段在运行时并不被实际尊重，`CLAUDE_CODE_SUBAGENT_MODEL` 环境变量会覆盖所有 agent 的模型设置。 [GitHub](https://github.com/affaan-m/everything-claude-code/issues/173)

还有实测记录显示：即使 Opus 主会话注册了 Sonnet subagent，在7次运行中 delegation 工具调用次数为零——subagent 被读取、解析、列出，但从未被真正调用。 [AkitaOnRails](https://akitaonrails.com/en/2026/04/18/llm-benchmarks-part-2-multi-model/)

**所以"coder 用 Sonnet、tester 用 Opus"这个目标，现在有两条路：**

- **路线A**：继续用 Claude Code 原生 subagent，接受模型路由不稳定的现实，靠文件系统协议解决你的3个问题（衔接、共享记录、互告问题）
- **路线B**：用两个独立的 `claude -p` 进程，各自传 `--model` 参数，用文件系统作为进程间通信，彻底绕开模型路由问题

**推荐路线B**，原因：模型指定100%可控，文件协议反而更清晰。下面给你完整方案。

---

### 核心设计：共享工作目录 + 状态文件协议

两个 Agent 用**同一套目录结构**通信，不靠函数调用，只靠读写文件。

```
.claude/work/{feature-id}/
├── context.md          ← 共享上下文（两个Agent都读）
├── coder-output.md     ← Coder写，Tester读
├── test-report.md      ← Tester写，Coder读（失败时）
└── handshake.md        ← 状态机：记录当前在哪步、出了什么问题
```

---

### 第一步：context.md — 两个Agent的共同语言

这个文件在 coder 启动前由 orchestrator 生成，**两个 Agent 启动时必须先读这一个文件**。

markdown

```markdown
# Feature Context: {feature-id}

## 来源
- OpenSpec: openspec/changes/active/{feature-id}/
- 任务清单: openspec/changes/active/{feature-id}/tasks.md

## 功能描述
{从 proposal.md 摘取的一句话描述}

## 技术实现约定
{从 design.md 摘取的关键决策，例如：}
- 用方案A（前端轮询），不用WebSocket
- 新增 AuthService.checkTokenExpiry() 方法
- 弹窗组件命名：SessionWarningModal
- localStorage key: 'renewal_count'

## 验收场景（Tester必须全部覆盖）
{从 openspec/changes/active/{feature-id}/specs/ 完整复制}
- 场景1: GIVEN...WHEN...THEN
- 场景2: ...
- 场景3: ...

## 文件边界
Coder 负责写：
- src/services/AuthService.ts
- src/components/SessionWarningModal.tsx

Tester 负责写：
- tests/auth/session-renewal.test.ts

## 禁区（两个Agent都不得碰）
- src/legacy/  （旧模块，本次不动）
- database/migrations/  （本次不涉及）
```

**为什么这么做**：coder 和 tester 的上下文窗口是独立的，它们之间唯一可靠的信息通道就是文件。把所有约定写进 `context.md`，等于给两个 Agent 一份相同的"工作说明书"，避免各自理解偏差。

---

### 第二步：handshake.md — 状态机和问题通知

这是两个 Agent 互告问题的机制，格式要固定，方便 orchestrator 脚本解析。

markdown

```markdown
# Handshake: {feature-id}

## 当前状态
STATUS: CODER_DONE
# 状态枚举：CODER_RUNNING | CODER_DONE | CODER_BLOCKED
#           TESTER_RUNNING | TESTER_DONE | TESTER_BLOCKED | ACCEPTED

## Coder → Tester 交接
CODER_COMPLETE_TIME: 2025-01-23 14:32
CHANGED_FILES:
- src/services/AuthService.ts (新增 checkTokenExpiry 方法，L45-L78)
- src/components/SessionWarningModal.tsx (新增组件)
CODER_NOTES:
- checkTokenExpiry 返回秒数，-1 表示已过期，调用方自行判断阈值
- SessionWarningModal 接受 onRenew / onDismiss 两个 callback prop
- 注意：renewal_count 存在 localStorage，Tester 测试前需要 clear

## Tester → Coder 反馈（测试失败时填写）
TEST_FAIL_TIME:
FAILED_SCENARIOS:
FAIL_DETAILS:
REPRODUCTION_STEPS:
SUSPECTED_CAUSE:
```

**Coder 完成后写**：填 `STATUS: CODER_DONE` + `CODER_NOTES`，然后停止，不再动文件。

**Tester 读到 `CODER_DONE` 后启动**，测试失败时回填 `Tester → Coder` 区块，`STATUS` 改为 `TESTER_BLOCKED`。

**Orchestrator 轮询这个文件**决定下一步派谁上。

---

### 第三步：两个独立进程的启动脚本

**`scripts/run-feature.sh`**

bash

```bash
#!/bin/bash
FEATURE=$1  # 例如：feat-session-renewal
WORK_DIR=".claude/work/$FEATURE"
SPEC_DIR="openspec/changes/active/$FEATURE"

mkdir -p "$WORK_DIR"

# 1. 生成 context.md（orchestrator 负责，用 Sonnet 即可）
claude -p --model claude-sonnet-4-6 "
读取以下文件，生成 $WORK_DIR/context.md：
- $SPEC_DIR/proposal.md
- $SPEC_DIR/design.md
- $SPEC_DIR/specs/
- $SPEC_DIR/tasks.md

格式严格按照 .claude/templates/context-template.md
" 

# 2. 启动 Coder（Sonnet，擅长执行）
echo "STATUS: CODER_RUNNING" > "$WORK_DIR/handshake.md"

claude -p --model claude-sonnet-4-6 \
  --dangerously-skip-permissions \
  "你是 Coder Agent。
  
  第一步必须读取：$WORK_DIR/context.md
  
  按 tasks.md 清单逐项实现，完成后：
  1. 在 $WORK_DIR/coder-output.md 记录实现摘要
  2. 在 $WORK_DIR/handshake.md 填写 CODER_DONE 区块
  3. 将 STATUS 改为 CODER_DONE
  4. 停止，不要继续" 2>&1 | tee "$WORK_DIR/coder.log"

# 3. 等待 Coder 完成（简单轮询）
while ! grep -q "STATUS: CODER_DONE" "$WORK_DIR/handshake.md" 2>/dev/null; do
  sleep 10
done

echo "Coder 完成，启动 Tester..."

# 4. 启动 Tester（Opus，擅长质疑和边界发现）
echo "STATUS: TESTER_RUNNING" >> "$WORK_DIR/handshake.md"

claude -p --model claude-opus-4-7 \
  --dangerously-skip-permissions \
  "你是 Tester Agent，使用不同于 Coder 的模型，目的是独立验证。

  第一步必须读取：
  1. $WORK_DIR/context.md  （理解验收场景和技术约定）
  2. $WORK_DIR/handshake.md （读取 Coder 的交接说明）

  任务：
  - 对 context.md 中每个验收场景，编写并运行对应测试
  - 特别关注 handshake.md 里 CODER_NOTES 提到的注意事项
  - 不要修改 Coder 写的业务代码，只写测试文件

  测试全部通过：
  - 写 $WORK_DIR/test-report.md，STATUS 改为 TESTER_DONE

  有场景失败（重试3次后）：
  - 在 handshake.md 填写 Tester→Coder 反馈区块
  - STATUS 改为 TESTER_BLOCKED
  - 停止" 2>&1 | tee "$WORK_DIR/tester.log"

# 5. 处理结果
STATUS=$(grep "^STATUS:" "$WORK_DIR/handshake.md" | tail -1 | cut -d' ' -f2)

if [ "$STATUS" = "TESTER_DONE" ]; then
  echo "✅ 验收通过，触发 archiver..."
  claude -p --model claude-haiku-4-5 \
    "读取 $WORK_DIR/handshake.md，执行 git add/commit/push，
     然后运行 /opsx:archive $FEATURE，
     追加经验到 LESSONS.md"
elif [ "$STATUS" = "TESTER_BLOCKED" ]; then
  echo "❌ 测试失败，重启 Coder 修复..."
  # 重新触发 Coder，传入 test-report
  # （最多重试2次，超过则人工介入）
fi
```

---

### 第四步：Coder 和 Tester 的 Agent 定义

**`.claude/agents/coder.md`**（执行角色，用 Sonnet）

yaml

```yaml
---
name: coder
description: 编码实现Agent。接到任务后严格按 context.md 的技术约定实现，完成后写 handshake.md。
model: sonnet
tools: Read, Write, Edit, Bash, Grep, Glob
---
你的工作方式：

启动时，必须先读：
1. .claude/work/{feature}/context.md — 理解约定和边界
2. openspec/changes/active/{feature}/tasks.md — 你的任务清单

实现原则：
- context.md 里写了用哪个方案就用哪个方案，不要自己发明
- 只改"文件边界"里属于你的文件，不碰禁区
- 每完成一个 task，在 tasks.md 里打勾 [x]

完成后写 handshake.md 的 CODER_DONE 区块：
- 列出改了哪些文件的哪些行
- 写清楚 Tester 需要知道的注意事项（如：测试前需要 mock 什么）
- 把 STATUS 改为 CODER_DONE

如果收到 TESTER_BLOCKED 通知（handshake.md 里有 Tester 反馈）：
- 先读 FAIL_DETAILS 和 REPRODUCTION_STEPS
- 修复后更新 handshake.md，STATUS 改回 CODER_DONE
```

**`.claude/agents/tester.md`**（质疑角色，用 Opus）

yaml

```yaml
---
name: tester
description: 测试验证Agent。独立于Coder进行验证，以质疑者视角检验实现是否符合验收场景。
model: opus
tools: Read, Write, Edit, Bash, Grep, Glob
---
你的角色定位：你是独立质检员，不是 Coder 的助手。

启动时，必须先读：
1. .claude/work/{feature}/context.md — 验收场景是你的唯一标准
2. .claude/work/{feature}/handshake.md — 读 Coder 的交接说明

测试策略（比 Coder 更严格）：
- 每个 GIVEN/WHEN/THEN 场景必须有对应的测试用例，名称要一致
- 重点测试 CODER_NOTES 里提到的边界情况
- 主动寻找场景之间的交互问题（场景A + 场景B 同时发生会怎样）
- 测试数据不要用魔法数字，要能解释为什么选这个值

失败时的反馈格式（写进 handshake.md）：
FAILED_SCENARIOS: 场景2
FAIL_DETAILS: 当 renewal_count=3 时，弹窗仍然显示续期按钮
REPRODUCTION_STEPS:
  1. localStorage.setItem('renewal_count', '3')
  2. 触发 token 即将过期
  3. 观察弹窗内容
SUSPECTED_CAUSE: SessionWarningModal 没有读取 renewal_count，
                 只收了 onRenew prop，判断逻辑应该在组件内部

这个反馈要让 Coder 不问你任何问题就能直接复现和修复。
```

---

### 整体流程图

```
/run-feature feat-xxx
      ↓
  生成 context.md
  （两个Agent的共同语言）
      ↓
  Coder (Sonnet) 启动
  读 context.md + tasks.md
  ↓ 写 handshake.md: CODER_DONE
  ↓ 写 coder-output.md
      ↓
  Tester (Opus) 启动
  读 context.md + handshake.md
  独立对照验收场景测试
      ↓
  ┌── PASS ──→ handshake: TESTER_DONE → Archiver
  │
  └── FAIL ──→ handshake: TESTER_BLOCKED
                Coder 读反馈，修复
                最多循环2次
                超过 → 人工介入
```

---

### 为什么这样设计能解决你的3个问题

**衔接顺畅**：Tester 不靠 Coder 口头汇报，靠读文件。文件在，衔接必然发生；文件不在，脚本不启动 Tester。状态机清晰，没有歧义。

**共用文件系统记录**：`context.md` 是单一事实来源。feature 描述、技术约定、测试范围，全部在这一个文件里，两个 Agent 读的是同一份，不会各自理解一套。

**出现问题相互告知**：`handshake.md` 是专用的问题通道。Tester 失败时必须写够信息（复现步骤 + 怀疑原因），格式固定，Coder 重启时强制先读这个文件，不会出现"不知道哪里失败了"的情况。