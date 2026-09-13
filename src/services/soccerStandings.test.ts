import assert from 'node:assert/strict';
import test from 'node:test';
import snapshot from '../data/soccerStandingsSnapshot.json';
import { parseSoccerStandings } from './soccerStandings';

test('reads the official boys matrix including a loss and a 12-goal win', () => {
  const rows = parseSoccerStandings(snapshot.boys, 'Boys');
  const lv = rows.find((row) => row.team === 'SPH-LV')!;
  assert.equal(rows.length, 9);
  assert.deepEqual([lv.wins, lv.draws, lv.losses, lv.points, lv.forValue, lv.againstValue], [1, 0, 1, 3, 12, 3]);
});

test('reads girls wins and the 2-2 draw without double-counting mirrored scores', () => {
  const rows = parseSoccerStandings(snapshot.girls, 'Girls');
  const lv = rows.find((row) => row.team === 'SPH-LV')!;
  assert.deepEqual([lv.wins, lv.draws, lv.losses, lv.points, lv.forValue, lv.againstValue], [2, 1, 0, 7, 11, 2]);
  assert.equal(rows.reduce((sum, row) => sum + row.forValue!, 0), rows.reduce((sum, row) => sum + row.againstValue!, 0));
});

test('rejects unavailable, malformed, and inconsistent source data instead of showing zero standings', () => {
  assert.throws(() => parseSoccerStandings([], 'Boys'), /header/);
  const malformed = structuredClone(snapshot.boys);
  malformed[9][5] = 'postponed';
  assert.throws(() => parseSoccerStandings(malformed, 'Boys'), /Invalid soccer score/);
  const inconsistent = structuredClone(snapshot.boys);
  inconsistent[9][10] = '9';
  assert.throws(() => parseSoccerStandings(inconsistent, 'Boys'), /points disagree/);
});
