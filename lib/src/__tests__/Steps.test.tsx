import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Steps } from '../ui/Steps/Steps';

const items = [
  { label: 'Setup', state: 'active' as const },
  { label: 'Configure', state: 'default' as const },
  { label: 'Review', state: 'muted' as const },
];

describe('Steps', () => {
  it('renders all step labels', () => {
    render(<Steps items={items} />);
    expect(screen.getByText('Setup')).toBeInTheDocument();
    expect(screen.getByText('Configure')).toBeInTheDocument();
    expect(screen.getByText('Review')).toBeInTheDocument();
  });

  it('uses a nav element with aria-label', () => {
    render(<Steps items={items} />);
    expect(screen.getByRole('navigation')).toHaveAttribute('aria-label', 'Steps');
  });

  it('applies active state class', () => {
    const { container } = render(<Steps items={items} />);
    expect(container.querySelector('.steps__item--active')).toHaveTextContent('Setup');
  });

  it('applies muted state class', () => {
    const { container } = render(<Steps items={items} />);
    expect(container.querySelector('.steps__item--muted')).toHaveTextContent('Review');
  });

  it('renders non-clickable steps as spans', () => {
    render(<Steps items={[{ label: 'Static' }]} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.getByText('Static').closest('span')).toBeInTheDocument();
  });

  it('renders clickable steps as buttons', () => {
    render(<Steps items={[{ label: 'Click', onClick: () => {} }]} />);
    expect(screen.getByRole('button', { name: 'Click' })).toBeInTheDocument();
  });

  it('calls onClick when clickable step is clicked', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Steps items={[{ label: 'Go', onClick }]} />);
    await user.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('applies clickable class to steps with onClick', () => {
    const { container } = render(<Steps items={[{ label: 'Go', onClick: () => {} }]} />);
    expect(container.querySelector('.steps__item--clickable')).toBeInTheDocument();
  });
});
