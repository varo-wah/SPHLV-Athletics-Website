import assert from 'node:assert/strict';
import test from 'node:test';
import { rankStandings } from '../utils/standingsPresentation';
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
  assert.equal(OFFICIAL_STANDINGS.filter((standing) => standing.sportKey === 'Soccer').length, 13);
  assert.equal(OFFICIAL_STANDINGS.filter((standing) => standing.sportKey === 'Volleyball').length, 16);
  assert.equal(OFFICIAL_STANDINGS.filter((standing) => standing.sportKey === 'Basketball').length, 14);
});

test('matches the verified 26/27 workbook results', () => {
  assert.deepEqual(
    { wins: row('Volleyball', 'Girls', 'ACG')?.wins, points: row('Volleyball', 'Girls', 'ACG')?.points },
    { wins: 5, points: 10 },
  );
  assert.deepEqual(
    { wins: row('Basketball', 'Girls', 'SPH-LV')?.wins, difference: row('Basketball', 'Girls', 'SPH-LV')?.difference },
    { wins: 6, difference: 189 },
  );
  assert.deepEqual(
    { losses: row('Basketball', 'Boys', 'SPH-LV')?.losses, difference: row('Basketball', 'Boys', 'SPH-LV')?.difference },
    { losses: 1, difference: 238 },
  );
});

test('matches the supplied girls volleyball ladder points', () => {
  assert.deepEqual(
    ['ACG', 'ACS', 'BSJ', 'SPH-KV', 'SPH-LV'].map((team) => ({
      team,
      points: row('Volleyball', 'Girls', team)?.points,
    })),
    [
      { team: 'ACG', points: 10 },
      { team: 'ACS', points: 4 },
      { team: 'BSJ', points: 8 },
      { team: 'SPH-KV', points: 4 },
      { team: 'SPH-LV', points: 14 },
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

test('includes all seven completed LV volleyball matchups in the current ladder', () => {
  const games = officialStandingsLadderFor('Volleyball', 'SMA', 'Girls')!.matchups;
  const lv = games.filter(g => [g.teamA, g.teamB].includes('SPH-LV'));
  assert.equal(lv.length, 7);
  assert.ok(lv.some(g => g.teamA === 'ACG' && g.teamB === 'SPH-LV' && g.scoreA === 1 && g.scoreB === 2));
});


test('uses published playoff seeds for all six regular-season tables', () => {
  const expected: [string, string, string[]][] = [
    ['Volleyball', 'Boys', ['SPH-LV', 'GJS', 'BSJ', 'STL']],
    ['Volleyball', 'Girls', ['SPH-LV', 'JIS', 'ACG', 'BSJ']],
    ['Soccer', 'Boys', ['GJS', 'SPH-LV', 'BSJ', 'STL']],
    ['Soccer', 'Girls', ['BSJ', 'SPH-KV', 'STL', 'SPH-LV']],
    ['Basketball', 'Boys', ['ACS', 'SPH-LV', 'STL', 'BSJ']],
    ['Basketball', 'Girls', ['SPH-LV', 'STL', 'BSJ', 'ACS', 'SPH-KV', 'ACG', 'GJS']],
  ];
  for (const [sport, gender, schools] of expected) {
    const ranked = rankStandings(OFFICIAL_STANDINGS.filter(row => row.sportKey === sport && row.genderGroup === gender));
    assert.deepEqual(ranked.slice(0, schools.length).map(entry => [entry.rank, entry.row.team]),
      schools.map((team, index) => [index + 1, team]), `${sport} ${gender}`);
  }
});

test('counts a forfeit, skips an unplayed dash and preserves official points when match totals differ', () => {
  assert.deepEqual([row('Volleyball', 'Boys', 'STL')?.wins, row('Volleyball', 'Boys', 'STL')?.losses], [4, 3]);
  const acs = row('Basketball', 'Girls', 'ACS')!;
  assert.deepEqual([acs.wins, acs.losses], [2, 3]);
  const jis = row('Volleyball', 'Girls', 'JIS')!;
  assert.deepEqual([jis.wins, jis.losses, jis.points, jis.rank], [6, 1, 10, 2]);
  assert.match(jis.notes, /league lists 10 points/);
});
