import type { Meta, StoryObj } from '@storybook/react';
import { LOFIEmptyState, LOFIButton } from 'lofi-kit';

const meta: Meta<typeof LOFIEmptyState> = {
  title: 'UI / EmptyState',
  component: LOFIEmptyState,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Centred placeholder for tables, cards, and panels that contain no data. Dashed border signals the empty/pending state. Three sub-cases — first-use, no-results, error — each with distinct copy and CTA semantics.',
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof LOFIEmptyState>;

export const FirstUse: Story = {
  args: {
    variant: 'first-use',
    title: 'No teams yet',
    description: 'Add your first team to get started.',
    action: <LOFIButton variant="primary">+ Add team</LOFIButton>,
  },
  parameters: {
    docs: { description: { story: 'No records have ever been created. Primary CTA to create the first record.' } },
  },
};

export const NoResults: Story = {
  args: {
    variant: 'no-results',
    title: 'No results for "Premier League"',
    description: 'Try adjusting your filters or clearing the search.',
    action: <LOFIButton variant="dismiss">Clear filters</LOFIButton>,
  },
  parameters: {
    docs: { description: { story: 'Records exist but the current filter returns none. Dismiss CTA to clear filters.' } },
  },
};

export const ErrorState: Story = {
  name: 'Error',
  args: {
    variant: 'error',
    title: 'Could not load teams',
    description: 'There was a problem retrieving the team list. Check your connection and try again.',
    action: <LOFIButton variant="default">Retry</LOFIButton>,
  },
  parameters: {
    docs: { description: { story: 'Data fetch failed. Default CTA to retry.' } },
  },
};

export const NoAction: Story = {
  args: {
    variant: 'first-use',
    title: 'No changelog entries yet',
    description: 'Changes to this record will appear here.',
  },
  parameters: {
    docs: { description: { story: 'action slot is optional — omit for read-only empty states.' } },
  },
};
