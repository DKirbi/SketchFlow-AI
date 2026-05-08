import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { LOFITabs, LOFIText } from 'lofi-kit';

const meta: Meta<typeof LOFITabs> = {
  title: 'UI / Tabs',
  component: LOFITabs,
  parameters: {
    docs: {
      description: {
        component:
          'Underline tab strip for named parallel views. Parent owns panel content. Optional leading icon and trailing badge (`LOFIBadge`). Not for sequential wizards (`LOFISteps`) or whole-surface mode switches (`LOFIToggle`).',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof LOFITabs>;

const basicTabs = [
  { value: 'details', label: 'Details' },
  { value: 'players', label: 'Players' },
  { value: 'fixtures', label: 'Fixtures' },
  { value: 'history', label: 'History' },
];

function TabsPlayground() {
  const [value, setValue] = useState('details');
  return (
    <>
      <LOFITabs value={value} onChange={setValue} tabs={basicTabs} ariaLabel="Team sections" />
      <LOFIText as="p" variant="muted">
        Active:&nbsp;
        {value}
      </LOFIText>
    </>
  );
}

export const Default: Story = {
  render: () => <TabsPlayground />,
};

function TabsWithBadgesDemo() {
  const [value, setValue] = useState('markets');
  return (
    <LOFITabs
      value={value}
      onChange={setValue}
      ariaLabel="Markets"
      tabs={[
        { value: 'markets', label: 'All markets', badge: '24', badgeVariant: 'id' },
        { value: 'live', label: 'Live', badge: '3', badgeVariant: 'id' },
        { value: 'closed', label: 'Closed', badge: '21', badgeVariant: 'id' },
      ]}
    />
  );
}

export const WithBadges: Story = {
  render: () => <TabsWithBadgesDemo />,
};

function TabGlyph({ ch }: { ch: string }) {
  return <LOFIText as="span" variant="subtle">{ch}</LOFIText>;
}

function TabsWithLeadingIconsDemo() {
  const [value, setValue] = useState('admin');
  return (
    <LOFITabs
      value={value}
      onChange={setValue}
      ariaLabel="Sub-views"
      tabs={[
        { value: 'admin', label: 'Admin', icon: <TabGlyph ch="◆" /> },
        { value: 'competitors', label: 'Competitors', icon: <TabGlyph ch="◇" /> },
        { value: 'matches', label: 'Matches', icon: <TabGlyph ch="○" /> },
      ]}
    />
  );
}

export const WithLeadingIcons: Story = {
  render: () => <TabsWithLeadingIconsDemo />,
};

function TabsWithDisabledDemo() {
  const [value, setValue] = useState('general');
  return (
    <LOFITabs
      value={value}
      onChange={setValue}
      ariaLabel="Feature sections"
      tabs={[
        { value: 'general', label: 'General' },
        { value: 'perms', label: 'Permissions', disabled: true },
        { value: 'changelog', label: 'Change log' },
      ]}
    />
  );
}

export const WithDisabledTab: Story = {
  render: () => <TabsWithDisabledDemo />,
};
