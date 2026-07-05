## MODIFIED Requirements

### Requirement: Transform image paths during manifest generation
**Modification**: Added image path transformation step to content manifest generation.

The content manifest generation process SHALL transform local image paths to CDN URLs using the image manifest mapping.

#### Scenario: Replace local path with CDN URL
- **GIVEN** `image-manifest.json` contains mapping `{"content/attachments/img.png": {"url": "https://cdn.example.com/img.png"}}`
- **AND** a chat markdown contains `![](attachments/img.png)`
- **WHEN** `npm run content:manifest` executes
- **THEN** the generated content manifest stores the CDN URL instead of local path

#### Scenario: Preserve unmatched local paths
- **GIVEN** a markdown contains `![](attachments/unknown.png)`
- **AND** the image is NOT in `image-manifest.json`
- **WHEN** manifest is generated
- **THEN** the original local path is preserved (may show as broken image)

#### Scenario: Handle multiple images in one message
- **GIVEN** a chat message contains multiple local image references
- **WHEN** manifest is generated
- **THEN** each image path is independently transformed based on image manifest

## ADDED Requirements

### Requirement: Integrate image sync into content:manifest
The system SHALL invoke image sync as part of the content manifest generation process.

#### Scenario: Run image sync before content processing
- **WHEN** `npm run content:manifest` is executed
- **THEN** image detection and upload runs first
- **AND** then content manifest is generated with transformed image paths

#### Scenario: Image sync failure does not block content manifest
- **GIVEN** image sync encounters an error (e.g., network failure)
- **WHEN** `npm run content:manifest` runs
- **THEN** the error is logged as warning
- **AND** content manifest generation continues with original paths
