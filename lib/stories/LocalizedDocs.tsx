import { Markdown } from '@storybook/addon-docs/blocks';
import type { ModuleExports } from 'storybook/internal/types';
import { useDocLocale } from './docLocale';
import { docMarkdown } from './docMarkdown';
import { PatternStoriesDoc } from './PatternStoriesDoc';
import { UiPatternsWithStoryEmbeds } from './UiPatternsWithStoryEmbeds';
import { UxPatternsWithStoryEmbeds } from './UxPatternsWithStoryEmbeds';

const INTRO: Record<string, string> = {
  en: `# SketchFlowAI Patterns

**SketchFlowAI Patterns** is the UX pattern library for SketchFlowAI — a living inventory of interaction behaviours, interface flows, and composition rules for operator interfaces.

## Two separate things

This Storybook presents **two distinct artefacts** that work together but are not the same:

### 1. SketchFlowAI Patterns (core)

The **patterns** — the interaction pattern inventory and the workspace composition model — are the **core artefact**. They define how interfaces should behave, how screens are structured, and which interaction conventions apply across operator tools.

Patterns are independent of any specific component library. They were originally crafted during professional work at Sportradar and are published here as standalone SketchFlowAI patterns — not a lo-fi equivalent of any vendor design system. Future production implementations use a **High Fidelity Design System**.

### 2. LOFI Kit (tool)

**LOFI Kit** is a low-fidelity design tool — grayscale, monospace, used to render live pattern examples. It is not the production design system.

## Lo-fidelity UX testing

Lo-fi renders keep pattern examples abstract so reviewers focus on structure and interaction flow.
`,
  de: `# SketchFlowAI Patterns

**SketchFlowAI Patterns** ist die UX-Musterbibliothek für SketchFlowAI — ein lebendiges Inventar von Interaktionsverhalten, Interface-Flows und Kompositionsregeln.

## Zwei getrennte Dinge

Dieses Storybook zeigt **zwei unterschiedliche Artefakte**:

### 1. SketchFlowAI Patterns (Kern)

Die **Muster** definieren Verhalten, Bildschirmstruktur und Konventionen. Sie sind unabhängig von einer konkreten Komponentenbibliothek. Sie entstanden während der beruflichen Arbeit bei Sportradar und werden hier als eigenständige SketchFlowAI-Muster veröffentlicht — nicht als Lo-Fi-Äquivalent eines Hersteller-Designsystems. Künftige Produktionsumsetzungen nutzen ein **High Fidelity Design System**.

### 2. LOFI Kit (Werkzeug)

**LOFI Kit** ist ein Low-Fidelity-Werkzeug — graustufig, Monospace — für Live-Beispiele. Es ist nicht das Produktions-Designsystem.

## Lo-fi-UX-Tests

Lo-fi hält Beispiele abstrakt, damit die Diskussion bei Struktur und Interaktion bleibt.
`,
  sl: `# SketchFlowAI Patterns

**SketchFlowAI Patterns** je knjižnica UX vzorcev za SketchFlowAI — živ inventar vedenj, tokov in pravil sestave.

## Dve ločeni stvari

Ta Storybook prikazuje **dva različna artefakta**:

### 1. SketchFlowAI Patterns (jedro)

**Vzorci** določajo vedenje, zgradbo zaslonov in konvencije. Neodvisni so od konkretne knjižnice komponent. Nastali so med poklicnim delom pri Sportradarju in so tu objavljeni kot samostojni vzorci SketchFlowAI — ne kot lo-fi ustreznica katerega koli proizvajalčevega oblikovalskega sistema. Prihodnje produkcijske izvedbe uporabljajo **High Fidelity Design System**.

### 2. LOFI Kit (orodje)

**LOFI Kit** je nizko-zvestobno orodje — sivine, monospace — za žive primere. Ni produkcijski oblikovalski sistem.

## Lo-fi UX preizkusi

Lo-fi ohrani primere abstraktne, da se razprava osredotoči na strukturo in interakcijo.
`,
};

export function LocalizedIntroduction() {
  const locale = useDocLocale();
  return <Markdown>{INTRO[locale] ?? INTRO.en}</Markdown>;
}

export function LocalizedUxPatterns({ storiesModule }: { storiesModule: ModuleExports }) {
  const locale = useDocLocale();
  return (
    <UxPatternsWithStoryEmbeds markdown={docMarkdown(locale, 'UX_PATTERNS')} storiesModule={storiesModule} />
  );
}

export function LocalizedUiPatterns({ storiesModule }: { storiesModule: ModuleExports }) {
  const locale = useDocLocale();
  return (
    <UiPatternsWithStoryEmbeds markdown={docMarkdown(locale, 'UI_PATTERNS')} storiesModule={storiesModule} />
  );
}

