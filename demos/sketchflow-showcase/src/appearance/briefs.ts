import type { PatternSummary } from '../runtime/types';
import type { ShowcaseLocale } from '../runtime/protocol';
import type { HubProject } from '../hub/catalog';

interface BriefCopy {
  summary: string;
  brief: string[];
  patternSummaries: PatternSummary[];
}

const MERGE_PATTERNS_DE: PatternSummary[] = [
  {
    id: 'P2 / P2.3',
    title: 'P2 / P2.3 — Datentabelle + Einzelauswahl',
    body: 'Zwei Tabellen, je eine Radio-Spalte (Chunking / Miller’s Law), damit Sie eine Datenbankzeile und einen Crawler-Treffer vor Merge halten.',
  },
  {
    id: 'P2.5 / P8',
    title: 'P2.5 / P8 — Aufklappbare Zeilen + Tabs',
    body: 'Klappen Sie eine Zeile in Cast / Staff / Locations-Tabs auf (Chunking / Zeigarnik Effect), ohne die Merge-Auswahl zu verlieren.',
  },
  {
    id: 'P5 / P6',
    title: 'P5 / P6 — Modal + Commit-Sperre',
    body: 'Merge öffnet ein Prüfmodal (Cognitive Load). Commit bleibt aus, bis ein Feld überschrieben ist (Postel’s Law).',
  },
  {
    id: 'P7',
    title: 'P7 — Bestätigungsdialog',
    body: 'Tesler’s Law / Hick’s Law — eine Zwei-Antwort-Bestätigung liegt auf dem Prüfmodal vor dem Commit, die einzige erlaubte Stapelung.',
  },
];

const MERGE_PATTERNS_SL: PatternSummary[] = [
  {
    id: 'P2 / P2.3',
    title: 'P2 / P2.3 — Podatkovna tabela + enojni izbor',
    body: 'Dve tabeli, po en radio (Chunking / Miller’s Law), da pred Merge držite vrstico baze in crawlerjev zadetek.',
  },
  {
    id: 'P2.5 / P8',
    title: 'P2.5 / P8 — Razširljive vrstice + zavihki',
    body: 'Razširite vrstico v zavihke Cast / Staff / Locations (Chunking / Zeigarnik Effect) brez izgube izbranih vrstic za Merge.',
  },
  {
    id: 'P5 / P6',
    title: 'P5 / P6 — Modal + zaklep potrditve',
    body: 'Merge odpre en pregledni modal (Cognitive Load). Potrditev ostane izklopljena, dokler ni preglasitev (Postel’s Law).',
  },
  {
    id: 'P7',
    title: 'P7 — Potrditveno okno',
    body: 'Tesler’s Law / Hick’s Law — dvoodgovorna potrditev se zloži na pregledni modal pred zapisom, edina dovoljena zložitev.',
  },
];

const MAPPING_PATTERNS_DE: PatternSummary[] = [
  {
    id: 'P2.2',
    title: 'P2.2 — Zeilenaktionen',
    body: 'Actions enthält Map und Unmap. Map ist der Zeilen-Commit; Unmap ist der getrennte Rückweg mit Bestätigung.',
  },
  {
    id: 'P3',
    title: 'P3 — Stateful Button',
    body: 'Zeigarnik Effect / Peak-End Rule — Map läuft idle → loading → success auf einem Control. Keine Bestätigung vor Map.',
  },
  {
    id: 'P9',
    title: 'P9 — Filter',
    body: 'Hick’s Law / Choice Overload — Genre- und Titelsuche über der Tabelle; Search wendet an, Clear all setzt zurück.',
  },
];

const MAPPING_PATTERNS_SL: PatternSummary[] = [
  {
    id: 'P2.2',
    title: 'P2.2 — Dejanja v vrstici',
    body: 'Actions vsebuje Map in Unmap. Map je potrditev vrstice; Unmap je ločen obrat s potrditvijo.',
  },
  {
    id: 'P3',
    title: 'P3 — Gumb s stanjem',
    body: 'Zeigarnik Effect / Peak-End Rule — Map teče idle → loading → success na enem kontrolniku. Pred Map ni potrditve.',
  },
  {
    id: 'P9',
    title: 'P9 — Filtri',
    body: 'Hick’s Law / Choice Overload — iskanje žanra in naslova nad tabelo; Search uveljavi, Clear all ponastavi.',
  },
];

const ROLE_DE: PatternSummary = {
  id: 'Role gating',
  title: 'Role gating — eingeschränktes Bearbeiten',
  body: 'Wechseln Sie den Prototyp-Benutzer in der Toolbar, um zu sehen, wie Rollen das Bearbeiten sensibler Daten einschränken. Move und Remove bleiben bei Operator verborgen.',
};

