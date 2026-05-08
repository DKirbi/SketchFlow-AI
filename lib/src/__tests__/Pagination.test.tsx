import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Pagination } from '../ui/Pagination/Pagination';

describe('Pagination', () => {
  it('shows record count and page status', () => {
    render(
      <Pagination
        page={3}
        pageCount={47}
        total={312}
        pageSize={25}
        onPageChange={() => {}}
        pageSizeOptions={[10, 25, 50]}
        onPageSizeChange={() => {}}
      />,
    );
    expect(screen.getByText('312 records')).toBeInTheDocument();
    expect(screen.getByText('Page 3 of 47')).toBeInTheDocument();
  });

  it('uses singular record label for total 1', () => {
    render(
      <Pagination
        page={1}
        pageCount={1}
        total={1}
        pageSize={25}
        onPageChange={() => {}}
      />,
    );
    expect(screen.getByText('1 record')).toBeInTheDocument();
  });

  it('disables previous on first page', () => {
    render(
      <Pagination
        page={1}
        pageCount={5}
        total={100}
        pageSize={25}
        onPageChange={() => {}}
      />,
    );
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
  });

  it('disables next on last page', () => {
    render(
      <Pagination
        page={5}
        pageCount={5}
        total={100}
        pageSize={25}
        onPageChange={() => {}}
      />,
    );
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
  });

  it('calls onPageChange when next is clicked', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(
      <Pagination
        page={2}
        pageCount={5}
        total={100}
        pageSize={25}
        onPageChange={onPageChange}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Next page' }));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it('calls onPageSizeChange when page size select changes', async () => {
    const user = userEvent.setup();
    const onPageSizeChange = vi.fn();
    render(
      <Pagination
        page={1}
        pageCount={4}
        total={80}
        pageSize={25}
        onPageChange={() => {}}
        pageSizeOptions={[10, 25, 50]}
        onPageSizeChange={onPageSizeChange}
      />,
    );
    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByRole('option', { name: '10 per page' }));
    expect(onPageSizeChange).toHaveBeenCalledWith(10);
  });

  it('omits page size select when pageSizeOptions is omitted', () => {
    render(
      <Pagination
        page={1}
        pageCount={3}
        total={30}
        pageSize={25}
        onPageChange={() => {}}
      />,
    );
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
  });
});
