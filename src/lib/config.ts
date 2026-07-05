import path from "node:path";

const configuredContentDir = process.env.OBSIDIAN_CONTENT_DIR;

export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME ?? "三he水",
  description:
    process.env.NEXT_PUBLIC_SITE_DESCRIPTION ??
    "脑电波、远山、小桔灯：对话、资讯和产品矩阵的公开信息站。",
  contentDir: configuredContentDir
    ? path.resolve(/* turbopackIgnore: true */ process.cwd(), configuredContentDir)
    : path.join(process.cwd(), "content", "chats"),
  geminiModel: process.env.GEMINI_MODEL ?? "gemini-2.5-flash",
};
