import { Text } from '../Text/Text';
import './Card.scss';

export interface CardProps {
  /** Main body content below the optional title. */
  children:   React.ReactNode;
  /** Optional header line above the body. */
  title?:     string;
  /** Optional footer row (actions, metadata). */
  footer?:    React.ReactNode;
  /** If true, applies empty-state styling on the card shell. */
  empty?:     boolean;
  /** Extra CSS class names on the root card. */
  className?: string;
}

export function Card({ children, title, footer, empty, className }: CardProps) {
  const classes = [
    'card',
    empty ? 'card--empty' : '',
    className ?? '',
  ].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      {title && (
        <div className="card__header">
          <Text as="span" variant="inherit">{title}</Text>
        </div>
      )}
      <div className="card__body">{children}</div>
      {footer && <div className="card__footer">{footer}</div>}
    </div>
  );
}
