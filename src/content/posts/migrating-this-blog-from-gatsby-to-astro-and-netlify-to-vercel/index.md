---
title: Migrating this blog from Gatsby to Astro and from Netlify to Vercel
date: '2026-05-17'
spoiler: How a maintenance migration replaced an inherited Gatsby stack with Astro, simplified deployment on Vercel, and preserved URLs, content, and the blog's visual identity.
tags: ["Astro", "Gatsby", "Vercel", "Netlify", "Performance"]
---

## Hey 🚀

After being away from this blog for about five years, I finally decided to come back and try to publish some of the things I have been studying lately and, obviously, like most of the industry right now, a lot of that ends up touching AI in one way or another.

One good way to mark that comeback was to document the migration of this blog from Gatsby to Astro. I have had this blog for roughly seven years, and it originally came from a fork inspired by Dan Abramov's blog. "Inspired" is generous. It was basically copied. Back then, Gatsby was a very strong choice for that kind of setup.

Not anymore. It still works, but the framework no longer feels close to the center of innovation. So this post became the first proper write-up of the most important migration this blog has gone through since it was created. The core change was architectural, not editorial: moving away from a Gatsby 2 codebase and into a static Astro setup.

One detail shaped the tone of that decision more than I expected: this was my first real experience with Astro. I did not choose it because I already knew the stack or because I wanted novelty for its own sake. If anything, the opposite was true. I had to justify picking something new to me, and Astro only survived that comparison because it fit the problem better than the more familiar options.

Along the way, deployment also moved into Vercel, while DNS still passed through Netlify during the operational transition.

This is not meant to be a step-by-step tutorial or a framework sales pitch. The project decision was much more pragmatic than that: perform a maintenance reset, preserve routes and content, keep the site visually recognizable, and remove everything that no longer made sense to maintain.

## How I am handling evidence

To keep this article honest, I am splitting the claims into three buckets:

- **Verified project facts**: PRD, TechSpec, ADRs, README, current source code, and the Vercel publishing history.
- **External context already recorded**: comparisons and benchmarks that showed up during early ideation, but are not measurements taken from this repository.
- **Moderate technical inference**: conclusions that fit the final architecture and deploy history, explicitly labeled as inference rather than hard fact.

One correction matters up front: some early drafts still talked about preserving RSS and React islands for theme and sharing. That is not the final direction. The final ADRs, README, and shipped implementation point the other way: RSS was removed and unnecessary hydration was avoided.

## The actual migration context

The original blog ran on Gatsby 2.x, which made sense years ago but had become too expensive for what this site really is: a bilingual Markdown blog with no backend. The main migration ADR summarizes the problem well: a stagnant ecosystem, slow builds in the `~60-120s` range, too much JavaScript for fully static pages, and a maintenance burden that had become too large for a site that should be easy to publish.

There was another layer of debt on top of the framework age: the codebase still carried visible artifacts from the original fork. Old references to the original domain and branding were still around, legacy surfaces such as RSS, AdSense, and newsletter pages still existed, and the sharing implementation had more baggage than value.

The PRD turned that diagnosis into a tight product rule set:

- preserve `9` published slugs;
- preserve `18` Markdown files, one per language;
- keep Portuguese as the default experience and English under `/en/`;
- avoid route and reading regressions;
- treat dark/light mode as the only visible V1 improvement;
- remove RSS, AdSense, `/thanks`, `/confirm`, and broken discussion links.

In other words: this was not a migration to "refresh the brand". It was a migration to make publishing simple again.

