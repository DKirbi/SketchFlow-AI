import type {
  Bracket,
  Match,
  MatchStatus,
  Progression,
  ProgressionRule,
  RoundsetRow,
  Team,
  Tournament,
} from '../types';
import { seedBracketMatchesMeta } from '../lib/matchDisplay';
import championsJson from './champions_matches.json';

/** Default tournament id for UCL qualification mock data */
export const CHAMPIONS_QUAL_TOURNAMENT_ID = 'champions-tournament-ucl-qual';

/** Canvas layout: one bracket node per tie, stacked per round column */
export const CHAMPIONS_LAYOUT = {
  baseX: 60,
  baseY: 100,
  /** Horizontal offset between round columns (matches previous 3-column mock) */
  columnWidth: 480,
  /** Vertical gap between ties within the same round */
  rowGap: 200,
} as const;

/** Column bands and dividers for [`RoundGuides`]; aligned with `CHAMPIONS_LAYOUT` */
export const CHAMPIONS_ROUND_GUIDES = {
  columns: [
    { label: 'QUALIFICATION ROUND 1', startX: 0, endX: 540 },
    { label: 'QUALIFICATION ROUND 2', startX: 540, endX: 1020 },
    { label: 'QUALIFICATION ROUND 3', startX: 1020, endX: 1560 },
  ],
  dividerX: [540, 1020] as const,
} as const;

/** Venue block as in champions_matches.json */
export interface ChampionsVenue {
  name?: string;
  city?: { name?: string; country?: { name?: string } };
}

/** One element of the champions export array */
export interface ChampionsExportRow {
  match: {
    id: string;
    home: { id: string; name: string };
    away: { id: string; name: string };
    cupRound: {
      round: { id: string; name: string };
      matchNumber: string;
    };
    hasResult: boolean;
    tournament?: { name: string };
    simpleTournament?: { name: string };
    sport?: { name: string };
    startTime?: string;
    venue?: ChampionsVenue;
  };
}

function championsVenueName(venue: ChampionsVenue | undefined): string | undefined {
  if (!venue?.name?.trim()) return undefined;
  const city = venue.city?.name?.trim();
  const country = venue.city?.country?.name?.trim();
  if (city && country) return `${venue.name}, ${city}`;
  if (city) return `${venue.name}, ${city}`;
  return venue.name;
}

function pairKey(homeId: string, awayId: string): string {
  return [homeId, awayId].sort().join('|');
}

function seasonFromStartTime(startTime: string | undefined): string | undefined {
  if (!startTime) return undefined;
  const y = Number.parseInt(startTime.slice(0, 4), 10);
  if (Number.isNaN(y)) return undefined;
  const next = y + 1;
  return `${y}/${String(next).slice(-2)}`;
}

function maxSeasonFromRows(rows: ChampionsExportRow[]): string | undefined {
  let latest: string | undefined;
  for (const row of rows) {
    const t = row.match.startTime;
    if (!t) continue;
    if (!latest || t > latest) latest = t;
  }
  return seasonFromStartTime(latest);
}

/** Structure-setup table preset matching a typical UCL qualification export */
export function createChampionsRoundsetRows(): RoundsetRow[] {
  return [
    {
      id: 'champions-rs-q1',
      order: 1,
      cupRound: 'Qualification round 1',
      matchupType: 'Two-legged tie',
      progressionType: 'Winner advances',
      firstMatchDate: '',
      venue: '',
    },
    {
      id: 'champions-rs-q2',
      order: 2,
      cupRound: 'Qualification round 2',
      matchupType: 'Two-legged tie',
      progressionType: 'Winner advances',
      firstMatchDate: '',
      venue: '',
    },
    {
      id: 'champions-rs-q3',
      order: 3,
      cupRound: 'Qualification round 3',
      matchupType: 'Two-legged tie',
      progressionType: '- terminal match -',
      firstMatchDate: '',
      venue: '',
    },
  ];
}

function collectParticipants(matches: Match[]): Team[] {
  const byId = new Map<string, Team>();
  for (const m of matches) {
    if (m.teamA) byId.set(m.teamA.id, m.teamA);
    if (m.teamB) byId.set(m.teamB.id, m.teamB);
  }
  return [...byId.values()].sort((a, b) => a.name.localeCompare(b.name));
}

function findBracketWithTeamInRound(
  bracketsInRound: Bracket[],
  teamId: string
): Bracket | undefined {
  return bracketsInRound.find((b) => {
    const m = b.matches[0];
    return m && (m.teamA?.id === teamId || m.teamB?.id === teamId);
  });
}

/**
 * One {@link Progression} per rule so the canvas can draw one edge each and deletion stays simple.
 * Resolves sources by finding the previous-round bracket whose single match contains each team.
 */
