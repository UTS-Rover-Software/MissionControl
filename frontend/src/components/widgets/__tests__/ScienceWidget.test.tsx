import { render, screen } from '@testing-library/react';
import ScienceWidget from '../ScienceWidget';

test('basic', () => {
  expect(true).toBe(true);
});

test('example green', () => {
  const mock = jest.fn();
  mock();
  expect(mock).toHaveBeenCalled();
});

test('renders Science Widget', () => {
  render(<ScienceWidget />);
  expect(screen.getByText('Science Widget')).toBeInTheDocument();
});