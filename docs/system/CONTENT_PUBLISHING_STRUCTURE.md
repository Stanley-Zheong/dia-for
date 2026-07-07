# Unified Content Publishing Structure

`info.19999991.xyz` is one public site with three upstream content sources:
chat notes, RSS intelligence, and crawler facts. The upstream systems may stay
separate, but every public page must enter the same content contract before it
is rendered by `chatweb`.

## 1. Goal

- Final business goal: publish trustworthy, bilingual, source-backed AI and
  business intelligence on one independent site.
- Primary measurable outcome: every public article can be traced to a source,
  has consistent page chrome, and passes the same publish gates.
- Secondary outcomes: reduce manual transfer, make article quality repeatable,
  support AI-assisted images, and keep chat pages close to mainstream LLM chat
  layout.
- Non-goals: merge all upstream repos into one runtime, let crawler/RSS publish
  directly without review gates, or republish copyrighted third-party full text
  without permission.

## 2. Users And Operators

| Actor | Goal | Touchpoints | Success Signal |
| --- | --- | --- | --- |
| Reader | Read useful public content in Chinese or English | Home, column pages, article pages, search | Clear title, summary, body, source, tags, and language switch |
| Editor | Approve and polish publishable items | Obsidian, Miniflux star, crawler review queue | One command or cron publishes approved content |
| RSS operator | Convert starred RSS into publishable intelligence | Miniflux, `ai-intel-daily`, `chatweb/content/yuan-shan` | Starred item becomes bilingual Markdown with evidence refs |
| Crawler operator | Turn structured facts into article candidates | `industry-crawler`, exchange JSON, review queue | Source facts become reviewed `source_item.1` and article tasks |
| Site maintainer | Keep all pages visually and legally consistent | `chatweb` components, tests, deploy pipeline | All pages share shell, footer, ICP/contact, references, and QA checks |

## 3. Subsystem Inventory

| Subsystem | Purpose | Owns | Does Not Own | Inputs | Outputs | First-Phase Status |
| --- | --- | --- | --- | --- | --- | --- |
| `chatweb` | Unified public site and static renderer | Page layout, content manifest, public routes, bilingual rendering | Raw crawling, RSS fetching, source truth creation | Markdown in `content/chats`, `content/yuan-shan`, `content/products` | Static site on Cloudflare Workers Assets | Active |
| Chat source | Human/AI conversation source | Original chat transcript and editor-approved notes | RSS/crawler facts | Obsidian notes, `knowcle` normalized logs | `content/chats/*.md` with `published: true` | Active |
| RSS source | Human-selected RSS intelligence | Miniflux starred entry, RSS metadata, AI enrichment result | Public page layout | RSSHub, wewe-rss, direct RSS, NetNewsWire star | Bilingual Yuan Shan Markdown | Active |
| Crawler source | Structured web facts | `source_item.1`, crawl evidence, extract confidence | Final publishing decision | Target pages, source rules, crawl jobs | Reviewed candidate facts or article packets | Candidate |
| AI enrichment | Transform source-backed facts into public article package | Title, summary, body, bilingual copy, tags, optional image prompt | Final source truth | Original text, metadata, evidence refs | `content_article.1` / Markdown | Partially active |

## 4. System Boundaries

| Boundary | Inside | Outside | Integration Rule |
| --- | --- | --- | --- |
| Public rendering | `chatweb` shared components and static routes | Upstream collection services | Upstreams only write reviewed Markdown/JSON contracts |
| Source truth | Obsidian note, RSS row, crawler evidence item | Generated page HTML | Page must show source refs from the contract |
| AI transformation | Summary, title extraction, bilingual rewrite, image prompt | Unverified facts | AI may transform wording, not invent claims |
| Legal text use | Own chat notes and licensed/permissioned sources | Full third-party copyrighted text without permission | Store raw internally when allowed; public page uses excerpt/analysis unless rights allow full republication |
| Deployment | Cloudflare Workers Assets | Miniflux/RSSHub/wewe-rss runtime | Public site must build without upstream services online |

## 5. Unified Content Contract

Every publishable item, regardless of source, should be normalized into
`content_article.1` before becoming Markdown.

```yaml
---
id: "source-stable-id"
section: "brainwave | yuan-shan | xiao-ju-deng"
source_kind: "chat | rss | crawler | product"
published: true
review_status: "approved"
created: "2026-07-07"
updated: "2026-07-07"

title: "中文标题"
title_en: "English title"
short_title: "不超过15字"
short_title_en: "Short title"
summary: "中文摘要，1-3 句"
summary_en: "English summary, 1-3 sentences"
tags:
  - "AI"
tags_zh:
  - "AI"
tags_en:
  - "AI"

source_name: "Source name"
source_url: "https://example.com/source"
canonical_url: "https://example.com/source"
source_author: "optional"
source_published_at: "2026-07-07"
source_text_status: "own | licensed | excerpted | unavailable"
evidence_refs:
  - label: "原文"
    url: "https://example.com/source"
    quote: "short compliant quote or empty"
    confidence: 0.9

body_mode: "chat_transcript | original_text | ai_processed | source_digest"
language: "bilingual"
hero_image:
  mode: "none | source | ai_generated"
  url: ""
  alt: ""
  prompt: ""
  license: "own | source_license | generated"
  approved: false
---
```

