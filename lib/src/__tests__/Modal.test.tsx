import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Modal } from '../ui/Modal/Modal';

describe('Modal', () => {
  it('renders nothing when open is false', () => {
    const { container } = render(
      <Modal open={false} onClose={() => {}} title="Hidden">
        Content
      </Modal>,
    );
    expect(container.innerHTML).toBe('');
  });

  it('renders dialog when open is true', () => {
    render(
      <Modal open={true} onClose={() => {}} title="Visible">
        Content
      </Modal>,
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('displays the title', () => {
    render(
      <Modal open={true} onClose={() => {}} title="My Modal">
        Body
      </Modal>,
    );
    expect(screen.getByText('My Modal')).toBeInTheDocument();
  });

  it('displays optional description', () => {
    render(
      <Modal open={true} onClose={() => {}} title="Title" description="Some help text">
        Body
      </Modal>,
    );
    expect(screen.getByText('Some help text')).toBeInTheDocument();
  });

  it('does not render description when not provided', () => {
    const { container } = render(
      <Modal open={true} onClose={() => {}} title="Title">
        Body
      </Modal>,
    );
    expect(container.querySelector('.modal__description')).not.toBeInTheDocument();
  });

  it('renders children in the body', () => {
    render(
      <Modal open={true} onClose={() => {}} title="Title">
        <p>Body content</p>
      </Modal>,
    );
    expect(screen.getByText('Body content')).toBeInTheDocument();
  });

  it('renders footer when provided', () => {
    render(
      <Modal open={true} onClose={() => {}} title="Title" footer={<button>Save</button>}>
        Body
      </Modal>,
    );
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('does not render footer section when not provided', () => {
    const { container } = render(
      <Modal open={true} onClose={() => {}} title="Title">
        Body
      </Modal>,
    );
    expect(container.querySelector('.modal__footer')).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <Modal open={true} onClose={onClose} title="Title">
        Body
      </Modal>,
    );
    await user.click(screen.getByLabelText('Close'));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('calls onClose when overlay is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <Modal open={true} onClose={onClose} title="Title">
        Body
      </Modal>,
    );
    // Radix renders into a portal outside the render container; userEvent fires
    // the full pointer sequence that DismissableLayer responds to.
    await user.click(document.querySelector('.modal-overlay')!);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('does not call onClose when dialog content is clicked', () => {
    const onClose = vi.fn();
    render(
      <Modal open={true} onClose={onClose} title="Title">
        Body
      </Modal>,
    );
    fireEvent.mouseDown(screen.getByRole('dialog'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('calls onClose on Escape key', () => {
    const onClose = vi.fn();
    render(
      <Modal open={true} onClose={onClose} title="Title">
        Body
      </Modal>,
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('applies wide size class', () => {
    render(
      <Modal open={true} onClose={() => {}} title="Wide" size="wide">
        Body
      </Modal>,
    );
    expect(screen.getByRole('dialog')).toHaveClass('modal--wide');
  });

  it('sets aria-modal="true"', () => {
    render(
      <Modal open={true} onClose={() => {}} title="Accessible">
        Body
      </Modal>,
    );
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
  });
});
