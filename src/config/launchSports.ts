import { DivisionTab, GenderTab, SportTab } from '../types';
import { SPORT_CATALOG, TEAM_CATALOG, findTeam } from './teamCatalog';

export type ReleaseChannel = 'production' | 'prototype';

const requestedReleaseChannel = import.meta.env.VITE_RELEASE_CHANNEL;

export const RELEASE_CHANNEL: ReleaseChannel = requestedReleaseChannel === 'prototype'
  ? 'prototype'
  : 'production';

export const IS_PROTOTYPE = RELEASE_CHANNEL === 'prototype';
export const LAUNCH_SEASON = 'Season 1';

export const PRODUCTION_TEAM_SPORTS: readonly SportTab[] = SPORT_CATALOG
  .filter((sport) => TEAM_CATALOG.some((team) => team.sport === sport.id && team.production))
  .map((sport) => sport.id);

export interface LaunchTeamSelection {
  sport: SportTab;
  division: DivisionTab;
  gender: GenderTab;
}

export const PRODUCTION_TEAMS: readonly LaunchTeamSelection[] = TEAM_CATALOG
  .filter((team) => team.production)
  .map(({ sport, division, gender }) => ({ sport, division, gender }));

export const PROTOTYPE_TEAM_SPORTS: readonly SportTab[] = SPORT_CATALOG.map((sport) => sport.id);

export const LAUNCH_TEAM_SPORTS: readonly SportTab[] = IS_PROTOTYPE
  ? PROTOTYPE_TEAM_SPORTS
  : PRODUCTION_TEAM_SPORTS;

export function isLaunchTeamSport(sport: SportTab): boolean {
  return LAUNCH_TEAM_SPORTS.includes(sport);
}

export function isLaunchTeamSelection(
  sport: SportTab,
  division: DivisionTab,
  gender: GenderTab,
): boolean {
  const team = findTeam(sport, division, gender);
  if (!team) return false;

  if (IS_PROTOTYPE) return true;

  return team.production;
}

function scheduleTeamMatchesLaunchSelection(teamName: string): boolean {
  const normalized = teamName.toLowerCase();

  return PRODUCTION_TEAMS.some((team) => {
    const sportName = team.sport.toLowerCase();
    const divisionName = team.division === 'SMA' ? 'varsity' : 'smp';
    const genderName = team.gender.toLowerCase();

    return normalized.includes(sportName)
      && normalized.includes(divisionName)
      && normalized.includes(genderName);
  });
}

export function isVisibleScheduleEvent(
  season: string,
  sport: SportTab | 'Swimming' | null,
  teamName: string,
): boolean {
  if (IS_PROTOTYPE) return true;

  return season === LAUNCH_SEASON
    && sport !== null
    && PRODUCTION_TEAM_SPORTS.includes(sport as SportTab)
    && scheduleTeamMatchesLaunchSelection(teamName);
}
