import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { EXPECTED_BLOG_SLUGS } from './expected-blog-slugs';
import { findUnpairedSlugs, type PostEntry } from './posts';
import { loadPostEntriesFromDisk } from './post-disk-inventory';
import { buildExpectedBlogRoutes } from './routes';

export const EXPECTED_POST_ENTRY_COUNT = 18;
export const EXPECTED_PAIRED_SLUG_COUNT = 9;

export interface MigrationAuditIssue {
  code: string;
  message: string;
}

export interface MigrationAuditResult {
  ok: boolean;
  issues: MigrationAuditIssue[];
}

export interface RunMigrationAuditOptions {
  repoRoot: string;
  /** Posts loaded from disk when omitted */
  posts?: PostEntry[];
  /** When true, assert dist HTML exists for expected routes and run HTML forbidden scan */
  verifyDist?: boolean;
}

/** Legacy files that must not exist after Task 09 */
export const LEGACY_FORBIDDEN_FILENAMES = [
  'gatsby-config.js',
  'gatsby-node.js',
  'gatsby-browser.js',
  'now.json',
] as const;

const ROOT_CONFIG_FILES = [
  'package.json',
  'astro.config.mjs',
  'tailwind.config.mjs',
  'eslint.config.mjs',
  'postcss.config.mjs',
  'vitest.config.ts',
] as const;

const TEXT_EXTENSIONS = new Set([
  '.astro',
  '.ts',
  '.tsx',
  '.js',
  '.mjs',
  '.cjs',
  '.css',
  '.scss',
  '.json',
]);

export interface ForbiddenRule {
  id: string;
  pattern: RegExp;
  hint: string;
}

