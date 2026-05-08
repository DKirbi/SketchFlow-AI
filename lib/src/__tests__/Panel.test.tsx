import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Panel } from '../ui/Panel/Panel';

describe('Panel', () => {
  it('renders nothing when open is false', () => {
    const { container } = render(
      <Panel open={false} onClose={() => {}} title="Hidden">Content</Panel>,
    );
    expect(container.innerHTML).toBe('');
  });

  it('renders when open is true', () => {
    render(<Panel open={true} onClose={() => {}} title="Visible">Content</Panel>);
    expect(screen.getByText('Visible')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('displays the title', () => {
    render(<Panel open={true} onClose={() => {}} title="Details">Body</Panel>);
    expect(screen.getByText('Details')).toBeInTheDocument();
  });

  it('renders children in the body', () => {
    render(
      <Panel open={true} onClose={() => {}} title="Title">
        <p>Body text</p>
      </Panel>,
    );
    expect(screen.getByText('Body text')).toBeInTheDocument();
  });

  it('renders footer when provided', () => {
    render(
      <Panel open={true} onClose={() => {}} title="Title" footer={<span>Footer</span>}>
        Body
      </Panel>,
    );
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });

  it('does not render footer when not provided', () => {
    const { container } = render(
      <Panel open={true} onClose={() => {}} title="Title">Body</Panel>,
    );
    expect(container.querySelector('.panel__footer')).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<Panel open={true} onClose={onClose} title="Title">Body</Panel>);
    await user.click(screen.getByLabelText('Close'));
    expect(onClose).toHaveBeenCalledOnce();
  });
});
