export type UserRole = 'operator' | 'supervisor' | 'admin';

export interface AppUser {
  handle: string;
  role: UserRole;
}

export type TeamStatus = 'active' | 'redundant';

export interface ManagedTeam {
  id: string;
  name: string;
  status: TeamStatus;
  playerIds: string[];
  /** Who flagged redundant, if applicable */
  markedRedundantBy?: string;
  markedRedundantAt?: string;
}

export type PlayerPosition = 'GK' | 'DEF' | 'MID' | 'FWD';

export interface Player {
  id: string;
  name: string;
  position: PlayerPosition;
  goals: number;
  appearances: number;
  points: number;
  /** True when imported via CSV and not yet confirmed */
  isPending?: boolean;
  /** Validation error from CSV import */
  importError?: string;
}

export type ChangelogAction =
  | 'created'
  | 'updated'
  | 'added'
  | 'removed'
  | 'marked redundant'
  | 'removal confirmed'
  | 'removal rejected';

export interface ChangelogEntry {
  id: string;
  timestamp: string;
  userHandle: string;
  userRole: UserRole;
  entityId: string;
  action: ChangelogAction;
  summary: string;
}
