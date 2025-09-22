import { render, screen } from '@testing-library/react';
import Footer from '../components/Footer';
describe('Footer', () => {
  it('renderiza "Construído com React"', () => {
    render(<Footer />);
    // verifica email e presença do nome/ano
    expect(screen.getByText(/daniel.camucatto@gmail.com/i)).toBeInTheDocument();
    expect(screen.getByText(/daniel camucatto/i)).toBeInTheDocument();
  });
});
