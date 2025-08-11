import { render } from '@testing-library/react';
import Experience from '../components/Experience';
describe('Experience snapshot', () => {
  it('deve bater o snapshot', () => {
    const { asFragment } = render(<Experience />);
    expect(asFragment()).toMatchSnapshot();
  });
});
