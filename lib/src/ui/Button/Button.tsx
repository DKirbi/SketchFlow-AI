import type { PointerEvent } from 'react';
import { Text } from '../Text/Text';
import './Button.scss';

export type ButtonVariant = 'primary' | 'default' | 'dismiss';
export type ButtonSize    = 'default' | 'small' | 'compact';

export interface ButtonProps {
  /** Visual role: primary CTA vs secondary vs cancel/dismiss. One of: primary | default | dismiss. */
  variant?:   ButtonVariant;
  /** Density: default padding, small (slightly smaller than default — row/bulk actions), or compact (very dense, e.g. table cells, breadcrumbs). One of: default | small | compact. */
  size?:      ButtonSize;
  /** Native button type; use submit inside forms. One of: button | submit | reset. */
  type?:      'button' | 'submit' | 'reset';
  /** If true, not clickable and shows disabled styling. */
  disabled?:  boolean;
  /** Called on click; omit if the button is purely decorative or wrapped by another handler. */
  onClick?:   (e: React.MouseEvent<HTMLButtonElement>) => void;
  /** Label or nested content (often text). */
  children:   React.ReactNode;
  /** Extra CSS class names merged onto the button. */
  className?: string;
  /** Native `title` tooltip. */
  title?: string;
  /** Associates a submit button with a `<form>` `id` when the button sits outside the form. */
  form?: string;
  /** Pointer capture (e.g. stop propagation for canvas nodes). */
  onPointerDown?: (e: PointerEvent<HTMLButtonElement>) => void;
  /** Accessible name when children are not descriptive (e.g. icon-only controls). */
  'aria-label'?: string;
}

export function Button({
  variant   = 'default',
  size      = 'default',
  type      = 'button',
  disabled,
  onClick,
  children,
  className,
  title,
  form,
  onPointerDown,
  'aria-label': ariaLabel,
}: ButtonProps) {
  const classes = [
    'btn',
    `btn--${variant}`,
    size === 'compact' ? 'btn--compact' : '',
    size === 'small' ? 'btn--small' : '',
    className ?? '',
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled}
      onClick={onClick}
      title={title}
      form={form}
      onPointerDown={onPointerDown}
      aria-label={ariaLabel}
    >
      <Text as="span" variant="inherit">{children}</Text>
    </button>
  );
}
