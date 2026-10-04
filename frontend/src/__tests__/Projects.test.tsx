import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Projects from '../components/Projects';
describe('Projects', () => {
  it('renderiza o título Projetos', () => {
    render(<Projects />);
    expect(screen.getByRole('heading', { name: /projeto/i })).toBeInTheDocument();
  });
  it('renderiza o texto de placeholder', () => {
    render(<Projects />);
    // Verifica que um projeto real da lista está sendo renderizado (evita usar texto placeholder)
    expect(screen.getByText(/Divam/i)).toBeInTheDocument();
  });
});

describe('Projetos descontinuados', () => {
  it('abre um aviso em vez de seguir o link e fecha pelo botão', async () => {
    render(<Projects />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('link', { name: 'Pix 4 Fun' }));
    expect(screen.getByRole('dialog')).toHaveTextContent('Esse site foi descontinuado pela empresa.');

    // O modal tem o ✕ no topo e o botão "Fechar" no rodapé; usa o do rodapé
    const closeButtons = screen.getAllByRole('button', { name: 'Fechar' });
    await userEvent.click(closeButtons[closeButtons.length - 1]);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('projetos ativos continuam abrindo o site', () => {
    render(<Projects />);
    const link = screen.getByRole('link', { name: 'Maiver' });
    expect(link).toHaveAttribute('href', 'https://landing.appmaiver.com/');
    expect(link).not.toHaveAttribute('aria-haspopup');
  });
});
