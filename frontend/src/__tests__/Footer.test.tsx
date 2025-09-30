import { render, screen } from '../utils/test/render-utils';
import Footer from '../components/Footer';
describe('Footer', () => {
  it('renderiza informações de contato', () => {
    render(<Footer />);
    expect(screen.getByText(/se quiser entrar em contato/i)).toBeInTheDocument();
    expect(screen.getByText(/daniel.camucatto@gmail.com/i)).toBeInTheDocument();
    expect(screen.getByText(/© 2025 Daniel Camucatto/i)).toBeInTheDocument();
  });
});
