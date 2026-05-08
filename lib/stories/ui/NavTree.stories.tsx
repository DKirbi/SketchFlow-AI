import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { LOFINavTree, type NavTreeItem } from 'lofi-kit';

const meta: Meta<typeof LOFINavTree> = {
  title: 'UI / NavTree',
  component: LOFINavTree,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Hierarchical sidebar navigation for UPL interfaces. Branch nodes expand and collapse (Radix Collapsible, bundled). Single-leaf selection. Uncontrolled by default; pass `expandedIds` + `onExpandChange` for controlled expansion.',
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof LOFINavTree>;

const uclTree: NavTreeItem[] = [
  {
    id: 'soccer',
    label: 'Soccer',
    children: [
      {
        id: 'intl-clubs',
        label: 'International clubs',
        children: [
          {
            id: 'ucl',
            label: 'Champions League',
            children: [
              { id: 'ucl-ko', label: 'Knockout Bracket — CL' },
              { id: 'ucl-gs', label: 'Group Stage — CL' },
            ],
          },
          {
            id: 'pl',
            label: 'Premier League',
            children: [
              { id: 'pl-s24', label: 'Season 24/25' },
            ],
          },
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

function NavTreeUncontrolledDemo() {
  const [selected, setSelected] = useState<string | undefined>(undefined);
  return (
    <div style={{ width: 280, fontFamily: 'monospace', border: '1px solid #bbb', padding: 8 }}>
      <LOFINavTree
        items={uclTree}
        selectedId={selected}
        onSelect={setSelected}
      />
    </div>
  );
}

export const Uncontrolled: Story = {
  render: () => <NavTreeUncontrolledDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Uncontrolled expand state. Branches open/close internally. Selection is controlled externally.',
      },
    },
  },
};

function NavTreeControlledDemo() {
  const [selected, setSelected] = useState<string>('ucl-ko');
  const [expanded, setExpanded] = useState<string[]>(['soccer', 'intl-clubs', 'ucl']);
  return (
    <div style={{ width: 280, fontFamily: 'monospace', border: '1px solid #bbb', padding: 8 }}>
      <LOFINavTree
        items={uclTree}
        selectedId={selected}
        onSelect={setSelected}
        expandedIds={expanded}
        onExpandChange={setExpanded}
      />
    </div>
  );
}

export const Controlled: Story = {
  render: () => <NavTreeControlledDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Controlled expand state with a pre-selected leaf. Pass `expandedIds` + `onExpandChange` when the parent needs to manage which branches are open (e.g. to persist state across route changes).',
      },
    },
  },
};

export const Empty: Story = {
  render: () => (
    <div style={{ width: 280, fontFamily: 'monospace', border: '1px solid #bbb', padding: 8 }}>
      <LOFINavTree items={[]} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Empty tree — sidebar content is gated by the filter query row; show this state until a filter is applied.',
      },
    },
  },
};
