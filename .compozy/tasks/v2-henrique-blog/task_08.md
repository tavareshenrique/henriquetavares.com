---
status: completed
title: Implement dark and light mode
type: frontend
complexity: medium
dependencies:
  - task_05
  - task_06
---

# Task 08: Implement dark and light mode

## Overview
Add the PRD-required dark/light mode behavior to the migrated Astro site. The theme should follow system preference before first paint, allow a manual override, and remain stable while browsing.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST apply the initial theme before first paint.
- MUST use system preference when no manual preference is saved.
- MUST persist a manual theme choice across navigation and reloads.
- MUST provide a user-facing toggle available from the migrated layout.
- MUST handle unavailable or blocked `localStorage` without breaking rendering.
- MUST include both dark and light tokens for prose, code, links, backgrounds, and borders.
</requirements>

## Subtasks
- [x] 8.1 Add a pre-paint theme script to the base document.
- [x] 8.2 Add persisted manual preference behavior.
- [x] 8.3 Add system preference fallback behavior.
- [x] 8.4 Add a migrated theme toggle UI.
- [x] 8.5 Add light and dark theme tokens to Tailwind/global styles.
- [x] 8.6 Verify theme behavior across index, post, and 404 pages.

## Implementation Details
Follow TechSpec "Monitoring and Observability" and ADR-004. Do not implement theme state with a hydrated React component unless the agreed approach changes.

### Relevant Files
- `src/html.js` — current forced-dark body and theme script reference.
- `src/utils/global.scss` — current dark variables and commented light variables.
- `src/components/Toggle.js` — reusable toggle UI reference.
- `src/components/Toggle.css` — toggle styling reference.
- `src/components/Layout.js` — current shell integration reference.
- `src/templates/blog-index.js` — page-level theme usage reference.
- `src/templates/blog-post.js` — article theme variable usage reference.

### Dependent Files
- `src/layouts/BaseLayout.astro` — pre-paint script placement.
- `src/layouts/BlogLayout.astro` and `src/layouts/PostLayout.astro` — theme-aware layout presentation.
- `src/components/ThemeToggle.astro` — manual toggle UI.
- `src/styles/theme.*` or global stylesheet — light/dark tokens.
- `src/pages/404.astro` — should render with theme support.

### Related ADRs
- [ADR-004: Rebuild Styling with Tailwind and a Minimal Theme Script](../adrs/adr-004.md) — Defines the pre-paint script and Tailwind theme approach.

## Deliverables
- Pre-paint theme initialization in the base layout.
- Dark and light theme tokens.
- Manual theme toggle.
- Tests for theme preference resolution and persistence behavior.
- Unit tests with 80%+ coverage **(REQUIRED)**
- Integration tests for theme rendering across pages **(REQUIRED)**

## Tests
- Unit tests:
  - [x] Verify no saved preference falls back to system light preference.
  - [x] Verify no saved preference falls back to system dark preference.
  - [x] Verify saved `light` preference overrides system dark preference.
  - [x] Verify saved `dark` preference overrides system light preference.
  - [x] Verify blocked `localStorage` does not throw during theme initialization.
- Integration tests:
  - [x] Build and inspect index page theme markup.
  - [x] Build and inspect post page theme markup.
  - [x] Verify manual toggle changes the root theme attribute/class.
  - [x] Verify selected theme persists after page navigation or reload.
- Test coverage target: >=80%
- All tests must pass

## Success Criteria
- All tests passing
- Test coverage >=80%
- Theme initializes before first paint.
- Users can switch dark/light mode at any time.
- Theme behavior does not depend on Gatsby `src/html.js`.

## Verification (2026-05-16)

- `yarn build` — pass
- `yarn test:coverage` — pass (coverage thresholds satisfied globally)
- `yarn lint` — pass
- `yarn format:check` — pass
