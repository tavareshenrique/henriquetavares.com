import { execSync } from 'node:child_process';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const repoRoot = path.resolve(__dirname, '..', '..');

describe('lint and format CLI', () => {
  it('runs ESLint successfully', () => {
    expect(() =>
      execSync('pnpm lint', {
        cwd: repoRoot,
        stdio: 'pipe',
        encoding: 'utf8',
      })
    ).not.toThrow();
  }, 30_000);

  it('runs Prettier check successfully', () => {
    expect(() =>
      execSync('pnpm format:check', {
        cwd: repoRoot,
        stdio: 'pipe',
        encoding: 'utf8',
      })
    ).not.toThrow();
  });
});
