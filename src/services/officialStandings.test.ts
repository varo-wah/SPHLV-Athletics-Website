import assert from 'node:assert/strict';
import test from 'node:test';
import {
  OFFICIAL_STANDINGS,
  OFFICIAL_STANDINGS_LADDERS,
  officialStandingsLadderFor,
} from '../data/officialStandings';

function row(sportKey: string, genderGroup: string, team: string) {
  return OFFICIAL_STANDINGS.find((standing) => (
    standing.sportKey === sportKey &&
    standing.genderGroup === genderGroup &&
    standing.team === team
  ));
}

test('contains complete boys and girls tables for all three production sports', () => {
  assert.equal(OFFICIAL_STANDINGS.filter((standing) => standing.sportKey === 'Soccer').length, 18);
  assert.equal(OFFICIAL_STANDINGS.filter((standing) => standing.sportKey === 'Volleyball').length, 18);
  assert.equal(OFFICIAL_STANDINGS.filter((standing) => standing.sportKey === 'Basketball').length, 16);
});

test('matches the verified 26/27 workbook results', () => {
  assert.deepEqual(
    { wins: row('Volleyball', 'Girls', 'ACG')?.wins, points: row('Volleyball', 'Girls', 'ACG')?.points },
    { wins: 2, points: 4 },
  );
  assert.deepEqual(
    { wins: row('Basketball', 'Girls', 'SPH-LV')?.wins, difference: row('Basketball', 'Girls', 'SPH-LV')?.difference },
    { wins: 1, difference: 29 },
  );
  assert.deepEqual(
    { losses: row('Basketball', 'Boys', 'SPH-LV')?.losses, difference: row('Basketball', 'Boys', 'SPH-LV')?.difference },
    { losses: 1, difference: -8 },
  );
});

test('matches the supplied girls volleyball ladder points', () => {
  assert.deepEqual(
    ['ACG', 'ACS', 'BSJ', 'SPH-KV', 'SPH-LV'].map((team) => ({
      team,
      points: row('Volleyball', 'Girls', team)?.points,
    })),
    [
      { team: 'ACG', points: 4 },
      { team: 'ACS', points: 0 },
      { team: 'BSJ', points: 2 },
      { team: 'SPH-KV', points: 0 },
      { team: 'SPH-LV', points: 2 },
    ],
  );
});

test('provides a head-to-head ladder for all six production team pages', () => {
  assert.equal(OFFICIAL_STANDINGS_LADDERS.length, 6);
  assert.ok(officialStandingsLadderFor('Soccer', 'SMA', 'Boys'));
  assert.ok(officialStandingsLadderFor('Soccer', 'SMA', 'Girls'));
  assert.ok(officialStandingsLadderFor('Volleyball', 'SMA', 'Boys'));
  assert.ok(officialStandingsLadderFor('Volleyball', 'SMA', 'Girls'));
  assert.ok(officialStandingsLadderFor('Basketball', 'SMP', 'Boys'));
  assert.ok(officialStandingsLadderFor('Basketball', 'SMP', 'Girls'));
});

test('matches the supplied girls volleyball head-to-head score boxes', () => {
  assert.deepEqual(
    officialStandingsLadderFor('Volleyball', 'SMA', 'Girls')?.matchups,
    [
      { teamA: 'ACG', teamB: 'ACS', scoreA: 2, scoreB: 0 },
      { teamA: 'ACG', teamB: 'BSJ', scoreA: 2, scoreB: 0 },
      { teamA: 'BSJ', teamB: 'ACS', scoreA: 2, scoreB: 0 },
      { teamA: 'SPH-LV', teamB: 'SPH-KV', scoreA: 2, scoreB: 0 },
    ],
  );
});
