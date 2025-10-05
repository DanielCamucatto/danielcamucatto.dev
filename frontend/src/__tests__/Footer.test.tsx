import { render, screen } from '../utils/test/render-utils';
import Footer from '../components/Footer';

describe('Footer', () => {
  it('renderiza botão de contato', () => {
    render(<Footer />);
    expect(screen.getByText(/entre em contato/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/entre em contato/i)).toBeInTheDocument();
  });
});
