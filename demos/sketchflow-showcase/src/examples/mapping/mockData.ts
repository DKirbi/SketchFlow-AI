import { FILTER_ALL } from './catalog';

export type MappingStatus = 'pending' | 'mapped';

export interface MappingItem {
  id: string;
  sportId: string;
  sportLabel: string;
  tournamentId: string;
  tournamentLabel: string;
  internalValue: string;
  externalSuggestion: string;
  confidence: number;
  status: MappingStatus;
  mappedAt?: string;
  mappedBy?: string;
}

export interface MappingFilters {
  sportId: string;
  tournamentQuery: string;
}

export const DEFAULT_FILTERS: MappingFilters = {
  sportId: FILTER_ALL,
  tournamentQuery: '',
};

export const INITIAL_ITEMS: MappingItem[] = [
  {
    id: 'COMP-UEFA-CL',
    sportId: 'sp-soccer',
    sportLabel: 'Soccer',
    tournamentId: 'ut-ucl',
    tournamentLabel: 'UEFA Champions League',
    internalValue: 'UEFA Champins League',
    externalSuggestion: 'UEFA Champions League',
    confidence: 97,
    status: 'mapped',
    mappedAt: '02 Apr 2026, 09:14',
    mappedBy: 'j.smith',
  },
  {
    id: 'COMP-EPL',
    sportId: 'sp-soccer',
    sportLabel: 'Soccer',
    tournamentId: 'ut-pl',
    tournamentLabel: 'Premier League',
    internalValue: 'Enlgish Premeer League',
    externalSuggestion: 'English Premier League',
    confidence: 94,
    status: 'mapped',
    mappedAt: '02 Apr 2026, 09:15',
    mappedBy: 'j.smith',
  },
  {
    id: 'COMP-LA-LIGA',
    sportId: 'sp-soccer',
    sportLabel: 'Soccer',
    tournamentId: 'ut-laliga',
    tournamentLabel: 'La Liga',
    internalValue: 'LaLiga Santander',
    externalSuggestion: 'La Liga',
    confidence: 88,
    status: 'pending',
  },
  {
    id: 'COMP-SERIE-A',
    sportId: 'sp-soccer',
    sportLabel: 'Soccer',
    tournamentId: 'ut-seriea',
    tournamentLabel: 'Serie A',
    internalValue: 'Serie-A (Italy)',
    externalSuggestion: 'Serie A',
    confidence: 91,
    status: 'pending',
  },
  {
    id: 'COMP-BUNDESLIGA',
    sportId: 'sp-soccer',
    sportLabel: 'Soccer',
    tournamentId: 'ut-bundesliga',
    tournamentLabel: 'Bundesliga',
    internalValue: 'Bundesliga 1',
    externalSuggestion: 'Bundesliga',
    confidence: 85,
    status: 'pending',
  },
  {
    id: 'COMP-LIGUE-1',
    sportId: 'sp-soccer',
    sportLabel: 'Soccer',
    tournamentId: 'ut-ligue1',
    tournamentLabel: 'Ligue 1',
    internalValue: 'Lgue 1 France',
    externalSuggestion: 'Ligue 1',
    confidence: 76,
    status: 'pending',
  },
  {
    id: 'COMP-WORLD-CUP',
    sportId: 'sp-cricket',
    sportLabel: 'Cricket',
    tournamentId: 'ut-icc-wc',
    tournamentLabel: 'ICC Cricket World Cup',
    internalValue: 'ICC World Cup 2026',
    externalSuggestion: 'ICC Cricket World Cup',
    confidence: 84,
    status: 'pending',
  },
  {
    id: 'COMP-ASHES',
    sportId: 'sp-cricket',
    sportLabel: 'Cricket',
    tournamentId: 'ut-ashes',
    tournamentLabel: 'The Ashes',
    internalValue: 'Ashes Test Series',
    externalSuggestion: 'The Ashes',
    confidence: 79,
    status: 'pending',
  },
  {
    id: 'COMP-WIMBLEDON',
    sportId: 'sp-tennis',
    sportLabel: 'Tennis',
    tournamentId: 'ut-wimbledon',
    tournamentLabel: 'Wimbledon',
    internalValue: 'Wimbledon Championships',
    externalSuggestion: 'Wimbledon',
    confidence: 92,
    status: 'pending',
  },
  {
    id: 'COMP-USOPEN',
    sportId: 'sp-tennis',
    sportLabel: 'Tennis',
    tournamentId: 'ut-usopen',
    tournamentLabel: 'US Open',
    internalValue: 'US Open Tennis',
    externalSuggestion: 'US Open',
    confidence: 90,
    status: 'pending',
  },
  {
    id: 'COMP-ROLAND-GARROS',
    sportId: 'sp-tennis',
    sportLabel: 'Tennis',
    tournamentId: 'ut-rg',
    tournamentLabel: 'Roland Garros',
    internalValue: 'French Open',
    externalSuggestion: 'Roland Garros',
    confidence: 87,
    status: 'pending',
  },
  {
    id: 'COMP-UEFA-EL',
    sportId: 'sp-soccer',
    sportLabel: 'Soccer',
    tournamentId: 'ut-uel',
    tournamentLabel: 'UEFA Europa League',
    internalValue: 'UEFA Eurpoa Lge',
    externalSuggestion: 'UEFA Europa League',
    confidence: 89,
    status: 'pending',
  },
];

export const CURRENT_USER = { handle: 'r.okonkwo', role: 'data-ops' };

export function nowTimestamp(): string {
  const d = new Date();
  const day = String(d.getDate()).padStart(2, '0');
  const month = d.toLocaleString('en-GB', { month: 'short' });
  const year = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${day} ${month} ${year}, ${hh}:${mm}`;
}

export function cloneItems(items: MappingItem[]): MappingItem[] {
  return items.map((item) => ({ ...item }));
}

export function createInitialState() {
  return {
    items: cloneItems(INITIAL_ITEMS),
    selected: new Set<string>(),
    loadingIds: new Set<string>(),
    unmapConfirmId: null as string | null,
    bulkConfirmOpen: false,
    statusMessage: null as string | null,
    filtersDraft: { ...DEFAULT_FILTERS },
    filtersApplied: { ...DEFAULT_FILTERS },
  };
}
