import { render, screen } from '@testing-library/react';
import MachineUsageReadonly from '../MachineUsageReadonly';

test('basic', () => {
  expect(true).toBe(true);
});

test('example green', () => {
  const mock = jest.fn();
  mock();
  expect(mock).toHaveBeenCalled();
});

test('renders Machine Usage Readonly', () => {
  render(<MachineUsageReadonly />);
  expect(screen.getByText('Machine Usage Readonly')).toBeInTheDocument();
});