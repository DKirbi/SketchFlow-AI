import { LofiCloseIcon } from '../Util/LofiRadixIcons';
import './Input.scss';

export type InputSize = 'default' | 'compact';

export interface InputProps {
  /** Current value (controlled string). */
  value:        string;
  /** Called with the new string on each change event. */
  onChange:     (value: string) => void;
  /** Native input type. One of: text | number | email | search | password | date. */
  type?:        'text' | 'number' | 'email' | 'search' | 'password' | 'date';
  /** Hint when empty. */
  placeholder?: string;
  /** If true, not editable and dimmed. */
  disabled?:    boolean;
  /** If true, focusable but value cannot be edited. */
  readOnly?:    boolean;
  /** One of: default | compact (e.g. table cells). */
  size?:        InputSize;
  /** DOM id; pair with Field htmlFor. */
  id?:          string;
  /** Form field name for submit. */
  name?:        string;
  /** Browser autofill hint (e.g. `off`). */
  autoComplete?: string;
  /** Focus on mount when true. */
  autoFocus?:   boolean;
  /** Key events (e.g. Enter to submit). */
  onKeyDown?:   (e: React.KeyboardEvent<HTMLInputElement>) => void;
  /** Called when the input loses focus. */
  onBlur?:      (e: React.FocusEvent<HTMLInputElement>) => void;
  /** Extra CSS class names on the input. */
  className?:   string;
  /** When true, renders a clear (✕) button while the field has a non-empty value. */
  allowClear?:  boolean;
}

export function Input({
  value,
  onChange,
  type      = 'text',
  placeholder,
  disabled,
  readOnly,
  size      = 'default',
  id,
  name,
  autoComplete,
  autoFocus,
  onKeyDown,
  onBlur,
  className,
  allowClear,
}: InputProps) {
  const showClear = allowClear && value.length > 0 && !disabled && !readOnly;

  const classes = [
    'input',
    size === 'compact' ? 'input--compact' : '',
    allowClear ? 'input--has-clear' : '',
    className ?? '',
  ].filter(Boolean).join(' ');

  const inputEl = (
    <input
      id={id}
      name={name}
      type={type}
      value={value}
      placeholder={placeholder}
      disabled={disabled}
      readOnly={readOnly}
      autoComplete={autoComplete}
      autoFocus={autoFocus}
      className={classes}
      onKeyDown={onKeyDown}
      onBlur={onBlur}
      onChange={(e) => onChange(e.target.value)}
    />
  );

  if (!allowClear) return inputEl;

  return (
    <div className="input-wrap">
      {inputEl}
      {showClear && (
        <button
          type="button"
          className="input-wrap__clear"
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
