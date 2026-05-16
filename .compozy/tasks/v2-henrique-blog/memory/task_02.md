# Task Memory: task_02.md

Keep only task-local execution context here. Do not duplicate facts that are obvious from the repository, task file, PRD documents, or git history.

## Objective Snapshot

Configure ESLint (flat config + Astro + TypeScript), Prettier (incl. Astro plugin), EditorConfig, lint-staged/Husky, and tests proving globs + CLI integration. No auto-commit per run.

## Important Decisions

- Replaced `.eslintrc.js` (Airbnb/React) with `eslint.config.mjs`; legacy Gatsby reference JS under `src/components`, `src/templates`, `src/utils`, and `src/html.js` is ignored until removal tasks.
- Dropped `node-sass` from `dependencies` so `yarn install` succeeds on Node 22 (native `node-gyp`/`python` requirement); add `sass` when SCSS compilation is wired for Astro if still needed.
- Prettier ignores `*.md`, `src/pages/` (current post paths), `src/fonts/`, and legacy reference dirs to avoid mass formatting churn.

## Learnings

- `readFile` must come from `node:fs/promises` when using promise/`await` style in Vitest.
- Prettier glob for `src` uses brace expansion (`src/**/*.{astro,...}`), not a separate `**/*.astro` segment.

## Files / Surfaces

- Added: `eslint.config.mjs`, `.editorconfig`, `tooling/workspace-format-targets.mjs`, `vitest.config.ts`, `tests/**`, `astro.config.mjs`, `tailwind.config.mjs`, `src/pages/index.astro`, `src/env.d.ts`, `.husky/pre-commit`, `tsconfig.json`
- Removed: `.eslintrc.js`
- Updated: `package.json`, `.prettierrc`, `.prettierignore`, `.gitignore`, `yarn.lock`

## Errors / Corrections

- Initial `yarn install` failed on `node-sass` build; resolved by removing `node-sass`.
- `format:check` initially flagged bundled `src/fonts/*.css`; added `src/fonts/` to `.prettierignore`.

## Ready for Next Run

- Task 03 can rely on `yarn lint`, `yarn format:check`, `yarn test:coverage`.
- Repository root has no `AGENTS.md` or `CLAUDE.md`; guidance lived only in `.compozy` and this workflow.
