## ADDED Requirements

### Requirement: Generate chat-level insights

The system SHALL generate or load cacheable AI insights for a published chat record, including summary, key viewpoints, and notable conclusions.

#### Scenario: Chat has generated insights

- **WHEN** a visitor opens a chat record with available insights
- **THEN** the system displays summary and key viewpoints in a side panel

### Requirement: Compare models within a topic

The system SHALL generate or load topic-level comparisons across published chat records that share a topic and include multiple models.

#### Scenario: Topic contains multiple model conversations

- **WHEN** a topic includes conversations from more than one model
- **THEN** the system displays shared viewpoints, differing viewpoints, and model-specific observations

### Requirement: Ground insights in source records

AI-generated insights MUST reference the published chat records or message excerpts used to produce them.

#### Scenario: Visitor reviews an insight

- **WHEN** the system displays a generated summary, viewpoint, consensus item, or difference item
- **THEN** the system provides a reference to the relevant public source record

### Requirement: Treat insights as derived artifacts

The system MUST keep generated insights separate from the original Obsidian Markdown content.

#### Scenario: Insights are regenerated

- **WHEN** source Markdown changes or insight generation is rerun
- **THEN** the system updates derived insights without mutating the source note
