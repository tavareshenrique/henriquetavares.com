# v2-henrique-blog — Migrate from Gatsby to Astro

## Overview

Replace the current Gatsby 2.x blog with an Astro-based site that delivers identical functionality, preserves all existing content and URLs, and eliminates the tech debt of a 5-year-old, unmaintained stack. The migration targets strict 1:1 feature parity: 9 posts in two languages, bilingual routing, syntax highlighting, image handling, social sharing, and dark mode — all working exactly as before. AdSense, newsletter confirmation pages, and RSS feed are intentionally removed during migration. No new features ship in V1. The goal is a clean, maintainable foundation that Henrique can write on without friction.

## Problem

The site runs on Gatsby 2.x (released 2020), forked from Dan Abramov's overreacted.io. After Netlify acquired Gatsby in 2023 and laid off the core team, the framework entered maintenance mode. Most Gatsby plugins are unmaintained, build times are 60–120 seconds on cold cache, and the stack ships approximately 300 KB of JavaScript to render static markdown — a blog that does not need a runtime at all. Security vulnerabilities accumulate silently in the dependency graph.

Beyond the framework's trajectory, the codebase carries unresolved fork artifacts from its overreacted.io origin: the RSS feed serialization text says "article posted to my blog at overreacted.io," the web manifest still carries the Overreacted branding, `now.json` aliases the domain to `overreacted.io`, and every blog post's "Discuss on Twitter" link points to `overreacted.io`. These are live bugs visible to readers.

The author's writing friction is the most consequential consequence of this tech debt. A slow, unfamiliar build pipeline — with GraphQL, `gatsby-node.js` `createPages` loops copied from another developer's architecture, and stale plugin APIs — creates enough cognitive overhead to reduce publishing frequency. The stack is the obstacle between Henrique and his next post.

### Market Data

- 60% of Astro sites achieve "Good" Core Web Vitals vs. 38% for Gatsby sites (2026)
- Astro builds 100 pages in ~8s vs. Gatsby's ~25–90s at the same scale
- Astro ships 0 KB of JavaScript by default; Gatsby 2 ships ~300 KB for equivalent static pages
- Astro was acquired by Cloudflare in January 2026, ensuring long-term platform backing
- The official Astro migration guide for Gatsby covers the exact plugin and data-fetching overlap

## Core Features

| #  | Feature              | Priority | Description                                                                                                                                                          |
|----|----------------------|----------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| F1 | Content migration    | Critical | All 18 markdown files (`src/pages/<slug>/index.md` + `index.pt-br.md`) move to Astro content collections with a Zod-validated schema for `title`, `date`, `spoiler`, `tags`, `updateDate`. Posts render identically to today. |
| F2 | Bilingual routing    | Critical | EN and PT-BR routes preserved: `/en/` (index) + `/en/<slug>/` for English; `/` (index) + `/<slug>/` for Portuguese. No redirects required for existing URLs.        |
| F3 | Syntax highlighting  | Critical | Prism via `rehype-prism-plus` or `astro-prism`; Night Owl color scheme and `.gatsby-highlight` layout CSS ported from `global.scss`.                                 |
| F4 | Image handling       | Critical | Co-located images (`./image.gif`, `./paper.gif`) processed by Astro's `<Image>` component with explicit dimensions to prevent CLS.                                   |
| F5 | Fork artifact cleanup| High     | Web manifest name/description, `now.json` alias, and `discussUrl` in blog post template corrected to `henriquetavares.com`.                                          |
| F6 | Dark mode            | High     | Dark-only theme preserved; CSS custom properties (`--bg`, `--textLink`, etc.) on `body.dark` ported from `global.scss`; `Toggle` component as a React island with `client:visible`. |
| F7 | Social sharing       | High     | `Share` component (react-share) ported as a React island with `client:visible` hydration.                                                                            |

## KPIs

