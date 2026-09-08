import { createSetKindMeta, setExampleStory } from './createSetKindMeta';

const meta = {
  title: 'LOW FI Design system/Component sets/P7 confirm',
  ...createSetKindMeta('p7-confirm'),
};
export default meta;

export const P7Save = setExampleStory('p7-save');
export const P7Discard = setExampleStory('p7-discard');
export const P7BulkMap = setExampleStory('p7-bulk-map');
