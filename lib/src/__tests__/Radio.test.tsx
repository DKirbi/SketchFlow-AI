import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Radio } from '../ui/Radio/Radio';

const options = [
  { value: 'a', label: 'Alpha' },
  { value: 'b', label: 'Beta' },
  { value: 'c', label: 'Gamma' },
];

describe('Radio', () => {
  it('renders all options', () => {
    render(<Radio value="a" onChange={() => {}} options={options} name="grp" />);
    expect(screen.getByText('Alpha')).toBeInTheDocument();
    expect(screen.getByText('Beta')).toBeInTheDocument();
    expect(screen.getByText('Gamma')).toBeInTheDocument();
  });

  it('checks the matching option', () => {
    render(<Radio value="b" onChange={() => {}} options={options} name="grp" />);
    const radios = screen.getAllByRole('radio');
    expect(radios[0]).not.toBeChecked();
    expect(radios[1]).toBeChecked();
    expect(radios[2]).not.toBeChecked();
  });

  it('calls onChange with new value on selection', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Radio value="a" onChange={onChange} options={options} name="grp" />);
    await user.click(screen.getByText('Gamma'));
    expect(onChange).toHaveBeenCalledWith('c');
  });

  it('sets role="radiogroup" on the wrapper', () => {
    render(<Radio value="a" onChange={() => {}} options={options} name="grp" />);
    expect(screen.getByRole('radiogroup')).toBeInTheDocument();
  });

  it('shares the name attribute across all radios', () => {
    render(<Radio value="a" onChange={() => {}} options={options} name="color" />);
    screen.getAllByRole('radio').forEach((radio) => {
      expect(radio).toHaveAttribute('name', 'color');
    });
  });

  it('disables all radios when disabled', () => {
    render(<Radio value="a" onChange={() => {}} options={options} name="grp" disabled />);
    screen.getAllByRole('radio').forEach((radio) => {
      expect(radio).toBeDisabled();
    });
  });

  it('disables individual options', () => {
    const opts = [
      { value: 'x', label: 'X' },
      { value: 'y', label: 'Y', disabled: true },
    ];
    render(<Radio value="x" onChange={() => {}} options={opts} name="grp" />);
    expect(screen.getAllByRole('radio')[0]).not.toBeDisabled();
    expect(screen.getAllByRole('radio')[1]).toBeDisabled();
  });

  it('applies column layout class', () => {
    const { container } = render(
      <Radio value="a" onChange={() => {}} options={options} name="grp" layout="column" />,
    );
    expect(container.querySelector('.radio-group--column')).toBeInTheDocument();
  });

  it('applies disabled class to group wrapper', () => {
    const { container } = render(
      <Radio value="a" onChange={() => {}} options={options} name="grp" disabled />,
    );
    expect(container.querySelector('.radio-group--disabled')).toBeInTheDocument();
  });
});
