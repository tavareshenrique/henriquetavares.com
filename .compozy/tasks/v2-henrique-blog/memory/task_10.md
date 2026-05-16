# Task Memory: task_10.md

Keep only task-local execution context here. Do not duplicate facts that are obvious from the repository, task file, PRD documents, or git history.

## Objective Snapshot

Implemented focused migration audit (content count, slug inventory vs TechSpec list, EN/PT pairing, `buildExpectedBlogRoutes` dist presence, legacy files/deps, forbidden tokens in live `src` + root configs, stricter subset on `dist` HTML) with `yarn audit:migration` and combined `yarn validate`.

## Important Decisions

- Self-scan: `src/lib/migration-audit.ts` excluded from forbidden-token scan (rule literals/hints).
- `gatsby-marker` live-source regex tightened to lowercase `gatsby-…` class-shaped tokens; omitted from dist HTML scan because rendered Markdown legitimately links to paths like `…/gatsby-starter-blog`.
- Co-located post `*.md` under `src/content/posts/**` excluded from forbidden scan (historical prose); README/`references/` remain outside scan roots.

## Learnings

- `tsx` added as devDependency for the audit CLI; `tsconfig.json` includes `tooling/**/*.ts` for ESLint project service.

## Files / Surfaces

- Added: `src/lib/migration-audit.ts`, `src/lib/post-disk-inventory.ts`, `src/lib/expected-blog-slugs.ts`, `tooling/migration-audit.ts`, `tests/lib/migration-audit.test.ts`, `tests/integration/migration-validation.test.ts`
- Updated: `package.json` (scripts + `tsx`), `vitest.config.ts` (coverage include tooling TS), `tsconfig.json`, `tests/helpers/load-post-entries.ts`, `tests/content/posts-collection.test.ts`
- Tracking: `.compozy/tasks/v2-henrique-blog/task_10.md`, `_tasks.md`

## Errors / Corrections

- Initial forbidden rules matched audit source file and prose in `global.css` (“Gatsby-specific”); fixed via exclusion + regex + dist scan scope adjustment.

## Ready for Next Run

Task complete; verify with `yarn validate` and `yarn test:coverage`.
