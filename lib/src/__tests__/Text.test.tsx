import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Text } from '../ui/Text/Text';

describe('Text', () => {
  it('renders children', () => {
    render(<Text>Hello world</Text>);
    expect(screen.getByText('Hello world')).toBeInTheDocument();
  });

  it('defaults to a span element', () => {
    render(<Text>Inline</Text>);
    expect(screen.getByText('Inline').tagName).toBe('SPAN');
  });

  it('renders as a custom element via as prop', () => {
    render(<Text as="p">Paragraph</Text>);
    expect(screen.getByText('Paragraph').tagName).toBe('P');
  });

  it('renders as heading element', () => {
    render(<Text as="h1">Title</Text>);
    expect(screen.getByText('Title').tagName).toBe('H1');
  });

  it('defaults to body variant', () => {
    render(<Text>Body text</Text>);
    expect(screen.getByText('Body text')).toHaveClass('text--body');
  });

  it('applies sm variant', () => {
    render(<Text variant="sm">Small</Text>);
    expect(screen.getByText('Small')).toHaveClass('text--sm');
  });

  it('applies micro variant', () => {
    render(<Text variant="micro">Tiny</Text>);
    expect(screen.getByText('Tiny')).toHaveClass('text--micro');
  });

  it('applies muted variant', () => {
    render(<Text variant="muted">Muted</Text>);
    expect(screen.getByText('Muted')).toHaveClass('text--muted');
  });

  it('applies strong variant', () => {
    render(<Text variant="strong">Bold</Text>);
    expect(screen.getByText('Bold')).toHaveClass('text--strong');
  });

  it('applies caps variant', () => {
    render(<Text variant="caps">Label</Text>);
    expect(screen.getByText('Label')).toHaveClass('text--caps');
  });

  it('applies inherit variant', () => {
    render(<Text variant="inherit">Inherit</Text>);
    expect(screen.getByText('Inherit')).toHaveClass('text--inherit');
  });

  it('merges custom className', () => {
    render(<Text className="extra">Styled</Text>);
    expect(screen.getByText('Styled')).toHaveClass('text', 'extra');
  });

  it('passes through extra HTML attributes', () => {
    render(<Text data-testid="custom" aria-label="test">Attr</Text>);
    expect(screen.getByTestId('custom')).toHaveAttribute('aria-label', 'test');
  });

  it('renders empty when no children', () => {
    const { container } = render(<Text />);
    expect(container.querySelector('.text')).toBeInTheDocument();
    expect(container.querySelector('.text')!.textContent).toBe('');
  });
});
