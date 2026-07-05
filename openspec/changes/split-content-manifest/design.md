## Context

当前 `src/generated/content-manifest.json` 是一个单体 JSON 文件（当前 764KB，9篇文章），包含所有 published chats 的完整内容。随着文章数量增加，这个文件会线性增长，带来以下问题：
- 构建时需要加载整个大文件到内存
- 任何单篇文章修改都需要重新传输整个 manifest
- 首页/列表页只需要元数据，却被迫加载完整内容

需要将单体 manifest 拆分为多文件架构，实现按需加载。

## Goals / Non-Goals

**Goals:**
- 将单体 manifest 拆分为轻量索引 + 单篇内容文件
- 首页/列表页只加载轻量索引（元数据）
- 单篇 chat 页面按需从独立文件加载完整内容
- 保持现有 API 兼容，平滑迁移
- 减少构建和运行时的内存占用

**Non-Goals:**
- 不引入外部数据库或缓存系统
- 不改变 published 过滤语义
- 不改变内容解析逻辑（只改变存储方式）
- 不优化图片/附件处理（那是另一个 change）

## Decisions

### 1. 文件结构：index.json + chats/{slug}.json

**决策**: 使用 `src/generated/content-index.json` 作为轻量索引，`src/generated/chats/{slug}.json` 存储单篇完整内容
**理由**:
- 清晰的分离：索引只含元数据，内容文件含完整数据
- 便于按需加载：路由 `[slug]` 直接读取对应文件
- 兼容现有 slug 命名：直接使用 URL slug 作为文件名

**结构示例**:
```
src/generated/
├── content-index.json          # 轻量索引（所有 chats 的元数据）
└── chats/
    ├── harness.json             # 单篇完整内容
    ├── agent.json
    └── ...
```

### 2. 索引文件内容：只保留元数据和引用

**决策**: `content-index.json` 只包含 `slug`, `meta`, `aliases`, `parseStatus`，不包含 `rawMarkdown` 和 `messages`
**理由**:
- 大幅降低索引文件大小
- 列表页/首页只需要元数据渲染卡片
- 完整内容通过 `slug` 引用到独立文件读取

### 3. 内容文件格式：保持现有结构

**决策**: 单篇内容文件 `{slug}.json` 保持现有的完整结构（含 `rawMarkdown`, `messages`, `meta` 等）
**理由**:
- 便于向后兼容
- 单篇页面可以直接使用现有组件渲染
- 不需要修改 ChatMessage 等组件

### 4. 按需加载策略：Server Component 中直接读取

**决策**: 在 Next.js Server Component 中使用 `fs.readFile` 直接读取单篇文件
**理由**:
- Server Component 支持直接文件系统访问
- 不需要额外的 HTTP 请求
- 配合 Next.js 缓存机制，文件会被自动缓存

### 5. 向后兼容性：保留原文件作为过渡

**决策**: 先生成新的多文件结构，保留原 `content-manifest.json` 一个版本作为过渡
**理由**:
- 便于逐步迁移代码
- 如果出现问题可以快速回滚
- 最终版本再删除原文件

## Risks / Trade-offs

| Risk | Mitigation |
|------|-----------|
| 文件数量过多影响文件系统性能 | 使用扁平结构 `chats/{slug}.json`，避免深层嵌套；实测 <1000 文件无问题 |
| 按需加载增加 I/O 操作 | Server Component 文件读取有缓存；Next.js 静态生成时只读一次 |
| 索引和内容文件不一致 | 生成时原子操作：先写内容文件，最后写索引；两者同时重新生成 |
| 代码迁移遗漏 | 保留原文件一个版本，逐步迁移；添加类型检查确保 API 兼容 |
| 构建产物目录变大 | gitignore 排除 `src/generated/`，只影响部署包大小（可接受） |

## Migration Plan

**部署步骤**:
1. 修改 `scripts/generate-content-manifest.mjs` 生成多文件结构
2. 新增 `src/lib/content.ts` 中的按需加载函数 `getChatBySlugV2`
3. 逐步将路由从 `getAllChats()` + 过滤 改为 `getChatIndex()` + `getChatBySlug()`
4. 验证所有页面正常渲染
5. 删除旧的 `content-manifest.json` 生成逻辑

**回滚策略**:
- 保留原生成逻辑，通过配置切换
- 或保留原文件一个版本，新代码读取新文件，旧代码读取旧文件

**需要更新的文件**:
- `scripts/generate-content-manifest.mjs` - 核心修改：生成多文件
- `src/lib/content.ts` - 新增按需加载函数，修改现有函数
- `src/app/page.tsx` - 改为使用轻量索引
- `src/app/chats/[slug]/page.tsx` - 改为按需加载单篇
- `src/app/topics/[slug]/page.tsx` - 改为使用轻量索引
- `src/app/models/[slug]/page.tsx` - 改为使用轻量索引
- `tests/content.test.ts` - 更新测试以匹配新结构

## Open Questions

1. 是否需要预加载热门文章？（当前不需要，按需加载足够）
2. 是否需要文件系统 watch 重新生成？（当前不需要，重新运行 `content:manifest` 即可）
