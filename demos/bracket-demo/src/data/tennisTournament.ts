import type { Bracket, Match, MatchStatus, Team, Tournament, TournamentEntrant } from '../types';
import { seedAllBracketMatchMeta } from '../lib/matchDisplay';
import { cupRoundAbbrev } from '../lib/roundNaming';
import { inferChampionsProgressions } from './championsTournament';
import { layoutSingleElimination } from '../lib/bracketTreeLayout';
import { makeOverlayKey } from '../lib/singleEliminationBuilder';
import type { MatchOverlayKey } from '../lib/singleEliminationBuilder';
import tennisRaw from './tennis-brackets.json';

export const TENNIS_TOURNAMENT_ID = 'tennis-singles-demo';

/** SportRadar-style urn: take numeric segment after last `:`. */
export function srIdNumeric(srId: string): string {
  const i = srId.lastIndexOf(':');
  return i >= 0 ? srId.slice(i + 1) : srId;
}

interface TennisMatchPayload {
  id: string;
  startTime?: string;
  week?: number;
  home: { id: string; name: string };
  away: { id: string; name: string };
  tennisRoundId: number;
  tennisMatchNumber: number;
  hasResult: boolean;
  resultWinner?: string;
  walkover?: { id: string; name: string };
  resultComment?: string;
  simpleTournament?: { name: string };
  sport?: { name: string };
  venue?: { name?: string; court?: string };
  score?: string;
}

/**
 * 2006 French Open top-16 seeds by Sportradar numeric competitor ID.
 * Used to annotate Team objects with a seed number at parse time.
 */
const SEED_MAP: Record<string, number> = {
  '14342': 1,  // FEDERER, ROGER
  '14486': 2,  // NADAL, RAFAEL
  '14361': 3,  // LJUBICIC, IVAN
  '14336': 4,  // NALBANDIAN, DAVID
  '14356': 5,  // DAVYDENKO, NIKOLAY
  '14335': 6,  // ROBREDO, TOMMY
  '14406': 7,  // ANCIC, MARIO
  '14341': 8,  // HEWITT, LLEYTON
  '14344': 9,  // HENMAN, TIM
  '14772': 10, // BAGHDATIS, MARCOS
  '14319': 11, // GONZALEZ, FERNANDO
  '14414': 12, // GASQUET, RICHARD
  '14510': 13, // BERDYCH, TOMAS
  '14372': 14, // SANTORO, FABRICE
  '14343': 15, // RODDICK, ANDY
  '14338': 16, // BLAKE, JAMES
};

export interface TennisEnvelope {
  match: TennisMatchPayload;
}

function seasonFromStartTime(startTime: string | undefined): string | undefined {
  if (!startTime) return undefined;
  const y = Number.parseInt(startTime.slice(0, 4), 10);
  if (Number.isNaN(y)) return undefined;
  const next = y + 1;
  return `${y}/${String(next).slice(-2)}`;
}

function maxSeasonFromEnvelopes(rows: TennisEnvelope[]): string | undefined {
  let latest: string | undefined;
  for (const row of rows) {
    const t = row.match.startTime;
    if (!t) continue;
    if (!latest || t > latest) latest = t;
  }
  return seasonFromStartTime(latest);
}

/** Map feed `tennisRoundId` to single-elimination stage index (1 = opening round incl. replacements). */
function stageRank(tennisRoundId: number): number {
  if (tennisRoundId === 23 || tennisRoundId === 27) return 1;
  if (tennisRoundId === 24) return 2;
  if (tennisRoundId === 25) return 3;
  return 10 + tennisRoundId;
}

function teamFromCompetitor(c: { id: string; name: string }): Team {
  const numericId = srIdNumeric(c.id);
  const seed = SEED_MAP[numericId];
  return { id: numericId, name: c.name, ...(seed != null ? { seed } : {}) };
}

function buildMatchFromEnvelope(e: TennisEnvelope): Match {
  const m = e.match;
  const teamA = teamFromCompetitor(m.home);
  const teamB = teamFromCompetitor(m.away);
  const status: MatchStatus = m.hasResult ? 'FINISHED' : 'SCHEDULED';
  return {
    id: srIdNumeric(m.id),
    teamA,
    teamB,
    status,
    scheduledAt: m.startTime,
    week: m.week,
    venueName: m.venue?.name,
    courtName: m.venue?.court,
    score: m.score,
  };
}

function inferWinnerFallback(m: TennisMatchPayload): Team | undefined {
  const home = teamFromCompetitor(m.home);
  const away = teamFromCompetitor(m.away);
  const rw = m.resultWinner;
  if (rw === 'RESULT_WINNER_HOME') return home;
  if (rw === 'RESULT_WINNER_AWAY') return away;

  if (m.walkover?.id) {
    const wid = srIdNumeric(m.walkover.id);
    if (wid === home.id) return home;
    if (wid === away.id) return away;
  }

  return undefined;
}

