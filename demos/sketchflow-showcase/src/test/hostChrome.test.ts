import { describe, expect, it } from 'vitest';
import { applyHostChromeOffset, HOST_TOP_BAR_PX, hostBarHeightPx } from '../appearance/hostChrome';

describe('host chrome offset', () => {
  it('subtracts the Work top bar only when the hub is iframed', () => {
    expect(HOST_TOP_BAR_PX).toBe(54);
    expect(hostBarHeightPx(false)).toBe(0);
    expect(hostBarHeightPx(true)).toBe(54);
    expect(hostBarHeightPx(false, '?hostBar=54')).toBe(54);
  });

  it('writes host-bar and measured shell-height CSS variables', () => {
    const root = document.createElement('html');
    applyHostChromeOffset(root, true, '', 800);
    expect(root.style.getPropertyValue('--hub-host-bar-height')).toBe('54px');
    expect(root.style.getPropertyValue('--hub-shell-height')).toBe('746px');
    applyHostChromeOffset(root, false, '', 800);
    expect(root.style.getPropertyValue('--hub-host-bar-height')).toBe('0px');
    expect(root.style.getPropertyValue('--hub-shell-height')).toBe('800px');
  });
});
