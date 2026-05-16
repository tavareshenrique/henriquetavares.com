import { defineCollection } from 'astro:content';
import { postFrontmatterSchema } from './post-schema';

const posts = defineCollection({
  schema: postFrontmatterSchema,
});

export const collections = {
  posts,
};
