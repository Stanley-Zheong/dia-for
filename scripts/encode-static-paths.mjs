import fs from "node:fs/promises";
import path from "node:path";

const outDir = path.resolve(process.cwd(), "out");
const nonAsciiPattern = /[^\x00-\x7F]/;

function encodeSegment(segment) {
  return nonAsciiPattern.test(segment) ? encodeURIComponent(segment) : segment;
}

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function duplicateEncodedEntries(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true }).catch(() => []);
  let copied = 0;

  for (const entry of entries) {
    const source = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      copied += await duplicateEncodedEntries(source);
    }

    const encodedName = encodeSegment(entry.name);
    if (encodedName === entry.name) {
      continue;
    }

    const target = path.join(dir, encodedName);
    if (await exists(target)) {
      continue;
    }

    await fs.cp(source, target, { recursive: true });
    copied += 1;
  }

  return copied;
}

const copied = await duplicateEncodedEntries(outDir);
console.log(`Encoded static path aliases: ${copied}`);
