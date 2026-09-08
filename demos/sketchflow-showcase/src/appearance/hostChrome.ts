/** Height of the Work page top bar on davorkirbis.com (`h-[54px]`). */
export const HOST_TOP_BAR_PX = 54;

export function hostBarHeightPx(
  isEmbedded: boolean,
  search = typeof window !== 'undefined' ? window.location.search : '',
): number {
  const raw = new URLSearchParams(search).get('hostBar');
  if (raw && /^\d+$/.test(raw)) return Number(raw);
  return isEmbedded ? HOST_TOP_BAR_PX : 0;
}

export function visibleShellHeightPx(
  isEmbedded: boolean,
  search = typeof window !== 'undefined' ? window.location.search : '',
  viewportHeight = typeof window !== 'undefined'
    ? (window.visualViewport?.height ?? window.innerHeight)
    : 0,
): number {
  return Math.max(0, Math.round(viewportHeight - hostBarHeightPx(isEmbedded, search)));
}

/** Size the hub to the visible iframe: viewport minus the host top bar when embedded. */
export function applyHostChromeOffset(
  root: HTMLElement = document.documentElement,
  isEmbedded = typeof window !== 'undefined' && window.parent !== window,
  search = typeof window !== 'undefined' ? window.location.search : '',
  viewportHeight?: number,
): void {
  const bar = hostBarHeightPx(isEmbedded, search);
  const height =
    viewportHeight == null
      ? visibleShellHeightPx(isEmbedded, search)
      : visibleShellHeightPx(isEmbedded, search, viewportHeight);
  root.style.setProperty('--hub-host-bar-height', `${bar}px`);
  root.style.setProperty('--hub-shell-height', `${height}px`);
}

export function startHostChromeOffsetSync(
  root: HTMLElement = document.documentElement,
): () => void {
  const sync = () => applyHostChromeOffset(root);
  sync();
  window.addEventListener('resize', sync);
  window.visualViewport?.addEventListener('resize', sync);
  return () => {
    window.removeEventListener('resize', sync);
    window.visualViewport?.removeEventListener('resize', sync);
  };
}
