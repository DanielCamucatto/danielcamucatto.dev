import { render } from '../utils/test/render-utils';
import Footer from '../components/Footer';
describe('Footer snapshot', () => {
  it('deve bater o snapshot', () => {
    const { asFragment } = render(<Footer />);
    expect(asFragment()).toMatchSnapshot();
  });
});
