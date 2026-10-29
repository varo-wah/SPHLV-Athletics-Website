import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import AcscCompetitionPanel from '../components/AcscCompetitionPanel';
import { RESULT_SHEET_SOURCES } from '../config/sheets';
import { ACSC_SOCCER_RESULTS } from '../data/acscSoccerResults2026';
import { acscGameDayUpdates } from './acscResults';
import { mergeGameDayResults } from './gamedayResults';

test('reported soccer totals preserve Mark’s six names and leave unreported statistics unknown', () => {
  const stats = ACSC_SOCCER_RESULTS.playerStats!;
  assert.equal(stats.reportedAt, '2026-10-26T19:14:00+07:00');
  assert.deepEqual(stats.players, [
    { name: 'Troy Biantoro', goals: 4 },
    { name: 'Tobin Soelystio', goals: 1 },
    { name: 'Kenzo Stanley', goals: 2 },
    { name: 'Ben Yulianto', goals: 1 },
    { name: 'Yusang Chon', goals: 1, assists: 2 },
    { name: 'Deven', assists: 1 },
  ]);
  assert.equal(stats.players.reduce((total, player) => total + (player.goals ?? 0), 0), 9);
  assert.equal(stats.players.reduce((total, player) => total + (player.assists ?? 0), 0), 3);
});

test('tournament totals never add fixtures or inflate existing match scores and stat leaders', () => {
  const { playerStats: _totals, ...withoutTotals } = ACSC_SOCCER_RESULTS;
  const withTotals = acscGameDayUpdates([ACSC_SOCCER_RESULTS]);
  const baseline = acscGameDayUpdates([withoutTotals]);
  assert.deepEqual(withTotals, baseline);
  assert.equal(withTotals.length, 6);
  assert.equal(withTotals.reduce((total, match) => total + match.scoreFor, 0), 9);
  assert.deepEqual(withTotals.flatMap(match => match.details?.statLeaders ?? []), [
    'Troy — 2 goals', 'Tobin — 1 goal', 'Ben — 1 goal', 'Kenzo Stanley — 1 goal',
    'Yusang — 1 goal', 'Kenzo — 1 goal (name as reported)',
  ]);
  const merged = mergeGameDayResults([], RESULT_SHEET_SOURCES, withTotals);
  assert.deepEqual(merged, mergeGameDayResults([], RESULT_SHEET_SOURCES, baseline));
  assert.equal(merged.length, 6);
  assert.deepEqual(mergeGameDayResults(merged, RESULT_SHEET_SOURCES, withTotals), merged);
});

test('the soccer panel shows sourced totals and dashes without adding them to other teams', () => {
  const html = renderToStaticMarkup(createElement(AcscCompetitionPanel, { teamId: 'soccer-sma-boys' }));
  assert.match(html, /Reported ACSC player totals/);
  assert.match(html, /Mark Heil · GameDay Summaries · 26 October 2026/);
  assert.match(html, />Goals<\/th>/);
  assert.match(html, />Assists<\/th>/);
  for (const player of ACSC_SOCCER_RESULTS.playerStats!.players) assert.ok(html.includes(player.name));
  assert.equal((html.match(/aria-label="Not reported">—<\/span>/g) ?? []).length, 5);
  assert.doesNotMatch(html, /Devendra/);
  for (const teamId of ['volleyball-sma-boys', 'volleyball-sma-girls']) {
    const other = renderToStaticMarkup(createElement(AcscCompetitionPanel, { teamId }));
    assert.doesNotMatch(other, /Reported ACSC player totals/);
  }
});