It also was not decided on pure instinct. A good part of the study and documentation work around the migration was supported by [Compozy](https://github.com/compozy/compozy), which helped turn the exploration phase into structured artifacts: PRD, ADRs, TechSpec, and implementation tasks. I do not see Compozy as the story itself. The migration is the story. Compozy was useful because it made the reasoning more explicit and easier to follow.

## Why Astro

That choice was recorded in `ADR-001`, which compared Astro with Next.js App Router and Eleventy.

That context matters even more because the decision did not come from familiarity. If Astro had been the tool I already knew best, the trade-off would have been less interesting. Instead, because this was my first serious pass through `.astro`, content collections, and Astro's way of composing pages, I had to pressure-test the choice more carefully. In the end, that made the decision stronger, not weaker.

### Next.js was rejected because it solved problems this blog does not have

The argument against Next.js was not that Next is bad. It was that Next would introduce more abstraction and more client-side overhead than this project needed. This blog does not require a backend, authentication, edge logic, or a heavily interactive UI. For a static Markdown site, that felt like using a bazooka to kill a fly.

### Eleventy was rejected because the rewrite cost was higher

Eleventy made sense from a minimalism perspective, but it raised the migration cost. It would require a broader rewrite of the component layer and would leave less room for future interactivity if the site ever needed it. Even in a mostly static blog, I still wanted to keep things like the theme switcher and the language switch in a comfortable place.

### Astro matched the real shape of the project

Astro won for three concrete reasons:

1. **zero JavaScript by default** for static pages;
2. **content collections with schema validation** for frontmatter;
3. **good overlap with the remark/rehype ecosystem** already familiar to the blog.

For a Markdown-first blog, that removes a surprising amount of friction.

## How the migration was designed

The final design ended up much simpler than the previous stack.

### 1. Content collections with Zod

Posts now go through schema validation instead of relying only on convention:

```ts
export const postFrontmatterSchema = z.object({
  title: z.string(),
  date: z.coerce.date(),
  spoiler: z.string(),
  tags: z.array(z.string()).optional().default([]),
  updateDate: z.coerce.date().optional(),
});
```

This solves a small but annoying problem: Markdown blogs feel simple until inconsistent frontmatter breaks a build.

### 2. One folder per post, two files per language

The project kept a very good convention for a small bilingual blog: each post still lives in its own directory, with assets next to the Markdown files.

```text
src/content/posts/<slug>/
  index.pt-br.md
  index.md
  image.png
```

That decision was recorded in `ADR-003`, and it solved two things at once:

- it preserved the authoring ergonomics;
- it reduced the risk of breaking relative images during the migration.

### 3. Central helpers for routes and alternates

Instead of spreading URL logic across templates, the project centralized it in a small route helper layer:

```ts
export function postPath(slug: string, lang: Lang): string {
  const encoded = encodeUriSegments(slug);

  return lang === 'pt-br'
    ? `/${encoded}/`
    : `/en/${encoded}/`;
}

export function postRouteMetadata(slug: string, lang: Lang): PostRoute {
  const path = postPath(slug, lang);
  const alternateLang: Lang =
    lang === 'pt-br' ? 'en' : 'pt-br';

  return {
    slug,
    lang,
    path,
    canonical: path,
    alternate: postPath(slug, alternateLang),
  };
}
```

This matters more than it looks. In a small bilingual blog, a lot of the real complexity is not rendering. It is keeping route parity, canonical paths, and alternate links consistent without letting one odd exception slip through.

### 4. Theme handling with a pre-paint inline script

`ADR-004` formalized a decision I really like: no React island for theme state.

Instead of depending on hydration, the base layout applies the theme before first paint:

```js
(function () {
  var stored = localStorage.getItem(THEME_STORAGE_KEY);
  var systemPrefersLight = window.matchMedia(
    '(prefers-color-scheme: light)'
  ).matches;
  var theme =
    stored === 'light' || stored === 'dark'
      ? stored
      : systemPrefersLight
        ? 'light'
        : 'dark';

  if (theme === 'light') {
    document.documentElement.classList.add('light');
  }
})();
```

That is not just an implementation detail. For this scope, it delivers the feature with less JavaScript, fewer dependencies, and less chance of theme flash.

### 5. `pnpm` as part of the operational cleanup

Another small but telling detail was standardizing the day-to-day workflow around `pnpm`. I am not framing this as a package-manager benchmark or a `pnpm` versus Yarn argument. The reason is much more practical than that: the current project leans on a small set of explicit scripts, and `package.json` reflects that clearly.

The main build path is now:

```bash
pnpm build
```

And the closest thing to a maintenance gate is:

```bash
pnpm validate
```

That `validate` script chains linting, build, and the migration audit. For me, that kind of setup matters because it makes the operating model of the project easier to read. More than "using `pnpm` instead of Yarn", the point was to make the maintenance routine more legible and more aligned with the stripped-down architecture Astro made possible.

### 6. The old share library left, static links replaced it

Sharing remained, but in a much leaner form:

- no legacy sharing dependency;
- no React island;
- no broken discussion behavior;
- only static outbound links.

It was a small UI change and a large maintenance win.

## The trade-offs that came with it

Not everything became "better" in every dimension. The migration traded one problem set for a smaller and more controlled one.

### Manual i18n

Astro did not become a magical i18n solution here. The project deliberately adopted an explicit model: language by filename, routes by helper, parity by audit. That is fine for this blog. For a bigger site with more locales and more content, it would likely stop scaling well.

### Visual drift risk

Moving from Typography.js + SCSS to Tailwind meant accepting some degree of visual drift. `ADR-004` says that clearly: the goal was **close visual continuity**, not pixel-perfect recreation of the old implementation.

This was one of the more mature trade-offs in the migration. Instead of spending time recreating the old stack line by line, the project preserved what mattered more: reading feel, layout, theme, code styling, and overall identity.

### Relative assets still require discipline

Moving Markdown almost always reveals broken images, odd links, or assumptions baked into the previous pipeline. That is why keeping assets co-located mattered so much. It does not remove the risk, but it reduces the odds that the migration turns into a hunt for invisible breakage.

### Focused validation instead of heavy automation

`ADR-005` chose a very specific validation line:

- `lint`;
- `build`;
- audit of routes, content, translation pairs, and legacy references.

Lighthouse and visual review stayed as release gates, but they were not immediately pulled into a heavy CI setup with screenshot diffing and more ceremony.

I think that was a good V1 decision. Moderate inference: for a static blog with few routes and controlled scope, the most valuable automation was the automation that protected structural regression, not the one that made the pipeline more expensive to maintain.

## Netlify to Vercel: an operational change coupled to the new base

There is an important nuance here: the project ADRs document the framework migration much better than the hosting switch. So I am treating this section as a mix of verified fact and moderate inference.

### Verified fact

From the publishing history, the final flow looked like this:

- the site builds statically into `dist`;
- Vercel became the production host;
- during the transition, authoritative DNS was still delegated through Netlify infrastructure (`nsone`);
- the `henriquetavares.com` and `www` domains were validated in Vercel while the DNS zone was still being adjusted outside Vercel.

In practice, that produced a very real and very common situation: hosting was already correct, while DNS resolution still fought with local cache and old delegation state.

### Moderate inference

Even without a dedicated ADR for "Vercel vs Netlify", the choice fits the final project shape:

- Astro outputs a simple static build;
- the build configuration is straightforward (`pnpm build`, output in `dist`);
- Vercel fits naturally with preview-style deployment and custom domain wiring;
- the new stack ended up aligned with a cleaner deploy setup and fewer legacy surfaces.

What I am **not** claiming here, because it is not documented in the sources I used:

- lower cost;
- better edge performance;
- cheaper CI/CD;
- any production metric directly comparing Vercel and Netlify.

Those claims might be true in other projects, but they are not verified facts for this one.

## Observable results

### What is documented in the project

The strongest outcomes of the migration are these:

- the content inventory was preserved: `18` Markdown files and `9` translation pairs;
- routes follow the original public model: `/` and `/<slug>/` for PT-BR, `/en/` and `/en/<slug>/` for EN;
- the build recorded in the technical decision drops from `~60-120s` on Gatsby to `~8s` on Astro;
- the architectural target moves away from a setup that shipped about `~300 KB` of JavaScript on static pages toward a model where Astro ships zero JS by default, keeping only a minimal inline theme script and static share links.

Those four points alone change a lot about the experience of maintaining the blog.

### What became operational evidence

The publishing history also left two practical signals:

1. the new stack was published on Vercel under the custom domain;
2. the transition exposed a real operational detail: hosting and DNS can live in different providers for a while, and that can produce confusing local symptoms even after the authoritative setup is already correct.

That is not exactly a benchmark, but it is the kind of lesson that rarely shows up in the README and almost always shows up in real life.

### Lighthouse: before and after

At this point I do have concrete project evidence to show: the Lighthouse screenshots versioned alongside this post. They are not universal benchmarks, and they are not a promise that any Gatsby-to-Astro migration will reproduce the same numbers. They are simply the honest snapshot of this migration, on these pages, in these measurement runs.

![Lighthouse before the migration with Gatsby](./with-gatsby.png)

![Lighthouse after the migration with Astro](./with-astro.png)

The headline comparison looks like this:

- **Performance**: `74` -> `100`
- **Accessibility**: `94` -> `98`
- **Best Practices**: `77` -> `100`
- **SEO**: `100` -> `100`

And if you look at the metrics visible in the screenshots themselves:

- **First Contentful Paint**: `1.3s` -> `0.3s`
- **Largest Contentful Paint**: `2.4s` -> `0.3s`
- **Total Blocking Time**: `110ms` -> `0ms`
- **Speed Index**: `5.8s` -> `0.3s`
- **Cumulative Layout Shift**: `0` -> `0.007`

CLS deserves a careful read: it got numerically worse, moving from `0` to `0.007`, but it still remains extremely low and well within a healthy range. The rest of the set shows a much stronger improvement in time to useful content, main-thread blocking, and perceived loading speed.

So unlike the earlier version of this article, I can now say this with more confidence: the new architecture not only made sense in theory, it also left visible improvement in the project's own measurements.

## External context that helps, but does not prove the case on its own

The early ideation for the project included external comparisons in favor of Astro, such as:

- stronger public Core Web Vitals profiles;
- faster builds in public comparisons with older generators;
- the advantage of shipping zero JavaScript by default.

That context helps explain why Astro looked promising. But it is still just that: **external context**. What actually justifies the decision here is how well it fits this specific blog, not a generic benchmark from elsewhere.

## What I learned from this migration

If I had to compress the main lesson into one sentence, it would be this: many migrations hurt because they try to solve technical debt and product repositioning at the same time.

This one worked better because the rule set stayed disciplined:

- first, preserve what already worked;
- then, remove what only existed by inheritance;
- only after that, add the smallest visible improvement that was truly worth the cost.

Another important lesson is that "less JavaScript" only matters when it also brings less operational complexity and less editorial friction. In this case, it did.

I would add one more lesson to that: learning Astro from scratch, leaning on structured support from Compozy, and keeping the operational workflow simple with `pnpm` all pointed in the same direction. Simplifying a project is not just about reducing dependencies or client payload. It is also about reducing hesitation around studying, deciding, validating, and maintaining it.

## When a similar migration makes sense

I would consider a migration like this when most of these are true at the same time:

- the site is mostly static;
- the content still fits naturally in Markdown;
- the current stack consumes too much energy for how little is published;
- deployment depends more on legacy than on real requirements;
- the goal is not to redesign everything, but to recover a healthy baseline.

If your project depends heavily on dynamic runtime behavior, a coupled backend, sophisticated i18n, or frequent client-side interactivity, this kind of simplification may not fit as well. But for a small bilingual static blog, the gain can be immediate.

## Closing

In the end, this migration was not about replacing Gatsby with Astro because Astro is fashionable, and not about moving from Netlify to Vercel because one platform "won". It was about aligning the architecture and the infrastructure with what this project actually is today.

A small bilingual static blog, written in Markdown, that should be easy to maintain and pleasant to publish.

Once the stack stops helping and starts charging tolls, migration stops being technical vanity and becomes basic maintenance.

Now let's see if it solves the main problem too, which is getting me back to writing.

Thanks for reading. 🚀
