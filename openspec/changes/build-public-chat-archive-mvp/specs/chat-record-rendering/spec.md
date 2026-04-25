## ADDED Requirements

### Requirement: Render chat detail pages

The system SHALL provide a public detail page for each published chat record using a large-language-model chat layout with user messages and model responses in a long scrollable conversation.

#### Scenario: Visitor opens a chat record

- **WHEN** a visitor opens a published chat record
- **THEN** the system displays the conversation messages in chronological order with role/model labels

### Requirement: Render Markdown-rich messages

The system SHALL render Markdown content in messages, including paragraphs, headings, lists, links, blockquotes, and code blocks.

#### Scenario: Message contains code block

- **WHEN** a chat message contains a Markdown code block
- **THEN** the system renders the code block as formatted code within the conversation

### Requirement: Show record context

The system SHALL show the chat title, topic, models, created date, tags, and source metadata near the chat record.

#### Scenario: Metadata exists for a chat record

- **WHEN** a published chat record has metadata
- **THEN** the system displays the metadata without requiring visitor authentication

### Requirement: Provide non-streaming static reading

The system MUST render complete stored conversations without simulating streaming responses.

#### Scenario: Page loads

- **WHEN** a visitor loads a chat detail page
- **THEN** the system displays the available stored content as a complete readable page
