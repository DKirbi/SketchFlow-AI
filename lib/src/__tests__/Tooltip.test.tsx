import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { Tooltip, TooltipMarker } from '../ui/Tooltip/Tooltip';

describe('Tooltip', () => {
  it('shows content on hover', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Must be 18+" delayDuration={0}>
        <span>Age</span>
      </Tooltip>,
    );
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    await user.hover(screen.getByText('Age'));
    expect(await screen.findByRole('tooltip')).toHaveTextContent('Must be 18+');
  });

  it('shows content when the marker is focused', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Mocked running flag" delayDuration={0}>
        <TooltipMarker label="Only running" />
      </Tooltip>,
    );
    await user.tab();
    expect(screen.getByLabelText('More information about Only running')).toHaveFocus();
    expect(await screen.findByRole('tooltip')).toHaveTextContent('Mocked running flag');
  });
});
