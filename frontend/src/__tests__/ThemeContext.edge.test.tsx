import { render } from '@testing-library/react';
import { useTheme } from '../hooks/useTheme.ts';

function UseThemeOutsideProvider() {
  useTheme();
  return null;
}

describe('ThemeContext edge cases', () => {
  it('lança erro ao usar useTheme fora do ThemeProvider', () => {
    // O hook deve lançar um erro se usado fora do provider
    expect(() => render(<UseThemeOutsideProvider />)).toThrow(
      /useTheme must be used within a ThemeProvider/
    );
  });
});
