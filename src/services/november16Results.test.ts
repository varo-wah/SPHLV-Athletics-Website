import assert from 'node:assert/strict';
import test from 'node:test';
import { REVIEWED_RESULT_SOURCES } from '../config/sheets';
import { mergeGameDayResults } from './gamedayResults';
import { reviewedSchedule } from './reviewedSchedule';

test('new basketball result survives refresh without a remote sheet or invented game date', () => {
  const results = mergeGameDayResults([], REVIEWED_RESULT_SOURCES);
  const basketball = results.filter(match => match.teamId === 'basketball-sma-boys');
  assert.equal(basketball.length, 1);
  assert.deepEqual([basketball[0].scoreFor, basketball[0].scoreAgainst, basketball[0].result], [54, 55, 'L']);
  assert.equal(basketball[0].date, '');
  assert.equal(basketball[0].reportedDate, '2026-11-15');
  assert.equal(basketball[0].locationType, 'TBD');
  assert.match(basketball[0].highlights![0], /16–4 run/);
  assert.deepEqual(mergeGameDayResults(results, REVIEWED_RESULT_SOURCES), results);
  assert.equal(reviewedSchedule([]).some(event => event.opponent === 'SPH Lippo Cikarang'), false);
});

test('girls JAAC championship uses the official game date and the reported sets and leaders', () => {
  const final = mergeGameDayResults([], REVIEWED_RESULT_SOURCES)
    .find(match => match.reviewedFixtureId === '2026-girls-volleyball-jaac-final')!;
  assert.equal(final.date, '2026-11-06');
  assert.equal(final.reportedDate, '2026-11-08');
  assert.deepEqual(final.setScores, ['25–21', '25–8', '25–11']);
  assert.equal(final.result, 'W');
  const once = reviewedSchedule([]);
  for (const events of [once, reviewedSchedule(once)]) {
    const games = events.filter(event => event.team === 'Varsity Girls Volleyball' && event.date === final.date && event.opponent === 'JIS');
    assert.equal(games.length, 1);
    assert.equal(games[0].status, 'Finished');
    assert.equal(games[0].time, '16:30');
    assert.equal(games[0].resultScore, '3–0');
  }
});
