import { render } from '@testing-library/react';
import Footer from '../components/Footer';
describe('Footer snapshot', () => {
  it('deve bater o snapshot', () => {
    const { asFragment } = render(<Footer />);
    expect(asFragment()).toMatchSnapshot();
  });
});
