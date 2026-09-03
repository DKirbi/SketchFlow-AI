import type { ActionPresentation, ActionRole, ClusterHost } from './types';

const COMPACT_HOSTS: ClusterHost[] = ['toolbar-right', 'card-toolbar', 'row-actions'];
const SMALL_HOSTS: ClusterHost[] = ['bulk-bar', 'list-header'];

function defaultSize(host: ClusterHost): ActionPresentation['size'] {
  if (COMPACT_HOSTS.includes(host)) return 'compact';
  if (SMALL_HOSTS.includes(host)) return 'small';
  return 'default';
}

/**
 * Resolve one action for a host.
 *
 * LOFI `variant` is what the prototype renders (grayscale). `uiColor` /
 * `uiRank` is what `/ui-patterns` / hi-fi should apply — demos often collapse
 * `outline` and `subtle` into `dismiss`, so the two layers are stored separately.
 */
export function resolveActionPresentation(
  role: ActionRole,
  host: ClusterHost,
  options: { destructive?: boolean } = {},
): ActionPresentation {
  const size = defaultSize(host);
  const destructive = options.destructive === true;

  if (role === 'commit') {
    if (host === 'bulk-bar') {
      return { variant: 'primary', size, uiColor: 'action', uiRank: 'outline' };
    }
    if (host === 'row-actions') {
      return { variant: 'default', size, uiColor: 'neutral', uiRank: 'outline' };
    }
    if (host === 'p7-footer' && destructive) {
      return { variant: 'primary', size, uiColor: 'warning', uiRank: 'fill' };
    }
    return { variant: 'primary', size, uiColor: 'action', uiRank: 'fill' };
  }

  if (role === 'destructive') {
    if (host === 'p7-footer') {
      return { variant: 'primary', size, uiColor: 'warning', uiRank: 'fill' };
    }
    if (host === 'row-actions' || host === 'card-toolbar' || host === 'bulk-bar') {
      return { variant: 'dismiss', size, uiColor: 'warning', uiRank: 'ghost' };
    }
    return { variant: 'dismiss', size, uiColor: 'warning', uiRank: 'subtle' };
  }

  if (role === 'dismiss') {
    const uiRank = host === 'toolbar-right' || host === 'row-actions' ? 'ghost' : 'subtle';
    return { variant: 'dismiss', size, uiColor: 'neutral', uiRank };
  }

  if (role === 'secondary') {
    if (host === 'workspace-footer' || host === 'page-footer' || host === 'modal-footer') {
      // Lo-fi demos use dismiss for Reset; UI §3.5 wants outline + neutral.
      return { variant: 'dismiss', size, uiColor: 'neutral', uiRank: 'outline' };
    }
    return { variant: 'default', size, uiColor: 'neutral', uiRank: 'outline' };
  }

  // tertiary
  return { variant: 'dismiss', size, uiColor: 'neutral', uiRank: 'ghost' };
}

export function clusterLayout(
  host: ClusterHost,
): 'end' | 'start' | 'split' {
  if (host === 'modal-footer' || host === 'p7-footer' || host === 'workspace-footer' || host === 'page-footer') {
    return 'end';
  }
  return 'start';
}
