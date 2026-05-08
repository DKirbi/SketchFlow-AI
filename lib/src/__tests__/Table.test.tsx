import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import type { ColumnDef } from '@tanstack/react-table';
import { Table } from '../ui/Table/Table';

interface Person {
  id: string;
  name: string;
  age: number;
}

const columns: ColumnDef<Person, unknown>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'age', header: 'Age' },
];

const rows: Person[] = [
  { id: '1', name: 'Alice', age: 30 },
  { id: '2', name: 'Bob', age: 25 },
];

describe('Table', () => {
  it('renders column headers', () => {
    render(<Table columns={columns} rows={rows} />);
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();
  });

  it('renders row data', () => {
    render(<Table columns={columns} rows={rows} />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
  });

  it('shows empty text when rows is empty', () => {
    render(<Table columns={columns} rows={[]} />);
    expect(screen.getByText('No data')).toBeInTheDocument();
  });

  it('shows custom empty text', () => {
    render(<Table columns={columns} rows={[]} emptyText="Nothing here" />);
    expect(screen.getByText('Nothing here')).toBeInTheDocument();
  });

  it('renders emptySlot content instead of emptyText when provided', () => {
    render(
      <Table
        columns={columns}
        rows={[]}
        emptyText="Fallback text"
        emptySlot={<div data-testid="empty-slot">No teams yet</div>}
      />,
    );
    expect(screen.getByTestId('empty-slot')).toBeInTheDocument();
    expect(screen.queryByText('Fallback text')).not.toBeInTheDocument();
  });

  it('adds --slot modifier class on empty cell when emptySlot is provided', () => {
    const { container } = render(
      <Table
        columns={columns}
        rows={[]}
        emptySlot={<div>slot content</div>}
      />,
    );
    expect(container.querySelector('.table__empty--slot')).toBeInTheDocument();
  });

  it('does not add --slot modifier when only emptyText is provided', () => {
    const { container } = render(<Table columns={columns} rows={[]} />);
    expect(container.querySelector('.table__empty--slot')).not.toBeInTheDocument();
    expect(container.querySelector('.table__empty')).toBeInTheDocument();
  });

  it('renders hint text', () => {
    render(<Table columns={columns} rows={rows} hint="Showing 2 items" />);
    expect(screen.getByText('Showing 2 items')).toBeInTheDocument();
  });

  it('does not render hint when not provided', () => {
    const { container } = render(<Table columns={columns} rows={rows} />);
    expect(container.querySelector('.table-wrap__hint')).not.toBeInTheDocument();
  });

  it('renders expand icons when expandable', () => {
    const { container } = render(
      <Table
        columns={columns}
        rows={rows}
        expandable
        renderExpanded={(row) => <div>Detail for {row.original.name}</div>}
      />,
    );
    const expandCells = container.querySelectorAll('.table__td--expand');
    expect(expandCells).toHaveLength(2);
    expandCells.forEach((cell) => {
      expect(cell.querySelector('svg')).not.toBeNull();
    });
  });

  it('expands a row on click and shows detail', async () => {
    const user = userEvent.setup();
    render(
      <Table
        columns={columns}
        rows={rows}
        keyField="id"
        expandable
        renderExpanded={(row) => <div>Detail: {row.original.name}</div>}
      />,
    );
    const firstRow = screen.getByText('Alice').closest('tr')!;
    await user.click(firstRow);
    expect(screen.getByText('Detail: Alice')).toBeInTheDocument();
  });

  it('applies sticky parent row and omits duplicate collapse control when expandable (default)', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Table
        columns={columns}
        rows={rows}
        keyField="id"
        expandable
        renderExpanded={(row) => <div>Detail: {row.original.name}</div>}
      />,
    );
    const aliceRow = screen.getByText('Alice').closest('tr')!;
    await user.click(aliceRow);
    expect(container.querySelector('.table__row--expanded-sticky')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Collapse' })).not.toBeInTheDocument();
    await user.click(aliceRow);
    expect(screen.queryByText('Detail: Alice')).not.toBeInTheDocument();
  });

  it('omits sticky parent row when expandableStickyDetail is false', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Table
        columns={columns}
        rows={rows}
        keyField="id"
        expandable
        expandableStickyDetail={false}
        renderExpanded={(row) => <div>Detail: {row.original.name}</div>}
      />,
    );
    await user.click(screen.getByText('Alice').closest('tr')!);
    expect(container.querySelector('.table__row--expanded-sticky')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Collapse' })).not.toBeInTheDocument();
  });
});
