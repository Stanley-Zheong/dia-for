import { describe, expect, it, vi } from "vitest";

async function loadConfig(env: Record<string, string | undefined>) {
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
  return import("@/lib/config");
}

describe("site profiles", () => {
  it("uses the global profile for info.19999991.xyz with four locales and X/GitHub contacts", async () => {
    const { siteConfig } = await loadConfig({
      SITE_PROFILE: "global",
      NEXT_PUBLIC_SITE_URL: undefined,
      NEXT_PUBLIC_ANALYTICS_ENDPOINT: "https://collector.example/events",
    });

    expect(siteConfig.name).toBe("二DD水");
    expect(siteConfig.primaryUrl).toBe("https://info.19999991.xyz");
    expect(siteConfig.locales).toEqual(["zh", "en", "ja", "ko"]);
    expect(siteConfig.contacts.map((contact) => contact.label)).toEqual(["X", "GitHub"]);
    expect(siteConfig.analyticsEndpoint).toBe("https://collector.example/events");
  });

  it("uses the domestic profile for dachanghao.com with Chinese only and WeChat contact", async () => {
    const { siteConfig } = await loadConfig({
      SITE_PROFILE: "domestic",
      NEXT_PUBLIC_SITE_URL: undefined,
      NEXT_PUBLIC_ANALYTICS_ENDPOINT: undefined,
    });

    expect(siteConfig.primaryUrl).toBe("https://dachanghao.com");
    expect(siteConfig.locales).toEqual(["zh"]);
    expect(siteConfig.contacts.map((contact) => contact.label)).toEqual(["微信"]);
    expect(siteConfig.analyticsEndpoint).toBeUndefined();
  });
});
