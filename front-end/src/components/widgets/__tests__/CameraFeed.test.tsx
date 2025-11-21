import { render, screen } from '@testing-library/react';
import CameraFeed from '../CameraFeed';

test('basic', () => {
  expect(true).toBe(true);
});

test('example green', () => {
  const mock = jest.fn();
  mock();
  expect(mock).toHaveBeenCalled();
});

test('renders Camera Feed', () => {
  render(<CameraFeed />);
  expect(screen.getByText('Camera Feed')).toBeInTheDocument();
});