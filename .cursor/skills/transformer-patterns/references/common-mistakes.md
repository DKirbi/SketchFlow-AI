# Common mistakes (anti-patterns to avoid)

Load before finalizing flows or marking a review complete. Each item cites the governing rule — see the referenced pattern file for full context.

---

## Interaction (P1–P10)

### Confirmation dialogs

- ❌ "Are you sure?" — use the specific action name: "Delete team?" or "Discard changes to [entity]?" → **P7.103, P7.104**
- ❌ Using P7 for reversible actions like Hide — only for irreversible actions or saves → **P7.102**
- ❌ Using P7 before inline-workspace Save — inline save uses P3, not P7; only modal saves use P7 → **P7.102, P3.65**

### Validation

- ❌ Validating on every keystroke — validate on blur only; re-validate on change only for already-errored fields → **P6.92**
- ❌ Showing a validation error banner at the top of the form — show errors adjacent to each field → **P6.94**
- ❌ Clearing validation errors immediately on keystroke without re-validating — error persists until the field passes validation → **P6.93**

### Modals

- ❌ Stacking two editor modals — the only permitted second layer is a confirmation-only P7 overlay → **P5.91**
- ❌ Closing a half-edited modal without prompting — the rule explicitly says "does not prompt", so half-edits are lost (this is correct) → **P5.90**
- ❌ Using OK or generic Yes in modal footers — use the specific action: Save, Create, Remove, Add → **P5.83**

### Tables

- ❌ Hiding the table structure in first-use empty state — show table shell, headers, and columns with the empty message → **P2.45**
- ❌ Using "No data" message for both first-use and no-results — use different messages and provide appropriate actions → **P2.45, P2.46**
- ❌ Making Actions column sortable — it never is → **P2.56**

### Footer and state

- ❌ Showing Save/Reset footer when the form is clean — hide it when there are no pending edits → **P1.36**
- ❌ Enabling Save button before the form is dirty (edit mode) — commit stays disabled until the user changes at least one field → **P1.32, P6.95**
- ❌ Using Reset without a P7 confirmation — Reset always confirms before reverting → **P1.36**

### Sidebar and filtering

- ❌ Silently retaining a sidebar selection that no longer matches active filters — clear the main interface view → **P1.14, P9.120**
- ❌ Adding a "Select all" option to a filtered list — filter results always show what matches, not a select-all affordance
- ❌ Not providing a "Clear all" button in the filter row — always include this → **P1.12, P9.115**

### Destructive actions

- ❌ Hiding destructive row actions behind a menu without prominence — remove/delete must be available and confirmable → **P2.52**
- ❌ Making Remove reversible without explicitly stating it — Hide is reversible; Remove is final unless the spec says otherwise → **P2.50, P7.102**
- ❌ Disabling instead of hiding role-gated actions — always hide actions the user cannot perform → **P2.55, R9**

---

## Visual semantics (U0–U6)

### Color and rank hierarchy

- ❌ Using `success` as a button colour — it's a state, not an action (exception: explicit "available" checks) → **U1.10**
- ❌ Using `brand-primary` for primary actions — primary actions use `action` colour → **U0.4**
- ❌ Making two `fill` buttons side by side — one `fill` per cluster maximum → **U1.12, U1.32**
- ❌ Mixing `on-light` and `on-dark` surfaces in one overlay — flip all nested controls consistently → **U4.55**
- ❌ Placing `neutral` and `action` buttons in the same horizontal row — pick one semantic family → **U1.27**

### Rank emphasis

- ❌ Using "wavy" rank patterns (outline-subtle-outline) — emphasis should be monotonic → **U1.24**
- ❌ Making `outline` the strongest neighbour of `subtle` — use `fill` for the real commit when `subtle` is cancel → **U1.26**
- ❌ Distinguishing primary only by colour at the same rank — step up via rank (e.g. `ghost` peers + `subtle` primary) → **U1.34**
- ❌ Adding decorative rank differences unrelated to task importance — rank encodes real task hierarchy → **U1.29**
- ❌ Stacking three ranks "for variety" without justification — keep clusters clean → **U1.30**

### Destructive actions

- ❌ Using `fill warning` in table rows — `fill warning` is only for P7 confirm buttons → **U1.17, U5.65**
- ❌ Pairing `warning` with high rank outside P7 — default to `subtle` + `warning` or `outline` + `warning` → **U1.17**
- ❌ Using `warning` for reversible actions like Hide or Archive — those are `neutral` → **U1.11**

### Typography

- ❌ Using body text below `500` size for internal tools — minimum `500` for legibility → **U2.41**
- ❌ Bolding entire paragraphs — carry hierarchy with size, not weight → **U2.42**
- ❌ Using `1100+` font sizes in internal tools — reserve for hero contexts → **U2.39**

### Forms and validation

- ❌ Colour-only required marking — use asterisk + label typographically → **U3.49**
- ❌ Flooding valid fields with `success` — only use for explicit positive confirmation → **U3.48**
- ❌ Using `success` colour in form errors — hard errors are `warning`, soft cautions are `attention` → **U3.46, U3.47**
- ❌ Mixing field background tints with layout — group related inputs with layout + labels → **U3.51**

### Filters and tables

- ❌ Using `action` colour on all "selected" chips — `action` only for active mutation filters → **U5.69**
- ❌ Repeating `fill` down a column of row actions — use `outline` or `subtle` to avoid striped emphasis → **U5.64**
- ❌ Forgetting text labels on status cells — colour alone fails accessibility → **U5.62**
- ❌ Using high rank for equal-importance utilities — default `ghost` for peers → **U1.35**

### Buttons and toolbars

- ❌ Icon + multi-rank noise in footers without justification — prefer text-first → **U1.36**
- ❌ Using `intensity` as a substitute for fixing rank — `intensity` nudges, not fixes → **U1.37**
- ❌ Elevating actions by colour alone in dense icon strips — elevate by rank (e.g. to `subtle`) → **U1.34**
- ❌ Using `outline` as strongly tinted on same background as peers — ensure visual hierarchy → **U1.28**

### Spacing

- ❌ Hard-coding arbitrary px values (e.g. 14 px, 22 px) — use the 4/8 px grid → **U6.76**
- ❌ Using fine spacing (4/12 px) for section-level layout — reserve for intra-component work → **U6.78**
- ❌ Skipping the decision guide and inventing one-off gaps — step down the scale first, then discuss → **U6.79**
