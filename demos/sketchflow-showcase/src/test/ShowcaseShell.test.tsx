import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { getExampleBySlug } from '../examples/registry';
import { ShowcaseShell } from '../runtime/ShowcaseShell';

describe('ShowcaseShell', () => {
  const mappingExample = getExampleBySlug('mapping')!;

  it('shows automated preview notification before interactive takeover', () => {
    render(<ShowcaseShell example={mappingExample} />);

    expect(screen.getByText('Automated preview')).toBeInTheDocument();
    expect(
      screen.getByText(/Click Interact with prototype to take control/i),
    ).toBeInTheDocument();
  });
});
