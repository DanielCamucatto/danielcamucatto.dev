import { render, screen } from '@testing-library/react';
import Experience from '../components/Experience';
describe('Experience', () => {
  it('renderiza o título Experiência', () => {
    render(<Experience />);
    expect(screen.getByRole('heading', { name: /experi/i })).toBeInTheDocument();
  });
  it('renderiza o texto de placeholder', () => {
    render(<Experience />);
    // Verifica que pelo menos uma ocorrência de 'FullStack Engineer' está sendo renderizada
    const matches = screen.getAllByText(/FullStack Engineer/i);
    expect(matches.length).toBeGreaterThan(0);
  });
});
