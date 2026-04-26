## Context

The site is a new public web project for publishing AI chat records that are captured in Obsidian. Obsidian remains the private knowledge base and editing environment; the web app reads published Markdown notes, renders them for public visitors, and builds AI-assisted discovery on top of the published corpus.

The MVP has no login and no in-browser content editing. Public pages are generated from Markdown notes with frontmatter metadata. Gemini is used for AI Search and can also generate cacheable summaries, viewpoints, and comparisons.

## Goals / Non-Goals

**Goals:**

- Launch a public content site backed by Obsidian Markdown.
- Render individual chat records with a familiar LLM chat layout.
- Support browsing by time, title, topic, and model.
- Support topic pages that bring together multiple model conversations.
- Generate and display summaries, viewpoints, consensus, and differences.
- Provide Gemini-powered search grounded in published chat content.
- Make AI-generated content cacheable and reproducible from source Markdown.

**Non-Goals:**

- Do not build a full CMS or replace Obsidian editing workflows.
- Do not support private pages, accounts, roles, or login in the MVP.
- Do not support streaming chat responses in the public UI.
- Do not support direct chat with models as a primary site workflow.
- Do not import arbitrary browser history or provider-specific private data.

## Decisions

### Use Obsidian Markdown as the source of truth

Published content will come from a configured Obsidian export/content directory. Notes must include frontmatter such as `published`, `title`, `topic`, `models`, `created`, and `tags`.

Alternative considered: store and edit content directly in a database-backed CMS. That would duplicate Obsidian and make publishing workflow heavier. The MVP should keep content authoring in Obsidian.

### Require explicit publication metadata

Only notes with `published: true` are imported, rendered, indexed, or sent to Gemini. Notes without this flag are ignored.

Alternative considered: publish everything from a configured folder. That is simpler but unsafe for a public site because clipped chats may contain private context.

### Parse conversations from structured Markdown conventions

The ingestion layer will support a simple Markdown convention for roles and model names, such as headings for `User`, `ChatGPT`, `Claude`, `Gemini`, or another model. The parsed representation should preserve the original Markdown content while exposing normalized messages for chat rendering.

Alternative considered: require a strict JSON export format. JSON is easier to parse but does not match the user's Obsidian clipping workflow.

### Build public browsing routes around content metadata

The public app will expose routes for home/latest content, chat details, topics, models, and search. Topic pages aggregate all published conversations with the same topic key or slug.

Alternative considered: only ship a search-first interface. Search is useful, but browsing by time/topic/model is important for a public content site.

### Separate raw content from generated insight artifacts

Summaries, extracted viewpoints, consensus, differences, and search snippets are derived artifacts. They can be regenerated from source Markdown and should not replace or mutate the original note content.

Alternative considered: write generated summaries back into Obsidian notes. That creates two-way synchronization complexity and makes the public site capable of changing the knowledge base.

### Use Gemini for grounded AI Search

Gemini will receive selected published snippets and return a grounded answer with source references. The search flow may combine lexical matching, simple local indexing, and Gemini summarization in the MVP. A vector index can be added when the content corpus grows.

Alternative considered: require pgvector from day one. It is powerful but adds database and ingestion complexity before the MVP proves the publishing flow.

### Prefer static or cached rendering where possible

Content pages and generated insights should be build-time or server-side cached when possible. Search can remain dynamic because it depends on user queries and Gemini calls.

Alternative considered: make every page request dynamically parse Markdown and call Gemini. That would be slower, more expensive, and less predictable.

## Risks / Trade-offs

- Private content accidentally published -> Mitigate by requiring `published: true`, documenting frontmatter expectations, and indexing only eligible notes.
- Inconsistent clipping formats -> Mitigate by starting with a documented Markdown convention and preserving raw Markdown when perfect message parsing is not possible.
- Gemini hallucinated summaries or search answers -> Mitigate by grounding responses in selected published snippets and showing source links.
- AI costs and latency -> Mitigate through caching generated insights and keeping search snippets bounded.
- Public site SEO exposes incomplete drafts -> Mitigate by excluding unpublished notes and only listing pages with valid title/topic metadata.
- Topic/model metadata drift -> Mitigate with frontmatter normalization and slug generation rules.

## Migration Plan

1. Create the initial web app scaffold.
2. Add a sample Obsidian content directory with public Markdown fixtures.
3. Implement Markdown/frontmatter ingestion and filtering.
4. Implement public browsing and chat rendering routes.
5. Add cached AI insight generation.
6. Add Gemini AI Search over published content.
7. Deploy with environment configuration for content path and Gemini API key.

Rollback is simple for the MVP: disable deployment or revert to a previous build because Obsidian remains the source of truth and generated artifacts are disposable.

## Open Questions

- What exact Markdown heading convention will the Obsidian clipping plugin produce for user/model roles?
- Will the public site read notes from the same repository, a synced folder, or a separate exported content repo?
- Should generated AI artifacts be stored as files, database rows, or build-cache entries in the first implementation?
- Which Gemini model and API quota will be used for production search?
