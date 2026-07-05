## 1. Project Setup

- [ ] 1.1 Add `@aws-sdk/client-s3` dependency to package.json for R2 API
- [ ] 1.2 Create `content/attachments/.gitkeep` and add `content/attachments/` to `.gitignore`
- [ ] 1.3 Add R2 environment variables to `.env.example` (R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, R2_PUBLIC_URL, R2_ENDPOINT)

## 2. Image Sync Core Module

- [ ] 2.1 Create `src/lib/image-sync.ts` with TypeScript interfaces for ImageManifest
- [ ] 2.2 Implement `scanMarkdownForImages()` function to detect `![[...]]` and `![](...)` patterns
- [ ] 2.3 Implement `computeFileHash()` using SHA-256 for idempotency
- [ ] 2.4 Create `src/lib/r2-client.ts` with R2/S3 client initialization and graceful fallback
- [ ] 2.5 Implement `uploadImageToR2()` function with hash-based object key naming
- [ ] 2.6 Implement `loadImageManifest()` and `saveImageManifest()` for `src/generated/image-manifest.json`
- [ ] 2.7 Implement `syncImages()` orchestrator function that ties detection, hash check, upload, and manifest update

## 3. Content Manifest Integration

- [ ] 3.1 Modify `scripts/generate-content-manifest.mjs` to import and call `syncImages()` before content processing
- [ ] 3.2 Implement `transformImagePaths()` function to replace local paths with CDN URLs using image manifest
- [ ] 3.3 Integrate path transformation into the markdown processing pipeline
- [ ] 3.4 Add error handling to ensure image sync failures don't block content manifest generation

## 4. Markdown Rendering

- [ ] 4.1 Verify `MarkdownContent.tsx` renders external image URLs correctly
- [ ] 4.2 Add responsive image CSS to `globals.css` (max-width: 100%, height: auto)
- [ ] 4.3 Test image rendering with various image sizes and formats

## 5. Testing

- [ ] 5.1 Create `tests/image-sync.test.ts` with unit tests for `scanMarkdownForImages()`
- [ ] 5.2 Add test for `computeFileHash()` with known file/content
- [ ] 5.3 Add integration test for image path transformation in content processing
- [ ] 5.4 Add test for graceful degradation when R2 credentials are missing
- [ ] 5.5 Verify published chats only have transformed image paths in generated manifest

## 6. Documentation

- [ ] 6.1 Update `AGENTS.md` or `docs/` with image workflow documentation
- [ ] 6.2 Document R2 setup steps for new developers
- [ ] 6.3 Add troubleshooting guide for common image issues

## 7. Verification and Release

- [ ] 7.1 Run `npm run lint` and fix any issues
- [ ] 7.2 Run `npm run typecheck` and fix any type errors
- [ ] 7.3 Run `npm run test` and ensure all tests pass
- [ ] 7.4 Run `npm run verify:deploy` and capture output
- [ ] 7.5 Test image upload with a real image in `content/attachments/`
- [ ] 7.6 Verify images display correctly on deployed site
- [ ] 7.7 Archive this change using `openspec-archive-change`
