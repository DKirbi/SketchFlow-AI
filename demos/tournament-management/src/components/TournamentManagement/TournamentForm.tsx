import {
  LOFIFieldset,
  LOFIField,
  LOFIInput,
  LOFIRadio,
  LOFISelect,
  LOFISwitch,
  LOFIText,
} from 'lofi-kit';

import { SPORTS, categoriesForSport, monitoringForCategory, uniqueTournamentsForCategory } from '../../data/catalog';
import { CURRENCY_OPTIONS, TENNIS_BEST_OF_OPTIONS, TENNIS_PLAYER_COUNT_OPTIONS, TENNIS_SURFACE_OPTIONS } from '../../data/tennisOptions';
import type { ModalMode } from '../../types';
import type { TournamentFormSnapshot } from '../../types';
import { CRICKET_MATCH_TYPES, cricketDefaultsForType } from '../../lib/cricketDefaults';
import { briefSportKeyForSnapshot } from '../../lib/tournamentFormMappers';
import { cricketDaysVisible } from '../../lib/modalValidate';
import { TIMEZONES } from '../../data/timezones';
import { VENUES } from '../../data/venues';

export interface TournamentFormProps {
  mode: ModalMode;
  snapshot: TournamentFormSnapshot;
  onChange: (next: TournamentFormSnapshot) => void;
  errors: Partial<Record<string, string>>;
  onBlurName?: () => void;
}

