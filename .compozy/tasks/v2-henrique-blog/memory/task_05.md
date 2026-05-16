# Task Memory: task_05.md

Keep only task-local execution context here. Do not duplicate facts that are obvious from the repository, task file, PRD documents, or git history.

## Objective Snapshot

Deliver Astro shell layouts (base + blog index + post article), Tailwind tokens, global prose/Prism/image/iframe CSS, ported Bio/Footer/Panel, tests, and a noindex `/layout-verify/` fixture for layout HTML assertions.

## Important Decisions

- **Single production `yarn build` in Vitest**: Merged layout HTML assertions into `tests/integration/content-collections-build.test.ts` `beforeAll` to avoid concurrent Astro writes to `.astro/content-assets.mjs` (flake `UnknownFilesystemError`).
- **Fixture route**: `/layout-verify/` carries `noindex, nofollow` via the `head` slot; candidate for removal or guard after launch polish.
- **Prism**: `astro.config.mjs` sets `markdown.syntaxHighlight: 'prism'`; codeframe class is `blog-code-frame` (not `gatsby-highlight`).

## Learnings

- PostCSS requires `@import` of fonts **before** `@tailwind` directives in `src/styles/global.css`.

## Files / Surfaces

- Layouts: `src/layouts/BaseLayout.astro`, `BlogLayout.astro`, `PostLayout.astro`
- Styles: `src/styles/global.css`, `tailwind.config.mjs`, `postcss.config.mjs`, `astro.config.mjs`
- Shell components: `src/components/Bio.astro`, `Footer.astro`, `Panel.astro`
- Contracts/tests: `src/lib/layout-contract.ts`, `tests/lib/layout-contract.test.ts`, extended `tests/integration/content-collections-build.test.ts`
- Pages: `src/pages/index.astro`, `src/pages/layout-verify/index.astro`
- Notes: `.compozy/tasks/v2-henrique-blog/visual-continuity-task-05.md`

## Errors / Corrections

- Parallel integration suites running `yarn build` raced on `.astro/` rename — fixed by consolidating builds.

## Ready for Next Run

Task 06 can wrap bilingual routes around `BlogLayout` / `PostLayout`, replace baseline index copy, and drop or harden `/layout-verify/` if undesirable in prod.
