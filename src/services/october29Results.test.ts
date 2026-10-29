import assert from 'node:assert/strict';
import test from 'node:test';
import { RESULT_SHEET_SOURCES } from '../config/sheets';
import { OCTOBER_29_UPDATES } from '../data/october29Updates';
import { mergeGameDayResults } from './gamedayResults';

test('October 27 soccer results retain match dates, report dates and confirmed scorers', () => {
  const matches = mergeGameDayResults([], RESULT_SHEET_SOURCES, OCTOBER_29_UPDATES);
  assert.deepEqual(matches.map(match => [match.teamId, match.date, match.reportedDate, match.scoreFor, match.scoreAgainst]), [
    ['soccer-sma-boys', '2026-10-27', '2026-10-28', 3, 0],
    ['soccer-sma-girls', '2026-10-27', '2026-10-27', 3, 2],
  ]);
  assert.ok(matches.every(match => match.status === 'Finished' && match.result === 'W' && match.tournament === 'JAAC'));
  assert.ok(matches.every(match => match.time === '' && match.venue === '' && match.locationType === 'TBD'));
  assert.deepEqual(matches[0].statLeaders, ['Deven — 1 goal', 'Solomon Schleper — 1 goal', 'Ben Yulianto — 1 goal (penalty)']);
  assert.deepEqual(matches[1].statLeaders, ['Sherny Lim — 2 goals', 'Grace Priskila Nawipa — 1 goal']);
  assert.equal(matches[0].penalties, undefined, 'an in-game penalty goal is not a shootout');
  assert.deepEqual(mergeGameDayResults(matches, RESULT_SHEET_SOURCES, OCTOBER_29_UPDATES), matches);
});

test('October soccer updates preserve earlier opponents and reconcile published aliases without duplication', () => {
  const matches = mergeGameDayResults([], RESULT_SHEET_SOURCES);
  const girlsBsj = matches.filter(match => match.teamId === 'soccer-sma-girls' && match.opponent === 'BSJ');
  assert.deepEqual(girlsBsj.map(match => [match.date, match.scoreFor, match.scoreAgainst]).sort(), [
    ['2026-10-02', 0, 2], ['2026-10-27', 3, 2],
  ]);
  const boys = matches.find(match => match.reviewedFixtureId === '2026-boys-soccer-jaac-stl-oct27')!;
  const published = { ...boys, id: 'published-oct27-boys', reviewedFixtureId: undefined, opponent: 'Santa Laurensia', time: '16:00', venue: 'Published venue' };
  const merged = mergeGameDayResults([published], RESULT_SHEET_SOURCES, OCTOBER_29_UPDATES);
  assert.equal(merged.length, 2);
  assert.equal(merged[0].id, published.id);
  assert.equal(merged[0].time, '16:00');
  assert.equal(merged[0].venue, 'Published venue');
  assert.deepEqual(mergeGameDayResults(matches, RESULT_SHEET_SOURCES), matches);
});

test('a later published correction keeps its own score and statistics', () => {
  const [reviewed] = mergeGameDayResults([], RESULT_SHEET_SOURCES, OCTOBER_29_UPDATES);
  const corrected = { ...reviewed, scoreFor: 4, homeScore: 4, statLeaders: ['Later confirmed scorers'], highlights: ['Later source correction'] };
  const merged = mergeGameDayResults([corrected], RESULT_SHEET_SOURCES, OCTOBER_29_UPDATES);
  assert.deepEqual(merged[0], corrected);
});
