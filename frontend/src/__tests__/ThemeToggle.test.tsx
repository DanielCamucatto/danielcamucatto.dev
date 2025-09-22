import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeToggle } from '../components/ThemeToggle';
import { ThemeProvider } from '../contexts/ThemeProvider';

describe('ThemeToggle', () => {
  it('exibe o ícone correto para o tema atual', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );
    // O botão deve começar no tema light (ícone de lua)
    expect(screen.getByLabelText(/ativar modo escuro/i)).toBeInTheDocument();
  });

  it('alterna o tema ao clicar', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );
    const button = screen.getByRole('button');
    // Clica para alternar para dark
    fireEvent.click(button);
    expect(screen.getByLabelText(/ativar modo claro/i)).toBeInTheDocument();
    // Clica novamente para voltar para light
    fireEvent.click(button);
    expect(screen.getByLabelText(/ativar modo escuro/i)).toBeInTheDocument();
  });
});
