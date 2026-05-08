import { Text } from '../Text/Text';
import './Steps.scss';

export type StepState = 'active' | 'default' | 'muted';

export interface StepItem {
  /** Step title shown in the nav. */
  label:    string;
  /** Visual emphasis: active (current), default, muted. One of: active | default | muted. */
  state?:   StepState;
  /** If set, step is a button and calls this on click; omit for static step. */
  onClick?: () => void;
}

export interface StepsProps {
  /** Ordered steps left-to-right in the wizard/nav. */
  items: StepItem[];
}

export function Steps({ items }: StepsProps) {
  return (
    <nav className="steps" aria-label="Steps">
      {items.map((item, i) => {
        const state = item.state ?? 'default';
        const classes = [
          'steps__item',
          state !== 'default' ? `steps__item--${state}` : '',
          item.onClick ? 'steps__item--clickable' : '',
        ].filter(Boolean).join(' ');

        return item.onClick ? (
          <button key={i} type="button" className={classes} onClick={item.onClick}>
            <Text as="span" variant="inherit">{item.label}</Text>
          </button>
        ) : (
          <span key={i} className={classes}>
            <Text as="span" variant="inherit">{item.label}</Text>
          </span>
        );
      })}
    </nav>
  );
}
