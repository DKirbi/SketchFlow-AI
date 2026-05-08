import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { InlineAlert } from '../ui/InlineAlert/InlineAlert';

describe('InlineAlert', () => {
  it('renders the title', () => {
    render(<InlineAlert title="Validation error" />);
    expect(screen.getByText('Validation error')).toBeInTheDocument();
  });

  it('renders an optional message', () => {
    render(<InlineAlert title="Warning" message="Please review your input." />);
    expect(screen.getByText('Please review your input.')).toBeInTheDocument();
  });

  it('does not render message element when message is omitted', () => {
    const { container } = render(<InlineAlert title="Note" />);
    expect(container.querySelector('.inline-alert__body')).not.toBeInTheDocument();
  });

  it('renders a dismiss button when onDismiss is provided', () => {
    render(<InlineAlert title="Note" onDismiss={() => {}} />);
    expect(screen.getByRole('button', { name: /dismiss/i })).toBeInTheDocument();
  });

  it('does not render a dismiss button when onDismiss is omitted', () => {
    render(<InlineAlert title="Note" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('calls onDismiss when dismiss button is clicked', async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    render(<InlineAlert title="Note" onDismiss={onDismiss} />);
    await user.click(screen.getByRole('button', { name: /dismiss/i }));
    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it('applies severity modifier class', () => {
    const { container } = render(<InlineAlert severity="error" title="Error" />);
    expect(container.firstChild).toHaveClass('inline-alert--error');
  });

  it('defaults to info severity', () => {
    const { container } = render(<InlineAlert title="Info" />);
    expect(container.firstChild).toHaveClass('inline-alert--info');
  });

  it('uses role=alert for error and warning severities', () => {
    const { rerender } = render(<InlineAlert severity="error" title="Error" />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
    rerender(<InlineAlert severity="warning" title="Warning" />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('uses role=status for info and success severities', () => {
    const { rerender } = render(<InlineAlert severity="info" title="Info" />);
    expect(screen.getByRole('status')).toBeInTheDocument();
    rerender(<InlineAlert severity="success" title="Done" />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});
