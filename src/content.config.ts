import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    locale: z.enum(['en', 'tr']),
    // Drafts are excluded from listing pages, post routes, and the RSS
    // feed — flip to false to publish. See kb/project/content-inventory.md.
    draft: z.boolean().default(true),
  }),
});

export const collections = { blog };
