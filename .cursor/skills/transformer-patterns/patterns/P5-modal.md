# P5 — Modal

A modal overlay that presents entity detail and allows editing or creation.

## Related patterns

- Modal Save requires **P7** (Confirmation Dialog) before async commit.
- Field validation: **P6** (Inline Validation).
- Success/error outcomes: **P4** (Toast).
- Modal tabs: **P8** (Tab Navigation).
- Tables inside modals: **P2** (Data Table) — P7-only stacking permitted.
- Modal footer UI semantics: **U4** (Overlays + navigation), **U3** (Forms).

---

## Rules

79. Three zones: **Header** (title, dismiss), **Body** (content), **Footer** (actions).
80. Tabs (if any) appear at the **top of the body content**. Use **Tabs** — never a segmented toggle — for modal section switching.
81. Footer: the **commit action is the rightmost** control. Cancel/dismiss is immediately to its left, secondary weight.
82. The left of the footer is rarely used; use it only for tertiary/ghost non-commit actions.
83. Primary label matches the trigger intent: Add flow → **Add**; Edit flow → **Save**; destructive → the action verb (**Remove**, **Delete**).
84. The commit button is **disabled until the form is dirty** (edit mode) or required fields pass (create mode).
85. Read-only modals: no primary commit; only a Close/Cancel to dismiss.
86. Cancel and Close dismiss without committing — same as pressing ×. Modal should respond to Escape.
87. **Wizard exception:** a Back button moves to the previous step without dismissing; Cancel sits to the **left of Back**.
88. **Edit mode:** all editable fields are **prefilled** with current saved values. Commit stays disabled until the form is dirty.
89. **Create mode:** fields are empty. Commit disabled until required fields validate. Commit label matches the trigger (Add, Create, etc.).
90. Closing a half-edited modal does **not** prompt a second stacked confirmation by default.
91. **Stacking rule (agent-specific): Default is no stacking.** The **only permitted exception** is a **confirmation-only overlay (P7)** triggered by a destructive or save action inside the modal. That P7 overlay must contain **only** a title, message, and two buttons — **no forms, no tables, no complex content**. Example: a user clicks "Save" inside an edit modal → a P7 overlay appears asking "Save changes to [entity]?" → on confirm, the overlay shows loading, then both the overlay and the modal close, and a success toast appears. Any other stacking scenario (a second editor modal, a second form, a nested table editor) requires explicit stakeholder sign-off before implementation.

---

## Common mistakes (P5)

- ❌ Stacking two editor modals — the only permitted second layer is a confirmation-only P7 overlay (P5.91).
- ❌ Using OK or generic Yes in modal footers — use the specific action: Save, Create, Remove, Add (P5.83).
- ❌ Closing a half-edited modal with a second confirmation — the rule explicitly says "does not prompt" (P5.90).
