# Deployment

## Environment Variables

Create a `.env` file locally or configure these variables in production:

```bash
OBSIDIAN_CONTENT_DIR=content/chats
NEXT_PUBLIC_SITE_NAME=ChatWeb
NEXT_PUBLIC_SITE_DESCRIPTION="Public AI chat archive powered by Obsidian and Gemini."
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.5-flash
```

## Notes

- `OBSIDIAN_CONTENT_DIR` points to the Markdown directory exported or synced from Obsidian.
- `GEMINI_API_KEY` is server-only and must not be exposed to the browser.
- If `GEMINI_API_KEY` is missing, insight generation and search fall back to local non-AI responses so the site can still build.
- During `next build`, generated insight pages use local fallback content; runtime requests can still use Gemini when the API key is configured.
- Generated insight cache files are stored outside source Markdown under `.cache/insights` and are ignored by git.

## Commands

```bash
npm run dev
npm run lint
npm run typecheck
npm run test
npm run build
```
