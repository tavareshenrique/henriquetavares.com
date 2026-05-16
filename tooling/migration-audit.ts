import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  formatMigrationAuditReport,
  runMigrationAudit,
} from '../src/lib/migration-audit.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');

const noDist = process.argv.includes('--no-dist');

const result = runMigrationAudit({
  repoRoot,
  verifyDist: noDist ? false : undefined,
});

console.log(formatMigrationAuditReport(result));
process.exit(result.ok ? 0 : 1);
