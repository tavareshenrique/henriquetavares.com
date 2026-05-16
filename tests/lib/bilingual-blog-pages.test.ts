import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { findUnpairedSlugs, postsForLang } from '../../src/lib/posts';
import { postPath } from '../../src/lib/routes';
import { loadPostEntriesFromDisk } from '../helpers/load-post-entries';

const repoRoot = path.resolve(__dirname, '..', '..');

describe('bilingual blog pages — data contracts (unit)', () => {
  it('Portuguese index data only includes pt-br posts', () => {
    const { entries } = loadPostEntriesFromDisk();
    const pt = postsForLang(entries, 'pt-br');
    expect(pt).toHaveLength(9);
    expect(pt.every((p) => p.lang === 'pt-br')).toBe(true);
    expect(findUnpairedSlugs(entries)).toEqual([]);
  });

  it('English index data only includes en posts', () => {
    const { entries } = loadPostEntriesFromDisk();
    const en = postsForLang(entries, 'en');
    expect(en).toHaveLength(9);
    expect(en.every((p) => p.lang === 'en')).toBe(true);
  });

  it('each Portuguese slug maps to /<slug>/', () => {
    const { slugs } = loadPostEntriesFromDisk();
    for (const slug of slugs) {
      expect(postPath(slug, 'pt-br')).toBe(`/${slug}/`);
    }
  });

  it('each English slug maps to /en/<slug>/', () => {
    const { slugs } = loadPostEntriesFromDisk();
    for (const slug of slugs) {
      expect(postPath(slug, 'en')).toBe(`/en/${slug}/`);
    }
  });

  it('404 page source does not reference Gatsby-only props', () => {
    const src = readFileSync(
      path.join(repoRoot, 'src', 'pages', '404.astro'),
      'utf8'
    );
    expect(src.toLowerCase()).not.toContain('gatsby');
    expect(src).not.toMatch(/\bprops\.data\b/);
  });
});
