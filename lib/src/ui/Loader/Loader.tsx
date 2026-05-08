import { Text } from '../Text/Text';
import './Loader.scss';

export interface LoaderProps {
  /** Optional prefix label (e.g. "Saving" renders "Saving…" with animation). */
  label?: string;
  /** Optional extra class names on the root `loader` element. */
  className?: string;
}

export function Loader({ label, className }: LoaderProps) {
  const classes = ['loader', className].filter(Boolean).join(' ');

  return (
    <span className={classes}>
      {label && <Text as="span" variant="inherit">{label}</Text>}
      <span className="loader__dots" aria-hidden="true" />
    </span>
  );
}
