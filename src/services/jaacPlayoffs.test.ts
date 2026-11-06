import assert from 'node:assert/strict';
import test from 'node:test';
import { RESULT_SHEET_SOURCES } from '../config/sheets';
import { jaacPlayoffsForTeam } from '../data/jaacPlayoffs2026';
import { mergeGameDayResults } from './gamedayResults';

const results = mergeGameDayResults([], RESULT_SHEET_SOURCES);

test('JAAC brackets keep official other-school fixtures separate from SPH results and pending scores', () => {
  const boys = jaacPlayoffsForTeam('soccer-sma-boys', results);
  assert.equal(boys.filter(match => match.stage === 'Semifinal').length, 2);
  assert.deepEqual(boys.find(match => match.stage === 'Final'), { stage: 'Final', schools: ['GJS', 'BSJ'], scores: null });
  assert.equal(boys.find(match => match.schools.includes('GJS') && match.stage === 'Semifinal')?.date, undefined);
  const volleyball = jaacPlayoffsForTeam('volleyball-sma-boys', results);
  assert.equal(volleyball.length, 4);
  assert.deepEqual(volleyball.find(match => match.stage === 'Third place')?.scores, [2, 1]);
  assert.deepEqual(volleyball.find(match => match.stage === 'Final')?.scores, [0, 3]);
});

test('brackets include only reported stages and never substitute report dates for match dates', () => {
  const girlsVolleyball = jaacPlayoffsForTeam('volleyball-sma-girls', results);
  assert.deepEqual(girlsVolleyball.map(game => game.stage), ['Semifinal']);
  const girlsSoccer = jaacPlayoffsForTeam('soccer-sma-girls', results);
  assert.equal(girlsSoccer.filter(match => match.stage === 'Semifinal').length, 2);
  assert.deepEqual(girlsSoccer.find(match => match.stage === 'Final')?.scores, [2, 1]);
  const basketball = jaacPlayoffsForTeam('basketball-smp-girls', results);
  assert.equal(basketball.length, 2);
  assert.ok(basketball.every(game => game.date === undefined));
});
