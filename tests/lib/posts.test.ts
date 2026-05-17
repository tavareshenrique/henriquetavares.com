import { describe, expect, it } from 'vitest';
import type { PostFrontmatter } from '../../src/content/post-schema';
import {
  findUnpairedSlugs,
  groupPostsBySlug,
  languageFromEntryFilename,
  parsePostEntryId,
  postsForLang,
  sortPostsByDateDescending,
  toPostEntry,
} from '../../src/lib/posts';

function fm(
  partial: Partial<PostFrontmatter> & Pick<PostFrontmatter, 'title'>
): PostFrontmatter {
  return {
    title: partial.title,
    date: partial.date ?? new Date('2020-01-01'),
    spoiler: partial.spoiler ?? '',
    tags: partial.tags ?? [],
    ...(partial.updateDate !== undefined
      ? { updateDate: partial.updateDate }
      : {}),
  };
}

describe('posts domain helpers (unit)', () => {
  it('derives en from index.md', () => {
    expect(parsePostEntryId('hello-world/index.md')).toEqual({
      slug: 'hello-world',
      lang: 'en',
    });
    expect(languageFromEntryFilename('index.md')).toBe('en');
  });

  it('derives pt-br from index.pt-br.md', () => {
    expect(parsePostEntryId('hello-world/index.pt-br.md')).toEqual({
      slug: 'hello-world',
      lang: 'pt-br',
    });
    expect(languageFromEntryFilename('index.pt-br.md')).toBe('pt-br');
  });

  it('uses the same slug for both languages in one post directory', () => {
    const en = parsePostEntryId('react-conf-br-2019/index.md');
    const pt = parsePostEntryId('react-conf-br-2019/index.pt-br.md');
    expect(en.slug).toBe(pt.slug);
    expect(en.slug).toBe('react-conf-br-2019');
  });

  it('maps collection-shaped input to PostEntry with route and slug from directory name', () => {
    const entry = toPostEntry({
      id: 'my-slug/index.md',
      data: fm({
        title: 'Any title',
        date: new Date('2021-06-15'),
        spoiler: 'x',
      }),
    });
    expect(entry.slug).toBe('my-slug');
    expect(entry.lang).toBe('en');
    expect(entry.route).toBe('/en/my-slug/');
    expect(entry.title).toBe('Any title');
  });

  it('sorts posts by date descending', () => {
    const posts = [
      toPostEntry({
        id: 'a/index.md',
        data: fm({ title: 'old', date: new Date('2019-01-01') }),
      }),
      toPostEntry({
        id: 'b/index.md',
        data: fm({ title: 'new', date: new Date('2022-01-01') }),
      }),
      toPostEntry({
        id: 'c/index.md',
        data: fm({ title: 'mid', date: new Date('2020-06-01') }),
      }),
    ];
    const sorted = sortPostsByDateDescending(posts);
    expect(sorted.map((p) => p.title)).toEqual(['new', 'mid', 'old']);
  });

  it('postsForLang filters then sorts by date', () => {
    const posts = [
      toPostEntry({
        id: 'a/index.md',
        data: fm({ title: 'en-old', date: new Date('2018-01-01') }),
      }),
      toPostEntry({
        id: 'a/index.pt-br.md',
        data: fm({ title: 'pt-new', date: new Date('2023-01-01') }),
      }),
      toPostEntry({
        id: 'b/index.md',
        data: fm({ title: 'en-new', date: new Date('2024-01-01') }),
      }),
    ];
    const en = postsForLang(posts, 'en');
    expect(en.map((p) => p.title)).toEqual(['en-new', 'en-old']);
  });

  it('reports slugs as unpaired when a translation file is missing', () => {
    const posts = [
      toPostEntry({
        id: 'paired/index.md',
        data: fm({ title: 'a' }),
      }),
      toPostEntry({
        id: 'paired/index.pt-br.md',
        data: fm({ title: 'b' }),
      }),
      toPostEntry({
        id: 'lonely/index.md',
        data: fm({ title: 'only-en' }),
      }),
    ];
    expect(findUnpairedSlugs(posts)).toEqual(['lonely']);
    const grouped = groupPostsBySlug(posts);
    expect(grouped.get('lonely')?.en?.title).toBe('only-en');
    expect(grouped.get('lonely')?.['pt-br']).toBeUndefined();
  });

  it('rejects entry ids that are not paired language files under a slug directory', () => {
    expect(() => parsePostEntryId('only-root-file.md')).toThrow(
      /Invalid post entry id/
    );
    expect(() => parsePostEntryId('some-slug/readme.md')).toThrow(
      /Unsupported post entry file/
    );
    expect(() => languageFromEntryFilename('index.es.md')).toThrow(
      /Unsupported entry filename/
    );
  });
});
