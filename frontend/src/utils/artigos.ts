import { getCollection, type CollectionEntry } from 'astro:content';

export type Artigo = CollectionEntry<'artigos'>;

// Rascunhos aparecem no `astro dev`, mas ficam fora do build de produção.
export async function getArtigos(): Promise<Artigo[]> {
  const artigos = await getCollection('artigos', ({ data }) => import.meta.env.DEV || !data.draft);
  return artigos.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' });
}

// Estimativa simples: ~200 palavras por minuto.
export function readingTime(body: string | undefined): number {
  const words = (body ?? '').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
