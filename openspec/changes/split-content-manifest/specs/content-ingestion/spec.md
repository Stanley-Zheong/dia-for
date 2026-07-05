## MODIFIED Requirements

### Requirement: Modify manifest generation to multi-file output
**Modification**: Changed manifest generation from single-file to multi-file structure.

The content manifest generation SHALL produce multiple files instead of a single `content-manifest.json`.

#### Scenario: Generate both index and content files
- **GIVEN** published chats in `content/chats/*.md`
- **WHEN** `npm run content:manifest` executes
- **THEN** the system generates `src/generated/content-index.json`
- **AND** generates `src/generated/chats/{slug}.json` for each published chat
- **AND** the process is atomic (all files generated together)

#### Scenario: Skip generation for unpublished content
- **GIVEN** unpublished chats in content directory
- **WHEN** generating the manifest
- **THEN** unpublished chats do NOT generate content files
- **AND** unpublished chats do NOT appear in the index
- **AND** the published filtering behavior matches the original implementation

## ADDED Requirements

### Requirement: Clean up old manifest file
The system SHALL remove or deprecate the old `content-manifest.json` file after migration.

#### Scenario: Remove old manifest in final version
- **GIVEN** the multi-file structure is fully implemented and tested
- **WHEN** running the final migration
- **THEN** the old `src/generated/content-manifest.json` is no longer generated
- **AND** only the new multi-file structure exists

### Requirement: Provide migration compatibility
The system SHALL provide a transition period with both structures.

#### Scenario: Dual generation during migration
- **GIVEN** the migration is in progress
- **WHEN** running `npm run content:manifest`
- **THEN** both old and new structures may be generated
- **AND** the system can be configured to use either structure
