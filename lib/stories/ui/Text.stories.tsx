import type { Meta, StoryObj } from '@storybook/react';
import { LOFIText } from 'lofi-kit';

const meta: Meta<typeof LOFIText> = {
  title: 'UI / Text',
  component: LOFIText,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Typography primitive. Uses `$text-font-family` (Courier New stack). Use `inherit` inside buttons, badges, and other blocks that already define size and color in BEM.',
      },
    },
  },
  args: { as: 'p', children: 'Body copy for prototyping — short, neutral, and readable.' },
};
export default meta;
type Story = StoryObj<typeof LOFIText>;

export const Body: Story = {
  args: { variant: 'body' },
};

export const Inherit: Story = {
  args: {
    as: 'span',
    variant: 'inherit',
    children: 'Inherits size and color from parent',
    style: { fontSize: 18, fontWeight: 700, color: '#111' },
  },
};

export const Muted: Story = {
  args: { variant: 'muted', as: 'p' },
};

export const Caps: Story = {
  args: { variant: 'caps', as: 'span', children: 'OVERLINE LABEL' },
};
