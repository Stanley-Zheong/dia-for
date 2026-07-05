## ADDED Requirements

### Requirement: Render external CDN images in Markdown
The system SHALL render images referenced by CDN URLs in chat message content.

#### Scenario: Render image with CDN URL
- **GIVEN** a markdown image link with HTTPS URL `![](https://cdn.example.com/image.png)`
- **WHEN** the message is rendered
- **THEN** the image displays correctly in the chat bubble

#### Scenario: Image with alt text
- **GIVEN** a markdown image with alt text `![description](https://cdn.example.com/image.png)`
- **WHEN** the message is rendered
- **THEN** the image displays with proper alt attribute

### Requirement: Handle broken image gracefully
The system SHALL handle cases where images fail to load without breaking the page.

#### Scenario: Image load failure
- **GIVEN** an image URL that returns 404 or fails to load
- **WHEN** the message is rendered
- **THEN** a placeholder or broken image indicator is shown
- **AND** the rest of the content continues to render normally

#### Scenario: Empty image URL
- **GIVEN** an image with empty or invalid URL `![]( )`
- **WHEN** the message is rendered
- **THEN** the invalid image tag is handled gracefully
- **AND** does not cause runtime errors

### Requirement: Responsive image sizing
The system SHALL ensure images fit within chat message containers.

#### Scenario: Large image constrained
- **GIVEN** an image wider than the chat bubble
- **WHEN** the message is rendered
- **THEN** the image is scaled down to fit the container width
- **AND** maintains aspect ratio

#### Scenario: Small image displayed at natural size
- **GIVEN** a small image narrower than the chat bubble
- **WHEN** the message is rendered
- **THEN** the image displays at its natural size (not stretched)
