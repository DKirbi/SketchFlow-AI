import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { MergeToolExample } from '../examples/merge-tool/MergeToolExample';

describe('MergeToolExample', () => {
  it('stacks the database and crawler tables instead of placing them side by side', () => {
    const { container } = render(<MergeToolExample />);

    const stack = container.querySelector('.merge-tool-example__stack');
    const dbHeading = screen.getByRole('heading', { name: 'Our Database' });
    const crawlerHeading = screen.getByRole('heading', { name: 'Crawler Matches' });

    expect(stack).toBeTruthy();
    expect(dbHeading.compareDocumentPosition(crawlerHeading) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it('paginates Our Database at five rows and keeps later titles on the next page', async () => {
    const user = userEvent.setup();

    render(<MergeToolExample />);

    expect(screen.getByText('Das Leben Der Anderen')).toBeInTheDocument();
    expect(screen.getByText('Amelie')).toBeInTheDocument();
    expect(screen.queryByText('PARASITE')).not.toBeInTheDocument();

    const dbPager = screen.getByRole('navigation', { name: 'Our Database pagination' });
    expect(dbPager).toHaveTextContent('14 records');
    expect(dbPager).toHaveTextContent('Page 1 of 3');

    await user.click(within(dbPager).getByRole('button', { name: 'Next page' }));

    expect(screen.getByText('PARASITE')).toBeInTheDocument();
    expect(screen.queryByText('Amelie')).not.toBeInTheDocument();
    expect(dbPager).toHaveTextContent('Page 2 of 3');
  });

  it('paginates crawler matches after a database row is selected', async () => {
    const user = userEvent.setup();

    render(<MergeToolExample />);

    await user.click(screen.getAllByRole('radio')[0]!);

    const crawlerPager = screen.getByRole('navigation', { name: 'Crawler Matches pagination' });
    expect(crawlerPager).toHaveTextContent('3 records');
    expect(crawlerPager).toHaveTextContent('Page 1 of 1');
    expect(within(crawlerPager).getByRole('button', { name: 'Next page' })).toBeDisabled();
  });

  it('switches the mock database to the wizarding catalogue', async () => {
    const user = userEvent.setup();

    render(<MergeToolExample />);

    expect(screen.getByText('Amelie')).toBeInTheDocument();

    await user.click(screen.getByLabelText('Mock database'));
    await user.click(screen.getByRole('option', { name: 'Wizarding world' }));

    expect(screen.getByText('Harry Potter')).toBeInTheDocument();
    expect(screen.queryByText('Amelie')).not.toBeInTheDocument();
  });
});
