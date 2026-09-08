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
    body: 'Die Datenbank- und Crawler-Tabellen nutzen jeweils eine Radio-Spalte, damit vor dem Merge genau eine Zeile pro Tabelle gewählt ist.',
  },
  {
    id: 'P2.5 / P8',
    title: 'P2.5 / P8 — Aufklappbare Zeilen + Tabs',
    body: 'Zeilen klappen (Chevron oder „…" neben Top Cast) in eine Tab-Ansicht Cast / Staff / Filming Locations auf, unabhängig von der Zeilenauswahl.',
  },
  {
    id: 'P5 / P6',
    title: 'P5 / P6 — Modal + Commit-Sperre',
    body: 'Merge öffnet ein Prüfmodal, das den behaltenen Datensatz mit dem Crawler-Treffer vergleicht; Merge bleibt gesperrt, bis mindestens ein Feld überschrieben ist.',
  },
  {
    id: 'P7',
    title: 'P7 — Bestätigungsdialog',
    body: 'Vor dem Commit liegt ein reines Bestätigungs-Overlay auf dem Prüfmodal — die einzige erlaubte Modal-Stapelung.',
  },
];

const MERGE_PATTERNS_SL: PatternSummary[] = [
  {
    id: 'P2 / P2.3',
    title: 'P2 / P2.3 — Podatkovna tabela + enojni izbor',
    body: 'Tabeli baze in crawlerja uporabljata stolpec z radio gumbi, da je pred združitvijo izbrana natanko ena vrstica na tabelo.',
  },
  {
    id: 'P2.5 / P8',
    title: 'P2.5 / P8 — Razširljive vrstice + zavihki',
    body: 'Vrstice se razširijo (chevron ali »…« ob Top Cast) v zavihe Cast / Staff / Filming Locations, neodvisno od izbora vrstice.',
  },
  {
    id: 'P5 / P6',
    title: 'P5 / P6 — Modal + zaklep potrditve',
    body: 'Merge odpre pregledni modal, ki primerja ohranjeni zapis s crawlerjevim zadetkom; dejanje Merge ostane onemogočeno, dokler ni preglaseno vsaj eno polje.',
  },
  {
    id: 'P7',
    title: 'P7 — Potrditveno okno',
    body: 'Pred zapisom se nad preglednim modalom odpre samo potrditveni sloj — edina dovoljena zložitev modalov.',
  },
];

const MAPPING_PATTERNS_DE: PatternSummary[] = [
  {
    id: 'P2.2',
    title: 'P2.2 — Zeilenaktionen',
    body: 'Die Spalte Actions enthält Map und Unmap. Map ist eine kompakte zustandsbehaftete Steuerung; Unmap ist eine separate Dismiss-Aktion mit Inline-Bestätigung vor dem Entfernen.',
  },
  {
    id: 'P3',
    title: 'P3 — Stateful Button',
    body: 'Asynchrones Map in der Zeile läuft idle → loading → success auf einem Control. Kein Bestätigungsdialog vor Map — der Button-Zustand ist das Feedback.',
  },
  {
    id: 'P9',
    title: 'P9 — Filter',
    body: 'Genre- und Titelsuche sitzen über der Tabelle. Search übernimmt die Kriterien; Clear all setzt den abhängigen Tabelleninhalt zurück.',
  },
];

