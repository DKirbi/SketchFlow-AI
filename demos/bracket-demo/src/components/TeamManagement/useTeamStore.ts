import { create } from 'zustand';
import type {
  AppUser,
  ChangelogEntry,
  ManagedTeam,
  Player,
  UserRole,
  ChangelogAction,
} from './types';
import {
  USERS,
  ALL_PLAYERS,
  INITIAL_TEAMS,
  SEED_CHANGELOG,
  CSV_IMPORT_PLAYERS,
  generateTeamId,
  generateChangelogId,
  formatTimestamp,
} from './mockData';

interface TeamStore {
  // ── Data ──
  teams: ManagedTeam[];
  allPlayers: Player[];
  changelog: ChangelogEntry[];
  currentUser: AppUser;

  // ── User / role ──
  cycleRole: () => void;
  setRole: (role: UserRole) => void;

  // ── Teams CRUD ──
  createTeam: (name: string, playerIds: string[]) => void;
  updateTeamRoster: (teamId: string, playerIds: string[]) => void;
  markRedundant: (teamId: string) => void;
  confirmRemoval: (teamId: string) => void;
  rejectRemoval: (teamId: string) => void;

  // ── CSV import ──
  importCsvPlayers: () => Player[];

  // ── Changelog ──
  appendLog: (entityId: string, action: ChangelogAction, summary: string) => void;

  // ── Notifications ──
  notification: string | null;
  clearNotification: () => void;
}

export const useTeamStore = create<TeamStore>((set, get) => ({
  teams: [...INITIAL_TEAMS],
  allPlayers: [...ALL_PLAYERS],
  changelog: [...SEED_CHANGELOG].reverse(),
  currentUser: { ...USERS[0] },
  notification: null,

  cycleRole: () => {
    const { currentUser } = get();
    const idx = USERS.findIndex(u => u.role === currentUser.role);
    const next = USERS[(idx + 1) % USERS.length];
    set({ currentUser: { ...next } });
  },

  setRole: (role: UserRole) => {
    const user = USERS.find(u => u.role === role) ?? USERS[0];
    set({ currentUser: { ...user } });
  },

  createTeam: (name: string, playerIds: string[]) => {
    const id = generateTeamId();
    const team: ManagedTeam = { id, name, status: 'active', playerIds };
    set(s => ({ teams: [...s.teams, team] }));
    get().appendLog(id, 'created', `Created team ${name}`);
    if (playerIds.length > 0) {
      get().appendLog(id, 'updated', `Added ${playerIds.length} player${playerIds.length === 1 ? '' : 's'} to ${name}`);
    }
    set({ notification: `Team "${name}" created successfully` });
  },

  updateTeamRoster: (teamId: string, playerIds: string[]) => {
    set(s => ({
      teams: s.teams.map(t => t.id === teamId ? { ...t, playerIds } : t),
    }));
    const team = get().teams.find(t => t.id === teamId);
    if (team) {
      get().appendLog(teamId, 'updated', `Updated roster for ${team.name}`);
      set({ notification: `"${team.name}" updated successfully` });
    }
  },

  markRedundant: (teamId: string) => {
    const { currentUser } = get();
    const now = formatTimestamp();
    set(s => ({
      teams: s.teams.map(t =>
        t.id === teamId
          ? { ...t, status: 'redundant' as const, markedRedundantBy: currentUser.handle, markedRedundantAt: now }
          : t
      ),
    }));
    const team = get().teams.find(t => t.id === teamId);
    if (team) {
      get().appendLog(teamId, 'marked redundant', `Marked ${team.name} as redundant`);
    }
  },

  confirmRemoval: (teamId: string) => {
    const team = get().teams.find(t => t.id === teamId);
    set(s => ({ teams: s.teams.filter(t => t.id !== teamId) }));
    if (team) {
      const { currentUser } = get();
      get().appendLog(
        teamId,
        'removal confirmed',
        `Removed ${team.name} (approved by ${currentUser.handle})`,
      );
    }
  },

  rejectRemoval: (teamId: string) => {
    set(s => ({
      teams: s.teams.map(t =>
        t.id === teamId
          ? { ...t, status: 'active' as const, markedRedundantBy: undefined, markedRedundantAt: undefined }
          : t
      ),
    }));
    const team = get().teams.find(t => t.id === teamId);
    if (team) {
      get().appendLog(teamId, 'removal rejected', `Rejected removal of ${team.name}`);
    }
  },

  importCsvPlayers: () => {
    const existing = get().allPlayers;
    const newPlayers = CSV_IMPORT_PLAYERS.filter(
      p => !existing.some(e => e.id === p.id) && !p.importError,
    );
    if (newPlayers.length > 0) {
      set(s => ({ allPlayers: [...s.allPlayers, ...newPlayers] }));
    }
    return CSV_IMPORT_PLAYERS;
  },

  appendLog: (entityId, action, summary) => {
    const { currentUser } = get();
    const entry: ChangelogEntry = {
      id: generateChangelogId(),
      timestamp: formatTimestamp(),
      userHandle: currentUser.handle,
      userRole: currentUser.role,
      entityId,
      action,
      summary,
    };
    set(s => ({ changelog: [entry, ...s.changelog] }));
  },

  clearNotification: () => set({ notification: null }),
}));
