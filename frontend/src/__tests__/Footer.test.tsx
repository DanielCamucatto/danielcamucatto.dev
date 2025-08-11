import { render, screen } from '@testing-library/react';
import Footer from '../components/Footer';
describe('Footer', () => {
  it('renderiza "Construído com React"', () => {
    render(<Footer />);
    expect(screen.getByText(/construído com/i)).toBeInTheDocument();
    expect(screen.getByText(/react/i)).toBeInTheDocument();
    expect(screen.getByText(/tailwind css/i)).toBeInTheDocument();
  });
});
