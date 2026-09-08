import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { MappingExample } from '../examples/mapping/MappingExample';

describe('MappingExample', () => {
  it('renders checkboxes and bulk map toolbar', () => {
    render(<MappingExample />);

    expect(screen.getByRole('button', { name: /Bulk Map/i })).toBeInTheDocument();
    expect(screen.getAllByRole('checkbox').length).toBeGreaterThan(0);
  });

  it('maps a pending row and shows a status message', async () => {
    const user = userEvent.setup();

    render(<MappingExample />);

    const mapButtons = screen.getAllByRole('button', { name: /^Map$/i });
    await user.click(mapButtons[0]!);

    await waitFor(
      () => {
        expect(screen.getByText(/Mapping saved to external catalogue/i)).toBeInTheDocument();
      },
      { timeout: 3000 },
    );
  });

  it('filters rows when title search is committed', async () => {
    const user = userEvent.setup();

    render(<MappingExample />);

    await user.type(screen.getByLabelText(/Title/i), 'oldboy');
    await user.click(screen.getByRole('button', { name: /^Search$/i }));

    expect(screen.getByText('Oldboy')).toBeInTheDocument();
    expect(screen.queryByText('Amelie')).not.toBeInTheDocument();
  });

  it('switches the mock database to the wizarding catalogue', async () => {
    const user = userEvent.setup();

    render(<MappingExample />);

    await user.click(screen.getByLabelText('Mock database'));
    await user.click(screen.getByRole('option', { name: 'Wizarding world' }));

    expect(screen.getByText('hp-pl-002')).toBeInTheDocument();
    expect(screen.queryByText('FSD-1003')).not.toBeInTheDocument();
  });
});
