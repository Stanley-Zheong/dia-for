# AGENTS.md — tests/

> Vitest 测试目录。

## 配置

- 环境：Node.js（非浏览器）
- 配置文件：`vitest.config.ts`
- 路径别名：`@/*` → `./src/*`

## 现有测试

| 文件 | 覆盖范围 |
|------|----------|
| `acceptance.test.tsx` | 验收标准（published 过滤、manifest 一致性） |
| `content.test.ts` | content.ts 的单元测试 |
| `markdown-example.test.ts` | Markdown 消息解析 |
| `search.test.ts` | 搜索功能 |

## 约束

- **新增功能必须有对应测试**
- **测试 published 过滤**：任何涉及内容查询的功能都要测试 unpublished 条目被排除
- **回归 fixture**：`harness 自动化开发.md` 的内部 heading 不能被切分

## 运行

```bash
npm run test           # 跑所有测试
npm run test -- --watch  # watch 模式
```
