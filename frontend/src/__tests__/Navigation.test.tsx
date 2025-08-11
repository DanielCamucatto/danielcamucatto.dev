import { render, screen } from '@testing-library/react';
import Navigation from '../components/Navigation';
describe('Navigation', () => {
  it('renderiza links de navegação', () => {
    render(<Navigation />);
    // Ajuste os textos conforme os links reais
    expect(screen.getAllByRole('link').length).toBeGreaterThan(0);
  });
});
