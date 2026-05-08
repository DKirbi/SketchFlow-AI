import { Button } from '../Button/Button';
import { Text } from '../Text/Text';
import { DismissIcon, FeedbackSeverityIcon } from '../Util/LofiRadixIcons';
import './InlineAlert.scss';

export type InlineAlertSeverity = 'error' | 'warning' | 'info' | 'success';

export interface InlineAlertProps {
  /** Visual severity — controls border style, left-rule weight, and prefix icon. One of: error | warning | info | success. */
  severity?: InlineAlertSeverity;
  /** Short headline shown in the alert header. */
  title: string;
  /** Optional supporting body text below the headline. */
  message?: string;
  /** If provided, renders a dismiss button. Omit for non-dismissible alerts. */
  onDismiss?: () => void;
}

export function InlineAlert({ severity = 'info', title, message, onDismiss }: InlineAlertProps) {
  const cls = ['inline-alert', `inline-alert--${severity}`].join(' ');
  const role = severity === 'error' || severity === 'warning' ? 'alert' : 'status';

  return (
    <div className={cls} role={role}>
      <div className="inline-alert__header">
        <span className="inline-alert__icon" aria-hidden="true">
          <FeedbackSeverityIcon severity={severity} />
        </span>
        <span className="inline-alert__title">
          <Text as="span" variant="inherit">
            {title}
          </Text>
        </span>
        {onDismiss && (
          <Button
            type="button"
            variant="dismiss"
            size="compact"
            className="inline-alert__dismiss"
            onClick={onDismiss}
            aria-label="Dismiss alert"
          >
            <DismissIcon />
          </Button>
        )}
      </div>
      {message && (
        <div className="inline-alert__body">
          <Text variant="muted">{message}</Text>
        </div>
      )}
    </div>
  );
}
