/**
 * @jest-environment node
 */
import { readFileSync } from 'fs';
import { join } from 'path';
import { foto, listarPublicos, listarTodos, linkedinValido, moderar, receber, tipoDaImagem } from '../../server/depoimentos';
import type { Ambiente, Banco, Consulta } from '../../server/tipos';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { DatabaseSync } = require('node:sqlite');
const MIGRACOES = ['0001_depoimentos.sql', '0002_fotos.sql']
  .map((nome) => readFileSync(join(__dirname, '../../migrations', nome), 'utf8'))
  .join('\n');
const ORIGEM = 'https://exemplo.test';
const JPEG = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 1, 2, 3]).buffer;

// D1 de mentira sobre SQLite de verdade, para o SQL e as restrições serem testados
function banco(): Banco {
  const db = new DatabaseSync(':memory:');
  db.exec(MIGRACOES);
  const consulta = (sql: string, valores: unknown[] = []): Consulta => ({
    bind: (...novos) => consulta(sql, novos),
    // Como o D1, devolve BLOB em lista de números
    first: async <T>() => {
      const linha = db.prepare(sql).get(...valores) as Record<string, unknown> | undefined;
      if (!linha) return null;
      return Object.fromEntries(
        Object.entries(linha).map(([k, v]) => [k, ArrayBuffer.isView(v) ? Array.from(v as Uint8Array) : v])
      ) as T;
    },
    all: async <T>() => ({ results: db.prepare(sql).all(...valores) as T[] }),
    run: async () => db.prepare(sql).run(...valores),
  });
  return { prepare: (sql) => consulta(sql) };
}

function ambiente() {
  const env: Ambiente = {
    DB: banco(),
    TURNSTILE_SITE_KEY: 'chave-publica',
    TURNSTILE_SECRET: 'segredo-de-teste',
    IP_SALT: 'sal',
  };
  const totalDeFotos = async () => (await env.DB!.prepare('SELECT COUNT(*) AS n FROM fotos').first<{ n: number }>())!.n;
  return { env, totalDeFotos };
}

const rede = (humano = true) =>
  jest.fn(async (url: string | URL | Request) =>
    String(url).includes('siteverify')
      ? new Response(JSON.stringify({ success: humano }))
      : String(url).includes('inexistente')
        ? new Response('', { status: 404 })
        : new Response(JPEG)
  ) as unknown as typeof fetch;

const VALIDO = {
  nome: 'Pessoa Teste', cargo: 'Dev', empresa: 'Empresa X', linkedin: 'https://www.linkedin.com/in/teste',
  email: 'a@exemplo.com', texto: 'Texto de teste', autorizo: 'sim', 'cf-turnstile-response': 'token',
};

function pedido(campos: Record<string, string | Blob> = {}, origem = ORIGEM, ip = '203.0.113.1') {
  const form = new FormData();
  Object.entries({ ...VALIDO, ...campos }).forEach(([k, v]) => form.set(k, v));
  return new Request(`${ORIGEM}/api/depoimentos`, { method: 'POST', body: form, headers: { Origin: origem, 'CF-Connecting-IP': ip } });
}

const acao = (id: string, nome: string, origem = ORIGEM) =>
  new Request(`${ORIGEM}/api/admin/depoimentos`, {
    method: 'POST', headers: { Origin: origem, 'Content-Type': 'application/json' }, body: JSON.stringify({ id, acao: nome }),
  });

const todos = async (env: Ambiente) =>
  ((await (await listarTodos(env)).json()) as { lista: { id: string; status: string; temFoto: boolean }[] }).lista;
const publicos = async (env: Ambiente) => (await listarPublicos(env)).json() as Promise<{ ativo: boolean; lista: object[] }>;

