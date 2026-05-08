import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Fieldset } from '../ui/Fieldset/Fieldset';

describe('Fieldset', () => {
  it('renders the legend', () => {
    render(<Fieldset legend="Details"><p>Content</p></Fieldset>);
    expect(screen.getByText('Details')).toBeInTheDocument();
  });

  it('renders children in the body', () => {
    render(<Fieldset legend="Section"><p>Inner content</p></Fieldset>);
    expect(screen.getByText('Inner content')).toBeInTheDocument();
  });

  it('uses a fieldset element', () => {
    render(<Fieldset legend="Group"><p>Content</p></Fieldset>);
    expect(screen.getByRole('group')).toBeInTheDocument();
  });

  it('renders a legend element', () => {
    const { container } = render(<Fieldset legend="Caption"><p>Content</p></Fieldset>);
    expect(container.querySelector('legend')).toHaveTextContent('Caption');
  });

  it('merges custom className', () => {
    const { container } = render(<Fieldset legend="Leg" className="wide"><p>C</p></Fieldset>);
    expect(container.querySelector('.fieldset.wide')).toBeInTheDocument();
  });

  it('applies base fieldset class', () => {
    const { container } = render(<Fieldset legend="Leg"><p>C</p></Fieldset>);
    expect(container.querySelector('.fieldset')).toBeInTheDocument();
  });
});