function buildEntrantsFromEnvelopes(
  rows: TennisEnvelope[],
  round1Stage: number,
): TournamentEntrant[] {
  // Collect each competitor's earliest match start time + week from round-1 envelopes
  const byId = new Map<string, TournamentEntrant>();
  for (const e of rows) {
    if (stageRank(e.match.tennisRoundId) !== round1Stage) continue;
    const m = e.match;
    for (const comp of [m.home, m.away]) {
      const id = srIdNumeric(comp.id);
      const existing = byId.get(id);
      const candidate = m.startTime;
      if (!existing) {
        byId.set(id, { id, name: comp.name, firstMatchAt: candidate, week: m.week });
      } else if (candidate && existing.firstMatchAt && candidate < existing.firstMatchAt) {
        byId.set(id, { ...existing, firstMatchAt: candidate, week: m.week });
      }
    }
  }
  // Keep insertion order (rows are sorted by match number, so this preserves seed order).
  return [...byId.values()];
}

function allCompetitorIdsInRound(brackets: Bracket[], round: number): Set<string> {
  const s = new Set<string>();
  for (const b of brackets) {
    if (b.round !== round) continue;
    const m = b.matches[0];
    if (!m) continue;
    if (m.teamA) s.add(m.teamA.id);
    if (m.teamB) s.add(m.teamB.id);
  }
  return s;
}

function applyWinnerInference(
  brackets: Bracket[],
  envelopesByMatchId: Map<string, TennisEnvelope>,
) {
  const maxRound = Math.max(1, ...brackets.map((b) => b.round));

  for (let r = 1; r < maxRound; r++) {
    const nextIds = allCompetitorIdsInRound(brackets, r + 1);
    for (const b of brackets) {
      if (b.round !== r) continue;
      const m = b.matches[0];
      if (!m?.teamA || !m.teamB) continue;

      const env = envelopesByMatchId.get(m.id);
      const hN = nextIds.has(m.teamA.id);
      const aN = nextIds.has(m.teamB.id);

      let winner: Team | undefined;
      if (hN && !aN) winner = m.teamA;
      else if (aN && !hN) winner = m.teamB;
      else if (!hN && !aN && env) winner = inferWinnerFallback(env.match);

      if (winner) {
        m.winner = winner;
        m.status = 'FINISHED';
      }
    }
  }

  for (const b of brackets) {
    if (b.round !== maxRound) continue;
    const m = b.matches[0];
    if (!m?.teamA || !m.teamB || m.winner) continue;
    const env = envelopesByMatchId.get(m.id);
    if (!env) continue;
    const w = inferWinnerFallback(env.match);
    if (w) {
      m.winner = w;
      m.status = 'FINISHED';
    }
  }
}

const TENNIS_LAYOUT = {
  baseX: 60,
  baseY: 60,
  columnSpacing: 500,
  leafSpacing: 480,
} as const;

/** Maps match count in a round to the standard Grand Slam round abbreviation. */
function grandSlamRoundLabel(matchCount: number): string {
  return cupRoundAbbrev(matchCount);
}

