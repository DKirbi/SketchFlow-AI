import { Text } from '../Text/Text';
import { LofiCloseIcon } from '../Util/LofiRadixIcons';
import './Panel.scss';

export interface PanelProps {
  /** If false, nothing is rendered. */
  open:      boolean;
  /** Called when the user closes the panel (e.g. ✕). */
  onClose:   () => void;
  /** Title in the panel header. */
  title:     string;
  /** Main scrollable content. */
  children:  React.ReactNode;
  /** Optional footer actions. */
  footer?:   React.ReactNode;
}

export function Panel({ open, onClose, title, children, footer }: PanelProps) {
  if (!open) return null;

  return (
    <div className="panel">
      <div className="panel__header">
        <span className="panel__title">
          <Text as="span" variant="inherit">{title}</Text>
        </span>
        <button className="panel__close" onClick={onClose} aria-label="Close">
          <LofiCloseIcon size={16} />
        </button>
      </div>
      <div className="panel__body">{children}</div>
      {footer && <div className="panel__footer">{footer}</div>}
    </div>
  );
}
