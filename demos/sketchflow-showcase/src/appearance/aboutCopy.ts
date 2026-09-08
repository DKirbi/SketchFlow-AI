import type { ShowcaseLocale } from '../runtime/protocol';

export interface AboutSection {
  heading: string;
  paragraphs: string[];
}

export interface AboutCopy {
  sections: AboutSection[];
}

const EN: AboutCopy = {
  sections: [
    {
      heading: 'What is SketchFlowAI',
      paragraphs: [
        'SketchFlowAI is a collection of UX and UI patterns that were used in real production user interfaces. These patterns describe how we defined our interfaces, why they are structured that way, and how users work with them.',
        'This site is not a production product UI. It is the place those patterns are shown and documented.',
      ],
    },
    {
      heading: 'What these AI examples are',
      paragraphs: [
        'Each sidebar item after About is an AI reconstruction of a real production interface that uses that pattern collection. The data and the general high-fidelity look were changed so the work can be shown without breaking NDA.',
        'What is kept is the UX flow logic: how the operator moves through the task, and how the patterns describe that behaviour.',
      ],
    },
    {
      heading: 'Patterns',
      paragraphs: [
        'SketchFlowAI Patterns, below the line in the sidebar, is the documentation of that collection (P1–P10 and related UI rules). It is not another example interface.',
      ],
    },
    {
      heading: 'The information band',
      paragraphs: [
        'On every example, the notification-style band under the interface is extra context for that prototype: what it is for, how to use it, and which patterns from the collection it demonstrates.',
        'Use Show more and the pattern accordions there. That band is not part of the prototype itself.',
      ],
    },
  ],
};

const DE: AboutCopy = {
  sections: [
    {
      heading: 'Was ist SketchFlowAI',
      paragraphs: [
        'SketchFlowAI ist eine Sammlung von UX- und UI-Mustern, die in echten Produktionsoberflächen verwendet wurden. Diese Muster beschreiben, wie wir unsere Oberflächen definiert haben, warum sie so aufgebaut sind, und wie Benutzerinnen und Benutzer damit arbeiten.',
        'Diese Seite ist keine Produktions-Produkt-UI. Hier werden diese Muster gezeigt und dokumentiert.',
      ],
    },
    {
      heading: 'Was diese KI-Beispiele sind',
      paragraphs: [
        'Jeder Eintrag in der Seitenleiste nach About ist eine KI-Rekonstruktion einer realen Produktionsoberfläche, die diese Mustersammlung nutzt. Die Daten und das allgemeine High-Fidelity-Erscheinungsbild wurden geändert, damit die Arbeit ohne NDA-Bruch gezeigt werden kann.',
        'Erhalten bleibt die UX-Flow-Logik: wie die Operatorin oder der Operator durch die Aufgabe geht, und wie die Muster dieses Verhalten beschreiben.',
      ],
    },
    {
      heading: 'Muster',
      paragraphs: [
        'SketchFlowAI Patterns, unter der Linie in der Seitenleiste, ist die Dokumentation dieser Sammlung (P1–P10 und zugehörige UI-Regeln). Es ist keine weitere Beispieloberfläche.',
      ],
    },
    {
      heading: 'Das Informationsband',
      paragraphs: [
        'Bei jedem Beispiel liefert das benachrichtigungsartige Band unter der Oberfläche zusätzlichen Kontext zu genau diesem Prototyp: wofür er da ist, wie man ihn nutzt, und welche Muster aus der Sammlung er zeigt.',
        'Nutzen Sie dort Mehr anzeigen und die Muster-Akkordeons. Das Band ist nicht Teil des Prototyps selbst.',
      ],
    },
  ],
};

const SL: AboutCopy = {
  sections: [
    {
      heading: 'Kaj je SketchFlowAI',
      paragraphs: [
        'SketchFlowAI je zbirka UX in UI vzorcev, ki so se uporabljali v resničnih produkcijskih uporabniških vmesnikih. Ti vzorci opisujejo, kako smo definirali vmesnike, zakaj so tako zgrajeni in kako jih uporabniki uporabljajo.',
        'To mesto ni produkcijski uporabniški vmesnik izdelka. Tukaj te vzorce prikazujemo in dokumentiramo.',
      ],
    },
    {
      heading: 'Kaj so ti primeri UI',
      paragraphs: [
        'Vsak vnos v stranski vrstici za About je rekonstrukcija resničnega produkcijskega vmesnika, ki uporablja to zbirko vzorcev. Podatki in splošni visoko-zvestobni videz so spremenjeni, da se delo lahko pokaže brez kršitve NDA.',
        'Ohranjena je logika UX toka: kako operator gre skozi nalogo in kako vzorci to vedenje opisujejo.',
      ],
    },
    {
      heading: 'Vzorci',
      paragraphs: [
        'SketchFlowAI Patterns, pod črto v stranski vrstici, je dokumentacija te zbirke (P1–P10 in povezana UI pravila). To ni še en primer vmesnika.',
      ],
    },
    {
      heading: 'Informacijski pas',
      paragraphs: [
        'Pri vsakem primeru obvestilni pas pod vmesnikom doda kontekst za ta prototip: čemu je namenjen, kako ga uporabljati in katere vzorce iz zbirke prikazuje.',
        'Tam uporabite Prikaži več in harmonike vzorcev. Ta pas ni del prototipa samega.',
      ],
    },
  ],
};

export const ABOUT_COPY: Record<ShowcaseLocale, AboutCopy> = { en: EN, de: DE, sl: SL };
