---
status: completed
title: Configure ESLint, Prettier, and EditorConfig
type: chore
complexity: medium
dependencies:
  - task_01
---

# Task 02: Configure ESLint, Prettier, and EditorConfig

## Overview
Modernize formatting and linting for the Astro/Tailwind project before the content and component migration begins. This creates a consistent contributor baseline for `.astro`, TypeScript, styles, config files, and migrated content-adjacent files.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST configure ESLint for Astro-era source files, including `.astro` and TypeScript where used.
- MUST configure Prettier for Astro, TypeScript, CSS/SCSS, JSON, and config files.
- MUST add `.editorconfig` aligned with the repository formatting rules.
- MUST update lint and format scripts so they target the migrated stack, not Gatsby-only globs.
- SHOULD avoid formatting all Markdown posts unless explicitly required for the migration.
- SHOULD keep lint-staged or pre-commit behavior focused on staged files only.
</requirements>

## Subtasks
- [x] 2.1 Replace Gatsby/React-only ESLint configuration with Astro-compatible linting.
- [x] 2.2 Expand Prettier coverage to Astro, TypeScript, styles, and config files.
- [x] 2.3 Add `.editorconfig` with consistent indentation, final newline, and line-ending rules.
- [x] 2.4 Update package scripts for linting and formatting checks.
- [x] 2.5 Update staged-file formatting behavior if retained.
- [x] 2.6 Verify lint and format checks pass on the baseline project.

## Implementation Details
Use the TechSpec "Testing Approach" and "Development Sequencing" sections to align lint/build validation with later audit work. Do not add unrelated style rules beyond what the Astro/Tailwind migration needs.

### Relevant Files
- `.eslintrc.js` — current Airbnb/React/Gatsby-era lint config.
- `.prettierrc` — current single-quote and trailing-comma settings.
- `.prettierignore` — currently ignores Markdown and needs review for Astro-era files.
- `package.json` — current scripts, Husky v4 config, and lint-staged settings.
- `yarn.lock` — dependency lockfile affected by lint/format package changes.

### Dependent Files
- `astro.config.*` — lint/format coverage must include config files from Task 01.
- `tailwind.config.*` — lint/format coverage must include Tailwind config.
- `src/**/*.astro` — later tasks rely on lint support for Astro components.
- `src/**/*.ts` — later helper modules rely on TypeScript linting/formatting.
- `src/**/*.css` and `src/**/*.scss` — later visual work relies on style formatting.

### Related ADRs
- [ADR-004: Rebuild Styling with Tailwind and a Minimal Theme Script](../adrs/adr-004.md) — Tailwind and global styles need formatting support.
- [ADR-005: Use Static Share Links and Focused Migration Validation](../adrs/adr-005.md) — Lint/build remain part of focused validation.

## Deliverables
- ESLint configuration compatible with the Astro migration.
- Prettier configuration and ignore rules for migrated file types.
- `.editorconfig` at repository root.
- Updated package scripts for lint and format checks.
- Unit tests with 80%+ coverage **(REQUIRED)**
- Integration tests for lint and format commands **(REQUIRED)**

## Tests
- Unit tests:
  - [x] Verify lint globs include `.astro` files.
  - [x] Verify lint globs include TypeScript helper files.
  - [x] Verify Prettier coverage includes config, style, and Astro files.
  - [x] Verify Markdown formatting behavior is intentional and documented by ignore rules.
- Integration tests:
  - [x] Run the lint command successfully.
  - [x] Run the format check command successfully.
  - [x] Verify staged-file formatting, if retained, only targets staged files.
- Test coverage target: >=80%
- All tests must pass

## Success Criteria
- All tests passing
- Test coverage >=80%
- Lint and format checks pass on the Astro baseline.
- `.editorconfig` exists and matches Prettier defaults.
- Tooling no longer assumes Gatsby-only JavaScript/React files.
