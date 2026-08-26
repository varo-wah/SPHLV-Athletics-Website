import assert from 'node:assert/strict';
import test from 'node:test';
import { OFFICIAL_STANDINGS } from '../data/officialStandings';

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
