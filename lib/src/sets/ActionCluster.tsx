import { LOFIButton, LOFIStatefulButton } from '../ui/index';
import { clusterLayout, resolveActionPresentation } from './actionRole';
import type { ActionClusterConfig, ActionDescriptor, ComponentSetHandlers } from './types';
import './ActionCluster.scss';

export interface ActionClusterProps extends ActionClusterConfig {
  onAction?: ComponentSetHandlers['onAction'];
}

function ActionButton({
  action,
  host,
  onAction,
}: {
  action: ActionDescriptor;
  host: ActionClusterConfig['host'];
  onAction?: ComponentSetHandlers['onAction'];
}) {
  const resolved = resolveActionPresentation(action.role, host, {
    destructive: action.destructive,
  });
  const variant = action.overrides?.variant ?? resolved.variant;
  const size = action.overrides?.size ?? resolved.size;
  const handleClick = () => onAction?.(action.id);

  if (action.stateful) {
    return (
      <LOFIStatefulButton
        state={action.state ?? 'idle'}
        idleLabel={action.label}
        successLabel={action.successLabel ?? action.label}
        loadingLabel={action.loadingLabel}
        variant={variant}
        size={size}
        onClick={action.disabled ? undefined : handleClick}
      />
    );
  }

  return (
    <LOFIButton
      type="button"
      variant={variant}
      size={size}
      disabled={action.disabled}
      onClick={handleClick}
    >
      {action.label}
    </LOFIButton>
  );
}

export function ActionCluster({ host, actions, onAction }: ActionClusterProps) {
  const layout = clusterLayout(host);
  const tertiary = actions.filter((a) => a.role === 'tertiary');
  const rest = actions.filter((a) => a.role !== 'tertiary');
  const useSplit = layout === 'end' && tertiary.length > 0;
  const rootCls = [
    'action-cluster',
    useSplit ? 'action-cluster--split' : `action-cluster--${layout}`,
  ].join(' ');

  const renderGroup = (items: ActionDescriptor[]) =>
    items.map((action) => (
      <ActionButton key={action.id} action={action} host={host} onAction={onAction} />
    ));

  if (useSplit) {
    return (
      <div className={rootCls} data-host={host}>
        <div className="action-cluster__group">{renderGroup(tertiary)}</div>
        <div className="action-cluster__group">{renderGroup(rest)}</div>
      </div>
    );
  }

  return (
    <div className={rootCls} data-host={host}>
      {renderGroup(actions)}
    </div>
  );
}
