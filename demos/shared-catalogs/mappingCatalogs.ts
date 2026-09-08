import type { MockCatalogId } from './mockCatalog';

export type MappingTabId = string;

export interface MappingSuggestion {
  id: string;
  externalLabel: string;
  confidence: number;
}

export interface MappingEntity {
  id: string;
  name: string;
  tab: MappingTabId;
  suggestions: MappingSuggestion[];
  seedMappedId?: string;
}

export interface MappingCatalog {
  id: MockCatalogId;
  title: string;
  tabs: { value: MappingTabId; label: string }[];
  entities: MappingEntity[];
}

export const CURRENT_USER = { handle: 'j.smith', role: 'Operator' };

export const WIZARDING_TABS: { value: MappingTabId; label: string }[] = [
  { value: 'players', label: 'Players & houses' },
  { value: 'fixtures', label: 'Fixtures & duels' },
  { value: 'cups', label: 'Cups & tournaments' },
  { value: 'positions', label: 'Positions & bout types' },
];

export const FILM_TABS: { value: MappingTabId; label: string }[] = [
  { value: 'titles', label: 'Titles' },
  { value: 'people', label: 'People' },
  { value: 'festivals', label: 'Festivals' },
  { value: 'formats', label: 'Formats' },
];

function dropLetter(value: string): string {
  const idx = Math.max(1, Math.floor(value.length / 3));
  return `${value.slice(0, idx)}${value.slice(idx + 1)}`;
}

function extraToken(value: string): string {
  return `${value} crawl-hit`;
}

function ocrish(value: string): string {
  return value.replace(/o/gi, '0').replace(/e/gi, '3').replace(/a/gi, '@');
}

function suggestionsFor(canonical: string, idPrefix: string): MappingSuggestion[] {
  const variants: { label: string; confidence: number }[] = [
    { label: canonical, confidence: 99 },
    { label: canonical.toLowerCase(), confidence: 97 },
    { label: `${canonical}.`, confidence: 95 },
    { label: canonical.toUpperCase(), confidence: 92 },
    { label: canonical.replace(/ /g, '  '), confidence: 90 },
    { label: dropLetter(canonical), confidence: 84 },
    { label: extraToken(canonical.toLowerCase()), confidence: 79 },
    { label: `${canonical} [duel-index]`, confidence: 73 },
    { label: ocrish(canonical), confidence: 66 },
    { label: `${canonical.slice(0, Math.max(5, canonical.length - 4))}…`, confidence: 59 },
    { label: `${canonical.split(' ').reverse().join(' ')} ???`, confidence: 52 },
  ];

  return variants.map((variant, index) => ({
    id: `${idPrefix}-s${index}`,
    externalLabel: variant.label,
    confidence: variant.confidence,
  }));
}

function entity(id: string, name: string, tab: MappingTabId, mapped?: boolean): MappingEntity {
  const suggestions = suggestionsFor(name, id);
  return {
    id,
    name,
    tab,
    suggestions,
    seedMappedId: mapped ? suggestions[0]?.id : undefined,
  };
}

