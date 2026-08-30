import { render, screen } from '@testing-library/react';

test('carpooling application test environment is working', () => {
  render(<h1>ICBT Carpool System</h1>);

  const heading = screen.getByText('ICBT Carpool System');

  expect(heading).toBeInTheDocument();
});