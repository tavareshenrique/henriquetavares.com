import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const repoRoot = path.resolve(__dirname, '..', '..');

function packageJson(): {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
} {
  const raw = readFileSync(path.join(repoRoot, 'package.json'), 'utf8');
  return JSON.parse(raw) as {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
  };
}

function dependencyNames(pkg: ReturnType<typeof packageJson>): string[] {
  return [
    ...Object.keys(pkg.dependencies ?? {}),
    ...Object.keys(pkg.devDependencies ?? {}),
  ];
}

describe('Task 09: legacy Gatsby runtime stripped from manifests and tree', () => {
  it('never lists react-share in npm dependencies', () => {
    expect(dependencyNames(packageJson())).not.toContain('react-share');
  });

  it('never lists runtime Gatsby packages', () => {
    const offenders = dependencyNames(packageJson()).filter((n) =>
      /^(@gatsby|gatsby\b)/i.test(n)
    );
    expect(offenders).toEqual([]);
  });

  it('keeps production dependencies minimal — only analytics runtime', () => {
    expect(packageJson().dependencies ?? {}).toEqual({
      '@vercel/analytics': expect.any(String),
      '@vercel/speed-insights': expect.any(String),
    });
  });

  it('still owns migrated Markdown under src/content/posts', () => {
    expect(existsSync(path.join(repoRoot, 'src/content/posts'))).toBe(true);
    expect(existsSync(path.join(repoRoot, 'src/content/config.ts'))).toBe(true);
  });

  it('does not keep Astro routes for /thanks or /confirm', () => {
    expect(existsSync(path.join(repoRoot, 'src/pages/thanks'))).toBe(false);
    expect(existsSync(path.join(repoRoot, 'src/pages/thanks.astro'))).toBe(
      false
    );
    expect(existsSync(path.join(repoRoot, 'src/pages/confirm'))).toBe(false);
    expect(existsSync(path.join(repoRoot, 'src/pages/confirm.astro'))).toBe(
      false
    );
  });
});
