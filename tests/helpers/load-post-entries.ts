import path from 'node:path';
import { EXPECTED_BLOG_SLUGS } from '../../src/lib/expected-blog-slugs';
import { loadPostEntriesFromDisk as loadPostEntriesFromRepo } from '../../src/lib/post-disk-inventory';

const repoRoot = path.resolve(__dirname, '..', '..');

export const EXPECTED_SLUGS = EXPECTED_BLOG_SLUGS;

export function loadPostEntriesFromDisk() {
  return loadPostEntriesFromRepo(repoRoot);
}
