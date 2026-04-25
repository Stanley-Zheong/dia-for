# Obsidian Publishing Convention

The public site reads Markdown notes from `OBSIDIAN_CONTENT_DIR`. Obsidian remains the source of truth; the site only imports, renders, indexes, and derives AI artifacts from published notes.

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
