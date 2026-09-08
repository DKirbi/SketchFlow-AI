import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Button } from '../ui/Button/Button';

describe('Button', () => {
  it('renders children text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('defaults to type="button"', () => {
    render(<Button>OK</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('applies variant class', () => {
    render(<Button variant="primary">Save</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn--primary');
  });

  it('applies default variant when none specified', () => {
    render(<Button>Cancel</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn--default');
  });

  it('applies dismiss variant', () => {
    render(<Button variant="dismiss">Remove</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn--dismiss');
  });

  it('applies compact size class', () => {
    render(<Button size="compact">Small</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn--compact');
  });

  it('does not add compact class for default size', () => {
    render(<Button>Normal</Button>);
    expect(screen.getByRole('button')).not.toHaveClass('btn--compact');
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Go</Button>);
    await user.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('does not call onClick when disabled', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick} disabled>Go</Button>);
    await user.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('sets disabled attribute', () => {
    render(<Button disabled>Nope</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('supports type="submit"', () => {
    render(<Button type="submit">Submit</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });

  it('merges custom className', () => {
    render(<Button className="extra">Styled</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn', 'extra');
  });

  it('passes title attribute', () => {
    render(<Button title="Tooltip">Hover</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('title', 'Tooltip');
  });

  it('passes form attribute', () => {
    render(<Button form="my-form" type="submit">Submit</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('form', 'my-form');
  });

  it('inverts default (outline) hover to ink fill and paper label', () => {
    render(<Button variant="default">Secondary</Button>);

    const hoverRule = [...document.styleSheets]
      .flatMap((sheet) => {
        try {
          return [...sheet.cssRules];
        } catch {
          return [];
        }
      })
      .find(
        (rule): rule is CSSStyleRule =>
          rule instanceof CSSStyleRule &&
          rule.selectorText.includes('btn--default') &&
          rule.selectorText.includes(':hover'),
      );

    expect(hoverRule).toBeDefined();
    const bg = hoverRule!.style.background || hoverRule!.style.backgroundColor;
    const color = hoverRule!.style.color;
    expect(bg.replace(/\s/g, '')).toMatch(/#111|rgb\(17,17,17\)/i);
    expect(color.replace(/\s/g, '')).toMatch(/#fff|#ffffff|rgb\(255,255,255\)/i);
  });
});
