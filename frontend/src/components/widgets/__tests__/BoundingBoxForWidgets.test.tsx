import { render, screen } from '@testing-library/react';
import BoundingBoxForWidgets from '../BoundingBoxForWidgets';

test('basic', () => {
  expect(true).toBe(true);
});

test('example green', () => {
  const mock = jest.fn();
  mock();
  expect(mock).toHaveBeenCalled();
});

test('renders Bounding Box for Widgets', () => {
  render(<BoundingBoxForWidgets />);
  expect(screen.getByText('Bounding Box for Widgets')).toBeInTheDocument();
});