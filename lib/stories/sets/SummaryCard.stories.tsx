import { createSetKindMeta, setExampleStory } from './createSetKindMeta';

const meta = {
  title: 'LOW FI Design system/Component sets/Summary card',
  ...createSetKindMeta('summary-card'),
};
export default meta;

export const SummaryCard = setExampleStory('summary-card');
