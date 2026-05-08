import { Text } from '../Text/Text';
import './Radio.scss';

export type RadioSize = 'sm' | 'default';

export interface RadioOption {
  /** Unique value for this option (submitted / compared to `value`). */
  value:     string;
  /** Visible label next to the radio. */
  label:     string;
  /** If true, this option cannot be selected. */
  disabled?: boolean;
}

export interface RadioProps {
  /** Currently selected option value (controlled). */
  value:     string;
  /** Called with the chosen option `value` when selection changes. */
  onChange:  (value: string) => void;
  /** List of choices; order defines display order. */
  options:   RadioOption[];
  /** Shared `name` for native radio grouping and forms. */
  name:      string;
  /** If true, whole group is disabled. */
  disabled?: boolean;
  /** Stack options in a row or column. One of: row | column. */
  layout?:   'row' | 'column';
  /** Box size. `sm` = 20×20; `default` = 30×30. */
  size?:     RadioSize;
}

export function Radio({
  value,
  onChange,
  options,
  name,
  disabled,
  layout = 'row',
  size = 'default',
}: RadioProps) {
  const groupClass = [
    'radio-group',
    `radio-group--size-${size}`,
    layout === 'column' ? 'radio-group--column' : '',
    disabled ? 'radio-group--disabled' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={groupClass} role="radiogroup">
      {options.map((opt) => (
        <label key={opt.value} className="radio-group__option">
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={value === opt.value}
            disabled={disabled || opt.disabled}
            className="radio-group__input"
            onChange={() => onChange(opt.value)}
          />
          <span className="radio-group__box" aria-hidden="true">
            <span className="radio-group__dot" />
          </span>
          <span className="radio-group__label">
            <Text as="span" variant="inherit">{opt.label}</Text>
          </span>
        </label>
      ))}
    </div>
  );
}