| KPI                         | Target                         | How to Measure                                                              |
|-----------------------------|--------------------------------|-----------------------------------------------------------------------------|
| Migration completeness      | 100% of features on checklist  | Manual feature checklist executed before each release candidate             |
| Lighthouse Performance score| ≥ 95                           | Lighthouse CI run on every Netlify/Vercel deploy preview                    |
| Build time                  | < 20s                          | CI build logs for both cold and warm builds                                 |
| Broken URLs                 | 0 regressions                  | Automated URL audit comparing current site routes to new site before launch |
| Dependency staleness        | 0 critical CVEs at launch      | `npm audit --audit-level=critical` passes on launch day                     |
| Time to publish a new post  | < 5 min from file creation     | Author self-report on first post published on new stack                     |

## Feature Assessment

| Criteria            | Question                                            | Score    |
|---------------------|-----------------------------------------------------|----------|
| **Impact**          | How much more valuable does this make the product?  | Must do  |
| **Reach**           | What % of users would this affect?                  | Must do  |
| **Frequency**       | How often would users encounter this value?         | Strong   |
| **Differentiation** | Does this set us apart or just match competitors?   | Pass     |
| **Defensibility**   | Is this easy to copy or does it compound over time? | Maybe    |
| **Feasibility**     | Can we actually build this?                         | Must do  |

Leverage type: **Quick Win** — bounded scope, high feasibility, immediately measurable ROI in author DX and reader performance.

## Council Insights

- **Recommended approach:** Migrate to Astro using the official Gatsby → Astro guide. The remark/rehype plugin ecosystem overlaps significantly (prismjs, autolink-headers, smartypants, external-links all port directly), reducing the migration delta to routing, layout components, and content collection schema.
- **Key trade-offs:** Astro's `.astro` component syntax vs. React familiarity (mitigated by `@astrojs/react` — React components run as hydrated islands); zero-JS default vs. existing interactive components (Share, Toggle); hand-rolled i18n vs. `gatsby-plugin-i18n` (unavoidable, but simpler than the original `gatsby-node.js` loop).
- **Risks identified:**
  - **i18n routing**: Most complex piece; must be implemented and validated before migrating post content
  - **Relative image assets**: Co-located `./image.gif` files must survive the asset pipeline change; verify all 9 posts before launch
  - **Migration stall**: If `.astro` syntax proves unfamiliar, Next.js App Router is the defined fallback
- **Stretch goal (V2+):** Expand into a full personal site with projects, talks, and bio sections. V2 can also add RSS, newsletter integration, search, and post series navigation.

## Out of Scope (V1)

- **RSS feed** — not actively used; removed intentionally during migration; can be added in V2 if a newsletter or subscriber base is built
- **AdSense** — not generating meaningful revenue and adds script complexity; removed intentionally during migration
- **Newsletter confirmation pages (`/thanks`, `/confirm`)** — no active newsletter service is connected; pages served no function and are removed
- **New posts during migration** — content investment belongs after the stable platform ships
- **Design refresh** — visual changes would invalidate the "1:1 parity" success criterion; belongs in V2
- **Search** — not present today; requires indexing infrastructure; V2 feature
- **Comments system** — not present today; exceeds 1:1 scope
- **Post series / related posts** — not present today; V2 content feature
- **Additional languages beyond EN/PT-BR** — new locales require new content, not just code

## Architecture Decision Records

- [ADR-001: Migrate from Gatsby to Astro](adrs/adr-001.md) — Chose Astro over Next.js and Eleventy as the migration target based on zero-JS default, content collections, remark plugin ecosystem overlap, and official Gatsby migration guide.

## Open Questions

- **Dark-mode-only**: The current `Layout.js` forces the dark theme in `componentDidMount`, locking the site to dark mode regardless of system preference. Is this the intended behavior for V2, or should the toggle respect `prefers-color-scheme`?
- **Social sharing links**: The `discussUrl` in `blog-post.js` currently points to `overreacted.io`. Should the corrected link point to Twitter/X search for the post URL, or be removed entirely?
