import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Checkbox } from '../ui/Checkbox/Checkbox';

describe('Checkbox', () => {
  it('renders the label', () => {
    render(<Checkbox checked={false} onChange={() => {}} label="Accept terms" />);
    expect(screen.getByText('Accept terms')).toBeInTheDocument();
  });

  it('renders an unchecked checkbox', () => {
    render(<Checkbox checked={false} onChange={() => {}} label="Off" />);
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('renders a checked checkbox', () => {
    render(<Checkbox checked={true} onChange={() => {}} label="On" />);
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('calls onChange with true when unchecked box is clicked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Checkbox checked={false} onChange={onChange} label="Toggle" />);
    await user.click(screen.getByRole('checkbox'));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('calls onChange with false when checked box is clicked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Checkbox checked={true} onChange={onChange} label="Toggle" />);
    await user.click(screen.getByRole('checkbox'));
    expect(onChange).toHaveBeenCalledWith(false);
  });

  it('does not call onChange when disabled', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Checkbox checked={false} onChange={onChange} label="Locked" disabled />);
    await user.click(screen.getByRole('checkbox'));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('sets disabled attribute', () => {
    render(<Checkbox checked={false} onChange={() => {}} label="Disabled" disabled />);
    expect(screen.getByRole('checkbox')).toBeDisabled();
  });

  it('applies disabled class to wrapper', () => {
    const { container } = render(
      <Checkbox checked={false} onChange={() => {}} label="Disabled" disabled />,
    );
    expect(container.querySelector('.checkbox--disabled')).toBeInTheDocument();
  });

  it('passes id attribute', () => {
    render(<Checkbox checked={false} onChange={() => {}} label="ID" id="cb-1" />);
    expect(screen.getByRole('checkbox')).toHaveAttribute('id', 'cb-1');
  });

  it('passes name attribute', () => {
    render(<Checkbox checked={false} onChange={() => {}} label="Named" name="agree" />);
    expect(screen.getByRole('checkbox')).toHaveAttribute('name', 'agree');
  });
});
