import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Toggle } from '../ui/Toggle/Toggle';

const options = [
  { value: 'a', label: 'Option A' },
  { value: 'b', label: 'Option B' },
  { value: 'c', label: 'Option C' },
];

describe('Toggle', () => {
  it('renders all options', () => {
    render(<Toggle value="a" onChange={() => {}} options={options} />);
    expect(screen.getByText('Option A')).toBeInTheDocument();
    expect(screen.getByText('Option B')).toBeInTheDocument();
    expect(screen.getByText('Option C')).toBeInTheDocument();
  });

  it('marks the active option with aria-pressed="true"', () => {
    render(<Toggle value="b" onChange={() => {}} options={options} />);
    const btns = screen.getAllByRole('button');
    expect(btns[0]).toHaveAttribute('aria-pressed', 'false');
    expect(btns[1]).toHaveAttribute('aria-pressed', 'true');
    expect(btns[2]).toHaveAttribute('aria-pressed', 'false');
  });

  it('applies active class to selected option', () => {
    render(<Toggle value="a" onChange={() => {}} options={options} />);
    expect(screen.getAllByRole('button')[0]).toHaveClass('toggle__btn--active');
  });

  it('calls onChange with new value when inactive option clicked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Toggle value="a" onChange={onChange} options={options} />);
    await user.click(screen.getByText('Option B'));
    expect(onChange).toHaveBeenCalledWith('b');
  });

  it('does not call onChange when already-active option clicked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Toggle value="a" onChange={onChange} options={options} />);
    await user.click(screen.getByText('Option A'));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('sets role="group" on the root', () => {
    render(<Toggle value="a" onChange={() => {}} options={options} />);
    expect(screen.getByRole('group')).toBeInTheDocument();
  });

  it('applies ariaLabel to the group', () => {
    render(<Toggle value="a" onChange={() => {}} options={options} ariaLabel="View mode" />);
    expect(screen.getByRole('group')).toHaveAttribute('aria-label', 'View mode');
  });

  it('merges custom className', () => {
    render(<Toggle value="a" onChange={() => {}} options={options} className="wide" />);
    expect(screen.getByRole('group')).toHaveClass('toggle', 'wide');
  });
});
