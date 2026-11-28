// Só a parte das APIs da Cloudflare (D1 e R2) que o código usa.
export interface Consulta {
  bind(...valores: unknown[]): Consulta;
  first<T>(): Promise<T | null>;
  all<T>(): Promise<{ results: T[] }>;
  run(): Promise<unknown>;
}

export interface Banco {
  prepare(sql: string): Consulta;
}

export interface Arquivos {
  put(chave: string, dados: ArrayBuffer, opcoes?: { httpMetadata?: { contentType: string } }): Promise<unknown>;
  get(chave: string): Promise<{ body: ReadableStream | ArrayBuffer | null; httpMetadata?: { contentType?: string } } | null>;
  delete(chave: string): Promise<unknown>;
}

export interface Ambiente {
  DB?: Banco;
  FOTOS?: Arquivos;
  TURNSTILE_SITE_KEY?: string;
  TURNSTILE_SECRET?: string;
  IP_SALT?: string;
  ACCESS_TEAM_DOMAIN?: string;
  ACCESS_AUD?: string;
  ADMIN_EMAIL?: string;
}
