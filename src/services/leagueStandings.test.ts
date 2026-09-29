import assert from 'node:assert/strict';
import test from 'node:test';
import { parseLeagueStandings } from './leagueStandings';
import snapshot from '../data/leagueStandingsSnapshot.json';

test('accepts changed school counts and current volleyball and basketball matrices', () => {
  for (const table of snapshot.tables) {
    const rows = parseLeagueStandings(table.matrix, table.sport as 'Soccer' | 'Basketball' | 'Volleyball', table.gender as 'Boys' | 'Girls');
    const lv = rows.find(row => row.team === 'SPH-LV')!;
    assert.ok(lv);
    if (table.sport === 'Volleyball') assert.deepEqual([rows.length, lv.wins, lv.points], [8, 6, 12]);
    if (table.sport === 'Soccer') assert.equal(rows.length, table.gender === 'Boys' ? 6 : 7);
  }
});

test('recovers a missing reciprocal result while rejecting a malformed matrix', () => {
  const matrix = [['Standings'], ['', 'SPH-LV', 'BSJ', 'Points'], ['SPH-LV', '', '2-0', '2'], ['BSJ', '', '', '0']];
  const rows = parseLeagueStandings(matrix, 'Volleyball', 'Boys');
  assert.equal(rows[1].losses, 1);
  assert.equal(rows[1].againstValue, 2);
  matrix[1][2] = 'SPH-LV';
  assert.throws(() => parseLeagueStandings(matrix, 'Volleyball', 'Boys'), /header/);
});
