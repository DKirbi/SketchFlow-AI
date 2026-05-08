import * as RadixSelect from '@radix-ui/react-select';
import { LofiCheckIcon, LofiChevronDownIcon, LofiCloseIcon } from '../Util/LofiRadixIcons';
import '../DropdownMenu/DropdownMenu.scss';
import './Select.scss';

export interface SelectOption {
  /** Value stored when this option is selected. */
  value:     string;
  /** Text shown in the dropdown list. */
  label:     string;
  /** If true, option is visible but not selectable. */
  disabled?: boolean;
}

export interface SelectProps {
  /** Current selected value (must match an option `value`, or "" with placeholder). */
  value:        string;
  /** Called with the new option `value` on change. */
  onChange:     (value: string) => void;
  /** Fixed list of choices (status, category, etc.). */
  options:      SelectOption[];
  /** First disabled option text when value is empty; omit for no empty state. */
  placeholder?: string;
  /** If true, select is non-interactive. */
  disabled?:    boolean;
  /** One of: default | compact | large. */
  size?:        'default' | 'compact' | 'large';
  /** DOM id; pair with Field htmlFor. */
  id?:          string;
  /** Form field name. */
  name?:        string;
  /** Extra CSS class on the select. */
  className?:   string;
  /**
   * When true, a clear (✕) button replaces the dropdown chevron while the field
   * has a value. Clicking it calls onChange(''), returning the control to the
   * placeholder state. Requires a `placeholder` to restore the empty label.
   */
  allowClear?:  boolean;
}

export function Select({
  value,
  onChange,
  options,
  placeholder,
  disabled,
  size      = 'default',
  id,
  name,
  className,
  allowClear,
}: SelectProps) {
  // Radix Select requires a non-empty string; map empty → undefined for placeholder.
  const radixValue = value === '' ? undefined : value;
  const showClear  = allowClear && value !== '' && !disabled;

  const triggerClasses = [
    'select',
    size === 'compact' ? 'select--compact' : '',
    size === 'large'   ? 'select--large'   : '',
    className ?? '',
  ].filter(Boolean).join(' ');

  const menuClasses = [
    'dropdown-menu',
    size === 'compact' ? 'dropdown-menu--compact' : '',
  ].filter(Boolean).join(' ');

  const radixRoot = (
    <RadixSelect.Root
      value={radixValue}
      onValueChange={onChange}
      disabled={disabled}
    >
      <RadixSelect.Trigger id={id} className={triggerClasses}>
        <span className="select__value">
          <RadixSelect.Value placeholder={placeholder ?? ''} />
        </span>
        {!showClear && (
          <RadixSelect.Icon className="select__icon" aria-hidden>
            <LofiChevronDownIcon size={14} />
          </RadixSelect.Icon>
        )}
      </RadixSelect.Trigger>

      <RadixSelect.Portal>
        <RadixSelect.Content
          className={menuClasses}
          position="popper"
          side="bottom"
          sideOffset={2}
          avoidCollisions
        >
          <RadixSelect.Viewport>
            {options.map((opt) => (
              <RadixSelect.Item
                key={opt.value}
                value={opt.value}
                disabled={opt.disabled}
                className="dropdown-menu__item"
              >
                <RadixSelect.ItemIndicator className="dropdown-menu__item-indicator">
                  <LofiCheckIcon size={14} />
                </RadixSelect.ItemIndicator>
                <RadixSelect.ItemText>{opt.label}</RadixSelect.ItemText>
              </RadixSelect.Item>
            ))}
          </RadixSelect.Viewport>
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  );

  if (allowClear) {
    return (
      <div className="select-wrap">
        {name && <input type="hidden" name={name} value={value} />}
        {radixRoot}
        {showClear && (
          <button
            type="button"
            className="select-wrap__clear"
            aria-label="Clear"
            tabIndex={-1}
            onClick={() => onChange('')}
          >
            <LofiCloseIcon size={12} />
          </button>
        )}
      </div>
    );
  }

  return (
    <>
      {name && <input type="hidden" name={name} value={value} />}
      {radixRoot}
    </>
  );
}
