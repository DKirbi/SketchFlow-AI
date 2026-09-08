import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Chip } from '../ui/Chip/Chip';

describe('Chip', () => {
  it('renders ✕ only when onClear is passed', () => {
    const { rerender } = render(<Chip label="Sport: Soccer" onClear={() => {}} />);
    expect(screen.getByRole('button', { name: 'Remove filter Sport: Soccer' })).toBeInTheDocument();

    rerender(<Chip label="Unmapped (14)" selected onClick={() => {}} />);
    expect(screen.queryByRole('button', { name: /Remove filter/ })).not.toBeInTheDocument();
  });

  it('treats deprecated onDismiss as onClear', async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    render(<Chip label="Date: 2024" onDismiss={onDismiss} />);
    await user.click(screen.getByRole('button', { name: 'Remove filter Date: 2024' }));
    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it('does not render ✕ on a selected filter chip', () => {
    render(<Chip label="All (20)" selected onClick={() => {}} />);
    expect(screen.getByRole('button', { name: 'All (20)' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.queryByLabelText(/Remove filter/)).not.toBeInTheDocument();
  });

  it('calls onClick from the filter chip and not from a missing ✕', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Chip label="Mapped (6)" onClick={onClick} />);
    await user.click(screen.getByRole('button', { name: 'Mapped (6)' }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('inverts the selected filter chip and ignores a repeat press', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Chip label="All (20)" selected onClick={onClick} />);
    const chip = screen.getByRole('button', { name: 'All (20)' });
    expect(chip).toHaveClass('chip--selected');
    await user.click(chip);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('does not fire onClick when ✕ is used', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const onClear = vi.fn();
    render(<Chip label="Sport: Soccer" onClick={onClick} onClear={onClear} />);
    await user.click(screen.getByRole('button', { name: 'Remove filter Sport: Soccer' }));
    expect(onClear).toHaveBeenCalledOnce();
    expect(onClick).not.toHaveBeenCalled();
  });
});
