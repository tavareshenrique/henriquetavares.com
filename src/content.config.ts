import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { postFrontmatterSchema } from './content/post-schema';

const posts = defineCollection({
  loader: glob({
    base: './src/content/posts',
    pattern: '**/*.{md,mdx}',
    generateId: ({ entry }) => entry.replace(/\\/g, '/'),
  }),
  schema: postFrontmatterSchema,
});

export const collections = { posts };
