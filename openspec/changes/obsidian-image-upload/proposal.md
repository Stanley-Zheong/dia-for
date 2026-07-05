## Why

Obsidian 中粘贴的图片使用本地路径（如 `![[Pasted image 20250505.png]]` 或 `![](attachments/image.png)`），这些路径在 web 发布时无法解析，导致图片显示为 broken image。需要一个自动化的图片处理流程，将 Obsidian 本地图片转换为 web 可访问的 URL。

## What Changes

- **新增图片上传脚本**：扫描 `content/chats/*.md` 中的本地图片引用，上传到 Cloudflare R2，并替换为 CDN URL
- **新增图片路径转换逻辑**：在 `npm run content:manifest` 阶段处理图片路径映射
- **新增 `content/attachments/` 目录**：存放 Obsidian 粘贴的原始图片（不提交到 git，通过 `.gitignore` 排除）
- **修改 Markdown 渲染组件**：确保外部图片 URL 正确加载
- **新增环境变量配置**：`R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `R2_PUBLIC_URL`

## Capabilities

### New Capabilities

- `obsidian-image-sync`: 检测 Obsidian 图片引用、上传到 R2、生成 URL 映射表
- `markdown-image-render`: 支持外部 CDN 图片的 Markdown 渲染

### Modified Capabilities

- `content-ingestion`: 在生成 manifest 时处理图片路径转换

## Impact

- **构建流程**：`npm run content:manifest` 增加图片上传步骤
- **部署依赖**：需要配置 R2 环境变量才能完整构建
- **内容目录**：新增 `content/attachments/` 存放原始图片（gitignored）
- **Markdown 渲染**：`MarkdownContent.tsx` 需验证外部图片加载

## Acceptance Criteria

参考 `docs/acceptance.md`：
- Obsidian 粘贴的图片在 web 页面正确显示
- 图片上传是幂等的（重复运行不会重复上传）
- 没有 R2 配置时构建不崩溃（降级为显示占位符或跳过）
- published chats 中的图片与 manifest 中的图片引用一致
