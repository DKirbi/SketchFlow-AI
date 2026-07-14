import type { Meta, StoryObj } from '@storybook/react';
import type { ComponentProps } from 'react';
import { useState } from 'react';
import { LOFIField, LOFIMultiSelect } from 'lofi-kit';

const tournamentOptions = Array.from({ length: 12 }, (_, i) => ({
  value: `st_${i + 1}`,
  label: `ST-${1000 + i} — Tournament ${i + 1}`,
}));

const ALL = '__all__';

function MultiSelectDemo(
  props: Omit<ComponentProps<typeof LOFIMultiSelect>, 'value' | 'onChange'> & {
    initialValue?: string[];
  },
) {
  const { initialValue = [], ...rest } = props;
  const [value, setValue] = useState(initialValue);
  return (
    <LOFIField label="Simple tournaments" htmlFor="ms-demo">
      <LOFIMultiSelect id="ms-demo" value={value} onChange={setValue} {...rest} />
    </LOFIField>
  );
}

const meta: Meta<typeof LOFIMultiSelect> = {
  title: 'UI / MultiSelect',
  component: LOFIMultiSelect,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Searchable multi-select dropdown with checkbox-leading menu rows. Closed trigger shows a single label, placeholder, or “Multiple Entries” when two or more values are selected.',
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof LOFIMultiSelect>;

export const Default: Story = {
  render: () => (
    <MultiSelectDemo
      options={tournamentOptions.slice(0, 5)}
      placeholder="Select tournaments"
      searchable
    />
  ),
};

export const WithAllOption: Story = {
  render: () => (
    <MultiSelectDemo
      options={tournamentOptions}
      placeholder="Select tournaments"
      searchable
      searchPlaceholder="Search simple tournaments"
      allValue={ALL}
      allLabel="All"
      initialValue={[ALL]}
    />
  ),
};

export const MultipleEntries: Story = {
  render: () => (
    <MultiSelectDemo
      options={tournamentOptions}
      placeholder="Select tournaments"
      searchable
      allValue={ALL}
      initialValue={['st_1', 'st_2', 'st_3']}
      multipleLabel="Multiple Entries"
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Two or more selections collapse to the multipleLabel on the closed trigger.',
      },
    },
  },
};
