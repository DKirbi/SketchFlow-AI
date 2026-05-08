import { Text } from '../Text/Text';
import './Badge.scss';

export type BadgeVariant = 'status' | 'id' | 'tag';

export interface BadgeProps {
  /** Text shown inside the badge. */
  label:     string;
  /** Use status for state chips, id for identifiers, tag for labels. One of: status | id | tag. */
  variant?:  BadgeVariant;
  /** For variant status: false = muted/inactive appearance. */
  active?:   boolean;
  /** If set, renders as a button and calls this on click; omit for static badge. */
  onClick?:  () => void;
}

export function Badge({ label, variant = 'tag', active = true, onClick }: BadgeProps) {
  const classes = [
    'badge',
    `badge--${variant}`,
    variant === 'status' && !active ? 'badge--inactive' : '',
    onClick ? 'badge--clickable' : '',
  ].filter(Boolean).join(' ');

  return onClick
    ? (
      <button type="button" className={classes} onClick={onClick}>
        <Text as="span" variant="inherit">{label}</Text>
      </button>
    )
    : (
      <span className={classes}>
        <Text as="span" variant="inherit">{label}</Text>
      </span>
    );
}
