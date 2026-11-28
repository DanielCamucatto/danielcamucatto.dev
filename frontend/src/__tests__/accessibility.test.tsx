import { render, screen } from '../utils/test/render-utils';
import Topo, { Menu } from '../components/home/Topo';
import Projetos from '../components/home/Projetos';
import Experiencia from '../components/home/Experiencia';
import { ThemeToggle } from '../components/ThemeToggle';

describe('Acessibilidade dos componentes principais', () => {
  it('o topo tem um título com o nome', () => {
    render(<Topo />);
    expect(screen.getByRole('heading', { level: 1, name: /daniel\s+camuçatto/i })).toBeInTheDocument();
  });

  it('o menu é uma navegação', () => {
    render(<Menu />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('ThemeToggle tem aria-label', () => {
    render(<ThemeToggle />);
    expect(screen.getByLabelText(/ativar modo (escuro|claro)/i)).toBeInTheDocument();
  });

  it('Projetos tem heading acessível', () => {
    render(<Projetos />);
    expect(screen.getByRole('heading', { name: /projeto/i })).toBeInTheDocument();
  });

  it('Experiência tem heading acessível', () => {
    render(<Experiencia />);
    expect(screen.getByRole('heading', { name: /experi/i })).toBeInTheDocument();
  });
});
