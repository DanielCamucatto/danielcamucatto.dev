import { fotos } from './fotos';
import type { Ambiente, Banco } from './tipos';

// A seção só aparece na página com pelo menos esta quantidade de aprovados
export const MINIMO_PARA_PUBLICAR = 3;
const ENVIOS_POR_HORA = 3;
const MAXIMO_PENDENTES = 50;
// Vale para a foto enviada e para a copiada do GitHub: ela é gravada no banco
const FOTO_MAX = 300 * 1024;
const USUARIO_GITHUB = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;

type Pronto = Ambiente & Required<Pick<Ambiente, 'DB' | 'TURNSTILE_SITE_KEY' | 'TURNSTILE_SECRET' | 'IP_SALT'>>;

// Sem tudo configurado, o recurso fica desligado: a página nem mostra a seção
export const configurado = (env: Ambiente): env is Pronto =>
  Boolean(env.DB && env.TURNSTILE_SITE_KEY && env.TURNSTILE_SECRET && env.IP_SALT);

export const json = (corpo: unknown, status = 200) =>
  new Response(JSON.stringify(corpo), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' },
  });

const erro = (codigo: string, status = 400) => json({ erro: codigo }, status);

export const mesmaOrigem = (request: Request) => request.headers.get('Origin') === new URL(request.url).origin;

// Confere o conteúdo do arquivo; o tipo declarado pelo navegador não é confiável
export function tipoDaImagem(dados: ArrayBuffer): string | null {
  const b = new Uint8Array(dados.slice(0, 12));
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return 'image/jpeg';
  if ([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a].every((v, i) => b[i] === v)) return 'image/png';
  const ascii = String.fromCharCode(...b);
  if (ascii.startsWith('RIFF') && ascii.slice(8) === 'WEBP') return 'image/webp';
  return null;
}

export function linkedinValido(valor: string): boolean {
  try {
    const url = new URL(valor);
    return url.protocol === 'https:' && !url.username && !url.password && /(^|\.)linkedin\.com$/.test(url.hostname);
  } catch {
    return false;
  }
}

