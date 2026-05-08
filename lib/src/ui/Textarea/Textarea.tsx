import { LofiChevronDownIcon, LofiCloseIcon } from '../Util/LofiRadixIcons';
import './Textarea.scss';

export type TextareaSize = 'default' | 'compact';

export interface TextareaProps {
  /** Current value (controlled string). */
  value:        string;
  /** Called with the new string on each change event. */
  onChange:     (value: string) => void;
  /** Hint when empty. */
  placeholder?: string;
  /** If true, not editable and dimmed. */
  disabled?:    boolean;
  /** If true, focusable but value cannot be edited. */
  readOnly?:    boolean;
  /** One of: default | compact. */
  size?:        TextareaSize;
  /** Initial visible rows (native `rows`). */
  rows?:        number;
  /** DOM id; pair with Field htmlFor. */
  id?:          string;
  /** Form field name for submit. */
  name?:        string;
  /** Browser autofill hint (e.g. `off`). */
  autoComplete?: string;
  /** Focus on mount when true. */
  autoFocus?:   boolean;
  /** Called when the textarea loses focus. */
  onBlur?:      (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  /** Extra CSS class names on the textarea. */
  className?:   string;
  /** When true, renders a clear (✕) button in the top-right corner while the field has content. */
  allowClear?:  boolean;
}

export function Textarea({
  value,
  onChange,
  placeholder,
  disabled,
  readOnly,
  size      = 'default',
  rows      = 4,
  id,
  name,
  autoComplete,
  autoFocus,
  onBlur,
  className,
  allowClear,
}: TextareaProps) {
  const showClear = allowClear && value.length > 0 && !disabled && !readOnly;

  const classes = [
    'textarea',
    size === 'compact' ? 'textarea--compact' : '',
    allowClear ? 'textarea--has-clear' : '',
    className ?? '',
  ].filter(Boolean).join(' ');

  return (
    <div className="textarea-wrap">
      <textarea
        id={id}
        name={name}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        rows={rows}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        className={classes}
        onBlur={onBlur}
        onChange={(e) => onChange(e.target.value)}
      />
      <span className="textarea-wrap__resize-hint" aria-hidden="true">
        <LofiChevronDownIcon size={12} />
      </span>
      {showClear && (
        <button
          type="button"
          className="textarea-wrap__clear"
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
