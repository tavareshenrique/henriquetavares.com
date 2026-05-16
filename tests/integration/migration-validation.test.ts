import { execSync } from 'node:child_process';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  formatMigrationAuditReport,
  runMigrationAudit,
} from '../../src/lib/migration-audit';

const repoRoot = path.resolve(__dirname, '..', '..');

describe('migration validation pipeline (integration)', () => {
  it('runs lint, build, and migration audit; audit passes on migrated site', () => {
    execSync('yarn validate', {
      cwd: repoRoot,
      stdio: 'pipe',
      encoding: 'utf8',
      env: { ...process.env, NODE_ENV: 'test' },
    });

    const result = runMigrationAudit({ repoRoot });
    expect(result.ok).toBe(true);
  }, 180_000);

  it('formats actionable validation output for forbidden references', () => {
    const preview = formatMigrationAuditReport({
      ok: false,
      issues: [
        {
          code: 'FORBIDDEN_REFERENCE',
          message:
            '[live-src] react-share: src/pages/example.astro — Remove react-share; use static outbound share URLs (ADR-005).',
        },
      ],
    });
    expect(preview).toContain('react-share');
    expect(preview).toContain('src/pages/example.astro');
    expect(preview).toContain('Migration audit failed');
  });
});
