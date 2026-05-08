import { useArgs } from 'storybook/preview-api';
import type { ComponentProps } from 'react';
import { LOFICheckbox, LOFIInput, LOFIRadio, LOFISelect } from 'lofi-kit';

/** Storybook-only: wires Select to args so canvas + Controls stay in sync when the user picks an option. */
export function SelectControlledRender(props: ComponentProps<typeof LOFISelect>) {
  const [, updateArgs] = useArgs<ComponentProps<typeof LOFISelect>>();
  return <LOFISelect {...props} onChange={(v) => updateArgs({ value: v })} />;
}

/** Storybook-only: wires Input to args so typing updates Controls. */
export function InputControlledRender(props: ComponentProps<typeof LOFIInput>) {
  const [, updateArgs] = useArgs<ComponentProps<typeof LOFIInput>>();
  return <LOFIInput {...props} onChange={(v) => updateArgs({ value: v })} />;
}

/** Storybook-only: wires Radio `value` to args when an option is selected. */
export function RadioControlledRender(props: ComponentProps<typeof LOFIRadio>) {
  const [, updateArgs] = useArgs<ComponentProps<typeof LOFIRadio>>();
  return <LOFIRadio {...props} onChange={(v) => updateArgs({ value: v })} />;
}

/** Storybook-only: wires Checkbox `checked` to args. */
export function CheckboxControlledRender(props: ComponentProps<typeof LOFICheckbox>) {
  const [, updateArgs] = useArgs<ComponentProps<typeof LOFICheckbox>>();
  return <LOFICheckbox {...props} onChange={(checked) => updateArgs({ checked })} />;
}
