import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { useState } from 'react';
import { Tabs } from '../ui/Tabs/Tabs';

const tabDefs = [
  { value: 'a', label: 'Alpha' },
  { value: 'b', label: 'Beta' },
  { value: 'c', label: 'Gamma' },
];

function StatefulTabs(props: { tabs?: typeof tabDefs }) {
  const [value, setValue] = useState('a');
  return (
    <Tabs
      value={value}
      onChange={setValue}
      tabs={props.tabs ?? tabDefs}
      ariaLabel="Demo tabs"
    />
  );
}

describe('Tabs', () => {
  it('renders all tab labels', () => {
    render(<Tabs value="a" onChange={() => {}} tabs={tabDefs} />);
    expect(screen.getByRole('tab', { name: /Alpha/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Beta/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Gamma/i })).toBeInTheDocument();
  });

  it('sets aria-selected on the active tab only', () => {
    render(<Tabs value="b" onChange={() => {}} tabs={tabDefs} />);
    const tabs = screen.getAllByRole('tab');
    expect(tabs[0]).toHaveAttribute('aria-selected', 'false');
    expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
    expect(tabs[2]).toHaveAttribute('aria-selected', 'false');
  });

  it('applies active class to selected tab', () => {
    render(<Tabs value="c" onChange={() => {}} tabs={tabDefs} />);
    expect(screen.getByRole('tab', { name: /Gamma/i })).toHaveClass('tabs__tab--active');
  });

  it('calls onChange when an inactive tab is clicked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Tabs value="a" onChange={onChange} tabs={tabDefs} />);
    await user.click(screen.getByRole('tab', { name: /Beta/i }));
    expect(onChange).toHaveBeenCalledWith('b');
  });

  it('does not call onChange when the active tab is clicked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Tabs value="a" onChange={onChange} tabs={tabDefs} />);
    await user.click(screen.getByRole('tab', { name: /Alpha/i }));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('does not call onChange when a disabled tab is clicked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Tabs
        value="a"
        onChange={onChange}
        tabs={[
          { value: 'a', label: 'Alpha' },
          { value: 'b', label: 'Beta', disabled: true },
        ]}
      />,
    );
    await user.click(screen.getByRole('tab', { name: /Beta/i }));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('moves selection with ArrowRight', async () => {
    const user = userEvent.setup();
    render(<StatefulTabs />);
    const alpha = screen.getByRole('tab', { name: /Alpha/i });
    alpha.focus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: /Beta/i })).toHaveAttribute('aria-selected', 'true');
  });

  it('renders tablist role', () => {
    render(<Tabs value="a" onChange={() => {}} tabs={tabDefs} ariaLabel="Sections" />);
    expect(screen.getByRole('tablist')).toHaveAttribute('aria-label', 'Sections');
  });
});
