import { useCallback, useId, useMemo, useState } from 'react';
import {
  LOFITable,
  LOFIFieldset,
  LOFIField,
  LOFISelect,
  LOFIInput,
  LOFIButton,
  LOFIText,
  LOFITabs,
} from 'lofi-kit';
import type { ColumnDef } from 'lofi-kit';
import {
  CHAMPIONS_QUAL_TOURNAMENT_ID,
  createChampionsRoundsetRows,
} from '../data/championsTournament';
import { cupRoundAbbrev } from '../lib/roundNaming';
import { useTournamentStore } from '../store/useTournamentStore';
import type { RoundsetRow, Tournament, TournamentEntrant, TournamentStructure } from '../types';

function deriveEntrants(tournament: Tournament): TournamentEntrant[] {
  // Prefer the stored entrants list — it carries user-defined ordering.
  if (tournament.entrants?.length) return tournament.entrants;

  const byId = new Map<string, TournamentEntrant>();
  for (const b of tournament.brackets) {
    if (b.participants?.length) {
      for (const p of b.participants) byId.set(p.id, { id: p.id, name: p.name });
    }
  }

  if (byId.size === 0) {
    // Gather from leaf round in bracket order (not alphabetically).
    const minRound = Math.min(...tournament.brackets.map((x) => x.round));
    const leafBrackets = tournament.brackets
      .filter((b) => b.round === minRound)
      .sort((a, b) => a.position.y - b.position.y);
    for (const b of leafBrackets) {
      for (const m of b.matches) {
        if (m.teamA) byId.set(m.teamA.id, { id: m.teamA.id, name: m.teamA.name });
        if (m.teamB) byId.set(m.teamB.id, { id: m.teamB.id, name: m.teamB.name });
      }
    }
  }

  return [...byId.values()];
}

const SPORTS = [
  'Tennis',
  'Soccer',
  'Basketball',
  'American Football',
  'Baseball',
  'Ice Hockey',
  'Rugby Union',
  'Rugby League',
  'Cricket',
  'Volleyball',
  'Badminton',
  'Table Tennis',
  'Golf',
  'Athletics',
  'Swimming',
  'Cycling',
  'Boxing',
  'MMA',
  'Esports',
];

/** Generate season options from (currentYear - 3) to (currentYear + 2) in both formats. */
function generateSeasonOptions(): string[] {
  const year = new Date().getFullYear();
  const options: string[] = [];
  for (let y = year - 3; y <= year + 2; y++) {
    options.push(String(y));
    options.push(`${y}/${String(y + 1).slice(-2)}`);
  }
  return options;
}

const SEASON_OPTIONS = generateSeasonOptions();

const BRACKET_TYPES = ['Single-elimination, dynamic', 'Single-elimination', 'Double-elimination'];
const ROUNDSET_TYPES = ['Winners bracket', 'Full bracket', 'Consolation'];
const CUP_ROUNDS = [
  // Grand Slam / single-elim names
  'R128',
  'R64',
  'R32',
  'R16',
  'QF',
  'SF',
  'Final',
  // Additional / cup formats
  'Qualification round 1',
  'Qualification round 2',
  'Qualification round 3',
  'Bronze Final',
  'Group Stage',
  'Round',
];
const MATCHUP_TYPES = ['Single match', 'Two-legged tie', 'Best of 3', 'Best of 5'];
const PROGRESSION_TYPES = [
  'Winner of group stage',
  'Winner advances',
  '- terminal match -',
  'Loser advances',
  'Custom',
];

