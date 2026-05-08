import type { KeyboardEvent, ReactNode } from 'react';
import { useCallback, useMemo } from 'react';
import { Badge, type BadgeVariant } from '../Badge/Badge';
import { Text } from '../Text/Text';
import './Tabs.scss';

export interface TabItem {
  value: string;
  label: string;
  /** Optional leading affordance (e.g. small SVG or glyph) before the label. */
  icon?: ReactNode;
  /** Shown after the label as `LOFIBadge` when set. */
  badge?: string;
  badgeVariant?: BadgeVariant;
  disabled?: boolean;
}

export interface TabsProps {
  value: string;
  onChange: (value: string) => void;
  tabs: TabItem[];
  ariaLabel?: string;
  className?: string;
}

function enabledIndices(tabItems: TabItem[]): number[] {
  const out: number[] = [];
  for (let i = 0; i < tabItems.length; i++) {
    if (!tabItems[i]?.disabled) out.push(i);
  }
  return out;
}

export function Tabs({ value, onChange, tabs, ariaLabel, className }: TabsProps) {
  const rootCls = ['tabs', className].filter(Boolean).join(' ');
  const enabled = useMemo(() => enabledIndices(tabs), [tabs]);

  const selectedIndex = tabs.findIndex((t) => t.value === value);
  const selectedTab = selectedIndex >= 0 ? tabs[selectedIndex] : undefined;
  const selectedDisabled = Boolean(selectedTab?.disabled);

  const focusIndex = useMemo(() => {
    if (selectedDisabled || selectedIndex < 0) return enabled[0] ?? -1;
    return selectedIndex;
  }, [enabled, selectedDisabled, selectedIndex]);

  const move = useCallback(
    (fromValue: string, delta: number) => {
      if (enabled.length === 0) return;
      const idx = tabs.findIndex((t) => t.value === fromValue);
      let pos = enabled.indexOf(idx);
      if (pos < 0) pos = 0;
      const nextPos = (pos + delta + enabled.length) % enabled.length;
      const nextIdx = enabled[nextPos];
      const nextTab = nextIdx !== undefined ? tabs[nextIdx] : undefined;
      if (nextTab && !nextTab.disabled) onChange(nextTab.value);
    },
    [enabled, onChange, tabs],
  );

  const goFirst = useCallback(() => {
    const i = enabled[0];
    const tab = i !== undefined ? tabs[i] : undefined;
    if (tab && !tab.disabled) onChange(tab.value);
  }, [enabled, onChange, tabs]);

  const goLast = useCallback(() => {
    const i = enabled[enabled.length - 1];
    const tab = i !== undefined ? tabs[i] : undefined;
    if (tab && !tab.disabled) onChange(tab.value);
  }, [enabled, onChange, tabs]);

  const handleTabKeyDown = useCallback(
    (e: KeyboardEvent<HTMLButtonElement>, tabValue: string) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        move(tabValue, 1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        move(tabValue, -1);
      } else if (e.key === 'Home') {
        e.preventDefault();
        goFirst();
      } else if (e.key === 'End') {
        e.preventDefault();
        goLast();
      }
    },
    [goFirst, goLast, move],
  );

  return (
    <div className={rootCls} role="tablist" aria-label={ariaLabel}>
      {tabs.map((tab, i) => {
        const selected = tab.value === value;
        const cls = [
          'tabs__tab',
          selected ? 'tabs__tab--active' : '',
          tab.disabled ? 'tabs__tab--disabled' : '',
        ]
          .filter(Boolean)
          .join(' ');

        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            className={cls}
            aria-selected={selected}
            aria-disabled={tab.disabled || undefined}
            disabled={tab.disabled}
            tabIndex={i === focusIndex ? 0 : -1}
            onClick={() => {
              if (!tab.disabled && !selected) onChange(tab.value);
            }}
            onKeyDown={tab.disabled ? undefined : (e) => handleTabKeyDown(e, tab.value)}
          >
            {tab.icon ? (
              <span className="tabs__tab-icon" aria-hidden>
                {tab.icon}
              </span>
            ) : null}
            <Text as="span" variant="inherit">
              {tab.label}
            </Text>
            {tab.badge != null && tab.badge !== '' ? (
              <Badge label={tab.badge} variant={tab.badgeVariant ?? 'tag'} />
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
