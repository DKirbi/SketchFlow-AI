import type { ShowcaseLocale } from '../runtime/protocol';

export interface ChromeCopy {
  navLabel: string;
  expandSidebar: string;
  collapseSidebar: string;
  railBrand: string;
  brandTitle: string;
  brandSubtitle: string;
  briefLabel: string;
  showMore: string;
  showLess: string;
  openPatternDocs: string;
  dismiss: string;
  getBackTo: (title: string) => string;
  openedFrom: (title: string) => string;
  storybookCrumbLabel: string;
  storybookCrumb: string;
  disclaimerTitle: string;
  disclaimerBody: string;
  disclaimerProceed: string;
  disclaimerHome: string;
  navGroups: Record<string, string>;
}

const EN: ChromeCopy = {
  navLabel: 'Showcase navigation',
  expandSidebar: 'Expand sidebar',
  collapseSidebar: 'Collapse sidebar',
  railBrand: 'SketchflowAI Showcase',
  brandTitle: 'SketchFlowAI',
  brandSubtitle: 'Showcase',
  briefLabel: 'Project brief',
  showMore: 'Show more',
  showLess: 'Show less',
  openPatternDocs: 'Open pattern docs',
  dismiss: 'Dismiss',
  getBackTo: (title) => `Get back to ${title}`,
  openedFrom: (title) => `Pattern documentation opened from ${title}.`,
  storybookCrumbLabel: 'AI Showcase breadcrumb',
  storybookCrumb: 'AI Showcase',
  disclaimerTitle: 'Showcase of AI Examples works best on Desktop',
  disclaimerBody:
    'Showcase contains a lot of AI Examples featuring corporate desktop applications, which were originally meant for desktop interfaces. There are no current mobile showcases available yet.',
  disclaimerProceed: 'Proceed in Desktop view',
  disclaimerHome: 'Go back home',
  navGroups: {
    introduction: 'Introduction',
    'ux-patterns': 'UX Patterns',
    'ui-patterns': 'UI Patterns',
    'low-fi-design-system': 'LOW FI Design system',
    'lofi-kit-docs': 'LOFI Kit',
    'lofi-primitives': 'Primitives',
    'lofi-primitives-overview': 'Overview',
    'lofi-component-sets': 'Component sets',
    'lofi-sets-overview': 'Overview',
    'lofi-diagram': 'Diagram',
    'lofi-diagram-canvas': 'Canvas',
    patterns: 'PATTERNS',
  },
};

const DE: ChromeCopy = {
  navLabel: 'Showcase-Navigation',
  expandSidebar: 'Seitenleiste öffnen',
  collapseSidebar: 'Seitenleiste schließen',
  railBrand: 'SketchflowAI Showcase',
  brandTitle: 'SketchFlowAI',
  brandSubtitle: 'Showcase',
  briefLabel: 'Projektkurzinfo',
  showMore: 'Mehr anzeigen',
  showLess: 'Weniger anzeigen',
  openPatternDocs: 'Musterdokumentation öffnen',
  dismiss: 'Schließen',
  getBackTo: (title) => `Zurück zu ${title}`,
  openedFrom: (title) => `Musterdokumentation geöffnet von ${title}.`,
  storybookCrumbLabel: 'AI Showcase-Pfad',
  storybookCrumb: 'AI Showcase',
  disclaimerTitle: 'Showcase der KI-Beispiele funktioniert am besten am Desktop',
  disclaimerBody:
    'Der Showcase enthält viele KI-Beispiele für betriebliche Desktop-Anwendungen, die für Desktop-Oberflächen gedacht sind. Mobile Showcases gibt es derzeit noch nicht.',
  disclaimerProceed: 'In Desktop-Ansicht fortfahren',
  disclaimerHome: 'Zurück zur Startseite',
  navGroups: {
    introduction: 'Einführung',
    'ux-patterns': 'UX-Muster',
    'ui-patterns': 'UI-Muster',
    'low-fi-design-system': 'LOW-FI-Designsystem',
    'lofi-kit-docs': 'LOFI Kit',
    'lofi-primitives': 'Primitives',
    'lofi-primitives-overview': 'Überblick',
    'lofi-component-sets': 'Komponentensets',
    'lofi-sets-overview': 'Überblick',
    'lofi-diagram': 'Diagramm',
    'lofi-diagram-canvas': 'Canvas',
    patterns: 'MUSTER',
  },
};

const SL: ChromeCopy = {
  navLabel: 'Navigacija predstavitve',
  expandSidebar: 'Razširi stransko vrstico',
  collapseSidebar: 'Strni stransko vrstico',
  railBrand: 'SketchflowAI Showcase',
  brandTitle: 'SketchFlowAI',
  brandSubtitle: 'Showcase',
  briefLabel: 'Kratek opis projekta',
  showMore: 'Prikaži več',
  showLess: 'Prikaži manj',
  openPatternDocs: 'Odpri dokumentacijo vzorcev',
  dismiss: 'Zapri',
  getBackTo: (title) => `Nazaj na ${title}`,
  openedFrom: (title) => `Dokumentacija vzorcev odprta iz ${title}.`,
  storybookCrumbLabel: 'Sled AI Showcase',
  storybookCrumb: 'AI Showcase',
  disclaimerTitle: 'Predstavitev primerov UI najbolje deluje na namizju',
  disclaimerBody:
    'Predstavitev vsebuje veliko primerov UI za korporativne namizne aplikacije, ki so bile zasnovane za namizne vmesnike. Mobilnih predstavitev trenutno še ni.',
  disclaimerProceed: 'Nadaljuj v namiznem pogledu',
  disclaimerHome: 'Nazaj na začetek',
  navGroups: {
    introduction: 'Uvod',
    'ux-patterns': 'UX vzorci',
    'ui-patterns': 'UI vzorci',
    'low-fi-design-system': 'LOW FI oblikovalski sistem',
    'lofi-kit-docs': 'LOFI Kit',
    'lofi-primitives': 'Primitives',
    'lofi-primitives-overview': 'Pregled',
    'lofi-component-sets': 'Nabori komponent',
    'lofi-sets-overview': 'Pregled',
    'lofi-diagram': 'Diagram',
    'lofi-diagram-canvas': 'Canvas',
    patterns: 'VZORCI',
  },
};

export const CHROME: Record<ShowcaseLocale, ChromeCopy> = { en: EN, de: DE, sl: SL };
