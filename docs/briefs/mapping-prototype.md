# Value Mapping — LoFi Prototype Brief

> **Demo:** `demos/mapping-prototype/`
> **Status:** Built — see `src/components/MappingView/`
> **Author prompt style:** Natural language (conversational) → plan refinement → execution

---

## Original prompt

The brief was delivered as two conversational messages in Cursor chat. No formal
brief document was written in advance. This file captures both messages verbatim
and documents what was built from them, as a reference example for the
natural-language prompting workflow.

### Message 1 — Feature description

> "I need a screen for mapping external values to internal ones. There's a table
> with a list of items — each row shows an internal value on the left and a
> suggested external value on the right. Each row has two buttons: Map, which
> applies the external suggestion to that internal value, and Unmap, which removes
> a previously applied mapping.
>
> Rows can be selected using checkboxes. When at least one row is selected, a
> Bulk Map button appears at the top of the table and becomes active — it should
> be disabled when nothing is selected. Clicking Bulk Map applies the external
> suggestion to all selected rows at once.
>
> Mapped rows should look visually distinct from unmapped ones — a status badge
> would work. The table should show which rows are already mapped and which are
> still pending."
>
> Create this as a new Demo called Mapping prototype

### Message 2 — Data and confidence refinements

> "The External suggestion should be somewhat similar to the Internal Label, just
> a bit different. The Internal value could have errors in the text for example.
> External suggestions should also have a badge with a number percentage that
> signals the probability that the suggestion is accurate. This should be of
> course mocked to signal the possibility [of] correct suggestions."

---

## What the brief implied (agent interpretation)

The two messages together defined the following:

| Aspect | Interpretation |
|---|---|
| Domain | Data-ops tooling — cleaning/matching an internal dataset against an external reference |
| Internal values | Contain realistic data-entry errors (typos, casing, abbreviations) |
| External suggestions | Cleaned/corrected equivalent labels from the external system |
| Confidence | Mocked percentage badge showing how likely the suggestion is correct |
| Per-row actions | Map (apply suggestion) and Unmap (remove applied mapping) |
| Bulk action | Multi-select via checkboxes + Bulk Map; disabled until ≥1 row selected |
| Status | `mapped` (solid badge) vs `pending` (dashed badge) |
| Async feedback | Loading state (500–800 ms) during Map / Unmap / Bulk Map |
| Unmap confirmation | Inline "Remove mapping?" before executing (destructive action) |
| Bulk Map confirmation | Modal confirm showing count of affected rows |

---

## Mock data

Competition names from a sports data platform, chosen to fit the mapping demo’s
sports-competition domain. 10 rows, 2 pre-mapped on load.

| Internal value (with errors) | External suggestion | Confidence | Initial status |
|---|---|---|---|
| `UEFA Champins League` | `UEFA Champions League` | 97% | mapped |
| `Enlgish Premeer League` | `English Premier League` | 94% | mapped |
| `LaLiga Santander` | `La Liga` | 88% | pending |
| `Serie-A (Italy)` | `Serie A` | 91% | pending |
| `Bundesliga 1` | `Bundesliga` | 85% | pending |
| `Lgue 1 France` | `Ligue 1` | 76% | pending |
| `eredivisie` | `Eredivisie` | 82% | pending |
| `scottish prem` | `Scottish Premiership` | 63% | pending |
| `UEFA Eurpoa Lge` | `UEFA Europa League` | 89% | pending |
| `FIFA World Cup 2026` | `FIFA World Cup` | 71% | pending |

The confidence spread (63%–97%) is intentional: high-confidence rows (≥85%) make
a natural argument for Bulk Map, while low-confidence rows (63%, 71%) are ones
you would want to review individually before mapping.

---

## Component map

| Component | Role |
|---|---|
| `LOFIToolbar` | App chrome — user identity left, title centre, live counts right |
| `LOFITable` | Main mapping table (TanStack) |
| `LOFICheckbox` | Per-row selection + select-all in header cell |
| `LOFIButton` | Map, Unmap, Bulk Map, confirm/cancel |
| `LOFIBadge variant="status"` | Mapping status: solid = `mapped`, dashed = `pending` |
| `LOFIBadge variant="id"` | Internal ID reference chip in the Internal Value column |
| `LOFIBadge variant="tag"` | Confidence percentage on the External Suggestion column |
| `LOFIText` | All rendered copy |
| `LOFIModal` | Bulk Map confirmation dialog |
| `LOFILoader` | 500–800 ms async feedback during Map / Unmap / Bulk Map |

---

## States implemented

| State | How to reach it |
|---|---|
| Default | Load the page — 2 mapped, 8 pending, no selection |
| Selection active | Check any row — Bulk Map label shows count, button enables |
| All selected | Check the header checkbox |
| Loading (single) | Click Map or Unmap — 600 ms loader in the actions cell |
| Unmap inline confirm | Click Unmap on a mapped row — "Remove mapping? / Yes, remove / Cancel" |
| Bulk Map confirm modal | Click Bulk Map with ≥1 row selected |
| Post-map | Row flips to `mapped` badge; `mappedAt` / `mappedBy` appear |
| All mapped | Map all rows — every row shows solid mapped badge |

---

## Files

```
demos/mapping-prototype/
├── package.json
├── vite.config.ts
├── tsconfig.json
├── index.html
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── test/setup.ts
    └── components/MappingView/
        ├── mockData.ts        ← types, seed data, CURRENT_USER, nowTimestamp()
        ├── MappingView.tsx    ← main screen component
        └── MappingView.scss   ← BEM + token-only styles
```

---

## Notes on the prompting pattern

This brief demonstrates the **conversational refinement** style of prompting:
a short natural-language description followed by one targeted follow-up that
adds a specific detail (the confidence badge). The agent produced a plan for
confirmation before writing any code, and the follow-up was applied to the plan
before execution began.

This style works well for single-screen prototypes. For multi-screen or
multi-role features, a structured brief (see `docs/BRIEF_AUTHORING_GUIDE.md`)
gives the agent more reliable context. Key signals that a feature needs a
structured brief rather than a conversational prompt:

- More than one role with different visible actions
- A multi-step flow (wizard, progressive disclosure)
- A destructive flow with an escalation chain (initiate → confirm → approve)
- Tables that open modals that contain their own tables

---

*Brief archived from: Cursor chat session, 07 Apr 2026*
*Prototype built by: AI agent (Transformer Patterns lo-fi workflow)*
