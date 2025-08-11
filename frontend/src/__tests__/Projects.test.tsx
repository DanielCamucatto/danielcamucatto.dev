import { render, screen } from '@testing-library/react';
import Projects from '../components/Projects';
describe('Projects', () => {
  it('renderiza o título Projetos', () => {
    render(<Projects />);
    expect(screen.getByRole('heading', { name: /projeto/i })).toBeInTheDocument();
  });
  it('renderiza o texto de placeholder', () => {
    render(<Projects />);
    expect(screen.getByText(/adicionar projetos aqui/i)).toBeInTheDocument();
  });
});
