## ADDED Requirements

### Requirement: Generate multi-file manifest structure
The system SHALL generate a multi-file manifest structure consisting of a lightweight index and individual content files.

#### Scenario: Generate content index
- **WHEN** `npm run content:manifest` is executed
- **THEN** the system generates `src/generated/content-index.json` containing metadata for all published chats
- **AND** the index contains: slug, meta, aliases, parseStatus for each chat
- **AND** the index does NOT contain rawMarkdown or messages

#### Scenario: Generate individual chat files
- **WHEN** `npm run content:manifest` is executed
- **THEN** the system generates `src/generated/chats/{slug}.json` for each published chat
- **AND** each file contains: slug, aliases, rawMarkdown, parseStatus, meta, messages
- **AND** the file structure matches the original single-file format for compatibility

#### Scenario: Atomic generation
- **WHEN** generating the multi-file manifest
- **THEN** all content files are written before the index file
- **AND** the index references only existing content files

### Requirement: Maintain file naming consistency
The system SHALL use URL-safe slugs as filenames for individual chat files.

#### Scenario: Slug-based filename
- **GIVEN** a chat with slug "harness"
- **WHEN** generating the content file
- **THEN** the file is named `src/generated/chats/harness.json`

#### Scenario: Handle special characters in slug
- **GIVEN** a chat with slug containing special characters
- **WHEN** generating the content file
- **THEN** the slug is normalized to URL-safe format for the filename

### Requirement: Preserve existing data structure
The system SHALL maintain backward compatibility in the data structure of individual chat files.

#### Scenario: Content file structure matches original
- **GIVEN** an existing chat in the original manifest
- **WHEN** generating the new individual file
- **THEN** the JSON structure matches the original format
- **AND** all fields (slug, aliases, rawMarkdown, parseStatus, meta, messages) are preserved

### Requirement: Support published filtering
The multi-file structure SHALL maintain the existing published filtering semantics.

#### Scenario: Only published chats generate files
- **GIVEN** content with both published and unpublished chats
- **WHEN** generating the manifest
- **THEN** only chats with `published: true` in frontmatter generate content files
- **AND** only published chats appear in the index
