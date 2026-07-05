## Why

当前 `src/generated/content-manifest.json` 将所有文章的完整内容（包括 `rawMarkdown` 和 `messages`）存储在单个 JSON 文件中。随着文章数量增长，文件体积线性增加（当前 764KB，9篇文章），会导致构建加载缓慢、内存占用增加、传输开销变大。需要将单体 manifest 拆分为多文件架构，实现按需加载和更好的可扩展性。

## What Changes

- **新增多文件 manifest 结构**：将 `content-manifest.json` 拆分为轻量索引 + 单篇内容文件
- **新增 `src/generated/chats/` 目录**：每篇 chat 独立存储为 `{slug}.json`，包含完整内容
- **修改 `scripts/generate-content-manifest.mjs`**：生成多文件结构而非单体文件
- **新增 `src/lib/content.ts` 按需加载逻辑**：从独立文件读取 chat 内容，保持 API 兼容
- **删除（BREAKING）**：原 `src/generated/content-manifest.json` 单体文件结构

## Capabilities

### New Capabilities

- `content-manifest-split`: 多文件 manifest 生成与管理
- `chat-lazy-loading`: 按需从独立文件加载 chat 内容

### Modified Capabilities

- `content-ingestion`: manifest 生成方式从单体改为多文件，但 published 过滤语义不变

## Impact

- **构建流程**：`npm run content:manifest` 生成多文件结构
- **运行时读取**：chat 详情页按需读取独立文件，首页/列表页只读轻量索引
- **内存优化**：构建和运行时内存占用降低
- **缓存策略**：独立文件可单独缓存，修改单篇文章无需重新传输整个 manifest
- **兼容性（BREAKING）**：直接依赖 `content-manifest.json` 结构的代码需要更新

## Acceptance Criteria

- 所有 published chats 正确生成独立文件
- 首页/列表页渲染不依赖完整内容加载
- 单篇 chat 页面正常显示
- published 过滤逻辑保持不变
- `npm run verify:deploy` 通过
