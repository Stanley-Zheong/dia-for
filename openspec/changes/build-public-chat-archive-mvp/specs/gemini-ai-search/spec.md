## ADDED Requirements

### Requirement: Provide public AI Search

The system SHALL provide a public search experience that accepts a natural-language query and returns a Gemini-generated answer grounded in published chat records.

#### Scenario: Visitor submits a search query

- **WHEN** a visitor submits a natural-language search query
- **THEN** the system returns an answer based on relevant published content

### Requirement: Restrict search corpus to published notes

The system MUST use only notes eligible for public publication as AI Search context.

#### Scenario: Unpublished note contains relevant text

- **WHEN** an unpublished note matches the visitor query
- **THEN** the system excludes that note from retrieved context and from the generated answer

### Requirement: Show source references

The system SHALL show source references for AI Search answers so visitors can open the underlying public chat records.

#### Scenario: Search answer uses published records

- **WHEN** Gemini returns an answer grounded in selected content
- **THEN** the system displays links or references to the source chat records

### Requirement: Handle Gemini failures gracefully

The system SHALL display a recoverable error state when Gemini search cannot complete.

#### Scenario: Gemini request fails

- **WHEN** the Gemini API returns an error or times out
- **THEN** the system displays a public error message without exposing secrets or stack traces
