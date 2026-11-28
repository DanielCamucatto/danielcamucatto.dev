-- Fotos dos depoimentos. São pequenas (poucos KB), então ficam no próprio banco.
CREATE TABLE IF NOT EXISTS fotos (
  chave TEXT PRIMARY KEY,
  tipo TEXT NOT NULL,
  dados BLOB NOT NULL
);
