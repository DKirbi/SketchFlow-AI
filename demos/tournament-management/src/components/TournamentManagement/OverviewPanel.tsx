import { LOFIBadge, LOFIButton, LOFICard, LOFIText } from 'lofi-kit';

import type { Role, SimpleTournament } from '../../types';

export interface OverviewPanelProps {
  tournament: SimpleTournament;
  breadcrumb: string;
  uniqueTournamentLabel: string;
  role: Role;
  onEdit: () => void;
  onClone: () => void;
  onRemove: () => void;
  onMove: () => void;
  onToggleDisabled: () => void;
}

export function OverviewPanel({
  tournament: st,
  breadcrumb,
  uniqueTournamentLabel,
  role,
  onEdit,
  onClone,
  onRemove,
  onMove,
  onToggleDisabled,
}: OverviewPanelProps) {
  const canDanger = role === 'supervisor' || role === 'admin';
  const disableLabel = st.disabled ? 'Enable' : 'Disable';

  return (
    <div className="tmgmt__overview">
      <LOFICard className="tmgmt__overview-card" title="Summary">
        <LOFIText variant="micro" className="tmgmt__overview-crumb">
          {breadcrumb}
        </LOFIText>
        <div className="tmgmt__overview-flags">
          <LOFIBadge variant="tag" label="simple tournament" />
          {st.running && <LOFIBadge variant="tag" label="running" />}
          <LOFIBadge variant="status" active={!st.disabled} label={st.disabled ? 'disabled' : 'active'} />
        </div>

        <LOFIText variant="body">Unique tournament linkage</LOFIText>
        <LOFIText variant="muted">{uniqueTournamentLabel}</LOFIText>

        <div className="tmgmt__overview-toolbar">
          <LOFIButton type="button" variant="default" size="compact" onClick={onEdit}>
            ✎ Edit
          </LOFIButton>
          <LOFIButton type="button" variant="dismiss" size="compact" onClick={onClone}>
            ⧉ Clone
          </LOFIButton>
          <LOFIButton type="button" variant="dismiss" size="compact" onClick={onToggleDisabled}>
            {disableLabel}
          </LOFIButton>
          {canDanger && (
            <>
              <LOFIButton type="button" variant="dismiss" size="compact" onClick={onMove}>
                Move
              </LOFIButton>
              <LOFIButton type="button" variant="primary" size="compact" onClick={onRemove}>
                Remove
              </LOFIButton>
            </>
          )}
        </div>
      </LOFICard>
    </div>
  );
}
