import { describe, expect, it } from 'vitest';
import { formatBlogDate } from '../../src/lib/blog-display';

describe('blog-display helpers (unit)', () => {
  it('formats dates in Portuguese and English locales', () => {
    const d = new Date(Date.UTC(2019, 7, 15, 12, 0, 0));
    expect(formatBlogDate(d, 'pt-br')).toMatch(/15 de agosto de 2019/);
    expect(formatBlogDate(d, 'en')).toMatch(/August 15, 2019/);
  });
});
