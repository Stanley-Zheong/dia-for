## Context

当前 dia-for 项目支持将 Obsidian 中的图片上传到 CDN 并替换 Markdown 中的路径。用户需要同样的能力来处理 HTML 文件——将交互式 HTML 内容作为附件分享。

HTML 文件与图片的主要区别：
- HTML 文件需要保持完整，作为独立页面访问
- HTML 可能包含内嵌资源（base64）或外部 CDN 引用
- 不需要像图片那样在 Markdown 中直接渲染，而是通过链接访问
- 文件可能较大，需要验证大小限制

## Goals / Non-Goals

**Goals:**
- 自动检测 Markdown 中的本地 HTML 文件链接
- 上传 HTML 文件到 Cloudflare R2 CDN
- 在 manifest 生成阶段将本地路径替换为 CDN URL
- 确保 HTML 文件在浏览器中独立打开时内容完整、显示正常
- 支持幂等操作（重复运行不会重复上传）

**Non-Goals:**
- 不处理 HTML 中的相对路径资源引用（需用户确保自包含或使用 CDN）
- 不实现 HTML 内容的安全扫描或沙箱隔离
- 不提供 HTML 预览/嵌入功能（只提供独立访问链接）
- 不自动压缩或修改 HTML 文件内容

## Decisions

### 1. HTML 文件存储复用图片上传的 R2 配置

**决策**: 复用 obsidian-image-upload 的 R2 配置和客户端
**理由**:
- 避免重复配置环境变量
- 统一的附件管理策略
- 可以利用已有的 `src/lib/r2-client.ts`

**实现**:
- 相同 bucket，不同路径前缀：`attachments/html/` vs `attachments/images/`
- 复用 R2 客户端初始化和上传逻辑

### 2. HTML 文件命名和路径策略

**决策**: 使用原文件名上传，通过路径前缀区分类型
**理由**:
- 保持文件名语义（如 `chart-visualization.html`）
- 方便用户识别和管理
- 避免 hash 命名破坏可读性

**实现**:
- R2 object key: `attachments/html/{filename}`
- CDN URL: `https://cdn.example.com/attachments/html/{filename}`
- 如文件名冲突，覆盖或添加版本号（待确定）

### 3. HTML 文件检测方式

**决策**: 扫描 Markdown 中的标准链接语法，过滤 `.html` 后缀
**理由**:
- 复用现有链接解析逻辑
- 无需新增语法约定

**实现**:
- 正则匹配 `\[([^\]]*)\]\(([^)]+\.html)\)`
- 支持相对路径：`./attachments/html/file.html` 或 `attachments/html/file.html`

### 4. 无需新增路由，直接使用 R2 公开访问

**决策**: 不通过 Next.js 路由代理 HTML 文件，直接使用 R2 公开 URL
**理由**:
- 减少服务器负载，CDN 直接服务
- 避免 HTML 路由与现有聊天路由冲突
- 保持文件原样，无服务器处理开销

**实现**:
- R2 bucket 配置公开读取
- Markdown 链接直接指向 R2 CDN URL

### 5. 文件大小限制

**决策**: 设置单个 HTML 文件大小限制为 10MB
**理由**:
- 防止超大文件占用过多存储和带宽
- 大型交互应用应拆分为多个文件或使用专业托管

**实现**:
- 上传前检查文件大小
- 超过限制时记录警告，跳过上传

## Risks / Trade-offs

| Risk | Mitigation |
|------|-----------|
| HTML 文件包含恶意脚本 | 文档说明风险，建议只上传可信来源的 HTML |
| HTML 依赖外部资源失效 | 文档建议自包含（内联 CSS/JS）或使用可靠 CDN |
| 文件名冲突覆盖 | 当前策略：后上传的文件覆盖前者；后续可考虑版本号 |
| 大量 HTML 文件影响构建速度 | 并行上传，限制并发数；只处理有变化的文件 |
| R2 公开访问的安全风险 | bucket 策略：只允许 `attachments/` 前缀公开读取 |

## Migration Plan

**部署步骤**:
1. 确保 R2 bucket 已配置（复用图片上传的 bucket）
2. 配置 bucket 公开访问策略（如尚未配置）
3. 创建 `content/attachments/html/` 目录并添加到 `.gitignore`
4. 运行 `npm run content:manifest` 测试 HTML 上传
5. 部署到 Cloudflare Workers

**回滚策略**:
- 移除 HTML 文件后重新运行 manifest，链接将失效
- 恢复备份的 Markdown 文件恢复本地链接

**需要更新的文件**:
- `scripts/generate-content-manifest.mjs` - 集成 HTML 扫描和上传
- `src/lib/image-sync.ts` 或新建 `src/lib/attachment-sync.ts` - 通用附件上传逻辑
- `content/.gitignore` - 排除 `attachments/html/` 目录
- 可能需要更新 `.env.example` 添加 HTML 相关说明

## Open Questions

1. 是否需要支持其他附件类型（PDF、ZIP 等）？（当前只支持 HTML）
2. 文件名冲突时采用覆盖策略还是版本号策略？（当前选择：覆盖）
3. 是否需要 HTML 元数据提取（标题、描述）？（当前不需要）
4. 是否需要访问统计或过期策略？（当前不需要）
