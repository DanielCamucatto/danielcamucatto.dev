import { render, screen } from '@testing-library/react';
import About from '../components/About';

describe('About component', () => {
  it('renderiza o título Sobre', () => {
    render(<About />);
    expect(screen.getByRole('heading', { name: /sobre/i })).toBeInTheDocument();
  });
});
