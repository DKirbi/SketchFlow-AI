import { create } from 'zustand';

import { FILTER_OPTION_ALL } from '../constants';
import { categoryById, monitoringForCategory, uniqueTournamentById } from '../data/catalog';
import { SEED_SIMPLE_TOURNAMENTS } from '../data/tournaments';
import { applyTournamentFilters } from '../lib/applyFilters';
import { changelogAuthorHandle, formatChangelogTimestamp } from '../lib/formatChangelogTime';
import { normalizeNavigationSelection } from '../lib/listScope';
import { noneUtBranchIdForCategory } from '../lib/sidebarTree';
import type { ChangelogEntry, Role, SimpleTournament, TournamentFilters } from '../types';

export const DEFAULT_FILTERS: TournamentFilters = {
  nameOrId: '',
  sportId: FILTER_OPTION_ALL,
  categoryId: FILTER_OPTION_ALL,
  uniqueTournamentId: FILTER_OPTION_ALL,
  dateFrom: '',
  dateTo: '',
  onlyRunning: false,
  demoFailNextMutation: false,
};

/**
 * Frontend-only prototype flow:
 * 1) edit filter draft, 2) Search commits applied filters, 3) sidebar drives list/detail,
 * 4) modal/row actions mutate in-memory rows, 5) toast + changelog provide feedback.
 */
