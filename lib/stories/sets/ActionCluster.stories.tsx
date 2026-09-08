import { createSetKindMeta, setExampleStory } from './createSetKindMeta';

const meta = {
  title: 'LOW FI Design system/Component sets/Action cluster',
  ...createSetKindMeta('action-cluster'),
};
export default meta;

export const WorkspaceFooter = setExampleStory('workspace-footer');
export const PageFooterMerge = setExampleStory('page-footer-merge');
export const BulkBar = setExampleStory('bulk-bar');