function rowId() {
  return `row-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Returns the tennis-convention round label for a round that is `stepsFromFinal`
 * steps before the final (0 = the final itself).
 */
function roundLabelByStepsFromFinal(stepsFromFinal: number, matchCount: number): string {
  return cupRoundAbbrev(matchCount, stepsFromFinal);
}

/**
 * Builds a complete rounds table from a participant count.
 * Each round has ceil(previous / 2) matches; the sequence runs until there is 1 match (the Final).
 * Round names follow the standard tennis convention based on distance from the Final.
 */
function deriveSingleElimRounds(entrantCount: number): RoundsetRow[] {
  if (entrantCount < 2) return defaultRows();

  const matchesPerRound: number[] = [];
  let count = Math.ceil(entrantCount / 2);
  while (count >= 1) {
    matchesPerRound.push(count);
    if (count === 1) break;
    count = Math.ceil(count / 2);
  }

  const totalRounds = matchesPerRound.length;
  return matchesPerRound.map((matches, idx) => {
    const stepsFromFinal = totalRounds - 1 - idx;
    const isTerminal = stepsFromFinal === 0;
    return {
      id: rowId(),
      order: idx + 1,
      cupRound: roundLabelByStepsFromFinal(stepsFromFinal, matches),
      matchupType: 'Single match',
      progressionType: isTerminal ? '- terminal match -' : 'Winner advances',
      firstMatchDate: '',
      venue: '',
    };
  });
}

function defaultRows(): RoundsetRow[] {
  return [
    {
      id: rowId(),
      order: 1,
      cupRound: 'QF',
      matchupType: 'Single match',
      progressionType: 'Winner advances',
      firstMatchDate: '',
      venue: '',
    },
    {
      id: rowId(),
      order: 2,
      cupRound: 'SF',
      matchupType: 'Single match',
      progressionType: 'Winner advances',
      firstMatchDate: '',
      venue: '',
    },
    {
      id: rowId(),
      order: 3,
      cupRound: 'Final',
      matchupType: 'Single match',
      progressionType: '- terminal match -',
      firstMatchDate: '',
      venue: '',
    },
  ];
}

interface Props {
  /**
   * Called after the user clicks "Generate Upcoming Brackets" or
   * "Generate Finished Brackets" and the store has been updated.
   * Typically advances the app from step 1 to the bracket canvas (step 2).
   */
  onGenerated: () => void;
  /** Navigate to the Team Management prototype view. */
  onTeams?: () => void;
}

function initialRoundsetRows(
  tournamentId: string,
  saved: TournamentStructure | null,
  entrantCount: number,
): RoundsetRow[] {
  if (saved?.rows?.length) return saved.rows;
  if (tournamentId === CHAMPIONS_QUAL_TOURNAMENT_ID) return createChampionsRoundsetRows();
  if (entrantCount >= 2) return deriveSingleElimRounds(entrantCount);
  return defaultRows();
}

export function StructureSetupView({ onGenerated, onTeams }: Props) {
  const applyGenerateFromStructure = useTournamentStore((s) => s.applyGenerateFromStructure);
  const applyGenerateFinishedFromStructure = useTournamentStore(
    (s) => s.applyGenerateFinishedFromStructure,
  );
  const tournament = useTournamentStore((s) => s.tournament);
  const tournamentStructure = useTournamentStore((s) => s.tournamentStructure);

  // Entrants are fed from the previous step; derive count here for row initialisation only.
  const entrants = useMemo(() => deriveEntrants(tournament), [tournament]);

  const formId = useId();
  const [sport, setSport] = useState(tournament.sport);
  const [name, setName] = useState(tournament.name);
  const [season, setSeason] = useState(tournament.season ?? '2025/26');
  const [bracketType, setBracketType] = useState(
    () => tournamentStructure?.bracketType ?? BRACKET_TYPES[0],
  );
  const [roundsetType, setRoundsetType] = useState(
    () => tournamentStructure?.roundsetType ?? ROUNDSET_TYPES[0],
  );
  const [order, setOrder] = useState(() => tournamentStructure?.order ?? '1');
  const [rows, setRows] = useState<RoundsetRow[]>(() =>
    initialRoundsetRows(tournament.id, tournamentStructure, entrants.length),
  );

  const updateRow = useCallback((id: string, patch: Partial<RoundsetRow>) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }, []);

  const removeRow = useCallback((id: string) => {
    setRows((prev) => {
      const next = prev.filter((r) => r.id !== id);
      return next.map((r, i) => ({ ...r, order: i + 1 }));
    });
  }, []);

  const addRow = useCallback(() => {
    setRows((prev) => [
      ...prev,
      {
        id: rowId(),
        order: prev.length + 1,
        cupRound: 'Round',
        matchupType: 'Single match',
        progressionType: 'Winner advances',
        firstMatchDate: '',
        venue: '',
      },
    ]);
  }, []);

  const buildStructure = (): TournamentStructure => ({
    bracketType,
    roundsetType,
    order,
    rows: rows.map((r, i) => ({ ...r, order: i + 1 })),
  });

  const handleGenerate = () => {
    applyGenerateFromStructure({
      sport: sport.trim() || SPORTS[0]!,
      name: name.trim() || 'Tournament',
      season: season.trim(),
      structure: buildStructure(),
    });
    onGenerated();
  };

  const handleGenerateFinished = () => {
    applyGenerateFinishedFromStructure({
      sport: sport.trim() || SPORTS[0]!,
      name: name.trim() || 'Tournament',
      season: season.trim(),
      structure: buildStructure(),
    });
    onGenerated();
  };

  const sportOptions = useMemo(() => {
    const opts = SPORTS.map((s) => ({ value: s, label: s }));
    if (sport.trim() && !SPORTS.includes(sport)) {
      return [{ value: sport, label: sport }, ...opts];
    }
    return opts;
  }, [sport]);

  const seasonSelectOptions = useMemo(() => {
    const opts = SEASON_OPTIONS.map((s) => ({ value: s, label: s }));
    if (season.trim() && !SEASON_OPTIONS.includes(season)) {
      return [{ value: season, label: season }, ...opts];
    }
    return opts;
  }, [season]);

  const roundColumns: ColumnDef<RoundsetRow, unknown>[] = useMemo(
    () => [
      {
        accessorKey: 'order',
        header: 'Order',
        size: 56,
        cell: ({ row }) => <LOFIText variant="sm">{row.original.order}</LOFIText>,
      },
      {
        accessorKey: 'cupRound',
        header: 'Cup round',
        cell: ({ row }) => (
          <LOFISelect
            className="structure-select structure-select--table"
            value={row.original.cupRound}
            onChange={(v) => updateRow(row.original.id, { cupRound: v })}
            options={CUP_ROUNDS.map((r) => ({ value: r, label: r }))}
            size="compact"
          />
        ),
      },
      {
        accessorKey: 'matchupType',
        header: 'Matchup type',
        cell: ({ row }) => (
          <LOFISelect
            className="structure-select structure-select--table"
            value={row.original.matchupType}
            onChange={(v) => updateRow(row.original.id, { matchupType: v })}
            options={MATCHUP_TYPES.map((r) => ({ value: r, label: r }))}
            size="compact"
          />
        ),
      },
      {
        accessorKey: 'progressionType',
        header: 'Progression type',
        cell: ({ row }) => (
          <LOFISelect
            className="structure-select structure-select--table"
            value={row.original.progressionType}
            onChange={(v) => updateRow(row.original.id, { progressionType: v })}
            options={PROGRESSION_TYPES.map((r) => ({ value: r, label: r }))}
            size="compact"
          />
        ),
      },
      {
        accessorKey: 'firstMatchDate',
        header: 'First match (optional)',
        cell: ({ row }) => (
          <LOFIInput
            className="structure-input structure-input--table"
            placeholder="dd.mm.yyyy"
            value={row.original.firstMatchDate}
            onChange={(v) => updateRow(row.original.id, { firstMatchDate: v })}
            size="compact"
          />
        ),
      },
      {
        accessorKey: 'venue',
        header: 'Venue (optional)',
        cell: ({ row }) => (
          <LOFIInput
            className="structure-input structure-input--table"
            placeholder="Venue name"
            value={row.original.venue}
            onChange={(v) => updateRow(row.original.id, { venue: v })}
            size="compact"
          />
        ),
      },
      {
        id: 'actions',
        header: 'Actions',
        size: 72,
        cell: ({ row, table }) => {
          const idx = table.getRowModel().rows.findIndex((r) => r.original.id === row.original.id);
          return (
            <LOFIButton
              type="button"
              variant="dismiss"
              size="compact"
              className="structure-row-remove"
              onClick={() => removeRow(row.original.id)}
              title="Remove row"
              aria-label={`Remove round ${idx + 1}`}
            >
              ×
            </LOFIButton>
          );
        },
      },
    ],
    [updateRow, removeRow],
  );

  return (
    <div className="structure-setup">
      <header className="structure-header">
        <div className="structure-header__identity">
          <div className="structure-app-title">BRACKET BUILDER</div>
          <div className="structure-tournament-line">
            <span className="structure-name">{name || 'Tournament'}</span>
            <span className="structure-season">{season ? ` · Season ${season}` : ''}</span>
          </div>
        </div>
        <LOFITabs
          value="setup"
          onChange={() => {}}
          tabs={[
            { value: 'setup',   label: 'Structure setup' },
            { value: 'bracket', label: 'Bracket view', disabled: true },
          ]}
          ariaLabel="App navigation"
        />
      </header>

      <main className="structure-main">
        <LOFIText as="h1" variant="body" className="structure-page-title">Bracket setup for tournament</LOFIText>
        <LOFIText as="p" variant="muted" className="structure-intro">
          Pick a bracket type, configure rounds, and define progression logic. This step runs before
          the interactive bracket canvas.
        </LOFIText>

        <LOFIFieldset className="structure-fieldset" legend="General">
          <div className="structure-form-grid">
            <LOFIField label="Sport" htmlFor={`${formId}-sport`}>
              <LOFISelect
                id={`${formId}-sport`}
                className="structure-select"
                value={sport}
                onChange={setSport}
                options={sportOptions}
              />
            </LOFIField>
            <LOFIField label="Tournament name" htmlFor={`${formId}-name`}>
              <LOFIInput
                id={`${formId}-name`}
                className="structure-input"
                value={name}
                onChange={setName}
                autoComplete="off"
              />
            </LOFIField>
            <LOFIField label="Season" htmlFor={`${formId}-season`}>
              <LOFISelect
                id={`${formId}-season`}
                className="structure-select"
                value={season}
                onChange={setSeason}
                options={seasonSelectOptions}
              />
            </LOFIField>
          </div>
        </LOFIFieldset>

        <LOFIFieldset className="structure-fieldset" legend="Configuration">
          <div className="structure-config-row">
            <LOFIField inline label="Bracket type" htmlFor={`${formId}-bracket-type`}>
              <LOFISelect
                id={`${formId}-bracket-type`}
                className="structure-select"
                value={bracketType}
                onChange={setBracketType}
                options={BRACKET_TYPES.map((t) => ({ value: t, label: t }))}
              />
            </LOFIField>
            <LOFIField inline label="Roundset type" htmlFor={`${formId}-roundset`}>
              <LOFISelect
                id={`${formId}-roundset`}
                className="structure-select"
                value={roundsetType}
                onChange={setRoundsetType}
                options={ROUNDSET_TYPES.map((t) => ({ value: t, label: t }))}
              />
            </LOFIField>
            <LOFIField inline label="Order" htmlFor={`${formId}-order`}>
              <LOFISelect
                id={`${formId}-order`}
                className="structure-select"
                value={order}
                onChange={setOrder}
                options={[
                  { value: '1', label: '1' },
                  { value: '2', label: '2' },
                  { value: '3', label: '3' },
                ]}
              />
            </LOFIField>
          </div>
        </LOFIFieldset>

        <section className="structure-table-wrap">
          <div className="structure-rounds-header">
            <span className="structure-table-hint">
              Each row = one cup round. Progression type determines who advances automatically.
            </span>
          </div>
          <div className="structure-table-scroll">
            <LOFITable<RoundsetRow>
              columns={roundColumns}
              rows={rows}
              keyField="id"
              emptyText="No rounds."
            />
          </div>
          <div className="structure-table-footer">
            <LOFIButton type="button" variant="default" className="structure-add-round" onClick={addRow}>
              + Add round
            </LOFIButton>
          </div>
        </section>

        <div className="structure-actions">
          {onTeams && (
            <LOFIButton
              type="button"
              variant="default"
              className="structure-generate-btn structure-generate-btn--secondary"
              onClick={onTeams}
            >
              Team Management →
            </LOFIButton>
          )}
          <LOFIButton type="button" variant="primary" className="structure-generate-btn" onClick={handleGenerate}>
            Generate Upcoming Brackets →
          </LOFIButton>
          <LOFIButton
            type="button"
            variant="primary"
            className="structure-generate-btn structure-generate-btn--finished"
            onClick={handleGenerateFinished}
          >
            Generate Finished Brackets →
          </LOFIButton>
        </div>
      </main>
    </div>
  );
}
