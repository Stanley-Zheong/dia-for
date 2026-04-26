## Why

This project needs a public web publishing layer for AI chat records that already live in Obsidian. The MVP should turn clipped Markdown conversations into a readable public site with topic/model navigation, ChatGPT-like presentation, AI-generated summaries, model comparisons, and Gemini-powered search.

## What Changes

- Add an Obsidian Markdown publishing pipeline that imports only public notes from a configured source directory.
- Render clipped conversations as public chat pages with a familiar large-language-model chat layout.
- Add topic, model, and time-based browsing so visitors can explore conversations from multiple angles.
- Add topic-level aggregation to compare multiple models discussing the same topic.
- Add AI-generated side-panel content for summaries, viewpoints, consensus, differences, and references.
- Add public Gemini-powered AI Search over published chat content.
- Keep Obsidian as the source of truth; the website does not provide editing, login, or private knowledge-base features.

## Capabilities

### New Capabilities

- `obsidian-publication-source`: Defines how public Obsidian Markdown notes are selected, parsed, and exposed to the site.
- `chat-record-rendering`: Defines how imported conversations are displayed as public ChatGPT-style pages.
- `topic-model-navigation`: Defines browsing and aggregation by topic, model, title, and time.
- `ai-insights-and-comparison`: Defines generated summaries, viewpoint extraction, consensus, and differences across models.
- `gemini-ai-search`: Defines public AI Search behavior powered by Gemini and grounded in published content.

### Modified Capabilities

- None.

## Impact

- Introduces a content ingestion layer for Obsidian Markdown and frontmatter.
- Introduces public routes for home, chat detail pages, topic pages, model pages, and search.
- Introduces generated/cacheable AI metadata for summaries, viewpoints, and comparisons.
- Introduces Gemini integration for AI Search and generated insights.
- Requires care around public-by-default publishing semantics so only explicitly published notes are indexed and rendered.