export function buildTennisTournament(rows: TennisEnvelope[]): Tournament {
  const sorted = [...rows].sort((a, b) => {
    const ra = stageRank(a.match.tennisRoundId);
    const rb = stageRank(b.match.tennisRoundId);
    if (ra !== rb) return ra - rb;
    const d = a.match.tennisMatchNumber - b.match.tennisMatchNumber;
    if (d !== 0) return d;
    return srIdNumeric(a.match.id).localeCompare(srIdNumeric(b.match.id));
  });

  // Cap the first stage at 64 matches (128-player draw max)
  const firstStage = stageRank(sorted[0]?.match.tennisRoundId ?? 0);
  const stage1Ids = new Set(
    sorted
      .filter((e) => stageRank(e.match.tennisRoundId) === firstStage)
      .slice(0, 64)
      .map((e) => e.match.id),
  );
  const capped = sorted.filter(
    (e) => stageRank(e.match.tennisRoundId) !== firstStage || stage1Ids.has(e.match.id),
  );

  const byStage = new Map<number, TennisEnvelope[]>();
  for (const e of capped) {
    const r = stageRank(e.match.tennisRoundId);
    const list = byStage.get(r) ?? [];
    list.push(e);
    byStage.set(r, list);
  }

  const stageNums = [...byStage.keys()].sort((a, b) => a - b);
  const brackets: Bracket[] = [];

  for (let si = 0; si < stageNums.length; si++) {
    const stage = stageNums[si]!;
    const list = byStage.get(stage)!;
    list.sort((a, b) => {
      const d = a.match.tennisMatchNumber - b.match.tennisMatchNumber;
      if (d !== 0) return d;
      return srIdNumeric(a.match.id).localeCompare(srIdNumeric(b.match.id));
    });

    const rl = grandSlamRoundLabel(list.length);

    for (let i = 0; i < list.length; i++) {
      const e = list[i]!;
      const built = buildMatchFromEnvelope(e);
      const mid = srIdNumeric(e.match.id);
      const bracketId = `tennis-r${stage}-m${mid}`;
      // Temporary position; replaced by tree layout below
      brackets.push({
        id: bracketId,
        title: `${rl} · ${i + 1}`,
        roundLabel: rl,
        round: stage,
        position: { x: 0, y: 0 },
        displayId: `BKT-TEN-R${stage}-${i + 1}`,
        matches: [built],
      });
    }
  }

  const envelopesByMatchId = new Map<string, TennisEnvelope>();
  for (const e of capped) {
    envelopesByMatchId.set(srIdNumeric(e.match.id), e);
  }

  applyWinnerInference(brackets, envelopesByMatchId);

  const progressions = inferChampionsProgressions(brackets);

  const laidOut = layoutSingleElimination(brackets, progressions, {
    baseX: TENNIS_LAYOUT.baseX,
    baseY: TENNIS_LAYOUT.baseY,
    leafSpacing: TENNIS_LAYOUT.leafSpacing,
    columnSpacing: TENNIS_LAYOUT.columnSpacing,
  });

  const entrants = buildEntrantsFromEnvelopes(capped, 1);
  const seeded = seedAllBracketMatchMeta(laidOut);

  const first = rows[0]?.match;
  return {
    id: TENNIS_TOURNAMENT_ID,
    sport: first?.sport?.name ?? 'Tennis',
    name: first?.simpleTournament?.name?.trim() ?? 'Tennis tournament',
    season: maxSeasonFromEnvelopes(rows),
    brackets: seeded,
    progressions,
    entrants,
  };
}

export const tennisMockTournament: Tournament = buildTennisTournament(
  (tennisRaw as { matches: TennisEnvelope[] }).matches,
);

// ─── Finished-scenario helpers ─────────────────────────────────────────────

const SCORE_PATTERNS_3 = [
  '6-4, 6-2',
  '6-3, 6-4',
  '7-5, 6-3',
  '6-2, 6-3',
  '6-4, 6-3',
  '7-6(3), 6-4',
  '6-1, 6-3',
  '6-4, 7-5',
  '6-3, 7-5',
  '7-6(4), 6-2',
  '6-2, 7-5',
  '6-3, 6-2',
];

const SCORE_PATTERNS_4 = [
  '6-4, 3-6, 6-2, 6-1',
  '7-6(4), 6-4, 3-6, 6-3',
  '6-3, 6-7(4), 6-4, 6-2',
  '6-4, 6-3, 4-6, 6-2',
  '7-5, 4-6, 6-3, 6-4',
  '6-4, 7-5, 3-6, 6-3',
  '6-2, 3-6, 6-4, 6-3',
  '7-6(5), 6-3, 4-6, 6-4',
];

const SCORE_PATTERNS_5 = [
  '6-4, 6-7(4), 6-3, 3-6, 6-4',
  '7-6(3), 4-6, 7-6(5), 4-6, 6-3',
  '6-4, 3-6, 6-2, 3-6, 6-3',
  '6-3, 4-6, 6-4, 4-6, 7-5',
  '7-6(4), 6-4, 3-6, 4-6, 6-2',
  '6-4, 4-6, 6-2, 6-7(5), 6-3',
];

function seededInt(n: number): number {
  let x = n;
  x = ((x >> 16) ^ x) * 0x45d9f3b;
  x = ((x >> 16) ^ x) * 0x45d9f3b;
  x = (x >> 16) ^ x;
  return Math.abs(x);
}

function mockTennisScore(matchId: string): string {
  const seed = parseInt(matchId.replace(/\D/g, '').slice(-8) || '0', 10);
  const h = seededInt(seed);
  // ~40% 3-set, ~35% 4-set, ~25% 5-set
  const r = h % 20;
  if (r < 8) return SCORE_PATTERNS_3[h % SCORE_PATTERNS_3.length]!;
  if (r < 15) return SCORE_PATTERNS_4[seededInt(h + 1) % SCORE_PATTERNS_4.length]!;
  return SCORE_PATTERNS_5[seededInt(h + 2) % SCORE_PATTERNS_5.length]!;
}

