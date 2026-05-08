import type { ElementType, HTMLAttributes, ReactNode } from 'react';
import './Text.scss';

export type TextVariant =
  | 'inherit'
  | 'body'
  | 'sm'
  | 'micro'
  | 'muted'
  | 'description'
  | 'subtle'
  | 'ghost'
  | 'secondary'
  | 'strong'
  | 'caps';

export interface TextProps extends Omit<HTMLAttributes<HTMLElement>, 'color'> {
  /** HTML element or component to render (default span). */
  as?:     ElementType;
  /** Typography preset: inherit, body, sm, micro, muted, description, subtle, ghost, secondary, strong, caps. */
  variant?: TextVariant;
  /** Inner content. */
  children?: ReactNode;
}

export function Text({
  as: Comp = 'span',
  variant = 'body',
  className,
  children,
  ...rest
}: TextProps) {
  const classes = ['text', `text--${variant}`, className].filter(Boolean).join(' ');
  return (
    <Comp className={classes} {...rest}>
      {children}
    </Comp>
  );
}
