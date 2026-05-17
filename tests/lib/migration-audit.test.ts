import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { postFrontmatterSchema } from '../../src/content/post-schema';
import {
  collectLiveSourceScanFiles,
  DIST_HTML_FORBIDDEN_RULES,
  EXPECTED_POST_ENTRY_COUNT,
  LIVE_SOURCE_FORBIDDEN_RULES,
  formatMigrationAuditReport,
  runMigrationAudit,
  scanForbiddenInFiles,
} from '../../src/lib/migration-audit';
import { toPostEntry } from '../../src/lib/posts';
import { loadPostEntriesFromDisk as loadPostEntriesFromRepo } from '../../src/lib/post-disk-inventory';
import { buildExpectedBlogRoutes } from '../../src/lib/routes';
import { parseMarkdownFrontmatter } from '../helpers/markdown-frontmatter';

const repoRoot = path.resolve(__dirname, '..', '..');

function minimalPackageJson() {
  return `${JSON.stringify(
    {
      name: 'fixture',
      private: true,
      dependencies: {},
      devDependencies: {},
    },
    null,
    2
  )}\n`;
}

function writeMinimalRepoSkeleton(dir: string) {
  writeFileSync(path.join(dir, 'package.json'), minimalPackageJson(), 'utf8');
  for (const name of [
    'astro.config.mjs',
    'tailwind.config.mjs',
    'eslint.config.mjs',
    'postcss.config.mjs',
    'vitest.config.ts',
  ]) {
    writeFileSync(path.join(dir, name), '// fixture\n', 'utf8');
  }
  mkdirSync(path.join(dir, 'src', 'pages'), { recursive: true });
  writeFileSync(
    path.join(dir, 'src', 'pages', 'fixture.astro'),
    '<!-- fixture -->\n',
    'utf8'
  );
}

function loadRealPosts() {
  return loadPostEntriesFromRepo(repoRoot).entries;
}

