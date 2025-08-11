import { render, screen } from '@testing-library/react';
import Header from '../components/Header';
describe('Header', () => {
  it('renderiza o título ou logo', () => {
    render(<Header />);
    // Ajuste o texto abaixo conforme o conteúdo real do Header
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });
});
