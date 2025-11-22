import { render, screen } from '@testing-library/react';
import PointCloudMap from '../PointCloudMap';

test('basic', () => {
  expect(true).toBe(true);
});

test('example green', () => {
  const mock = jest.fn();
  mock();
  expect(mock).toHaveBeenCalled();
});

test('renders Point Cloud Map', () => {
  render(<PointCloudMap />);
  expect(screen.getByText('Point Cloud Map')).toBeInTheDocument();
});