describe('migration audit (unit)', () => {
  it('passes migration baseline invariants on this repo (no dist verification)', () => {
    const entries = loadRealPosts();
    expect(entries.length).toBeGreaterThanOrEqual(EXPECTED_POST_ENTRY_COUNT);

    const result = runMigrationAudit({
      repoRoot,
      posts: entries,
      verifyDist: false,
    });

    expect(result.ok, formatMigrationAuditReport(result)).toBe(true);
  });

  it('fails when a translation pair is missing', () => {
    const entries = loadRealPosts().filter(
      (e) => !(e.slug === 'hello-world' && e.lang === 'en')
    );

    const result = runMigrationAudit({
      repoRoot,
      posts: entries,
      verifyDist: false,
    });

    expect(result.ok).toBe(false);
    expect(result.issues.some((i) => i.code === 'TRANSLATION_PAIR')).toBe(true);
    expect(result.issues.some((i) => i.message.includes('hello-world'))).toBe(
      true
    );
  });

  it('reports the exact missing route when dist inventory is incomplete', () => {
    const dir = mkdtempSync(path.join(os.tmpdir(), 'migration-audit-'));
    writeMinimalRepoSkeleton(dir);

    const entries = loadRealPosts();
    mkdirSync(path.join(dir, 'dist'), { recursive: true });
    writeFileSync(
      path.join(dir, 'dist', 'index.html'),
      '<html></html>',
      'utf8'
    );

    const result = runMigrationAudit({
      repoRoot: dir,
      posts: entries,
      verifyDist: true,
    });

    expect(result.ok).toBe(false);
    const missingHello = result.issues.find(
      (i) =>
        i.code === 'ROUTE_DIST' &&
        i.message.includes('/hello-world/') &&
        i.message.includes('dist/hello-world/index.html')
    );
    expect(missingHello, missingHello?.message).toBeTruthy();
  });

  it('flags adsbygoogle in built HTML under dist/', () => {
    const dir = mkdtempSync(path.join(os.tmpdir(), 'migration-audit-'));
    writeMinimalRepoSkeleton(dir);
    mkdirSync(path.join(dir, 'dist'), { recursive: true });
    writeFileSync(
      path.join(dir, 'dist', 'index.html'),
      '<html><script>adsbygoogle</script></html>',
      'utf8'
    );

    const result = runMigrationAudit({
      repoRoot: dir,
      posts: loadRealPosts(),
      verifyDist: true,
    });

    expect(result.ok).toBe(false);
    expect(
      result.issues.some(
        (i) =>
          i.code === 'FORBIDDEN_REFERENCE' &&
          i.message.includes('dist-html') &&
          i.message.includes('adsbygoogle')
      )
    ).toBe(true);
  });

  it('flags react-share in live sources outside excluded Markdown posts', () => {
    const dir = mkdtempSync(path.join(os.tmpdir(), 'migration-audit-'));
    writeMinimalRepoSkeleton(dir);
    writeFileSync(
      path.join(dir, 'src', 'pages', 'bad-share.astro'),
      '<!-- react-share -->\n',
      'utf8'
    );

    const result = runMigrationAudit({
      repoRoot: dir,
      posts: loadRealPosts(),
      verifyDist: false,
    });

    expect(result.ok).toBe(false);
    expect(
      result.issues.some(
        (i) =>
          i.message.includes('live-src') && i.message.includes('react-share')
      )
    ).toBe(true);
  });

  it('does not scan co-located Markdown bodies under src/content/posts (historical mentions)', () => {
    const dir = mkdtempSync(path.join(os.tmpdir(), 'migration-audit-'));
    writeMinimalRepoSkeleton(dir);
    mkdirSync(path.join(dir, 'src', 'content', 'posts', 'hello-world'), {
      recursive: true,
    });
    writeFileSync(
      path.join(dir, 'src', 'content', 'posts', 'hello-world', 'index.md'),
      '---\ntitle: X\ndate: 2020-01-01\nspoiler: x\n---\nreact-share discussion\n',
      'utf8'
    );

    const files = collectLiveSourceScanFiles(dir);
    const touchedMd = files.filter((f) => f.endsWith('.md'));
    expect(touchedMd).toHaveLength(0);

    const hits = scanForbiddenInFiles(
      dir,
      files,
      LIVE_SOURCE_FORBIDDEN_RULES,
      'live-src'
    );
    expect(hits).toHaveLength(0);
  });

  it('uses route helpers for expected route inventory length', () => {
    const entries = loadRealPosts();
    const slugs = [...new Set(entries.map((e) => e.slug))];
    const routes = buildExpectedBlogRoutes(slugs);
    expect(routes).toHaveLength(22);
    expect(routes).toContain('/');
    expect(routes).toContain('/en/');
    expect(routes).toContain('/hello-world/');
    expect(routes).toContain('/en/hello-world/');
  });

  it('reports forbidden references with file paths for DIST_HTML rules', () => {
    const dir = mkdtempSync(path.join(os.tmpdir(), 'migration-audit-'));
    const htmlPath = path.join(dir, 'out.html');
    writeFileSync(htmlPath, '<html>googlesyndication.com</html>', 'utf8');
    const issues = scanForbiddenInFiles(
      dir,
      [htmlPath],
      DIST_HTML_FORBIDDEN_RULES,
      'dist-html'
    );
    expect(issues.length).toBeGreaterThan(0);
    expect(issues[0].message).toContain('out.html');
  });

  it('fails when a migrated baseline slug disappears from the inventory', () => {
    const entries = loadRealPosts().map((e) =>
      e.slug === 'hello-world' ? { ...e, slug: 'unexpected-slug-from-test' } : e
    );

    const result = runMigrationAudit({
      repoRoot,
      posts: entries,
      verifyDist: false,
    });

    expect(result.ok).toBe(false);
    expect(result.issues.some((i) => i.code === 'SLUG_INVENTORY')).toBe(true);
  });

  it('builds synthetic paired entries for route expectations', () => {
    const slug = 'slug-a';
    const baseFrontmatter = () =>
      postFrontmatterSchema.parse({
        title: 'T',
        date: new Date('2020-01-01'),
        spoiler: 's',
        tags: [],
      });

    const pair = [
      toPostEntry({
        id: `${slug}/index.md`,
        data: baseFrontmatter(),
      }),
      toPostEntry({
        id: `${slug}/index.pt-br.md`,
        data: baseFrontmatter(),
      }),
    ];

    const result = runMigrationAudit({
      repoRoot,
      posts: pair,
      verifyDist: false,
    });

    expect(result.ok).toBe(false);
    expect(result.issues.some((i) => i.code === 'CONTENT_COUNT')).toBe(true);
    expect(result.issues.some((i) => i.code === 'SLUG_INVENTORY')).toBe(true);
  });

  it('parses representative Markdown via disk loader compatible with tests helper', () => {
    const hello = path.join(repoRoot, 'src/content/posts/hello-world/index.md');
    const raw = parseMarkdownFrontmatter(hello);
    expect(postFrontmatterSchema.safeParse(raw).success).toBe(true);
    expect(readFileSync(hello, 'utf8').length).toBeGreaterThan(10);
  });
});
