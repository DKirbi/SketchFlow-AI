import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Loader } from '../ui/Loader/Loader';

describe('Loader', () => {
  it('renders without a label', () => {
    const { container } = render(<Loader />);
    expect(container.querySelector('.loader')).toBeInTheDocument();
  });

  it('renders the label when provided', () => {
    render(<Loader label="Loading" />);
    expect(screen.getByText('Loading')).toBeInTheDocument();
  });

  it('renders the animated dots element', () => {
    const { container } = render(<Loader />);
    const dots = container.querySelector('.loader__dots');
    expect(dots).toBeInTheDocument();
    expect(dots).toHaveAttribute('aria-hidden', 'true');
  });

  it('merges custom className', () => {
    const { container } = render(<Loader className="centered" />);
    expect(container.querySelector('.loader.centered')).toBeInTheDocument();
  });
});
