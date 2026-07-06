import fs from "node:fs/promises";
import path from "node:path";

const repoRoot = process.cwd();
const outDir = path.resolve(repoRoot, "out");
const manifestPath = path.resolve(repoRoot, "src/generated/content-manifest.json");
const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));

function sectionPath(section) {
  if (section === "brainwave") return "/brainwave";
  if (section === "yuan-shan") return "/yuan-shan";
  return "/xiao-ju-deng";
}

function redirectHtml(targetPath) {
  const safePath = JSON.stringify(targetPath);
  const zhPath = `/zh${targetPath}`;
  const enPath = `/en${targetPath}`;
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="refresh" content="0; url=${zhPath}">
  <title>三he水</title>
  <script>
    (function () {
      var path = ${safePath};
      var cookie = document.cookie.match(/(?:^|;\\s*)locale=(zh|en)(?:;|$)/);
      var preferred = cookie ? cookie[1] : ((navigator.languages && navigator.languages[0]) || navigator.language || "zh").toLowerCase();
      var locale = preferred.indexOf("en") === 0 ? "en" : "zh";
      window.location.replace("/" + locale + path + window.location.search + window.location.hash);
    })();
  </script>
</head>
<body>
  <a href="${zhPath}">中文</a>
  <a href="${enPath}">English</a>
</body>
</html>
`;
}

async function writeRedirect(targetPath) {
  const normalized = targetPath === "/" ? "" : targetPath;
  const dir = path.join(outDir, normalized);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, "index.html"), redirectHtml(normalized), "utf8");
}

const paths = new Set([
  "/",
  "/brainwave",
  "/yuan-shan",
  "/xiao-ju-deng",
  "/topics",
  "/tags",
  "/search",
  "/yuan-shan/ai",
  "/yuan-shan/data",
  "/yuan-shan/new-energy",
  "/yuan-shan/traditional-ai",
  "/yuan-shan/education-ai",
]);

for (const item of manifest) {
  paths.add(`${sectionPath(item.meta.section)}/${item.slug}`);
  for (const alias of item.aliases ?? []) {
    paths.add(`${sectionPath(item.meta.section)}/${alias}`);
  }
}

await Promise.all(Array.from(paths).map(writeRedirect));
console.log(`Wrote ${paths.size} locale redirect page(s).`);
