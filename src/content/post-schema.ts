import { z } from 'zod';

/**
 * Shared Zod schema for blog post frontmatter (English `index.md` and
 * Portuguese `index.pt-br.md`). Kept in a standalone module so Vitest can
 * validate frontmatter without loading `astro:content`.
 */
export const postFrontmatterSchema = z.object({
  title: z.string(),
  date: z.coerce.date(),
  spoiler: z.string(),
  tags: z.array(z.string()).optional().default([]),
  updateDate: z.coerce.date().optional(),
});

export type PostFrontmatter = z.infer<typeof postFrontmatterSchema>;
