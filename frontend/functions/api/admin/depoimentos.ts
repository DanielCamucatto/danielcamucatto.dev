import { listarTodos, moderar } from '../../../server/depoimentos';
import type { Ambiente } from '../../../server/tipos';

export const onRequestGet = ({ env }: { env: Ambiente }) => listarTodos(env);
export const onRequestPost = ({ request, env }: { request: Request; env: Ambiente }) => moderar(request, env);
