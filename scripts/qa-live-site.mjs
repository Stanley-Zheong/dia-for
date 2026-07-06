import { chromium, webkit } from "playwright";
import fs from "node:fs/promises";

const base = process.env.QA_BASE_URL ?? "https://info.19999991.xyz";
const manifest = JSON.parse(
  await fs.readFile(new URL("../src/generated/content-manifest.json", import.meta.url), "utf8"),
);

function sectionHref(section) {
  if (section === "brainwave") return "/zh/brainwave";
  if (section === "yuan-shan") return "/zh/yuan-shan";
  return "/zh/xiao-ju-deng";
}

function canonical(rawUrl) {
  const url = new URL(rawUrl, base);
  url.hash = "";
  url.search = "";
  if (!url.pathname.includes(".") && !url.pathname.endsWith("/")) {
    url.pathname += "/";
  }
  return url.toString();
}

const articleUrls = manifest.map((item) =>
  canonical(`${base}${sectionHref(item.meta.section)}/${item.slug}`),
);
const expectedTitles = new Map(
  manifest.map((item) => [
    canonical(`${base}${sectionHref(item.meta.section)}/${item.slug}`),
    item.meta.title,
  ]),
);

async function checkPage(page, url) {
  const response = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
  const status = response?.status() ?? 0;
  const html = await page.content();
  const bodyText = await page.locator("body").innerText({ timeout: 5000 }).catch(() => "");
  const h1Count = await page.locator("h1").count().catch(() => 0);
  const internalLinks = await page
    .$$eval(
      "a[href]",
      (anchors, origin) =>
        anchors
          .map((anchor) => anchor.href)
          .filter((href) => href.startsWith(origin)),
      base,
    )
    .catch(() => []);
  const errors = [];

  if (status < 200 || status >= 400) errors.push(`bad-status:${status}`);
  if (/Error 1102|Worker exceeded resource limits|cloudflare ray id|__next_error__/i.test(html)) {
    errors.push("error-page");
  }
  if (bodyText.trim().length < 120) errors.push(`short-body:${bodyText.trim().length}`);
  if (h1Count < 1) errors.push("missing-h1");
  if (html.includes("�")) errors.push("replacement-char");

  const expectedTitle = expectedTitles.get(canonical(url));
  if (expectedTitle && !bodyText.includes(expectedTitle)) {
    errors.push(`missing-article-title:${expectedTitle}`);
  }

  return {
    url,
    finalUrl: page.url(),
    status,
    bodyLength: bodyText.trim().length,
    h1Count,
    internalLinks,
    errors,
  };
}

async function runBrowser(browserType, name) {
  const browser = await browserType.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const consoleErrors = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });

  const seen = new Set();
  const queue = [
    canonical(`${base}/zh`),
    canonical(`${base}/en`),
    canonical(`${base}/zh/brainwave`),
    canonical(`${base}/zh/yuan-shan`),
    canonical(`${base}/zh/xiao-ju-deng`),
    ...articleUrls,
  ];
  const results = [];

  for (let index = 0; index < queue.length; index += 1) {
    const url = canonical(queue[index]);
    if (seen.has(url)) continue;
    seen.add(url);

    const result = await checkPage(page, url);
    results.push(result);

    for (const href of result.internalLinks) {
      const link = canonical(href);
      if (!seen.has(link) && !queue.includes(link)) {
        queue.push(link);
      }
    }
  }

  await page.goto(`${base}/zh`, { waitUntil: "domcontentloaded", timeout: 30000 });
  await page.locator('a[href="/zh/yuan-shan"]').first().click();
  await page.waitForLoadState("domcontentloaded", { timeout: 30000 });
  const afterYuanShan = page.url();
  const expectedArticleUrl = canonical(`${base}/zh/yuan-shan/2026-07-03-token-factory`);
  const articleClickTarget = page
    .locator(
      'a[href="/zh/yuan-shan/2026-07-03-token-factory"], a[href="/zh/yuan-shan/2026-07-03-token-factory/"]',
    )
    .first();
  const articleClickTargetCount = await articleClickTarget.count();
  if (articleClickTargetCount > 0) {
    await Promise.all([
      page.waitForURL(expectedArticleUrl, { timeout: 30000 }),
      articleClickTarget.click(),
    ]);
  }
  const afterArticle = page.url();
  const clickHtml = await page.content();

  await browser.close();

  const articlePages = results.filter((result) => articleUrls.includes(canonical(result.url)));
  return {
    browser: name,
    visited: results.length,
    failures: results.filter((result) => result.errors.length > 0),
    articlePages: articlePages.length,
    expectedArticles: manifest.length,
    missingArticlePages: articleUrls.filter(
      (url) => !articlePages.map((result) => canonical(result.url)).includes(url),
    ),
    linkedInternalCount: new Set(
      results.flatMap((result) => result.internalLinks.map((href) => canonical(href))),
    ).size,
    consoleErrors,
    clickPath: {
      afterYuanShan,
      afterArticle,
      articleClickTargetCount,
      clickFailed:
        articleClickTargetCount < 1 ||
        canonical(afterArticle) !== expectedArticleUrl ||
        /Error 1102|Worker exceeded resource limits|cloudflare ray id|__next_error__/i.test(clickHtml),
    },
  };
}

const reports = [
  await runBrowser(chromium, "chromium"),
  await runBrowser(webkit, "webkit"),
];

console.log(JSON.stringify(reports, null, 2));

const failed = reports.some(
  (report) =>
    report.failures.length > 0 ||
    report.missingArticlePages.length > 0 ||
    report.articlePages !== report.expectedArticles ||
    report.clickPath.clickFailed ||
    report.consoleErrors.length > 0,
);

if (failed) {
  process.exit(1);
}
