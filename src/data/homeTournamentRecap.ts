import { TEAM_CATALOG } from '../config/teamCatalog';
import type { SheetMatch } from '../services/parsers';
import { ACSC_COMPETITION_RESULTS } from './acscCompetitionResults2026';
import { OCTOBER_26_UPDATES } from './october26Updates';

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
  const finalIds = ['2026-boys-basketball-jaac-final', '2026-girls-basketball-jaac-final'];
  const jaac = finalIds.flatMap(fixtureId => {
    const reviewed = OCTOBER_26_UPDATES.find(update => update.fixtureId === fixtureId);
    if (!reviewed) return [];
    const published = matches.find(match => match.teamId === reviewed.teamId
      && match.reviewedFixtureId === fixtureId && match.status === 'Finished'
      && match.scoreFor !== null && match.scoreAgainst !== null
      && Number.isFinite(match.scoreFor) && Number.isFinite(match.scoreAgainst)
      && match.scoreFor !== match.scoreAgainst);
    const final = published ?? reviewed;
    return [{
      teamId: reviewed.teamId,
      label: teamLabel(reviewed.teamId),
      outcome: final.scoreFor! > final.scoreAgainst! ? 'Champions' : 'Runner-up',
      detail: `Final: SPH ${final.scoreFor}–${final.scoreAgainst} ${final.opponent || reviewed.opponent}`,
    }];
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
  return { jaac, acsc };
}
