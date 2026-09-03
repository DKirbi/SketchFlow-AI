import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { MappingExample } from '../examples/mapping/MappingExample';
import { mappingExampleConfig } from '../examples/mapping/metadata';

describe('MappingExample', () => {
  it('renders checkboxes and bulk map toolbar', () => {
    render(
      <MappingExample
        mode="interactive"
        previewStepIndex={-1}
        previewSteps={mappingExampleConfig.previewSteps}
        onInteractionComplete={vi.fn()}
      />,
    );

    expect(screen.getByRole('button', { name: /Bulk Map/i })).toBeInTheDocument();
    expect(screen.getAllByRole('checkbox').length).toBeGreaterThan(0);
  });

  it('renders automated status message from preview snapshot', async () => {
    const bulkIndex = mappingExampleConfig.previewSteps.findIndex(
      (step) => step.id === 'bulk-success',
    );

    render(
      <MappingExample
        mode="preview"
        previewStepIndex={bulkIndex}
        previewSteps={mappingExampleConfig.previewSteps}
        onInteractionComplete={vi.fn()}
      />,
    );

    await waitFor(() => {
      expect(screen.getByText(/2 items bulk-mapped/i)).toBeInTheDocument();
    });
  });

  it('maps a pending row in interactive mode and reports completion', async () => {
    const user = userEvent.setup();
    const onComplete = vi.fn();

    render(
      <MappingExample
        mode="interactive"
        previewStepIndex={-1}
        previewSteps={mappingExampleConfig.previewSteps}
        onInteractionComplete={onComplete}
      />,
    );

    const mapButtons = screen.getAllByRole('button', { name: /^Map$/i });
    await user.click(mapButtons[0]!);

    await waitFor(
      () => {
        expect(onComplete).toHaveBeenCalledTimes(1);
      },
      { timeout: 3000 },
    );

    expect(screen.getByText(/Mapping saved to external catalogue/i)).toBeInTheDocument();
  });

  it('disables bulk controls during automated preview', () => {
    render(
      <MappingExample
        mode="preview"
        previewStepIndex={0}
        previewSteps={mappingExampleConfig.previewSteps}
        onInteractionComplete={vi.fn()}
      />,
    );

    expect(screen.getByRole('button', { name: /Bulk Map/i })).toBeDisabled();
  });

  it('filters rows when title search is committed', async () => {
    const user = userEvent.setup();

    render(
      <MappingExample
        mode="interactive"
        previewStepIndex={-1}
        previewSteps={mappingExampleConfig.previewSteps}
        onInteractionComplete={vi.fn()}
      />,
    );

    await user.type(screen.getByLabelText(/Title/i), 'oldboy');
    await user.click(screen.getByRole('button', { name: /^Search$/i }));

    expect(screen.getByText('Oldboy')).toBeInTheDocument();
    expect(screen.queryByText('Amelie')).not.toBeInTheDocument();
  });
});
