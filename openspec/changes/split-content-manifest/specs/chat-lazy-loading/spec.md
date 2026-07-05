## ADDED Requirements

### Requirement: Provide lightweight index for list views
The system SHALL provide a function to load only the lightweight index for list rendering.

#### Scenario: Load chat index
- **WHEN** rendering the home page or topic/model lists
- **THEN** the system calls `getChatIndex()` to load `content-index.json`
- **AND** the function returns only metadata (slug, meta, aliases, parseStatus)
- **AND** the full content is NOT loaded

#### Scenario: Index file size optimization
- **GIVEN** a large number of published chats
- **WHEN** loading the index
- **THEN** the index file size is significantly smaller than the original full manifest
- **AND** loading time is reduced compared to loading full content

### Requirement: Provide lazy loading for individual chats
The system SHALL provide a function to load full chat content on demand.

#### Scenario: Load single chat by slug
- **GIVEN** a chat slug "harness"
- **WHEN** rendering the chat detail page
- **THEN** the system calls `getChatBySlug("harness")` to load `src/generated/chats/harness.json`
- **AND** the function returns the full chat object with rawMarkdown and messages

#### Scenario: Handle missing chat file
- **GIVEN** a slug that does not exist
- **WHEN** calling `getChatBySlug()`
- **THEN** the function returns null
- **AND** does not throw an error

#### Scenario: Cache individual chat files
- **WHEN** repeatedly accessing the same chat file
- **THEN** the system leverages Next.js caching mechanisms
- **AND** avoids redundant file system reads

### Requirement: Maintain API compatibility
The lazy loading functions SHALL maintain backward compatibility with existing code.

#### Scenario: Existing getAllChats function
- **GIVEN** existing code calling `getAllChats()`
- **WHEN** the function is updated to use multi-file structure
- **THEN** the return type remains compatible
- **AND** existing code continues to work without modification

#### Scenario: Existing getChatBySlug function
- **GIVEN** existing code calling `getChatBySlug(slug)`
- **WHEN** the function is updated to use individual file
- **THEN** the return type remains compatible
- **AND** existing code continues to work without modification
