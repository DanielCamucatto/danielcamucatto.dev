import { render, screen, fireEvent, act } from '@testing-library/react';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';
import React from 'react';

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
