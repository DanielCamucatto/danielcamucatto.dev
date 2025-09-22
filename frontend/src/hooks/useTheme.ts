import { useContext } from 'react';
import { ThemeContext, type ThemeContextType } from '../contexts/ThemeContext.ts';

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