/** Patterns applied to live Astro/src sources (post Markdown intentionally excluded — historical mentions). */
export const LIVE_SOURCE_FORBIDDEN_RULES: ForbiddenRule[] = [
  {
    id: 'react-share',
    pattern: /\breact-share\b/,
    hint: 'Remove react-share; use static outbound share URLs (ADR-005).',
  },
  {
    id: 'adsbygoogle',
    pattern: /\badsbygoogle\b/i,
    hint: 'Remove AdSense bootstrap snippets from live layouts.',
  },
  {
    id: 'googlesyndication',
    pattern: /googlesyndication\.com/i,
    hint: 'Remove Google syndication / AdSense script URLs.',
  },
  {
    id: 'gatsby-marker',
    pattern: /\bgatsby-[a-z0-9_-]/,
    hint: 'Remove Gatsby-era classes or imports from live Astro sources.',
  },
  {
    id: 'thanks-route',
    pattern: /href=["']\/thanks\/?["']/i,
    hint: 'Removed surface: do not link to /thanks.',
  },
  {
    id: 'confirm-route',
    pattern: /href=["']\/confirm\/?["']/i,
    hint: 'Removed surface: do not link to /confirm.',
  },
  {
    id: 'rss-autodiscovery',
    pattern: /type=["']application\/rss\+xml["']/i,
    hint: 'RSS autodiscovery was removed; drop rss+xml link tags.',
  },
  {
    id: 'rss-path',
    pattern: /href=["'][^"']*\/rss\.xml[^"']*["']/i,
    hint: 'RSS feed URLs were removed from V1.',
  },
  {
    id: 'overreacted-discussion',
    pattern: /overreacted\.io/i,
    hint: 'Remove stale discussion / overreacted.io references from live sources.',
  },
];

/** Dist HTML embeds Markdown prose; historical mentions (e.g. Gatsby starter links) stay allowed per scoped scanning. */
const DIST_HTML_RULE_IDS = new Set([
  'adsbygoogle',
  'googlesyndication',
  'react-share',
  'rss-autodiscovery',
  'rss-path',
  'overreacted-discussion',
]);

/** Patterns for built HTML under dist/ */
export const DIST_HTML_FORBIDDEN_RULES: ForbiddenRule[] =
  LIVE_SOURCE_FORBIDDEN_RULES.filter((r) => DIST_HTML_RULE_IDS.has(r.id));

function toPosixRel(repoRoot: string, absPath: string): string {
  return path.relative(repoRoot, absPath).split(path.sep).join('/');
}

function isExcludedHistoricalMarkdown(
  repoRoot: string,
  absPath: string
): boolean {
  const rel = toPosixRel(repoRoot, absPath);
  return (
    rel.startsWith('src/content/posts/') &&
    rel.endsWith('.md') &&
    !rel.includes('/.') // allow hidden segments? none expected
  );
}

/** Definitions contain forbidden-token literals and rule hints — never self-scan. */
const META_AUDIT_SOURCE_FILES = new Set(['src/lib/migration-audit.ts']);

function isMetaAuditDefinitionFile(repoRoot: string, absPath: string): boolean {
  return META_AUDIT_SOURCE_FILES.has(toPosixRel(repoRoot, absPath));
}

function collectFilesRecursive(dir: string): string[] {
  const out: string[] = [];
  const stack = [dir];
  while (stack.length) {
    const cur = stack.pop()!;
    for (const ent of readdirSync(cur, { withFileTypes: true })) {
      const joined = path.join(cur, ent.name);
      if (ent.isDirectory()) {
        stack.push(joined);
      } else if (ent.isFile()) {
        out.push(joined);
      }
    }
  }
  return out;
}

export function collectLiveSourceScanFiles(repoRoot: string): string[] {
  const srcRoot = path.join(repoRoot, 'src');
  if (!existsSync(srcRoot)) {
    return [];
  }

  const files: string[] = [];
  for (const abs of collectFilesRecursive(srcRoot)) {
    if (isExcludedHistoricalMarkdown(repoRoot, abs)) {
      continue;
    }
    if (isMetaAuditDefinitionFile(repoRoot, abs)) {
      continue;
    }
    const ext = path.extname(abs).toLowerCase();
    if (TEXT_EXTENSIONS.has(ext)) {
      files.push(abs);
    }
  }

  for (const name of ROOT_CONFIG_FILES) {
    const abs = path.join(repoRoot, name);
    if (existsSync(abs) && statSync(abs).isFile()) {
      files.push(abs);
    }
  }

  return [...new Set(files)].sort((a, b) => a.localeCompare(b));
}

export function scanForbiddenInFiles(
  repoRoot: string,
  files: string[],
  rules: ForbiddenRule[],
  scopeLabel: string
): MigrationAuditIssue[] {
  const issues: MigrationAuditIssue[] = [];

  for (const abs of files) {
    let content: string;
    try {
      content = readFileSync(abs, 'utf8');
    } catch {
      issues.push({
        code: 'FORBIDDEN_REFERENCE',
        message: `[${scopeLabel}] Cannot read file for legacy scan: ${toPosixRel(repoRoot, abs)}`,
      });
      continue;
    }

    for (const rule of rules) {
      if (rule.pattern.test(content)) {
        issues.push({
          code: 'FORBIDDEN_REFERENCE',
          message: `[${scopeLabel}] ${rule.id}: ${toPosixRel(repoRoot, abs)} — ${rule.hint}`,
        });
      }
    }
  }

  return issues;
}

export function collectDistHtmlFiles(distDir: string): string[] {
  if (!existsSync(distDir)) {
    return [];
  }
  const out: string[] = [];
  const stack = [distDir];
  while (stack.length) {
    const cur = stack.pop()!;
    for (const ent of readdirSync(cur, { withFileTypes: true })) {
      const joined = path.join(cur, ent.name);
      if (ent.isDirectory()) {
        stack.push(joined);
      } else if (ent.isFile() && ent.name.endsWith('.html')) {
        out.push(joined);
      }
    }
  }
  return out.sort((a, b) => a.localeCompare(b));
}

function distIndexHtmlForRoute(repoRoot: string, route: string): string {
  const normalized = route.endsWith('/') ? route.slice(0, -1) : route;
  if (normalized === '' || normalized === '/') {
    return path.join(repoRoot, 'dist', 'index.html');
  }
  const trimmed = normalized.replace(/^\//, '');
  return path.join(repoRoot, 'dist', trimmed, 'index.html');
}

function auditLegacyFilesystem(repoRoot: string): MigrationAuditIssue[] {
  const issues: MigrationAuditIssue[] = [];

  for (const name of LEGACY_FORBIDDEN_FILENAMES) {
    const abs = path.join(repoRoot, name);
    if (existsSync(abs)) {
      issues.push({
        code: 'LEGACY_FILE',
        message: `[legacy] Forbidden file still present at repo root: ${name} (remove Gatsby/Zeit-era config).`,
      });
    }
  }

  const htmlJs = path.join(repoRoot, 'src', 'html.js');
  if (existsSync(htmlJs)) {
    issues.push({
      code: 'LEGACY_FILE',
      message:
        '[legacy] src/html.js must not exist after migrating to Astro BaseLayout (remove AdSense/bootstrap shell).',
    });
  }

  return issues;
}

function auditPackageJson(repoRoot: string): MigrationAuditIssue[] {
  const pkgPath = path.join(repoRoot, 'package.json');
  const issues: MigrationAuditIssue[] = [];
  if (!existsSync(pkgPath)) {
    issues.push({
      code: 'PACKAGE_JSON',
      message: '[deps] package.json missing — cannot audit dependency surface.',
    });
    return issues;
  }

  let pkg: {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
  };
  try {
    pkg = JSON.parse(readFileSync(pkgPath, 'utf8')) as typeof pkg;
  } catch {
    issues.push({
      code: 'PACKAGE_JSON',
      message: '[deps] package.json is not valid JSON.',
    });
    return issues;
  }

  const blocks = [
    ['dependencies', pkg.dependencies ?? {}] as const,
    ['devDependencies', pkg.devDependencies ?? {}] as const,
  ];

  for (const [blockName, block] of blocks) {
    for (const dep of Object.keys(block)) {
      const legacy =
        dep.includes('gatsby') ||
        dep.includes('react-share') ||
        dep.startsWith('@gatsbyjs/');
      if (legacy) {
        issues.push({
          code: 'LEGACY_DEPENDENCY',
          message: `[deps] Ban legacy stack packages (${blockName}): "${dep}"`,
        });
      }
    }
  }

  return issues;
}

function auditRemovedDistSurfaces(repoRoot: string): MigrationAuditIssue[] {
  const issues: MigrationAuditIssue[] = [];
  const thanks = path.join(repoRoot, 'dist', 'thanks', 'index.html');
  const confirm = path.join(repoRoot, 'dist', 'confirm', 'index.html');
  if (existsSync(thanks)) {
    issues.push({
      code: 'REMOVED_ROUTE',
      message:
        '[route] dist/thanks/index.html must not exist (removed newsletter surface).',
    });
  }
  if (existsSync(confirm)) {
    issues.push({
      code: 'REMOVED_ROUTE',
      message:
        '[route] dist/confirm/index.html must not exist (removed confirmation surface).',
    });
  }
  return issues;
}

export function auditExpectedSlugInventory(
  slugs: string[]
): MigrationAuditIssue[] {
  const issues: MigrationAuditIssue[] = [];
  const sortedActual = [...slugs].sort((a, b) => a.localeCompare(b));
  const sortedExpected = [...EXPECTED_BLOG_SLUGS].sort((a, b) =>
    a.localeCompare(b)
  );

  if (sortedActual.length !== sortedExpected.length) {
    issues.push({
      code: 'SLUG_INVENTORY',
      message: `[content] Expected exactly ${EXPECTED_PAIRED_SLUG_COUNT} post slug directories, found ${sortedActual.length}.`,
    });
  }

  const missing = sortedExpected.filter((s) => !sortedActual.includes(s));
  const unexpected = sortedActual.filter((s) => !sortedExpected.includes(s));

  for (const slug of missing) {
    issues.push({
      code: 'SLUG_INVENTORY',
      message: `[content] Missing expected slug directory: ${slug}`,
    });
  }
  for (const slug of unexpected) {
    issues.push({
      code: 'SLUG_INVENTORY',
      message: `[content] Unexpected slug directory not in TechSpec inventory: ${slug}`,
    });
  }

  return issues;
}

export function runMigrationAudit(
  options: RunMigrationAuditOptions
): MigrationAuditResult {
  const { repoRoot, posts: postsOverride, verifyDist } = options;
  const issues: MigrationAuditIssue[] = [];

  issues.push(...auditLegacyFilesystem(repoRoot));
  issues.push(...auditPackageJson(repoRoot));

  const { slugs, entries } =
    postsOverride !== undefined
      ? {
          slugs: [...new Set(postsOverride.map((p) => p.slug))].sort((a, b) =>
            a.localeCompare(b)
          ),
          entries: postsOverride,
        }
      : loadPostEntriesFromDisk(repoRoot);

  if (entries.length !== EXPECTED_POST_ENTRY_COUNT) {
    issues.push({
      code: 'CONTENT_COUNT',
      message: `[content] Expected ${EXPECTED_POST_ENTRY_COUNT} Markdown post entries, found ${entries.length}.`,
    });
  }

  issues.push(...auditExpectedSlugInventory(slugs));

  const unpaired = findUnpairedSlugs(entries);
  if (unpaired.length > 0) {
    for (const slug of unpaired) {
      issues.push({
        code: 'TRANSLATION_PAIR',
        message: `[content] Missing EN/PT-BR pair for slug "${slug}" (both index.md and index.pt-br.md required).`,
      });
    }
  }

  const uniqueSlugs = [...new Set(entries.map((e) => e.slug))];
  const expectedRoutes = buildExpectedBlogRoutes(uniqueSlugs);

  const distDir = path.join(repoRoot, 'dist');
  const shouldVerifyDist =
    verifyDist === true ||
    (verifyDist !== false && existsSync(path.join(distDir, 'index.html')));

  if (shouldVerifyDist) {
    if (!existsSync(path.join(distDir, 'index.html'))) {
      issues.push({
        code: 'ROUTE_DIST',
        message:
          '[route] dist/index.html missing — run `yarn build` before migration audit with dist verification.',
      });
    } else {
      issues.push(...auditRemovedDistSurfaces(repoRoot));

      for (const route of expectedRoutes) {
        const htmlPath = distIndexHtmlForRoute(repoRoot, route);
        if (!existsSync(htmlPath)) {
          issues.push({
            code: 'ROUTE_DIST',
            message: `[route] Missing build output for ${route} — expected ${toPosixRel(repoRoot, htmlPath)}`,
          });
        }
      }
    }

    const htmlFiles = collectDistHtmlFiles(distDir);
    issues.push(
      ...scanForbiddenInFiles(
        repoRoot,
        htmlFiles,
        DIST_HTML_FORBIDDEN_RULES,
        'dist-html'
      )
    );
  }

  const liveFiles = collectLiveSourceScanFiles(repoRoot);
  issues.push(
    ...scanForbiddenInFiles(
      repoRoot,
      liveFiles,
      LIVE_SOURCE_FORBIDDEN_RULES,
      'live-src'
    )
  );

  const deduped = dedupeIssues(issues);
  return {
    ok: deduped.length === 0,
    issues: deduped,
  };
}

function dedupeIssues(issues: MigrationAuditIssue[]): MigrationAuditIssue[] {
  const seen = new Set<string>();
  const out: MigrationAuditIssue[] = [];
  for (const i of issues) {
    const key = `${i.code}:${i.message}`;
    if (!seen.has(key)) {
      seen.add(key);
      out.push(i);
    }
  }
  return out;
}

export function formatMigrationAuditReport(
  result: MigrationAuditResult
): string {
  if (result.ok) {
    return 'Migration audit passed (content, routes, legacy cleanup).';
  }
  const lines = result.issues.map((i) => i.message);
  return [
    `Migration audit failed (${result.issues.length} issue(s)):`,
    ...lines,
  ].join('\n');
}
