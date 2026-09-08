import { createSetKindMeta, setExampleStory } from './createSetKindMeta';

const meta = {
  title: 'LOW FI Design system/Component sets/Suggestion row',
  ...createSetKindMeta('suggestion-row'),
};
export default meta;

export const HighConfidence = setExampleStory('suggestion-row-high');
export const Mapped = setExampleStory('suggestion-row-mapped');
