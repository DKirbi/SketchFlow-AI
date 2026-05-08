# UX flows — Bracket Builder

This document describes the main user journeys after the tennis-focused and layout updates.

## High-level navigation

The app is a **two-step** flow controlled by client state (not a URL router):

1. **Step 1 — Structure setup** — `StructureSetupView` (default on load).
2. **Step 2 — Bracket view** — `TournamentCanvas` (interactive canvas).

- From step 1, **Generate Bracket** advances to step 2.
- From step 2, **1. Structure setup** in the toolbar returns to step 1 (tournament data in the store is unchanged unless step 1’s generate handler updates metadata).

---

## Step 1: Structure setup

### Purpose

Configure tournament metadata, a **roundset** table (cup rounds and progression labels), and review **participants** before opening the canvas.

### General & configuration

- **Sport**, **Tournament name**, **Season** — free text; applied when **Generate Bracket** runs (see `useTournamentStore.applyGenerateFromStructure`).
- **Bracket type**, **Roundset type**, **Order** — captured into `TournamentStructure` for persistence across visits to step 1 in the same session.

### Roundset table

- Each row is a cup round with **matchup type** and **progression type**.
- Rows can be added or removed; **Generate Bracket** saves the structure snapshot.

### Participants section (below rounds)

- Shows a **read-only table** of entrants: **#**, **Name**, **ID**, **First match**, **Week**.
- **Source:** `tournament.entrants` when present (e.g. tennis build from `tennis-brackets.json`); otherwise a **fallback** unions `bracket.participants` or round-1 match teams (see `deriveEntrants` in `StructureSetupView.tsx`).
- **Manual add** and **Bulk add** are visible but **disabled** (reduced opacity, no pointer events) — placeholders for future flows.

### Generate Bracket

- Applies the structure form to the store and navigates to step 2. Does not replace the full tennis bracket graph unless that logic is extended; today it mainly updates sport/name/season and re-seeds match display metadata on existing brackets.

---

## Step 2: Bracket view

### Purpose

Visualize single-elimination (or similar) **brackets as nodes**, **matches as cards inside nodes**, and **progressions as edges**. Default tournament data is the **tennis** sample (`tennisMockTournament`).

### Canvas & layout

- Implemented with **React Flow** (`TournamentCanvas.tsx`).
- **Initial positions** for tennis come from **`layoutSingleElimination`** (`bracketTreeLayout.ts`): round-1 nodes are spaced vertically; later rounds are **vertically centered** between feeders inferred from progression rules.
- **Pan and zoom** — use the canvas controls / wheel; `minZoom` is low enough for tall draws.
- **Dragging** — each bracket card has a **drag belt**: a slim handle strip at the very top of the card (marked ⠿ DRAG). Only grabbing this belt initiates a drag; clicking anywhere else in the card (match cards, status badges, IDs, the EDIT button) works normally without risk of accidentally moving the bracket. Positions persist via `updateBracketPosition` on drag end.
- **Solo movement** — dragging a bracket via the belt moves **only that bracket**, even when several brackets are highlighted by the progression focus set. Chain siblings stay in place.

### Toolbar

- Tournament **sport**, **name**, **season**.
- **+ Add Progression** opens the progression modal (portaled to `document.body` for correct stacking).
- Link back to **1. Structure setup**.

### Match cards (inside a bracket node)

- **HOME / AWAY** rows, status badge (click cycles **scheduled → live → finished** unless BYE), optional **schedule** line (`scheduledAt`, `week`) when present. Status badge clicks (UPCOMING / LIVE / COMPLETED) are reliable because dragging is now restricted to the belt — no false drag conflicts.
- **Footer** shows display id and winner / TBD.
- **EDIT** on the bracket header opens **Bracket edit modal** (also portaled to `document.body`).

### Progression edges

- Each edge represents one **`Progression`** with at least one rule (canvas uses `rules[0]` for source/target).
- **Click** bracket(s) to **focus** related edges (dim others).
- **Edge label / menu** — click the edge label to open actions (edit / delete). Clicking **Edit** opens a full-screen centered modal overlay (same `modal-overlay` → `modal` pattern as the bracket edit modal) portaled to `document.body`, replacing the previous inline floating panel.

### Help strip

- Short hints: bracket focus, match status, progression editing, **Edit** for bracket + matches + progressions (no longer emphasizes dragging as the primary action).

---

## Modals (stacking & behavior)

**Progression**, **Bracket edit**, and **Edit Progression (edge)** modals all render with **`createPortal(..., document.body)`** so they sit above React Flow’s transformed viewport and all edge UI. All three share the same `modal-overlay` → `modal` shell for visual consistency.

### Add Progression (`ProgressionModal`)

- Choose **source** bracket and match, **condition** (winner/loser), **destination** (new or existing bracket), and **slot** (teamA / teamB).
- Submitting calls **`addProgression`**; modal closes.

