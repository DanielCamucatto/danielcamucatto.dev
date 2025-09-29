import { render } from '../utils/test/render-utils';
import Header from '../components/Header';
describe('Header snapshot', () => {
  it('deve bater o snapshot', () => {
    const { asFragment } = render(<Header />);
    expect(asFragment()).toMatchSnapshot();
  });
});
