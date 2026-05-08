import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Badge } from '../ui/Badge/Badge';

describe('Badge', () => {
  it('renders label text', () => {
    render(<Badge label="New" />);
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('defaults to tag variant', () => {
    const { container } = render(<Badge label="Tag" />);
    expect(container.querySelector('.badge--tag')).toBeInTheDocument();
  });

  it('applies status variant', () => {
    const { container } = render(<Badge label="Live" variant="status" />);
    expect(container.querySelector('.badge--status')).toBeInTheDocument();
  });

  it('applies id variant', () => {
    const { container } = render(<Badge label="ID123" variant="id" />);
    expect(container.querySelector('.badge--id')).toBeInTheDocument();
  });

  it('renders as a span when no onClick', () => {
    render(<Badge label="Static" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders as a button when onClick is provided', () => {
    render(<Badge label="Click" onClick={() => {}} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('calls onClick when clickable badge is clicked', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Badge label="Action" onClick={onClick} />);
    await user.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('adds clickable class when onClick is provided', () => {
    const { container } = render(<Badge label="Go" onClick={() => {}} />);
    expect(container.querySelector('.badge--clickable')).toBeInTheDocument();
  });

  it('adds inactive class for status variant when active is false', () => {
    const { container } = render(<Badge label="Off" variant="status" active={false} />);
    expect(container.querySelector('.badge--inactive')).toBeInTheDocument();
  });

  it('does not add inactive class when active is true', () => {
    const { container } = render(<Badge label="On" variant="status" active={true} />);
    expect(container.querySelector('.badge--inactive')).not.toBeInTheDocument();
  });

  it('does not add inactive class for non-status variants even when active is false', () => {
    const { container } = render(<Badge label="Tag" variant="tag" active={false} />);
    expect(container.querySelector('.badge--inactive')).not.toBeInTheDocument();
  });
});
