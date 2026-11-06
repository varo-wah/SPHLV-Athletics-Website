import leagueSnapshot from './leagueStandingsSnapshot.json';
import { parseLeagueMatchups, parseLeagueStandings, type LeagueSport } from '../services/leagueStandings';
import type { Standing } from '../services/parsers';
import type { DivisionTab, GenderTab, SportTab } from '../types';

export const OFFICIAL_STANDINGS_SOURCES = {
  Volleyball: 'https://docs.google.com/spreadsheets/d/1CmZD971NC11x7IcoRFCpQTWmvnVMWWGwPUT_J5tHhHQ/edit',
  Soccer: 'https://docs.google.com/spreadsheets/d/1-t0FXJKLwUz7_mO0Vk3A2CvD1vVoJ-u5LkF-rphwOd4/edit',
  Basketball: 'https://docs.google.com/spreadsheets/d/1KfoWlSyuvU9FlW1Gj0aLCI4opBkI6AtWEQFgh8i4-i8/edit',
} as const;

export function officialStandingsUrlFor(sport: SportTab, gender: GenderTab) {
  const table = leagueSnapshot.tables.find(table => table.sport === sport && table.gender === gender);
  return table ? `https://docs.google.com/spreadsheets/d/${table.source}/edit#gid=${table.gid}` : null;
}

export interface OfficialStandingMatchup {
  teamA: string;
  teamB: string;
  scoreA: number;
  scoreB: number;
}

export interface OfficialStandingsLadder {
  sportKey: SportTab;
  level: DivisionTab;
  genderGroup: GenderTab;
  matchups: readonly OfficialStandingMatchup[];
}

export const OFFICIAL_STANDINGS_VERIFIED_AT = leagueSnapshot.verifiedAt;

export const OFFICIAL_STANDINGS: Standing[] = leagueSnapshot.tables.flatMap(table =>
  parseLeagueStandings(table.matrix, table.sport as LeagueSport, table.gender as 'Boys' | 'Girls'));

export const OFFICIAL_STANDINGS_LADDERS: readonly OfficialStandingsLadder[] = leagueSnapshot.tables.map(table => {
  const matchups = parseLeagueMatchups(table.matrix, table.sport as LeagueSport);
  return { sportKey: table.sport as SportTab, level: table.sport === 'Basketball' ? 'SMP' : 'SMA', genderGroup: table.gender as GenderTab, matchups };
});

export function officialStandingsLadderFor(
  sportKey: SportTab,
  level: DivisionTab,
  genderGroup: GenderTab,
) {
  return OFFICIAL_STANDINGS_LADDERS.find(
    (ladder) =>
      ladder.sportKey === sportKey &&
      ladder.level === level &&
      ladder.genderGroup === genderGroup,
  );
}
