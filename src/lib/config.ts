import type { Locale } from "@/lib/i18n";

const configuredContentDir = process.env.OBSIDIAN_CONTENT_DIR;
const siteProfile = process.env.SITE_PROFILE === "domestic" ? "domestic" : "global";

const profileDefaults = {
  global: {
    primaryUrl: "https://info.19999991.xyz",
    locales: ["zh", "en", "ja", "ko"] as Locale[],
    contacts: [
      { label: "X", href: "https://x.com/" },
      { label: "GitHub", href: "https://github.com/Stanley-Zheong" },
    ],
  },
  domestic: {
    primaryUrl: "https://dachanghao.com",
    locales: ["zh"] as Locale[],
    contacts: [
      { label: "微信", href: "#" },
    ],
  },
} as const;

const activeProfile = profileDefaults[siteProfile];

export const siteConfig = {
  profile: siteProfile,
  name: process.env.NEXT_PUBLIC_SITE_NAME ?? "三he水",
  description:
    process.env.NEXT_PUBLIC_SITE_DESCRIPTION ??
    "脑电波、远山、小桔灯：对话、资讯和产品矩阵的公开信息站。",
  primaryUrl: (process.env.NEXT_PUBLIC_SITE_URL ?? activeProfile.primaryUrl).replace(/\/+$/u, ""),
  locales: activeProfile.locales,
  contacts: activeProfile.contacts,
  analyticsEndpoint: process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT || undefined,
  contentDir: configuredContentDir ?? "content/chats",
  geminiModel: process.env.GEMINI_MODEL ?? "gemini-2.5-flash",
};
