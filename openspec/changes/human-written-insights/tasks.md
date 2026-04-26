## 1. Types and Schema

- [ ] 1.1 Add `insights?: string` field to `ChatRecordMeta` in `src/lib/types.ts`
- [ ] 1.2 Add `insights` field to frontmatter schema in `src/lib/content.ts` (optional string, preserves line breaks)

## 2. Chat Detail Page

- [ ] 2.1 Remove `getChatInsights()` import and call from `src/app/chats/[slug]/page.tsx`
- [ ] 2.2 Update right panel to render `chat.meta.insights` using `MarkdownContent` component
- [ ] 2.3 Add placeholder display when `insights` is undefined

## 3. Sample Content

- [ ] 3.1 Add example `insights` field to one chat file (e.g., `ai-coding-tools-chatgpt.md`)

## 4. Documentation

- [ ] 4.1 Update `docs/acceptance.md` to reflect human insights behavior
- [ ] 4.2 Update `content/AGENTS.md` to document `insights` frontmatter field

## 5. Verification and Release

- [ ] 5.1 Run `npm run lint` and fix any linting errors
- [ ] 5.2 Run `npm run typecheck` and fix any type errors
- [ ] 5.3 Run `npm run test` and ensure all tests pass
- [ ] 5.4 Run `npm run verify:deploy` and confirm full pipeline passes
- [ ] 5.5 Commit all changes with descriptive message
