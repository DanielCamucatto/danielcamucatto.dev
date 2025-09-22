import { render, screen } from '@testing-library/react';
import Navigation from '../components/Navigation';

describe('Navegação', () => {
  it('renderiza todos os links de navegação', () => {
    render(<Navigation />);
    expect(screen.getByRole('link', { name: /sobre/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /experi/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /projeto/i })).toBeInTheDocument();
  });

  it('links de navegação apontam para as seções corretas', () => {
    render(<Navigation />);
    expect(screen.getByRole('link', { name: /sobre/i })).toHaveAttribute('href', '#about');
    expect(screen.getByRole('link', { name: /experi/i })).toHaveAttribute('href', '#experience');
    expect(screen.getByRole('link', { name: /projeto/i })).toHaveAttribute('href', '#projects');
  });

  it('snapshot da navegação', () => {
    const { asFragment } = render(<Navigation />);
    expect(asFragment()).toMatchSnapshot();
  });
});
