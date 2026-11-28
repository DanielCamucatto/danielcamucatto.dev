import { acessoPermitido } from '../../../server/acesso';
import { json } from '../../../server/depoimentos';
import type { Ambiente } from '../../../server/tipos';

// Todas as rotas de /api/admin passam por aqui
export const onRequest = async ({ request, env, next }: { request: Request; env: Ambiente; next: () => Promise<Response> }) =>
  (await acessoPermitido(request, env)) ? next() : json({ erro: 'acesso' }, 403);
