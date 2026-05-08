import type { AppUser, ChangelogEntry, ManagedTeam, Player } from './types';

// ─── Users ───────────────────────────────────────────────────────
export const USERS: AppUser[] = [
  { handle: 'j.smith', role: 'operator' },
  { handle: 's.kovac', role: 'supervisor' },
  { handle: 'a.chen', role: 'admin' },
];

// ─── Players ─────────────────────────────────────────────────────
export const ALL_PLAYERS: Player[] = [
  { id: 'PLY-001', name: 'Luka Modrić',       position: 'MID', goals: 23,  appearances: 534, points: 87 },
  { id: 'PLY-002', name: 'Pedri González',     position: 'MID', goals: 18,  appearances: 142, points: 79 },
  { id: 'PLY-003', name: 'Erling Haaland',     position: 'FWD', goals: 115, appearances: 163, points: 94 },
  { id: 'PLY-004', name: 'Jude Bellingham',    position: 'MID', goals: 42,  appearances: 198, points: 88 },
  { id: 'PLY-005', name: 'Vinícius Júnior',    position: 'FWD', goals: 68,  appearances: 245, points: 91 },
  { id: 'PLY-006', name: 'Gavi Páez',          position: 'MID', goals: 8,   appearances: 104, points: 73 },
  { id: 'PLY-007', name: 'Rodri Hernández',    position: 'MID', goals: 17,  appearances: 264, points: 90 },
  { id: 'PLY-008', name: 'Phil Foden',         position: 'FWD', goals: 52,  appearances: 228, points: 86 },
  { id: 'PLY-009', name: 'Jamal Musiala',      position: 'MID', goals: 31,  appearances: 158, points: 84 },
  { id: 'PLY-010', name: 'Florian Wirtz',      position: 'MID', goals: 28,  appearances: 147, points: 82 },
  { id: 'PLY-011', name: 'Marc-André ter Stegen', position: 'GK', goals: 0, appearances: 403, points: 85 },
  { id: 'PLY-012', name: 'Thibaut Courtois',   position: 'GK',  goals: 0,   appearances: 498, points: 88 },
  { id: 'PLY-013', name: 'Rúben Dias',         position: 'DEF', goals: 11,  appearances: 234, points: 86 },
  { id: 'PLY-014', name: 'Antonio Rüdiger',    position: 'DEF', goals: 14,  appearances: 412, points: 81 },
  { id: 'PLY-015', name: 'Jules Koundé',       position: 'DEF', goals: 7,   appearances: 198, points: 78 },
  { id: 'PLY-016', name: 'Federico Valverde',  position: 'MID', goals: 22,  appearances: 247, points: 85 },
  { id: 'PLY-017', name: 'Bukayo Saka',        position: 'FWD', goals: 56,  appearances: 222, points: 87 },
  { id: 'PLY-018', name: 'Rafael Leão',        position: 'FWD', goals: 47,  appearances: 208, points: 80 },
  { id: 'PLY-019', name: 'Lamine Yamal',       position: 'FWD', goals: 12,  appearances: 58,  points: 76 },
  { id: 'PLY-020', name: 'Dani Olmo',          position: 'MID', goals: 24,  appearances: 186, points: 77 },
  { id: 'PLY-021', name: 'Kyle Walker',        position: 'DEF', goals: 6,   appearances: 382, points: 79 },
  { id: 'PLY-022', name: 'Virgil van Dijk',    position: 'DEF', goals: 22,  appearances: 378, points: 89 },
  { id: 'PLY-023', name: 'Mohamed Salah',      position: 'FWD', goals: 214, appearances: 368, points: 93 },
  { id: 'PLY-024', name: 'Joshua Kimmich',     position: 'MID', goals: 14,  appearances: 362, points: 86 },
  { id: 'PLY-025', name: 'Dušan Vlahović',     position: 'FWD', goals: 61,  appearances: 198, points: 78 },
];

