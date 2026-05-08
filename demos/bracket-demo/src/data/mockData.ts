import type { Tournament } from '../types';

/** Previous demo tournament (groups + QF/SF/Final); kept for reference or manual swap-in. */
export const legacyMockTournament: Tournament = {
  id: 'tournament-1',
  sport: 'Soccer',
  name: 'Champions Cup 2026',
  season: '2025/26',
  brackets: [
    // ── GROUP A — ROUND 1 ─────────────────────────────────────────
    {
      id: 'bracket-a',
      title: 'Group A — Round 1',
      displayId: 'BKT-GRP-A',
      round: 1,
      position: { x: 60, y: 50 },
      participants: [
        { id: 'team-barca', name: 'Barcelona' },
        { id: 'team-real', name: 'Real Madrid' },
        { id: 'team-atletico', name: 'Atlético Madrid' },
        { id: 'team-sevilla', name: 'Sevilla' },
        { id: 'team-valencia', name: 'Valencia' },
        { id: 'team-villarreal', name: 'Villarreal' },
        { id: 'team-betis', name: 'Real Betis' },
        { id: 'team-osasuna', name: 'Osasuna' },
      ],
      matches: [
        {
          id: 'match-a1',
          displayId: 'ID801001',
          shortLabel: 'GA1',
          teamA: { id: 'team-barca', name: 'Barcelona' },
          teamB: null,
          status: 'FINISHED',
          winner: { id: 'team-barca', name: 'Barcelona' },
          isBye: true,
        },
        {
          id: 'match-a2',
          displayId: 'ID801002',
          shortLabel: 'GA2',
          teamA: { id: 'team-real', name: 'Real Madrid' },
          teamB: null,
          status: 'FINISHED',
          winner: { id: 'team-real', name: 'Real Madrid' },
          isBye: true,
        },
        {
          id: 'match-a3',
          displayId: 'ID801003',
          shortLabel: 'GA3',
          teamA: { id: 'team-atletico', name: 'Atlético Madrid' },
          teamB: { id: 'team-sevilla', name: 'Sevilla' },
          status: 'LIVE',
        },
        {
          id: 'match-a4',
          displayId: 'ID801004',
          shortLabel: 'GA4',
          teamA: { id: 'team-valencia', name: 'Valencia' },
          teamB: { id: 'team-villarreal', name: 'Villarreal' },
          status: 'SCHEDULED',
        },
      ],
    },

    // ── GROUP B — ROUND 1 ─────────────────────────────────────────
    {
      id: 'bracket-b',
      title: 'Group B — Round 1',
      displayId: 'BKT-GRP-B',
      round: 1,
      position: { x: 60, y: 700 },
      participants: [
        { id: 'team-bayern', name: 'Bayern Munich' },
        { id: 'team-city', name: 'Man City' },
        { id: 'team-psg', name: 'PSG' },
        { id: 'team-chelsea', name: 'Chelsea' },
        { id: 'team-bvb', name: 'Borussia Dortmund' },
        { id: 'team-ajax', name: 'Ajax' },
        { id: 'team-porto', name: 'Porto' },
        { id: 'team-napoli', name: 'Napoli' },
      ],
      matches: [
        {
          id: 'match-b1',
          displayId: 'ID802001',
          shortLabel: 'GB1',
          teamA: { id: 'team-bayern', name: 'Bayern Munich' },
          teamB: null,
          status: 'FINISHED',
          winner: { id: 'team-bayern', name: 'Bayern Munich' },
          isBye: true,
        },
        {
          id: 'match-b2',
          displayId: 'ID802002',
          shortLabel: 'GB2',
          teamA: { id: 'team-city', name: 'Man City' },
          teamB: null,
          status: 'FINISHED',
          winner: { id: 'team-city', name: 'Man City' },
          isBye: true,
        },
        {
          id: 'match-b3',
          displayId: 'ID802003',
          shortLabel: 'GB3',
          teamA: { id: 'team-psg', name: 'PSG' },
          teamB: { id: 'team-chelsea', name: 'Chelsea' },
          status: 'LIVE',
        },
        {
          id: 'match-b4',
          displayId: 'ID802004',
          shortLabel: 'GB4',
          teamA: { id: 'team-bvb', name: 'Borussia Dortmund' },
          teamB: { id: 'team-ajax', name: 'Ajax' },
          status: 'SCHEDULED',
        },
      ],
    },

    // ── QUARTER-FINALS A (Group A side) ───────────────────────────
    {
      id: 'bracket-qf-a',
      title: 'Quarter-Finals A',
      displayId: 'BKT-QF-A',
      round: 2,
      position: { x: 510, y: 200 },
      matches: [
        {
          id: 'match-qf-a1',
          displayId: 'ID474339',
          shortLabel: 'QF-A1',
          teamA: null,
          teamB: null,
          teamAPlaceholder: 'TBD',
          teamBPlaceholder: 'TBD',
          status: 'SCHEDULED',
        },
        {
          id: 'match-qf-a2',
          displayId: 'ID474340',
          shortLabel: 'QF-A2',
          teamA: null,
          teamB: null,
          teamAPlaceholder: 'TBD',
          teamBPlaceholder: 'TBD',
          status: 'SCHEDULED',
        },
      ],
    },

    // ── QUARTER-FINALS B (Group B side) ───────────────────────────
    {
      id: 'bracket-qf-b',
      title: 'Quarter-Finals B',
      displayId: 'BKT-QF-B',
      round: 2,
      position: { x: 510, y: 860 },
      matches: [
        {
          id: 'match-qf-b1',
          displayId: 'ID474341',
          shortLabel: 'QF-B1',
          teamA: null,
          teamB: null,
          teamAPlaceholder: 'TBD',
          teamBPlaceholder: 'TBD',
          status: 'SCHEDULED',
        },
        {
          id: 'match-qf-b2',
          displayId: 'ID474342',
          shortLabel: 'QF-B2',
          teamA: null,
          teamB: null,
          teamAPlaceholder: 'TBD',
          teamBPlaceholder: 'TBD',
          status: 'SCHEDULED',
        },
      ],
    },

    // ── SEMI-FINALS ───────────────────────────────────────────────
    {
      id: 'bracket-sf',
      title: 'Semi-Finals',
      displayId: 'BKT-SF',
      round: 3,
      position: { x: 960, y: 540 },
      matches: [
        {
          id: 'match-sf1',
          displayId: 'ID910001',
          shortLabel: 'SF1',
          teamA: null,
          teamB: null,
          teamAPlaceholder: 'TBD',
          teamBPlaceholder: 'TBD',
          status: 'SCHEDULED',
        },
        {
          id: 'match-sf2',
          displayId: 'ID910002',
          shortLabel: 'SF2',
          teamA: null,
          teamB: null,
          teamAPlaceholder: 'TBD',
          teamBPlaceholder: 'TBD',
          status: 'SCHEDULED',
        },
      ],
    },

    // ── FINAL ─────────────────────────────────────────────────────
    {
      id: 'bracket-final',
      title: 'Final',
      displayId: 'BKT-FINAL',
      round: 4,
      position: { x: 1410, y: 480 },
      matches: [
        {
          id: 'match-final',
          displayId: 'ID990001',
          shortLabel: 'FINAL',
          teamA: null,
          teamB: null,
          teamAPlaceholder: 'TBD',
          teamBPlaceholder: 'TBD',
          status: 'SCHEDULED',
        },
      ],
    },

    // ── 3RD PLACE PLAY-OFF ────────────────────────────────────────
    // Required as destination for the LOSER progression from Semi-Finals
    {
      id: 'bracket-3rd',
      title: '3rd Place Play-off',
      displayId: 'BKT-3RD',
      round: 4,
      position: { x: 1410, y: 780 },
      matches: [
        {
          id: 'match-3rd',
          displayId: 'ID985001',
          shortLabel: '3RD',
          teamA: null,
          teamB: null,
          teamAPlaceholder: 'TBD',
          teamBPlaceholder: 'TBD',
          status: 'SCHEDULED',
        },
      ],
    },

    // ── 3RD PLACE PLAY-OFF ────────────────────────────────────────
    // Required as destination for the LOSER progression from Semi-Finals
    {
      id: 'bracket-3rd',
      title: '3rd Place Play-off',
      round: 4,
      position: { x: 1410, y: 780 },
      matches: [
        {
          id: 'match-3rd',
          teamA: null,
          teamB: null,
          teamAPlaceholder: 'TBD',
          teamBPlaceholder: 'TBD',
          status: 'SCHEDULED',
        },
      ],
    },
  ],

  progressions: [
    // ── 1. Group A → Quarter-Finals A ─────────────────────────────
    // Pattern: multi-rule WINNER progression, group stage feeding a KO bracket.
    // BYE winners (match-a1, match-a2) are already FINISHED — the store resolves
    // them immediately so Barcelona and Real Madrid appear in the QF right away.
    {
      id: 'prog-a-to-qf-a',
      rules: [
        {
          // Seed #1 (BYE) → QF-A1 top slot
          fromBracketId: 'bracket-a',
          fromMatchId: 'match-a1',
          toBracketId: 'bracket-qf-a',
          toMatchId: 'match-qf-a1',
          toSlot: 'teamA',
          trigger: 'AFTER_MATCH_END',
          condition: 'WINNER',
        },
        {
          // Winner of Atlético vs Sevilla (LIVE) → QF-A1 bottom slot
          fromBracketId: 'bracket-a',
          fromMatchId: 'match-a3',
          toBracketId: 'bracket-qf-a',
          toMatchId: 'match-qf-a1',
          toSlot: 'teamB',
          trigger: 'AFTER_MATCH_END',
          condition: 'WINNER',
        },
        {
          // Seed #2 (BYE) → QF-A2 top slot
          fromBracketId: 'bracket-a',
          fromMatchId: 'match-a2',
          toBracketId: 'bracket-qf-a',
          toMatchId: 'match-qf-a2',
          toSlot: 'teamA',
          trigger: 'AFTER_MATCH_END',
          condition: 'WINNER',
        },
        {
          // Winner of Valencia vs Villarreal (SCHEDULED) → QF-A2 bottom slot
          fromBracketId: 'bracket-a',
          fromMatchId: 'match-a4',
          toBracketId: 'bracket-qf-a',
          toMatchId: 'match-qf-a2',
          toSlot: 'teamB',
          trigger: 'AFTER_MATCH_END',
          condition: 'WINNER',
        },
      ],
    },

    // ── 2. Group B → Quarter-Finals B ─────────────────────────────
    // Pattern: same structure as above for the second group.
    {
      id: 'prog-b-to-qf-b',
      rules: [
        {
          fromBracketId: 'bracket-b',
          fromMatchId: 'match-b1',       // Bayern Munich (BYE)
          toBracketId: 'bracket-qf-b',
          toMatchId: 'match-qf-b1',
          toSlot: 'teamA',
          trigger: 'AFTER_MATCH_END',
          condition: 'WINNER',
        },
        {
          fromBracketId: 'bracket-b',
          fromMatchId: 'match-b3',       // Winner of PSG vs Chelsea (LIVE)
          toBracketId: 'bracket-qf-b',
          toMatchId: 'match-qf-b1',
          toSlot: 'teamB',
          trigger: 'AFTER_MATCH_END',
          condition: 'WINNER',
        },
        {
          fromBracketId: 'bracket-b',
          fromMatchId: 'match-b2',       // Man City (BYE)
          toBracketId: 'bracket-qf-b',
          toMatchId: 'match-qf-b2',
          toSlot: 'teamA',
          trigger: 'AFTER_MATCH_END',
          condition: 'WINNER',
        },
        {
          fromBracketId: 'bracket-b',
          fromMatchId: 'match-b4',       // Winner of Dortmund vs Ajax (SCHEDULED)
          toBracketId: 'bracket-qf-b',
          toMatchId: 'match-qf-b2',
          toSlot: 'teamB',
          trigger: 'AFTER_MATCH_END',
          condition: 'WINNER',
        },
      ],
    },

    // ── 3. Quarter-Finals A → Semi-Finals ─────────────────────────
    // Pattern: two QF winners converge into a single SF match (both slots).
    {
      id: 'prog-qf-a-to-sf',
      rules: [
        {
          fromBracketId: 'bracket-qf-a',
          fromMatchId: 'match-qf-a1',
          toBracketId: 'bracket-sf',
          toMatchId: 'match-sf1',
          toSlot: 'teamA',
          trigger: 'AFTER_MATCH_END',
          condition: 'WINNER',
        },
        {
          fromBracketId: 'bracket-qf-a',
          fromMatchId: 'match-qf-a2',
          toBracketId: 'bracket-sf',
          toMatchId: 'match-sf1',
          toSlot: 'teamB',
          trigger: 'AFTER_MATCH_END',
          condition: 'WINNER',
        },
      ],
    },

    // ── 4. Quarter-Finals B → Semi-Finals ─────────────────────────
    // Pattern: mirror of the above for the Group B side of the draw.
    {
      id: 'prog-qf-b-to-sf',
      rules: [
        {
          fromBracketId: 'bracket-qf-b',
          fromMatchId: 'match-qf-b1',
          toBracketId: 'bracket-sf',
          toMatchId: 'match-sf2',
          toSlot: 'teamA',
          trigger: 'AFTER_MATCH_END',
          condition: 'WINNER',
        },
        {
          fromBracketId: 'bracket-qf-b',
          fromMatchId: 'match-qf-b2',
          toBracketId: 'bracket-sf',
          toMatchId: 'match-sf2',
          toSlot: 'teamB',
          trigger: 'AFTER_MATCH_END',
          condition: 'WINNER',
        },
      ],
    },

    // ── 5. Semi-Finals → Final ─────────────────────────────────────
    // Pattern: one edge, two rules — each SF winner claims one slot in the Final.
    {
      id: 'prog-sf-to-final',
      rules: [
        {
          fromBracketId: 'bracket-sf',
          fromMatchId: 'match-sf1',
          toBracketId: 'bracket-final',
          toMatchId: 'match-final',
          toSlot: 'teamA',
          trigger: 'AFTER_MATCH_END',
          condition: 'WINNER',
        },
        {
          fromBracketId: 'bracket-sf',
          fromMatchId: 'match-sf2',
          toBracketId: 'bracket-final',
          toMatchId: 'match-final',
          toSlot: 'teamB',
          trigger: 'AFTER_MATCH_END',
          condition: 'WINNER',
        },
      ],
    },

    // ── 6. Semi-Finals → 3rd Place Play-off (LOSER path) ──────────
    // Pattern: LOSER condition — the two eliminated SF teams get a
    // consolation match instead of being simply knocked out. This is the
    // key showcase of the LOSER condition and the "secondary path" concept.
    {
      id: 'prog-sf-to-3rd',
      rules: [
        {
          fromBracketId: 'bracket-sf',
          fromMatchId: 'match-sf1',
          toBracketId: 'bracket-3rd',
          toMatchId: 'match-3rd',
          toSlot: 'teamA',
          trigger: 'AFTER_MATCH_END',
          condition: 'LOSER',            // ← the eliminated team advances here
        },
        {
          fromBracketId: 'bracket-sf',
          fromMatchId: 'match-sf2',
          toBracketId: 'bracket-3rd',
          toMatchId: 'match-3rd',
          toSlot: 'teamB',
          trigger: 'AFTER_MATCH_END',
          condition: 'LOSER',
        },
      ],
    },
  ],
};