import { Text } from '../Text/Text';
import './Fieldset.scss';

export interface FieldsetProps {
  /** Group caption shown in the fieldset border. */
  legend:     string;
  /** Nested fields or controls. */
  children:   React.ReactNode;
  /** Extra CSS class names on the fieldset. */
  className?: string;
}

export function Fieldset({ legend, children, className }: FieldsetProps) {
  return (
    <fieldset className={['fieldset', className ?? ''].filter(Boolean).join(' ')}>
      <legend className="fieldset__legend">
        <Text as="span" variant="inherit">{legend}</Text>
      </legend>
      <div className="fieldset__body">{children}</div>
    </fieldset>
  );
}
