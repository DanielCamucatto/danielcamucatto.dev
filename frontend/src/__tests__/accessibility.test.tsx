import { render, screen } from '@testing-library/react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Navigation from '../components/Navigation';
import Projects from '../components/Projects';
import Experience from '../components/Experience';
import { ThemeToggle } from '../components/ThemeToggle';
import { ThemeProvider } from '../contexts/ThemeContext';

describe('Acessibilidade dos componentes principais', () => {
  it('Header tem role="banner"', () => {
    render(<Header />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('Footer tem role="contentinfo"', () => {
    render(<Footer />);
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('Navigation tem role="navigation"', () => {
    render(<Navigation />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('ThemeToggle tem aria-label', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );
    expect(screen.getByLabelText(/ativar modo/i)).toBeInTheDocument();
  });

  it('Projects tem heading acessível', () => {
    render(<Projects />);
    expect(screen.getByRole('heading', { name: /projeto/i })).toBeInTheDocument();
  });

  it('Experience tem heading acessível', () => {
    render(<Experience />);
    expect(screen.getByRole('heading', { name: /experi/i })).toBeInTheDocument();
  });
});
