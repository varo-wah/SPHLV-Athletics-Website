import assert from 'node:assert/strict';
import test from 'node:test';
import type { Standing } from '../services/parsers';
import { formatWinPercentage, rankStandings, standingsRecordLabel, standingsShowDraws } from './standingsPresentation';

function standing(team: string, wins: number, losses: number, overrides: Partial<Standing> = {}): Standing {
  return {
    id: team, pageId: 'basketball-smp-boys', sport: 'Basketball', sportKey: 'Basketball', level: 'SMP',
    genderGroup: 'Boys', tournament: 'Season', rank: null, team, wins, losses, draws: 0,
    points: wins * 2, forValue: 0, againstValue: 0, difference: 0, notes: '', ...overrides,
  };
}

test('a higher winning percentage ranks above more total wins or points', () => {
  const rows = [standing('More games', 5, 2), standing('Unbeaten', 3, 0), standing('One loss', 4, 1)];
  const ranked = rankStandings(rows);
  assert.deepEqual(ranked.map(entry => entry.row.team), ['Unbeaten', 'One loss', 'More games']);
  assert.deepEqual(ranked.map(entry => entry.rank), [1, 2, 3]);
  assert.deepEqual(rows.map(entry => entry.team), ['More games', 'Unbeaten', 'One loss']);
});

test('soccer counts draws as games played and keeps the draw record visible', () => {
  const ranked = rankStandings([
    standing('Drawn twice', 2, 0, { sport: 'Soccer', sportKey: 'Soccer', draws: 2, points: 8 }),
    standing('Won twice', 2, 1, { sport: 'Soccer', sportKey: 'Soccer', points: 6 }),
  ]);
  assert.equal(ranked[0].row.team, 'Won twice');
  assert.equal(ranked[1].gp, 4);
  assert.equal(formatWinPercentage(ranked[1].winPercentage), '50.0%');
  assert.equal(standingsShowDraws('Soccer'), true);
  assert.equal(standingsRecordLabel(2, 2, 0, 'Soccer'), '2W · 2D · 0L');
  for (const sport of ['Basketball', 'Volleyball']) {
    assert.equal(standingsShowDraws(sport), false);
    assert.equal(standingsRecordLabel(2, 0, 1, sport), '2W · 1L');
  }
});

test('equal percentages retain score difference, scores for and wins as tiebreakers', () => {
  const ranked = rankStandings([
    standing('Lower difference', 3, 1, { difference: 10, forValue: 150 }),
    standing('More scores', 3, 1, { difference: 20, forValue: 100 }),
    standing('Fewer scores', 3, 1, { difference: 20, forValue: 80 }),
    standing('More wins', 6, 2, { difference: 20, forValue: 100 }),
  ]);
  assert.deepEqual(ranked.map(entry => entry.row.team), ['More wins', 'More scores', 'Fewer scores', 'Lower difference']);
  assert.ok(ranked.every(entry => !entry.isTied));
});

test('only equal competitive records share ranks; unplayed teams have no percentage', () => {
  const ranked = rankStandings([
    standing('Unplayed B', 0, 0), standing('Tied B', 1, 1),
    standing('Unplayed A', 0, 0), standing('Lost', 0, 1), standing('Tied A', 1, 1),
  ]);
  assert.deepEqual(ranked.map(entry => [entry.row.team, entry.rank, entry.isTied]), [
    ['Tied A', 1, true], ['Tied B', 1, true], ['Lost', 3, false], ['Unplayed A', 4, true], ['Unplayed B', 4, true],
  ]);
  assert.equal(formatWinPercentage(ranked[2].winPercentage), '0.0%');
  assert.equal(formatWinPercentage(ranked[3].winPercentage), '—');
});
