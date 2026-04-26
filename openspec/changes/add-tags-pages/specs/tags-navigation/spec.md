## ADDED Requirements

### Requirement: Tags index page lists all tags from published chats

The system SHALL provide a `/tags` page that lists all unique tags extracted from published chats only. Each tag SHALL display the tag name and the count of associated published chats. Unpublished chats MUST NOT contribute tags to this index.

#### Scenario: Tags index shows only published tags

- **WHEN** the `/tags` page is loaded
- **THEN** the page displays all unique tags from chats with `published: true` in frontmatter
- **AND** each tag shows the correct count of associated published chats
- **AND** tags from chats with `published: false` or missing `published` field are excluded

#### Scenario: Empty state when no tags exist

- **WHEN** no published chats have tags
- **THEN** the page displays an empty state or informative message

### Requirement: Tag detail page shows chats with that tag

The system SHALL provide a `/tags/[slug]` page for each tag that lists all published chats containing that tag. The tag name SHALL be displayed as the page title. Unpublished chats MUST NOT appear in the list.

#### Scenario: Tag detail page shows correct chats

- **WHEN** a user visits `/tags/[slug]` for a valid tag
- **THEN** the page displays the tag name as title
- **AND** lists all published chats that have this tag in their frontmatter
- **AND** excludes unpublished chats even if they have the same tag

#### Scenario: Tag detail page returns 404 for non-existent tag

- **WHEN** a user visits `/tags/[slug]` for a tag that does not exist in any published chat
- **THEN** the system returns a 404 page

### Requirement: Tag slugs are URL-safe

The system SHALL generate URL-safe slugs for tags using the same slugify logic as topics and models. Tags with special characters or spaces MUST be normalized to valid URL path segments.

#### Scenario: Tag with special characters is slugified

- **WHEN** a chat has a tag "AI 工具"
- **THEN** the tag slug is generated as "ai-gong-ju" or similar URL-safe format
- **AND** the tag is accessible at `/tags/ai-gong-ju`

### Requirement: Navigation includes Tags entry

The system SHALL include a "标签" (Tags) navigation entry in the AppShell component. The entry SHALL link to `/tags`.

#### Scenario: Tags link appears in navigation

- **WHEN** any page is rendered with AppShell
- **THEN** the left navigation includes a "标签" link
- **AND** clicking it navigates to `/tags`

### Requirement: Tags data respects published filter

The `getAllTags()` and `getTagBySlug()` helper functions SHALL only consider published chats when aggregating tags. This ensures consistency with the published-only data model.

#### Scenario: Helper functions filter unpublished chats

- **WHEN** `getAllTags()` is called
- **THEN** it returns tags only from chats where `meta.published === true`
- **AND** unpublished chats do not contribute to tag counts or associations
