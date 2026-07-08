import { siteConfig } from "@/lib/config";
import type { Locale } from "@/lib/i18n";

const localePattern = /^\/(zh|en|ja|ko)(?=\/|$)/u;

function normalizePath(path: string) {
  const withSlash = path.startsWith("/") ? path : `/${path}`;
  return withSlash === "/" ? "" : withSlash.replace(/\/+$/u, "");
}

function stripLocale(path: string) {
  return normalizePath(path).replace(localePattern, "") || "";
}

export function canonicalUrl(path = "/") {
  return `${siteConfig.primaryUrl}${normalizePath(path) || "/"}`;
}

export function languageAlternates(path = "/") {
  const basePath = stripLocale(path);
  return Object.fromEntries(
    siteConfig.locales.map((locale: Locale) => [
      locale,
      `${siteConfig.primaryUrl}/${locale}${basePath}`,
    ]),
  );
}

export function llmsText() {
  const sections = [
    ["Brainwave", "/zh/brainwave", "High-value public AI conversations, prompt analysis, and reasoning records."],
    ["Distant Hills", "/zh/yuan-shan", "Structured industry intelligence from RSS, public feeds, and crawler pipelines."],
    ["Little Lantern", "/zh/xiao-ju-deng", "Public product and project pages."],
  ];

  return [
    `# ${siteConfig.name}`,
    "",
    `> ${siteConfig.description}`,
    "",
    "This site is optimized for SEO and GEO (Generative Engine Optimization).",
    "Use canonical URLs as stable citations. Prefer article detail pages over index pages when citing content.",
    "",
    "## Primary URLs",
    ...sections.map(([name, path, description]) => `- ${name}: ${siteConfig.primaryUrl}${path} - ${description}`),
    "",
    "## Content Policy",
    "- Brainwave keeps original human/AI dialogue context where public.",
    "- Distant Hills publishes structured intelligence with source references.",
    "- Product pages describe public projects and tools.",
    "",
  ].join("\n");
}