const MAPPING_PATTERNS_SL: PatternSummary[] = [
  {
    id: 'P2.2',
    title: 'P2.2 — Dejanja v vrstici',
    body: 'Stolpec Actions vsebuje Map in Unmap. Map je strnjen gumb s stanjem; Unmap je ločeno dismiss dejanje z inline potrditvijo pred odstranitvijo.',
  },
  {
    id: 'P3',
    title: 'P3 — Gumb s stanjem',
    body: 'Asinhroni Map v vrstici teče idle → loading → success na enem kontrolniku. Pred Map ni potrditvenega okna — stanje gumba je povratna informacija.',
  },
  {
    id: 'P9',
    title: 'P9 — Filtri',
    body: 'Filtra žanra in naslova sta nad tabelo. Search uveljavi merila; Clear all ponastavi odvisno vsebino tabele.',
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
        'Gleicht zwei Datensätze derselben Entität ab, lässt Felder überschreiben und schreibt das Ergebnis in die Datenbank.',
      brief: [
        'Gleicht zwei Datensätze derselben Entität ab, lässt Felder überschreiben und schreibt das Ergebnis in die Datenbank.',
        'Wählen Sie in der Toolbar einen Mock-Katalog (Filmkatalog oder Wizarding World). Mock-Kataloge schützen echte Sportdaten.',
        'Wählen Sie eine Datenbankzeile und einen Crawler-Treffer, dann Merge. Das Prüfmodal bleibt gesperrt, bis mindestens ein Feld überschrieben ist.',
      ],
      patternSummaries: MERGE_PATTERNS_DE,
    },
    mapping: {
      summary:
        'Ordnet unsaubere oder veraltete interne Namen zeilenweise neu gecrawlten kanonischen Namen zu. Das ist die Operator-Arbeit, Katalogwerte abzugleichen.',
      brief: [
        'Ordnet unsaubere oder veraltete interne Namen zeilenweise neu gecrawlten kanonischen Namen zu. Das ist die Operator-Arbeit, Katalogwerte abzugleichen.',
        'Wählen Sie in der Toolbar einen Mock-Katalog (Filmkatalog oder Wizarding World). Mock-Kataloge schützen echte Sportdaten.',
        'Wählen Sie Zeilen für Bulk-Map. Mit Map / Unmap pflegen Sie einzelne Einträge.',
        'Klappen Sie eine Zeile auf, um KI-Vorschläge zu bewerten. Pro Entität wird ein Vorschlag gemappt.',
      ],
      patternSummaries: MAPPING_PATTERNS_DE,
    },
    'bracket-demo': {
      summary:
        'Ein Bracket-Builder dafür, wie Matches über Pairing, Byes und Verbindungsregeln verbunden sind und fortschreiten.',
      brief: [
        'Ein Bracket-Builder dafür, wie Matches verbunden sind und fortschreiten.',
        'Er soll robuste, komplexe Fälle belasten: Pairing, Byes, Progression-Kanten und die unterschiedlichen Verbindungsregeln der Bracket-Systeme.',
        'Wechseln Sie den Prototyp-Benutzer in der Toolbar (Team Management), um zu sehen, wie Rollen das Bearbeiten sensibler Teamdaten einschränken.',
      ],
      patternSummaries: [
        {
          id: 'P5',
          title: 'P5 — Modal',
          body: 'Bracket-Setup und Match-Bearbeitung öffnen in einem Modal, damit die Canvas die bleibende Hauptansicht bleibt.',
        },
        {
          id: 'P7',
          title: 'P7 — Bestätigungsdialog',
          body: 'Zerstörende oder Commit-Aktionen am Bracket fragen vor dem Anwenden nach einem reinen Bestätigungs-Overlay.',
        },
        ROLE_DE,
      ],
    },
    'tournament-management': {
      summary:
        'Große verschachtelte Hierarchien in einem UPL-Workspace zum Navigieren und Pflegen von Sport- und Turnier-Entitäten.',
      brief: [
        'Management-Test für große verschachtelte Hierarchien (Sportarten, Turniere und verwandte Entitäten) in einem UPL-Workspace, um zu sehen, wie Operatoren diese Skala navigieren und pflegen könnten.',
        'Wechseln Sie den Prototyp-Benutzer in der Toolbar, um zu sehen, wie Rollen die Nutzung beeinflussen. Operator darf Move oder Remove bei sensiblen Datensätzen nicht; Rollenwechsel schaltet die Aktionen frei.',
      ],
      patternSummaries: [
        {
          id: 'P1',
          title: 'P1 — Workspace',
          body: 'Ein UPL-Workspace mit minifizierter Tool-Identity-Leiste, Filterzeile, einklappbarem Sidebar-Baum und persistenter Hauptansicht auf einer eigenen Karte.',
        },
        {
          id: 'P9',
          title: 'P9 — Filter',
          body: 'Suche und Filter steuern den Sidebar-Baum. Filter löschen setzt abhängigen Auswahlzustand zurück.',
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
        'Uskladi dva zapisa iste entitete, omogoči preglasitev polj in rezultat zapiše v bazo.',
      brief: [
        'Uskladi dva zapisa iste entitete, omogoči preglasitev polj in rezultat zapiše v bazo.',
        'V orodni vrstici izberite mock katalog (filmski katalog ali Wizarding World). Mock katalogi ščitijo prave športne podatke.',
        'Izberite vrstico baze in crawlerjev zadetek, nato Merge. Pregledni modal ostane zaklenjen, dokler ni preglaseno vsaj eno polje.',
      ],
      patternSummaries: MERGE_PATTERNS_SL,
    },
    mapping: {
      summary:
        'Vrstico za vrstico preslika neurejena ali zastarela interna imena na sveže crawled kanonična imena. To je operatorsko usklajevanje vrednosti kataloga.',
      brief: [
        'Vrstico za vrstico preslika neurejena ali zastarela interna imena na sveže crawled kanonična imena. To je operatorsko usklajevanje vrednosti kataloga.',
        'V orodni vrstici izberite mock katalog (filmski katalog ali Wizarding World). Mock katalogi ščitijo prave športne podatke.',
        'Izberite vrstice za skupinski Map. Z Map / Unmap upravljate posamezne vnose.',
        'Razširite vrstico za rangiranje predlogov UI. Na entiteto se preslika en predlog.',
      ],
      patternSummaries: MAPPING_PATTERNS_SL,
    },
    'bracket-demo': {
      summary:
        'Graditelj ključev za to, kako so tekme povezane in napredujejo prek pairinga, byejev in pravil povezav.',
      brief: [
        'Graditelj ključev za to, kako so tekme povezane in napredujejo.',
        'Namenjen je obremenitvi robustnih, kompleksnih primerov: pairing, byeji, povezave napredovanja in različna pravila povezav med sistemi ključev.',
        'V orodni vrstici (Team Management) zamenjajte prototipnega uporabnika, da vidite, kako vloge omejijo urejanje občutljivih podatkov ekipe.',
      ],
      patternSummaries: [
        {
          id: 'P5',
          title: 'P5 — Modal',
          body: 'Nastavitev ključa in urejanje tekem se odpreta v modalu, da platno ostane stalni glavni pogled.',
        },
        {
          id: 'P7',
          title: 'P7 — Potrditveno okno',
          body: 'Uničevalna ali potrditvena dejanja na ključu pred uveljavitvijo zahtevajo samo potrditveni sloj.',
        },
        ROLE_SL,
      ],
    },
    'tournament-management': {
      summary:
        'Velike vgnezdene hierarhije v UPL delovnem prostoru za navigacijo in vzdrževanje športnih in turnirskih entitet.',
      brief: [
        'Preizkus upravljanja velikih vgnezdenih hierarhij (športi, turnirji in povezane entitete) v UPL delovnem prostoru, da vidimo, kako bi operatorji to skalo navigirali in vzdrževali.',
        'V orodni vrstici zamenjajte prototipnega uporabnika, da vidite, kako vloge vplivajo na rabo. Operator ne more Move ali Remove občutljivih zapisov; zamenjava vloge dejanja odklene.',
      ],
      patternSummaries: [
        {
          id: 'P1',
          title: 'P1 — Delovni prostor',
          body: 'UPL delovni prostor z zmanjšano identitetno vrstico orodja, vrstico filtrov, zložljivim drevesom v stranski vrstici in trajnim glavnim pogledom na lastni kartici.',
        },
        {
          id: 'P9',
          title: 'P9 — Filtri',
          body: 'Iskanje in filtri krmilijo drevo v stranski vrstici. Brisanje filtrov ponastavi odvisno stanje izbora.',
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
