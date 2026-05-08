import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Select } from '../ui/Select/Select';

const options = [
  { value: 'red',   label: 'Red' },
  { value: 'green', label: 'Green' },
  { value: 'blue',  label: 'Blue' },
];

describe('Select', () => {
  it('renders a combobox trigger', () => {
    render(<Select value="red" onChange={() => {}} options={options} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('shows the current value label in the trigger', () => {
    render(<Select value="green" onChange={() => {}} options={options} />);
    expect(screen.getByRole('combobox')).toHaveTextContent('Green');
  });

  it('shows the placeholder when value is empty', () => {
    render(<Select value="" onChange={() => {}} options={options} placeholder="Pick one…" />);
    expect(screen.getByRole('combobox')).toHaveTextContent('Pick one…');
  });

  it('calls onChange with the selected value on item click', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Select value="red" onChange={onChange} options={options} />);
    await user.click(screen.getByRole('combobox'));
    // Listbox opens; pick an option.
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    await user.click(screen.getByRole('option', { name: 'Blue' }));
    expect(onChange).toHaveBeenCalledWith('blue');
    // Listbox closes after selection.
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('opens the listbox with all options', async () => {
    const user = userEvent.setup();
    render(<Select value="red" onChange={() => {}} options={options} />);
    await user.click(screen.getByRole('combobox'));
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getAllByRole('option')).toHaveLength(3);
  });

  it('disables the combobox trigger when disabled prop is set', () => {
    render(<Select value="red" onChange={() => {}} options={options} disabled />);
    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  it('applies select--compact class to trigger when size is compact', () => {
    render(<Select value="red" onChange={() => {}} options={options} size="compact" />);
    expect(screen.getByRole('combobox')).toHaveClass('select--compact');
  });

  it('forwards id to the trigger', () => {
    render(<Select value="red" onChange={() => {}} options={options} id="sel-1" />);
    expect(screen.getByRole('combobox')).toHaveAttribute('id', 'sel-1');
  });

  it('renders a hidden input with name and value for form submission', () => {
    const { container } = render(
      <Select value="red" onChange={() => {}} options={options} name="color" />,
    );
    const hidden = container.querySelector('input[type="hidden"]');
    expect(hidden).toHaveAttribute('name', 'color');
    expect(hidden).toHaveAttribute('value', 'red');
  });

  it('merges custom className onto the trigger', () => {
    render(<Select value="red" onChange={() => {}} options={options} className="full" />);
    expect(screen.getByRole('combobox')).toHaveClass('select', 'full');
  });

  it('marks individual options disabled', async () => {
    const user = userEvent.setup();
    const opts = [
      { value: 'a', label: 'A' },
      { value: 'b', label: 'B', disabled: true },
    ];
    render(<Select value="a" onChange={() => {}} options={opts} />);
    await user.click(screen.getByRole('combobox'));
    const disabledOpt = screen.getByRole('option', { name: 'B' });
    expect(disabledOpt).toHaveAttribute('data-disabled');
  });

  it('does not show clear button without allowClear', () => {
    render(<Select value="red" onChange={() => {}} options={options} />);
    expect(screen.queryByRole('button', { name: 'Clear' })).not.toBeInTheDocument();
  });

  it('does not show clear button when value is empty', () => {
    render(<Select value="" onChange={() => {}} options={options} placeholder="Pick one…" allowClear />);
    expect(screen.queryByRole('button', { name: 'Clear' })).not.toBeInTheDocument();
  });

  it('shows clear button when allowClear and value is non-empty', () => {
    render(<Select value="red" onChange={() => {}} options={options} allowClear />);
    expect(screen.getByRole('button', { name: 'Clear' })).toBeInTheDocument();
  });

  it('calls onChange with empty string when clear button is clicked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Select value="red" onChange={onChange} options={options} allowClear />);
    await user.click(screen.getByRole('button', { name: 'Clear' }));
    expect(onChange).toHaveBeenCalledWith('');
  });

  it('does not show clear button when disabled', () => {
    render(<Select value="red" onChange={() => {}} options={options} allowClear disabled />);
    expect(screen.queryByRole('button', { name: 'Clear' })).not.toBeInTheDocument();
  });
});
