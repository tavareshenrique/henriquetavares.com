# Task Memory: task_06.md

Keep only task-local execution context here. Do not duplicate facts that are obvious from the repository, task file, PRD documents, or git history.

## Objective Snapshot

Deliver bilingual blog index, post, and 404 Astro pages using Task 04 helpers and Task 05 layouts, with tests proving 20 routes and locale pairing.

## Important Decisions

- Forward `header-actions` through `BlogLayout` and `PostLayout` so pages can mount `LangSwitch` without forking layouts.
- Post HTML may mention “Gatsby” in article prose/links; integration tests avoid treating bare `/gatsby-/i` as a layout regression on post pages (URLs like `gatsby-starter-blog` are expected).

## Learnings

- Astro legacy collection entries expose `id` as the repo-relative markdown path (e.g. `hello-world/index.pt-br.md`), matching `toPostEntry` / `parsePostEntryId`.

## Files / Surfaces

- Added: `src/lib/blog-display.ts`, `src/components/LangSwitch.astro`, `tests/helpers/load-post-entries.ts`, `tests/lib/blog-display.test.ts`, `tests/lib/bilingual-blog-pages.test.ts`.
- Updated: `src/pages/index.astro`, `src/pages/en/index.astro`, `src/pages/[slug].astro`, `src/pages/en/[slug].astro`, `src/pages/404.astro`, `src/layouts/BlogLayout.astro`, `src/layouts/PostLayout.astro`, `tests/integration/blog-routes-content.test.ts`, `tests/integration/content-collections-build.test.ts`.

## Errors / Corrections

- Fixed typo in 404 title copy (`encontrada`).

## Ready for Next Run

- Task 07 can inject SEO/social metadata via existing `head` slots on index and post layouts.