function generateClogId(): string {
  return `clog-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

function asyncDelay(): Promise<void> {
  const ms = 500 + Math.random() * 1000;
  return new Promise((r) => setTimeout(r, ms));
}

function pickMonitoringCategoryId(categoryId: string): string {
  const m = monitoringForCategory(categoryId);
  if (m.length === 1) return m[0].id;
  return m[0]?.id ?? '';
}

type ToastSeverity = 'success' | 'error' | 'info' | 'warning';

interface ToastState {
  message: string;
  severity: ToastSeverity;
}

function pruneSelection(
  tournaments: SimpleTournament[],
  filters: TournamentFilters,
  selectedNavId: string | undefined,
): string | undefined {
  const ft = applyTournamentFilters(tournaments, filters);
  return normalizeNavigationSelection(selectedNavId, ft);
}

interface TournamentStore {
  tournaments: SimpleTournament[];
  filtersDraft: TournamentFilters;
  filters: TournamentFilters;
  selectedNavId: string | undefined;
  role: Role;
  changelog: ChangelogEntry[];
  toast: ToastState | null;

  cycleRole: () => void;

  setFiltersDraft: (patch: Partial<TournamentFilters>) => void;
  commitSearch: () => void;
  resetAllFilters: () => void;
  toggleDemoFailNextMutation: () => void;

  setSelectedNavId: (id: string | undefined) => void;

  showToast: (message: string, severity: ToastSeverity) => void;
  clearToast: () => void;

  appendChangelog: (entityId: string, action: string, summary: string) => void;

  /** Create or replace tournament from modal save (caller runs P7 first). */
  upsertTournament: (mode: 'create' | 'clone' | 'edit', st: SimpleTournament, previousId?: string) => Promise<boolean>;

  removeTournament: (id: string) => Promise<boolean>;
  /** `targetBranchId` — real unique tournament id or synthetic `ut-none-{categoryId}` */
  moveTournamentToBranch: (
    stId: string,
    targetCategoryId: string,
    utBranchId: string,
  ) => Promise<boolean>;

  /** P3 — immediate, no P7; syncs row, detail, modal field on reopen. */
  toggleDisabledFlag: (id: string) => void;

  getFilteredTournaments: () => SimpleTournament[];
}

const ROLES: Role[] = ['operator', 'supervisor', 'admin'];

export const useTournamentStore = create<TournamentStore>((set, get) => ({
  tournaments: [...SEED_SIMPLE_TOURNAMENTS],
  filtersDraft: { ...DEFAULT_FILTERS },
  filters: { ...DEFAULT_FILTERS },
  selectedNavId: undefined,
  role: 'operator',
  changelog: [],
  toast: null,

  cycleRole: () => {
    const i = ROLES.indexOf(get().role);
    set({ role: ROLES[(i + 1) % ROLES.length] });
  },

  setFiltersDraft: (patch) => {
    set((s) => ({ filtersDraft: { ...s.filtersDraft, ...patch } }));
  },

  commitSearch: () => {
    set((s) => {
      const filters = { ...s.filtersDraft };
      const selectedNavId = pruneSelection(s.tournaments, filters, s.selectedNavId);
      return { filters, selectedNavId };
    });
  },

  resetAllFilters: () => {
    const filters = { ...DEFAULT_FILTERS };
    set((s) => ({
      filters,
      filtersDraft: { ...DEFAULT_FILTERS },
      selectedNavId: pruneSelection(s.tournaments, filters, s.selectedNavId),
    }));
  },

  toggleDemoFailNextMutation: () => {
    set((s) => {
      const next = !s.filters.demoFailNextMutation;
      return {
        filters: { ...s.filters, demoFailNextMutation: next },
        filtersDraft: { ...s.filtersDraft, demoFailNextMutation: next },
      };
    });
  },

  setSelectedNavId: (id) => set({ selectedNavId: id }),

  showToast: (message, severity) => set({ toast: { message, severity } }),
  clearToast: () => set({ toast: null }),

  appendChangelog: (entityId, action, summary) => {
    const entry: ChangelogEntry = {
      id: generateClogId(),
      timestamp: formatChangelogTimestamp(),
      userHandle: changelogAuthorHandle(get().role),
      userRole: get().role,
      entityId,
      action,
      summary,
    };
    set((s) => ({ changelog: [entry, ...s.changelog] }));
  },

  upsertTournament: async (mode, st, previousId) => {
    await asyncDelay();
    const fail = get().filters.demoFailNextMutation;
    if (fail) {
      set((s) => ({
        filters: { ...s.filters, demoFailNextMutation: false },
        filtersDraft: { ...s.filtersDraft, demoFailNextMutation: false },
      }));
      get().showToast('Save failed (demo error).', 'error');
      return false;
    }

    if (mode === 'edit' && previousId !== undefined) {
      set((s) => ({
        tournaments: s.tournaments.map((t) => (t.id === previousId ? st : t)),
      }));
      get().appendChangelog(st.id, 'updated', `Updated simple tournament "${st.name}"`);
      get().showToast(`Saved "${st.name}".`, 'success');
    } else {
      set((s) => ({ tournaments: [...s.tournaments, st] }));
      const verb = mode === 'clone' ? 'Cloned' : 'Created';
      get().appendChangelog(st.id, mode === 'clone' ? 'cloned' : 'created', `${verb} "${st.name}"`);
      get().showToast(`${verb} "${st.name}".`, 'success');
    }

    set({ selectedNavId: st.id });
    return true;
  },

  removeTournament: async (id) => {
    await asyncDelay();
    const st = get().tournaments.find((t) => t.id === id);
    if (!st) {
      get().showToast('Tournament not found.', 'error');
      return false;
    }
    const fail = get().filters.demoFailNextMutation;
    if (fail) {
      set((s) => ({
        filters: { ...s.filters, demoFailNextMutation: false },
        filtersDraft: { ...s.filtersDraft, demoFailNextMutation: false },
      }));
      get().showToast('Remove failed (demo error).', 'error');
      return false;
    }

    set((s) => ({
      tournaments: s.tournaments.filter((t) => t.id !== id),
      selectedNavId: s.selectedNavId === id ? undefined : s.selectedNavId,
    }));
    get().appendChangelog(id, 'removed', `Removed simple tournament "${st.name}"`);
    get().showToast(`Removed "${st.name}".`, 'success');
    return true;
  },

  moveTournamentToBranch: async (stId, targetCategoryId, utBranchId) => {
    await asyncDelay();
    const st = get().tournaments.find((t) => t.id === stId);
    if (!st) {
      get().showToast('Move failed: tournament not found.', 'error');
      return false;
    }

    const cat = categoryById(targetCategoryId);
    if (!cat) {
      get().showToast('Move failed: invalid category.', 'error');
      return false;
    }

    const fail = get().filters.demoFailNextMutation;
    if (fail) {
      set((s) => ({
        filters: { ...s.filters, demoFailNextMutation: false },
        filtersDraft: { ...s.filtersDraft, demoFailNextMutation: false },
      }));
      get().showToast('Move failed (demo error).', 'error');
      return false;
    }

    let next: SimpleTournament;

    if (utBranchId.startsWith('ut-none-')) {
      if (utBranchId !== noneUtBranchIdForCategory(targetCategoryId)) {
        get().showToast('Move failed: branch/category mismatch.', 'error');
        return false;
      }
      next = {
        ...st,
        sportId: cat.sportId,
        categoryId: targetCategoryId,
        uniqueTournamentId: '',
        monitoringCategoryId: pickMonitoringCategoryId(targetCategoryId),
      };
    } else {
      const ut = uniqueTournamentById(utBranchId);
      if (!ut || ut.categoryId !== targetCategoryId) {
        get().showToast('Move failed: unique tournament outside target category.', 'error');
        return false;
      }
      next = {
        ...st,
        sportId: ut.sportId,
        categoryId: ut.categoryId,
        uniqueTournamentId: ut.id,
        monitoringCategoryId: pickMonitoringCategoryId(ut.categoryId),
      };
    }

    set((s) => ({
      tournaments: s.tournaments.map((t) => (t.id === stId ? next : t)),
    }));
    const label = uniqueTournamentById(next.uniqueTournamentId)?.label ?? 'no cross-season grouping';
    get().appendChangelog(stId, 'moved', `Moved "${next.name}" (${label})`);
    get().showToast(`Moved "${next.name}".`, 'success');
    return true;
  },

  toggleDisabledFlag: (id) => {
    const st = get().tournaments.find((t) => t.id === id);
    if (!st) return;
    const disabled = !st.disabled;
    set((s) => ({
      tournaments: s.tournaments.map((t) => (t.id === id ? { ...t, disabled } : t)),
    }));
    const label = disabled ? 'Disabled' : 'Enabled';
    get().appendChangelog(id, disabled ? 'disabled' : 'enabled', `${label} "${st.name}"`);
    get().showToast(`${label} "${st.name}".`, 'success');
  },

  getFilteredTournaments: () => applyTournamentFilters(get().tournaments, get().filters),
}));
