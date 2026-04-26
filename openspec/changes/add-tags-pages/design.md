## Context

Tags 字段已在 `lib/types.ts` 的 `ChatRecordMeta` 中定义，frontmatter 解析在 `lib/content.ts` 的 `frontmatterSchema` 中完成。但目前没有 `/tags` 路由，也没有 `getAllTags()` / `getTagBySlug()` helper。

现有 `/topics` 和 `/models` 路由结构清晰，可直接复用其模式：
- 索引页调用 `getXxx()` → 渲染卡片列表
- 详情页调用 `getXxxBySlug(slug)` → 渲染关联 chats
- `generateStaticParams()` 用于 static generation

## Goals / Non-Goals

**Goals:**
- 提供 `/tags` 索引页和 `/tags/[slug]` 详情页
- 仅展示 published chats 中出现的 tags
- 在导航中增加 Tags 入口
- 验收标准与 Topics 对等

**Non-Goals:**
- 不加 tag 的 AI insights（Topic 有 comparison，Tags 暂不需要）
- 不支持 tag 编辑或管理界面（Obsidian 是 source of truth）
- 不做分页（MVP 阶段）

## Decisions

### 1. Tags helper 放在 `lib/content.ts`

**决定**：在 `lib/content.ts` 新增 `TagSummary` 类型和 `getAllTags()` / `getTagBySlug()` 函数。

**理由**：复用现有 `getAllChats()` 的 published 过滤逻辑，保持与 Topics/Models 一致的模式。

**替代方案**：单独新建 `lib/tags.ts` —— 增加文件数量但拆分粒度更细。考虑到 tags 逻辑简单，不值得单独拆分。

### 2. Tag slug 使用 `lib/slug.ts` 的 `slugify()`

**决定**：复用现有 slug 标准化逻辑。

**理由**：保持 URL 格式一致，避免 slug 冲突（同一个 slugify 函数）。

### 3. 路由结构镜像 Topics

```
src/app/tags/
├── page.tsx           # 索引页
└── [slug]/
    └── page.tsx       # 详情页
```

**决定**：Server Component 直接调用 `lib/content.ts`，无需 Client Component。

**理由**：Tags 页面无交互逻辑，纯静态渲染。

### 4. 导航位置

**决定**：在 AppShell 导航的"话题"下方新增"标签"入口。

**理由**：按信息层级排列（最新记录 → 话题 → 标签 → AI Search）。

### 5. 右侧面板内容

**决定**：详情页右侧面板仅展示 placeholder 文案，不调用 AI insights。

**理由**：Non-goal 明确不加 tag insights，保持 MVP 简洁。

## Risks / Trade-offs

**[Tag 爆炸]** → 用户可能创建大量 tags 导致索引页过长
- Mitigation：MVP 不做分页，观察实际数据量后决定是否加分页

**[Slug 冲突]** → 不同 tag 可能 slugify 到同一字符串
- Mitigation：`uniqueSlug()` 已处理重复（参考 `getAllChats()` 实现）

**[测试覆盖]** → 新增功能需要测试 published 过滤
- Mitigation：tasks 中明确包含测试任务

## Files to Update

**新增:**
- `src/app/tags/page.tsx`
- `src/app/tags/[slug]/page.tsx`

**修改:**
- `src/lib/content.ts` — 新增 `getAllTags()` / `getTagBySlug()`
- `src/lib/types.ts` — 新增 `TagSummary` 类型
- `src/components/AppShell.tsx` — 导航新增 Tags 入口
- `docs/acceptance.md` — 新增 Tags 验收段
- `tests/content.test.ts` 或新文件 — 新增 tags 测试

## Impact on content:manifest

无影响。Tags 数据已在 manifest 中（frontmatter `tags` 字段），本 change 只是新增查询 helper 和路由。
