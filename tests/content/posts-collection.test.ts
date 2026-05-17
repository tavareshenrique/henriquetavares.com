import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  postFrontmatterSchema,
  type PostFrontmatter,
} from '../../src/content/post-schema';
import { EXPECTED_BLOG_SLUGS } from '../../src/lib/expected-blog-slugs';
import { parseMarkdownFrontmatter } from '../helpers/markdown-frontmatter';

const repoRoot = path.resolve(__dirname, '..', '..');
const postsRoot = path.join(repoRoot, 'src', 'content', 'posts');

const EXPECTED_SLUGS = EXPECTED_BLOG_SLUGS;

function listPostMarkdownFiles(): {
  slug: string;
  lang: 'en' | 'pt-br';
  file: string;
}[] {
  const slugs = readdirSync(postsRoot, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name);

  const files: { slug: string; lang: 'en' | 'pt-br'; file: string }[] = [];

  for (const slug of slugs) {
    const dir = path.join(postsRoot, slug);
    const en = path.join(dir, 'index.md');
    const pt = path.join(dir, 'index.pt-br.md');
    files.push({ slug, lang: 'en', file: en });
    files.push({ slug, lang: 'pt-br', file: pt });
  }

  return files;
}

describe('post content collection (unit)', () => {
  it('contains the full migrated slug inventory and one file per locale for each slug', () => {
    const slugs = readdirSync(postsRoot, { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e) => e.name)
      .sort();

    expect(slugs).toEqual(expect.arrayContaining([...EXPECTED_SLUGS].sort()));
    expect(listPostMarkdownFiles().length).toBeGreaterThanOrEqual(
      EXPECTED_SLUGS.length * 2
    );
  });

  it('parses every Markdown frontmatter with the content schema', () => {
    for (const { file } of listPostMarkdownFiles()) {
      const raw = parseMarkdownFrontmatter(file);
      const parsed = postFrontmatterSchema.safeParse(raw);
      expect(
        parsed.success,
        JSON.stringify(parsed.error?.format(), null, 2)
      ).toBe(true);
    }
  });

  it('gives each slug exactly one English and one Portuguese file', () => {
    const bySlug = new Map<string, { en: number; 'pt-br': number }>();

    for (const { slug, lang } of listPostMarkdownFiles()) {
      if (!bySlug.has(slug)) {
        bySlug.set(slug, { en: 0, 'pt-br': 0 });
      }
      const counts = bySlug.get(slug)!;
      counts[lang] += 1;
    }

    for (const slug of EXPECTED_SLUGS) {
      expect(bySlug.get(slug)).toEqual({ en: 1, 'pt-br': 1 });
    }
  });

  it('parses date and updateDate consistently between EN and PT for each slug', () => {
    for (const slug of EXPECTED_SLUGS) {
      const enPath = path.join(postsRoot, slug, 'index.md');
      const ptPath = path.join(postsRoot, slug, 'index.pt-br.md');
      const en = postFrontmatterSchema.parse(parseMarkdownFrontmatter(enPath));
      const pt = postFrontmatterSchema.parse(parseMarkdownFrontmatter(ptPath));

      expect(en.date.getTime()).toBe(pt.date.getTime());

      const enHasUpdate = en.updateDate !== undefined;
      const ptHasUpdate = pt.updateDate !== undefined;
      expect(enHasUpdate).toBe(ptHasUpdate);
      if (enHasUpdate && ptHasUpdate) {
        expect(en.updateDate!.getTime()).toBe(pt.updateDate!.getTime());
      }
    }
  });

  it('defaults tags to an empty array when the field is absent', () => {
    const helloEn = path.join(postsRoot, 'hello-world', 'index.md');
    const data = parseMarkdownFrontmatter(helloEn) as Record<string, unknown>;
    expect(data.tags).toBeUndefined();
    const parsed: PostFrontmatter = postFrontmatterSchema.parse(data);
    expect(parsed.tags).toEqual([]);
  });

  it('documents cross-post URLs that will need route normalization after Astro routing', () => {
    const internalLinkPattern =
      /https:\/\/henriquetavares\.com(\/en)?\/(pt-br\/)?[^\s)]+/g;
    const hits = new Map<string, string[]>();

    for (const { slug, file } of listPostMarkdownFiles()) {
      const body = readFileSync(file, 'utf8');
      const matches = body.match(internalLinkPattern);
      if (matches?.length) {
        hits.set(`${slug}:${path.basename(file)}`, [...new Set(matches)]);
      }
    }

    expect(hits.size).toBeGreaterThan(0);

    const ptSlugLinks = [...hits.entries()].filter(
      ([key]) =>
        key.endsWith('index.pt-br.md') &&
        hits.get(key)!.some((url) => url.includes('/pt-br/'))
    );
    expect(ptSlugLinks.length).toBeGreaterThan(0);

    const enNoPtPrefix = [...hits.entries()].filter(
      ([key]) =>
        key.endsWith('index.md') &&
        hits
          .get(key)!
          .some(
            (url) =>
              url.startsWith('https://henriquetavares.com/') &&
              !url.includes('/pt-br/') &&
              !url.includes('/en/')
          )
    );
    expect(enNoPtPrefix.length).toBeGreaterThan(0);
  });
});
