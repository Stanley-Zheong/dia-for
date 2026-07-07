# Obsidian Publishing Convention

The public site reads Markdown notes from `OBSIDIAN_CONTENT_DIR`. Obsidian remains the source of truth; the site only imports, renders, indexes, and derives AI artifacts from published notes.

## Direct Publish

Obsidian notes no longer need to be moved into `content/chats/` by hand. Keep
the notes in the vault, set `published: true`, then run one of these commands
from the `chatweb` repo:

```bash
# Sync Markdown from Obsidian into content/chats and regenerate the manifest.
npm run content:sync

# Sync, regenerate the manifest, commit, push, and deploy to Cloudflare.
npm run content:publish
```

The default source directory is:

```text
/Users/laosanzheong/Documents/obsdata/knowledge-center/raw/01-articles
```

Override it with `OBSIDIAN_SOURCE_DIR` when publishing from another machine or
vault path:

```bash
OBSIDIAN_SOURCE_DIR="/path/to/vault/dia-for" npm run content:publish
```

By default the sync copies only Markdown notes whose frontmatter has
`published: true`. Drafts and notes without frontmatter are not copied into the
public repository. The generated `content/chats/` directory is still committed
because Cloudflare cannot read a local Obsidian vault during production builds.

## Frontmatter

Only notes with `published: true` are public.

```yaml
---
title: "AI 编程工具选型讨论"
topic: "AI 编程工具"
models:
  - ChatGPT
  - Claude
source: "web-clipping"
published: true
created: 2026-04-25
tags:
  - ai-tools
  - coding
---
```

Supported fields:

- `title`: Public page title.
- `topic`: Topic grouping key.
- `models`: One or more model names.
- `source`: Optional source label, such as `web-clipping`.
- `published`: Must be `true` to appear publicly.
- `created`: Date used for recency sorting.
- `tags`: Optional public tags.

## Message Headings

Use level-2 Markdown headings for each message speaker.

```markdown
## User

Question text.

## ChatGPT

Model answer.

## Claude

Another model answer.
```

Recognized user headings include `User`, `Human`, `Me`, and `我`.

Recognized model headings include `ChatGPT`, `Claude`, `Gemini`, `DeepSeek`, `Grok`, `Assistant`, and `Model`.

If a note uses another heading, the site still renders the Markdown and marks message extraction as partial.
