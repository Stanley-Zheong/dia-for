## 1. Project Setup

- [x] 1.1 Scaffold the web app with Next.js, TypeScript, Tailwind CSS, and basic lint/build scripts
- [x] 1.2 Add project configuration for content source path, Gemini API key, and public site metadata
- [x] 1.3 Create sample Obsidian Markdown fixtures for published, unpublished, single-model, and multi-model chats

## 2. Obsidian Content Ingestion

- [x] 2.1 Implement Markdown file discovery from the configured Obsidian content source
- [x] 2.2 Parse frontmatter metadata for title, topic, models, created date, tags, source, and published status
- [x] 2.3 Filter all public indexes, routes, AI insights, and search context to `published: true` notes only
- [x] 2.4 Normalize slugs for chats, topics, models, and tags
- [x] 2.5 Parse role/model message sections from supported Markdown headings while preserving raw Markdown fallback content

## 3. Public Layout and Navigation

- [x] 3.1 Build the Google-inspired light theme, application shell, left navigation, center content column, and right insight column
- [x] 3.2 Implement the home/latest page listing public chats by recency
- [x] 3.3 Implement chat detail pages with ChatGPT-style long conversation rendering
- [x] 3.4 Implement topic index and topic detail pages aggregating related public chats
- [x] 3.5 Implement model detail pages listing public chats for a selected model

## 4. Chat Rendering

- [x] 4.1 Render normalized user and model messages in chronological order with role/model labels
- [x] 4.2 Render Markdown-rich message content including links, lists, blockquotes, and code blocks
- [x] 4.3 Display chat metadata including title, topic, models, created date, tags, and source
- [x] 4.4 Provide graceful fallback rendering for partially parsed conversations

## 5. AI Insights and Comparison

- [x] 5.1 Add a Gemini client abstraction for insight generation with server-side secret handling
- [x] 5.2 Generate or load cacheable chat-level summaries, viewpoints, and conclusions
- [x] 5.3 Generate or load topic-level consensus, differences, and model-specific observations
- [x] 5.4 Display insight references linking back to public source records
- [x] 5.5 Ensure generated insights are stored separately from source Markdown

## 6. Gemini AI Search

- [x] 6.1 Build a published-content search corpus from normalized metadata and Markdown snippets
- [x] 6.2 Implement a search API that retrieves relevant public snippets for a natural-language query
- [x] 6.3 Call Gemini to produce a grounded answer from selected snippets
- [x] 6.4 Display search answers with source links to public chat records
- [x] 6.5 Add recoverable UI states for empty queries, no results, Gemini errors, and timeouts

## 7. Verification and Release

- [x] 7.1 Add tests for publication filtering, metadata parsing, slug normalization, and message extraction
- [x] 7.2 Add tests or fixtures proving unpublished notes are excluded from pages, insights, and search
- [x] 7.3 Run lint, typecheck, and build successfully
- [x] 7.4 Document the Obsidian frontmatter and Markdown heading convention for publishing
- [x] 7.5 Document deployment environment variables and the Gemini configuration
