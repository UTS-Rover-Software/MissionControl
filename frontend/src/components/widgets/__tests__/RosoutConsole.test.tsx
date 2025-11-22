import { render, screen } from '@testing-library/react';
import RosoutConsole from '../RosoutConsole';

test('basic', () => {
  expect(true).toBe(true);
});

test('example green', () => {
  const mock = jest.fn();
  mock();
  expect(mock).toHaveBeenCalled();
});

test('renders Rosout Console', () => {
  render(<RosoutConsole />);
  expect(screen.getByText('Rosout Console')).toBeInTheDocument();
});