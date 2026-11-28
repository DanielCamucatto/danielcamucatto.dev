/**
 * @jest-environment node
 */
import { acessoPermitido } from '../../server/acesso';

const env = { ACCESS_TEAM_DOMAIN: 'https://time.cloudflareaccess.com', ACCESS_AUD: 'aud-1', ADMIN_EMAIL: 'dono@exemplo.com' };
const b64 = (dados: string | ArrayBuffer) =>
  Buffer.from(typeof dados === 'string' ? dados : new Uint8Array(dados)).toString('base64url');
const RSA = { name: 'RSASSA-PKCS1-v1_5', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' };

describe('acesso ao painel', () => {
  let chaves: CryptoKeyPair;
  let buscar: typeof fetch;

  beforeAll(async () => {
    chaves = (await crypto.subtle.generateKey(RSA, true, ['sign', 'verify'])) as CryptoKeyPair;
    const jwk = await crypto.subtle.exportKey('jwk', chaves.publicKey);
    buscar = (async () => new Response(JSON.stringify({ keys: [{ ...jwk, kid: 'k1' }] }))) as typeof fetch;
  });

  async function pedido(mudancas: object = {}, chave = chaves.privateKey) {
    const corpo = { iss: env.ACCESS_TEAM_DOMAIN, aud: ['aud-1'], email: 'dono@exemplo.com', exp: Date.now() / 1000 + 60, ...mudancas };
    const base = `${b64(JSON.stringify({ alg: 'RS256', kid: 'k1' }))}.${b64(JSON.stringify(corpo))}`;
    const assinatura = await crypto.subtle.sign(RSA.name, chave, new TextEncoder().encode(base));
    return new Request('https://exemplo.test/api/admin/depoimentos', {
      headers: { 'Cf-Access-Jwt-Assertion': `${base}.${b64(assinatura)}` },
    });
  }

  it('aceita o dono com token válido', async () => {
    expect(await acessoPermitido(await pedido(), env, buscar)).toBe(true);
  });

  it.each([
    ['outro e-mail', { email: 'outro@exemplo.com' }],
    ['outro aplicativo', { aud: ['aud-2'] }],
    ['outro emissor', { iss: 'https://falso.cloudflareaccess.com' }],
    ['token vencido', { exp: 1 }],
  ])('recusa %s', async (_nome, mudancas) => {
    expect(await acessoPermitido(await pedido(mudancas), env, buscar)).toBe(false);
  });

  it('recusa assinatura de outra chave', async () => {
    const outra = (await crypto.subtle.generateKey(RSA, true, ['sign', 'verify'])) as CryptoKeyPair;
    expect(await acessoPermitido(await pedido({}, outra.privateKey), env, buscar)).toBe(false);
  });

  it('recusa sem token ou sem configuração', async () => {
    expect(await acessoPermitido(new Request('https://exemplo.test/'), env, buscar)).toBe(false);
    expect(await acessoPermitido(await pedido(), {}, buscar)).toBe(false);
  });
});
