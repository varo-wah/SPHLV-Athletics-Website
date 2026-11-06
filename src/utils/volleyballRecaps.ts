import { acscMatchFinished, acscResultsForTeam } from '../data/acscCompetitionResults2026';
import { acscSchoolForName } from '../data/acscSchools';
import type { SheetMatch } from '../services/parsers';

/** A verified highlight takes precedence over a recap derived from the final score. */
export function volleyballRecap(match: SheetMatch): string | undefined {
  if (match.sportKey !== 'Volleyball') return;
  if (match.highlights?.[0]) return match.highlights[0];
  const { scoreFor, scoreAgainst, opponent } = match;
  if (scoreFor == null || scoreAgainst == null) return;
  if (scoreFor === scoreAgainst) {
    if (match.result === 'D') return `SPH-LV drew ${scoreFor}–${scoreAgainst} with ${opponent}.`;
    return;
  }
  const won = scoreFor > scoreAgainst;
  const straightSets = Math.min(scoreFor, scoreAgainst) === 0 && Math.max(scoreFor, scoreAgainst) >= 2;
  return `SPH-LV ${won ? 'beat' : 'lost to'} ${opponent} ${scoreFor}–${scoreAgainst}${straightSets ? ' in straight sets' : ''}.`;
}

/** Keep unscored past matches in the recap feed without adding them to standings or win/loss records. */
export function unscoredVolleyballFixtures(teamId: string | undefined, results: SheetMatch[]) {
  const snapshot = acscResultsForTeam(teamId);
  if (!snapshot?.complete || snapshot.sport !== 'Volleyball') return [];
  const fixtures = snapshot.matches.filter(match => match.home === 'SPH' || match.away === 'SPH');
  return fixtures.filter(match => !acscMatchFinished(match)).flatMap(match => {
    const opponentCode = match.home === 'SPH' ? match.away : match.home;
    const opponent = acscSchoolForName(opponentCode)?.shortName ?? opponentCode;
    const sameDayPairings = fixtures.filter(row => row.date === match.date &&
      (row.home === opponentCode || row.away === opponentCode));
    const reported = results.some(row => {
      if (row.teamId !== teamId) return false;
      if ([match.id, match.fixtureId].some(id => id && (row.sourceFixtureId === id || row.reviewedFixtureId === id))) return true;
      if (row.reviewedFixtureId) return false;
      return row.tournament === 'ACSC' && row.date === match.date && acscSchoolForName(row.opponent)?.code === opponentCode
        && (sameDayPairings.length === 1 || (!!match.time && row.time === match.time));
    });
    return reported ? [] : [{ ...match, opponent }];
  });
}
