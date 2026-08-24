import { LOFIEmptyState, LOFITabs, LOFIText } from 'lofi-kit';
import type { FilmRecord } from './mockData';
import './FilmRowDetail.scss';

export type FilmDetailTab = 'cast' | 'staff' | 'locations';

export const DEFAULT_FILM_DETAIL_TAB: FilmDetailTab = 'cast';

interface FilmRowDetailProps {
  record: FilmRecord;
  activeTab: FilmDetailTab;
  onTabChange: (tab: FilmDetailTab) => void;
}

const TABS: { value: FilmDetailTab; label: string }[] = [
  { value: 'cast', label: 'Cast' },
  { value: 'staff', label: 'Staff' },
  { value: 'locations', label: 'Filming Locations' },
];

/** Shared expandable-row body for both browse tables — Cast / Staff / Filming Locations. */
export function FilmRowDetail({ record, activeTab, onTabChange }: FilmRowDetailProps) {
  return (
    <div className="film-row-detail">
      <LOFITabs
        value={activeTab}
        onChange={(value) => onTabChange(value as FilmDetailTab)}
        tabs={TABS}
        ariaLabel={`Additional detail for ${record.title}`}
      />
      <div className="film-row-detail__body">
        {activeTab === 'cast' &&
          (record.fullCast && record.fullCast.length > 0 ? (
            <ul className="film-row-detail__list">
              {record.fullCast.map((member) => (
                <li key={`${member.name}-${member.role}`} className="film-row-detail__item">
                  <LOFIText variant="body">{member.name}</LOFIText>
                  <LOFIText variant="muted">{member.role}</LOFIText>
                </li>
              ))}
            </ul>
          ) : (
            <LOFIEmptyState
              variant="no-results"
              title="No extended cast data"
              description="This record doesn't have a full cast list from the crawler yet."
            />
          ))}

        {activeTab === 'staff' &&
          (record.staff && record.staff.length > 0 ? (
            <ul className="film-row-detail__list">
              {record.staff.map((member) => (
                <li key={`${member.name}-${member.role}`} className="film-row-detail__item">
                  <LOFIText variant="body">{member.name}</LOFIText>
                  <LOFIText variant="muted">{member.role}</LOFIText>
                </li>
              ))}
            </ul>
          ) : (
            <LOFIEmptyState
              variant="no-results"
              title="No staff data"
              description="This record doesn't have crawled production staff details yet."
            />
          ))}

        {activeTab === 'locations' &&
          (record.filmingLocations && record.filmingLocations.length > 0 ? (
            <ul className="film-row-detail__list">
              {record.filmingLocations.map((location) => (
                <li key={location} className="film-row-detail__item">
                  <LOFIText variant="body">{location}</LOFIText>
                </li>
              ))}
            </ul>
          ) : (
            <LOFIEmptyState
              variant="no-results"
              title="No filming location data"
              description="This record doesn't have crawled filming location details yet."
            />
          ))}
      </div>
    </div>
  );
}
