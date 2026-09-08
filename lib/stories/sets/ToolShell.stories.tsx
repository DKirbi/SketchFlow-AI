import { createSetKindMeta, setExampleStory } from './createSetKindMeta';

const meta = {
  title: 'LOW FI Design system/Component sets/Tool shell',
  ...createSetKindMeta('tool-shell'),
};
export default meta;

export const ToolShellMapping = setExampleStory('tool-shell-mapping');
