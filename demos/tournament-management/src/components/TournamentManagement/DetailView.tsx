import { useState } from 'react';
import { LOFIButton, LOFIInlineAlert, LOFIMainWorkspace, LOFITabs, LOFIText } from 'lofi-kit';

import type { Role, SimpleTournament } from '../../types';
import { breadcrumbPartsForLeaf } from '../../lib/sidebarTree';
import { Changelog } from './Changelog';
import { OverviewPanel } from './OverviewPanel';
import type { ChangelogEntry } from '../../types';

export interface DetailViewProps {
  tournament: SimpleTournament;
  uniqueTournamentLabel: string;
  changelog: ChangelogEntry[];
  role: Role;
  onEdit: () => void;
  onClone: () => void;
  onRemove: () => void;
  onMove: () => void;
  onToggleDisabled: () => void;
  onNavigateToNavId: (id: string) => void;
}

export function DetailView({
  tournament,
  uniqueTournamentLabel,
  changelog,
  role,
  onEdit,
  onClone,
  onRemove,
  onMove,
  onToggleDisabled,
  onNavigateToNavId,
}: DetailViewProps) {
  const [tab, setTab] = useState<'overview' | 'changelog'>('overview');

  const parts = breadcrumbPartsForLeaf(tournament);

  const bc = (
    <>
      <LOFIButton type="button" size="compact" variant="dismiss" onClick={() => onNavigateToNavId(tournament.sportId)}>
        {parts.sport}
      </LOFIButton>
      <LOFIText variant="muted"> › </LOFIText>
      <LOFIText variant="muted">{parts.category}</LOFIText>
      <LOFIText variant="muted"> › </LOFIText>
      <LOFIButton
        type="button"
        size="compact"
        variant="dismiss"
        onClick={() =>
          onNavigateToNavId(
            tournament.uniqueTournamentId === ''
              ? `ut-none-${tournament.categoryId}`
              : tournament.uniqueTournamentId,
          )
        }
      >
        {parts.ut}
      </LOFIButton>
      <LOFIText variant="muted"> › </LOFIText>
      <LOFIText variant="muted">{parts.st}</LOFIText>
    </>
  );

  return (
    <LOFIMainWorkspace
      breadcrumb={bc}
      title={parts.st}
      titleBadges={
        <>
          <LOFIText variant="micro" className="tmgmt__id-inline">
            {tournament.id}
          </LOFIText>
        </>
      }
      tabs={
        <LOFITabs
          ariaLabel="Tournament zones"
          value={tab}
          onChange={(v) => setTab(v as typeof tab)}
          tabs={[
            { value: 'overview', label: 'Overview' },
            { value: 'changelog', label: 'Change log' },
          ]}
        />
      }
    >
      {role === 'operator' && (
        <LOFIInlineAlert
          severity="info"
          title="Role gate"
          message="Destructive Move / Remove are hidden while role is Operator — switch role using the toolbar strip."
        />
      )}
      {tab === 'overview' ? (
        <OverviewPanel
          tournament={tournament}
          breadcrumb={`${parts.sport} › ${parts.category} › ${parts.ut}`}
          uniqueTournamentLabel={uniqueTournamentLabel}
          role={role}
          onEdit={onEdit}
          onClone={onClone}
          onRemove={onRemove}
          onMove={onMove}
          onToggleDisabled={onToggleDisabled}
        />
      ) : (
        <Changelog entries={changelog} entityIdFilter={tournament.id} />
      )}
    </LOFIMainWorkspace>
  );
}
