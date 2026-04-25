## ADDED Requirements

### Requirement: List published chats by recency

The system SHALL provide a public home or index view that lists published chat records by created date or publication date.

#### Scenario: Visitor opens the home page

- **WHEN** published chat records exist
- **THEN** the system lists them with title, topic, models, date, and a link to the chat detail page

### Requirement: Browse by topic

The system SHALL provide a public topic page that aggregates published chat records sharing the same topic.

#### Scenario: Visitor opens a topic page

- **WHEN** multiple published chat records share a topic
- **THEN** the system displays the topic overview and links to the related chat records

### Requirement: Browse by model

The system SHALL provide public model pages that list published chat records associated with a selected model.

#### Scenario: Visitor opens a model page

- **WHEN** published chat records include the selected model in metadata
- **THEN** the system lists those records and links back to their topics and detail pages

### Requirement: Support left navigation

The system SHALL provide navigation that helps visitors move between recent records, topics, models, and titles.

#### Scenario: Visitor navigates public content

- **WHEN** a visitor is reading or browsing content
- **THEN** the system provides visible navigation to related public sections
