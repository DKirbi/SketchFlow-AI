import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Field } from '../ui/Field/Field';

describe('Field', () => {
  it('renders the label', () => {
    render(<Field label="Name"><input /></Field>);
    expect(screen.getByText('Name')).toBeInTheDocument();
  });

  it('renders children', () => {
    render(<Field label="Email"><input data-testid="ctrl" /></Field>);
    expect(screen.getByTestId('ctrl')).toBeInTheDocument();
  });

  it('renders hint text', () => {
    render(<Field label="Age" hint="Must be 18+"><input /></Field>);
    expect(screen.getByText('Must be 18+')).toBeInTheDocument();
  });

  it('renders error and hides hint when error is set', () => {
    render(<Field label="Age" hint="Must be 18+" error="Required"><input /></Field>);
    expect(screen.getByText('Required')).toBeInTheDocument();
    expect(screen.queryByText('Must be 18+')).not.toBeInTheDocument();
  });

  it('marks error with role="alert"', () => {
    render(<Field label="Name" error="Too short"><input /></Field>);
    expect(screen.getByRole('alert')).toHaveTextContent('Too short');
  });

  it('applies error class when error is set', () => {
    const { container } = render(<Field label="Name" error="Bad"><input /></Field>);
    expect(container.querySelector('.field--error')).toBeInTheDocument();
  });

  it('applies inline class', () => {
    const { container } = render(<Field label="Inline" inline><input /></Field>);
    expect(container.querySelector('.field--inline')).toBeInTheDocument();
  });

  it('applies required marker class', () => {
    const { container } = render(<Field label="Required" required><input /></Field>);
    expect(container.querySelector('.field__label--required')).toBeInTheDocument();
  });

  it('associates label with htmlFor', () => {
    render(<Field label="Email" htmlFor="email-input"><input id="email-input" /></Field>);
    const label = screen.getByText('Email').closest('label');
    expect(label).toHaveAttribute('for', 'email-input');
  });

  it('renders without hint or error', () => {
    const { container } = render(<Field label="Plain"><input /></Field>);
    expect(container.querySelector('.field__hint')).not.toBeInTheDocument();
    expect(container.querySelector('.field__error')).not.toBeInTheDocument();
  });
});
