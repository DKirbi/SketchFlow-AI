import { Button } from '../Button/Button';
import { Text } from '../Text/Text';
import './Chip.scss';

export interface ChipProps {
  /** Chip label (filter dimension + value). */
  label: string;
  /** Called when the dismiss control is activated. */
  onDismiss: () => void;
  /** Native hover tooltip for the chip surface. */
  title?: string;
  /** Extra CSS class on the root element. */
  className?: string;
}

/** Dismissible filter token for active-filter strips (P9). */
export function Chip({ label, onDismiss, title, className }: ChipProps) {
  const classes = ['chip', 'chip--dashed', className].filter(Boolean).join(' ');

  return (
    <span className={classes} title={title}>
      <Text as="span" variant="body" style={{ fontWeight: 700 }}>
        {label}
      </Text>
      <Button
        type="button"
        variant="dismiss"
        size="compact"
        aria-label={`Remove filter ${label}`}
        onClick={onDismiss}
      >
        ✕
      </Button>
    </span>
  );
}
