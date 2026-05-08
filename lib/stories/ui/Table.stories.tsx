import type { Meta, StoryObj } from '@storybook/react';
import { LOFIBadge, LOFIButton, LOFITable, type ColumnDef } from 'lofi-kit';

/** Abstract row shape for demos only */
interface DemoRow {
  id: string;
  label: string;
  metric: number;
  state: string;
  pool: string;
}

const columns: ColumnDef<DemoRow, unknown>[] = [
  { accessorKey: 'label',  header: 'Label' },
  { accessorKey: 'pool',   header: 'Pool' },
  { accessorKey: 'metric', header: 'Metric' },
  {
    accessorKey: 'state',
    header: 'State',
    cell: ({ getValue }) => <LOFIBadge label={getValue() as string} variant="status" active={getValue() === 'On'} />,
  },
  {
    id: 'actions',
    header: '',
    cell: () => <LOFIButton variant="default" size="compact">Action</LOFIButton>,
  },
];

const rows: DemoRow[] = [
  { id: '1', label: 'Item Alpha',   state: 'On',  metric: 3, pool: 'North' },
  { id: '2', label: 'Item Beta',    state: 'On',  metric: 2, pool: 'North' },
  { id: '3', label: 'Item Gamma',   state: 'Off', metric: 1, pool: 'South' },
  { id: '4', label: 'Item Delta',   state: 'Off', metric: 0, pool: 'South' },
];

const meta: Meta<typeof LOFITable<DemoRow>> = {
  title: 'UI / Table',
  component: LOFITable,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Dense data list powered by TanStack Table. Supports sortable columns, inline controls, and expandable rows.',
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof LOFITable<DemoRow>>;

export const Default: Story = {
  args: {
    keyField: 'id',
    sortable: false,
    expandable: false,
    hint: undefined,
    emptyText: 'No data',
  },
  render: (args) => (
    <LOFITable
      columns={columns}
      rows={rows}
      keyField={args.keyField}
      sortable={args.sortable}
      expandable={args.expandable}
      hint={args.hint}
      emptyText={args.emptyText}
    />
  ),
  parameters: { docs: { description: { story: 'Structured rows with labels, optional sorting, and inline actions.' } } },
};

export const WithHint: Story = {
  args: {
    keyField: 'id',
    sortable: false,
    expandable: false,
    hint: 'Prototype hint — e.g. filter summary or row count.',
    emptyText: 'No data',
  },
  render: (args) => (
    <LOFITable
      columns={columns}
      rows={rows}
      keyField={args.keyField}
      sortable={args.sortable}
      expandable={args.expandable}
      hint={args.hint}
      emptyText={args.emptyText}
    />
  ),
  parameters: { docs: { description: { story: 'Optional helper line above the column headers provides context.' } } },
};

export const Sortable: Story = {
  args: {
    keyField: 'id',
    sortable: true,
    expandable: false,
    emptyText: 'No data',
  },
  render: (args) => (
    <LOFITable
      columns={columns}
      rows={rows}
      keyField={args.keyField}
      sortable={args.sortable}
      expandable={args.expandable}
      hint={args.hint}
      emptyText={args.emptyText}
    />
  ),
  parameters: { docs: { description: { story: 'Click a column header to sort ascending, click again for descending.' } } },
};

export const Expandable: Story = {
  args: {
    keyField: 'id',
    sortable: false,
    expandable: true,
    emptyText: 'No data',
  },
  render: (args) => (
    <LOFITable
      columns={columns}
      rows={rows}
      keyField={args.keyField}
      sortable={args.sortable}
      expandable={args.expandable}
      hint={args.hint}
      emptyText={args.emptyText}
      renderExpanded={(row) => (
        <div>
          <strong>ID:</strong> {row.original.id} &nbsp;·&nbsp;
          <strong>Pool:</strong> {row.original.pool} &nbsp;·&nbsp;
          <strong>Metric:</strong> {row.original.metric}
        </div>
      )}
    />
  ),
  parameters: { docs: { description: { story: 'Click any row to expand sub-records or detail. Toggle via ▶/▼ in the first column — no animation.' } } },
};

export const Empty: Story = {
  args: {
    keyField: 'id',
    sortable: false,
    expandable: false,
    emptyText: 'No rows yet — add data or adjust filters.',
  },
  render: (args) => (
    <LOFITable
      columns={columns}
      rows={[]}
      keyField={args.keyField}
      sortable={args.sortable}
      expandable={args.expandable}
      hint={args.hint}
      emptyText={args.emptyText}
    />
  ),
  parameters: { docs: { description: { story: 'Empty state shown when the rows array is empty.' } } },
};
