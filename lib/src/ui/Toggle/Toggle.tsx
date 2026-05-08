import { Text } from '../Text/Text';
import './Toggle.scss';

export interface ToggleOption {
  /** Value passed to onChange when selected. */
  value: string;
  /** Display label. */
  label: string;
}

export interface ToggleProps {
  /** Currently selected value. */
  value:       string;
  /** Called with the new value when a different option is selected. */
  onChange:    (value: string) => void;
  /** Two or more exclusive options. */
  options:     ToggleOption[];
  /** Accessible group label. */
  ariaLabel?:  string;
  /** Optional extra class names on the root `toggle` element. */
  className?:  string;
}

export function Toggle({ value, onChange, options, ariaLabel, className }: ToggleProps) {
  const rootCls = ['toggle', className].filter(Boolean).join(' ');

  return (
    <div className={rootCls} role="group" aria-label={ariaLabel}>
      {options.map((opt) => {
        const active = opt.value === value;
        const cls = [
          'toggle__btn',
          active ? 'toggle__btn--active' : '',
        ].filter(Boolean).join(' ');

        return (
          <button
            key={opt.value}
            type="button"
            className={cls}
            aria-pressed={active}
            onClick={() => { if (!active) onChange(opt.value); }}
          >
            <Text as="span" variant="inherit">{opt.label}</Text>
          </button>
        );
      })}
    </div>
  );
}