// ─── Teams ───────────────────────────────────────────────────────
export const INITIAL_TEAMS: ManagedTeam[] = [
  { id: 'TM-001', name: 'FC Barcelona',           status: 'active',    playerIds: ['PLY-002', 'PLY-006', 'PLY-011', 'PLY-015', 'PLY-019'] },
  { id: 'TM-002', name: 'Real Madrid',            status: 'active',    playerIds: ['PLY-001', 'PLY-004', 'PLY-005', 'PLY-012', 'PLY-014', 'PLY-016'] },
  { id: 'TM-003', name: 'Manchester City',        status: 'active',    playerIds: ['PLY-003', 'PLY-007', 'PLY-008', 'PLY-013', 'PLY-021'] },
  { id: 'TM-004', name: 'Bayern Munich',          status: 'active',    playerIds: ['PLY-009', 'PLY-010', 'PLY-024'] },
  { id: 'TM-005', name: 'Juventus',               status: 'active',    playerIds: ['PLY-025'] },
  { id: 'TM-006', name: 'Paris Saint-Germain',    status: 'active',    playerIds: ['PLY-020'] },
  { id: 'TM-007', name: 'Liverpool',              status: 'active',    playerIds: ['PLY-022', 'PLY-023'] },
  { id: 'TM-008', name: 'Ajax',                   status: 'redundant', playerIds: [], markedRedundantBy: 'j.smith', markedRedundantAt: '02 Apr 2026, 11:15' },
  { id: 'TM-009', name: 'Borussia Dortmund',      status: 'active',    playerIds: [] },
  { id: 'TM-010', name: 'Inter Milan',            status: 'active',    playerIds: ['PLY-018'] },
];

// ─── CSV import samples ──────────────────────────────────────────
export const CSV_IMPORT_PLAYERS: Player[] = [
  { id: 'PLY-030', name: 'Kylian Mbappé',   position: 'FWD', goals: 218, appearances: 312, points: 95, isPending: true },
  { id: 'PLY-031', name: 'Declan Rice',     position: 'MID', goals: 16,  appearances: 224, points: 80, isPending: true },
  { id: 'PLY-032', name: 'Bernardo Silva',  position: 'MID', goals: 48,  appearances: 328, points: 84, isPending: true },
  { id: 'PLY-033', name: 'Aurélien Tchouaméni', position: 'MID', goals: 5, appearances: 142, points: 76, isPending: true },
  { id: 'PLY-034', name: '',                position: 'DEF', goals: 0,   appearances: 0,   points: 0,  isPending: true, importError: 'Missing required field: Name' },
  { id: 'PLY-003', name: 'Erling Haaland',  position: 'FWD', goals: 115, appearances: 163, points: 94, isPending: true, importError: 'Duplicate ID: PLY-003 already exists' },
];

// ─── Seed changelog ──────────────────────────────────────────────
export const SEED_CHANGELOG: ChangelogEntry[] = [
  {
    id: 'CL-001', timestamp: '01 Apr 2026, 09:00', userHandle: 'j.smith', userRole: 'operator',
    entityId: 'TM-001', action: 'created', summary: 'Created team FC Barcelona',
  },
  {
    id: 'CL-002', timestamp: '01 Apr 2026, 09:12', userHandle: 'j.smith', userRole: 'operator',
    entityId: 'TM-002', action: 'created', summary: 'Created team Real Madrid',
  },
  {
    id: 'CL-003', timestamp: '01 Apr 2026, 09:30', userHandle: 'j.smith', userRole: 'operator',
    entityId: 'TM-003', action: 'created', summary: 'Created team Manchester City',
  },
  {
    id: 'CL-004', timestamp: '02 Apr 2026, 10:45', userHandle: 'j.smith', userRole: 'operator',
    entityId: 'TM-001', action: 'updated', summary: 'Added 5 players to FC Barcelona',
  },
  {
    id: 'CL-005', timestamp: '02 Apr 2026, 11:00', userHandle: 'j.smith', userRole: 'operator',
    entityId: 'TM-002', action: 'updated', summary: 'Added 6 players to Real Madrid',
  },
  {
    id: 'CL-006', timestamp: '02 Apr 2026, 11:15', userHandle: 'j.smith', userRole: 'operator',
    entityId: 'TM-008', action: 'marked redundant', summary: 'Marked Ajax as redundant',
  },
  {
    id: 'CL-007', timestamp: '03 Apr 2026, 14:20', userHandle: 'j.smith', userRole: 'operator',
    entityId: 'TM-003', action: 'updated', summary: 'Added 5 players to Manchester City',
  },
  {
    id: 'CL-008', timestamp: '05 Apr 2026, 16:10', userHandle: 'j.smith', userRole: 'operator',
    entityId: 'TM-007', action: 'added', summary: 'Added Mohamed Salah (PLY-023) to Liverpool',
  },
];

// ─── Helpers ─────────────────────────────────────────────────────
let _nextTeamNum = 11;
export function generateTeamId(): string {
  return `TM-${String(_nextTeamNum++).padStart(3, '0')}`;
}

let _nextClId = 9;
export function generateChangelogId(): string {
  return `CL-${String(_nextClId++).padStart(3, '0')}`;
}

export function formatTimestamp(date: Date = new Date()): string {
  const d = String(date.getDate()).padStart(2, '0');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const m = months[date.getMonth()];
  const y = date.getFullYear();
  const h = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${d} ${m} ${y}, ${h}:${min}`;
}
