import { createSetKindMeta, setExampleStory } from './createSetKindMeta';

const meta = {
  title: 'LOW FI Design system/Component sets/Sidebar',
  ...createSetKindMeta('sidebar'),
};
export default meta;

export const SidebarUpl = setExampleStory('sidebar-upl');
export const SidebarNotifications = setExampleStory('sidebar-notifications');
