import { listarPublicos, receber } from '../../../server/depoimentos';
import type { Ambiente } from '../../../server/tipos';

export const onRequestGet = ({ env }: { env: Ambiente }) => listarPublicos(env);
export const onRequestPost = ({ request, env }: { request: Request; env: Ambiente }) => receber(request, env);
