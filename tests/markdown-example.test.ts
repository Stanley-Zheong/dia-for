import { describe, expect, it } from "vitest";

import { normalizeMarkdownExampleBlocks } from "@/lib/markdown-example";

describe("markdown example blocks", () => {
  it("converts compact backtick markdown templates into fenced text blocks", () => {
    const result = normalizeMarkdownExampleBlocks(
      "text\n\n`# Evals ## 1. 关键场景 - 场景 1： - 场景 2： ## 2. 样本库 | ID | 场景 | 输入 | 预期输出 | 来源 | |----|------|------|----------|------| | E-001 |  |  |  |  | ## 3. 评估规则 - 正常路径必须通过。`",
    );

    expect(result).toContain("```text\n# Evals");
    expect(result).toContain("\n\n## 1. 关键场景");
    expect(result).toContain("\n- 场景 1：");
    expect(result).toContain("\n| ID | 场景 | 输入 | 预期输出 | 来源 |");
    expect(result).toContain("\n## 3. 评估规则");
    expect(result).toContain("\n```");
  });
});