export function TournamentForm({
  mode,
  snapshot,
  onChange,
  errors,
  onBlurName,
}: TournamentFormProps) {
  const sportKey = briefSportKeyForSnapshot(snapshot);

  const showClassification = mode !== 'edit';

  function patch(part: Partial<TournamentFormSnapshot>) {
    onChange({ ...snapshot, ...part });
  }

  function onSportPick(sportId: string) {
    const cats = categoriesForSport(sportId);
    const first = cats[0];
    patch({
      sportId,
      categoryId: first?.id ?? '',
      monitoringCategoryId: first ? pickMonitoring(first.id) : '',
      uniqueTournamentId: '',
    });
  }

  function onCatPick(cid: string) {
    patch({
      categoryId: cid,
      monitoringCategoryId: pickMonitoring(cid),
      uniqueTournamentId: '',
    });
  }

  function pickMonitoring(cid: string): string {
    const m = monitoringForCategory(cid);
    if (m.length === 1) return m[0].id;
    return m[0]?.id ?? '';
  }

  function onCricketMatchType(mt: string) {
    const d = cricketDefaultsForType(mt);
    patch({
      cricketMatchType: mt,
      cricketDaysPlayed: d?.days ?? '',
      cricketOvers: d?.overs ?? '',
      cricketMandatoryPowerplay: d?.powerplay ?? '',
      cricketMaxOversPerBowler: d?.maxBowler ?? '',
      cricketBattingPowerplay: d?.batPp ?? '',
      cricketReviews: d?.reviews ?? '',
    });
  }

  const utc = uniqueTournamentsForCategory(snapshot.categoryId).map((u) => ({
    value: u.id,
    label: u.label,
  }));

  return (
    <div className="tmgmt__modal-form">
      <LOFIText variant="description">
        Modal fields follow Sections 1–3 (always); Section 4 cricket; Section 6 tennis. Brief Section 5 intentionally absent.
      </LOFIText>

      {!showClassification && (
        <LOFIInlineFieldNote>
          Sport and real category stay in the sidebar for existing tournaments — they cannot be edited here per brief.
        </LOFIInlineFieldNote>
      )}

      <LOFIFieldset legend="Section 1 — Sport & classification">
        {showClassification && (
          <>
            <LOFIField label="Sport" htmlFor="f-sport" required>
              <LOFISelect
                id="f-sport"
                value={snapshot.sportId}
                options={SPORTS.map((s) => ({ value: s.id, label: s.label }))}
                onChange={onSportPick}
              />
            </LOFIField>
            <LOFIField label="Category" htmlFor="f-cat" required error={errors.category}>
              <LOFISelect
                id="f-cat"
                value={snapshot.categoryId}
                options={categoriesForSport(snapshot.sportId).map((c) => ({
                  value: c.id,
                  label: c.label,
                }))}
                onChange={(v) => onCatPick(v)}
              />
            </LOFIField>
            <LOFIField
              label="Monitoring category"
              htmlFor="f-mon"
              required
              error={errors.monitoring}
            >
              <LOFISelect
                disabled={mode === 'edit'}
                id="f-mon"
                value={snapshot.monitoringCategoryId}
                options={monitoringForCategory(snapshot.categoryId).map((m) => ({
                  value: m.id,
                  label: m.label,
                }))}
                onChange={(v) => patch({ monitoringCategoryId: v })}
              />
            </LOFIField>
            <LOFIField label="Unique tournament" hint="Optional — cross-season grouping.">
              <LOFISelect
                allowClear
                placeholder="None"
                id="f-ut"
                value={snapshot.uniqueTournamentId}
                options={utc}
                onChange={(v) => patch({ uniqueTournamentId: v })}
              />
            </LOFIField>
          </>
        )}
        {!showClassification && (
          <LOFIField label="Monitoring category" hint="Shown read-only while editing." htmlFor="f-mon-ro">
            <LOFISelect
              disabled
              id="f-mon-ro"
              value={snapshot.monitoringCategoryId}
              options={monitoringForCategory(snapshot.categoryId).map((m) => ({
                value: m.id,
                label: m.label,
              }))}
              onChange={() => {}}
            />
          </LOFIField>
        )}
      </LOFIFieldset>

      <LOFIFieldset legend="Section 2 — Basic information">
        <LOFIField label="Name" htmlFor="f-name" required error={errors.name}>
          <LOFIInput
            id="f-name"
            value={snapshot.name}
            onBlur={() => onBlurName?.()}
            onChange={(v) => patch({ name: v })}
          />
        </LOFIField>
        <div className="tmgmt__form-row">
          <LOFIField label="Visible from" htmlFor="f-vf">
            <LOFIInput
              id="f-vf"
              type="datetime-local"
              value={snapshot.startTime}
              allowClear
              onChange={(v) => patch({ startTime: v })}
            />
          </LOFIField>
          <LOFIField label="Visible to" htmlFor="f-vt">
            <LOFIInput
              id="f-vt"
              type="datetime-local"
              value={snapshot.endTime}
              allowClear
              onChange={(v) => patch({ endTime: v })}
            />
          </LOFIField>
        </div>
        <LOFIField label="Competition type">
          <LOFIRadio
            name="ctype"
            value={snapshot.competitionType}
            onChange={(v) =>
              patch({ competitionType: v as TournamentFormSnapshot['competitionType'] })
            }
            layout="row"
            options={[
              { value: 'league', label: 'League' },
              { value: 'cup', label: 'Cup' },
              { value: 'neither', label: 'Neither' },
            ]}
          />
        </LOFIField>
        <LOFISwitch
          label="Added to import configuration"
          checked={snapshot.addedToImport}
          onChange={(v) => patch({ addedToImport: v })}
        />
        <LOFISwitch
          label="Visible in scout proposal upload"
          checked={snapshot.scoutProposalVisible}
          onChange={(v) => patch({ scoutProposalVisible: v })}
        />
      </LOFIFieldset>

      <LOFIFieldset legend="Section 3 — Additional information">
        <LOFISwitch
          label="Disabled tournament"
          checked={snapshot.disabled}
          onChange={(v) => patch({ disabled: v })}
        />
        <LOFIField label="Venue" htmlFor="f-venue">
          <LOFISelect
            id="f-venue"
            value={snapshot.venueId}
            placeholder="No venue"
            allowClear
            options={VENUES}
            onChange={(v) => patch({ venueId: v })}
          />
        </LOFIField>
        <LOFISwitch
          label="Reduced stadium attendance"
          checked={snapshot.reducedAttendance}
          onChange={(v) => patch({ reducedAttendance: v })}
        />
        <LOFIField label="Default timezone" htmlFor="f-tz">
          <LOFISelect
            id="f-tz"
            value={snapshot.defaultTimezone}
            options={TIMEZONES}
            onChange={(v) => patch({ defaultTimezone: v })}
          />
        </LOFIField>
        <div className="tmgmt__form-row">
          <LOFIField label="Prize money" htmlFor="f-pm">
            <LOFIInput
              id="f-pm"
              value={snapshot.prizeMoney}
              inputMode="numeric"
              allowClear
              onChange={(v) => patch({ prizeMoney: v })}
            />
          </LOFIField>
          <LOFIField label="Currency" htmlFor="f-cur">
            <LOFISelect
              id="f-cur"
              value={snapshot.prizeCurrency}
              placeholder="EUR"
              allowClear
              options={CURRENCY_OPTIONS}
              onChange={(v) => patch({ prizeCurrency: v })}
            />
          </LOFIField>
        </div>
        {errors.prizePair && (
          <LOFIText variant="sm" className="tmgmt__field-error-msg">
            {errors.prizePair}
          </LOFIText>
        )}
      </LOFIFieldset>

      {sportKey === 'cricket' && (
        <LOFIFieldset legend="Section 4 — Cricket configuration">
          <LOFIField label="Match type" htmlFor="mtype" required error={errors.cricketMatchType}>
            <LOFISelect id="mtype" value={snapshot.cricketMatchType} options={CRICKET_MATCH_TYPES} onChange={onCricketMatchType} />
          </LOFIField>
          {cricketDaysVisible(snapshot.cricketMatchType) && (
            <LOFIField label="Days played" htmlFor="cdays">
              <LOFIInput
                id="cdays"
                value={snapshot.cricketDaysPlayed}
                onChange={(v) => patch({ cricketDaysPlayed: v })}
              />
            </LOFIField>
          )}
          <div className="tmgmt__form-grid-mini">
            <LOFIField label="Overs" htmlFor="cov">
              <LOFIInput id="cov" value={snapshot.cricketOvers} onChange={(v) => patch({ cricketOvers: v })} />
            </LOFIField>
            <LOFIField label="Mandatory powerplay" htmlFor="cmp">
              <LOFIInput
                id="cmp"
                value={snapshot.cricketMandatoryPowerplay}
                onChange={(v) => patch({ cricketMandatoryPowerplay: v })}
              />
            </LOFIField>
            <LOFIField label="Max overs per bowler" htmlFor="cmob">
              <LOFIInput
                id="cmob"
                value={snapshot.cricketMaxOversPerBowler}
                onChange={(v) => patch({ cricketMaxOversPerBowler: v })}
              />
            </LOFIField>
            <LOFIField label="Batting powerplay" htmlFor="cbp">
              <LOFIInput
                id="cbp"
                value={snapshot.cricketBattingPowerplay}
                onChange={(v) => patch({ cricketBattingPowerplay: v })}
              />
            </LOFIField>
            <LOFIField label="Reviews" htmlFor="crev">
              <LOFIInput
                id="crev"
                value={snapshot.cricketReviews}
                onChange={(v) => patch({ cricketReviews: v })}
              />
            </LOFIField>
          </div>
          {(errors.cricketMp || errors.maxOvers || errors.cricketOvers || errors.cricketDays) && (
            <LOFIText variant="sm" className="tmgmt__field-error-msg">
              {[
                errors.cricketDays,
                errors.cricketMp,
                errors.cricketOvers,
                errors.maxOvers,
              ]
                .filter(Boolean)
                .join(' · ')}
            </LOFIText>
          )}
        </LOFIFieldset>
      )}

      {sportKey === 'tennis' && (
        <LOFIFieldset legend="Section 6 — Tennis / racket-style fields">
          <div className="tmgmt__form-row">
            <LOFIField label="Tennis start" htmlFor="ts">
              <LOFIInput
                id="ts"
                type="datetime-local"
                value={snapshot.tennisStart}
                allowClear
                onChange={(v) => patch({ tennisStart: v })}
              />
            </LOFIField>
            <LOFIField label="Tennis end" htmlFor="te">
              <LOFIInput
                id="te"
                type="datetime-local"
                value={snapshot.tennisEnd}
                allowClear
                onChange={(v) => patch({ tennisEnd: v })}
              />
            </LOFIField>
          </div>
          <LOFIField label="Surface" htmlFor="sf">
            <LOFISelect
              id="sf"
              value={snapshot.tennisSurface}
              options={TENNIS_SURFACE_OPTIONS}
              onChange={(v) => patch({ tennisSurface: v })}
            />
          </LOFIField>
          <LOFIField label="Players (draw)" htmlFor="tp">
            <LOFISelect
              id="tp"
              value={snapshot.tennisNumPlayers}
              options={TENNIS_PLAYER_COUNT_OPTIONS}
              onChange={(v) => patch({ tennisNumPlayers: v })}
            />
          </LOFIField>
          <LOFIField label="Best of" htmlFor="tb">
            <LOFISelect id="tb" value={snapshot.tennisBestOf} options={TENNIS_BEST_OF_OPTIONS} onChange={(v) => patch({ tennisBestOf: v })} />
          </LOFIField>
          <LOFIField label="Qualifying rounds (0–10)" htmlFor="tq" error={errors.tennisQual}>
            <LOFIInput
              id="tq"
              value={snapshot.tennisQualRounds}
              onChange={(v) => patch({ tennisQualRounds: v })}
            />
          </LOFIField>
        </LOFIFieldset>
      )}
    </div>
  );
}

function LOFIInlineFieldNote({ children }: { children: string }) {
  return (
    <div className="tmgmt__callout">
      <LOFIText variant="sm">{children}</LOFIText>
    </div>
  );
}