describe('depoimentos', () => {
  it('fica desligado enquanto faltar configuração', async () => {
    expect(await publicos({})).toEqual({ ativo: false });
    expect((await receber(pedido(), {}, rede())).status).toBe(503);
  });

  it('recebe como pendente e só publica com 3 aprovados, sem expor o e-mail', async () => {
    const { env } = ambiente();
    for (let i = 0; i < 3; i++) expect((await receber(pedido({}, ORIGEM, `203.0.113.${i}`), env, rede())).status).toBe(201);
    const itens = await todos(env);
    expect(itens.map((i) => i.status)).toEqual(['pendente', 'pendente', 'pendente']);

    await moderar(acao(itens[0].id, 'aprovar'), env);
    await moderar(acao(itens[1].id, 'aprovar'), env);
    expect((await publicos(env)).lista).toHaveLength(0);

    await moderar(acao(itens[2].id, 'aprovar'), env);
    const { lista } = await publicos(env);
    expect(lista).toHaveLength(3);
    expect(JSON.stringify(lista)).not.toContain('a@exemplo.com');
  });

  it.each([
    ['outra origem', {}, 'https://outro.test', 403],
    ['link que não é do LinkedIn', { linkedin: 'https://linkedin.com.evil.test/x' }, ORIGEM, 400],
    ['sem autorização', { autorizo: '' }, ORIGEM, 400],
    ['texto longo demais', { texto: 'a'.repeat(501) }, ORIGEM, 400],
    ['usuário do GitHub inexistente', { github: 'inexistente' }, ORIGEM, 400],
    ['foto grande demais', { foto: new Blob([new Uint8Array(301 * 1024)], { type: 'image/jpeg' }) }, ORIGEM, 400],
    ['arquivo que não é imagem', { foto: new Blob(['<svg onload=alert(1)>'], { type: 'image/jpeg' }) }, ORIGEM, 400],
  ])('recusa %s', async (_nome, campos, origem, status) => {
    const { env, totalDeFotos } = ambiente();
    expect((await receber(pedido(campos as Record<string, string | Blob>, origem), env, rede())).status).toBe(status);
    expect(await todos(env)).toHaveLength(0);
    expect(await totalDeFotos()).toBe(0);
  });

  it('recusa quem não passa na verificação e ignora robô que preenche a armadilha', async () => {
    const { env } = ambiente();
    expect((await receber(pedido(), env, rede(false))).status).toBe(403);
    expect((await receber(pedido({ site: 'http://spam.test' }), env, rede())).status).toBe(200);
    expect(await todos(env)).toHaveLength(0);
  });

  it('limita envios por endereço e não grava o IP', async () => {
    const { env } = ambiente();
    for (let i = 0; i < 3; i++) await receber(pedido(), env, rede());
    expect((await receber(pedido(), env, rede())).status).toBe(429);
    const linha = await env.DB!.prepare('SELECT ip_hash FROM depoimentos LIMIT 1').first<{ ip_hash: string }>();
    expect(linha!.ip_hash).toMatch(/^[0-9a-f]{64}$/);
  });

  it('só mostra a foto ao público depois de aprovada e a remove ao apagar', async () => {
    const { env, totalDeFotos } = ambiente();
    await receber(pedido({ github: '@octocat' }), env, rede());
    const [{ id, temFoto }] = await todos(env);
    expect(temFoto).toBe(true);
    expect((await foto(env, id, true)).status).toBe(404);
    expect((await foto(env, id, false)).status).toBe(200);

    await moderar(acao(id, 'aprovar'), env);
    const publica = await foto(env, id, true);
    expect(publica.headers.get('Content-Type')).toBe('image/jpeg');
    expect(new Uint8Array(await publica.arrayBuffer())).toEqual(new Uint8Array(JPEG));

    await moderar(acao(id, 'apagar'), env);
    expect(await totalDeFotos()).toBe(0);
    expect(await todos(env)).toHaveLength(0);
  });

  it('não aceita moderação vinda de outro site', async () => {
    const { env } = ambiente();
    await receber(pedido(), env, rede());
    const [{ id }] = await todos(env);
    expect((await moderar(acao(id, 'aprovar', 'https://outro.test'), env)).status).toBe(403);
    expect((await todos(env))[0].status).toBe('pendente');
  });

  it('valida imagem pelo conteúdo e o domínio do LinkedIn', () => {
    expect(tipoDaImagem(JPEG)).toBe('image/jpeg');
    expect(tipoDaImagem(new TextEncoder().encode('<html>').buffer as ArrayBuffer)).toBeNull();
    expect(linkedinValido('https://br.linkedin.com/in/x')).toBe(true);
    expect(linkedinValido('http://linkedin.com/in/x')).toBe(false);
    expect(linkedinValido('javascript:alert(1)')).toBe(false);
  });
});
