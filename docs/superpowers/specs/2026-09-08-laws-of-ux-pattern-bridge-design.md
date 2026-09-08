# Laws of UX ↔ SketchFlowAI patterns

**Date:** 2026-09-08
**Status:** approved for implementation
**Source of law names:** [Laws of UX](https://lawsofux.com/) (Jon Yablonski)

Pattern IDs stay the product names. Laws explain *why*. Do not copy Yablonski’s write-ups; link each named law once per pattern.

## Rewrite contract

1. Heading: `### {existing title} — {Law} / {Law}` (third law only if co-equal).
2. Rewrite the top-level intro / pattern brief only. Rules, lists, stacking exceptions, and Storybook embeds stay unchanged.
3. Hub accordion labels stay short product names (`P7: Confirmation dialog`). Hub `pattern.body` stays 1–2 sentences.
4. Agent docs, Copilot, and `docs/locales/*` are deferred (explicit TODO in `docs/UX_PATTERNS.md`).

## UX headings and briefs

See the approved copy in the implementation plan. Clusters:

| Pattern | Laws |
|---|---|
| P1 Workspace | Jakob’s Law / Law of Common Region |
| P2 Data Table | Chunking / Miller’s Law |
| P3 Stateful Button | Zeigarnik Effect / Peak-End Rule |
| P4 Toast | Peak-End Rule / Selective Attention |
| P5 Modal | Cognitive Load / Law of Common Region |
| P6 Inline Validation | Postel’s Law / Working Memory |
| P7 Confirmation | Tesler’s Law / Hick’s Law |
| P8 Tab Navigation | Chunking / Zeigarnik Effect |
| P9 Filters | Hick’s Law / Choice Overload |
| P10 Sticky disclosure | Fitts’s Law / Selective Attention |

## UI headings and briefs

| Section | Laws |
|---|---|
| Internal-tool UX baseline | Cognitive Load / Occam’s Razor |
| 1. Buttons + feedback | Von Restorff Effect / Fitts’s Law |
| 2. Typography | Law of Similarity / Cognitive Load |
| 3. Forms + inputs | Law of Proximity / Postel’s Law |
| 4. Overlays + navigation | Law of Common Region / Cognitive Load |
| 5. Tables, filters, row actions | Chunking / Von Restorff Effect |

## Hub

- Brief bar on the four AI examples only. No bar on About or Storybook except the return-to strip after Open pattern docs.
- Columns: 40% interface / 60% patterns.
- Interface copy is how-to + basic flows. Pattern bodies name the same law clusters, kept short.