### Edit bracket (`BracketEditModal`)

- **Participants** — list add/remove (often empty for tennis; entrants live in structure step).
- **Matches** — teams, BYE, add/remove matches.
- **Progressions** — lists **outgoing** (from this bracket) and **incoming** (into this bracket); **Remove** with confirm; **+ Add progression** opens an inline form with **from bracket fixed** to the current bracket; **`addProgression`** runs immediately.
- **Save Changes** persists bracket participant/match edits only; progression add/remove in this modal already hit the store live.

### Edit Progression (`EdgeContextMenu` via `ProgressionEdge`)

- Opened by clicking the edge label → **Edit** in the action bar.
- Renders as a **full-screen centered modal** (same `modal-overlay` → `modal` pattern) portaled to `document.body` — replacing the previous inline floating panel that sat in canvas coordinate space.
- Lists **progression rules** with full from/to bracket, match, trigger, condition, and slot fields.
- Supports a **wizard breadcrumb** when adding a new rule.
- **Save** calls `editProgression`; backdrop click or ✕ closes without saving.

---

## Data note (tennis)

- Match feed: `src/data/tennis-brackets.json` (`{ "matches": [ ... ] }`).
- Build pipeline: `src/data/tennisTournament.ts` — numeric IDs from SportRadar URNs, rounds from `tennisRoundId`, winners inferred from next-round presence + walkover, **`entrants`** for step 1 table, **tree layout** after progressions.

---

## Scenario toggle (canvas toolbar)

The **Placeholders / Finished** toggle in the canvas toolbar switches the active dataset without leaving step 2.

| Scenario | Store action | Dataset loaded |
|----------|-------------|----------------|
| Placeholders | `setScenario('placeholders')` | `tennisMockTournament` — upcoming matches with TBD participants |
| Finished | `setScenario('finished')` | `finishedTennisMockTournament` — every match resolved with winners |

**Important:** switching scenario resets the full `tournament` state to the corresponding mock dataset and clears `tournamentStructure`. Any edits made during the session (dragged positions, added progressions, status changes) are discarded when the scenario changes. The toggle does **not** re-run `applyGenerateFromStructure`; it swaps the entire dataset directly.

---

## Generate Finished Brackets (step 1)

In addition to **Generate Upcoming Brackets →**, step 1 exposes a second action: **Generate Finished Brackets →**.

Both buttons share the same bracket-build path:

1. If bracket type is single-elimination and at least two entrants exist, call `buildSingleEliminationFromEntrants` + `applyRoundsetRowsToBrackets` to produce the bracket graph.
2. Otherwise preserve the existing brackets and re-seed `displayId` / `shortLabel`.

The key difference for **Finished**:

- After building the base tournament, `finishAllMatches` is applied — it marks every match `FINISHED` and assigns a winner (alternating between teamA and teamB round-by-round for deterministic results in the mock).
- The store's `scenario` field is forced to `'finished'`.
- The canvas opens in Finished mode immediately.

**Generate Upcoming** leaves `scenario` as `'placeholders'` and does not call `finishAllMatches`.

---

## Score display on match cards

`Match.score` is an optional string (e.g. `"6-4, 3-6, 7-6(4)"` for tennis) that surfaces as a visual score indicator on the match card when:

- The match status is `FINISHED`, and
- The winning team's row is rendered, and
- `match.score` is a non-empty string.

The score itself is **not rendered as visible text** on the card — a `match-card-b__score-icon` element is shown next to the winner's name with `aria-label="Score: {score}"` for screen readers. The full score string is available via the tooltip / accessible label.

**Source:** Populated automatically from the tennis data pipeline (`tennisTournament.ts`). The score field is **read-only** in the current UI — there is no input to edit it from a match card or the bracket edit modal.

---

## Overlay close pattern (mouseDown vs click)

Two slightly different patterns exist for closing modals by clicking the backdrop:

| Modal | Event | Reason |
|-------|-------|--------|
| `BracketEditModal` | `onMouseDown` on overlay | Prevents accidental close when the user selects/drags text inside the modal and the pointer-up lands on the backdrop. |
| `ProgressionEdge` edit modal | `onMouseDown` on overlay | Same reason — consistent with BracketEditModal. |
| `ProgressionModal` | `onClick` on overlay | Older pattern; functionally fine for this shorter modal but inconsistent. |

**Intended standard:** use `onMouseDown` with a `e.target === e.currentTarget` guard on the overlay div. This is the pattern used in `BracketEditModal` and the edge edit modal:

```tsx
onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
```

`ProgressionModal` should be updated to match this pattern in a future cleanup.

---

## Related docs

- [Champions / soccer export pipeline](champions-export.md) — separate mock path; structure participants fallback still supports mixed `participants` on brackets.