export function finishAllMatches(tournament: Tournament): Tournament {
  const t: Tournament = structuredClone(tournament);

  const bracketMap = new Map(t.brackets.map((b) => [b.id, b]));
  const sortedBrackets = [...t.brackets].sort((a, b) => a.round - b.round);
  const resolvedWinners = new Map<string, Team>();

  for (const bracket of sortedBrackets) {
    for (const match of bracket.matches) {
      if (match.isBye) {
        if (match.teamA) resolvedWinners.set(match.id, match.teamA);
        continue;
      }

      const teamA = match.teamA;
      const teamB = match.teamB;
      if (!teamA) continue;

      let winner: Team;
      if (match.winner) {
        winner = match.winner;
      } else if (teamB) {
        const seed = parseInt(match.id.replace(/\D/g, '').slice(-8) || '0', 10);
        winner = seededInt(seed) % 2 === 0 ? teamA : teamB;
      } else {
        winner = teamA;
      }

      match.winner = winner;
      match.status = 'FINISHED';
      if (teamB && !match.score) match.score = mockTennisScore(match.id);
      resolvedWinners.set(match.id, winner);
    }

    for (const prog of t.progressions) {
      for (const rule of prog.rules) {
        if (rule.fromBracketId !== bracket.id || rule.condition !== 'WINNER') continue;
        const winner = resolvedWinners.get(rule.fromMatchId);
        if (!winner) continue;
        const targetBracket = bracketMap.get(rule.toBracketId);
        const targetMatch = targetBracket?.matches.find((m) => m.id === rule.toMatchId);
        if (!targetMatch) continue;
        if (rule.toSlot === 'teamA') {
          targetMatch.teamA = winner;
          targetMatch.teamAPlaceholder = undefined;
        } else {
          targetMatch.teamB = winner;
          targetMatch.teamBPlaceholder = undefined;
        }
      }
    }
  }

  return t;
}

export const finishedTennisMockTournament: Tournament = finishAllMatches(tennisMockTournament);

/**
 * Build a Map from skeleton overlay key → `{ scheduledAt, week }` derived from feed envelopes.
 * Keys align with the single-elimination builder: `r${roundNum}m${matchIndex}` where roundNum is
 * the 1-based stage index (stage sorted ascending) and matchIndex is the position within that
 * stage when sorted by tennisMatchNumber (same order used by buildEntrantsFromEnvelopes).
 */
export function buildTennisOverlayMap(rows: TennisEnvelope[]): Map<MatchOverlayKey, Partial<Match>> {
  const sorted = [...rows].sort((a, b) => {
    const ra = stageRank(a.match.tennisRoundId);
    const rb = stageRank(b.match.tennisRoundId);
    if (ra !== rb) return ra - rb;
    const d = a.match.tennisMatchNumber - b.match.tennisMatchNumber;
    if (d !== 0) return d;
    return srIdNumeric(a.match.id).localeCompare(srIdNumeric(b.match.id));
  });

  const firstStage = stageRank(sorted[0]?.match.tennisRoundId ?? 0);
  const stage1Ids = new Set(
    sorted
      .filter((e) => stageRank(e.match.tennisRoundId) === firstStage)
      .slice(0, 64)
      .map((e) => e.match.id),
  );
  const capped = sorted.filter(
    (e) => stageRank(e.match.tennisRoundId) !== firstStage || stage1Ids.has(e.match.id),
  );

  const byStage = new Map<number, TennisEnvelope[]>();
  for (const e of capped) {
    const r = stageRank(e.match.tennisRoundId);
    const list = byStage.get(r) ?? [];
    list.push(e);
    byStage.set(r, list);
  }

  const stageNums = [...byStage.keys()].sort((a, b) => a - b);
  const map = new Map<MatchOverlayKey, Partial<Match>>();

  for (let si = 0; si < stageNums.length; si++) {
    const stage = stageNums[si]!;
    const roundNum = si + 1;
    const list = byStage.get(stage)!;
    list.sort((a, b) => {
      const d = a.match.tennisMatchNumber - b.match.tennisMatchNumber;
      if (d !== 0) return d;
      return srIdNumeric(a.match.id).localeCompare(srIdNumeric(b.match.id));
    });
    for (let i = 0; i < list.length; i++) {
      const e = list[i]!;
      const overlay: Partial<Match> = {};
      if (e.match.startTime) overlay.scheduledAt = e.match.startTime;
      if (e.match.week != null) overlay.week = e.match.week;
      map.set(makeOverlayKey(roundNum, i), overlay);
    }
  }

  return map;
}

export const tennisMockOverlayMap: Map<MatchOverlayKey, Partial<Match>> = buildTennisOverlayMap(
  (tennisRaw as { matches: TennisEnvelope[] }).matches,
);