export const WIZARDING_ENTITIES: MappingEntity[] = [
  entity('hp-pl-001', 'Gryffindor Quidditch XI', 'players', true),
  entity('hp-pl-002', 'Harry Potter', 'players', true),
  entity('hp-pl-003', 'Cedric Diggory', 'players'),
  entity('hp-pl-004', 'Viktor Krum', 'players'),
  entity('hp-pl-005', 'Fleur Delacour', 'players'),
  entity('hp-pl-006', 'Cho Chang', 'players'),
  entity('hp-pl-007', 'Ginny Weasley', 'players'),
  entity('hp-pl-008', 'Draco Malfoy', 'players'),

  entity('hp-fx-001', 'Gryffindor vs Slytherin 1993', 'fixtures', true),
  entity('hp-fx-002', 'Dueling Club demonstration', 'fixtures'),
  entity('hp-fx-003', 'Triwizard First Task', 'fixtures'),
  entity('hp-fx-004', 'Potter–Malfoy corridor duel', 'fixtures'),
  entity('hp-fx-005', 'World Cup final 1994', 'fixtures', true),
  entity('hp-fx-006', 'Hogwarts vs Beauxbatons friendly', 'fixtures'),

  entity('hp-cp-001', 'Quidditch World Cup', 'cups', true),
  entity('hp-cp-002', 'Inter-House Quidditch Cup', 'cups'),
  entity('hp-cp-003', 'Triwizard Tournament', 'cups', true),
  entity('hp-cp-004', 'Hogwarts House Cup', 'cups'),
  entity('hp-cp-005', 'Durmstrang Invitational Duel', 'cups'),
  entity('hp-cp-006', 'Wizarding Schools Duel Circuit', 'cups'),

  entity('hp-po-001', 'Seeker', 'positions', true),
  entity('hp-po-002', 'Chaser', 'positions'),
  entity('hp-po-003', 'Keeper', 'positions'),
  entity('hp-po-004', 'Beater', 'positions'),
  entity('hp-po-005', 'Wand duel', 'positions'),
  entity('hp-po-006', 'Shield charm bout', 'positions'),
  entity('hp-po-007', 'House affiliation', 'positions'),
  entity('hp-po-008', 'Magical sport', 'positions'),
];

export const FILM_ENTITIES: MappingEntity[] = [
  entity('fl-ti-001', 'Das Leben Der Anderen', 'titles', true),
  entity('fl-ti-002', 'Amelie', 'titles', true),
  entity('fl-ti-003', 'Oldboy', 'titles'),
  entity('fl-ti-004', 'STALKER', 'titles'),
  entity('fl-ti-005', 'Spirited Away', 'titles'),
  entity('fl-ti-006', 'Parasite', 'titles'),
  entity('fl-ti-007', 'Der Untergang', 'titles'),
  entity('fl-ti-008', 'Relatos Salvajes', 'titles'),

  entity('fl-pe-001', 'Florian Henckel von Donnersmarck', 'people', true),
  entity('fl-pe-002', 'Jean-Pierre Jeunet', 'people'),
  entity('fl-pe-003', 'Park Chan-wook', 'people'),
  entity('fl-pe-004', 'Andrei Tarkovsky', 'people'),
  entity('fl-pe-005', 'Hayao Miyazaki', 'people'),
  entity('fl-pe-006', 'Bong Joon-ho', 'people'),

  entity('fl-fe-001', 'Berlinale', 'festivals', true),
  entity('fl-fe-002', 'Cannes Palme d’Or', 'festivals'),
  entity('fl-fe-003', 'Venice Golden Lion', 'festivals'),
  entity('fl-fe-004', 'Busan International', 'festivals'),
  entity('fl-fe-005', 'Toronto International', 'festivals'),
  entity('fl-fe-006', 'Locarno Festival', 'festivals'),

  entity('fl-fo-001', 'Feature film', 'formats', true),
  entity('fl-fo-002', 'Animated feature', 'formats'),
  entity('fl-fo-003', 'Restored print', 'formats'),
  entity('fl-fo-004', 'Director’s cut', 'formats'),
  entity('fl-fo-005', 'Limited theatrical', 'formats'),
  entity('fl-fo-006', 'Archive print', 'formats'),
];

export const WIZARDING_CATALOG: MappingCatalog = {
  id: 'wizarding',
  title: 'Wizarding mapping',
  tabs: WIZARDING_TABS,
  entities: WIZARDING_ENTITIES,
};

export const FILM_CATALOG: MappingCatalog = {
  id: 'film',
  title: 'Film mapping',
  tabs: FILM_TABS,
  entities: FILM_ENTITIES,
};

export function getMappingCatalog(id: MockCatalogId): MappingCatalog {
  return id === 'film' ? FILM_CATALOG : WIZARDING_CATALOG;
}

export function seedAccepted(entities: MappingEntity[] = WIZARDING_ENTITIES): Record<string, string> {
  const accepted: Record<string, string> = {};
  for (const item of entities) {
    if (item.seedMappedId) accepted[item.id] = item.seedMappedId;
  }
  return accepted;
}
