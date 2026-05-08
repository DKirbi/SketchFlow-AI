import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import {
  LOFIMainWorkspace,
  LOFIBadge,
  LOFIButton,
  LOFITabs,
  LOFIText,
  LOFIField,
  LOFIInput,
  LOFITable,
} from 'lofi-kit';
import type { ColumnDef } from 'lofi-kit';

const meta: Meta<typeof LOFIMainWorkspace> = {
  title: 'UI / MainWorkspace',
  component: LOFIMainWorkspace,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Stable main-pane frame for Unified Production Landscape (UPL) interfaces. Fixed zones: breadcrumb → title + badges → optional tab strip → scrollable body → optional sticky footer. Zone structure never moves when data changes — only slot content updates.',
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof LOFIMainWorkspace>;

// ── Minimal ──────────────────────────────────────────────────────────────────

export const Minimal: Story = {
  render: () => (
    <div style={{ height: 400 }}>
      <LOFIMainWorkspace title="Knockout Bracket — Champions League 24/25">
        <LOFIText variant="muted">Feature interface body goes here.</LOFIText>
      </LOFIMainWorkspace>
    </div>
  ),
  parameters: { docs: { description: { story: 'Title + body only — no breadcrumb, tabs, or footer.' } } },
};

// ── With breadcrumb + badges ──────────────────────────────────────────────────

export const WithHeader: Story = {
  render: () => (
    <div style={{ height: 400 }}>
      <LOFIMainWorkspace
        breadcrumb={
          <LOFIText variant="muted">International Clubs › Champions League</LOFIText>
        }
        title="Knockout Bracket — Champions League 24/25"
        titleBadges={<LOFIBadge variant="tag" label="SIMPLE TOURNAMENT" />}
      >
        <LOFIText variant="muted">Feature interface body.</LOFIText>
      </LOFIMainWorkspace>
    </div>
  ),
  parameters: { docs: { description: { story: 'With breadcrumb path and status badge next to the title.' } } },
};

// ── With tabs ─────────────────────────────────────────────────────────────────

const competitorCols: ColumnDef<{ id: string; name: string; group: string }>[] = [
  { accessorKey: 'name', header: 'Team', meta: {} },
  { accessorKey: 'group', header: 'Group', meta: { shrink: true } },
];
const competitors = [
  { id: '1', name: 'Real Madrid CF', group: 'Group A' },
  { id: '2', name: 'Manchester City FC', group: 'Group A' },
  { id: '3', name: 'FC Bayern München', group: 'Group B' },
  { id: '4', name: 'Paris Saint-Germain', group: 'Group B' },
];

function WithTabsDemo() {
  const [tab, setTab] = useState('competitors');
  return (
    <div style={{ height: 480 }}>
      <LOFIMainWorkspace
        breadcrumb={
          <LOFIText variant="muted">International Clubs › Champions League</LOFIText>
        }
        title="Knockout Bracket — Champions League 24/25"
        titleBadges={<LOFIBadge variant="tag" label="SIMPLE TOURNAMENT" />}
        tabs={
          <LOFITabs
            value={tab}
            onChange={setTab}
            tabs={[
              { value: 'admin', label: 'Admin' },
              { value: 'competitors', label: 'Competitors' },
              { value: 'matches', label: 'Matches' },
              { value: 'changelog', label: 'Change log' },
            ]}
          />
        }
        footer={
          <>
            <LOFIButton variant="dismiss">Reset changes</LOFIButton>
            <LOFIButton variant="primary">Save changes</LOFIButton>
          </>
        }
      >
        {tab === 'admin' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <LOFIField label="Competition name" htmlFor="comp-name">
              <LOFIInput id="comp-name" value="Champions League 24/25" onChange={() => {}} />
            </LOFIField>
            <LOFIField label="Season" htmlFor="season">
              <LOFIInput id="season" value="2024/25" onChange={() => {}} />
            </LOFIField>
          </div>
        )}
        {tab === 'competitors' && (
          <LOFITable columns={competitorCols} rows={competitors} />
        )}
        {tab === 'matches' && (
          <LOFIText variant="muted">No matches scheduled yet.</LOFIText>
        )}
        {tab === 'changelog' && (
          <LOFIText variant="muted">No changes recorded yet.</LOFIText>
        )}
      </LOFIMainWorkspace>
    </div>
  );
}

export const WithTabs: Story = {
  render: () => <WithTabsDemo />,
  parameters: {
    docs: {
      description: {
        story:
          'Full UPL main pane: breadcrumb, title + badge, LOFITabs, scrollable body, sticky footer with Save/Reset actions.',
      },
    },
  },
};

// ── Read-only (no footer) ─────────────────────────────────────────────────────

export const ReadOnly: Story = {
  render: () => (
    <div style={{ height: 400 }}>
      <LOFIMainWorkspace
        breadcrumb={<LOFIText variant="muted">Soccer › Premier League</LOFIText>}
        title="Premier League 2024/25"
        titleBadges={<LOFIBadge variant="status" label="LIVE" active />}
      >
        <LOFIText variant="muted">Read-only view — no footer actions rendered.</LOFIText>
      </LOFIMainWorkspace>
    </div>
  ),
  parameters: { docs: { description: { story: 'Omit footer for read-only surfaces.' } } },
};
