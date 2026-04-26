## 1. Types and Schema

- [x] 1.1 Add `insights?: string` field to `ChatRecordMeta` in `src/lib/types.ts`
- [x] 1.2 Add `insights` field to frontmatter schema in `src/lib/content.ts` (optional string, preserves line breaks)

## 2. Chat Detail Page

- [x] 2.1 Remove `getChatInsights()` import and call from `src/app/chats/[slug]/page.tsx`
- [x] 2.2 Update right panel to render `chat.meta.insights` using `MarkdownContent` component
- [x] 2.3 Add placeholder display when `insights` is undefined

## 3. Sample Content

- [x] 3.1 Add example `insights` field to one chat file (e.g., `ai-coding-tools-chatgpt.md`)

## 4. Documentation

- [x] 4.1 Update `docs/acceptance.md` to reflect human insights behavior
- [x] 4.2 Update `content/AGENTS.md` to document `insights` frontmatter field

## 5. Verification and Release

- [x] 5.1 Run `npm run lint` and fix any linting errors
- [x] 5.2 Run `npm run typecheck` and fix any type errors
- [x] 5.3 Run `npm run test` and ensure all tests pass
- [x] 5.4 Run `npm run verify:deploy` and confirm full pipeline passes
- [x] 5.5 Commit all changes with descriptive message
