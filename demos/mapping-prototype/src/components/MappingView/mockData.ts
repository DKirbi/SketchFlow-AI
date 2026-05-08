export type MappingStatus = 'pending' | 'mapped';

export interface MappingItem {
  id: string;
  internalValue: string;
  externalSuggestion: string;
  confidence: number;
  status: MappingStatus;
  mappedAt?: string;
  mappedBy?: string;
}

export const INITIAL_ITEMS: MappingItem[] = [
  {
    id: 'COMP-UEFA-CL',
    internalValue: 'UEFA Champins League',
    externalSuggestion: 'UEFA Champions League',
    confidence: 97,
    status: 'mapped',
    mappedAt: '02 Apr 2026, 09:14',
    mappedBy: 'j.smith',
  },
  {
    id: 'COMP-EPL',
    internalValue: 'Enlgish Premeer League',
    externalSuggestion: 'English Premier League',
    confidence: 94,
    status: 'mapped',
    mappedAt: '02 Apr 2026, 09:15',
    mappedBy: 'j.smith',
  },
  {
    id: 'COMP-LA-LIGA',
    internalValue: 'LaLiga Santander',
    externalSuggestion: 'La Liga',
    confidence: 88,
    status: 'pending',
  },
  {
    id: 'COMP-SERIE-A',
    internalValue: 'Serie-A (Italy)',
    externalSuggestion: 'Serie A',
    confidence: 91,
    status: 'pending',
  },
  {
    id: 'COMP-BUNDESLIGA',
    internalValue: 'Bundesliga 1',
    externalSuggestion: 'Bundesliga',
    confidence: 85,
    status: 'pending',
  },
  {
    id: 'COMP-LIGUE-1',
    internalValue: 'Lgue 1 France',
    externalSuggestion: 'Ligue 1',
    confidence: 76,
    status: 'pending',
  },
  {
    id: 'COMP-EREDIVISIE',
    internalValue: 'eredivisie',
    externalSuggestion: 'Eredivisie',
    confidence: 82,
    status: 'pending',
  },
  {
    id: 'COMP-SPL',
    internalValue: 'scottish prem',
    externalSuggestion: 'Scottish Premiership',
    confidence: 63,
    status: 'pending',
  },
  {
    id: 'COMP-UEFA-EL',
    internalValue: 'UEFA Eurpoa Lge',
    externalSuggestion: 'UEFA Europa League',
    confidence: 89,
    status: 'pending',
  },
  {
    id: 'COMP-WORLD-CUP',
    internalValue: 'FIFA World Cup 2026',
    externalSuggestion: 'FIFA World Cup',
    confidence: 71,
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
