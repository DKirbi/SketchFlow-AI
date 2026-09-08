import { createSetKindMeta, setExampleStory } from './createSetKindMeta';

const meta = {
  title: 'LOW FI Design system/Component sets/Main workspace',
  ...createSetKindMeta('main-workspace'),
};
export default meta;

export const MainWorkspaceDetail = setExampleStory('main-workspace-detail');
