import { render, screen } from '@testing-library/react';
import RVIZ from '../RVIZ';

test('basic', () => {
  expect(true).toBe(true);
});

test('example green', () => {
  const mock = jest.fn();
  mock();
  expect(mock).toHaveBeenCalled();
});

test('renders RVIZ', () => {
  render(<RVIZ />);
  expect(screen.getByText('RVIZ')).toBeInTheDocument();
});