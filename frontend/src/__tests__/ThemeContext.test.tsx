import { render, screen, fireEvent, act, renderHook } from '@testing-library/react';
import { ThemeProvider } from '../contexts/ThemeProvider';
import { useTheme } from '../hooks/useTheme';
import type { ReactNode } from 'react';

describe('useTheme hook', () => {
  it('deve alternar o tema de light para dark e vice-versa', () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <ThemeProvider>{children}</ThemeProvider>
    );

    const { result } = renderHook(() => useTheme(), { wrapper });

    // O tema inicial pode ser 'light' ou 'dark' dependendo das configurações do sistema
    const initialTheme = result.current.theme;

    act(() => {
      result.current.toggleTheme();
    });

    // Verifica se o tema foi alterado
    expect(result.current.theme).toBe(initialTheme === 'light' ? 'dark' : 'light');

    act(() => {
      result.current.toggleTheme();
    });

    // Verifica se o tema voltou ao estado inicial
    expect(result.current.theme).toBe(initialTheme);
  });
});


function ThemeConsumerTest() {
  const { theme, toggleTheme } = useTheme();
  return (
    <>
      <span data-testid="theme-value">{theme}</span>
      <button onClick={toggleTheme}>toggle</button>
    </>
  );
}

describe('ThemeContext', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  it('usa o tema light por padrão', () => {
    render(
      <ThemeProvider>
        <ThemeConsumerTest />
      </ThemeProvider>
    );
    expect(screen.getByTestId('theme-value').textContent).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });


  it('alterna entre light e dark', async () => {
    render(
      <ThemeProvider>
        <ThemeConsumerTest />
      </ThemeProvider>
    );
    const button = screen.getByText('toggle');
    await act(async () => {
      fireEvent.click(button);
    });
    expect(screen.getByTestId('theme-value').textContent).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    await act(async () => {
      fireEvent.click(button);
    });
    expect(screen.getByTestId('theme-value').textContent).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('persiste o tema no localStorage', async () => {
    render(
      <ThemeProvider>
        <ThemeConsumerTest />
      </ThemeProvider>
    );
    const button = screen.getByText('toggle');
    await act(async () => {
      fireEvent.click(button);
    });
    expect(localStorage.getItem('theme')).toBe('dark');
    await act(async () => {
      fireEvent.click(button);
    });
    expect(localStorage.getItem('theme')).toBe('light');
  });
});
