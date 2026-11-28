import type { Banco } from './tipos';

// Guarda e lê as fotos na tabela `fotos` do D1
export const fotos = (banco: Banco) => ({
  guardar: (chave: string, tipo: string, dados: ArrayBuffer) =>
    banco.prepare('INSERT INTO fotos (chave, tipo, dados) VALUES (?, ?, ?)').bind(chave, tipo, new Uint8Array(dados)).run(),

  async ler(chave: string): Promise<{ tipo: string; dados: Uint8Array<ArrayBuffer> } | null> {
    const linha = await banco.prepare('SELECT tipo, dados FROM fotos WHERE chave = ?').bind(chave)
      .first<{ tipo: string; dados: ArrayLike<number> }>();
    // O D1 devolve BLOB como lista de números
    return linha ? { tipo: linha.tipo, dados: Uint8Array.from(linha.dados) } : null;
  },

  apagar: (chave: string) => banco.prepare('DELETE FROM fotos WHERE chave = ?').bind(chave).run(),
});
