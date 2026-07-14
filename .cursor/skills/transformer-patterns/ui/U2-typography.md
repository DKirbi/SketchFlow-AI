# U2 — Typography

## Related patterns

- Table cell text density: **U5** (Tables, filters, row actions).
- P7 dialog title/message sizes: **U4** (Overlays + navigation).

---

## Rules

38. Set default body copy to **`PdsFontSize` `700`** (~16px) for all internal-tool paragraphs.
39. Keep routine body/interface text in **`500`–`900`**; treat **`1100`+** as hero/display — **rare** in internal tools.
40. Map roles: `body` → paragraphs; `interface` → labels/metadata; `table` → cells; `eyebrow` → tiny section kicker, **sparing**; `monospace` → IDs/codes only.
41. In dense tables allow cell text at `600`; headers **`600`–`700`**; **never** body **below `500`**.
42. Use **`strong` weight** for **single-token** emphasis — carry hierarchy with **size**, not whole-paragraph bold.

---

## Common mistakes (U2)

- ❌ Using body text below `500` size for internal tools — minimum `500` for legibility (U2.41).
- ❌ Bolding entire paragraphs — carry hierarchy with size, not weight (U2.42).
- ❌ Using `1100+` font sizes in internal tools — reserve for hero contexts (U2.39).
