import { DivisionTab, GenderTab, SportTab } from '../types';

export type ReleaseChannel = 'production' | 'prototype';

const requestedReleaseChannel = import.meta.env.VITE_RELEASE_CHANNEL;

export const RELEASE_CHANNEL: ReleaseChannel = requestedReleaseChannel === 'prototype'
  ? 'prototype'
  : 'production';

export const IS_PROTOTYPE = RELEASE_CHANNEL === 'prototype';
export const LAUNCH_SEASON = 'Season 1';

export const PRODUCTION_TEAM_SPORTS: readonly SportTab[] = [
  'Soccer',
  'Volleyball',
  'Basketball',
];

export interface LaunchTeamSelection {
  sport: SportTab;
  division: DivisionTab;
  gender: GenderTab;
}

export const PRODUCTION_TEAMS: readonly LaunchTeamSelection[] = [
  { sport: 'Soccer', division: 'SMA', gender: 'Boys' },
  { sport: 'Soccer', division: 'SMA', gender: 'Girls' },
  { sport: 'Volleyball', division: 'SMA', gender: 'Boys' },
  { sport: 'Volleyball', division: 'SMA', gender: 'Girls' },
  { sport: 'Basketball', division: 'SMP', gender: 'Boys' },
  { sport: 'Basketball', division: 'SMP', gender: 'Girls' },
];

export const PROTOTYPE_TEAM_SPORTS: readonly SportTab[] = [
  'Soccer',
  'Volleyball',
  'Basketball',
  'Badminton',
  'TrackAndField',
];

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
  if (IS_PROTOTYPE) return true;

  return PRODUCTION_TEAMS.some((team) => (
    team.sport === sport
    && team.division === division
    && team.gender === gender
  ));
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