async function hashDoIp(ip: string, sal: string): Promise<string> {
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${sal}:${ip}`));
  return [...new Uint8Array(bytes)].map((v) => v.toString(16).padStart(2, '0')).join('');
}

async function turnstileOk(token: string, segredo: string, ip: string, buscar: typeof fetch): Promise<boolean> {
  if (!token) return false;
  const corpo = new URLSearchParams({ secret: segredo, response: token, remoteip: ip });
  try {
    const resposta = await buscar('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: corpo });
    return ((await resposta.json()) as { success?: boolean }).success === true;
  } catch {
    return false;
  }
}

interface Linha {
  id: string;
  nome: string;
  cargo: string;
  empresa: string;
  linkedin: string;
  texto: string;
  foto: string;
}

export async function listarPublicos(env: Ambiente): Promise<Response> {
  if (!configurado(env)) return json({ ativo: false });
  const { results } = await env.DB.prepare(
    "SELECT id, nome, cargo, empresa, linkedin, texto, foto FROM depoimentos WHERE status = 'aprovado' ORDER BY aprovado_em DESC LIMIT 30"
  ).all<Linha>();
  const lista = results.length < MINIMO_PARA_PUBLICAR
    ? []
    : results.map(({ foto, ...resto }) => ({ ...resto, temFoto: Boolean(foto) }));
  return json({ ativo: true, chaveTurnstile: env.TURNSTILE_SITE_KEY, lista });
}

export async function receber(request: Request, env: Ambiente, buscar: typeof fetch = fetch): Promise<Response> {
  if (!configurado(env)) return erro('indisponivel', 503);
  if (!mesmaOrigem(request)) return erro('origem', 403);
  if (Number(request.headers.get('Content-Length') ?? 0) > 600 * 1024) return erro('grande', 413);

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return erro('formato');
  }
  const campo = (nome: string) => String(form.get(nome) ?? '').trim();

  // Campo escondido: pessoas não preenchem, robôs preenchem
  if (campo('site')) return json({ ok: true });

  const ip = request.headers.get('CF-Connecting-IP') ?? '';
  if (!(await turnstileOk(campo('cf-turnstile-response'), env.TURNSTILE_SECRET, ip, buscar))) return erro('verificacao', 403);

  const d = {
    nome: campo('nome'), cargo: campo('cargo'), empresa: campo('empresa'),
    linkedin: campo('linkedin'), email: campo('email'), texto: campo('texto'),
    github: campo('github').replace(/^@/, ''),
  };
  const dentro = (v: string, max: number, min = 1) => v.length >= min && v.length <= max;
  if (!dentro(d.nome, 80) || !dentro(d.cargo, 80, 0) || !dentro(d.empresa, 80) || !dentro(d.texto, 500)) return erro('campos');
  if (!dentro(d.email, 120) || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(d.email)) return erro('email');
  if (!dentro(d.linkedin, 200) || !linkedinValido(d.linkedin)) return erro('linkedin');
  if (d.github && !USUARIO_GITHUB.test(d.github)) return erro('github');
  if (campo('autorizo') !== 'sim') return erro('autorizacao');

  const ipHash = await hashDoIp(ip, env.IP_SALT);
  const agora = Date.now();
  const recentes = await env.DB.prepare('SELECT COUNT(*) AS n FROM depoimentos WHERE ip_hash = ? AND criado_em > ?')
    .bind(ipHash, agora - 3_600_000).first<{ n: number }>();
  if ((recentes?.n ?? 0) >= ENVIOS_POR_HORA) return erro('limite', 429);
  const pendentes = await env.DB.prepare("SELECT COUNT(*) AS n FROM depoimentos WHERE status = 'pendente'").first<{ n: number }>();
  if ((pendentes?.n ?? 0) >= MAXIMO_PENDENTES) return erro('limite', 429);

  // A foto enviada tem prioridade; sem ela, copia a do GitHub informado
  const arquivo = form.get('foto');
  let dados: ArrayBuffer | null = null;
  if (arquivo && typeof arquivo !== 'string' && arquivo.size > 0) {
    if (arquivo.size > FOTO_MAX) return erro('foto');
    dados = await arquivo.arrayBuffer();
  } else if (d.github) {
    try {
      const resposta = await buscar(`https://github.com/${d.github}.png?size=256`);
      if (!resposta.ok) return erro('github');
      dados = await resposta.arrayBuffer();
    } catch {
      return erro('github');
    }
    if (dados.byteLength > FOTO_MAX) return erro('foto');
  }

  const id = crypto.randomUUID();
  let foto = '';
  if (dados) {
    const tipo = tipoDaImagem(dados);
    if (!tipo) return erro('foto');
    foto = `depoimentos/${id}`;
    await fotos(env.DB).guardar(foto, tipo, dados);
  }

  await env.DB.prepare(
    `INSERT INTO depoimentos (id, nome, cargo, empresa, linkedin, email, texto, github, foto, ip_hash, criado_em)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(id, d.nome, d.cargo, d.empresa, d.linkedin, d.email, d.texto, d.github, foto, ipHash, agora).run();

  return json({ ok: true }, 201);
}

// Sem somenteAprovados (painel), mostra também fotos pendentes
export async function foto(env: Ambiente, id: string, somenteAprovados: boolean): Promise<Response> {
  const ausente = new Response('Não encontrado', { status: 404 });
  if (!env.DB) return ausente;
  const filtro = somenteAprovados ? " AND status = 'aprovado'" : '';
  const linha = await env.DB.prepare(`SELECT foto FROM depoimentos WHERE id = ?${filtro}`).bind(id).first<{ foto: string }>();
  if (!linha?.foto) return ausente;
  const objeto = await fotos(env.DB).ler(linha.foto);
  if (!objeto) return ausente;
  return new Response(objeto.dados, {
    headers: {
      'Content-Type': objeto.tipo,
      // Cache curto, para uma retirada valer logo
      'Cache-Control': somenteAprovados ? 'public, max-age=300' : 'private, no-store',
      'X-Content-Type-Options': 'nosniff',
      'Content-Security-Policy': "default-src 'none'",
    },
  });
}

async function apagar(banco: Banco, id: string): Promise<void> {
  const linha = await banco.prepare('SELECT foto FROM depoimentos WHERE id = ?').bind(id).first<{ foto: string }>();
  if (linha?.foto) await fotos(banco).apagar(linha.foto);
  await banco.prepare('DELETE FROM depoimentos WHERE id = ?').bind(id).run();
}

export async function listarTodos(env: Ambiente): Promise<Response> {
  if (!env.DB) return erro('indisponivel', 503);
  const { results } = await env.DB.prepare(
    `SELECT id, nome, cargo, empresa, linkedin, email, texto, github, foto, status, criado_em
     FROM depoimentos ORDER BY status DESC, criado_em DESC LIMIT 200`
  ).all<Linha & { status: string }>();
  return json({ lista: results.map(({ foto: chave, ...resto }) => ({ ...resto, temFoto: Boolean(chave) })) });
}

export async function moderar(request: Request, env: Ambiente): Promise<Response> {
  if (!env.DB) return erro('indisponivel', 503);
  // Origem própria e JSON: outro site não consegue disparar a ação usando o seu login
  if (!mesmaOrigem(request) || !request.headers.get('Content-Type')?.startsWith('application/json')) return erro('origem', 403);
  const corpo = (await request.json().catch(() => null)) as { id?: unknown; acao?: unknown } | null;
  if (typeof corpo?.id !== 'string') return erro('campos');

  if (corpo.acao === 'aprovar') {
    await env.DB.prepare("UPDATE depoimentos SET status = 'aprovado', aprovado_em = ? WHERE id = ?").bind(Date.now(), corpo.id).run();
  } else if (corpo.acao === 'retirar') {
    await env.DB.prepare("UPDATE depoimentos SET status = 'pendente', aprovado_em = NULL WHERE id = ?").bind(corpo.id).run();
  } else if (corpo.acao === 'apagar') {
    await apagar(env.DB, corpo.id);
  } else {
    return erro('campos');
  }
  return json({ ok: true });
}
