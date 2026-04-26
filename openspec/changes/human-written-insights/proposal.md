## Why

当前右侧面板的摘要、观点、结论是 AI 自动生成的，质量不稳定且缺乏作者视角。作为公开对话记录站，人工提炼的"对话价值"比 AI 生成的更有长期价值，能体现作者的思考和判断。

## What Changes

- 在 chat frontmatter 中新增 `insights` 字段，支持多行 Markdown 内容
- 右侧面板优先显示人工撰写的 `insights`，用 Markdown 渲染（和中间栏一致）
- 没有人工 insights 时显示占位符文案，不再调用 AI 生成
- 移除对 `getChatInsights()` 的依赖，简化数据流

## Capabilities

### New Capabilities

- `human-insights-display`: 在聊天详情页右侧面板显示人工撰写的 Markdown insights

### Modified Capabilities

- `chat-record-rendering`: 右侧面板从 AI 生成改为人工撰写内容

## Impact

- **frontmatter schema**: 新增可选 `insights` 字段（多行字符串）
- **src/lib/types.ts**: `ChatRecordMeta` 新增 `insights?: string`
- **src/lib/content.ts**: frontmatter 解析新增 `insights` 字段
- **src/app/chats/[slug]/page.tsx**: 移除 `getChatInsights()` 调用，改为读取 `meta.insights` 并 Markdown 渲染
- **content/chats/*.md**: 现有文件无需立即修改，`insights` 字段可选

## Acceptance Criteria

参见 `docs/acceptance.md`：

- 有 `insights` 字段的 chat：右侧面板显示该 Markdown 内容
- 无 `insights` 字段的 chat：右侧面板显示占位符文案（如"暂无价值提炼"）
- `insights` 内容支持 Markdown 格式（链接、列表、粗体等）
- 不再调用 Gemini API 生成 chat insights（Topic comparison 保留）

## Navigation Update

无导航变更。
