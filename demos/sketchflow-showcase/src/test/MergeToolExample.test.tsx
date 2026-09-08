import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { MergeToolExample } from '../examples/merge-tool/MergeToolExample';
import { mergeToolExampleConfig } from '../examples/merge-tool/metadata';

describe('MergeToolExample', () => {
  it('switches the mock database to the wizarding catalogue', async () => {
    const user = userEvent.setup();

    render(
      <MergeToolExample
        mode="interactive"
        previewStepIndex={-1}
        previewSteps={mergeToolExampleConfig.previewSteps}
        onInteractionComplete={vi.fn()}
      />,
    );

    expect(screen.getByText('Amelie')).toBeInTheDocument();

    await user.click(screen.getByLabelText('Mock database'));
    await user.click(screen.getByRole('option', { name: 'Wizarding world' }));

    expect(screen.getByText('Harry Potter')).toBeInTheDocument();
    expect(screen.queryByText('Amelie')).not.toBeInTheDocument();
  });
});
