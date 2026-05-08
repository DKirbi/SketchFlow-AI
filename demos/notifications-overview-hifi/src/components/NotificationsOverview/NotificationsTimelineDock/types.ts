import type { NotificationRow, OperatorId, Role } from '../../../types';

export interface NotificationsTimelineDockProps {
  role: Role;
  filteredPending: NotificationRow[];
  filteredResolved: NotificationRow[];
  selectedOperatorId: OperatorId | null;
  onSelectOperator: (id: OperatorId | null) => void;
  selectedNotificationId: string | null;
  onSelectNotification: (id: string | null) => void;
  nowMs: number;
  isLive: boolean;
  reducedMotion: boolean;
  focusedMatchId: string | null;
  onFocusMatch: (matchId: string | null) => void;
}
