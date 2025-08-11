import { render } from '@testing-library/react';
import About from '../components/About';
describe('About snapshot', () => {
  it('deve bater o snapshot', () => {
    const { asFragment } = render(<About />);
    expect(asFragment()).toMatchSnapshot();
  });
});
