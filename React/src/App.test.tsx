import { render, screen } from '@testing-library/react';
import App from './App.tsx';

test('renders the tree list and the button', () => {
  const { container } = render(<App />);
  expect(container.querySelector('.dx-treelist')).toBeTruthy();
  expect(screen.getByText('Get all selected keys')).toBeTruthy();
});
