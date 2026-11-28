import { relacionados, temasDe } from '../utils/temas';

describe('temasDe', () => {
  it('deduz os temas pelas tags e pelo slug', () => {
    expect(temasDe('rate-limiting-em-apis', ['seguranca'])).toContain('Segurança');
    expect(temasDe('o-que-e-angular', [])).toEqual(['Frontend']);
  });

  it('não confunde "ia" dentro de outra palavra', () => {
    expect(temasDe('dia-a-dia-da-confeitaria', [])).not.toContain('IA');
  });
});

describe('relacionados', () => {
  const todos = [
    { id: 'atual', tags: ['redis'] },
    { id: 'angular', tags: ['angular'] },
    { id: 'redis-2', tags: ['redis'] },
    { id: 'outro', tags: [] },
  ];

  it('prioriza tags em comum e nunca repete o próprio artigo', () => {
    const ids = relacionados(todos[0], todos).map((a) => a.id);
    expect(ids[0]).toBe('redis-2');
    expect(ids).not.toContain('atual');
  });

  it('respeita os indicados no frontmatter e ignora os que não existem', () => {
    const ids = relacionados(todos[0], todos, ['outro', 'nao-existe'], 2).map((a) => a.id);
    expect(ids).toEqual(['outro', 'redis-2']);
  });
});
