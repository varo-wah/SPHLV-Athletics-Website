import assert from 'node:assert/strict';
import test from 'node:test';
import { RESULT_SHEET_SOURCES } from '../config/sheets';
import { OCTOBER_26_UPDATES } from '../data/october26Updates';
import { mergeGameDayResults } from './gamedayResults';

test('the four JAAC playoff results retain distinct identities and only confirmed match dates', () => {
  const matches = mergeGameDayResults([], RESULT_SHEET_SOURCES, OCTOBER_26_UPDATES);
  assert.equal(matches.length, 4);
  assert.equal(new Set(matches.map(match => match.reviewedFixtureId)).size, 4);
  assert.deepEqual(matches.map(match => [match.teamId, match.date, match.reportedDate, match.scoreFor, match.scoreAgainst]), [
    ['basketball-smp-boys', '2026-10-24', '2026-10-24', 49, 29],
    ['basketball-smp-boys', '2026-10-24', '2026-10-24', 69, 27],
    ['basketball-smp-girls', '', '2026-10-24', 36, 15],
    ['basketball-smp-girls', '', '2026-10-24', 47, 22],
  ]);
  assert.ok(matches.every(match => match.tournament === 'JAAC' && match.status === 'Finished' && match.result === 'W'));
  assert.ok(matches.every(match => match.time === '' && match.venue === '' && match.locationType === 'TBD'));
  assert.deepEqual(mergeGameDayResults(matches, RESULT_SHEET_SOURCES, OCTOBER_26_UPDATES), matches);
  assert.ok(matches[3].statLeaders?.includes('Hillary & London — 2/3 three-pointers (67%)'));
});

test('JAAC playoff additions preserve the earlier BSJ result and Cup finals across refreshes', () => {
  const matches = mergeGameDayResults([], RESULT_SHEET_SOURCES);
  const boysBsj = matches.filter(match => match.teamId === 'basketball-smp-boys' && match.opponent === 'BSJ');
  assert.deepEqual(boysBsj.map(match => [match.date, match.scoreFor, match.scoreAgainst]).sort(), [
    ['2026-09-26', 69, 25], ['2026-10-24', 69, 27],
  ]);
  assert.equal(matches.filter(match => match.matchType === 'SPH Cup final' && match.sportKey === 'Basketball').length, 2);
  assert.equal(matches.filter(match => match.matchType === 'JAAC final').length, 2);
  assert.deepEqual(mergeGameDayResults(matches, RESULT_SHEET_SOURCES), matches);
});
