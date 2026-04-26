## Why

Frontmatter 中的 `tags` 字段已被 content manifest 收集，但目前没有对应的浏览路由。用户无法按标签浏览相关对话记录。这是与 `/topics` 和 `/models` 对等的功能缺口，补齐后可以增强内容发现能力。

## What Changes

- 新增 `/tags` 索引页，列出所有 published chats 中出现的标签及其关联记录数
- 新增 `/tags/[slug]` 详情页，展示该标签下的所有 published chats
- 在 `lib/content.ts` 中新增 `getAllTags()` 和 `getChatsByTag(tag)` helper
- 在 `AppShell.tsx` 导航中增加 "Tags" 入口
- 在 `docs/acceptance.md` 中新增 Tags 段落，镜像 Topics 段的验收标准

## Capabilities

### New Capabilities

- `tags-navigation`: 提供按标签浏览 published chats 的索引页和详情页，包含标签聚合、slug 标准化、published 过滤

### Modified Capabilities

- `topic-model-navigation`: 无需求变更，仅实现参考（复用其设计模式）

## Impact

- **lib/content.ts**: 新增 `getAllTags()` / `getChatsByTag()` 函数
- **src/app/tags/**: 新增 `page.tsx` 和 `[slug]/page.tsx`
- **src/components/AppShell.tsx**: 导航新增 Tags 入口
- **tests/**: 新增 tags 相关测试，验证 published 过滤
- **docs/acceptance.md**: 新增 Tags 验收段

## Acceptance Criteria

参见 `docs/acceptance.md` 中 Topics 段落，Tags 需满足对等标准：

- `/tags` 必须列出且仅列出 published chats 中出现的标签
- 标签标题和计数必须与 published chats 的 `tags` frontmatter 匹配
- Unpublished chats 不能贡献标签、计数或链接
- 每个标签必须有可访问的 `/tags/[slug]` 页面

## Navigation Update

需要更新 `src/components/AppShell.tsx`，在导航中增加 "Tags" 入口（位置待设计阶段确认）。
