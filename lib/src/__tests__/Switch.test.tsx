import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Switch } from '../ui/Switch/Switch';

describe('Switch', () => {
  it('renders the label', () => {
    render(<Switch checked={false} onChange={() => {}} label="Active" />);
    expect(screen.getByLabelText('Active')).toBeInTheDocument();
  });

  it('reflects checked state on the underlying input', () => {
    render(<Switch checked={true} onChange={() => {}} label="Active" />);
    expect(screen.getByRole('checkbox', { name: 'Active' })).toBeChecked();
  });

  it('reflects unchecked state on the underlying input', () => {
    render(<Switch checked={false} onChange={() => {}} label="Active" />);
    expect(screen.getByRole('checkbox', { name: 'Active' })).not.toBeChecked();
  });

  it('calls onChange with true when toggled on', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Switch checked={false} onChange={onChange} label="Active" />);
    await user.click(screen.getByRole('checkbox', { name: 'Active' }));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('calls onChange with false when toggled off', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Switch checked={true} onChange={onChange} label="Active" />);
    await user.click(screen.getByRole('checkbox', { name: 'Active' }));
    expect(onChange).toHaveBeenCalledWith(false);
  });

  it('does not call onChange when disabled', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Switch checked={false} onChange={onChange} label="Active" disabled />);
    await user.click(screen.getByRole('checkbox', { name: 'Active' }));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('applies switch--on modifier when checked', () => {
    const { container } = render(<Switch checked={true} onChange={() => {}} label="Active" />);
    expect(container.firstChild).toHaveClass('switch--on');
  });

  it('does not apply switch--on when unchecked', () => {
    const { container } = render(<Switch checked={false} onChange={() => {}} label="Active" />);
    expect(container.firstChild).not.toHaveClass('switch--on');
  });

  it('applies compact modifier when size is compact', () => {
    const { container } = render(
      <Switch checked={false} onChange={() => {}} label="Active" size="compact" />,
    );
    expect(container.firstChild).toHaveClass('switch--compact');
  });

  it('applies disabled modifier when disabled', () => {
    const { container } = render(
      <Switch checked={false} onChange={() => {}} label="Active" disabled />,
    );
    expect(container.firstChild).toHaveClass('switch--disabled');
  });
});
