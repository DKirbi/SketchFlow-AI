import { createSetKindMeta, setExampleStory } from './createSetKindMeta';

const meta = {
  title: 'LOW FI Design system/Component sets/Modal editor',
  ...createSetKindMeta('modal-editor'),
};
export default meta;

export const ModalCreateTournament = setExampleStory('modal-create-tournament');
export const ModalTeam = setExampleStory('modal-team');
export const ModalMergeReview = setExampleStory('modal-merge-review');
