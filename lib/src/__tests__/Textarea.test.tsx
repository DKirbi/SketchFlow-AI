import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Textarea } from '../ui/Textarea/Textarea';

describe('Textarea', () => {
  it('renders with placeholder', () => {
    render(
      <Textarea
        value=""
        onChange={() => {}}
        placeholder="Add notes…"
        id="notes"
      />,
    );
    expect(screen.getByPlaceholderText('Add notes…')).toBeInTheDocument();
  });

  it('calls onChange when typing', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Textarea value="" onChange={onChange} id="n" />);
    await user.type(screen.getByRole('textbox'), 'a');
    expect(onChange).toHaveBeenCalledWith('a');
  });

  it('respects disabled', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Textarea value="" onChange={onChange} id="n" disabled />);
    await user.type(screen.getByRole('textbox'), 'x');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('applies compact modifier', () => {
    const { container } = render(
      <Textarea value="" onChange={() => {}} id="n" size="compact" />,
    );
    expect(container.querySelector('.textarea--compact')).toBeInTheDocument();
  });

  it('shows resize hint', () => {
    const { container } = render(<Textarea value="" onChange={() => {}} id="n" />);
    expect(container.querySelector('.textarea-wrap__resize-hint')).toBeInTheDocument();
  });

  it('does not show clear button without allowClear', () => {
    render(<Textarea value="some text" onChange={() => {}} id="n" />);
    expect(screen.queryByRole('button', { name: 'Clear' })).not.toBeInTheDocument();
  });

  it('does not show clear button when value is empty', () => {
    render(<Textarea value="" onChange={() => {}} id="n" allowClear />);
    expect(screen.queryByRole('button', { name: 'Clear' })).not.toBeInTheDocument();
  });

  it('shows clear button when allowClear and value is non-empty', () => {
    render(<Textarea value="some text" onChange={() => {}} id="n" allowClear />);
    expect(screen.getByRole('button', { name: 'Clear' })).toBeInTheDocument();
  });

  it('calls onChange with empty string when clear button is clicked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Textarea value="some text" onChange={onChange} id="n" allowClear />);
    await user.click(screen.getByRole('button', { name: 'Clear' }));
    expect(onChange).toHaveBeenCalledWith('');
  });

  it('does not show clear button when disabled', () => {
    render(<Textarea value="some text" onChange={() => {}} id="n" allowClear disabled />);
    expect(screen.queryByRole('button', { name: 'Clear' })).not.toBeInTheDocument();
  });
});
