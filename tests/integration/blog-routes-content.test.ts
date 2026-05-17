import { describe, expect, it } from 'vitest';
import { findUnpairedSlugs, groupPostsBySlug } from '../../src/lib/posts';
import { auditBlogRoutes, buildExpectedBlogRoutes } from '../../src/lib/routes';
import {
  EXPECTED_SLUGS,
  loadPostEntriesFromDisk,
} from '../helpers/load-post-entries';

describe('blog routes + posts against migrated content (integration)', () => {
  it('loads 20 posts across 10 translation pairs with no unpaired slugs', () => {
    const { slugs, entries } = loadPostEntriesFromDisk();
    expect(slugs).toEqual(
      expect.arrayContaining(
        [...EXPECTED_SLUGS].sort((a, b) => a.localeCompare(b))
      )
    );
    expect(entries).toHaveLength(20);
    expect(findUnpairedSlugs(entries)).toEqual([]);

    const pairs = groupPostsBySlug(entries);
    expect(pairs.size).toBe(10);
    for (const slug of EXPECTED_SLUGS) {
      const pair = pairs.get(slug);
      expect(pair?.en?.lang).toBe('en');
      expect(pair?.['pt-br']?.lang).toBe('pt-br');
    }
  });

  it('expects exactly 22 blog routes (2 indexes + 10 slugs × 2 locales)', () => {
    const { entries } = loadPostEntriesFromDisk();
    const slugs = [...new Set(entries.map((e) => e.slug))];
    const routes = buildExpectedBlogRoutes(slugs);
    expect(routes).toHaveLength(22);

    const audit = auditBlogRoutes({
      posts: entries,
      unpairedSlugs: findUnpairedSlugs(entries),
    });
    expect(audit.expectedRoutes).toEqual(routes);
    expect(audit.unpairedSlugs).toEqual([]);
  });
});
