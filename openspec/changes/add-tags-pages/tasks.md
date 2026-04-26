## 1. Types and Data Layer

- [x] 1.1 Add `TagSummary` type to `src/lib/types.ts` mirroring `TopicSummary` structure
- [x] 1.2 Add `getAllTags()` function to `src/lib/content.ts` that aggregates tags from published chats only
- [x] 1.3 Add `getTagBySlug(slug)` function to `src/lib/content.ts` that returns a single tag with its associated published chats

## 2. Tags Routes

- [x] 2.1 Create `src/app/tags/page.tsx` index page listing all tags with counts (mirror topics/page.tsx)
- [x] 2.2 Create `src/app/tags/[slug]/page.tsx` detail page showing chats for a tag (mirror topics/[slug]/page.tsx)
- [x] 2.3 Add `generateStaticParams()` to detail page for static generation

## 3. Navigation Update

- [x] 3.1 Add "标签" entry to AppShell navigation in `src/components/AppShell.tsx` linking to `/tags`

## 4. Documentation

- [x] 4.1 Add Tags section to `docs/acceptance.md` mirroring Topics section requirements

## 5. Testing

- [x] 5.1 Add test for `getAllTags()` verifying it only returns tags from published chats
- [x] 5.2 Add test for `getTagBySlug()` verifying it excludes unpublished chats
- [x] 5.3 Add test verifying tags from unpublished chats do not appear in index

## 6. Verification and Release

- [ ] 6.1 Run `npm run lint` and fix any linting errors
- [ ] 6.2 Run `npm run typecheck` and fix any type errors
- [ ] 6.3 Run `npm run test` and ensure all tests pass
- [ ] 6.4 Run `npm run verify:deploy` and confirm full pipeline passes
- [ ] 6.5 Commit all changes with descriptive message
