# Task Memory: task_08.md

Keep only task-local execution context here. Do not duplicate facts that are obvious from the repository, task file, PRD documents, or git history.

## Objective Snapshot

Implemented ADR-004 theme: pre-paint bootstrap, system default, `localStorage` override with safe access, header theme control, light/dark CSS tokens (incl. code blocks).

## Important Decisions

- Reuse `html.light` class (existing global.css pattern) for light mode; default `:root` remains dark.
- Inline script in `BaseLayout.astro` must stay logic-aligned with `src/lib/theme.ts` (key + resolution).
- ESLint integration test timeout raised to 15s — cold `yarn lint` can exceed 5s locally.

## Learnings

- Vitest `environment: node` file cannot use DOM for bootstrap tests; `happy-dom` works for `Window` + `bootstrapThemeFromWindow` and for bundled toggle smoke tests with `// @vitest-environment happy-dom`.

## Files / Surfaces

- Added: `src/lib/theme.ts`, `src/scripts/theme-toggle.ts`, `src/components/ThemeToggle.astro`
- Updated: `src/layouts/BaseLayout.astro`, `BlogLayout.astro`, `PostLayout.astro`, `src/styles/global.css`, `vitest.config.ts`, `package.json` / `yarn.lock` (happy-dom), `tests/integration/content-collections-build.test.ts`, `tests/integration/tooling-cli.test.ts`, `tests/lib/theme.test.ts`, `tests/integration/theme-toggle-behavior.test.ts`

## Errors / Corrections

- Fixed accidental removal of `Bio` import in `PostLayout.astro` and `BaseLayout` import in `BlogLayout.astro` during slot refactor.
- Repaired corrupted `pre[data-line]` / Prism CSS block in `global.css` after bulk edit.

## Ready for Next Run

None — task closed. Follow-up: consider raising branch coverage on `theme-toggle.ts` if per-file thresholds are introduced.
