import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Toast } from '../ui/Toast/Toast';

describe('Toast', () => {
  it('renders the message', () => {
    render(<Toast message="Record saved." onDismiss={() => {}} />);
    expect(screen.getByText('Record saved.')).toBeInTheDocument();
  });

  it('calls onDismiss when dismiss button is clicked', async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    render(<Toast message="Done." onDismiss={onDismiss} />);
    await user.click(screen.getByRole('button', { name: /dismiss/i }));
    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it('calls onDismiss after autoDismiss delay', () => {
    vi.useFakeTimers();
    try {
      const onDismiss = vi.fn();
      render(<Toast message="Done." onDismiss={onDismiss} autoDismiss={3000} />);
      expect(onDismiss).not.toHaveBeenCalled();
      vi.advanceTimersByTime(3000);
      expect(onDismiss).toHaveBeenCalledOnce();
    } finally {
      vi.useRealTimers();
    }
  });

  it('does not auto-dismiss when autoDismiss is not set', () => {
    vi.useFakeTimers();
    try {
      const onDismiss = vi.fn();
      render(<Toast message="Done." onDismiss={onDismiss} />);
      vi.advanceTimersByTime(10000);
      expect(onDismiss).not.toHaveBeenCalled();
    } finally {
      vi.useRealTimers();
    }
  });

  it('applies severity modifier class', () => {
    const { container } = render(
      <Toast severity="warning" message="Check this." onDismiss={() => {}} />,
    );
    expect(container.firstChild).toHaveClass('toast--warning');
  });

  it('defaults to info severity', () => {
    const { container } = render(<Toast message="FYI." onDismiss={() => {}} />);
    expect(container.firstChild).toHaveClass('toast--info');
  });

  it('uses role=alert for error severity', () => {
    render(<Toast severity="error" message="Failed." onDismiss={() => {}} />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('uses role=status for non-error severities', () => {
    render(<Toast severity="success" message="Saved." onDismiss={() => {}} />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});
