import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';
import { generatePDF } from '../services/pdfGenerator';
import pt from '../locales/pt/home.json';
import en from '../locales/en/home.json';
import es from '../locales/es/home.json';

jest.mock('../services/pdfGenerator', () => ({ generatePDF: jest.fn() }));

// Mesmas chaves e mesmos tamanhos de lista nos três idiomas
const forma = (valor: unknown): unknown =>
  Array.isArray(valor)
    ? valor.map(forma)
    : valor && typeof valor === 'object'
      ? Object.fromEntries(Object.entries(valor).map(([k, v]) => [k, forma(v)]))
      : typeof valor;

describe('Página inicial', () => {
  beforeEach(() => localStorage.clear());

  it('tem os textos novos nos três idiomas', () => {
    expect(forma(en)).toEqual(forma(pt));
    expect(forma(es)).toEqual(forma(pt));
  });

  it('mostra GitHub e LinkedIn uma única vez', () => {
    const { container } = render(<App />);
    expect(container.querySelectorAll('a[href*="github.com/danielcamucatto"]')).toHaveLength(1);
    expect(container.querySelectorAll('a[href*="linkedin.com/in/danielcamucatto"]')).toHaveLength(1);
  });

  it('troca o idioma, lembra a escolha e baixa o currículo no mesmo idioma', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'EN' }));
    expect(screen.getByText(en.ia.titulo)).toBeInTheDocument();
    expect(localStorage.getItem('idioma')).toBe('en');
    fireEvent.click(screen.getByRole('button', { name: en.topo.cv }));
    expect(generatePDF).toHaveBeenCalledWith('en');
  });

  it('mantém os mesmos elementos dos projetos ao trocar de idioma', () => {
    const { container } = render(<App />);
    const antes = [...container.querySelectorAll('.proj')];
    fireEvent.click(screen.getByRole('button', { name: 'EN' }));
    const depois = [...container.querySelectorAll('.proj')];
    expect(depois).toHaveLength(antes.length);
    depois.forEach((item, i) => expect(item).toBe(antes[i]));
  });

  it('mostra as entregas da empresa escolhida', () => {
    const { container } = render(<App />);
    const botoes = container.querySelectorAll<HTMLButtonElement>('.xp-lista button');
    fireEvent.click(botoes[2]);
    const abertos = container.querySelectorAll('.xp-painel:not([hidden])');
    expect(abertos).toHaveLength(1);
    expect(abertos[0].id).toBe('xp-2');
  });
});
