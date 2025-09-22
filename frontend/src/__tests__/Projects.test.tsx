import { render, screen } from '@testing-library/react';
import Projects from '../components/Projects';
describe('Projects', () => {
  it('renderiza o título Projetos', () => {
    render(<Projects />);
    expect(screen.getByRole('heading', { name: /projeto/i })).toBeInTheDocument();
  });
  it('renderiza pelo menos um projeto listado', () => {
    render(<Projects />);
    // verifica presença de um título de projeto conhecido
    expect(screen.getByText(/Divam/i)).toBeInTheDocument();
  });
});
