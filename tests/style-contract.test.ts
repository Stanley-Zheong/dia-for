import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const css = fs.readFileSync(path.join(process.cwd(), "src", "app", "globals.css"), "utf8");

function rule(selector: string) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = css.match(new RegExp(`${escaped}\\s*\\{(?<body>[^}]*)\\}`, "u"));
  return match?.groups?.body ?? "";
}

describe("layout style contract", () => {
  it("keeps chat detail pages inside the viewport with shrinkable ChatGPT-like message columns", () => {
    expect(rule(".content-grid.with-tips")).toContain("minmax(0, 760px)");
    expect(rule(".article-body")).toContain("min-width: 0");
    expect(rule(".chat-transcript")).toContain("max-width: 760px");
    expect(rule(".chat-bubble")).toContain("min-width: 0");
    expect(rule(".markdown-body")).toContain("overflow-wrap: anywhere");
    expect(rule(".markdown-body table")).toContain("display: block");
    expect(rule(".markdown-body table")).toContain("overflow-x: auto");
  });
});
