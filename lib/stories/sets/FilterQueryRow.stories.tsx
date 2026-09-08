import { createSetKindMeta, setExampleStory } from './createSetKindMeta';

const meta = {
  title: 'LOW FI Design system/Component sets/Filter query row',
  ...createSetKindMeta('filter-query-row'),
};
export default meta;

export const FilterCommit = setExampleStory('filter-commit');
export const FilterImmediate = setExampleStory('filter-immediate');
