import { ACSC_SOCCER_RESULTS } from './acscSoccerResults2026';
import { ACSC_GIRLS_VOLLEYBALL_RESULTS } from './acscGirlsVolleyballResults2026';
import { ACSC_BOYS_VOLLEYBALL_RESULTS } from './acscBoysVolleyballResults2026';
import type { AcscCompetitionMatch, AcscCompetitionSnapshot } from './acscCompetitionTypes';

export const ACSC_COMPETITION_RESULTS: AcscCompetitionSnapshot[] = [
  ACSC_SOCCER_RESULTS, ACSC_GIRLS_VOLLEYBALL_RESULTS, ACSC_BOYS_VOLLEYBALL_RESULTS,
];

export function acscResultsForTeam(teamId?: string) {
  return ACSC_COMPETITION_RESULTS.find(snapshot => snapshot.teamId === teamId);
}

export function acscMatchFinished(match: AcscCompetitionMatch): boolean {
  return match.homeScore !== null && match.awayScore !== null;
}
