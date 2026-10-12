import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const artigos = defineCollection({
  loader: glob({ base: './src/content/artigos', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    // URL externa (capas importadas do dev.to) ou caminho relativo para src/assets/capas,
    // que passa pelo pipeline de imagens do Astro (ex.: ../../assets/capas/x.jpg)
    cover: z.union([z.string().url(), image()]).optional(),
    // Link do artigo original no dev.to, quando foi importado de lá
    devtoUrl: z.string().url().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { artigos };
