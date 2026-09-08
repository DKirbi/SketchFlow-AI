import type { Meta, StoryObj } from '@storybook/react';
import { LOFIButton, LOFIText, LOFIToolbar } from 'lofi-kit';

const meta: Meta<typeof LOFIToolbar> = {
  title: 'LOW FI Design system/Primitives/Toolbar',
  component: LOFIToolbar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Horizontal chrome with left / centre / right slots. Use for app-level upper bars and step-navigation headers. For the P1.1 product bar with action roles, prefer the `upper-bar` component set.',
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof LOFIToolbar>;

export const UpperBar: Story = {
  args: {
    left: <LOFIText as="span" variant="strong">Tournament management</LOFIText>,
    right: (
      <>
        <LOFIButton variant="dismiss" size="compact">Applications</LOFIButton>
        <LOFIButton variant="dismiss" size="compact">Configuration</LOFIButton>
      </>
    ),
  },
  parameters: { docs: { description: { story: 'Identity on the left, compact dismiss actions on the right (P1.1).' } } },
};

export const WithCenter: Story = {
  args: {
    left: <LOFIText as="span" variant="strong">Mapping</LOFIText>,
    center: <LOFIText as="span" variant="muted">12 mapped · 4 pending</LOFIText>,
    right: <LOFIText as="span" variant="micro">j.smith · Operator</LOFIText>,
  },
  parameters: { docs: { description: { story: 'Centre slot is a `nav` — use for counts or in-bar navigation.' } } },
};
