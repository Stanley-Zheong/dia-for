## ADDED Requirements

### Requirement: Detect HTML file links in Markdown
The system SHALL scan all `content/chats/*.md` files and identify local HTML file links.

#### Scenario: Standard link format detection
- **WHEN** a markdown file contains `[描述](./attachments/html/file.html)`
- **THEN** the system extracts "./attachments/html/file.html" as an HTML attachment reference

#### Scenario: Alternative path format detection
- **WHEN** a markdown file contains `[描述](attachments/html/file.html)` (without leading ./)
- **THEN** the system extracts "attachments/html/file.html" as an HTML attachment reference

#### Scenario: Ignore non-HTML links
- **WHEN** a markdown file contains `[描述](./attachments/html/file.txt)` or `[描述](https://example.com/file.html)`
- **THEN** the system does NOT treat these as HTML attachment references

### Requirement: Upload HTML files to Cloudflare R2
The system SHALL upload detected HTML files to Cloudflare R2 CDN when R2 credentials are configured.

#### Scenario: Successful upload of new HTML file
- **GIVEN** R2 credentials are configured
- **AND** an HTML file exists at `content/attachments/html/file.html`
- **WHEN** the file is referenced in a markdown and processed
- **THEN** the system uploads the HTML file to R2 with path `attachments/html/file.html`
- **AND** generates a public CDN URL

#### Scenario: Skip upload for existing unchanged file
- **GIVEN** an HTML file exists in the attachment manifest with matching file hash
- **WHEN** the same HTML file is processed again
- **THEN** the system skips re-uploading and uses the existing CDN URL

#### Scenario: Handle file size limit
- **GIVEN** an HTML file larger than 10MB
- **WHEN** the file is processed
- **THEN** the system logs a warning
- **AND** skips uploading the file
- **AND** preserves the original local path in the markdown

#### Scenario: Graceful handling without R2 credentials
- **GIVEN** R2 credentials are NOT configured
- **WHEN** HTML attachment processing runs
- **THEN** the system logs a warning
- **AND** continues without uploading
- **AND** the build does not fail

### Requirement: Generate attachment manifest
The system SHALL maintain `src/generated/attachment-manifest.json` mapping local HTML paths to CDN URLs.

#### Scenario: Create new manifest entry for HTML
- **WHEN** an HTML file is successfully uploaded to R2
- **THEN** the manifest records: local path, file hash, CDN URL, file size, content type

#### Scenario: Persist existing entries
- **WHEN** processing HTML attachments
- **THEN** existing valid entries in the manifest are preserved

### Requirement: Compute file hash for idempotency
The system SHALL compute file content hash to determine if re-upload is needed.

#### Scenario: Compute SHA-256 hash for HTML
- **WHEN** processing an HTML file
- **THEN** the system computes SHA-256 hash of file content
- **AND** uses the hash to check against existing manifest entries
