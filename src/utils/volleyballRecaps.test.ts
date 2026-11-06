import assert from 'node:assert/strict';
import test from 'node:test';
import { RESULT_SHEET_SOURCES } from '../config/sheets';
import { acscGameDayUpdates } from '../services/acscResults';
import { mergeGameDayResults } from '../services/gamedayResults';
import { unscoredVolleyballFixtures, volleyballRecap } from './volleyballRecaps';

const team = 'volleyball-sma-boys';
const scored = mergeGameDayResults([], RESULT_SHEET_SOURCES, acscGameDayUpdates()).filter(row => row.teamId === team);
const pool = scored.find(row => row.opponent === 'ICS Bangkok')!;

test('a scored pool game does not hide the same day’s unscored placement game', () => {
  const fixtures = unscoredVolleyballFixtures(team, scored);
  assert.equal(fixtures.length, 3);
  const placement = fixtures.find(match => match.fixtureId === 'acsc-volleyball-boys-2026-consolation')!;
  assert.equal(placement.opponent, pool.opponent);
  assert.equal(placement.date, pool.date);
  const laterReport = { ...pool, reviewedFixtureId: undefined, sourceFixtureId: placement.fixtureId };
  assert.equal(unscoredVolleyballFixtures(team, [...scored, laterReport]).length, 2);
});

test('score-only volleyball results use the current score when no player report is available', () => {
  assert.equal(volleyballRecap({ ...pool, highlights: [], scoreFor: 3, scoreAgainst: 1 }), 'SPH-LV beat ICS Bangkok 3–1.');
  assert.equal(volleyballRecap({ ...pool, highlights: [], scoreFor: null }), undefined);
  assert.equal(volleyballRecap({ ...pool, highlights: [], result: 'D', scoreFor: 2, scoreAgainst: 2 }), 'SPH-LV drew 2–2 with ICS Bangkok.');
  assert.equal(volleyballRecap(pool), pool.highlights?.[0]);
});
