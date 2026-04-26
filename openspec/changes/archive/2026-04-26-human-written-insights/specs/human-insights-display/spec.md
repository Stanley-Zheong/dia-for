## ADDED Requirements

### Requirement: Chat frontmatter supports insights field

The system SHALL support an optional `insights` field in chat frontmatter. The field SHALL accept a multi-line Markdown string using YAML `|` syntax.

#### Scenario: Chat with insights field

- **WHEN** a chat Markdown file contains `insights: |` followed by multi-line content in frontmatter
- **THEN** the content is parsed and available as `meta.insights` string
- **AND** the string preserves line breaks and Markdown formatting

#### Scenario: Chat without insights field

- **WHEN** a chat Markdown file does not contain an `insights` field
- **THEN** `meta.insights` is `undefined`
- **AND** no error is thrown during parsing

### Requirement: Right panel displays human insights with Markdown rendering

The chat detail page right panel SHALL display `meta.insights` content rendered as Markdown. The rendering SHALL support links, lists, headings, bold, and code formatting.

#### Scenario: Insights rendered as Markdown

- **WHEN** a chat has `insights` content containing Markdown formatting
- **THEN** the right panel renders the content with full Markdown support
- **AND** the visual style is consistent with the center column

#### Scenario: Links in insights are clickable

- **WHEN** insights contain Markdown links like `[text](url)`
- **THEN** the links render as clickable `<a>` elements

### Requirement: Placeholder shown when no insights exist

When a chat does not have an `insights` field, the right panel SHALL display a placeholder message instead of calling AI to generate content.

#### Scenario: No insights displays placeholder

- **WHEN** a chat has no `insights` field in frontmatter
- **THEN** the right panel displays "暂无价值提炼" and a helpful message
- **AND** no Gemini API call is made for this chat

### Requirement: AI chat insights generation is removed

The system SHALL NOT call Gemini API to generate chat-level insights. The `getChatInsights()` function usage in chat detail pages SHALL be removed.

#### Scenario: No AI insights on chat pages

- **WHEN** a chat detail page is rendered
- **THEN** no call to `getChatInsights()` or `generateGeminiJson()` is made for chat insights
- **AND** topic comparison AI generation remains unchanged
