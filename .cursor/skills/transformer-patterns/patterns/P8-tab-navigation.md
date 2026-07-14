# P8 — Tab Navigation

A tab bar that switches between parallel views of the same domain.

## Related patterns

- Internal tabs in workspace main content: **P1.2.3.3** (Main Content).
- Tabs inside modals: **P5** (Modal).
- Tab UI semantics: **U4** (Overlays + navigation).

---

## Rules

107. Tabs appear **above the content area** they control.
108. One tab active at a time, visually indicated (underline convention).
109. Switching tabs does **not discard state**. Unsaved work in one tab persists when the user returns.
110. **Use tabs for parallel views** — including inside modals (**P5**). Use a stepper/wizard for sequential flows. Use a compact segmented control only inside dense non-modal panels.
111. Tabs can be disabled (role-gated); never set the active value to a disabled tab.
112. Tab labels may include optional **counts or status** indicators when the spec requires them.

---

## Common mistakes (P8)

- ❌ Discarding unsaved work on tab switch — state must persist (P8.109).
- ❌ Using a segmented toggle for modal section switching — use Tabs (P8.110, P5.80).
