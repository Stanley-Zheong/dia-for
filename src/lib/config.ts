import path from "node:path";

const configuredContentDir = process.env.OBSIDIAN_CONTENT_DIR;

export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME ?? "ChatWeb",
  description:
    process.env.NEXT_PUBLIC_SITE_DESCRIPTION ??
    "Public AI chat archive powered by Obsidian and Gemini.",
  contentDir: configuredContentDir
    ? path.resolve(/* turbopackIgnore: true */ process.cwd(), configuredContentDir)
    : path.join(process.cwd(), "content", "chats"),
  geminiModel: process.env.GEMINI_MODEL ?? "gemini-2.5-flash",
};
