import { Text } from '../Text/Text';
import { LofiCheckIcon } from '../Util/LofiRadixIcons';
import './Checkbox.scss';

export type CheckboxSize = 'sm' | 'default';

export interface CheckboxProps {
  /** Current checked state (controlled). */
  checked:   boolean;
  /** Called with the new checked value when the user toggles. */
  onChange:  (checked: boolean) => void;
  /** Visible label beside the box. */
  label:     string;
  /** If true, user cannot toggle. */
  disabled?: boolean;
  /** Optional id linking label and input for a11y. */
  id?:       string;
  /** Optional name for form submission. */
  name?:     string;
  /** Box size. `sm` = 20×20 (use inside dense table cells); `default` = 30×30 (filter rails, forms). */
  size?:     CheckboxSize;
}

export function Checkbox({
  checked,
  onChange,
  label,
  disabled,
  id,
  name,
  size = 'default',
}: CheckboxProps) {
  const wrapperClass = [
    'checkbox',
    `checkbox--size-${size}`,
    disabled ? 'checkbox--disabled' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <label className={wrapperClass}>
      <input
        type="checkbox"
        id={id}
        name={name}
        checked={checked}
        disabled={disabled}
        className="checkbox__input"
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="checkbox__box" aria-hidden="true">
        <LofiCheckIcon className="checkbox__check" size={size === 'sm' ? 14 : 22} />
      </span>
      {label !== '' && (
        <span className="checkbox__label">
          <Text as="span" variant="inherit">{label}</Text>
        </span>
      )}
    </label>
  );
}
