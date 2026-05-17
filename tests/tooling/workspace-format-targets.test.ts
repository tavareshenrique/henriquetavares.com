import { readFileSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  eslintLintFileGlobs,
  prettierWriteGlob,
  requiredPrettierIgnoreTokens,
} from '../../tooling/workspace-format-targets.mjs';

const repoRoot = path.resolve(__dirname, '..', '..');
const packageJson = JSON.parse(
  readFileSync(path.join(repoRoot, 'package.json'), 'utf8')
) as { 'lint-staged': Record<string, string[]> };

describe('workspace-format-targets', () => {
  it('targets Astro files for ESLint', () => {
    expect(eslintLintFileGlobs.some((entry) => entry.includes('astro'))).toBe(
      true
    );
  });

  it('targets TypeScript helper files for ESLint', () => {
    expect(eslintLintFileGlobs.some((entry) => entry.includes('ts'))).toBe(
      true
    );
  });
});

describe('prettier coverage', () => {
  it('includes astro config, tailwind config, eslint, and vitest config files', () => {
    expect(prettierWriteGlob).toContain('astro.config.');
    expect(prettierWriteGlob).toContain('tailwind.config.');
    expect(prettierWriteGlob).toContain('eslint.config.mjs');
    expect(prettierWriteGlob).toContain('vitest.config.ts');
  });

  it('includes Astro, TypeScript, and style extensions for src/', () => {
    expect(prettierWriteGlob).toContain('src/**/*.{astro,ts,tsx,css,scss}');
  });

  it('documents Markdown ignore policy via .prettierignore', async () => {
    const ignoreFile = await readFile(
      path.join(repoRoot, '.prettierignore'),
      'utf8'
    );
    for (const token of requiredPrettierIgnoreTokens) {
      expect(ignoreFile).toContain(token);
    }
  });
});

describe('lint-staged (staged files only)', () => {
  it('does not run repo-wide format scripts; uses per-file commands', () => {
    const patterns = Object.keys(packageJson['lint-staged']);
    for (const pattern of patterns) {
      expect(pattern).not.toBe('{gatsby-*.js,src/**/*.{js,jsx,json,css}}');
    }

    const commands = Object.values(packageJson['lint-staged']).flat();
    for (const command of commands) {
      expect(String(command)).not.toMatch(/^yarn format$/);
      expect(String(command)).not.toMatch(/^npm run format$/);
      expect(String(command)).not.toContain('prettier --write .');
    }
  });
});
