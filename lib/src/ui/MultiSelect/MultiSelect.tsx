import * as Popover from '@radix-ui/react-popover';
import { useMemo, useState } from 'react';
import { Checkbox } from '../Checkbox/Checkbox';
import { Input } from '../Input/Input';
import { Text } from '../Text/Text';
import { LofiChevronDownIcon } from '../Util/LofiRadixIcons';
import '../DropdownMenu/DropdownMenu.scss';
import '../Select/Select.scss';
import './MultiSelect.scss';

export interface MultiSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface MultiSelectProps {
  /** Selected option values (controlled). */
  value: string[];
  /** Called with the new selection array on change. */
  onChange: (value: string[]) => void;
  /** Fixed list of choices. */
  options: MultiSelectOption[];
  /** Shown on the trigger when nothing is selected. */
  placeholder?: string;
  /** Shown on the trigger when two or more items are selected. */
  multipleLabel?: string;
  /** Label for the optional “select all” sentinel row at the top of the menu. */
  allLabel?: string;
  /**
   * When set, prepends an “all” row with this value. Selecting it clears other
   * selections; selecting any other option removes the all value from `value`.
   */
  allValue?: string;
  /** If true, a search field filters options in the open menu. */
  searchable?: boolean;
  /** Placeholder for the in-menu search field. */
  searchPlaceholder?: string;
  /** If true, the control is non-interactive. */
  disabled?: boolean;
  /** One of: default | compact | large. */
  size?: 'default' | 'compact' | 'large';
  /** DOM id for the trigger; pair with Field htmlFor. */
  id?: string;
  /** Extra CSS class on the trigger. */
  className?: string;
}

function triggerLabel(
  value: string[],
  options: MultiSelectOption[],
  placeholder: string,
  multipleLabel: string,
  allValue?: string,
  allLabel?: string,
): string {
  if (value.length === 0) return placeholder;
  if (allValue && value.includes(allValue)) {
    return allLabel ?? 'All';
  }
  if (value.length === 1) {
    const match = options.find((o) => o.value === value[0]);
    return match?.label ?? value[0]!;
  }
  return multipleLabel;
}

export function MultiSelect({
  value,
  onChange,
  options,
  placeholder = 'Select…',
  multipleLabel = 'Multiple Entries',
  allLabel = 'All',
  allValue,
  searchable = false,
  searchPlaceholder = 'Search…',
  disabled,
  size = 'default',
  id,
  className,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const isAll = allValue !== undefined && value.includes(allValue);

  const filteredOptions = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, search]);

  const display = triggerLabel(value, options, placeholder, multipleLabel, allValue, allLabel);

  const triggerClasses = [
    'select',
    size === 'compact' ? 'select--compact' : '',
    size === 'large' ? 'select--large' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  const menuClasses = [
    'dropdown-menu',
    'multiselect__panel',
    size === 'compact' ? 'dropdown-menu--compact' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const toggleOption = (optionValue: string, checked: boolean) => {
    if (allValue && optionValue === allValue) {
      onChange(checked ? [allValue] : []);
      return;
    }

    if (allValue && value.includes(allValue) && optionValue !== allValue) {
      onChange([optionValue]);
      return;
    }

    const withoutAll = allValue ? value.filter((v) => v !== allValue) : [...value];
    if (checked) {
      onChange([...withoutAll, optionValue]);
      return;
    }
    onChange(withoutAll.filter((v) => v !== optionValue));
  };

  const isChecked = (optionValue: string) => {
    if (allValue && optionValue === allValue) return isAll;
    return isAll || value.includes(optionValue);
  };

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) setSearch('');
  };

  return (
    <Popover.Root open={open} onOpenChange={handleOpenChange}>
      <Popover.Trigger asChild>
        <button
          type="button"
          id={id}
          className={triggerClasses}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          <span className="select__value">
            <Text as="span" variant="inherit">
              {display}
            </Text>
          </span>
          <span className="select__icon" aria-hidden>
            <LofiChevronDownIcon size={14} />
          </span>
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          className={menuClasses}
          side="bottom"
          sideOffset={2}
          align="start"
          avoidCollisions
          onOpenAutoFocus={(e) => {
            if (searchable) e.preventDefault();
          }}
        >
          {searchable ? (
            <div className="multiselect__search">
              <Input
                value={search}
                onChange={setSearch}
                placeholder={searchPlaceholder}
                allowClear
                size={size === 'compact' ? 'compact' : 'default'}
              />
            </div>
          ) : null}

          <ul
            className="multiselect__list"
            role="listbox"
            aria-multiselectable="true"
            aria-label={placeholder}
          >
            {allValue !== undefined ? (
              <li role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={isAll}
                  className="multiselect__option"
                  onClick={() => toggleOption(allValue, !isAll)}
                >
                  <span className="multiselect__option-checkbox">
                    <Checkbox
                      checked={isAll}
                      onChange={() => undefined}
                      label=""
                      size="sm"
                    />
                  </span>
                  <span className="multiselect__option-label">
                    <Text as="span" variant="inherit">
                      {allLabel}
                    </Text>
                  </span>
                </button>
              </li>
            ) : null}

            {filteredOptions.length === 0 ? (
              <li className="multiselect__empty" role="presentation">
                <Text variant="muted">No matches</Text>
              </li>
            ) : (
              filteredOptions.map((opt) => {
                const checked = isChecked(opt.value);
                const optionDisabled = Boolean(opt.disabled);

                return (
                  <li key={opt.value} role="presentation">
                    <button
                      type="button"
                      role="option"
                      aria-selected={checked}
                      aria-disabled={optionDisabled || undefined}
                      disabled={optionDisabled}
                      className={[
                        'multiselect__option',
                        optionDisabled ? 'multiselect__option--disabled' : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      onClick={() => {
                        if (optionDisabled) return;
                        toggleOption(opt.value, !checked);
                      }}
                    >
                      <span className="multiselect__option-checkbox">
                        <Checkbox
                          checked={checked}
                          onChange={() => undefined}
                          label=""
                          size="sm"
                          disabled={optionDisabled}
                        />
                      </span>
                      <span className="multiselect__option-label">
                        <Text as="span" variant="inherit">
                          {opt.label}
                        </Text>
                      </span>
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
