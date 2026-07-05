## Context

当前 dia-for 项目的内容流程：
1. 在 Obsidian 中编辑 `content/chats/*.md`，粘贴图片时会自动保存到 `attachments/`
2. Markdown 中使用 `![[Pasted image 20250505.png]]` 或 `![](attachments/image.png)` 引用
3. 运行 `npm run content:manifest` 扫描内容生成 manifest
4. Web 页面渲染时，本地图片路径无法解析为有效 URL

需要解决的问题：将 Obsidian 本地图片路径转换为 CDN URL，使图片能在 web 正确显示。

## Goals / Non-Goals

**Goals:**
- 自动检测 Markdown 中的本地图片引用
- 上传图片到 Cloudflare R2 CDN
- 在 manifest 生成阶段替换图片路径为 CDN URL
- 支持幂等操作（重复运行不会重复上传）
- 无 R2 配置时优雅降级（跳过图片处理，不阻塞构建）

**Non-Goals:**
- 不实现图片压缩/转码（保持原始文件）
- 不实现图片删除同步（手动管理 R2）
- 不替代 Obsidian 的附件管理（Obsidian 仍是 source of truth）

## Decisions

### 1. 图片存储选择 Cloudflare R2

**决策**: 使用 Cloudflare R2 作为图片存储
**理由**: 
- 项目已部署在 Cloudflare Workers，同生态整合简单
- R2 提供 S3-compatible API，使用 aws-sdk 即可操作
- 免费额度足够个人项目使用
- 无 egress 费用

**替代方案**: 
- 本地 base64 内嵌：会增加 bundle 大小，不适合大图片
- 其他对象存储（S3、GCS）：需要额外配置和费用

### 2. 图片上传时机：content:manifest 阶段

**决策**: 在 `npm run content:manifest` 时检测并上传图片
**理由**:
- 与内容生成流程整合，无需额外手动步骤
- 构建时即确定图片 URL，运行时无需动态处理
- 便于实现幂等性（上传前检查文件 hash）

**替代方案**:
- 运行时动态上传：延迟首次加载，实现复杂
- 独立的上传脚本：增加操作步骤，容易遗漏

### 3. 图片路径映射表存储

**决策**: 在 `src/generated/` 生成 `image-manifest.json`，记录本地路径到 CDN URL 的映射
**理由**:
- 运行时无需再次计算，直接查表替换
- 可追踪哪些图片已上传/未上传
- 便于调试和排查问题

**映射表结构**:
```json
{
  "content/attachments/Pasted image 20250505.png": {
    "hash": "sha256:abc123",
    "url": "https://cdn.example.com/images/abc123.png",
    "size": 12345
  }
}
```

### 4. Markdown 图片引用格式支持

**决策**: 支持两种 Obsidian 图片语法
1. `![[Pasted image 20250505.png]]` - Obsidian wiki-link 格式
2. `![](attachments/Pasted image 20250505.png)` - 标准 Markdown 格式

**实现方式**:
- 在 `normalizeMarkdownExampleBlocks` 或新函数中处理图片路径
- 根据映射表将本地路径替换为 CDN URL
- 不支持的格式原样保留（可能显示 broken image）

### 5. 无 R2 配置时的降级策略

**决策**: 环境变量缺失时跳过图片上传，保留原始路径，构建继续
**理由**:
- 符合 AGENTS.md 的 "AI 降级路径" 原则
- 开发环境无需配置 R2 即可构建测试
- 图片显示失败但不影响其他功能

**降级行为**:
- 检查 `R2_ACCESS_KEY_ID` 和 `R2_SECRET_ACCESS_KEY`
- 缺失时输出警告日志，跳过 upload 步骤
- Markdown 中保留原始本地路径（会显示 broken image）

## Risks / Trade-offs

| Risk | Mitigation |
|------|-----------|
| 图片文件名冲突 | 使用文件内容 hash 作为 R2 object key，避免冲突 |
| R2 上传失败阻塞构建 | 错误时输出警告，继续构建，不阻断流程 |
| 大量图片导致构建慢 | 使用并行上传（Promise.all），限制并发数 |
| 图片删除后 CDN 仍保留 | 文档说明需手动清理 R2，或后续增加垃圾回收功能 |
| 敏感图片意外上传 | `.gitignore` 排除 attachments，但 R2 上传需显式运行脚本，有可控边界 |

## Migration Plan

**部署步骤**:
1. 创建 Cloudflare R2 bucket
2. 配置 R2 API token，获取 access key / secret key
3. 添加环境变量到 `.env.local` 和 CI/CD
4. 在 Obsidian 设置中配置附件文件夹为 `content/attachments/`
5. 运行 `npm run content:manifest` 测试图片上传
6. 部署到 Cloudflare Workers

**回滚策略**:
- 移除 R2 环境变量，构建会降级为跳过图片处理
- 清除 `src/generated/image-manifest.json` 恢复原始路径

**需要更新的文件**:
- `scripts/generate-content-manifest.mjs` - 集成图片扫描和上传
- `src/lib/markdown-example.ts` 或新建文件 - 图片路径替换逻辑
- `src/generated/` - 新增 `image-manifest.json`
- `content/.gitignore` - 排除 `attachments/` 目录
- `package.json` - 可能需添加 `aws-sdk` 依赖
- `.env.example` - 添加 R2 配置模板

## Open Questions

1. 是否需要图片压缩？（当前决定：不压缩，保持原样）
2. 是否需要支持视频/音频等其他附件类型？（当前决定：先只支持图片）
3. 是否需要缓存图片 hash 避免重复计算？（实现时可考虑）
