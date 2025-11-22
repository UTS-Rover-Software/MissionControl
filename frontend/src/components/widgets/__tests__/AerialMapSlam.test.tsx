import { render, screen } from '@testing-library/react';
import AerialMapSlam from '../AerialMapSlam';

test('basic', () => {
  expect(true).toBe(true);
});

test('example green', () => {
  const mock = jest.fn();
  mock();
  expect(mock).toHaveBeenCalled();
});

test('renders 2D Aerial Map Slam', () => {
  render(<AerialMapSlam />);
  expect(screen.getByText('2D Aerial Map Slam')).toBeInTheDocument();
});