Body sections must exist in both languages:

```markdown
<!-- lang:zh -->
## 摘要

## 正文

## 来源与引用
<!-- /lang:zh -->

<!-- lang:en -->
## Summary

## Body

## Sources
<!-- /lang:en -->
```

`tap字` is treated as the public tag set: `tags`, `tags_zh`, and `tags_en`.
If a separate tab/category UI is needed later, it should be derived from
`section`, `category`, and `tags`, not manually duplicated.

## 6. Data Flow

```text
Chat:
knowcle / manual chat export
  -> Obsidian note
  -> editor sets published: true
  -> npm run content:sync or content:publish
  -> content/chats/*.md
  -> content-manifest.json
  -> chat-like article page

RSS:
RSSHub / wewe-rss / direct RSS
  -> Miniflux
  -> human star
  -> ai-intel-daily sync_miniflux.py
  -> starred_pending_ai
  -> ai_enrich.py
  -> publish_ready / published
  -> publish_to_chatweb.py
  -> content/yuan-shan/*.md
  -> content-manifest.json
  -> intelligence article page

Crawler:
industry-crawler job
  -> source_item.1 with evidence refs and original text availability
  -> human/rule review
  -> content_article.1 candidate
  -> AI bilingual polish and title compression
  -> approved Markdown
  -> content-manifest.json
  -> intelligence article page
```

## 7. Page Format Rules

All pages must share one site shell:

- Header: brand, three primary columns, search, language switch.
- Footer: ICP record, contact email or form link, source/copyright note,
  privacy/cookie link if introduced, and build/deploy identity if needed.
- Main width, typography, breadcrumb, published date, tags, source card, and
  related links must use shared components.
- Article pages should not create one-off headers, footers, source blocks, tag
  chips, or language switchers.
- Legacy routes may redirect, but final rendered pages must share the same shell.

Required shared components:

```text
AppShell
SiteHeader
SiteFooter
LanguageSwitch
ArticleHeader
ArticleMeta
SourceReferences
TagList
RelatedArticles
HeroImage
```

## 8. Reference Rules

All public article references must be consistent:

- `source_url` is the canonical external source link when available.
- `canonical_url` is the preferred permalink; if absent, use `source_url`.
- `evidence_refs` is the visible source list for facts, not hidden metadata.
- Internal links use section routes: `/brainwave/[slug]`,
  `/yuan-shan/[slug]`, `/xiao-ju-deng/[slug]`.
- Source cards always show source name, source date if known, and original URL.
- If original text was unavailable, say so in the source card; do not imply the
  AI saw the full article.
- For third-party copyrighted sources, quote only short excerpts and link to
  the original. Full original text can be published only for own content,
  licensed content, public-domain content, or explicitly permitted sources.

## 9. AI Image Rules

Some pages can have AI-generated images, but images are optional and gated:

- Use AI images for abstract analysis, product explainers, or crawler/RSS
  articles that benefit from visual framing.
- Do not generate misleading images for factual news where a real image is
  needed to identify the person, product, venue, or event.
- Every generated image must record prompt, model/tool if available, alt text,
  and approval status.
- Unapproved generated images must not render publicly.
- Chat transcript pages normally do not need hero images; keep the chat layout
  dominant.

## 10. Source Text And AI Processing Rules

Publishing should preserve source value without pretending every source can be
republished in full.

- Own chat content: publish the transcript or edited transcript directly.
- RSS/crawler with accessible original text and permission/compatible license:
  publish original text plus AI-generated bilingual summary, tags, and title.
- RSS/crawler with accessible original text but no republication permission:
  publish a source-backed digest, short compliant excerpt, analysis, and
  prominent source link.
- RSS/crawler with metadata only: publish only if evidence is sufficient; mark
  `source_text_status: unavailable`.
- AI must use the original text, source metadata, and `evidence_refs`; it must
  not add unsupported claims.
- Links should be structured as source cards and inline citations where useful,
  not as casual “read more” links with no context.

## 11. Title, Summary, Tags, And Body Rules

- Chinese public title should be concise and preferably no more than 15 Chinese
  characters. If the source title is longer, keep it as `source_title` and use
  a compressed `title` / `short_title`.
- English title should be natural, not a literal mechanical translation.
- Every business/intelligence article must have body, tags, and summary in both
  Chinese and English.
- Summary should answer: what happened, why it matters, and who should care.
- Body should be sectioned, not a single undifferentiated paragraph.
- Tags should be stable nouns, not temporary adjectives or one-off phrases.

## 12. Bilingual Rules

Every public item must provide Chinese and English:

- `title` and `title_en`
- `summary` and `summary_en`
- `tags_zh` and `tags_en`
- Chinese body block and English body block
- Image alt text in the current page language

If a source is only in one language, AI may translate and localize, but the
source card must still show original source language when known.

## 13. Chat Page Layout Rules

Brainwave/chat pages should be visually close to mainstream LLM chat products:

