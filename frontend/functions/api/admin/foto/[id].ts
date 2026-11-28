import { foto } from '../../../../server/depoimentos';
import type { Ambiente } from '../../../../server/tipos';

export const onRequestGet = ({ env, params }: { env: Ambiente; params: { id: string } }) => foto(env, params.id, false);
