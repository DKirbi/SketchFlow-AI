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
    id: 'FSD-1001',
    internalValue: 'Das Leben Der Anderen',
    externalSuggestion: 'The Lives of Others',
    confidence: 97,
    status: 'mapped',
    mappedAt: '02 Apr 2026, 09:14',
    mappedBy: 'j.smith',
  },
  {
    id: 'FSD-1002',
    internalValue: 'Amelie',
    externalSuggestion: 'Amélie',
    confidence: 94,
    status: 'mapped',
    mappedAt: '02 Apr 2026, 09:15',
    mappedBy: 'j.smith',
  },
  {
    id: 'FSD-1003',
    internalValue: 'Oldboy (Korea)',
    externalSuggestion: 'Oldboy',
    confidence: 91,
    status: 'pending',
  },
  {
    id: 'FSD-1004',
    internalValue: 'STALKER',
    externalSuggestion: 'Stalker',
    confidence: 88,
    status: 'pending',
  },
  {
    id: 'FSD-1005',
    internalValue: 'Spirited Away (Sen To Chihiro)',
    externalSuggestion: 'Spirited Away',
    confidence: 92,
    status: 'pending',
  },
  {
    id: 'FSD-1006',
    internalValue: 'PARASITE',
    externalSuggestion: 'Parasite',
    confidence: 90,
    status: 'pending',
  },
  {
    id: 'FSD-1007',
    internalValue: 'Der Untergang',
    externalSuggestion: 'Downfall',
    confidence: 85,
    status: 'pending',
  },
  {
    id: 'FSD-1009',
    internalValue: 'Nochnoy Dozor',
    externalSuggestion: 'Night Watch',
    confidence: 82,
    status: 'pending',
  },
  {
    id: 'FSD-1010',
    internalValue: 'Idi i smotri',
    externalSuggestion: 'Come and See',
    confidence: 79,
    status: 'pending',
  },
  {
    id: 'FSD-1011',
    internalValue: 'Ah-ga-ssi',
    externalSuggestion: 'The Handmaiden',
    confidence: 76,
    status: 'pending',
  },
  {
    id: 'FSD-1012',
    internalValue: 'Relatos Salvajes',
    externalSuggestion: 'Wild Tales',
    confidence: 84,
    status: 'pending',
  },
  {
    id: 'FSD-1014',
    internalValue: 'Jurassic Park (Le Parc)',
    externalSuggestion: 'Jurassic Park',
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
