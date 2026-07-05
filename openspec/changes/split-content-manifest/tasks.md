## 1. Setup and Preparation

- [ ] 1.1 Create `src/generated/chats/` directory in `.gitignore`
- [ ] 1.2 Verify existing content manifest structure and usage in codebase
- [ ] 1.3 Read and understand current `scripts/generate-content-manifest.mjs` logic
- [ ] 1.4 Read current `src/lib/content.ts` functions and types

## 2. Manifest Generation Script

- [ ] 2.1 Modify `scripts/generate-content-manifest.mjs` to create `src/generated/chats/` directory
- [ ] 2.2 Add logic to write individual chat files: `src/generated/chats/{slug}.json`
- [ ] 2.3 Add logic to write lightweight index: `src/generated/content-index.json`
- [ ] 2.4 Ensure generation order: content files first, then index (atomic operation)
- [ ] 2.5 Keep original `content-manifest.json` generation temporarily (for migration)

## 3. Content Library Updates

- [ ] 3.1 Add `getChatIndex()` function to read `content-index.json`
- [ ] 3.2 Add `getChatBySlug(slug)` function to read `src/generated/chats/{slug}.json`
- [ ] 3.3 Update `getAllChats()` to use `getChatIndex()` + merge with full content if needed
- [ ] 3.4 Add error handling for missing chat files (return null gracefully)
- [ ] 3.5 Export new types if needed for the multi-file structure

## 4. Route Updates - Home Page

- [ ] 4.1 Update `src/app/page.tsx` to use `getChatIndex()` instead of `getAllChats()`
- [ ] 4.2 Verify home page renders correctly with lightweight index only
- [ ] 4.3 Ensure chat cards display properly without full content

## 5. Route Updates - Chat Detail Page

- [ ] 5.1 Update `src/app/chats/[slug]/page.tsx` to use new `getChatBySlug(slug)`
- [ ] 5.2 Verify chat detail page loads full content from individual file
- [ ] 5.3 Ensure 404 handling for non-existent slugs

## 6. Route Updates - Topic Pages

- [ ] 6.1 Update `src/app/topics/page.tsx` to use `getChatIndex()`
- [ ] 6.2 Update `src/app/topics/[slug]/page.tsx` to use `getChatIndex()` + filter by topic
- [ ] 6.3 Verify topic pages render correctly

## 7. Route Updates - Model Pages

- [ ] 7.1 Update `src/app/models/page.tsx` to use `getChatIndex()`
- [ ] 7.2 Update `src/app/models/[slug]/page.tsx` to use `getChatIndex()` + filter by model
- [ ] 7.3 Verify model pages render correctly

## 8. Route Updates - Tags and Search

- [ ] 8.1 Update `src/app/tags/page.tsx` to use `getChatIndex()`
- [ ] 8.2 Update `src/app/tags/[slug]/page.tsx` to use `getChatIndex()` + filter by tag
- [ ] 8.3 Verify `src/app/search/` page works with new structure

## 9. Testing

- [ ] 9.1 Update `tests/content.test.ts` to test multi-file structure
- [ ] 9.2 Add test for `getChatIndex()` function
- [ ] 9.3 Add test for `getChatBySlug()` function
- [ ] 9.4 Verify published filtering still works correctly
- [ ] 9.5 Test that unpublished chats don't generate files
- [ ] 9.6 Test error handling for missing chat files

## 10. Cleanup and Migration

- [ ] 10.1 Remove original `content-manifest.json` generation from script
- [ ] 10.2 Update any remaining code that references old manifest structure
- [ ] 10.3 Verify all imports and type references are correct
- [ ] 10.4 Add migration notes to documentation

## 11. Verification and Release

- [ ] 11.1 Run `npm run lint` and fix any issues
- [ ] 11.2 Run `npm run typecheck` and fix any type errors
- [ ] 11.3 Run `npm run test` and ensure all tests pass
- [ ] 11.4 Run `npm run verify:deploy` and capture output
- [ ] 11.5 Verify home page loads with reduced memory footprint
- [ ] 11.6 Verify chat detail pages load correctly
- [ ] 11.7 Verify topic/model/tag pages work correctly
- [ ] 11.8 Archive this change using `openspec-archive-change`
