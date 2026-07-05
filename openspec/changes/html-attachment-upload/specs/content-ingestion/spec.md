## MODIFIED Requirements

### Requirement: Transform HTML attachment links during manifest generation
**Modification**: Added HTML attachment link transformation step to content manifest generation.

The content manifest generation process SHALL transform local HTML attachment paths to CDN URLs using the attachment manifest mapping.

#### Scenario: Replace local HTML path with CDN URL
- **GIVEN** `attachment-manifest.json` contains mapping `{"content/attachments/html/file.html": {"url": "https://cdn.example.com/attachments/html/file.html"}}`
- **AND** a chat markdown contains `[查看可视化](./attachments/html/file.html)`
- **WHEN** `npm run content:manifest` executes
- **THEN** the generated content manifest stores the CDN URL in the link

#### Scenario: Preserve unmatched local paths
- **GIVEN** a markdown contains `[查看文件](./attachments/html/unknown.html)`
- **AND** the file is NOT in `attachment-manifest.json`
- **WHEN** manifest is generated
- **THEN** the original local path is preserved in the link

#### Scenario: Handle multiple HTML links in one chat
- **GIVEN** a chat message contains multiple HTML attachment links
- **WHEN** manifest is generated
- **THEN** each link path is independently transformed based on attachment manifest

## ADDED Requirements

### Requirement: Integrate HTML attachment sync into content:manifest
The system SHALL invoke HTML attachment sync as part of the content manifest generation process.

#### Scenario: Run HTML attachment sync before content processing
- **WHEN** `npm run content:manifest` is executed
- **THEN** HTML file detection and upload runs (if R2 configured)
- **AND** then content manifest is generated with transformed HTML links

#### Scenario: HTML sync failure does not block content manifest
- **GIVEN** HTML attachment sync encounters an error (e.g., network failure, file too large)
- **WHEN** `npm run content:manifest` runs
- **THEN** the error is logged as warning
- **AND** content manifest generation continues with original paths

### Requirement: Distinguish HTML attachments from images
The system SHALL handle HTML attachments separately from images in the processing pipeline.

#### Scenario: Separate manifest for HTML and images
- **WHEN** processing content
- **THEN** HTML files are tracked in `attachment-manifest.json`
- **AND** images continue to be tracked in `image-manifest.json`
- **AND** each type uses appropriate upload path prefix in R2
