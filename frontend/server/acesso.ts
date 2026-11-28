// Confere o token que o Cloudflare Access coloca em cada requisição autenticada.
// Vale mesmo que a requisição chegue por um endereço sem Access (ex.: *.pages.dev).
import type { Ambiente } from './tipos';

const deBase64Url = (texto: string) =>
  Uint8Array.from(atob(texto.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0));

const lerParte = (texto: string) => JSON.parse(new TextDecoder().decode(deBase64Url(texto)));

export async function acessoPermitido(request: Request, env: Ambiente, buscar: typeof fetch = fetch): Promise<boolean> {
  const { ACCESS_TEAM_DOMAIN: dominio, ACCESS_AUD: aud, ADMIN_EMAIL: email } = env;
  const token = request.headers.get('Cf-Access-Jwt-Assertion');
  // Sem configuração completa, ninguém entra
  if (!dominio || !aud || !email || !token) return false;
  try {
    const [cabecalho, conteudo, assinatura] = token.split('.');
    const { alg, kid } = lerParte(cabecalho);
    if (alg !== 'RS256') return false;
    const emissor = dominio.replace(/\/$/, '');
    const { keys } = (await (await buscar(`${emissor}/cdn-cgi/access/certs`)).json()) as { keys: (JsonWebKey & { kid: string })[] };
    const jwk = keys.find((k) => k.kid === kid);
    if (!jwk) return false;
    const chave = await crypto.subtle.importKey('jwk', jwk, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']);
    const assinado = await crypto.subtle.verify(
      'RSASSA-PKCS1-v1_5', chave, deBase64Url(assinatura), new TextEncoder().encode(`${cabecalho}.${conteudo}`)
    );
    if (!assinado) return false;
    const dados = lerParte(conteudo) as { iss?: string; aud?: string | string[]; exp?: number; nbf?: number; email?: string };
    const agora = Date.now() / 1000;
    const publicos = Array.isArray(dados.aud) ? dados.aud : [dados.aud];
    return (
      dados.iss === emissor &&
      publicos.includes(aud) &&
      typeof dados.exp === 'number' && dados.exp > agora &&
      (dados.nbf === undefined || dados.nbf <= agora + 60) &&
      dados.email?.toLowerCase() === email.toLowerCase()
    );
  } catch {
    return false;
  }
}
