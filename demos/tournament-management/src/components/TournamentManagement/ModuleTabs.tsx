import { LOFITabs, LOFIText } from 'lofi-kit';

export function ModuleTabs() {
  return (
    <div className="tmgmt__module-tabs">
      <LOFIText variant="micro" className="tmgmt__module-tabs-label">
        Module
      </LOFIText>
      <LOFITabs
        ariaLabel="Module"
        value="tournaments"
        onChange={() => {}}
        tabs={[{ value: 'tournaments', label: 'Tournaments' }]}
      />
    </div>
  );
}
