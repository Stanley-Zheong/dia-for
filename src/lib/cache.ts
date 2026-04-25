import fs from "node:fs/promises";
import path from "node:path";

const cacheRoot = path.join(process.cwd(), ".cache", "insights");

export async function readJsonCache<T>(key: string) {
  const filePath = path.join(cacheRoot, `${key}.json`);

  try {
    const content = await fs.readFile(filePath, "utf8");
    return JSON.parse(content) as T;
  } catch {
    return null;
  }
}

export async function writeJsonCache(key: string, value: unknown) {
  const filePath = path.join(cacheRoot, `${key}.json`);
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}
