import fs from "node:fs/promises";
import path from "node:path";

const repoRoot = process.cwd();
const codebasesDir = path.resolve(
  repoRoot,
  process.env.CODEBASES_DIR ?? "/Users/laosanzheong/Documents/codebases",
);
const outputDir = path.resolve(repoRoot, process.env.PRODUCTS_CONTENT_DIR ?? "content/products");

const skipNames = new Set(["node_modules", ".git", ".next", "3rd"]);

function slugify(value) {
  const slug = String(value)
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "product";
}

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function readJson(filePath) {
  try {
    return JSON.parse(await fs.readFile(filePath, "utf8"));
  } catch {
    return null;
  }
}

async function discoverProjects() {
  const entries = await fs.readdir(codebasesDir, { withFileTypes: true });
  const projects = [];

  for (const entry of entries) {
    if (!entry.isDirectory() || skipNames.has(entry.name)) continue;
    const projectDir = path.join(codebasesDir, entry.name);
    const readmePath = path.join(projectDir, "README.md");
    const packagePath = path.join(projectDir, "package.json");
    const pyprojectPath = path.join(projectDir, "pyproject.toml");

    if (!(await exists(readmePath)) && !(await exists(packagePath)) && !(await exists(pyprojectPath))) {
      continue;
    }

    projects.push({ name: entry.name, projectDir, readmePath, packagePath, pyprojectPath });
  }

  return projects.sort((a, b) => a.name.localeCompare(b.name));
}

async function projectMarkdown(project) {
  const pkg = (await exists(project.packagePath)) ? await readJson(project.packagePath) : null;
  const readme = (await exists(project.readmePath))
    ? (await fs.readFile(project.readmePath, "utf8")).trim()
    : "";
  const title = pkg?.name ?? project.name;
  const summary =
    pkg?.description ??
    readme
      .split("\n")
      .map((line) => line.replace(/^#+\s*/, "").trim())
      .find((line) => line.length > 0 && !line.startsWith("![")) ??
    "待补充产品介绍。";
  const stack = [
    pkg ? "Node.js" : null,
    (await exists(project.pyprojectPath)) ? "Python" : null,
  ].filter(Boolean);

  return `---\ntitle: ${JSON.stringify(title)}\nsection: xiao-ju-deng\ncategory: product\npublished: false\ncreated: ${new Date().toISOString().slice(0, 10)}\nrepo_path: ${JSON.stringify(project.projectDir)}\nstack:${stack.map((item) => `\n  - ${item}`).join("") || " []"}\nstatus: active\nsummary: ${JSON.stringify(summary)}\ntags:\n  - 产品矩阵\n---\n\n${summary}\n\n## 项目说明\n\n${readme || "待补充。"}\n`;
}

await fs.mkdir(outputDir, { recursive: true });
const projects = await discoverProjects();
let written = 0;

for (const project of projects) {
  const outputPath = path.join(outputDir, `${slugify(project.name)}.md`);
  if (await exists(outputPath)) {
    continue;
  }
  await fs.writeFile(outputPath, await projectMarkdown(project), "utf8");
  written += 1;
}

console.log(`Generated ${written} product candidate(s) in ${outputDir}`);
