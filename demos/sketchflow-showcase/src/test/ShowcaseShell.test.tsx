import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { getExampleBySlug } from '../examples/registry';
import { ShowcaseShell } from '../runtime/ShowcaseShell';

describe('ShowcaseShell', () => {
  const mappingExample = getExampleBySlug('mapping')!;

  it('renders the mapping prototype without automate chrome', () => {
    render(<ShowcaseShell example={mappingExample} />);

    expect(screen.queryByRole('button', { name: /Automate/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Interact with prototype/i })).not.toBeInTheDocument();
    expect(screen.queryByText('Automated preview')).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Mapping' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Bulk Map/i })).toBeInTheDocument();
  });
});
