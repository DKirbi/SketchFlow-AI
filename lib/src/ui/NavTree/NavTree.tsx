import React from 'react';
import * as Collapsible from '@radix-ui/react-collapsible';
import { Text } from '../Text/Text';
import { LofiChevronDownIcon, LofiChevronRightIcon } from '../Util/LofiRadixIcons';
import './NavTree.scss';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface NavTreeItem {
  /** Unique identifier for this node. */
  id:        string;
  /** Display label. */
  label:     string;
  /**
   * Child items.
   * - Present (even empty array) → branch node (can expand/collapse).
   * - Absent (undefined) → leaf node (selectable, no toggle).
   */
  children?: NavTreeItem[];
}

export interface NavTreeProps {
  /** Full item tree. */
  items:              NavTreeItem[];
  /** `id` of the currently selected leaf. */
  selectedId?:        string;
  /** Called when a leaf is activated (click or Enter/Space). */
  onSelect?:          (id: string) => void;
  /**
   * Controlled set of expanded branch `id`s.
   * Omit to use internal uncontrolled state.
   */
  expandedIds?:       string[];
  /**
   * Called with the full new set of expanded ids when the user toggles a branch.
   * Required when `expandedIds` is provided.
   */
  onExpandChange?:    (ids: string[]) => void;
  /** Extra CSS class on the root element. */
  className?:         string;
}

// ─── Internal helpers ────────────────────────────────────────────────────────

interface BranchProps {
  item:            NavTreeItem;
  selectedId:      string | undefined;
  onSelect:        (id: string) => void;
  isOpen:          boolean;
  onOpenChange:    (open: boolean) => void;
  depth:           number;
  expandedIds:     string[];
  onExpandChange:  (id: string, open: boolean) => void;
}

function Branch({
  item,
  selectedId,
  onSelect,
  isOpen,
  onOpenChange,
  depth,
  expandedIds,
  onExpandChange,
}: BranchProps) {
  return (
    <Collapsible.Root
      open={isOpen}
      onOpenChange={onOpenChange}
      asChild
    >
      <li
        role="treeitem"
        aria-expanded={isOpen}
        className="nav-tree__item"
        style={{ '--nav-tree-depth': depth } as React.CSSProperties}
      >
        <Collapsible.Trigger asChild>
          <button
            type="button"
            className="nav-tree__trigger"
            aria-label={`${isOpen ? 'Collapse' : 'Expand'} ${item.label}`}
          >
            <span className="nav-tree__chevron" aria-hidden="true">
              {isOpen ? <LofiChevronDownIcon size={12} /> : <LofiChevronRightIcon size={12} />}
            </span>
            <Text as="span" variant="inherit" className="nav-tree__label">
              {item.label}
            </Text>
          </button>
        </Collapsible.Trigger>
        <Collapsible.Content asChild>
          <ul role="group" className="nav-tree__group">
            {item.children!.map((child) => (
              <TreeNode
                key={child.id}
                item={child}
                selectedId={selectedId}
                onSelect={onSelect}
                depth={depth + 1}
                expandedIds={expandedIds}
                onOpenChange={onExpandChange}
              />
            ))}
          </ul>
        </Collapsible.Content>
      </li>
    </Collapsible.Root>
  );
}

interface LeafProps {
  item:       NavTreeItem;
  selectedId: string | undefined;
  onSelect:   (id: string) => void;
  depth:      number;
}

function Leaf({ item, selectedId, onSelect, depth }: LeafProps) {
  const isSelected = item.id === selectedId;
  return (
    <li
      role="treeitem"
      aria-selected={isSelected}
      className={[
        'nav-tree__item',
        'nav-tree__item--leaf',
        isSelected ? 'nav-tree__item--selected' : '',
      ].filter(Boolean).join(' ')}
      style={{ '--nav-tree-depth': depth } as React.CSSProperties}
    >
      <button
        type="button"
        className="nav-tree__leaf"
        onClick={() => onSelect(item.id)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelect(item.id);
          }
        }}
      >
        <Text as="span" variant="inherit" className="nav-tree__label">
          {item.label}
        </Text>
      </button>
    </li>
  );
}

// ─── Controlled / uncontrolled expansion ─────────────────────────────────────

interface TreeNodeProps {
  item:          NavTreeItem;
  selectedId:    string | undefined;
  onSelect:      (id: string) => void;
  depth:         number;
  expandedIds?:  string[];
  onOpenChange?: (id: string, open: boolean) => void;
}

function TreeNode({
  item,
  selectedId,
  onSelect,
  depth,
  expandedIds,
  onOpenChange,
}: TreeNodeProps) {
  if (item.children === undefined) {
    return <Leaf item={item} selectedId={selectedId} onSelect={onSelect} depth={depth} />;
  }

  const isOpen = expandedIds ? expandedIds.includes(item.id) : undefined;

  return (
    <Branch
      item={item}
      selectedId={selectedId}
      onSelect={onSelect}
      isOpen={isOpen ?? false}
      onOpenChange={(open) => onOpenChange?.(item.id, open)}
      depth={depth}
      expandedIds={expandedIds ?? []}
      onExpandChange={onOpenChange ?? (() => {})}
    />
  );
}

// ─── Public component ─────────────────────────────────────────────────────────

export function NavTree({
  items,
  selectedId,
  onSelect = () => {},
  expandedIds,
  onExpandChange,
  className,
}: NavTreeProps) {
  const isControlled = expandedIds !== undefined;

  // Uncontrolled internal state — only used when expandedIds is not provided.
  const [internalOpen, setInternalOpen] = React.useState<string[]>([]);

  const openIds   = isControlled ? expandedIds! : internalOpen;

  const handleOpenChange = (id: string, open: boolean) => {
    const next = open
      ? [...openIds, id]
      : openIds.filter((x) => x !== id);

    if (isControlled) {
      onExpandChange?.(next);
    } else {
      setInternalOpen(next);
    }
  };

  const classes = ['nav-tree', className ?? ''].filter(Boolean).join(' ');

  return (
    <ul role="tree" className={classes}>
      {items.map((item) => (
        <TreeNode
          key={item.id}
          item={item}
          selectedId={selectedId}
          onSelect={onSelect}
          depth={0}
          expandedIds={openIds}
          onOpenChange={handleOpenChange}
        />
      ))}
    </ul>
  );
}

