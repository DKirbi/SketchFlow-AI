/**
 * Radix Select forbids `Select.Item` with `value=""`. Optional filters use this
 * sentinel instead of an empty string for “match all”.
 */
export const FILTER_OPTION_ALL = '__all__' as const;
