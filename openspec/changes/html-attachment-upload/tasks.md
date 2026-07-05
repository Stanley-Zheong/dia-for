## 1. Project Setup

- [ ] 1.1 Create `content/attachments/html/.gitkeep` and add `content/attachments/html/` to `.gitignore`
- [ ] 1.2 Update `.env.example` with HTML attachment configuration comments (reuses image R2 settings)
- [ ] 1.3 Verify `@aws-sdk/client-s3` dependency exists (from image upload feature)

## 2. HTML Attachment Sync Core Module

- [ ] 2.1 Create `src/lib/attachment-sync.ts` with TypeScript interfaces for AttachmentManifest
- [ ] 2.2 Implement `scanMarkdownForHtmlLinks()` function to detect HTML file references
- [ ] 2.3 Implement `computeFileHash()` for HTML files (reuse or share with image sync)
- [ ] 2.4 Implement `uploadHtmlToR2()` function with `attachments/html/` path prefix
- [ ] 2.5 Implement `loadAttachmentManifest()` and `saveAttachmentManifest()` for `src/generated/attachment-manifest.json`
- [ ] 2.6 Implement `syncHtmlAttachments()` orchestrator with 10MB size limit check
- [ ] 2.7 Add file size validation: log warning and skip files > 10MB

## 3. Content Manifest Integration

- [ ] 3.1 Modify `scripts/generate-content-manifest.mjs` to import and call `syncHtmlAttachments()`
- [ ] 3.2 Implement `transformHtmlLinks()` function to replace local paths with CDN URLs
- [ ] 3.3 Integrate HTML link transformation into markdown processing pipeline
- [ ] 3.4 Ensure HTML sync errors don't block content manifest generation
- [ ] 3.5 Run HTML sync after image sync, before content processing

## 4. Markdown Rendering

- [ ] 4.1 Verify existing link rendering in `MarkdownContent.tsx` handles CDN URLs correctly
- [ ] 4.2 Test that HTML attachment links open in new tab with correct `target="_blank"` behavior
- [ ] 4.3 Add CSS for attachment links (optional icon indicator for external HTML)

## 5. Testing

- [ ] 5.1 Create `tests/html-attachment-sync.test.ts` with unit tests for `scanMarkdownForHtmlLinks()`
- [ ] 5.2 Add test for file size limit enforcement
- [ ] 5.3 Add test for HTML file hash computation
- [ ] 5.4 Add integration test for HTML link transformation in content processing
- [ ] 5.5 Add test for graceful degradation when R2 credentials are missing
- [ ] 5.6 Add test to verify published chats only have transformed HTML links in manifest
- [ ] 5.7 Create test HTML file fixture in `tests/fixtures/sample.html`

## 6. Documentation

- [ ] 6.1 Update `AGENTS.md` or `docs/` with HTML attachment workflow documentation
- [ ] 6.2 Document recommended HTML structure (self-contained vs external dependencies)
- [ ] 6.3 Add troubleshooting guide for HTML attachment issues
- [ ] 6.4 Document 10MB file size limit

## 7. Verification and Release

- [ ] 7.1 Run `npm run lint` and fix any issues
- [ ] 7.2 Run `npm run typecheck` and fix any type errors
- [ ] 7.3 Run `npm run test` and ensure all tests pass
- [ ] 7.4 Run `npm run verify:deploy` and capture output
- [ ] 7.5 Test HTML upload with a real HTML file in `content/attachments/html/`
- [ ] 7.6 Verify HTML file displays correctly when accessed via CDN URL in browser
- [ ] 7.7 Verify HTML links in chat messages point to CDN URLs
- [ ] 7.8 Archive this change using `openspec-archive-change`
