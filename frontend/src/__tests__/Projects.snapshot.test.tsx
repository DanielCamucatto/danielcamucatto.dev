import { render } from '@testing-library/react';
import Projects from '../components/Projects';
describe('Projects snapshot', () => {
  it('deve bater o snapshot', () => {
    const { asFragment } = render(<Projects />);
    expect(asFragment()).toMatchSnapshot();
  });
});
