## Why

用户需要一种方式在对话记录中分享交互式 HTML 内容（如可视化图表、交互式演示、游戏等）。当前 Markdown 只支持图片嵌入，无法支持完整的 HTML 文件。需要将 HTML 文件作为附件上传，在 Markdown 中通过链接引用，并确保 HTML 文件在 web 端可以独立访问和正常显示。

## What Changes

- **新增 HTML 附件上传脚本**：扫描 `content/chats/*.md` 中的本地 HTML 文件链接，上传到 Cloudflare R2
- **新增 HTML 附件目录**：`content/attachments/html/` 存放 HTML 文件（gitignored）
- **新增 HTML 文件处理逻辑**：在 `npm run content:manifest` 阶段识别 HTML 链接并上传
- **新增 HTML 访问路由**：`/attachments/[filename]` 或独立路径提供 HTML 文件访问
- **新增附件 manifest**：记录 HTML 文件名到 CDN URL 的映射
- **保持 HTML 文件完整性**：原样上传，不修改文件内容，确保独立打开时正常显示

## Capabilities

### New Capabilities

- `html-attachment-sync`: 检测 Markdown 中的 HTML 链接、上传到 R2、生成访问 URL
- `html-attachment-serve`: 提供 HTML 附件的独立访问路由，保持文件原样

### Modified Capabilities

- `content-ingestion`: 在生成 manifest 时识别并处理 HTML 附件链接

## Impact

- **构建流程**：`npm run content:manifest` 增加 HTML 文件扫描和上传步骤
- **部署依赖**：复用图片上传的 R2 配置，无需额外配置
- **内容目录**：新增 `content/attachments/html/` 存放 HTML 文件（gitignored）
- **路由**：可能需要新增 `/attachments/[filename]` 路由提供 HTML 访问
- **Markdown 渲染**：链接到 HTML 文件的 a 标签指向 CDN URL

## Acceptance Criteria

- Markdown 中的 `[描述](./attachments/html/file.html)` 链接能正确指向 CDN URL
- HTML 文件原样上传到 R2，内容不被修改
- 用户点击链接后，HTML 文件在浏览器中独立打开并正常显示
- HTML 文件中的相对路径资源（如 CSS、JS）需要文档说明限制（建议自包含或使用 CDN）
- published chats 中的 HTML 附件与 manifest 中的引用一致
- 无 R2 配置时构建不崩溃（降级处理）
