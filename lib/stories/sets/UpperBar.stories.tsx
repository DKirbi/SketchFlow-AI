import { createSetKindMeta, setExampleStory } from './createSetKindMeta';

const meta = {
  title: 'LOW FI Design system/Component sets/Upper bar',
  ...createSetKindMeta('upper-bar'),
};
export default meta;

export const UplUpperBar = setExampleStory('upl-upper-bar');
export const ToolUpperBar = setExampleStory('tool-upper-bar');
