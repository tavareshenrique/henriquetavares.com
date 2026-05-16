---
status: completed
title: Build base layouts and visual foundation
type: frontend
complexity: high
dependencies:
  - task_01
  - task_02
  - task_03
---

# Task 05: Build base layouts and visual foundation

## Overview
Create the Astro layout and styling foundation for the migrated blog using Tailwind and global Markdown styles. The goal is close visual continuity with the current site, not exact Typography.js runtime parity.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST create base/blog/post layouts usable by later page routes.
- MUST configure Tailwind tokens for the migrated visual system.
- MUST preserve close continuity for typography, spacing, links, article layout, blockquotes, code blocks, images, and iframes.
- MUST include global styles for Markdown/prose and Prism-compatible code highlighting.
- MUST not recreate Typography.js runtime helpers as a required dependency.
- SHOULD reuse existing fonts/assets where practical.
</requirements>

## Subtasks
- [x] 5.1 Create base document and blog/post layout components.
- [x] 5.2 Define Tailwind theme tokens for colors, spacing, typography, and layout widths.
- [x] 5.3 Add global prose styles for Markdown-rendered content.
- [x] 5.4 Add code highlighting and highlighted-line styles with close continuity.
- [x] 5.5 Add responsive image and iframe presentation styles.
- [x] 5.6 Port author/footer shell elements needed by index and post pages.
- [x] 5.7 Verify representative layouts render without Gatsby runtime styling.

## Implementation Details
Follow TechSpec "System Architecture" and ADR-004. Use Tailwind for components/layout and global CSS where Markdown output would make utility classes brittle.

### Relevant Files
- `src/components/Layout.js` — current shell/header/layout reference.
- `src/templates/blog-index.js` — current listing layout reference.
- `src/templates/blog-post.js` — current article layout reference.
- `src/utils/global.scss` — current CSS variables, code styles, prose styles, and theme styles.
- `src/utils/typography.js` — current typography values reference only.
- `src/fonts/fonts-shared.css` — current font-face/shared font definitions.
- `src/fonts/fonts-post.css` — current post font definitions.
- `src/components/Bio.js` — author block reference.
- `src/components/Footer.js` — footer reference.
- `src/components/Panel.js` — styled panel reference.

### Dependent Files
- `src/pages/index.astro` — consumes layouts in Task 06.
- `src/pages/en/index.astro` — consumes layouts in Task 06.
- `src/pages/[slug].astro` — consumes post layout in Task 06.
- `src/pages/en/[slug].astro` — consumes post layout in Task 06.
- `src/components/SEO.astro` — attaches head metadata in Task 07.
- `src/components/ThemeToggle.astro` — integrates with layout in Task 08.

### Related ADRs
- [ADR-004: Rebuild Styling with Tailwind and a Minimal Theme Script](../adrs/adr-004.md) — Defines Tailwind and visual-continuity styling decision.

## Deliverables
- Base Astro layout and blog/post layout components.
- Tailwind theme and global styles for layout, prose, code, images, and iframes.
- Ported shell elements needed by pages.
- Visual continuity checklist notes for representative pages.
- Unit tests with 80%+ coverage **(REQUIRED)**
- Integration tests for layout rendering **(REQUIRED)**

## Tests
- Unit tests:
  - [x] Verify layout components accept required title, language, and route props.
  - [x] Verify article layout renders required regions for heading, metadata, body, and footer.
  - [x] Verify global style entry points are included by the base layout.
- Integration tests:
  - [x] Build a representative index page using the layout.
  - [x] Build a representative post page with code blocks and images.
  - [x] Verify generated HTML does not depend on Gatsby runtime classes for layout.
- Test coverage target: >=80%
- All tests must pass

## Success Criteria
- All tests passing
- Test coverage >=80%
- Layouts are ready for bilingual pages in Task 06.
- Typography.js runtime is not required for rendering.
- Representative pages maintain close visual continuity without blocking on exact spacing parity.
