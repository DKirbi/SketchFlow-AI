import { Button } from '../Button/Button';
import { Text } from '../Text/Text';
import './Chip.scss';

export interface ChipProps {
  /** Chip label (filter dimension + value, or scope + count). */
  label: string;
  /**
   * If provided, render the ✕ dismiss control. Omit for a non-dismissible chip
   * (filter-chip mode).
   */
  onClear?: () => void;
  /**
   * @deprecated Use `onClear`. Still shows ✕ when `onClear` is omitted.
   */
  onDismiss?: () => void;
  /**
   * Active option in a filter-chip group. Pair with `onClick` and omit `onClear`.
   */
  selected?: boolean;
  /** Select this chip (filter group). Not fired from the ✕ control. */
  onClick?: () => void;
  /** Native hover tooltip for the chip surface. */
  title?: string;
  /** Extra CSS class on the root element. */
  className?: string;
}

/**
 * P9 chip: dismissible active-filter token (`onClear`) or exclusive filter
 * chip (`selected` + `onClick`, no ✕).
 */
export function Chip({
  label,
  onClear,
  onDismiss,
  selected = false,
  onClick,
  title,
  className,
}: ChipProps) {
  const clear = onClear ?? onDismiss;
  const isFilter = Boolean(onClick) && !clear;
  const classes = [
    'chip',
    clear ? 'chip--dashed' : '',
    selected ? 'chip--selected' : '',
    isFilter ? 'chip--filter' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const labelNode = (
    <Text as="span" variant="body">
      {label}
    </Text>
  );

  if (isFilter) {
    return (
      <button
        type="button"
        className={classes}
        title={title}
        aria-pressed={selected}
        onClick={onClick}
      >
        {labelNode}
      </button>
    );
  }

  return (
    <span className={classes} title={title}>
      {labelNode}
      {clear ? (
        <Button
          type="button"
          variant="dismiss"
          size="compact"
          aria-label={`Remove filter ${label}`}
          onClick={(event) => {
            event.stopPropagation();
            clear();
          }}
        >
          ✕
        </Button>
      ) : null}
    </span>
  );
}
