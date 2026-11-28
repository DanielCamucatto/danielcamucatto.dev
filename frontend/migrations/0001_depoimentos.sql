-- Depoimentos enviados pelo site. Só os aprovados aparecem na página.
CREATE TABLE IF NOT EXISTS depoimentos (
  id TEXT PRIMARY KEY,
  nome TEXT NOT NULL,
  cargo TEXT NOT NULL DEFAULT '',
  empresa TEXT NOT NULL,
  linkedin TEXT NOT NULL,
  email TEXT NOT NULL,
  texto TEXT NOT NULL,
  github TEXT NOT NULL DEFAULT '',
  foto TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'aprovado')),
  ip_hash TEXT NOT NULL,
  criado_em INTEGER NOT NULL,
  aprovado_em INTEGER
);
CREATE INDEX IF NOT EXISTS depoimentos_status ON depoimentos (status, aprovado_em);
CREATE INDEX IF NOT EXISTS depoimentos_ip ON depoimentos (ip_hash, criado_em);
