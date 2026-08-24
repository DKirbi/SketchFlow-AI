# Merge Tool — LoFi Prototype Brief

> **Demo:** `demos/sketchflow-showcase/` (slug `merge-tool`)
> **Status:** Built — see `src/examples/merge-tool/`
> **Author prompt style:** Natural language (conversational), single detailed brief followed by a scoped follow-up

---

## Original prompt

The brief was delivered as one long conversational message in Cursor chat, describing the interface end to end, followed by a separate message adding expandable rows (deferred to its own plan — see `.cursor/plans/merge_tool_expandable_cast_rows_*.plan.md`).

### Message 1 — Feature description

> "Alright we will be making a new interface view, this will be an interface which
> is made for merging entities into one single entity. This will be an interface
> that will live in the sketchflow showcase but under a different project name
> "Merge tool" The usecases for it are, merging duplicates, one that exist in a
> certain database and a crawled entry, for example there is a crawler that
> exists on the web somewhere and crawls all the newly created movies in the
> world, but because we are a film studio our film database's names are maybe
> not always the same, but they target the same movie. […] The interface looks
> like a two column interface. First column is representing our own movie
> database. […] the table has columns such as ID, name, date of release, genre,
> origin, director, top 3 cast and an action column which is a single radio
> button selection. […] Upon selection, the second column prefills with all
> possible crawled data from various movie databases. There is a suggestion api
> that is mocked in the background […]. There are at least three options
> available each giving a likely and less likely percentage match. […] we are
> going to be using foreign movies, such as German, Slavic, Russian, Asian ones
> […] The user then can select from the second column the best possible match,
> or even search through the crawler database. […] the main interface also has
> a main footer section on the bottom. This one features two buttons that are
> aligned to the right. First one is the reset button […] it also has a reset
> icon next to it. The main primary button is called Merge, which also has an
> icon of two arrows colliding into one. When both choices are selected, the
> main interface button Merge gets enabled. Upon clicking on it, the user is met
> with a dialog window. […] the upper row which shows the database movie info
> and the preview of what will get overriden […] is Preview. […] The second row
> is the one that will show the overrides. This one will have checkboxes on the
> bottom of the row […] Including a master checkbox which will select all of the
> fields […] After the user has selected at least one field […] the Merge button
> in the modal gets active again […] After pressing merge, the user is guided
> back to the main screen where they can find their newly merged movie in our
> database. Mocked data: Create a base database crawl of foreign movies […] The
> mocked data database should be rich, because we want this interface to be
> fairly well testable."

---

## What the brief implied (agent interpretation)

| Aspect | Interpretation |
|---|---|
| Domain | Catalogue-ops entity resolution — reconciling an internal film database against a mocked web crawler |
| Left column | `LOFITable` of DB titles: ID, title (+ native/original title), release date, genre, origin, director, top 3 cast, single radio select |
| Right column | Suggestion-API-driven `LOFITable` of crawled candidates (≥3 per DB title, confidence-ranked) with the same columns plus a Match confidence badge; also directly searchable |
| Confidence labelling | ≥80% → "likely match", <80% → "less likely match" — mocked, includes intentional decoys (wrong director/cast/era) |
| Internationalisation | German, French, Korean, Japanese, Russian, Polish, Argentine, and West-African-francophone titles with native-script/transliterated alternates |
| Footer | Reset (secondary, reset icon) + Merge (primary, colliding-arrows icon), right-aligned; Merge enabled only once both sides have a radio selection |
| Review modal | `LOFIModal size="wide"`, one shared-header `LOFITable` with exactly two rows — **Preview** (live-merging record) and **Crawled data** (per-field checkboxes + master "override all"); modal Merge disabled until ≥1 field is checked |
| Commit flow | Modal Merge → P7 confirmation-only overlay (stacked exception) → loading → success toast → DB row updated in place with a `merged` status badge |

---

## Mock data

`demos/sketchflow-showcase/src/examples/merge-tool/mockData.ts` seeds:

- **14 DB movies** (`DB_MOVIES`) — foreign titles with realistic data-entry quirks (stray caps, folded-in origin, missing diacritics) across Germany, France, South Korea, the Soviet Union/Russia, Japan, Poland, Argentina, Mauritania/Mali, plus a `Jurassic Park` blockbuster with a formatting quirk.
- **42 crawled records** (`CRAWLED_RECORDS`) across five mocked sources (GlobalFilm Index, CineData Worldwide, FilmAtlas, ReelTrace Archive, MovieMesh Crawler) — native-script titles (Cyrillic, Hangul, Kanji), transliterations, alternate regional titles, and one intentional low-confidence decoy per DB title (wrong director, cast, or an unrelated film by the same director).
- **`SUGGESTIONS`** — a `Record<dbId, SuggestionCandidate[]>` giving each DB title exactly 3 ranked candidates with a confidence spread (21%–99%).
- `fullCast` / `staff` / `filmingLocations` are populated **unevenly on purpose** on both DB and crawled records, so the expandable-row detail (Cast / Staff / Filming Locations tabs, built under the follow-up expandable-rows plan) has real empty-state cases.