export function LocalizedPatternStories() {
  const locale = useDocLocale();
  return <PatternStoriesDoc markdown={docMarkdown(locale, 'UX_PATTERN_STORIES')} />;
}

export function LocalizedLofiKit() {
  const locale = useDocLocale();
  return <Markdown>{docMarkdown(locale, 'LOFI_KIT_PATTERNS')}</Markdown>;
}

const SET_OVERVIEW: Record<string, string> = {
  en: `# Component sets

A **component set** is a JSON-serialisable group of LOFI primitives with a host layout and action roles. Primitives stay unchanged. Sets encode the recipes demos used to assemble by hand.

**UX** decides *where* the cluster lives and *when* it appears. **UI** decides *rank / color* of each action. The set stores both: LOFI \`variant\` for the prototype, \`uiColor\` / \`uiRank\` for the hi-fi pass.

Open each kind in the sidebar. Every Docs page has what the set is, which primitives it composes, the demo it was derived from, and copy-paste usage.

Source of truth: \`lib/src/sets/examples.ts\`. Renderer: \`LOFIComponentSet\`. Primitive names (Button, Modal) stay in English.
`,
  de: `# Komponentensets

Ein **Komponentenset** ist eine JSON-serialisierbare Gruppe von LOFI-Primitiven mit Host-Layout und Aktionsrollen. Primitive bleiben unverändert.

**UX** entscheidet, *wo* der Cluster lebt und *wann* er erscheint. **UI** entscheidet *Rang / Farbe* jeder Aktion. Das Set speichert beides: LOFI-\`variant\` für den Prototyp, \`uiColor\` / \`uiRank\` für den Hi-Fi-Schritt.

Jedes Kind in der Sidebar: Was das Set ist, welche Primitive es zusammensetzt, Demo-Quelle und Copy-Paste-Nutzung.

Quelle: \`lib/src/sets/examples.ts\`. Renderer: \`LOFIComponentSet\`. Primitive-Namen (Button, Modal) bleiben englisch.
`,
  sl: `# Nabori komponent

**Nabor komponent** je JSON-serializirljiva skupina LOFI primitivov z gostiteljsko postavitvijo in vlogami dejanj. Primitivi ostanejo nespremenjeni.

**UX** določa, *kje* grozd živi in *kdaj* se pojavi. **UI** določa *rang / barvo* vsakega dejanja. Nabor hrani oboje: LOFI \`variant\` za prototip, \`uiColor\` / \`uiRank\` za hi-fi.

Vsak kind v stranski vrstici: kaj nabor je, katere primitive sestavlja, izvorni demo in uporaba za kopiranje.

Vir: \`lib/src/sets/examples.ts\`. Izris: \`LOFIComponentSet\`. Imena primitivov (Button, Modal) ostanejo angleška.
`,
};

const PRIMITIVES_OVERVIEW: Record<string, string> = {
  en: `# Primitives

**Primitives** are the atomic LOFI Kit controls — one BEM block each, grayscale, monospace, no colour. Demos and **component sets** compose these; they do not replace them.

Each primitive has its own Docs page with interactive controls. Prefer the set when the same cluster repeats (footer, filter row, P7). Use the primitive when you need a single control.
`,
  de: `# Primitives

**Primitives** sind die atomaren LOFI-Kit-Steuerelemente — je ein BEM-Block, graustufig, Monospace, ohne Farbe. Demos und **Komponentensets** setzen sie zusammen; sie ersetzen sie nicht.

Jede Primitive hat eine eigene Docs-Seite. Das Set, wenn sich ein Cluster wiederholt (Footer, Filterzeile, P7). Die Primitive, wenn ein einzelnes Control nötig ist.
`,
  sl: `# Primitives

**Primitivi** so atomarni LOFI Kit kontrolniki — po en BEM blok, sivine, monospace, brez barve. Demoti in **nabori komponent** jih sestavljajo; ne zamenjujejo jih.

Vsak primitiv ima svojo Docs stran. Nabor, ko se grozd ponavlja (noga, vrstica filtra, P7). Primitiv, ko potrebujete en kontrolnik.
`,
};

export function LocalizedSetOverview() {
  const locale = useDocLocale();
  return <Markdown>{SET_OVERVIEW[locale] ?? SET_OVERVIEW.en}</Markdown>;
}

export function LocalizedPrimitivesOverview() {
  const locale = useDocLocale();
  return <Markdown>{PRIMITIVES_OVERVIEW[locale] ?? PRIMITIVES_OVERVIEW.en}</Markdown>;
}
