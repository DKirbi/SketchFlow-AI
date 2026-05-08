# Pattern examples backlog (Storybook)

Live examples use `<!-- storybook:embed ExportName -->` markers in [`docs/UX_PATTERNS.md`](UX_PATTERNS.md) and [`docs/UX_PATTERN_STORIES.md`](UX_PATTERN_STORIES.md), resolved to named exports in [`lib/stories/UXFlows.stories.tsx`](../lib/stories/UXFlows.stories.tsx).

| Pattern id | Doc anchor | Story export | Status | Notes / depends on |
|------------|------------|--------------|--------|-------------------|
| P1.2.3.1 | `#### P1.2.3.1: Heading Bar` | `P1_2_3_1_HeadingBar` | Done | Breadcrumb, title row, badges |
| P1.2.3.2 | `#### P1.2.3.2: Footer` | `P1_2_3_2_Footer` | Done | Reset + P3 save strip in `LOFIMainWorkspace` |
| P1.2.3.3 | `#### P1.2.3.3: Main Content` | `P1_2_3_3_MainContent` | Done | In-pane tabs + mixed body; changelog tab |
| P1.2 | `#### P1.2: Internal Workspace` | — | Optional | Bridge prose only; skip or add diagram story |
| P2.5 | `#### P2.5: Expandable rows` | `P2_5_ExpandableRows` | Done | LOFITable expandable + sticky parent row + scrollable detail (P10) |
| P4 | `### P4: Toast notification messages` | `P4_ToastNotificationMessages` | Done | Inline footer + save/error toasts |
| P10 | `### P10: Sticky disclosure while scrolling` | `P10_StickyDisclosure` | Done | Accordion-style block + nested expandable table |
| P2.4 | `#### P2.4: Bulk Operations` — import | `P2_4_BulkImport` | Done | Table overlay + processing state |
| P8 | `### P8: Tab Navigation` | `P8_TabNavigation` | Done | Dirty preserved across tab switches |
| P9 | `### P9: Filters` | `P9_Filters` | Done | Row + active-filter chips + Clear all |
| Story 1 | `### Story 1: Team Management` in `UX_PATTERN_STORIES.md` | `Story1_TeamManagement` | Done | Sidebar (Teams \| Changelog) + main pane; table/modal flows |
| Story 2 | `### Story 2: … Tournament Admin` in `UX_PATTERN_STORIES.md` | `Story2_TournamentAdmin` | Done | Shell + filter + linked sidebar + main interface view |

_Update this table when you add or retire embeds._
