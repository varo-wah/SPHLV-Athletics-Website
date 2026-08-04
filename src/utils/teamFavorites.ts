import { DivisionTab, GenderTab, SportTab } from '../types';
import { findTeam } from '../config/teamCatalog';

export interface FavoriteTeam {
  key: string;
  sport: SportTab;
  division: DivisionTab;
  gender: GenderTab;
}

export function getTeamFavoriteKey(sport: SportTab, division: DivisionTab, gender: GenderTab) {
  return `${sport}-${division}-${gender}`;
}

export function getTeamFavoriteLabel({ sport, division, gender }: Omit<FavoriteTeam, 'key'>) {
  const team = findTeam(sport, division, gender);
  if (team) return team.displayName;

  const sportLabel = sport === 'TrackAndField' ? 'Track & Field' : sport;
  const divisionLabel = division === 'SMA' ? 'Varsity' : 'SMP';
  return `${divisionLabel} ${gender} ${sportLabel}`;
}
