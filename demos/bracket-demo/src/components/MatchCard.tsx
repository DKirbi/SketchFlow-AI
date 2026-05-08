import { LOFIButton, LOFIText } from 'lofi-kit';
import { useTournamentStore } from '../store/useTournamentStore';
import { getMatchDisplayId } from '../lib/matchDisplay';
import type { Match, Team } from '../types';

interface Props {
  /** ID of the bracket that owns this match — used when dispatching status/winner updates to the store. */
  bracketId: string;
  /** The match to display. All optional fields (score, venue, scheduledAt, etc.) render conditionally. */
  match: Match;
}

const STATUS_LABEL: Record<string, string> = {
  SCHEDULED: 'UPCOMING',
  LIVE: 'LIVE',
  FINISHED: 'COMPLETED',
};

function formatDateAndTime(iso: string): { date: string; time: string } | null {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  const y = d.getFullYear();
  const mo = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const h = String(d.getHours()).padStart(2, '0');
  const mi = String(d.getMinutes()).padStart(2, '0');
  return { date: `${y}/${mo}/${day}`, time: `${h}:${mi}` };
}

export function MatchCard({ bracketId, match }: Props) {
  const advanceMatchStatus = useTournamentStore((s) => s.advanceMatchStatus);
  const setWinner = useTournamentStore((s) => s.setWinner);

  const isBye = match.isBye;
  const short = match.shortLabel?.trim() || 'Match';
  const titleFull = match.matchTitleFull?.trim() || short;

  function seededName(team: Team | null, placeholder: string | undefined, fallback: string): string {
    if (!team) return placeholder ?? fallback;
    return team.seed != null ? `[${team.seed}] ${team.name}` : team.name;
  }

  const teamAName = seededName(match.teamA, match.teamAPlaceholder, 'TBD');
  const teamBName = isBye ? 'BYE' : seededName(match.teamB, match.teamBPlaceholder, 'TBD');
  const displayId = getMatchDisplayId(match);

  const venueTrimmed = match.venueName?.trim() ?? '';
  const courtTrimmed = match.courtName?.trim() ?? '';
  const scoreTrimmed = match.score?.trim() ?? '';
  const dateTime = match.scheduledAt ? formatDateAndTime(match.scheduledAt) : null;
  const showWhenBar = Boolean(dateTime) || match.week != null;

  const footerRight =
    match.status === 'FINISHED' && match.winner
      ? match.winner.name
      : 'TBD';

  function handleSetWinner(team: Team) {
    setWinner(bracketId, match.id, team);
  }

  const isFinished = match.status === 'FINISHED';

  return (
    <div className={`match-card-b ${isBye ? 'match-card-b--bye' : ''} ${isFinished ? 'match-card-b--finished' : 'match-card-b--pending'}`}>
      {showWhenBar && (
        <div className="match-card-b__when">
          <div className="match-card-b__when-left">
            {dateTime && (
              <>
                <span className="match-card-b__when-dt">
                  <LOFIText as="span" variant="inherit" className="match-card-b__side">Date:</LOFIText>
                  <span className="match-card-b__when-value">{dateTime.date}</span>
                </span>
                <span className="match-card-b__when-dt">
                  <LOFIText as="span" variant="inherit" className="match-card-b__side">Time:</LOFIText>
                  <span className="match-card-b__when-value">{dateTime.time}</span>
                </span>
              </>
            )}
            {match.week != null && (
              <span className="match-card-b__when-dt">
                <LOFIText as="span" variant="inherit" className="match-card-b__side">Week:</LOFIText>
                <span className="match-card-b__when-value">{match.week}</span>
              </span>
            )}
          </div>
        </div>
      )}

      <div className="match-card-b__header">
        <span className="match-card-b__code" title={titleFull}>
          <span className="match-card-b__code-full">{titleFull}</span>
          <span className="match-card-b__code-short">{short}</span>
        </span>
        {isBye ? (
          <span className="match-card-b__badge match-card-b__badge--neutral">
            <LOFIText as="span" variant="inherit">BYE</LOFIText>
          </span>
        ) : (
          <LOFIButton
            type="button"
            variant="default"
            className={`match-card-b__badge match-card-b__badge--click status-b-${match.status.toLowerCase()}`}
            onClick={() => advanceMatchStatus(bracketId, match.id)}
            title="Click to advance status"
          >
            {STATUS_LABEL[match.status]}
          </LOFIButton>
        )}
      </div>

      {(venueTrimmed || courtTrimmed) && (
        <div className="match-card-b__venue">
          {venueTrimmed && <span className="match-card-b__venue-name">{venueTrimmed}</span>}
          {courtTrimmed && <span className="match-card-b__venue-court">{courtTrimmed}</span>}
        </div>
      )}

      <div className="match-card-b__row">
        <LOFIText as="span" variant="inherit" className="match-card-b__side">HOME</LOFIText>
        <span
          className={[
            'match-card-b__team',
            match.winner?.id === match.teamA?.id ? 'match-card-b__team--winner' : '',
          ].join(' ')}
        >
          {teamAName}
        </span>
        {match.winner?.id === match.teamA?.id && scoreTrimmed && (
          <span
            className="match-card-b__score-icon"
            aria-label={`Score: ${scoreTrimmed}`}
          />
        )}
      </div>

      {!isBye && (
        <div className="match-card-b__row">
          <LOFIText as="span" variant="inherit" className="match-card-b__side">AWAY</LOFIText>
          <span
            className={[
              'match-card-b__team',
              match.winner?.id === match.teamB?.id ? 'match-card-b__team--winner' : '',
            ].join(' ')}
          >
            {teamBName}
          </span>
          {match.winner?.id === match.teamB?.id && scoreTrimmed && (
            <span
              className="match-card-b__score-icon"
              aria-label={`Score: ${scoreTrimmed}`}
            />
          )}
        </div>
      )}

      {!isBye && match.status === 'FINISHED' && !match.winner && match.teamA && match.teamB && (
        <div className="match-card-b__winners">
          <LOFIText as="span" variant="inherit" className="match-card-b__win-label">Set winner:</LOFIText>
          <LOFIButton type="button" variant="default" className="match-card-b__win-btn" onClick={() => handleSetWinner(match.teamA!)}>
            {match.teamA.name}
          </LOFIButton>
          <LOFIButton type="button" variant="default" className="match-card-b__win-btn" onClick={() => handleSetWinner(match.teamB!)}>
            {match.teamB.name}
          </LOFIButton>
        </div>
      )}

      <div className="match-card-b__footer">
        <span className="match-card-b__id">{displayId}</span>
        <span className="match-card-b__meta">{footerRight}</span>
      </div>
    </div>
  );
}
