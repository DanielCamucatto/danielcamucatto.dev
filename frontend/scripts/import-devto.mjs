// Importa os artigos publicados no dev.to para src/content/artigos.
// Uso: node scripts/import-devto.mjs [--force]
// Sem --force, artigos que já existem localmente não são sobrescritos
// (assim edições feitas aqui não se perdem).
// A capa é baixada para src/assets/capas, para passar pelo pipeline de imagens
// do Astro (WebP em vários tamanhos) em vez de depender do CDN do dev.to.
import { mkdir, writeFile, access } from 'node:fs/promises';
import path from 'node:path';

const USERNAME = 'danielcamucatto';
const OUT_DIR = path.resolve(import.meta.dirname, '../src/content/artigos');
const COVERS_DIR = path.resolve(import.meta.dirname, '../src/assets/capas');
const force = process.argv.includes('--force');

const api = async (url) => {
  for (let attempt = 0; attempt < 5; attempt++) {
    const res = await fetch(url);
    if (res.status === 429) {
      await new Promise((r) => setTimeout(r, 2000 * (attempt + 1)));
      continue;
    }
    if (!res.ok) throw new Error(`${res.status} ${url}`);
    return res.json();
  }
  throw new Error(`rate limit: ${url}`);
};

// dev.to adiciona um sufixo aleatório ao slug (ex.: "-4khk"); removemos.
const cleanSlug = (slug) => slug.replace(/-[a-z0-9]{3,4}$/, '');

// Converte liquid tags do dev.to em Markdown/HTML comum.
const convertLiquid = (md) =>
  md
    .replace(/\{%\s*(?:youtube)\s+([\w-]+)\s*%\}/g, (_, id) =>
      `<iframe width="100%" style="aspect-ratio:16/9" src="https://www.youtube.com/embed/${id}" title="YouTube" loading="lazy" allowfullscreen></iframe>`)
    .replace(/\{%\s*(?:embed|link|github|codepen|codesandbox|stackblitz)\s+(\S+?)\s*%\}/g, (_, url) =>
      `[${url}](${url.startsWith('http') ? url : `https://github.com/${url}`})`)
    .replace(/\{%\s*(?:raw|endraw)\s*%\}/g, '');

const yaml = (s) => JSON.stringify(s ?? '');

const EXT_BY_TYPE = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif' };

// Baixa a capa para src/assets/capas e devolve o caminho relativo ao arquivo do artigo.
// O CDN do dev.to recorta na URL (width/height); pedimos 1,6x o tamanho padrão em JPG
// para telas retina. Se algo falhar, devolve null e o artigo mantém a URL remota.
const downloadCover = async (slug, coverUrl) => {
  try {
    const url = coverUrl
      .replace('width=1000,height=420', 'width=1600,height=672')
      .replace('format=auto', 'format=jpg');
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${res.status}`);
    const ext = EXT_BY_TYPE[res.headers.get('content-type')?.split(';')[0]];
    if (!ext) throw new Error(`tipo inesperado: ${res.headers.get('content-type')}`);
    await mkdir(COVERS_DIR, { recursive: true });
    await writeFile(path.join(COVERS_DIR, `${slug}.${ext}`), Buffer.from(await res.arrayBuffer()));
    return `../../assets/capas/${slug}.${ext}`;
  } catch (err) {
    console.warn(`⚠ capa de ${slug} não baixada (${err.message}); mantendo URL remota`);
    return null;
  }
};

const exists = (p) => access(p).then(() => true, () => false);

await mkdir(OUT_DIR, { recursive: true });

const list = await api(`https://dev.to/api/articles?username=${USERNAME}&per_page=1000`);
let written = 0;

for (const item of list) {
  const slug = cleanSlug(item.slug);
  const file = path.join(OUT_DIR, `${slug}.md`);
  if (!force && (await exists(file))) continue;

  const full = await api(`https://dev.to/api/articles/${item.id}`);
  const cover = full.cover_image ? ((await downloadCover(slug, full.cover_image)) ?? full.cover_image) : null;
  const frontmatter = [
    '---',
    `title: ${yaml(full.title)}`,
    `description: ${yaml(full.description)}`,
    `pubDate: ${full.published_at.slice(0, 10)}`,
    full.edited_at ? `updatedDate: ${full.edited_at.slice(0, 10)}` : null,
    `tags: ${JSON.stringify(full.tags)}`,
    cover ? `cover: ${yaml(cover)}` : null,
    `devtoUrl: ${yaml(full.url)}`,
    '---',
  ].filter(Boolean).join('\n');

  await writeFile(file, `${frontmatter}\n\n${convertLiquid(full.body_markdown).trim()}\n`);
  written++;
  console.log(`✔ ${slug}`);
}

console.log(`\n${written} artigo(s) importado(s), ${list.length - written} já existiam.`);
