import React, { useEffect } from 'react';
import { Button } from '../Button/Button';
import { Text } from '../Text/Text';
import { DismissIcon, FeedbackSeverityIcon } from '../Util/LofiRadixIcons';
import './Toast.scss';

export type ToastSeverity = 'success' | 'info' | 'warning' | 'error';

export interface ToastProps {
  /** Visual severity — controls border style and prefix icon. One of: success | info | warning | error. */
  severity?: ToastSeverity;
  /** Short message shown inside the toast. */
  message: string;
  /** Called when the user dismisses the toast or when autoDismiss fires. */
  onDismiss: () => void;
  /** Auto-dismiss after N milliseconds. Omit to require explicit dismiss. */
  autoDismiss?: number;
  /** Additional CSS class on the root element — use to override fixed positioning. */
  className?: string;
  /** Inline styles on the root element — use to position the toast near a trigger. */
  style?: React.CSSProperties;
}

export function Toast({
  severity = 'info',
  message,
  onDismiss,
  autoDismiss,
  className,
  style,
}: ToastProps) {
  useEffect(() => {
    if (!autoDismiss) return;
    const timer = setTimeout(onDismiss, autoDismiss);
    return () => clearTimeout(timer);
  }, [autoDismiss, onDismiss]);

  const cls = ['toast', `toast--${severity}`, className].filter(Boolean).join(' ');
  const role = severity === 'error' ? 'alert' : 'status';
  const ariaLive = severity === 'error' ? 'assertive' : 'polite';

  return (
    <div className={cls} role={role} aria-live={ariaLive} style={style}>
      <span className="toast__icon" aria-hidden="true">
        <FeedbackSeverityIcon severity={severity} />
      </span>
      <span className="toast__message">
        <Text as="span" variant="inherit">
          {message}
        </Text>
      </span>
      <Button
        type="button"
        variant="dismiss"
        size="compact"
        className="toast__dismiss"
        onClick={onDismiss}
        aria-label="Dismiss"
      >
        <DismissIcon />
      </Button>
    </div>
  );
}
