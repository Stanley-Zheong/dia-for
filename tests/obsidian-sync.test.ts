import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { syncMarkdownFiles } from "../scripts/lib/obsidian-sync.mjs";

let tempRoot: string;

beforeEach(async () => {
  tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "obsidian-sync-"));
});

afterEach(async () => {
  await fs.rm(tempRoot, { recursive: true, force: true });
});

describe("Obsidian Markdown sync", () => {
  it("copies Markdown notes, removes stale Markdown, and ignores non-Markdown files", async () => {
    const source = path.join(tempRoot, "vault");
    const target = path.join(tempRoot, "chatweb", "content", "chats");
    await fs.mkdir(path.join(source, "nested"), { recursive: true });
    await fs.mkdir(target, { recursive: true });

    await fs.writeFile(path.join(source, "Published.md"), "---\npublished: true\n---\n\n## User\n\nHi\n");
    await fs.writeFile(path.join(source, "nested", "Deep Note.md"), "---\npublished: true\n---\n\nBody\n");
    await fs.writeFile(path.join(source, "image.png"), "not markdown");
    await fs.writeFile(path.join(target, "Stale.md"), "remove me");
    await fs.writeFile(path.join(target, "keep.png"), "leave me alone");

    const result = await syncMarkdownFiles({ sourceDir: source, targetDir: target });

    await expect(fs.readFile(path.join(target, "Published.md"), "utf8")).resolves.toContain("## User");
    await expect(fs.readFile(path.join(target, "nested", "Deep Note.md"), "utf8")).resolves.toContain("Body");
    await expect(fs.access(path.join(target, "Stale.md"))).rejects.toThrow();
    await expect(fs.readFile(path.join(target, "keep.png"), "utf8")).resolves.toBe("leave me alone");
    await expect(fs.access(path.join(target, "image.png"))).rejects.toThrow();

    expect(result.copied.sort()).toEqual(["Published.md", "nested/Deep Note.md"]);
    expect(result.removed).toEqual(["Stale.md"]);
    expect(result.skipped).toEqual([]);
    expect(result.unchanged).toEqual([]);
  });

  it("reports unchanged Markdown without rewriting it", async () => {
    const source = path.join(tempRoot, "vault");
    const target = path.join(tempRoot, "chatweb", "content", "chats");
    await fs.mkdir(source, { recursive: true });
    await fs.mkdir(target, { recursive: true });

    const note = "---\npublished: true\n---\n\nSame body\n";
    await fs.writeFile(path.join(source, "Same.md"), note);
    await fs.writeFile(path.join(target, "Same.md"), note);

    const result = await syncMarkdownFiles({ sourceDir: source, targetDir: target });

    expect(result).toEqual({
      copied: [],
      removed: [],
      skipped: [],
      unchanged: ["Same.md"],
    });
  });

  it("does not copy unpublished notes and removes previously synced drafts", async () => {
    const source = path.join(tempRoot, "vault");
    const target = path.join(tempRoot, "chatweb", "content", "chats");
    await fs.mkdir(source, { recursive: true });
    await fs.mkdir(target, { recursive: true });

    await fs.writeFile(path.join(source, "Draft.md"), "---\npublished: false\n---\n\nPrivate\n");
    await fs.writeFile(path.join(source, "No Frontmatter.md"), "Private without frontmatter\n");
    await fs.writeFile(path.join(target, "Draft.md"), "---\npublished: true\n---\n\nOld public copy\n");

    const result = await syncMarkdownFiles({ sourceDir: source, targetDir: target });

    await expect(fs.access(path.join(target, "Draft.md"))).rejects.toThrow();
    await expect(fs.access(path.join(target, "No Frontmatter.md"))).rejects.toThrow();
    expect(result).toEqual({
      copied: [],
      removed: ["Draft.md"],
      skipped: [],
      unchanged: [],
    });
  });

  it("skips notes with invalid frontmatter instead of copying them", async () => {
    const source = path.join(tempRoot, "vault");
    const target = path.join(tempRoot, "chatweb", "content", "chats");
    await fs.mkdir(source, { recursive: true });

    await fs.writeFile(path.join(source, "Broken.md"), "---\ntitle: bad: yaml\npublished: true\n---\n\nPrivate\n");

    const result = await syncMarkdownFiles({ sourceDir: source, targetDir: target });

    await expect(fs.access(path.join(target, "Broken.md"))).rejects.toThrow();
    expect(result).toEqual({
      copied: [],
      removed: [],
      skipped: ["Broken.md"],
      unchanged: [],
    });
  });
});
