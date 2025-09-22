import { render, screen } from '@testing-library/react';
import Experience from '../components/Experience';
describe('Experience', () => {
  it('renderiza o título Experiência', () => {
    render(<Experience />);
    expect(screen.getByRole('heading', { name: /experi/i })).toBeInTheDocument();
  });
  it('renderiza ao menos uma experiência listada', () => {
    render(<Experience />);
    // pode haver múltiplas ocorrências; garante que exista pelo menos uma
    const matches = screen.getAllByText(/FullStack Engineer/i);
    expect(matches.length).toBeGreaterThan(0);
  });
});
