### Story 1: Team Management

**Flow:**

```
OUTER VIEW
├── Tab: Teams (active)
│   ├── Toolbar: [Search input + Search button] (left) | [+ New Team] (right, primary)
│   ├── Data Table (P2.1): team list
│   │   ├── Columns: Team Name, Sport, Competition, Player Count, Status, Actions
│   │   └── Row Actions (P2.2): [Edit] | [Remove] (secondary, destructive)
│   │
│   ├── EDIT FLOW (triggered by Edit row action)
│   │   └── Modal (P5)
│   │       ├── Header: team name, close button
│   │       ├── Body: LOFITabs (Team Info | Players)
│   │       │   ├── Team Info tab: team metadata (prefilled)
│   │       │   └── Players tab: player roster table + filters
│   │       │       ├── Data Table (P2.1): player list
│   │       │       │   ├── Columns: Player Name, ID, Position, Stats, Actions
│   │       │       │   └── Row Actions (P2.2): [−Remove] per player → Confirmation Dialog (P7)
│   │       │       └── Bulk Entry (P2.4): [Import CSV] / drag-and-drop zone
│   │       └── Footer: [Save] disabled until dirty | [Cancel]
│   │           └── Save → Confirmation Dialog (P7) → loading → success toast (P4) → modal closes
│   │
│   ├── CREATE FLOW (triggered by + New Team)
│   │   └── Modal (P5, create mode)
│   │       ├── Header: "New Team", close button
│   │       ├── Body: team metadata (empty, required fields marked)
│   │       └── Footer: [Add] disabled until required fields valid | [Cancel]
│   │           └── Add → Confirmation Dialog (P7) → loading → success toast (P4) → modal closes
│   │
│   └── REMOVE FLOW (P2.2 + P7)
│       └── [−Remove] row action → Confirmation Dialog (P7) → entity removed → table updates
│
├── Tab: Changelog
│   ├── Filters: filter by user, date range, action type
│   └── Data Table (P2.1): changelog entries
│       └── Columns: Timestamp, User (j.smith format), Action, Entity
│
└── User identity strip (P1.1): j.smith | Operator [role switcher for prototype]
```

**Domain:** Managing sports teams, their rosters, and lifecycle.

**Prototype layout:** The Storybook example uses a **collapsible sidebar** (Teams | Changelog) beside the **main interface view** so the selected item mirrors the heading and body — the same logical surfaces as in the flow tree (often shown as top-level tabs in specs).

**Expected behaviours:**

- Clicking Edit → modal opens with mocked team data and player roster (prefilled, P5 edit mode)
- Modal body uses LOFITabs: Team Info tab + Players tab
- Search filters the player table (search input + Search button)
- −Remove prompts confirmation (P7) then stages removal
- Import CSV triggers bulk entry flow (P2.4) — loader overlay on table during import
- Save is disabled until at least one change is made and no validation errors exist (P6)
- Save → confirmation dialog (P7) → loading state → success toast (P4) → modal closes → table updates
- Add (create) → metadata fields required → Add → confirmation (P7) → success
- Remove row action → confirmation (P7) → row disappears from table
- Every action appends to the changelog tab

<!-- storybook:embed Story1_TeamManagement -->

---

### Story 2: Unified Production Landscape — Tournament Admin

**Flow:**

