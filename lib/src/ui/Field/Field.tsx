import { Text } from '../Text/Text';
import { Tooltip, TooltipMarker } from '../Tooltip/Tooltip';
import './Field.scss';

export interface FieldProps {
  /** Field label shown above or beside the control. */
  label:     string;
  /** Helper line under the control; omit if none. Prefer `tooltip` for input information. */
  hint?:     string;
  /** Extra information about the input, shown in a tooltip on the label marker. */
  tooltip?:  string;
  /** Inline validation error message; replaces hint when set. */
  error?:    string;
  /** If true, shows required marker on the label. */
  required?: boolean;
  /** If true, label and control align in one row. */
  inline?:   boolean;
  /** Id of the nested input/select so the label associates correctly. */
  htmlFor?:  string;
  /** The actual control(s): Input, Select, etc. */
  children:  React.ReactNode;
}

export function Field({ label, hint, tooltip, error, required, inline, htmlFor, children }: FieldProps) {
  const classes = [
    'field',
    inline ? 'field--inline' : '',
    error ? 'field--error' : '',
  ].filter(Boolean).join(' ');
  const labelClass = ['field__label', required ? 'field__label--required' : ''].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      <div className="field__label-row">
        <label className={labelClass} htmlFor={htmlFor}>
          <Text as="span" variant="inherit">{label}</Text>
        </label>
        {tooltip ? (
          <Tooltip content={tooltip}>
            <TooltipMarker label={label} />
          </Tooltip>
        ) : null}
      </div>
      {children}
      {error ? (
        <span className="field__error" role="alert">
          <Text as="span" variant="inherit">{error}</Text>
        </span>
      ) : hint ? (
        <span className="field__hint">
          <Text as="span" variant="inherit">{hint}</Text>
        </span>
      ) : null}
    </div>
  );
}
