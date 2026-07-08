import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const checkedFiles = {
  "src/components/AppShell.tsx": ["siteConfig.name"],
  "src/components/HomeHeroIdentity.tsx": ["二DD水"],
  "src/lib/config.ts": ["二DD水"],
  "scripts/write-locale-redirects.mjs": ["二DD水"],
  "content/products/dia-for.md": ["二DD水"],
} as const;

describe("brand consistency", () => {
  it("uses 二DD水 without stale names or DAL/DIL suffixes", () => {
    for (const [file, requiredTexts] of Object.entries(checkedFiles)) {
      const source = fs.readFileSync(path.join(process.cwd(), file), "utf8");

      for (const text of requiredTexts) {
        expect(source, file).toContain(text);
      }
      expect(source, file).not.toContain("三he水");
      expect(source, file).not.toContain("二dd水");
      expect(source, file).not.toContain("DAL");
      expect(source, file).not.toContain("DIL");
    }
  });
});