- Conversation column centered with strong readable line length.
- User messages right-aligned or visually separated.
- Assistant/model messages left-aligned.
- Speaker/model label, timestamp if available, and model badge.
- Markdown rendering supports code blocks, lists, tables, and quoted text.
- Article metadata and source references should be secondary, not interrupt the
  transcript.
- On mobile, chat bubbles must remain readable and not overflow.

The chat detail page can still have article framing, but the transcript should
feel like reading ChatGPT/Claude conversation history rather than a blog post.

## 14. Source Of Truth And Consistency Rules

| Entity/Data Type | Source Of Truth | Consumers | Consistency Rule | Risk If Violated |
| --- | --- | --- | --- | --- |
| Chat transcript | Obsidian / `knowcle` export | `chatweb` | `published: true` is required; sync copies only public notes | Private drafts leak |
| RSS article | `ai-intel-daily` DB row and source URL | `chatweb`, Obsidian raw | Only `publish_ready`, `processed`, `published` export | Raw RSS bypasses review |
| Crawler fact | `source_item.1` with evidence refs | AI enrichment, editor | Candidate must be reviewed before Markdown | Unsupported facts publish |
| Public route | `chatweb` manifest | Cloudflare static pages | One slug per article; old routes redirect | Broken links or duplicate pages |
| Tags/category | Frontmatter | Lists, filters, search | Derive display from same fields across all sections | Counts and filters disagree |
| Images | `hero_image` metadata | Article renderer | Render only approved source/generated images | Misleading visual claims |
| References | `evidence_refs` and source card | Article detail | Same component everywhere | Inconsistent attribution |

## 15. Roadmap

| Phase | Goal | Entry Condition | Exit Condition | Verification |
| --- | --- | --- | --- | --- |
| Contract | Adopt `content_article.1` fields | This proposal accepted | Manifest parser supports required fields | Unit tests for required metadata |
| Shared page shell | Same header/footer/contact/ICP everywhere | Contract stable | All routes use shared shell/footer | Screenshot/DOM tests include footer and source card |
| Source refs | Consistent references across sections | Evidence refs in Markdown | Article pages show one shared source component | Tests assert source card on all article types |
| Bilingual | All public content has zh/en fields and body blocks | Existing content audit complete | Build fails or warns for missing bilingual fields | Manifest validation report |
| AI images | Optional image generation gate | Image metadata contract accepted | Approved images render; unapproved do not | Tests for `hero_image.approved` |
| Crawler loop | Crawler facts become reviewed content articles | `source_item.1` finalized | One crawler item publishes through same pipeline | End-to-end fixture |
| Chat layout | LLM-like chat rendering | Existing transcript parser stable | Brainwave detail matches chat layout rules | Playwright desktop/mobile screenshots |

## 16. Hierarchical Breakdown

```text
Unified Information Site
└── Content Ingestion
    ├── Chat Sync
    │   └── Obsidian published notes -> content/chats
    ├── RSS Enrichment
    │   └── Miniflux starred rows -> content/yuan-shan
    └── Crawler Import
        └── source_item.1 -> reviewed content_article.1
└── Content Contract
    ├── Metadata Validation
    ├── Bilingual Body Validation
    ├── Reference Validation
    └── Image Metadata Validation
└── Public Rendering
    ├── Shared Shell
    ├── Article Header
    ├── Source References
    ├── Bilingual Renderer
    ├── Chat Transcript Renderer
    └── AI Image Renderer
└── Quality Gates
    ├── Manifest Validation
    ├── Build Validation
    ├── Link QA
    └── Visual QA
```

## 17. Decisions And Risks

| Decision/Risk | Options | Recommendation | Owner/Next Step |
| --- | --- | --- | --- |
| Full original text | Always publish / never publish / rights-aware | Rights-aware | Add `source_text_status` gate |
| AI images | Auto render / manual approval / disabled | Manual approval | Add `hero_image.approved` check |
| Crawler publishing | Direct publish / candidate review | Candidate review | Define crawler review queue |
| Title length | Preserve source title / compress title | Compress public title and keep `source_title` | Add title validation |
| Bilingual quality | Optional / required | Required for public pages | Add manifest validation report |
| Page consistency | Per-route custom layouts / shared shell | Shared shell | Refactor routes to shared components |

## 18. Next Work Packages

| Work Package | Type | Depends On | Output |
| --- | --- | --- | --- |
| `content-contract-validation` | OpenSpec / implementation | Proposal approval | Build-time validator for required fields |
| `shared-public-shell` | UI implementation | Contract validation | Header/footer/ICP/contact on all routes |
| `reference-component` | UI implementation | Contract validation | Shared source card and evidence list |
| `bilingual-renderer` | UI implementation | Content audit | Language-aware title/body/summary rendering |
| `ai-image-gate` | Feature implementation | Image metadata fields | Approved AI image rendering |
| `crawler-to-article` | Cross-system integration | `source_item.1` finalized | Reviewed crawler article publish path |
| `chat-layout-upgrade` | UI implementation | Transcript parser stable | LLM-like brainwave detail layout |
