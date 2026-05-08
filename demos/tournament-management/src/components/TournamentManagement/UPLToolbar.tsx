import { LOFIButton, LOFIText, LOFIToolbar } from 'lofi-kit';

import './TournamentManagement.scss';

export interface UPLToolbarProps {
  onCycleRole: () => void;
  roleLabel: string;
}

export function UPLToolbar({ onCycleRole, roleLabel }: UPLToolbarProps) {
  return (
    <LOFIToolbar
      className="tmgmt__upl-toolbar"
      left={
        <div className="tmgmt__upl-left">
          <div className="tmgmt__logo-placeholder" aria-hidden />
          <div className="tmgmt__upl-titles">
            <LOFIText as="span" variant="body">
              Unified Production Landscape | Tournament management (prototype shell)
            </LOFIText>
            <LOFIText as="span" variant="muted">
              Manage simple tournaments linked to sidebar classification
            </LOFIText>
          </div>
        </div>
      }
      right={
        <div className="tmgmt__upl-right">
          <LOFIButton type="button" variant="dismiss" size="compact">
            Applications
          </LOFIButton>
          <LOFIButton type="button" variant="dismiss" size="compact">
            Configuration
          </LOFIButton>
          <LOFIButton type="button" variant="dismiss" size="compact" onClick={onCycleRole}>
            <LOFIText variant="micro">{roleLabel}</LOFIText>
          </LOFIButton>
        </div>
      }
    />
  );
}
