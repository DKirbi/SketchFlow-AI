# Champions export → bracket mock data

This document describes how real match exports are turned into the prototype’s `Tournament` model and where to change things when the feed updates.

## Purpose

The UI is driven by a `Tournament` object (see `src/types/index.ts`): brackets on a canvas, matches on cards, and optional progression edges between rounds. For demos we populate that object from a JSON export of cup matches instead of hand-written mock data.

## Source file

**`src/data/champions_matches.json`** — single canonical copy. It is imported by `championsTournament.ts` and bundled into the app; refresh this file when you get a new export.

The export is a **JSON array**. Each element is a wrapper with a `match` object containing teams, tournament metadata, and cup round information.

## Cup rounds in the current export

| Cup round id | Display name | Raw rows (legs) | Merged ties |
|--------------|--------------|-----------------|-------------|
| `sr:cup_round:14` | Qualification round 1 | 28 | 14 (two-legged) |
| `sr:cup_round:15` | Qualification round 2 | 28 | 14 |
| `sr:cup_round:16` | Qualification round 3 | 20 | 10 |

Rounds are ordered by sorting `cupRound.round.id` lexicographically (`:14` → `:15` → `:16`).

**Bracket nodes:** each merged tie becomes **one `Bracket`** with **exactly one `Match`** (the canonical leg). The current file therefore yields **38** bracket nodes (14 + 14 + 10), not three.

## Relevant fields in the export

The transform reads mainly:

- **`match.id`** — Becomes the internal match id (canonical leg).
- **`match.home` / `match.away`** — `{ id, name }` → `Team` on the card.
- **`match.cupRound.round.id`** — Stable cup round id. Used to bucket rows before merging ties.
- **`match.cupRound.round.name`** — Human title for the round (used in each mini-bracket’s title).
- **`match.cupRound.matchNumber`** — `"1"` or `"2"` for first vs second leg of the same tie.
- **`match.hasResult`** — Mapped to `Match.status`: `FINISHED` if true, otherwise `SCHEDULED`.
- **`match.simpleTournament.name`** — Preferred for **`Tournament.name`** when present (e.g. “UEFA Champions League, Qualification”); otherwise **`match.tournament.name`**.
- **`match.sport.name`**, **`match.startTime`** — Sport and season label.

**Season** is derived from the **latest** `startTime` in the export (not only the first row), formatted as `YYYY/YY` (e.g. July 2024 → `2024/25`).

`firstLegMatchId` is not used (often empty in exports); legs are paired by **team pair** instead.

## Build pipeline

Implementation: **`src/data/championsTournament.ts`**.

1. **Group by round** — All rows with the same `cupRound.round.id` are processed together.

2. **Merge two-legged ties** — Within each round, rows that share the same **unordered** pair of competitor ids are the same tie (home/away swap on the second leg). A stable key is:

   `pairKey = sort(home.id, away.id).join('|')`

3. **Canonical leg** — For each tie, prefer the row with `cupRound.matchNumber === "1"` for `teamA`/`teamB` and `match.id`; if missing, fall back to any leg.

4. **One bracket per tie** — For each merged tie, append a **`Bracket`** with `matches: [ singleMatch ]`, `round` = 1 | 2 | 3 (column index), `id` like `champions-r{n}-{matchId}`, title `{roundName} · {tieIndex}`.

5. **Layout** — Exported constants **`CHAMPIONS_LAYOUT`** (`baseX`, `baseY`, `columnWidth`, `rowGap`): ties in the same round share **`x = baseX + roundIndex * columnWidth`** and increase **`y`** by `rowGap` down the column. Background column guides use **`CHAMPIONS_ROUND_GUIDES`** (see `RoundGuides.tsx`).

6. **First round participants** — All unique clubs from **every** Q1 tie are collected; **`participants`** is set only on the **first** Q1 mini-bracket (sorted team list for the full entry pool).

7. **Display metadata** — `displayId`, `shortLabel` per match come from `seedBracketMatchesMeta` in `src/lib/matchDisplay.ts`.

8. **Progressions** — Rules are inferred **by round group**: for each bracket in round *R*+1, each of its teams is matched to the **unique** round-*R* bracket whose single match contains that team. Each rule is stored as **its own `Progression`** with `rules: [ oneRule ]` so React Flow can draw **one edge per link** and delete/editing stays aligned with the store.

Teams that enter a round without appearing in the previous round in this export (e.g. bye) get **no** rule for that slot.

Placeholder behaviour and **`setWinner`** propagation are unchanged: the store applies all progression rules across the tournament.

## Structure setup (step 1)

For the default champions tournament id (`champions-tournament-ucl-qual`), the structure-setup table is preset with three rows—qualification rounds 1–3, **Two-legged tie**, and progression labels **Winner advances** / **terminal**—via **`createChampionsRoundsetRows()`** in `championsTournament.ts`. That snapshot is still **metadata**; the bracket layout itself is built from `champions_matches.json`, not from the table rows.

## Output shape

- **`championsMockTournament`** — Pre-built `Tournament` used as the default in `src/store/useTournamentStore.ts`.
- `legacyMockTournament` in `src/data/mockData.ts` is the older hand-authored demo (groups + knockout) and is not the default.

## Updating the data

1. Replace **`src/data/champions_matches.json`** with a new export (same top-level array shape and `match` / `cupRound` structure).
2. Rebuild or run the dev server — no code change is required if the schema is unchanged.
3. If the schema changes (new fields, renamed paths), update **`ChampionsExportRow`** and **`buildChampionsTournament`** in `championsTournament.ts`.

## Build note

The JSON is imported as a module, so it is **included in the JS bundle**. Large exports increase the main chunk size; for production you might later switch to `fetch` + `public/` or lazy loading if that becomes an issue.
