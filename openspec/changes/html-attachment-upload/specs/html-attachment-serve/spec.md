## ADDED Requirements

### Requirement: Serve HTML files via CDN
The system SHALL make uploaded HTML files accessible via their CDN URLs.

#### Scenario: Direct R2 CDN access
- **GIVEN** an HTML file was uploaded to R2 at `attachments/html/file.html`
- **AND** the R2 bucket is configured for public read access
- **WHEN** a user accesses `https://cdn.example.com/attachments/html/file.html`
- **THEN** the HTML file is served with correct content-type (`text/html`)
- **AND** the file content is delivered unchanged

### Requirement: HTML file content integrity
The system SHALL preserve HTML file content exactly as uploaded.

#### Scenario: Verify content unchanged
- **GIVEN** an HTML file with specific content (scripts, styles, markup)
- **WHEN** the file is uploaded and then accessed via CDN
- **THEN** the downloaded content matches the original byte-for-byte
- **AND** no transformations or sanitization is applied

#### Scenario: Handle HTML with special characters
- **GIVEN** an HTML file containing Unicode characters, emoji, or special symbols
- **WHEN** the file is served via CDN
- **THEN** all characters are preserved correctly with UTF-8 encoding

### Requirement: HTML file independent display
The system SHALL ensure HTML files can be opened and displayed independently in browsers.

#### Scenario: Browser renders HTML correctly
- **GIVEN** a valid HTML file with `<!DOCTYPE html>`, `<html>`, `<body>` structure
- **WHEN** a user opens the CDN URL in a browser
- **THEN** the browser renders the page correctly
- **AND** JavaScript executes (if present)
- **AND** CSS styles are applied (if inline or from CDN)
