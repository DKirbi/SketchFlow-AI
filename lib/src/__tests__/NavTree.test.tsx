import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { NavTree } from '../ui/NavTree/NavTree';

const sampleItems = [
  {
    id: 'soccer',
    label: 'Soccer',
    children: [
      {
        id: 'ucl',
        label: 'Champions League',
        children: [
          { id: 'ucl-ko', label: 'Knockout Bracket' },
          { id: 'ucl-gs', label: 'Group Stage' },
        ],
      },
    ],
  },
  {
    id: 'basketball',
    label: 'Basketball',
    children: [],
  },
];

describe('NavTree', () => {
  it('renders root branch labels', () => {
    render(<NavTree items={sampleItems} />);
    expect(screen.getByText('Soccer')).toBeInTheDocument();
    expect(screen.getByText('Basketball')).toBeInTheDocument();
  });

  it('hides children while branch is collapsed', () => {
    render(<NavTree items={sampleItems} />);
    expect(screen.queryByText('Champions League')).not.toBeInTheDocument();
  });

  it('reveals children when branch is expanded', async () => {
    const user = userEvent.setup();
    render(<NavTree items={sampleItems} />);
    await user.click(screen.getByRole('button', { name: /expand soccer/i }));
    expect(await screen.findByText('Champions League')).toBeInTheDocument();
  });

  it('calls onSelect when a leaf is clicked', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <NavTree
        items={sampleItems}
        expandedIds={['soccer', 'ucl']}
        onSelect={onSelect}
      />,
    );
    await user.click(screen.getByText('Knockout Bracket'));
    expect(onSelect).toHaveBeenCalledWith('ucl-ko');
  });

  it('marks the selected leaf with aria-selected', () => {
    render(
      <NavTree
        items={sampleItems}
        expandedIds={['soccer', 'ucl']}
        selectedId="ucl-ko"
      />,
    );
    const li = screen.getByText('Knockout Bracket').closest('[role="treeitem"]');
    expect(li).toHaveAttribute('aria-selected', 'true');
  });

  it('uses controlled expandedIds', async () => {
    const user = userEvent.setup();
    const onExpandChange = vi.fn();
    render(
      <NavTree
        items={sampleItems}
        expandedIds={[]}
        onExpandChange={onExpandChange}
      />,
    );
    await user.click(screen.getByRole('button', { name: /expand soccer/i }));
    expect(onExpandChange).toHaveBeenCalledWith(['soccer']);
  });

  it('adds nav-tree__item--selected class on selected leaf', () => {
    render(
      <NavTree
        items={sampleItems}
        expandedIds={['soccer', 'ucl']}
        selectedId="ucl-gs"
      />,
    );
    const li = screen.getByText('Group Stage').closest('li');
    expect(li).toHaveClass('nav-tree__item--selected');
  });

  it('renders tree role on root', () => {
    const { container } = render(<NavTree items={sampleItems} />);
    expect(container.querySelector('[role="tree"]')).toBeInTheDocument();
  });
});
