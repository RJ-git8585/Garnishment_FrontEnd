import { render, screen } from '@testing-library/react';
import Dashboard from '../src/pages/dashboard';

test('renders Dashboard component', () => {
  render(<Dashboard />);
  const linkElement = screen.getByText(/Dashboard/i);
  expect(linkElement).toBeInTheDocument();
});
