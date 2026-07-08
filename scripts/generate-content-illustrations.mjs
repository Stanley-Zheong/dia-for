import fs from "node:fs/promises";
import path from "node:path";

const repoRoot = process.cwd();
const manifestPath = path.join(repoRoot, "src", "generated", "content-manifest.json");
const outputDir = path.join(repoRoot, "public", "assets", "generated-illustrations");
const unsafeFilePartPattern = /[^a-z0-9-]+/g;

const palettes = [
  {
    skyTop: "#d7f7ff",
    skyBottom: "#f7feff",
    ridgeBack: "#8bbcc6",
    ridgeFront: "#2c7284",
    water: "#43b8c7",
    field: "#76b68b",
    accent: "#ffad72",
  },
  {
    skyTop: "#e4fbf4",
    skyBottom: "#fff8ed",
    ridgeBack: "#91c6b7",
    ridgeFront: "#357b68",
    water: "#1f9aa5",
    field: "#8fcf72",
    accent: "#f49a5d",
  },
  {
    skyTop: "#e6f3ff",
    skyBottom: "#fff6f0",
    ridgeBack: "#9eb4d5",
    ridgeFront: "#4e72a8",
    water: "#2f97c0",
    field: "#78b98f",
    accent: "#ff8f66",
  },
  {
    skyTop: "#ddfbff",
    skyBottom: "#fffbed",
    ridgeBack: "#89c7d0",
    ridgeFront: "#2f6680",
    water: "#13a6a6",
    field: "#9cc56c",
    accent: "#ffc66e",
  },
];

function safeFilePart(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(unsafeFilePartPattern, "-")
    .replace(/^-+|-+$/g, "") || "untitled";
}

function hashString(value) {
  let hash = 2166136261;
  for (const char of String(value)) {
    hash ^= char.codePointAt(0) ?? 0;
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function xmlEscape(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function fileNameFor(record) {
  return `${safeFilePart(record.meta.section)}-${safeFilePart(record.slug)}.svg`;
}

function point(seed, index, min, max) {
  const span = max - min;
  return min + ((seed >>> (index * 3)) % span);
}

function buildSvg(record) {
  const seedText = [
    record.meta.title,
    record.meta.topic,
    record.meta.category,
    ...(record.meta.tags ?? []),
  ].join("|");
  const seed = hashString(seedText);
  const palette = palettes[seed % palettes.length];
  const sunX = point(seed, 1, 170, 930);
  const sunY = point(seed, 2, 88, 190);
  const ridgePeakA = point(seed, 3, 180, 360);
  const ridgePeakB = point(seed, 4, 520, 720);
  const ridgePeakC = point(seed, 5, 820, 1020);
  const islandShift = point(seed, 6, -80, 120);
  const cloudShift = point(seed, 7, -120, 120);
  const title = xmlEscape(record.meta.title);
  const topic = xmlEscape(record.meta.topic ?? record.meta.category ?? record.meta.section);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675" role="img" aria-labelledby="title desc">
  <title id="title">${title}</title>
  <desc id="desc">A calm generated natural landscape for ${topic}.</desc>
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${palette.skyTop}"/>
      <stop offset="1" stop-color="${palette.skyBottom}"/>
    </linearGradient>
    <linearGradient id="water" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${palette.water}" stop-opacity="0.9"/>
      <stop offset="1" stop-color="#f7fffb"/>
    </linearGradient>
    <linearGradient id="field" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${palette.field}" stop-opacity="0.92"/>
      <stop offset="1" stop-color="#eff8d6"/>
    </linearGradient>
    <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="14"/>
    </filter>
  </defs>
  <rect width="1200" height="675" fill="url(#sky)"/>
  <circle cx="${sunX}" cy="${sunY}" r="62" fill="${palette.accent}" opacity="0.82"/>
  <circle cx="${sunX}" cy="${sunY}" r="102" fill="${palette.accent}" opacity="0.18" filter="url(#soft)"/>
  <g fill="#ffffff" opacity="0.72">
    <ellipse cx="${250 + cloudShift}" cy="132" rx="96" ry="24"/>
    <ellipse cx="${320 + cloudShift}" cy="116" rx="62" ry="21"/>
    <ellipse cx="${870 - cloudShift}" cy="164" rx="112" ry="26"/>
    <ellipse cx="${956 - cloudShift}" cy="146" rx="72" ry="22"/>
  </g>
  <path d="M0 366 L${ridgePeakA} 170 L430 352 L${ridgePeakB} 126 L782 352 L${ridgePeakC} 188 L1200 362 L1200 675 L0 675 Z" fill="${palette.ridgeBack}" opacity="0.62"/>
  <path d="M0 420 L226 274 L415 405 L615 228 L815 405 L1008 292 L1200 410 L1200 675 L0 675 Z" fill="${palette.ridgeFront}" opacity="0.9"/>
  <path d="M0 464 C180 430 302 488 488 454 C650 424 802 436 1200 400 L1200 675 L0 675 Z" fill="url(#water)" opacity="0.95"/>
  <path d="M0 538 C168 508 338 532 510 506 C718 474 930 494 1200 456 L1200 675 L0 675 Z" fill="url(#field)" opacity="0.94"/>
  <path d="M${122 + islandShift} 505 C238 458 380 464 493 500 C398 526 224 531 ${122 + islandShift} 505 Z" fill="#f1f8df" opacity="0.92"/>
  <g fill="none" stroke="#ffffff" stroke-linecap="round" opacity="0.52">
    <path d="M92 468 C240 454 318 488 455 470"/>
    <path d="M625 444 C760 430 842 458 1000 438"/>
    <path d="M154 585 C326 550 532 568 725 538"/>
    <path d="M776 570 C916 542 1042 546 1140 518"/>
  </g>
  <g opacity="0.16" fill="${palette.ridgeFront}">
    <circle cx="112" cy="614" r="6"/>
    <circle cx="168" cy="598" r="4"/>
    <circle cx="914" cy="614" r="5"/>
    <circle cx="1048" cy="586" r="4"/>
  </g>
</svg>
`;
}

const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
const publishedRecords = manifest.filter((record) => record.meta?.published === true);
const expectedFiles = new Set(publishedRecords.map(fileNameFor));

await fs.mkdir(outputDir, { recursive: true });

const existingFiles = await fs.readdir(outputDir).catch(() => []);
await Promise.all(
  existingFiles
    .filter((file) => file.endsWith(".svg") && !expectedFiles.has(file))
    .map((file) => fs.unlink(path.join(outputDir, file))),
);

await Promise.all(
  publishedRecords.map((record) =>
    fs.writeFile(path.join(outputDir, fileNameFor(record)), buildSvg(record), "utf8"),
  ),
);

console.log(`Generated ${publishedRecords.length} content illustrations.`);