const ROLE_SL: PatternSummary = {
  id: 'Role gating',
  title: 'Role gating — omejeno urejanje',
  body: 'V orodni vrstici zamenjajte prototipnega uporabnika, da vidite, kako vloge omejijo urejanje občutljivih podatkov. Move in Remove ostaneta skrita, dokler je vloga Operator.',
};

const BRIEFS: Record<ShowcaseLocale, Record<string, BriefCopy>> = {
  en: {},
  de: {
    about: {
      summary:
        'Eine Sammlung von UX- und UI-Mustern aus echten Produktionsoberflächen, gezeigt in NDA-sicheren KI-Beispielen und dokumentiert in SketchFlowAI Patterns.',
      brief: [
        'Eine Sammlung von UX- und UI-Mustern aus echten Produktionsoberflächen, gezeigt in NDA-sicheren KI-Beispielen und dokumentiert in SketchFlowAI Patterns.',
      ],
      patternSummaries: [],
    },
    'merge-tool': {
      summary:
        'Wählen Sie einen Mock-Katalog, eine Datenbankzeile und einen Crawler-Treffer, dann Merge.',
      brief: [
        'Wählen Sie einen Mock-Katalog, eine Datenbankzeile und einen Crawler-Treffer, dann Merge.',
        'Prüfen Sie Feldüberschreibungen im Modal. Merge bleibt gesperrt, bis mindestens ein Feld überschrieben ist; dann bestätigen.',
      ],
      patternSummaries: MERGE_PATTERNS_DE,
    },
    mapping: {
      summary:
        'Wählen Sie einen Mock-Katalog. Ordnen Sie unsaubere interne Namen zeilenweise gecrawlten kanonischen Namen zu.',
      brief: [
        'Wählen Sie einen Mock-Katalog. Ordnen Sie unsaubere interne Namen zeilenweise gecrawlten kanonischen Namen zu.',
        'Suchen oder filtern, dann Map oder Unmap. Klappen Sie eine Zeile auf, um KI-Vorschläge zu bewerten; ein Vorschlag pro Entität.',
      ],
      patternSummaries: MAPPING_PATTERNS_DE,
    },
    'bracket-demo': {
      summary: 'Richten Sie ein Turnier-Bracket ein, dann bearbeiten Sie Matches auf der Canvas.',
      brief: [
        'Richten Sie ein Turnier-Bracket ein, dann bearbeiten Sie Matches auf der Canvas.',
        'Öffnen Sie Setup und Match-Editoren in Modals. Bestätigen Sie vor zerstörenden oder Commit-Aktionen. Wechseln Sie den Prototyp-Benutzer in der Toolbar für rollen-gesteuerte Team-Edits.',
      ],
      patternSummaries: [
        {
          id: 'P5',
          title: 'P5 — Modal',
          body: 'Cognitive Load / Law of Common Region — Setup und Match-Bearbeitung öffnen in einem Modal, damit die Canvas die Hauptansicht bleibt.',
        },
        {
          id: 'P7',
          title: 'P7 — Bestätigungsdialog',
          body: 'Tesler’s Law / Hick’s Law — bestätigen Sie zerstörende oder Commit-Aktionen, bevor sie gelten.',
        },
        ROLE_DE,
      ],
    },
    'tournament-management': {
      summary:
        'Filtern Sie die Sidebar, wählen Sie ein Turnier-Blatt und bearbeiten Sie es in der Hauptansicht.',
      brief: [
        'Filtern Sie die Sidebar, wählen Sie ein Turnier-Blatt und bearbeiten Sie es in der Hauptansicht.',
        'Clear all setzt den Baum zurück. Wechseln Sie den Prototyp-Benutzer in der Toolbar, um Move und Remove freizuschalten.',
      ],
      patternSummaries: [
        {
          id: 'P1',
          title: 'P1 — Workspace',
          body: 'Jakob’s Law / Law of Common Region — Identitätsleiste, Filterzeile, Sidebar-Baum, Hauptkarte.',
        },
        {
          id: 'P9',
          title: 'P9 — Filter',
          body: 'Hick’s Law / Choice Overload — Filter steuern den Baum; Löschen setzt die Auswahl zurück.',
        },
        ROLE_DE,
      ],
    },
    'low-fi-ux-ui-patterns': {
      summary:
        'Storybook-Dokumentation des Low-Fidelity-Designsystems und der Muster in diesen Prototyp-Projekten.',
      brief: [
        'Storybook-Dokumentation des Low-Fidelity-Designsystems und der Muster in diesen Prototyp-Projekten.',
        'Lo-fi-UX-Tests drehen sich um Struktur und Verhalten; High-Fidelity-Farbe und Branding sind noch nicht das Thema.',
        'Dieselben Flows können später mit einem High-Fidelity-Designsystem neu gestylt werden, damit die Arbeit designsystem-agnostisch bleibt.',
      ],
      patternSummaries: [],
    },
  },
  sl: {
    about: {
      summary:
        'Zbirka UX in UI vzorcev iz resničnih produkcijskih vmesnikov, prikazana v NDA-varnih primerih UI in dokumentirana v SketchFlowAI Patterns.',
      brief: [
        'Zbirka UX in UI vzorcev iz resničnih produkcijskih vmesnikov, prikazana v NDA-varnih primerih UI in dokumentirana v SketchFlowAI Patterns.',
      ],
      patternSummaries: [],
    },
    'merge-tool': {
      summary:
        'Izberite mock katalog, eno vrstico baze in crawlerjev zadetek, nato Merge.',
      brief: [
        'Izberite mock katalog, eno vrstico baze in crawlerjev zadetek, nato Merge.',
        'Preglejte preglasitve polj v modalu. Merge ostane onemogočen, dokler ni preglaseno vsaj eno polje; nato potrdite.',
      ],
      patternSummaries: MERGE_PATTERNS_SL,
    },
    mapping: {
      summary:
        'Izberite mock katalog. Vrstico za vrstico preslikajte neurejena interna imena na crawled kanonična imena.',
      brief: [
        'Izberite mock katalog. Vrstico za vrstico preslikajte neurejena interna imena na crawled kanonična imena.',
        'Iščite ali filtrirajte, nato Map ali Unmap. Razširite vrstico za rangiranje predlogov UI; en predlog na entiteto.',
      ],
      patternSummaries: MAPPING_PATTERNS_SL,
    },
    'bracket-demo': {
      summary: 'Nastavite turnirski ključ, nato urejajte tekme na platnu.',
      brief: [
        'Nastavite turnirski ključ, nato urejajte tekme na platnu.',
        'Odprite nastavitev in urejevalnike tekem v modalu. Potrdite pred uničevalnimi ali potrditvenimi dejanji. V orodni vrstici zamenjajte prototipnega uporabnika za urejanje po vlogah.',
      ],
      patternSummaries: [
        {
          id: 'P5',
          title: 'P5 — Modal',
          body: 'Cognitive Load / Law of Common Region — nastavitev in urejanje tekem se odpreta v modalu, da platno ostane glavni pogled.',
        },
        {
          id: 'P7',
          title: 'P7 — Potrditveno okno',
          body: 'Tesler’s Law / Hick’s Law — pred uveljavitvijo potrdite uničevalna ali potrditvena dejanja.',
        },
        ROLE_SL,
      ],
    },
    'tournament-management': {
      summary:
        'Filtrirajte stransko vrstico, izberite list turnirja in ga uredite v glavnem podoknu.',
      brief: [
        'Filtrirajte stransko vrstico, izberite list turnirja in ga uredite v glavnem podoknu.',
        'Clear all ponastavi drevo. V orodni vrstici zamenjajte prototipnega uporabnika, da odklenete Move in Remove.',
      ],
      patternSummaries: [
        {
          id: 'P1',
          title: 'P1 — Delovni prostor',
          body: 'Jakob’s Law / Law of Common Region — identitetna vrstica, vrstica filtrov, drevo v stranski vrstici, glavna kartica.',
        },
        {
          id: 'P9',
          title: 'P9 — Filtri',
          body: 'Hick’s Law / Choice Overload — filtri krmilijo drevo; brisanje ponastavi izbor.',
        },
        ROLE_SL,
      ],
    },
    'low-fi-ux-ui-patterns': {
      summary:
        'Storybook dokumentacija nizko-zvestobnega oblikovalskega sistema in vzorcev v teh prototipih.',
      brief: [
        'Storybook dokumentacija nizko-zvestobnega oblikovalskega sistema in vzorcev v teh prototipih.',
        'Lo-fi UX preizkusi so o strukturi in vedenju; visoko-zvestobna barva in znamka še niso tema.',
        'Iste tokove je mogoče pozneje preoblikovati z visoko-zvestobnim oblikovalskim sistemom, da delo ostane neodvisno od sistema.',
      ],
      patternSummaries: [],
    },
  },
};

export function localizedProject(project: HubProject, locale: ShowcaseLocale): HubProject {
  const copy = BRIEFS[locale][project.slug];
  if (!copy) return project;
  return {
    ...project,
    summary: copy.summary,
    brief: copy.brief,
    patternSummaries: copy.patternSummaries,
  };
}
