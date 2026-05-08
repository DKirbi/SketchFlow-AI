import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { EmptyState } from '../ui/EmptyState/EmptyState';

describe('EmptyState', () => {
  it('renders the title', () => {
    render(<EmptyState title="No teams yet" />);
    expect(screen.getByText('No teams yet')).toBeInTheDocument();
  });

  it('renders an optional description', () => {
    render(
      <EmptyState title="No teams yet" description="Add your first team to get started." />,
    );
    expect(screen.getByText('Add your first team to get started.')).toBeInTheDocument();
  });

  it('does not render description when omitted', () => {
    render(<EmptyState title="No results" />);
    // only one paragraph-like element (the title)
    expect(screen.getAllByText(/./)).toHaveLength(1);
  });

  it('renders an optional action slot', () => {
    render(
      <EmptyState
        title="No teams yet"
        action={<button type="button">+ Add team</button>}
      />,
    );
    expect(screen.getByRole('button', { name: /add team/i })).toBeInTheDocument();
  });

  it('does not render action slot when omitted', () => {
    const { container } = render(<EmptyState title="No teams yet" />);
    expect(container.querySelector('.empty-state__action')).not.toBeInTheDocument();
  });

  it('applies variant modifier class', () => {
    const { container } = render(<EmptyState variant="no-results" title="No results" />);
    expect(container.firstChild).toHaveClass('empty-state--no-results');
  });

  it('defaults to first-use variant', () => {
    const { container } = render(<EmptyState title="No teams yet" />);
    expect(container.firstChild).toHaveClass('empty-state--first-use');
  });

  it('applies error variant class', () => {
    const { container } = render(<EmptyState variant="error" title="Could not load teams" />);
    expect(container.firstChild).toHaveClass('empty-state--error');
  });
});
