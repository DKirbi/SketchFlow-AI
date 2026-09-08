import { createSetKindMeta, setExampleStory } from './createSetKindMeta';

const meta = {
  title: 'LOW FI Design system/Component sets/UPL shell',
  ...createSetKindMeta('upl-shell'),
};
export default meta;

export const UplShellTournament = setExampleStory('upl-shell-tournament');
