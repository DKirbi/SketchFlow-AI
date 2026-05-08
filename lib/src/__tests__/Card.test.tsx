import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Card } from '../ui/Card/Card';

describe('Card', () => {
  it('renders children in the body', () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('renders title in the header', () => {
    render(<Card title="Heading">Body</Card>);
    expect(screen.getByText('Heading')).toBeInTheDocument();
  });

  it('does not render header when title is omitted', () => {
    const { container } = render(<Card>Body only</Card>);
    expect(container.querySelector('.card__header')).not.toBeInTheDocument();
  });

  it('renders footer when provided', () => {
    render(<Card footer={<button>Action</button>}>Body</Card>);
    expect(screen.getByText('Action')).toBeInTheDocument();
  });

  it('does not render footer when omitted', () => {
    const { container } = render(<Card>Body only</Card>);
    expect(container.querySelector('.card__footer')).not.toBeInTheDocument();
  });

  it('applies empty class', () => {
    const { container } = render(<Card empty>Empty state</Card>);
    expect(container.querySelector('.card--empty')).toBeInTheDocument();
  });

  it('does not apply empty class by default', () => {
    const { container } = render(<Card>Normal</Card>);
    expect(container.querySelector('.card--empty')).not.toBeInTheDocument();
  });

  it('merges custom className', () => {
    const { container } = render(<Card className="highlighted">Body</Card>);
    expect(container.querySelector('.card.highlighted')).toBeInTheDocument();
  });
});
