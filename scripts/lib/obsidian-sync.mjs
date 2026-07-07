import fs from "node:fs/promises";
import path from "node:path";

import matter from "gray-matter";

async function pathExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function discoverMarkdownFiles(dir, root = dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        return discoverMarkdownFiles(fullPath, root);
      }
      if (entry.isFile() && entry.name.endsWith(".md")) {
        return [path.relative(root, fullPath).split(path.sep).join("/")];
      }
      return [];
    }),
  );

  return files.flat().sort();
}

async function publishedState(filePath) {
  try {
    const content = await fs.readFile(filePath, "utf8");
    const parsed = matter(content);
    return {
      published: parsed.data?.published === true,
      valid: true,
    };
  } catch {
    return {
      published: false,
      valid: false,
    };
  }
}

async function removeEmptyDirectories(dir, root) {
  const entries = await fs.readdir(dir, { withFileTypes: true }).catch(() => []);
  await Promise.all(
    entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => removeEmptyDirectories(path.join(dir, entry.name), root)),
  );

  if (dir === root) {
    return;
  }

  const remaining = await fs.readdir(dir).catch(() => []);
  if (remaining.length === 0) {
    await fs.rmdir(dir);
  }
}

export async function syncMarkdownFiles({
  sourceDir,
  targetDir,
  dryRun = false,
  publishedOnly = true,
}) {
  if (!sourceDir || !targetDir) {
    throw new Error("sourceDir and targetDir are required");
  }

  const sourceRoot = path.resolve(sourceDir);
  const targetRoot = path.resolve(targetDir);

  if (!(await pathExists(sourceRoot))) {
    throw new Error(`Obsidian source directory not found: ${sourceRoot}`);
  }

  if (!dryRun) {
    await fs.mkdir(targetRoot, { recursive: true });
  }

  const discoveredSourceFiles = await discoverMarkdownFiles(sourceRoot);
  const sourceFiles = [];
  const skipped = [];
  for (const relativePath of discoveredSourceFiles) {
    if (!publishedOnly) {
      sourceFiles.push(relativePath);
      continue;
    }

    const state = await publishedState(path.join(sourceRoot, relativePath));
    if (state.published) {
      sourceFiles.push(relativePath);
    } else if (!state.valid) {
      skipped.push(relativePath);
    }
  }
  const targetFiles = (await pathExists(targetRoot))
    ? await discoverMarkdownFiles(targetRoot)
    : [];
  const sourceSet = new Set(sourceFiles);

  const copied = [];
  const unchanged = [];
  const removed = [];

  for (const relativePath of sourceFiles) {
    const sourcePath = path.join(sourceRoot, relativePath);
    const targetPath = path.join(targetRoot, relativePath);
    const sourceContent = await fs.readFile(sourcePath);
    const targetContent = await fs.readFile(targetPath).catch(() => null);

    if (targetContent && Buffer.compare(sourceContent, targetContent) === 0) {
      unchanged.push(relativePath);
      continue;
    }

    copied.push(relativePath);
    if (!dryRun) {
      await fs.mkdir(path.dirname(targetPath), { recursive: true });
      await fs.writeFile(targetPath, sourceContent);
    }
  }

  for (const relativePath of targetFiles) {
    if (sourceSet.has(relativePath)) {
      continue;
    }

    removed.push(relativePath);
    if (!dryRun) {
      await fs.rm(path.join(targetRoot, relativePath), { force: true });
    }
  }

  if (!dryRun) {
    await removeEmptyDirectories(targetRoot, targetRoot);
  }

  return {
    copied: copied.sort(),
    removed: removed.sort(),
    skipped: skipped.sort(),
    unchanged: unchanged.sort(),
  };
}