export function inferChampionsProgressions(brackets: Bracket[]): Progression[] {
  const byRound = new Map<number, Bracket[]>();
  for (const b of brackets) {
    const list = byRound.get(b.round) ?? [];
    list.push(b);
    byRound.set(b.round, list);
  }

  const roundNums = [...byRound.keys()].sort((a, b) => a - b);
  const out: Progression[] = [];
  let ruleSeq = 0;

  for (let ri = 1; ri < roundNums.length; ri++) {
    const prevRound = roundNums[ri - 1]!;
    const currRound = roundNums[ri]!;
    const prevBrackets = byRound.get(prevRound) ?? [];
    const currBrackets = byRound.get(currRound) ?? [];

    for (const cb of currBrackets) {
      const m = cb.matches[0];
      if (!m) continue;

      const trySlot = (team: Team | null, toSlot: 'teamA' | 'teamB') => {
        if (!team) return;
        const srcBracket = findBracketWithTeamInRound(prevBrackets, team.id);
        const srcMatch = srcBracket?.matches[0];
        if (!srcBracket || !srcMatch) return;
        const rule: ProgressionRule = {
          fromBracketId: srcBracket.id,
          fromMatchId: srcMatch.id,
          toBracketId: cb.id,
          toMatchId: m.id,
          toSlot,
          trigger: 'AFTER_MATCH_END',
          condition: 'WINNER',
        };
        ruleSeq += 1;
        out.push({
          id: `champions-prog-${ruleSeq}-${srcBracket.id}-to-${cb.id}-${toSlot}`,
          rules: [rule],
        });
      };

      trySlot(m.teamA, 'teamA');
      trySlot(m.teamB, 'teamB');
    }
  }

  return out;
}

/**
 * Builds a {@link Tournament} from a champions-style export: one {@link Bracket} per merged tie
 * (each bracket has a single {@link Match}). Rounds are columns; ties stack vertically.
 *
 * Update `src/data/champions_matches.json` when you receive a new export.
 */
export function buildChampionsTournament(rows: ChampionsExportRow[]): Tournament {
  const byRound = new Map<string, { name: string; rows: ChampionsExportRow[] }>();
  for (const row of rows) {
    const rid = row.match.cupRound.round.id;
    const rname = row.match.cupRound.round.name;
    let bucket = byRound.get(rid);
    if (!bucket) {
      bucket = { name: rname, rows: [] };
      byRound.set(rid, bucket);
    }
    bucket.rows.push(row);
  }

  const roundIds = [...byRound.keys()].sort();
  const brackets: Bracket[] = [];
  const { baseX, baseY, columnWidth, rowGap } = CHAMPIONS_LAYOUT;

  for (let roundIdx = 0; roundIdx < roundIds.length; roundIdx++) {
    const roundId = roundIds[roundIdx]!;
    const { name: roundName, rows: roundRows } = byRound.get(roundId)!;
    const roundNum = roundIdx + 1;

    const byPair = new Map<string, ChampionsExportRow[]>();
    for (const r of roundRows) {
      const pk = pairKey(r.match.home.id, r.match.away.id);
      let list = byPair.get(pk);
      if (!list) {
        list = [];
        byPair.set(pk, list);
      }
      list.push(r);
    }

    const pairKeysSorted = [...byPair.keys()].sort();

    for (let tieIdx = 0; tieIdx < pairKeysSorted.length; tieIdx++) {
      const pk = pairKeysSorted[tieIdx]!;
      const legs = byPair.get(pk)!;
      const leg1 = legs.find((l) => l.match.cupRound.matchNumber === '1');
      const canonical = leg1 ?? legs[0]!;
      const cm = canonical.match;
      const teamA: Team = { id: cm.home.id, name: cm.home.name };
      const teamB: Team = { id: cm.away.id, name: cm.away.name };
      const status: MatchStatus = cm.hasResult ? 'FINISHED' : 'SCHEDULED';
      const singleMatch: Match = {
        id: cm.id,
        teamA,
        teamB,
        status,
        scheduledAt: cm.startTime,
        venueName: championsVenueName(cm.venue),
      };

      const bracketId = `champions-r${roundNum}-${cm.id}`;
      brackets.push({
        id: bracketId,
        title: `${roundName} · ${tieIdx + 1}`,
        round: roundNum,
        roundLabel: roundName,
        position: {
          x: baseX + roundIdx * columnWidth,
          y: baseY + tieIdx * rowGap,
        },
        displayId: `BKT-UCL-Q${roundNum}-R${tieIdx + 1}`,
        matches: [singleMatch],
      });
    }
  }

  const q1Brackets = brackets.filter((b) => b.round === 1);
  const q1Matches = q1Brackets.flatMap((b) => b.matches);
  const allQ1Participants = collectParticipants(q1Matches);
  if (q1Brackets[0] && allQ1Participants.length > 0) {
    const firstIdx = brackets.findIndex((b) => b.id === q1Brackets[0]!.id);
    if (firstIdx >= 0) {
      brackets[firstIdx] = {
        ...brackets[firstIdx]!,
        participants: allQ1Participants,
      };
    }
  }

  const progressions = inferChampionsProgressions(brackets);
  const seededBrackets = brackets.map(seedBracketMatchesMeta);

  const first = rows[0]?.match;
  const displayName =
    first?.simpleTournament?.name?.trim() || first?.tournament?.name || 'UEFA Champions League';

  return {
    id: CHAMPIONS_QUAL_TOURNAMENT_ID,
    sport: first?.sport?.name ?? 'Soccer',
    name: displayName,
    season: maxSeasonFromRows(rows),
    brackets: seededBrackets,
    progressions,
  };
}

export const championsMockTournament: Tournament = buildChampionsTournament(
  championsJson as ChampionsExportRow[]
);
