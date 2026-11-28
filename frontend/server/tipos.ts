// Só a parte da API da Cloudflare (D1) que o código usa.
export interface Consulta {
  bind(...valores: unknown[]): Consulta;
  first<T>(): Promise<T | null>;
  all<T>(): Promise<{ results: T[] }>;
  run(): Promise<unknown>;
}

export interface Banco {
  prepare(sql: string): Consulta;
}

export interface Ambiente {
  DB?: Banco;
  TURNSTILE_SITE_KEY?: string;
  TURNSTILE_SECRET?: string;
  IP_SALT?: string;
  ACCESS_TEAM_DOMAIN?: string;
  ACCESS_AUD?: string;
  ADMIN_EMAIL?: string;
}
