# Contributing

## Add A LoFi Primitive

1. Create `lib/src/ui/<Name>/<Name>.tsx` and `<Name>.scss`.
2. Import tokens with `@use '../../styles/tokens' as *;`.
3. Use BEM class names.
4. Export from `lib/src/ui/index.ts` with a `LOFI` prefix.
5. Update `docs/LOFI_BLOCKS.md` and `docs/LOFI_KIT_PATTERNS.md`.
6. Run `npm run build:lofi`.

## Add A Demo

1. Create `demos/<slug>/`.
2. Add `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`, and `src/main.tsx`.
3. Use `lofi-kit` only for LoFi UI.
4. Run `npm run dev` and confirm the hub discovers it.

## Change UX Patterns

Use `/new-pattern` or `@ux-pattern-authoring`. Update canonical docs, agent docs, Cursor rules/skills, and Copilot instructions together. Run `npm run ux-patterns:check`.

## Verification

```bash
npm run ux-patterns:check
npm run test:all
npm run lint
npm run demo-build
```
