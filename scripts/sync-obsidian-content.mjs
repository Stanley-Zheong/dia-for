#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import path from "node:path";
import process from "node:process";

import { syncMarkdownFiles } from "./lib/obsidian-sync.mjs";

const DEFAULT_OBSIDIAN_SOURCE =
  "/Users/laosanzheong/Documents/obsdata/knowledge-center/raw/01-articles";

function parseArgs(argv) {
  const args = {
    source: process.env.OBSIDIAN_SOURCE_DIR ?? DEFAULT_OBSIDIAN_SOURCE,
    target: process.env.OBSIDIAN_CONTENT_DIR ?? "content/chats",
    repoRoot: process.cwd(),
    commit: false,
    push: false,
    deploy: false,
    dryRun: false,
    includeDrafts: false,
    skipManifest: false,
    message: "",
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--source") {
      args.source = argv[++index];
    } else if (arg === "--target") {
      args.target = argv[++index];
    } else if (arg === "--repo-root") {
      args.repoRoot = argv[++index];
    } else if (arg === "--commit") {
      args.commit = true;
    } else if (arg === "--push") {
      args.commit = true;
      args.push = true;
    } else if (arg === "--deploy") {
      args.commit = true;
      args.push = true;
      args.deploy = true;
    } else if (arg === "--dry-run") {
      args.dryRun = true;
    } else if (arg === "--include-drafts") {
      args.includeDrafts = true;
    } else if (arg === "--skip-manifest") {
      args.skipManifest = true;
    } else if (arg === "--message") {
      args.message = argv[++index];
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return args;
}

function run(command, commandArgs, cwd) {
  console.log(`+ ${[command, ...commandArgs].join(" ")}`);
  const result = spawnSync(command, commandArgs, {
    cwd,
    encoding: "utf8",
    stdio: "inherit",
  });

  if (result.status !== 0) {
    throw new Error(`Command failed: ${[command, ...commandArgs].join(" ")}`);
  }
}

function capture(command, commandArgs, cwd) {
  const result = spawnSync(command, commandArgs, {
    cwd,
    encoding: "utf8",
  });

  if (result.status !== 0) {
    throw new Error(result.stderr || `Command failed: ${[command, ...commandArgs].join(" ")}`);
  }

  return result.stdout.trim();
}

function printSummary(summary) {
  console.log(
    [
      `copied=${summary.copied.length}`,
      `removed=${summary.removed.length}`,
      `skipped=${summary.skipped.length}`,
      `unchanged=${summary.unchanged.length}`,
    ].join(" "),
  );

  for (const filePath of summary.copied) {
    console.log(`  copy ${filePath}`);
  }
  for (const filePath of summary.removed) {
    console.log(`  remove ${filePath}`);
  }
  for (const filePath of summary.skipped) {
    console.log(`  skip ${filePath}`);
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const repoRoot = path.resolve(args.repoRoot);
  const sourceDir = path.resolve(repoRoot, args.source);
  const targetDir = path.resolve(repoRoot, args.target);

  console.log("== Sync Obsidian Markdown ==");
  console.log(`source: ${sourceDir}`);
  console.log(`target: ${targetDir}`);

  const summary = await syncMarkdownFiles({
    sourceDir,
    targetDir,
    dryRun: args.dryRun,
    publishedOnly: !args.includeDrafts,
  });
  printSummary(summary);

  if (args.dryRun) {
    console.log("Dry run only; no files were changed.");
    return;
  }

  if (!args.skipManifest && !args.dryRun) {
    run("npm", ["run", "content:manifest"], repoRoot);
  }

  const status = capture(
    "git",
    ["status", "--porcelain", "--", args.target, "src/generated/content-manifest.json"],
    repoRoot,
  );

  if (!status) {
    console.log("No publishable content changes.");
    return;
  }

  console.log("== Content changes ==");
  console.log(status);

  if (!args.commit) {
    console.log("Synced locally. Use --commit, --push, or --deploy to publish directly.");
    return;
  }

  const changedCount = status.split("\n").filter(Boolean).length;
  const message = args.message || `content: sync ${changedCount} files from Obsidian`;
  run("git", ["add", args.target, "src/generated/content-manifest.json"], repoRoot);
  run("git", ["commit", "-m", message], repoRoot);

  if (args.push) {
    run("git", ["push"], repoRoot);
  }

  if (args.deploy) {
    run("npm", ["run", "deploy"], repoRoot);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
