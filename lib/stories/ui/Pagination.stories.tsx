import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { LOFIPagination } from 'lofi-kit';

const meta: Meta<typeof LOFIPagination> = {
  title: 'UI / Pagination',
  component: LOFIPagination,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Table footer control: record count, previous/next compact buttons, page indicator, optional page-size select. Wire pageIndex (0-based) + pageSize from TanStack Table as shown in Patterns.md.',
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof LOFIPagination>;

function PaginationDefaultDemo() {
  const [page, setPage] = useState(3);
  const [pageSize, setPageSize] = useState(25);
  const total = 312;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  return (
    <LOFIPagination
      page={page}
      pageCount={pageCount}
      total={total}
      pageSize={pageSize}
      onPageChange={setPage}
      pageSizeOptions={[10, 25, 50, 100]}
      onPageSizeChange={(size) => {
        setPageSize(size);
        setPage(1);
      }}
    />
  );
}

export const Default: Story = {
  render: () => <PaginationDefaultDemo />,
};

function PaginationWithoutPageSizeDemo() {
  const [page, setPage] = useState(1);
  return (
    <LOFIPagination
      page={page}
      pageCount={7}
      total={70}
      pageSize={10}
      onPageChange={setPage}
    />
  );
}

export const WithoutPageSize: Story = {
  render: () => <PaginationWithoutPageSizeDemo />,
};

export const FirstPage: Story = {
  render: () => (
    <LOFIPagination
      page={1}
      pageCount={12}
      total={120}
      pageSize={10}
      onPageChange={() => {}}
      pageSizeOptions={[10, 25]}
      onPageSizeChange={() => {}}
    />
  ),
};

export const Disabled: Story = {
  render: () => (
    <LOFIPagination
      page={2}
      pageCount={5}
      total={48}
      pageSize={10}
      onPageChange={() => {}}
      pageSizeOptions={[10, 25]}
      onPageSizeChange={() => {}}
      disabled
    />
  ),
};
