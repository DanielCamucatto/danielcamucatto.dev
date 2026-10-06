import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const artigos = defineCollection({
  loader: glob({ base: './src/content/artigos', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    // URL externa ou caminho em public/ (ex.: /artigos/capas/x.webp)
    cover: z.union([z.string().url(), z.string().startsWith('/')]).optional(),
    // Link do artigo original no dev.to, quando foi importado de lá
    devtoUrl: z.string().url().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { artigos };
