import { render, screen } from '@testing-library/react';
import VescInfoReadonly from '../VescInfoReadonly';

test('basic', () => {
  expect(true).toBe(true);
});

test('example green', () => {
  const mock = jest.fn();
  mock();
  expect(mock).toHaveBeenCalled();
});

test('renders Vesc Info Readonly', () => {
  render(<VescInfoReadonly />);
  expect(screen.getByText('Vesc Info Readonly')).toBeInTheDocument();
});