```
UPL SHELL (P1)
├── Upper bar (P1.1)
│   ├── Logo placeholder + "Unified Production Landscape | Events & Competitors"
│   └── Right: [Applications ▼]  [⚙ Configuration]  m.smith | Admin (role switcher for prototype)
│
├── Module context strip (P1.1 — optional second row)
│   └── Tab strip: [ Tournaments ] (active)
│
├── Filter query row (P9 Filters / P1.2.1)
│   ├── Dropdown: Sport (e.g. Soccer)
│   ├── Dropdown: Category
│   ├── Text input: Unique tournament ID
│   ├── Text input: Simple tournament ID
│   ├── Button primary: [Search]
│   └── Button secondary: [Reset search]
│       └── → sidebar updates to show matching entries
│
├── SIDEBAR (P1.2.2 — nav tree)
│   ├── ▼ Soccer
│   │   └── ▶ International clubs
│   │       └── ▼ Champions League
│   │           └── Knockout Bracket — CL ◀ (active leaf)
│   └── Selecting a leaf → main interface view loads entity
│
└── MAIN INTERFACE VIEW (P1.2.3)
    ├── Heading bar (P1.2.3.1)
    │   ├── Breadcrumb: International Clubs › Champions League
    │   └── Title: "Knockout Bracket — Champions League 24/25"  [SIMPLE TOURNAMENT]
    │
    ├── Tabs: [ Admin ] (active) | [ Competitors ] | [ Matches ] | [ Change log ]
    │
    ├── ADMIN TAB — feature editor (P5 rules apply; same as modal body)
    │   ├── Fieldset "General"
    │   │   ├── Field > Text input: Display name
    │   │   ├── Field > Dropdown: Simple Tournament
    │   │   ├── Field inline × 2: Sport / Category (read-only)
    │   │   └── Field: checkboxes — League / Cup / Friendlies
    │   ├── Fieldset "Settings"
    │   │   └── Toggle grid: Completed / Scheduled / Disabled / Placeholder matches /
    │   │       Neutral ground / Visible in statistics / Decides champion / …
    │   └── Fieldset "Season"
    │       ├── Field > Dropdown: Season
    │       ├── Field > Dropdown: Season type
    │       ├── Field > Dropdown: Season unique type
    │       └── Field > Text input: Phase (number)
    │
    ├── COMPETITORS TAB
    │   ├── Filters: search + dropdowns
    │   └── Data Table (P2.1): competitor list
    │       └── Row Actions (P2.2): [Edit] | [Remove]
    │
    ├── MATCHES TAB
    │   └── Data Table (P2.1): match list with status badges
    │
    ├── CHANGE LOG TAB (last tab — always read-only)
    │   └── Data Table (P2.1): changelog entries, sorted newest-first
    │       └── Columns: Timestamp, User (j.smith), Action, Entity
    │
    └── STICKY FOOTER (P1.2.3.2)
        ├── Button secondary: [Reset changes] → Confirmation Dialog (P7) → reverts edits
        └── StatefulButton primary: [Save changes] (disabled when no changes / validation fails)
            └── → **P3** (no P7): loading → success toast (**P4**) / error toast (**P4**) → changelog entry appended on success
```

**Domain:** Managing tournament structures from a UPL shell with hierarchical sidebar navigation and a dense feature editor.

**Prototype layout:** After the upper shell and filter row, the Storybook example is a **single workspace row**: sidebar (P1.2.2) and main interface view (P1.2.3) share one selection — changing the active tree leaf updates breadcrumb, title, badge, and read-only sport in the main pane.

**Expected behaviours:**

- Selecting Sport "Soccer" → sidebar shows Soccer subtree; other sports collapse
- Selecting CL leaf → main interface view loads with correct breadcrumb + title
- Admin tab: any change sets `isDirty = true` → "Save changes" enables
- Switching to Competitors tab with unsaved Admin edits: no confirmation (P8 — state preserved)
- "Reset changes" → confirmation dialog (P7) → reverts all tab fields to saved state
- "Save changes" → **P3** StatefulButton (no P7): loading → success / error **toasts** (**P4**) → on success, changelog entry appended
- "Change log" tab: append-only, newest-first
- Sidebar collapse (◀) → sidebar hidden; main interface view expands; selection + tree state preserved
- Sidebar expand (▶) → tree restored to same expanded/selected state (P1)
- Filter "Reset search" → tree clears; main interface view shows empty state if selection was filter-dependent

<!-- storybook:embed Story2_TournamentAdmin -->

---

# UX Flows

**UX flows** are reference scenarios showing how patterns combine into complete flows. When a new interface matches a flow, use it as the flow specification. When the interface is novel, compose from **Patterns** in [`UX_PATTERNS.md`](./UX_PATTERNS.md) using the interaction rules there.

Live examples run in Storybook under **PATTERNS → UX Patterns** (this page is also embedded there as a second docs page).

---

_Add new UX flows in this file and register the Storybook export in `lib/stories/UXFlows.stories.tsx`. For process and numbering rules, see **Extending this file** in [`UX_PATTERNS.md`](./UX_PATTERNS.md)._
