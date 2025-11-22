import { render, screen } from '@testing-library/react';
import Nav2TargetQueue from '../Nav2TargetQueue';

test('basic', () => {
  expect(true).toBe(true);
});

test('example green', () => {
  const mock = jest.fn();
  mock();
  expect(mock).toHaveBeenCalled();
});

test('renders Nav2 Target Queue', () => {
  render(<Nav2TargetQueue />);
  expect(screen.getByText('Nav2 Target Queue')).toBeInTheDocument();
});