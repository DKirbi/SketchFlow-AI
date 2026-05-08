import { useId } from 'react';
import { Text } from '../Text/Text';
import './Switch.scss';

export type SwitchSize = 'default' | 'compact';

export interface SwitchProps {
  /** Whether the switch is currently on. */
  checked: boolean;
  /** Called with the new boolean value when the switch changes. */
  onChange: (checked: boolean) => void;
  /** Visible label to the right of the track. Always shown. */
  label: string;
  /** Track density. One of: default | compact. */
  size?: SwitchSize;
  /** If true, the switch cannot be toggled. */
  disabled?: boolean;
  /** Explicit id for the underlying input. Auto-generated if omitted. */
  id?: string;
}

export function Switch({ checked, onChange, label, size = 'default', disabled, id }: SwitchProps) {
  const autoId = useId();
  const inputId = id ?? autoId;

  const cls = [
    'switch',
    checked ? 'switch--on' : '',
    size === 'compact' ? 'switch--compact' : '',
    disabled ? 'switch--disabled' : '',
  ].filter(Boolean).join(' ');

  return (
    <label className={cls} htmlFor={inputId}>
      <input
        type="checkbox"
        id={inputId}
        className="switch__input"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="switch__track" aria-hidden="true">
        <span className="switch__indicator" />
      </span>
      <Text as="span" variant="inherit">{label}</Text>
    </label>
  );
}
