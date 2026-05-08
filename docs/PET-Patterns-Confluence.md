# PET UX Patterns — Team Management

**Version:** 0.1
**Audience:** Designers, Frontend Engineers, Product Managers, Production Staff
**Last updated:** 07 Apr 2026
**Owner:** Product Engineering Tribe

---

## What this document covers

This page describes the UX patterns used in the Team Management feature. It serves as a reference for anyone building, reviewing, or testing interfaces that involve managing entities (teams, players, records) through tables, modals, and multi-step workflows.

The patterns described here are reusable. While this page uses Team Management as the concrete example, the same interaction rules apply wherever these patterns appear across PET applications. If you are building a new feature and recognise one of these patterns in your workflow, follow the rules documented here.

**This is not a visual design spec.** It documents flow, behaviour, sequencing, and guardrails. Visual styling is handled by the component library.

---

## Table of contents

1. [How Team Management works (end-to-end)](#1-how-team-management-works)
2. [Pattern reference](#2-pattern-reference)
   - [Data Table](#data-table)
   - [Row Actions](#row-actions)
   - [Detail Modal](#detail-modal)
   - [Inline Add and Remove](#inline-add-and-remove)
   - [Table Controls (Search, Filter, Sort)](#table-controls)
   - [Bulk Data Entry (CSV Import)](#bulk-data-entry)
   - [Create Flow](#create-flow)
   - [Destructive Actions and Approval Chains](#destructive-actions-and-approval-chains)
   - [Confirmation Dialogs](#confirmation-dialogs)
   - [Save, Loading, and Feedback](#save-loading-and-feedback)
   - [Changelog](#changelog)
   - [Tab Navigation](#tab-navigation)
   - [User Identity and Roles](#user-identity-and-roles)
3. [Interaction rules (system-wide)](#3-interaction-rules)
4. [Glossary](#4-glossary)

---

## 1. How Team Management works

This section walks through the complete workflow an operator experiences when managing teams. Each step references a pattern described in detail in Section 2.

### The starting view

The operator opens the Teams page. Two tabs sit at the top of the content area:

- **Teams** — the default active tab, showing a table of all teams
- **Changelog** — an audit trail of all changes made to teams and rosters

The operator's identity is visible in the application header: their system handle (e.g. `j.smith`) and their role (`Operator`, `Supervisor`, or `Admin`). The role determines which actions are available to them throughout the interface.

### Browsing teams

The Teams tab displays a data table. Each row represents a team. Standard columns include team name, sport, competition, player count, and status. The last column is **Actions**, which contains controls for operating on that team.

For an operator, the primary action is **Edit**. Depending on the team's status, a secondary action — **Mark as Redundant** — may also be available.

Above the table, a prominent **+ New Team** button allows creating a team from scratch.

If the team list is long (more than roughly 15 rows), a search bar is always visible above the table. It is never hidden behind an icon or a toggle — operators working under time pressure should never have to hunt for search.

### Editing a team

Clicking **Edit** on a team row opens a modal. The modal is the operator's workspace for this team. It has two main areas:

**Team metadata** appears at the top — the team name, associated sport, competition, and status. In edit mode, these fields are read-only. They provide context but are not editable here.

**The player roster** fills the body of the modal. This is another data table showing all players currently associated with the team. Above the roster, controls allow searching players by name or ID, filtering by position or statistics, and sorting by column headers.

Each player row has an action: players already on the team show a **−Remove** button. Players available to add (from a search or filtered view) show a **+Add** button.

At the bottom of the modal, a **Save** button and a **Cancel** button sit in the footer. Save is disabled until the operator has made at least one change and all validations pass.

### Adding a player

The operator searches for a player in the roster table, finds them, and clicks **+Add**. The row updates immediately — the +Add button is replaced by −Remove, indicating the player is now staged for addition.

This change is not yet saved. It exists only in the current modal session. The operator can continue adding or removing players before committing.

If the player does not exist in the database, the operator can use the **Import CSV** option to upload a file of player records. After upload, the table is populated with the imported data. Rows with validation issues (missing name, duplicate ID) are flagged individually with inline error messages on the affected row. The operator resolves errors before saving.

### Removing a player

Clicking **−Remove** on a rostered player triggers a confirmation dialog: *"Remove Luka Modrić from FC Barcelona?"* with two options — **Remove** and **Cancel**.

This confirmation exists even though the change is staged, not yet persisted. Removing a player from a roster is a consequential action that can be easy to do accidentally, so the system always asks before executing it.

After confirming, the player row reverts to its "available" state (showing +Add again) or moves out of the current roster view.

### Saving changes

When the operator is ready, they click **Save**. A confirmation dialog appears: *"Save changes to FC Barcelona?"* — **Save** and **Cancel**.

On confirmation, the Save button enters a loading state (showing "Saving…" or a spinner). The interface simulates a brief processing delay. On success, the modal closes, the outer team table refreshes to reflect the updated player count, and a brief notification confirms the save: *"FC Barcelona updated successfully."*

If the save fails, the modal stays open with all data intact. An error message appears, and the Save button re-enables so the operator can retry.

### Creating a new team

Clicking **+ New Team** opens the same modal structure, but in create mode.

The key difference: the team metadata section is now editable and required. The operator must fill in the team name, sport, and competition. These fields validate inline — each field shows its own error if left empty or invalid. The player roster section below is visible but disabled until the metadata fields are all valid. This prevents the operator from building a roster for a team that doesn't have a name yet.

Once metadata is valid, the roster section activates. The operator adds players the same way as in edit mode.

The footer button reads **Create Team** (not "Save") to make the action clear. Clicking it triggers a confirmation dialog, then follows the same save flow.

### Marking a team as redundant

If a team is no longer needed, the operator can flag it for removal. The **Mark as Redundant** action appears as a secondary option in the row actions — deliberately less prominent than Edit, because it is a less common action.

Clicking it triggers a confirmation dialog: *"Mark FC Example as redundant?"* — **Confirm** and **Cancel**.

On confirmation, the team's status changes to "Redundant." The row visually reflects this (muted styling, updated status badge). The team remains in the table. No data is deleted at this point.

### Approving removal (Supervisor)

An operator cannot delete a team. They can only flag it. A user with Supervisor or Admin role sees the flagged team and has access to a **Remove** action that is not visible to operators.

Clicking **Remove** opens a confirmation dialog showing the team name, who flagged it, and when. The Supervisor confirms with a **Remove Team** button. On confirmation, the team is permanently removed from the table.

This two-step process ensures that no single user can unilaterally delete data. One person initiates; a different person with appropriate authority confirms.

### Reviewing the changelog

Switching to the **Changelog** tab shows a chronological log of every action taken on teams and rosters. Each entry records:

- **When** — timestamp in `DD MMM YYYY, HH:mm` format
- **Who** — the user's system handle (`j.smith`)
- **What** — a system-generated summary of the action (e.g. *"Added player Luka Modrić (ID 4821) to FC Barcelona"*, *"Marked FC Example as redundant"*, *"Removed FC Example (approved by s.kovac)"*)
- **Which entity** — the affected team (and player, if applicable)

The changelog is read-only and append-only. Entries are generated automatically — users do not write them. Filters allow narrowing by user, date range, or action type.

---

## 2. Pattern reference

Each pattern below can be used independently. Cross-references indicate where patterns interact.

---

### Data Table

**What it is:** A table displaying rows of entity data with sortable columns, optional search, and support for empty and loading states.

**When to use it:** Any time the interface presents a list of entities (teams, players, matches, records) that the operator needs to browse, search, or act on.

**How it behaves:**

- Columns are defined by the feature. The minimum default set is: entity name, ID, status, and an Actions column.
- If the table is expected to have more than roughly 15 rows, a search bar must be visible above it at all times. Search is never hidden.
- Column headers support click-to-sort. An arrow indicator shows which column is actively sorted and in which direction.
- When the table has no data, it displays an empty-state message inside the table body (e.g. *"No teams found."*). The table structure (headers, controls) remains visible.
- When data is loading (e.g. after a CSV import), a loading indicator appears in the table body. It does not block the rest of the page.

**Nesting rule:** A table can appear inside a modal (e.g. a player roster inside a team detail modal). However, this inner table does not open further modals. If deeper navigation is needed, it happens within the modal body (tabs, expanding rows), not via stacked modals.

---

### Row Actions

**What it is:** A button or button group in the Actions column of a table row, allowing the operator to perform operations on that row's entity.

**When to use it:** When individual rows need their own controls — editing, viewing, flagging, or removing.

**How it behaves:**

- If only one action exists, it renders as a simple button in the row.
- If multiple actions exist, the most common action (typically Edit) is the primary visible button. Less common actions appear as secondary controls.
- Destructive actions (Remove, Delete) are never the most prominent button in a row. They are always secondary, or they require a prior status change before becoming available (see [Destructive Actions](#destructive-actions-and-approval-chains)).
- Actions that are restricted to certain roles are completely hidden for unauthorized users — not greyed out, not disabled, but absent. This prevents confusion about what the operator can and cannot do.

---

### Detail Modal

**What it is:** An overlay dialog that presents detailed information about an entity and serves as the editing workspace.

**When to use it:** For edit and create flows where the operator needs to view and modify an entity without leaving the current page context.

**How it behaves:**

- The modal has three zones: a **header** (entity name, close button), a **body** (the working area — fields, tables, tabs), and a **footer** (Save/Create and Cancel buttons).
- Closing the modal without saving discards all staged changes. Nothing persists until the operator clicks Save or Create.
- If the operator has made changes and attempts to close or cancel, the system prompts: *"You have unsaved changes. Discard?"* with **Discard** and **Go Back** options. This prevents accidental data loss.
- The same modal structure is used for both Edit and Create flows. The differences are described under [Create Flow](#create-flow).
- Modals do not stack. A modal never opens another modal.

---

### Inline Add and Remove

**What it is:** Per-row controls inside a table that modify the row's relationship to a parent entity — adding or removing a player from a team roster, for example.

**When to use it:** Inside a detail modal's nested table, when the operator manages membership or association.

**How it behaves:**

- **+Add** is a standard-weight button. Clicking it stages the addition — the button swaps to −Remove, and the row visually indicates the player is now part of the roster.
- **−Remove** is visually distinct from +Add (labelled explicitly with the minus sign). Clicking it always triggers a confirmation dialog before executing, even though the change is staged and not yet saved.

**Why Remove always confirms:** Adding a player is low-risk — the operator will see the addition reflected in the table and can undo it before saving. Removing a player is higher-risk because it is easier to overlook a removal in a long list. The confirmation dialog forces a moment of deliberate recognition.

Both add and remove actions only affect local state. The actual data change happens when the operator saves the parent modal.

---

### Table Controls

**What it is:** Search, filter, and sort controls associated with a data table.

**When to use it:** On any data table where the operator needs to find specific rows efficiently.

**How it behaves:**

- The **search bar** is always visible above the table. Its placeholder text describes what is searchable (e.g. *"Search by ID or name…"*). Searching filters the table in real time — no submit button needed.
- **Filters** are rendered as visible controls (dropdowns, toggles), each labelled with what they filter (e.g. Position, Status). They are never collapsed behind a generic "Filter" button. When a filter is active, it shows its current value visibly.
- **Sorting** is triggered by clicking a column header. The active sort direction is shown with an arrow. Only one column sorts at a time.
- If any filters are active, a **Clear filters** action is available to reset everything at once.
- Search and filters work together: searching while a filter is active narrows within the already-filtered set.

---

### Bulk Data Entry

**What it is:** An alternative data entry method — typically CSV import — that populates a table with multiple rows at once.

**When to use it:** When the operator needs to add entities (players, records) that do not yet exist in the system, or when adding many records at once would be impractical one-by-one.

**How it behaves:**

- The entry point is a secondary button near the table (e.g. **Import CSV**). It does not compete for visual prominence with primary table interactions.
- After file upload, the table is populated with the parsed data.
- Validation happens inline, per row. Rows with problems (missing required field, duplicate ID, format error) are flagged individually on the row itself, with a message describing the specific issue. Errors are never presented as a disconnected summary above the table.
- Valid rows are immediately available for interaction.
- The Save button remains disabled until all critical validation errors are resolved.

---

### Create Flow

**What it is:** A variant of the Detail Modal for creating a new entity rather than editing an existing one.

**When to use it:** When the operator needs to add a new team, record, or other top-level entity.

**How it behaves:**

- Triggered by a primary button above the outer table: **+ New Team** (or equivalent).
- Opens the Detail Modal with metadata fields editable and required. The operator must complete these (team name, sport, competition) before other sections of the modal become active.
- Sections that depend on valid metadata (e.g. the player roster) are visible but disabled until the metadata validates. They are not hidden — the operator should see the full scope of what the form will contain.
- The footer button reads **Create Team** (not "Save"). Using the specific verb makes the action unmistakable.
- After successful creation: the modal closes, the outer table refreshes, and a notification confirms the result.

---

### Destructive Actions and Approval Chains

**What it is:** A multi-step process for permanently removing or archiving an entity, requiring two different users to act.

**When to use it:** Any time data will be permanently deleted or archived. This pattern is mandatory — no single-user deletion path exists.

**How it works:**

**Step 1 — The operator initiates.** They click **Mark as Redundant** (or similar) on a team row. A confirmation dialog appears. On confirmation, the team's status changes to "Redundant." The row is visually muted. No data is deleted. This action is reversible.

**Step 2 — A supervisor or admin approves.** A user with the appropriate role sees the flagged team and has access to a **Remove** action. This action is not visible to operators at all. Clicking it opens a confirmation dialog that shows the team name, who flagged it, and when. On confirmation, the team is permanently removed.

**Why two steps:** This pattern prevents accidental or unauthorized data loss. The person who flags an entity for removal is not the same person who confirms the removal. This separation of concerns is a fundamental guardrail in data-critical workflows.

---

### Confirmation Dialogs

**What it is:** A small dialog that appears before a meaningful action is executed, requiring the operator to explicitly confirm.

**When it appears:** Before every action that creates, modifies, or deletes data. This includes saving, creating, adding, removing, marking as redundant, discarding unsaved changes, and any other state-changing action.

**This is a system-wide default.** If you are building a new feature and are unsure whether an action needs a confirmation dialog, the answer is yes.

**How it behaves:**

- The dialog contains a **title** (the action), a **message** (what will happen and to which entity), and two buttons: a **confirm** button and **Cancel**.
- The confirm button is labelled with the specific action verb: **Save**, **Remove**, **Create**, **Discard**. Never generic words like "OK" or "Yes."
- For destructive actions, the confirm button is visually distinct.
- Cancelling always returns to the previous state with no changes.
- Confirmation dialogs are simple — they contain a question and two answers. They do not contain forms, tables, or complex content.

**Examples of correct confirmation messages:**

| Action | Dialog message | Confirm button |
|---|---|---|
| Saving a team | *"Save changes to FC Barcelona?"* | Save |
| Creating a team | *"Create team Real Madrid CF?"* | Create Team |
| Removing a player | *"Remove Luka Modrić from FC Barcelona?"* | Remove |
| Marking as redundant | *"Mark FC Example as redundant?"* | Confirm |
| Discarding unsaved changes | *"You have unsaved changes. Discard?"* | Discard |
| Supervisor removing a team | *"Remove FC Example? Flagged by j.smith on 05 Apr 2026."* | Remove Team |

---

### Save, Loading, and Feedback

**What it is:** The system's behaviour during and after a save or create operation.

**When to use it:** Every time the operator commits a change.

**How it behaves:**

**Before save:** The Save/Create button is disabled until all required field validations pass and at least one change has been made. This prevents submitting empty or invalid data.

**Validation:** Each field validates independently and shows its own error message. Validation runs when the operator leaves a field (on blur). If a field is already showing an error, it re-validates on each keystroke so the error clears as soon as the input is corrected. Required fields are clearly marked (e.g. with an asterisk).

**During save:** After the operator clicks Save and confirms via the confirmation dialog, the button enters a loading state ("Saving…" or a spinner) and becomes disabled. The operator cannot double-click or interact with the form during this time.

**On success:** The modal closes. The parent table refreshes to reflect changes. A brief notification appears confirming the action (e.g. *"FC Barcelona updated successfully"*). The notification auto-dismisses after a few seconds.

**On failure:** The modal stays open. All data remains intact. An error message appears. The Save button re-enables for retry.

---

### Changelog

**What it is:** A read-only audit trail showing every change made to entities within this feature.

**When to use it:** Alongside any feature that modifies data. The changelog provides accountability and traceability.

**How it behaves:**

- Displayed in a separate tab alongside the main operational view.
- Each entry records: timestamp, user handle, action summary, and affected entity.
- Entries are generated automatically by the system whenever an action modifies data. Operators do not write changelog entries.
- User handles appear in system format: `j.smith`, `m.novak`. Not full names.
- The changelog is append-only. No entries are edited or deleted.
- Sorted newest-first by default.
- Filters allow narrowing by user, date range, or action type.
- For long changelogs, use pagination — not infinite scroll. Operators need deterministic positioning in the list.

---

### Tab Navigation

**What it is:** A tab bar that switches between parallel views within the same feature.

**When to use it:** When a feature has multiple views of the same domain — e.g. operational data and changelog sitting side by side.

**How it behaves:**

- Tabs appear above the content area they control.
- One tab is active at a time. The active state is visually indicated.
- Switching tabs preserves state. If the operator has work in progress in one tab and switches to another, their work is still there when they return.
- Tabs represent **parallel views**, not sequential steps. If the workflow is sequential, use a different pattern (stepper or wizard).

---

### User Identity and Roles

**What it is:** A persistent element in the application header showing who is logged in and what role they hold.

**When to use it:** Always. This element is global and present on every page.

**How it behaves:**

- Displays the user handle in system format: `j.smith`.
- Displays the role as a label next to the handle: `Operator`, `Supervisor`, `Admin`.
- This is informational. It does not contain menus or settings.
- The role label is functionally significant: it tells the operator which actions are available to them. If a supervisor sees a "Remove" action on a redundant team and an operator does not, the role label explains why.

---

## 3. Interaction rules

These rules apply across all PET applications, not just Team Management. They are system-wide defaults.

### Every action confirms

All actions that create, modify, or delete data require an explicit confirmation dialog before executing. There are no exceptions. This includes saving, creating, adding, removing, flagging, and discarding unsaved changes.

The confirmation dialog names the specific action and the specific entity. It never uses generic phrasing like "Are you sure?" or "OK."

### Save is earned, not given

Save and Create buttons start disabled. They become active only when all required fields have been filled in, all inline validations pass, and at least one meaningful change has been made. This prevents operators from submitting empty or broken data.

### Validation is local, not global

Each field or table row validates on its own and shows its own error message directly adjacent to the control. There are no error summary banners at the top of a form. The operator should never have to scroll up to understand what went wrong.

### Removing is harder than adding

Adding an entity (to a roster, to a table, to a list) is a single click. Removing an entity always requires confirmation. This asymmetry is deliberate: adding is easily noticed and easily reversed; removing can go unnoticed in a long list and may have downstream consequences.

### Deleting takes two people

Permanent deletion of a top-level entity (a team, a record) is never a single-user action. One user flags the entity for removal; a different user with a higher role confirms the removal. The UI enforces this by hiding the final Remove action from users who do not have the required role.

### Feedback follows the action

After every confirmed action, the system provides clear feedback: a loading state while processing, a success notification on completion, or an error message with a retry option on failure. The operator is never left wondering whether their action worked.

### The changelog records everything

Every data-modifying action generates a changelog entry automatically. The operator does not need to log their own actions. The changelog is the system's memory of what happened, when, and by whom.

---

## 4. Glossary

| Term | Meaning |
|---|---|
| **Operator** | A Production team member who enters and manages data. The most common user role. |
| **Supervisor** | A Production team lead who reviews and approves high-impact actions (e.g. entity removal). |
| **Admin** | A user with full system permissions, including user and role management. |
| **Staged change** | A modification made inside a modal that has not yet been saved. Staged changes exist only in the current session and are discarded if the modal is closed without saving. |
| **Confirmation dialog** | A small overlay that asks the operator to explicitly confirm an action before it executes. |
| **Inline validation** | A validation error shown directly on the field or row that caused it, rather than in a summary elsewhere on the page. |
| **Approval chain** | A multi-step process where one user initiates an action and a different user with higher authority approves it. |
| **Changelog** | A read-only, system-generated log of all data modifications, showing who did what and when. |
| **User handle** | The system-format identifier for a user, e.g. `j.smith`. Used in the identity bar and changelog. |
| **Role gating** | Restricting visibility or availability of certain actions based on the user's role. Gated actions are hidden (not disabled) for unauthorized users. |

---

*PET Design System — Confluence Documentation*
*For questions or updates, contact the PET Design System team.*
