## ADDED Requirements

### Requirement: Detect local image references in Markdown
The system SHALL scan all `content/chats/*.md` files and identify local image references using Obsidian syntax.

#### Scenario: Wiki-link format detection
- **WHEN** a markdown file contains `![[Pasted image 20250505.png]]`
- **THEN** the system extracts "Pasted image 20250505.png" as an image reference

#### Scenario: Standard markdown format detection
- **WHEN** a markdown file contains `![](attachments/image.png)`
- **THEN** the system extracts "attachments/image.png" as an image reference

### Requirement: Upload images to Cloudflare R2
The system SHALL upload detected local images to Cloudflare R2 CDN when R2 credentials are configured.

#### Scenario: Successful upload with new image
- **GIVEN** R2 credentials are configured in environment variables
- **WHEN** a new image file is detected (not in existing manifest)
- **THEN** the system uploads the image to R2 with hash-based object key
- **AND** generates a public CDN URL

#### Scenario: Skip already uploaded images
- **GIVEN** an image exists in `image-manifest.json` with matching file hash
- **WHEN** the same image file is processed again
- **THEN** the system skips re-uploading and uses the existing CDN URL

#### Scenario: Graceful handling without R2 credentials
- **GIVEN** R2 credentials are NOT configured
- **WHEN** image processing runs
- **THEN** the system logs a warning message
- **AND** continues without uploading images
- **AND** the build does not fail

### Requirement: Generate image manifest
The system SHALL maintain `src/generated/image-manifest.json` mapping local paths to CDN URLs.

#### Scenario: Create new manifest entry
- **WHEN** an image is successfully uploaded to R2
- **THEN** the manifest records: local path, file hash, CDN URL, file size

#### Scenario: Persist existing entries
- **WHEN** processing images
- **THEN** existing valid entries in the manifest are preserved

### Requirement: Handle file hash for idempotency
The system SHALL compute file content hash to determine if re-upload is needed.

#### Scenario: Compute SHA-256 hash
- **WHEN** processing an image file
- **THEN** the system computes SHA-256 hash of file content
- **AND** uses the hash to check against existing manifest entries
