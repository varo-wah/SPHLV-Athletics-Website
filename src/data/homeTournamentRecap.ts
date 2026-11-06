import { TEAM_CATALOG } from '../config/teamCatalog';
import type { SheetMatch } from '../services/parsers';
import { ACSC_COMPETITION_RESULTS } from './acscCompetitionResults2026';
import { SWIM_MEDAL_HIGHLIGHT, SWIM_TEAM_FINISH } from './swimmingResults';
import { JAAC_FINAL_RESULTS, NOVEMBER_JAAC_RESULTS } from './novemberJaacResults';

export const HOME_RECAP_START = Date.parse('2026-10-26T00:00:00+07:00');
/** Exclusive end: retain the recap throughout November 16 in Jakarta. */
export const HOME_RECAP_END = Date.parse('2026-11-17T00:00:00+07:00');

export interface RecapEntry {
  teamId: string;
  label: string;
  outcome: string;
  detail: string;
}

export function isHomeRecapVisible(now: number): boolean {
  return now >= HOME_RECAP_START && now < HOME_RECAP_END;
}

function teamLabel(teamId: string): string {
  return TEAM_CATALOG.find(team => team.id === teamId)?.displayName ?? teamId;
}

function placementLabel(rank: number): string {
  if (rank === 1) return 'Champions';
  if (rank === 2) return 'Runner-up';
  const suffix = rank % 100 >= 11 && rank % 100 <= 13
    ? 'th' : ({ 1: 'st', 2: 'nd', 3: 'rd' } as Record<number, string>)[rank % 10] ?? 'th';
  return `${rank}${suffix} place`;
}

/** Reuse the verified tournament records; never substitute pool ranks or posting dates. */
export function getHomeTournamentRecap(matches: readonly SheetMatch[] = []): { jaac: RecapEntry[]; acsc: RecapEntry[] } {
  const boysSoccerSemifinal = NOVEMBER_JAAC_RESULTS.filter(row => row.fixtureId === '2026-boys-soccer-jaac-semifinal');
  const jaac = [...JAAC_FINAL_RESULTS, ...boysSoccerSemifinal].map(reviewed => {
    const published = matches.find(match => match.teamId === reviewed.teamId
      && match.reviewedFixtureId === reviewed.fixtureId && match.status === 'Finished'
      && match.scoreFor !== null && match.scoreAgainst !== null
      && Number.isFinite(match.scoreFor) && Number.isFinite(match.scoreAgainst)
      && match.scoreFor !== match.scoreAgainst);
    const result = published ?? reviewed;
    const semifinal = reviewed.details.matchType === 'JAAC semifinal';
    const won = result.scoreFor! > result.scoreAgainst!;
    const scorer = semifinal ? (published ? published.statLeaders : reviewed.details.statLeaders)?.join(' · ') : undefined;
    return {
      teamId: reviewed.teamId,
      label: teamLabel(reviewed.teamId),
      outcome: semifinal ? (won ? 'Finalist' : 'Semifinalists') : (won ? 'Champions' : 'Runner-up'),
      detail: `${semifinal ? 'Semifinal' : 'Final'}: SPH ${result.scoreFor}–${result.scoreAgainst} ${result.opponent || reviewed.opponent}${scorer ? ' · ' + scorer : ''}`,
    };
  });
  const acsc = ACSC_COMPETITION_RESULTS.flatMap(snapshot => {
    const placement = snapshot.finalPlacements?.find(row => row.school === 'SPH');
    if (!snapshot.complete || !placement) return [];
    return [{
      teamId: snapshot.teamId,
      label: teamLabel(snapshot.teamId),
      outcome: placementLabel(placement.rank),
      detail: (snapshot.awards ?? []).filter(award => award.school === 'SPH')
        .map(award => award.recipient
          ? `${award.label.replace('All-Tournament Team', 'All-Tournament')}: ${award.recipient}`
          : award.label)
        .join(' · '),
    }];
  });
  acsc.push({ teamId: 'swimming', label: 'Varsity Swimming', outcome: placementLabel(SWIM_TEAM_FINISH), detail: SWIM_MEDAL_HIGHLIGHT });
  return { jaac, acsc };
}
