import {
  LOFICheckbox,
  LOFIField,
  LOFIInput,
  LOFISelect,
  LOFISwitch,
} from '../ui/index';
import type { ComponentSetHandlers, FieldDescriptor } from './types';

export interface FieldFromDescriptorProps {
  field: FieldDescriptor;
  onFieldChange?: ComponentSetHandlers['onFieldChange'];
}

export function FieldFromDescriptor({ field, onFieldChange }: FieldFromDescriptorProps) {
  const id = `set-field-${field.name}`;
  const stringValue = typeof field.value === 'string' ? field.value : '';
  const boolValue = typeof field.value === 'boolean' ? field.value : false;

  if (field.kind === 'switch') {
    return (
      <LOFIField label={field.label} htmlFor={id} hint={field.hint}>
        <LOFISwitch
          label={field.label}
          checked={boolValue}
          onChange={(v) => onFieldChange?.(field.name, v)}
        />
      </LOFIField>
    );
  }

  if (field.kind === 'checkbox') {
    return (
      <LOFICheckbox
        id={id}
        label={field.label}
        checked={boolValue}
        onChange={(v) => onFieldChange?.(field.name, v)}
      />
    );
  }

  if (field.kind === 'select') {
    return (
      <LOFIField label={field.label} htmlFor={id} hint={field.hint} required={field.required}>
        <LOFISelect
          id={id}
          size="compact"
          value={stringValue}
          options={field.options ?? []}
          placeholder={field.placeholder}
          allowClear={field.allowClear}
          disabled={field.disabled}
          onChange={(v) => onFieldChange?.(field.name, v)}
        />
      </LOFIField>
    );
  }

  const inputType = field.kind === 'date' ? 'date' : field.kind === 'search' ? 'search' : 'text';

  return (
    <LOFIField label={field.label} htmlFor={id} hint={field.hint} required={field.required}>
      <LOFIInput
        id={id}
        type={inputType}
        value={stringValue}
        placeholder={field.placeholder}
        allowClear={field.allowClear}
        disabled={field.disabled}
        onChange={(v) => onFieldChange?.(field.name, v)}
      />
    </LOFIField>
  );
}
