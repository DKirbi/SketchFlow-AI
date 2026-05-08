import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Input } from '../ui/Input/Input';

describe('Input', () => {
  it('renders with the provided value', () => {
    render(<Input value="hello" onChange={() => {}} />);
    expect(screen.getByDisplayValue('hello')).toBeInTheDocument();
  });

  it('defaults to type="text"', () => {
    render(<Input value="" onChange={() => {}} />);
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'text');
  });

  it('calls onChange with the new value on typing', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Input value="" onChange={onChange} />);
    await user.type(screen.getByRole('textbox'), 'a');
    expect(onChange).toHaveBeenCalledWith('a');
  });

  it('renders placeholder text', () => {
    render(<Input value="" onChange={() => {}} placeholder="Search…" />);
    expect(screen.getByPlaceholderText('Search…')).toBeInTheDocument();
  });

  it('sets disabled attribute', () => {
    render(<Input value="" onChange={() => {}} disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('sets readOnly attribute', () => {
    render(<Input value="locked" onChange={() => {}} readOnly />);
    expect(screen.getByRole('textbox')).toHaveAttribute('readOnly');
  });

  it('applies compact size class', () => {
    render(<Input value="" onChange={() => {}} size="compact" />);
    expect(screen.getByRole('textbox')).toHaveClass('input--compact');
  });

  it('does not add compact class for default size', () => {
    render(<Input value="" onChange={() => {}} />);
    expect(screen.getByRole('textbox')).not.toHaveClass('input--compact');
  });

  it('passes id attribute', () => {
    render(<Input value="" onChange={() => {}} id="field-1" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('id', 'field-1');
  });

  it('passes name attribute', () => {
    render(<Input value="" onChange={() => {}} name="email" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('name', 'email');
  });

  it('merges custom className', () => {
    render(<Input value="" onChange={() => {}} className="wide" />);
    expect(screen.getByRole('textbox')).toHaveClass('input', 'wide');
  });

  it('fires onKeyDown handler', async () => {
    const user = userEvent.setup();
    const onKeyDown = vi.fn();
    render(<Input value="" onChange={() => {}} onKeyDown={onKeyDown} />);
    await user.type(screen.getByRole('textbox'), '{Enter}');
    expect(onKeyDown).toHaveBeenCalled();
  });

  it('fires onBlur handler', async () => {
    const user = userEvent.setup();
    const onBlur = vi.fn();
    render(<Input value="" onChange={() => {}} onBlur={onBlur} />);
    await user.click(screen.getByRole('textbox'));
    await user.tab();
    expect(onBlur).toHaveBeenCalled();
  });

  it('accepts type="date"', () => {
    const { container } = render(<Input value="2026-04-09" onChange={() => {}} type="date" />);
    expect(container.querySelector('input')).toHaveAttribute('type', 'date');
  });

  it('does not show clear button when allowClear is false', () => {
    render(<Input value="hello" onChange={() => {}} />);
    expect(screen.queryByRole('button', { name: 'Clear' })).not.toBeInTheDocument();
  });

  it('does not show clear button when value is empty', () => {
    render(<Input value="" onChange={() => {}} allowClear />);
    expect(screen.queryByRole('button', { name: 'Clear' })).not.toBeInTheDocument();
  });

  it('shows clear button when allowClear and value is non-empty', () => {
    render(<Input value="hello" onChange={() => {}} allowClear />);
    expect(screen.getByRole('button', { name: 'Clear' })).toBeInTheDocument();
  });

  it('calls onChange with empty string when clear button is clicked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Input value="hello" onChange={onChange} allowClear />);
    await user.click(screen.getByRole('button', { name: 'Clear' }));
    expect(onChange).toHaveBeenCalledWith('');
  });

  it('does not show clear button when disabled', () => {
    render(<Input value="hello" onChange={() => {}} allowClear disabled />);
    expect(screen.queryByRole('button', { name: 'Clear' })).not.toBeInTheDocument();
  });

  it('does not show clear button when readOnly', () => {
    render(<Input value="hello" onChange={() => {}} allowClear readOnly />);
    expect(screen.queryByRole('button', { name: 'Clear' })).not.toBeInTheDocument();
  });
});
