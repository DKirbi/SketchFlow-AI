import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { LOFIField, LOFITextarea } from 'lofi-kit';

const meta: Meta<typeof LOFITextarea> = {
  title: 'UI / Textarea',
  component: LOFITextarea,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Multi-line text entry. Matches LOFIInput borders and typography; vertical resize with a small corner hint. Use inside LOFIField for label binding.',
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof LOFITextarea>;

const Controlled = (
  args: Omit<React.ComponentProps<typeof LOFITextarea>, 'value' | 'onChange'>,
) => {
  const [value, setValue] = useState('');
  return <LOFITextarea {...args} value={value} onChange={setValue} />;
};

export const Default: Story = {
  render: () => (
    <Controlled placeholder="Add notes…" rows={4} id="notes-story" />
  ),
};

function TextareaInFieldDemo() {
  const [value, setValue] = useState('Pre-filled content.');
  return (
    <LOFIField label="Notes" htmlFor="notes-field" hint="Optional context for stakeholders.">
      <LOFITextarea id="notes-field" value={value} onChange={setValue} rows={4} />
    </LOFIField>
  );
}

export const InField: Story = {
  render: () => <TextareaInFieldDemo />,
};

export const Compact: Story = {
  render: () => <Controlled size="compact" rows={3} id="compact-notes" />,
};
