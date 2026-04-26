# Acceptance Criteria

This project treats `content/chats/*.md` as the source of truth. A deployment is only acceptable when the public site, generated manifest, and rendered chat pages match the published Markdown files.

## Content Source

- A published chat is any Markdown file under `content/chats/` whose frontmatter contains `published: true`.
- An unpublished chat is any Markdown file under `content/chats/` missing `published: true` or explicitly containing `published: false`.
- The generated content manifest MUST contain every published chat and MUST NOT contain unpublished chats.
- The homepage MUST list exactly the published chats. It must not list extra records and must not miss any published record.

## Topics

- `/topics` MUST list exactly the topics derived from published chats.
- Topic titles and topic counts MUST match the `topic` frontmatter values from published chats.
- Unpublished chats MUST NOT contribute topics, counts, models, or links.

## Tags

- `/tags` MUST list exactly the tags derived from published chats.
- Tag names and tag counts MUST match the `tags` frontmatter values from published chats.
- Unpublished chats MUST NOT contribute tags, counts, or links.
- Every tag MUST have an accessible `/tags/[slug]` page listing its associated published chats.

## Chat Detail Routes

- Every published chat MUST have an accessible `/chats/[slug]` page.
- The chat page title MUST match the source Markdown `title` frontmatter.
- The visible content in `/chats/[slug]` MUST preserve the source Markdown body content.
- Internal Markdown headings inside a model answer MUST remain inside that model answer. They MUST NOT be split into fake chat messages.

## Chat Insights (Right Panel)

- If a chat has an `insights` field in frontmatter, the right panel MUST render it as Markdown.
- Markdown formatting in insights (links, lists, bold, headings) MUST render correctly.
- If a chat does NOT have an `insights` field, the right panel MUST display a placeholder message.
- Chat detail pages MUST NOT call Gemini API to generate chat-level insights.

## Chat Conversation Layout

- User messages MUST render as user chat turns and visually align to the right side of the conversation column.
- Model messages MUST render as model chat turns and visually align to the left side of the conversation column.
- User and model turns MUST be visually distinct by role label, spacing, and bubble/background style.
- The page MUST behave like a stored LLM chat transcript: a long scrollable conversation with no simulated streaming.

## Required Regression Checks

Before considering a deployment correct, run automated checks that verify:

- Published count equals manifest count.
- Homepage source data equals published Markdown files.
- Topic source data equals published Markdown files.
- Tag source data equals published Markdown files.
- Every published chat can be resolved by slug.
- Every chat's manifest `rawMarkdown` equals the Markdown body from the source file.
- `harness 自动化开发.md` keeps answer-internal headings inside the `perplexity` message instead of splitting them into unknown messages.
- User chat turns expose a right-aligned role marker.
- Assistant chat turns expose a left-aligned role marker.