---

## Component map

| Component | Role |
|---|---|
| `LOFIToolbar` | App chrome — user identity left, "Merge Tool" title centre |
| `LOFITable` | Our Database table, Crawler Matches table, and the two-row review table (shared header) |
| `LOFIField` + `LOFIInput` | Explicit-search filter rows above each browse table |
| `LOFIRadio` | Single-select column on both browse tables (one option per cell, shared `name`) |
| `LOFIBadge variant="id"` | ID chips |
| `LOFIBadge variant="tag"` | Match-confidence label, "overridden" marker in the review modal |
| `LOFIBadge variant="status"` | "merged" marker on a DB row after a successful merge |
| `LOFICheckbox` | Per-field override + master "override all" checkbox in the review modal |
| `LOFIModal` | Review merge dialog (P5) and the P7 confirmation-only overlay |
| `LOFILoader` | Confirm-button loading state during the simulated commit |
| `LOFIToast` | Post-merge success notification |
| `LOFIEmptyState` | First-use (no DB row picked yet) and no-results (search) states |
| `LOFIInlineAlert` | "N possible matches found…" summary above the suggestion table |
| `MergeToolResetIcon` / `MergeToolMergeIcon` | Local decorative SVGs (reset arrow; two arrows colliding into one) — not new `lofi-kit` primitives, following the `ShowcaseControlIcons.tsx` precedent |

---

## States implemented

| State | How to reach it |
|---|---|
| DB no-results | Search "Our Database" with no matches |
| Crawler first-use | Load the page — no DB row selected yet |
| Suggestions loaded | Select a DB row — ≥3 confidence-ranked candidates appear |
| Crawler search / no-results | Search the crawler directly instead of using a suggestion |
| Merge disabled / enabled | 0–1 vs 2 radio selections |
| Review modal, 0 overrides | Modal Merge disabled |
| Review modal, partial/all overrides | Preview row live-updates; master checkbox reflects all-checked |
| P7 confirm → loading → success | Modal Merge click through to commit |
| Post-merge | DB row updated in place with a "merged" badge + success toast |
| Automated preview | Full scripted walkthrough (select → suggest → select match → review → override → confirm → success), then hands off to interactive mode |

---

## Files

```
demos/sketchflow-showcase/src/examples/merge-tool/
├── metadata.ts                 — slug, patterns, controls, previewSteps
├── mockData.ts                 — FilmRecord/CrawledRecord types, DB + crawler datasets, SUGGESTIONS
├── MergeToolExample.tsx        — main two-column screen + review modal + P7 confirm, mode-aware
├── MergeToolExample.scss
├── FilmRowDetail.tsx/.scss     — shared expandable-row body (Cast / Staff / Filming Locations tabs)
├── MergeToolIcons.tsx          — local Reset / Merge decorative SVGs
├── automatedPreview.ts         — computeAutomatedSnapshot(steps, stepIndex)
├── previewCursor.ts            — cursor target resolution
├── MergeToolPreviewCursor.tsx/.scss
```

Registered in [`demos/sketchflow-showcase/src/examples/registry.ts`](../../demos/sketchflow-showcase/src/examples/registry.ts); `PreviewStepAction` extended (additively) in [`demos/sketchflow-showcase/src/runtime/types.ts`](../../demos/sketchflow-showcase/src/runtime/types.ts).

---

## Notes on the prompting pattern

This brief demonstrates a **single detailed conversational brief**: one long message specified the full two-column layout, the mocked suggestion API, the review-modal override mechanics, and the mock-data internationalisation requirement in one pass. The agent produced a written plan (`.cursor/plans/merge_tool_showcase_example_*.plan.md`) for confirmation before writing code. A later follow-up request (expandable rows with Cast/Staff/Filming Locations tabs) was deliberately split into its own deferred plan rather than folded into this one, at the user's request — see `.cursor/plans/merge_tool_expandable_cast_rows_*.plan.md`.

---

*Brief archived from: Cursor chat session, 24 Aug 2026*
*Prototype built by: AI agent (Transformer Patterns lo-fi workflow)*
