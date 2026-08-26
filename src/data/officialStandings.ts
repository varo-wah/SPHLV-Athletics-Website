import type { Standing } from '../services/parsers';
import type { GenderTab, SheetSport, SportTab } from '../types';

export const OFFICIAL_STANDINGS_SOURCES = {
  Volleyball: 'https://docs.google.com/spreadsheets/d/1CmZD971NC11x7IcoRFCpQTWmvnVMWWGwPUT_J5tHhHQ/edit',
  Soccer: 'https://docs.google.com/spreadsheets/d/1-t0FXJKLwUz7_mO0Vk3A2CvD1vVoJ-u5LkF-rphwOd4/edit',
  Basketball: 'https://docs.google.com/spreadsheets/d/1KfoWlSyuvU9FlW1Gj0aLCI4opBkI6AtWEQFgh8i4-i8/edit',
} as const;

type StandingRecord = {
  team: string;
  wins?: number;
  draws?: number;
  losses?: number;
  points?: number;
  forValue?: number;
  againstValue?: number;
};

const seniorSchools = ['ACG', 'ACS', 'AIS', 'BSJ', 'GJS', 'JIS', 'SPH-KV', 'SPH-LV', 'STL'];
const juniorSchools = ['ACG', 'ACS', 'AIS', 'BSJ', 'GJS', 'SPH-KV', 'SPH-LV', 'STL'];

function table(
  sport: SheetSport,
  sportKey: SportTab,
  level: 'SMA' | 'SMP',
  genderGroup: GenderTab,
  schools: readonly string[],
  records: readonly StandingRecord[],
): Standing[] {
  const results = new Map(records.map((record) => [record.team, record]));

  return schools.map((team, index) => {
    const record = results.get(team);
    const wins = record?.wins ?? 0;
    const draws = record?.draws ?? 0;
    const losses = record?.losses ?? 0;
    const forValue = record?.forValue ?? 0;
    const againstValue = record?.againstValue ?? 0;

    return {
      id: `official-${sportKey}-${level}-${genderGroup}-${team}`.toLowerCase(),
      pageId: `${sportKey}-${level}-${genderGroup}`.toLowerCase(),
      sport,
      sportKey,
      level,
      genderGroup,
      tournament: 'Season',
      rank: index + 1,
      team,
      wins,
      draws,
      losses,
      points: record?.points ?? wins * 3 + draws,
      forValue,
      againstValue,
      difference: forValue - againstValue,
      notes: 'Official 26/27 standings snapshot · verified 2026-08-26',
    };
  });
}

export const OFFICIAL_STANDINGS: Standing[] = [
  ...table('Soccer', 'Soccer', 'SMA', 'Boys', seniorSchools, []),
  ...table('Soccer', 'Soccer', 'SMA', 'Girls', seniorSchools, []),
  ...table('Volleyball', 'Volleyball', 'SMA', 'Boys', seniorSchools, [
    { team: 'SPH-LV', wins: 1, points: 2, forValue: 2, againstValue: 0 },
    { team: 'SPH-KV', losses: 1, points: 0, forValue: 0, againstValue: 2 },
  ]),
  ...table('Volleyball', 'Volleyball', 'SMA', 'Girls', seniorSchools, [
    { team: 'ACG', wins: 2, points: 4, forValue: 4, againstValue: 0 },
    { team: 'BSJ', wins: 1, losses: 1, points: 2, forValue: 2, againstValue: 2 },
    { team: 'SPH-LV', wins: 1, points: 2, forValue: 2, againstValue: 0 },
    { team: 'ACS', losses: 2, points: 0, forValue: 0, againstValue: 4 },
    { team: 'SPH-KV', losses: 1, points: 0, forValue: 0, againstValue: 2 },
  ]),
  ...table('Basketball', 'Basketball', 'SMP', 'Boys', juniorSchools, [
    { team: 'ACS', wins: 1, points: 2, forValue: 45, againstValue: 37 },
    { team: 'SPH-LV', losses: 1, points: 0, forValue: 37, againstValue: 45 },
  ]),
  ...table('Basketball', 'Basketball', 'SMP', 'Girls', juniorSchools, [
    { team: 'SPH-LV', wins: 1, points: 2, forValue: 47, againstValue: 18 },
    { team: 'ACS', losses: 1, points: 0, forValue: 18, againstValue: 47 },
  ]),
];
