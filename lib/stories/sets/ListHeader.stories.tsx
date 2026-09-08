import { createSetKindMeta, setExampleStory } from './createSetKindMeta';

const meta = {
  title: 'LOW FI Design system/Component sets/List header',
  ...createSetKindMeta('list-header'),
};
export default meta;

export const ListHeader = setExampleStory('list-header');
