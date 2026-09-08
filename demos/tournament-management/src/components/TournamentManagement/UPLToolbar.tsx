import { LOFIBadge, LOFIText, LOFIToolbar } from 'lofi-kit';

import './TournamentManagement.scss';

export interface UPLToolbarProps {
  onCycleRole: () => void;
  handle: string;
  role: string;
}

export function UPLToolbar({ onCycleRole, handle, role }: UPLToolbarProps) {
  return (
    <LOFIToolbar
      className="tmgmt__upl-toolbar"
      left={
        <span className="tmgmt__identity">
          <LOFIText variant="sm">{handle}</LOFIText>
          <LOFIBadge
            variant="tag"
            label={role}
            onClick={onCycleRole}
            title="Prototype role — click to switch"
          />
        </span>
      }
      center={
        <LOFIText as="h1" variant="body">
          Tournament Management
        </LOFIText>
      }
    />
  );
}
