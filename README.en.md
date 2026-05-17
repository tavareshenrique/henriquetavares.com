# Henrique Tavares

<p>
  <a href="README.md"><kbd>Português</kbd></a>
  ·
  <a href="README.en.md"><kbd>English</kbd></a>
</p>

![Henrique Tavares](static/HTLogo.jpg)

[henriquetavares.com](https://henriquetavares.com/) is Henrique Tavares' personal blog: a place to publish lessons learned, technical experiences, and notes about software development. It keeps the spirit of a "public Notion", now backed by a simpler, faster, and easier-to-maintain technical foundation.

The project was clearly inspired by, and originally copied in large part from, [overreacted.io](https://overreacted.io/), the blog by [Dan Abramov](https://overreacted.io/). That reference is part of the site's history and of the original aesthetic this migration aims to preserve.

The site publishes articles in Portuguese and English, with Portuguese as the primary experience. The current version is a maintenance migration: the old Gatsby stack was replaced by a static Astro architecture while preserving public routes, published content, and the blog's visual identity.

### Stack

- [Astro](https://astro.build/) 5 for static site generation.
- [Tailwind CSS](https://tailwindcss.com/) for layout, components, and visual tokens.
- Markdown through Astro Content Collections for posts.
- Zod for post frontmatter validation.
- Prism for syntax highlighting.
- Vitest for unit and integration tests.
- ESLint, Prettier, Husky, and lint-staged for code quality.

### Blog Structure

Content lives in `src/content/posts/`. Each post has its own directory and keeps images/assets next to the Markdown files:

```text
src/content/posts/
  my-post/
    index.md
    index.pt-br.md
    image.png
```

By convention:

- `index.pt-br.md` is the Portuguese version.
- `index.md` is the English version.
- The directory name defines the public post `slug`.
- Portuguese is the default route: `/` and `/<slug>/`.
- English lives under `/en/` and `/en/<slug>/`.

The layer in `src/lib/posts.ts` normalizes posts and groups translations. The layer in `src/lib/routes.ts` centralizes public route rules, alternates, and canonical paths.

### Local Development

Use `pnpm` to install dependencies and run the project scripts:

```bash
pnpm install
pnpm dev
```

Then open `http://localhost:4321/`.

Useful commands:

```bash
pnpm build          # generates the static site in dist/
pnpm preview        # serves the build locally
pnpm lint           # runs ESLint
pnpm lint:fix       # fixes lint issues when possible
pnpm format         # formats workspace files
pnpm format:check   # checks formatting
pnpm test           # runs the Vitest suite
pnpm test:coverage  # runs tests with coverage
pnpm audit:migration # validates migration invariants
pnpm validate       # lint + build + migration audit
```

### Publishing or Maintaining Posts

To add a post, create a new directory under `src/content/posts/<slug>/` and add the expected language versions:

- `index.pt-br.md` for Portuguese.
- `index.md` for English.

Frontmatter is validated by `src/content/post-schema.ts` and should include:

```yaml
title: Post title
date: 2026-05-16
spoiler: Short summary shown in blog lists.
tags:
  - astro
  - javascript
updateDate: 2026-05-17
```

`updateDate` and `tags` are optional. Before publishing, run `pnpm validate` to check lint, formatting, tests, build, and the route/content migration audit.

### Migration Context

This version of the blog comes from the `v2-henrique-blog` work, a migration focused on maintenance and parity. The goal was not to redesign the site, create a new product, or expand reader-facing features; it was to remove the maintenance risk of the old Gatsby stack without breaking the existing experience.

Main documents:

- [PRD](.compozy/tasks/v2-henrique-blog/_prd.md): defines the migration as a maintenance reset, preserving posts, URLs, bilingual experience, and visual identity.
- [TechSpec](.compozy/tasks/v2-henrique-blog/_techspec.md): describes the Astro architecture, content collections, bilingual routes, theme, sharing, and validation.

Recorded decisions:

- [ADR-001: Migrate from Gatsby to Astro](.compozy/tasks/v2-henrique-blog/adrs/adr-001.md): chooses Astro as the static foundation for the Markdown blog.
- [ADR-002: Use Strict Parity Maintenance Reset for V1](.compozy/tasks/v2-henrique-blog/adrs/adr-002.md): preserves routes, content, and appearance while removing unused legacy surfaces.
- [ADR-003: Use Astro Content Collections with Co-Located Post Assets](.compozy/tasks/v2-henrique-blog/adrs/adr-003.md): keeps one directory per post, with language files and assets nearby.
- [ADR-004: Rebuild Styling with Tailwind and a Minimal Theme Script](.compozy/tasks/v2-henrique-blog/adrs/adr-004.md): uses Tailwind and a minimal script for dark/light mode without React hydration.
- [ADR-005: Use Static Share Links and Focused Migration Validation](.compozy/tasks/v2-henrique-blog/adrs/adr-005.md): replaces `react-share` with static links and validates routes/content through a focused audit.

### Validation

Automated validation covers:

- code linting;
- Astro build;
- unit and integration tests;
- migration audit for post count, translation pairs, expected routes, and removed legacy references.

For the main maintenance check, use:

```bash
pnpm validate
```
