import { render, screen } from '@testing-library/react';
import Experience from '../components/Experience';
describe('Experience', () => {
  it('renderiza o título Experiência', () => {
    render(<Experience />);
    expect(screen.getByRole('heading', { name: /experi/i })).toBeInTheDocument();
  });
  it('renderiza o texto de placeholder', () => {
    render(<Experience />);
    expect(screen.getByText(/adicionar experiências profissionais aqui/i)).toBeInTheDocument();
  });
});
