# Task Memory: task_03.md

Keep only task-local execution context here. Do not duplicate facts that are obvious from the repository, task file, PRD documents, or git history.

## Objective Snapshot

Migrate 9 bilingual post directories from `src/pages/<slug>/` to `src/content/posts/<slug>/` with Astro content collection schema (`title`, `date`, `spoiler`, optional `tags`, optional `updateDate`). Preserve co-located assets. Add unit and integration tests; coverage remains ≥80% on measured files.

## Important Decisions

- Frontmatter validation lives in `src/content/post-schema.ts` (plain `zod`) so Vitest can exercise it without `astro:content`; `src/content/config.ts` wires the same schema via `defineCollection`.
- `react-conf-br-2019/index.md` was missing `updateDate` while `index.pt-br.md` had it; added the same date to the English file so translation pairs stay metadata-consistent (minimal frontmatter-only change).

## Learnings

- Vitest coverage thresholds apply only to `include` globs; `src/content/config.ts` is Astro-only wiring and is excluded from coverage so thresholds stay meaningful.
- Internal absolute URLs still use legacy shapes (`/pt-br/...` for PT; bare `/slug` for EN). Task 06/route helpers should normalize these when routes are finalized.

## Files / Surfaces

- `src/content/posts/**` — migrated Markdown + assets (9 slugs, 18 files).
- `src/content/post-schema.ts`, `src/content/config.ts` — collection schema.
- `tests/content/posts-collection.test.ts`, `tests/integration/content-collections-build.test.ts`, `tests/helpers/markdown-frontmatter.ts`.
- `vitest.config.ts` — coverage `include` extended with `post-schema.ts`.
- `package.json` — devDependencies `yaml`, `zod` for tests and explicit schema import.
- `.prettierignore` — comment updated (posts path).

## Markdown links for later route normalization

Absolute `https://henriquetavares.com/...` cross-links:

- `babel-root-import-ts-reactjs-react-native/index.md` and `index.pt-br.md` — links to `/root-import-reactjs`, `/setting-eslint-on-reactjs-and-react-native` (EN) and `/pt-br/...` (PT).
- `my-basic-settings-of-a-react-native-projects/index.md` and `index.pt-br.md` — ESLint tutorial links (EN vs `/pt-br/...`).
- `root-import-reactjs/index.md` and `index.pt-br.md` — ESLint tutorial links.

Plain-text domain mentions in `hello-world` (not links) — no change.

## Errors / Corrections

- Prettier failed on first `posts-collection.test.ts` draft; formatted via `yarn prettier --write`.

## Ready for Next Run

Task 04 can implement `src/lib/posts.ts` and `src/lib/routes.ts` against `getCollection('posts')` and the filename conventions `index.md` (EN) / `index.pt-br.md` (PT).
