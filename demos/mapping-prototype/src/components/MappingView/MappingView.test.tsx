import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MappingView } from './MappingView';

describe('MappingView', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('shows flavoured tabs and chip counts for the players catalog', () => {
    render(<MappingView />);
    expect(screen.getByRole('heading', { name: 'Wizarding mapping' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Players & houses' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'All (8)' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Unmapped (6)' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Mapped (2)' })).toBeInTheDocument();
  });

  it('applies commit search and chip scope', () => {
    render(<MappingView />);

    fireEvent.change(screen.getByLabelText('Name or ID'), { target: { value: 'Cedric' } });
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));
    expect(screen.getByText('Cedric Diggory')).toBeInTheDocument();
    expect(screen.queryByText('Viktor Krum')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Clear all' }));
    fireEvent.click(screen.getByRole('button', { name: 'Unmapped (6)' }));
    expect(screen.queryByText('Harry Potter')).not.toBeInTheDocument();
    expect(screen.getByText('Cedric Diggory')).toBeInTheDocument();
  });

  it('expands to at least ten suggestions and Map on All keeps the row', () => {
    render(<MappingView />);

    const row = screen.getByText('hp-pl-003').closest('tr');
    expect(row).toBeTruthy();
    fireEvent.click(row!);

    const mapButtons = screen.getAllByRole('button', { name: 'Map' });
    expect(mapButtons.length).toBeGreaterThanOrEqual(10);

    fireEvent.click(mapButtons[0]!);
    act(() => {
      vi.advanceTimersByTime(800);
    });

    expect(screen.getByText('hp-pl-003')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Mapped (3)' })).toBeInTheDocument();
  });

  it('holds then removes a mapped row from Unmapped', () => {
    render(<MappingView />);

    fireEvent.click(screen.getByRole('button', { name: 'Unmapped (6)' }));
    fireEvent.click(screen.getByText('hp-pl-003').closest('tr')!);
    fireEvent.click(screen.getAllByRole('button', { name: 'Map' })[0]!);

    act(() => {
      vi.advanceTimersByTime(800);
    });
    expect(screen.getByText('hp-pl-003')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1100);
    });
    expect(screen.queryByText('hp-pl-003')).not.toBeInTheDocument();
  });

  it('places tabs above status chips and omits the table hint', () => {
    render(<MappingView />);
    const tabs = screen.getByRole('tablist');
    const chips = screen.getByRole('group', { name: 'Mapping status' });
    expect(tabs.compareDocumentPosition(chips) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(screen.queryByText(/Expand a row to rank/i)).not.toBeInTheDocument();
  });
});

describe('MappingView catalog switch', () => {
  it('loads the film catalogue from the toolbar dropdown', async () => {
    const user = userEvent.setup();
    render(<MappingView />);

    await user.click(screen.getByLabelText('Mock database'));
    await user.click(screen.getByRole('option', { name: 'Film catalogue' }));

    expect(screen.getByRole('heading', { name: 'Film mapping' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Titles' })).toBeInTheDocument();
    expect(screen.getByText('fl-ti-003')).toBeInTheDocument();
    expect(screen.queryByText('hp-pl-003')).not.toBeInTheDocument();
  });
});
