import fs from "node:fs/promises";
import path from "node:path";

const outDir = path.resolve(process.cwd(), "out");

await fs.rm(outDir, { force: true, recursive: true });
console.log("Cleaned static output directory.");
