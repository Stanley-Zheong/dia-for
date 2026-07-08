import { describe, expect, it, vi } from "vitest";

async function loadSeo(env: Record<string, string | undefined> = {}) {
  vi.resetModules();
  for (const key of [
    "SITE_PROFILE",
    "NEXT_PUBLIC_SITE_URL",
    "NEXT_PUBLIC_ANALYTICS_ENDPOINT",
    "NEXT_PUBLIC_SITE_NAME",
    "NEXT_PUBLIC_SITE_DESCRIPTION",
  ]) {
    if (env[key] === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = env[key];
    }
  }
  return import("@/lib/seo");
}

describe("SEO and GEO helpers", () => {
  it("builds canonical and hreflang alternates from the active site profile", async () => {
    const { canonicalUrl, languageAlternates } = await loadSeo({ SITE_PROFILE: "global" });

    expect(canonicalUrl("/zh/yuan-shan")).toBe("https://info.19999991.xyz/zh/yuan-shan");
    expect(languageAlternates("/yuan-shan")).toEqual({
      zh: "https://info.19999991.xyz/zh/yuan-shan",
      en: "https://info.19999991.xyz/en/yuan-shan",
      ja: "https://info.19999991.xyz/ja/yuan-shan",
      ko: "https://info.19999991.xyz/ko/yuan-shan",
    });
  });

  it("emits llms text for generative engines", async () => {
    const { llmsText } = await loadSeo({ SITE_PROFILE: "domestic" });
    const text = llmsText();

    expect(text).toContain("# 二DD水");
    expect(text).toContain("https://dachanghao.com/zh/brainwave");
    expect(text).toContain("GEO");
  });
});
