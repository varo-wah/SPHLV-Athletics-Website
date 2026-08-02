import { SportTab } from '../types';

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

export function isVisibleScheduleEvent(
  season: string,
  sport: SportTab | 'Swimming' | null,
): boolean {
  if (IS_PROTOTYPE) return true;

  return season === LAUNCH_SEASON
    && sport !== null
    && PRODUCTION_TEAM_SPORTS.includes(sport as SportTab);
}
