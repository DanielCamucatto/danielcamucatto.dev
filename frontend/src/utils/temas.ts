// Temas da lista de artigos, deduzidos das tags e do slug. Um artigo pode ter vários.
export const TEMAS: { nome: string; padrao: RegExp }[] = [
  { nome: 'IA', padrao: /\b(ia|ai|llm|claude\w*|mcp|rag)\b/ },
  { nome: 'Segurança', padrao: /segur|security|rate.?limit|idempot/ },
  { nome: 'Backend e dados', padrao: /node|php|python|redis|rabbit|backend|\bapi\b|trino|dados|database|performance/ },
  { nome: 'Frontend', padrao: /angular|react|next|frontend|webperf|css/ },
  { nome: 'Arquitetura', padrao: /arquitet|architecture|design.?pattern|solid|monolito|\bc4\b|hexagonal/ },
  { nome: 'Carreira', padrao: /carreira|lideran|career|agil|code.?review|produtividade/ },
];

export function temasDe(slug: string, tags: string[]): string[] {
  const texto = `${tags.join(' ')} ${slug.replace(/-/g, ' ')}`.toLowerCase();
  return TEMAS.filter(({ padrao }) => padrao.test(texto)).map(({ nome }) => nome);
}

interface Relacionavel {
  id: string;
  tags: string[];
}

// Os indicados no frontmatter vêm primeiro; o resto é completado por tags e temas em comum.
// A entrada já vem ordenada do mais novo para o mais antigo, o que desempata.
export function relacionados<T extends Relacionavel>(atual: T, todos: T[], indicados: string[] = [], limite = 3): T[] {
  const outros = todos.filter((item) => item.id !== atual.id);
  const escolhidos = indicados
    .map((id) => outros.find((item) => item.id === id))
    .filter((item): item is T => Boolean(item));
  const temas = temasDe(atual.id, atual.tags);
  const pontos = (item: T) =>
    item.tags.filter((tag) => atual.tags.includes(tag)).length * 2 +
    temasDe(item.id, item.tags).filter((tema) => temas.includes(tema)).length;
  const resto = outros
    .filter((item) => !escolhidos.includes(item))
    .sort((a, b) => pontos(b) - pontos(a));
  return [...escolhidos, ...resto].slice(0, limite);
}
