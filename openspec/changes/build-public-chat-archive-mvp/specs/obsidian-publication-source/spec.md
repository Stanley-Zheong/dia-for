## ADDED Requirements

### Requirement: Import published Obsidian notes

The system SHALL import Markdown notes from a configured Obsidian content source and SHALL only include notes whose frontmatter contains `published: true`.

#### Scenario: Published note is imported

- **WHEN** a Markdown note contains valid frontmatter with `published: true`
- **THEN** the system includes the note in the public content index

#### Scenario: Unpublished note is ignored

- **WHEN** a Markdown note is missing `published: true` or has `published: false`
- **THEN** the system excludes the note from public pages, AI insights, and AI Search

### Requirement: Parse publication metadata

The system SHALL parse public note metadata including title, topic, models, created date, tags, and source when present.

#### Scenario: Metadata is available to routes

- **WHEN** a published note includes supported frontmatter fields
- **THEN** the system exposes normalized metadata for listing, detail, topic, model, and search views

### Requirement: Preserve source Markdown

The system MUST preserve the original Markdown body for rendering and AI grounding even when conversation message parsing is incomplete.

#### Scenario: Message parsing is incomplete

- **WHEN** a published note does not fully match the supported conversation heading convention
- **THEN** the system still renders the note content and marks normalized message extraction as partial
