import { SportTab } from '../types';

export const LAUNCH_SEASON = 'Season 1';

export const LAUNCH_TEAM_SPORTS: readonly SportTab[] = [
  'Soccer',
  'Basketball',
  'Volleyball',
];

export function isLaunchTeamSport(sport: SportTab): boolean {
  return LAUNCH_TEAM_SPORTS.includes(sport);
}
