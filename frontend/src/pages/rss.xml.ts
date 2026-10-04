import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getArtigos } from '../utils/artigos';

export async function GET(context: APIContext) {
  const artigos = await getArtigos();
  return rss({
    title: 'Artigos — Daniel Camuçatto',
    description: 'Artigos técnicos sobre arquitetura de software, backend, frontend e liderança técnica.',
    site: context.site!,
    items: artigos.map((artigo) => ({
      title: artigo.data.title,
      description: artigo.data.description,
      pubDate: artigo.data.pubDate,
      categories: artigo.data.tags,
      link: `/artigos/${artigo.id}/`,
    })),
    customData: '<language>pt-br</language>',
  });
}
